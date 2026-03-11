import os
import json
import cloudinary
import cloudinary.uploader
import cloudinary.api
from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3
from mutagen.id3 import ID3, APIC
import tempfile

# Configure Cloudinary
# We have your API Key and Secret, just need the Cloud Name to complete the upload
cloudinary.config(
    cloud_name="dyjtv0gg9", 
    api_key="849545819548994", 
    api_secret="UiCrOa8mNtxbAkTCyoUZXx_VYOA",
    secure=True
)

MY_TUNES_DIR = "d:/Anti_gravati/My_tunes/songs"
METADATA_OUTPUT = "d:/Anti_gravati/My_tunes/spotify-clone/public/data/metadata.json"

def scan_and_upload():
    if not os.path.exists(MY_TUNES_DIR):
        print(f"Error: Directory {MY_TUNES_DIR} not found.")
        return

    # Create output directory for metadata if it doesn't exist
    os.makedirs(os.path.dirname(METADATA_OUTPUT), exist_ok=True)
    
    metadata_list = []
    
    mp3_files = []
    for root, dirs, files in os.walk(MY_TUNES_DIR):
        for file in files:
            if file.lower().endswith('.mp3'):
                mp3_files.append(os.path.join(root, file))
    
    # Sort files by modification time (date modified) in ascending order
    mp3_files.sort(key=os.path.getmtime)
    
    print(f"Found {len(mp3_files)} MP3 files. Starting upload...")
    
    for index, file_path in enumerate(mp3_files):
        filename = os.path.basename(file_path)
        print(f"Processing ({index+1}/{len(mp3_files)}): {filename}")
        
        # Read ID3 tags securely
        title = filename
        artist = "Unknown Artist"
        duration = 0
        cover_image_url = "/api/placeholder/400/400"
        try:
            audio = MP3(file_path, ID3=EasyID3)
            if 'title' in audio:
                title = audio['title'][0]
            if 'artist' in audio:
                artist = audio['artist'][0]
            duration = audio.info.length
            
            # Extract cover art
            try:
                tags = ID3(file_path)
                for tag in tags.values():
                    if isinstance(tag, APIC):
                        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_img:
                            tmp_img.write(tag.data)
                            tmp_img_path = tmp_img.name
                        
                        print(f"Found cover art for {title}, uploading...")
                        cover_upload = cloudinary.uploader.upload(
                            tmp_img_path,
                            resource_type="image",
                            folder="my_tunes_covers"
                        )
                        cover_image_url = cover_upload.get("secure_url")
                        os.unlink(tmp_img_path)
                        break
            except Exception as e:
                print(f"Could not read cover art for {filename}: {e}")
                
        except Exception as e:
            print(f"Could not read ID3 for {filename}: {e}")
            
        # Upload to Cloudinary
        try:
            # We use resource_type="video" as required by Cloudinary for audio files
            upload_result = cloudinary.uploader.upload(
                file_path, 
                resource_type="video",
                folder="my_tunes_audio",
                use_filename=True,
                unique_filename=False
            )
            
            secure_url = upload_result.get("secure_url")
            
            metadata_list.append({
                "id": str(index + 1),
                "title": title,
                "artist": artist,
                "url": secure_url,
                "duration": duration,
                "cover_image_url": cover_image_url
            })
            print(f"Successfully uploaded: {title}")
        except Exception as e:
            print(f"Failed to upload {filename}: {e}")
            
    # Write metadata.json
    with open(METADATA_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(metadata_list, f, indent=2)
        
    print(f"Upload complete. Metadata saved to {METADATA_OUTPUT}")

if __name__ == "__main__":
    scan_and_upload()
