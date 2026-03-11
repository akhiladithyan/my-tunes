"use client";
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const [tracks, setTracks] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isShuffle, setIsShuffle] = useState(false);
    const [loopMode, setLoopMode] = useState(0); // 0=Off, 1=All, 2=One
    const [shuffledIndices, setShuffledIndices] = useState([]);
    const [shuffleIndex, setShuffleIndex] = useState(-1);
    const [queue, setQueue] = useState([]);

    const addToQueue = (trackIndex) => {
        setQueue(prev => [...prev, trackIndex]);
    };

    const removeFromQueue = (queueIndex) => {
        setQueue(prev => prev.filter((_, i) => i !== queueIndex));
    };

    const reorderQueue = (oldIndex, newIndex) => {
        setQueue(prev => {
            const newQueue = [...prev];
            const [movedItem] = newQueue.splice(oldIndex, 1);
            newQueue.splice(newIndex, 0, movedItem);
            return newQueue;
        });
    };

    // Manage local cached object URLs
    const [audioSource, setAudioSource] = useState(null);
    const [imageSource, setImageSource] = useState(null);
    const activeAudioUrlRef = useRef(null);
    const activeImageUrlRef = useRef(null);
    const audioRef = useRef(null);

    // Refs to hold the latest closures without causing dependency loops for mediaSession
    const nextTrackRef = useRef(null);
    const prevTrackRef = useRef(null);

    useEffect(() => {
        nextTrackRef.current = nextTrack;
        prevTrackRef.current = prevTrack;
    });

    useEffect(() => {
        fetch('/data/metadata.json')
            .then(res => res.json())
            .then(data => setTracks(data))
            .catch(err => console.error("Could not load tracks", err));
    }, []);

    const currentTrack = currentTrackIndex >= 0 ? tracks[currentTrackIndex] : null;

    const generateShuffleQueue = (startIndex) => {
        if (tracks.length === 0) return;
        const indices = Array.from({ length: tracks.length }, (_, i) => i);
        if (startIndex >= 0 && startIndex < tracks.length) {
            indices.splice(indices.indexOf(startIndex), 1);
        }
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        if (startIndex >= 0 && startIndex < tracks.length) {
            indices.unshift(startIndex);
        }
        setShuffledIndices(indices);
        setShuffleIndex(startIndex >= 0 ? 0 : -1);
    };

    const toggleShuffle = () => {
        setIsShuffle(prev => {
            const nextShuffle = !prev;
            if (nextShuffle) {
                generateShuffleQueue(currentTrackIndex);
            } else {
                setShuffledIndices([]);
                setShuffleIndex(-1);
            }
            return nextShuffle;
        });
    };

    const playTrack = (index) => {
        setCurrentTrackIndex(index);
        if (isShuffle) {
            generateShuffleQueue(index);
        }
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (currentTrackIndex === -1 && tracks.length > 0) {
            playTrack(0);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const nextTrack = (forcePlay = true) => {
        if (tracks.length === 0) return;

        if (queue.length > 0) {
            const nextQIndex = queue[0];
            setQueue(prev => prev.slice(1));
            
            if (isShuffle && shuffledIndices.length > 0) {
                const sIndex = shuffledIndices.indexOf(nextQIndex);
                if (sIndex !== -1) setShuffleIndex(sIndex);
            }
            setCurrentTrackIndex(nextQIndex);
            if (forcePlay) setIsPlaying(true);
            return;
        }

        let isEnd = false;
        if (isShuffle && shuffledIndices.length > 0) {
            let nextSIndex = shuffleIndex + 1;
            if (nextSIndex >= shuffledIndices.length) {
                isEnd = true;
                nextSIndex = 0;
            }
            if (isEnd && loopMode === 0 && !forcePlay) {
                setIsPlaying(false);
                if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
                setProgress(0);
                return;
            }
            setShuffleIndex(nextSIndex);
            setCurrentTrackIndex(shuffledIndices[nextSIndex]);
        } else {
            let nextIndex = currentTrackIndex + 1;
            if (nextIndex >= tracks.length) {
                isEnd = true;
                nextIndex = 0;
            }
            if (isEnd && loopMode === 0 && !forcePlay) {
                setIsPlaying(false);
                if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
                setProgress(0);
                return;
            }
            setCurrentTrackIndex(nextIndex);
        }
        if (forcePlay) setIsPlaying(true);
    };

    const prevTrack = () => {
        if (tracks.length === 0) return;

        if (progress > 3 && audioRef.current) {
            audioRef.current.currentTime = 0;
            return;
        }

        if (isShuffle && shuffledIndices.length > 0) {
            let prevSIndex = shuffleIndex - 1;
            if (prevSIndex < 0) {
                prevSIndex = loopMode === 1 ? shuffledIndices.length - 1 : 0;
            }
            setShuffleIndex(prevSIndex);
            setCurrentTrackIndex(shuffledIndices[prevSIndex]);
        } else {
            let prevIndex = currentTrackIndex - 1;
            if (prevIndex < 0) {
                prevIndex = loopMode === 1 ? tracks.length - 1 : 0;
            }
            setCurrentTrackIndex(prevIndex);
        }
        setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
            if (audioRef.current.currentTime >= audioRef.current.duration && audioRef.current.duration > 0) {
                if (loopMode === 2) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.error("Playback error", e));
                } else {
                    nextTrack(false); // passing false means we respect loopMode bounds
                }
            }
        }
    };

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const changeVolume = (newVolume) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                // adding a small delay or catching promise to ensure audio can play
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.error("Playback error", e));
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, audioSource]); // Keep strictly to audio playback

    // Update document title and native media controls metadata
    useEffect(() => {
        if (currentTrackIndex >= 0 && currentTrackIndex < tracks.length) {
            const track = tracks[currentTrackIndex];
            document.title = `${track.title} - ${track.artist}`;

            if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
                try {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: track.title,
                        artist: track.artist,
                        album: "My_tunes",
                        artwork: [
                            { src: track.cover_image_url, sizes: '512x512', type: 'image/jpeg' }
                        ]
                    });

                    // We re-assign these so they always capture the latest nextTrack/prevTrack closures 
                    // without causing audio loops since they are in a separate effect.
                    navigator.mediaSession.setActionHandler('play', () => {
                        setIsPlaying(true);
                    });
                    navigator.mediaSession.setActionHandler('pause', () => {
                        setIsPlaying(false);
                    });
                    navigator.mediaSession.setActionHandler('previoustrack', () => {
                        if (prevTrackRef.current) prevTrackRef.current(); 
                    });
                    navigator.mediaSession.setActionHandler('nexttrack', () => {
                        if (nextTrackRef.current) nextTrackRef.current(); 
                    });
                } catch (err) {
                    console.log("MediaSession API not fully supported", err);
                }
            }
        }
    }, [currentTrackIndex, tracks]);

    useEffect(() => {
        if (!currentTrack) return;

        let isCancelled = false;

        const loadAndCacheSettings = async () => {
            let finalAudioSource = currentTrack.url;
            let finalImageSource = currentTrack.cover_image_url;

            if ('caches' in window) {
                try {
                    const cache = await caches.open('my-tunes-cache-v1');

                    // Clear out old songs & images from the cache
                    const keys = await cache.keys();
                    for (let request of keys) {
                        if (request.url !== currentTrack.url && request.url !== currentTrack.cover_image_url) {
                            await cache.delete(request);
                        }
                    }

                    // --- AUDIO CACHING ---
                    const audioMatch = await cache.match(currentTrack.url);
                    if (audioMatch) {
                        const blob = await audioMatch.blob();
                        finalAudioSource = URL.createObjectURL(blob);
                    } else {
                        fetch(currentTrack.url).then(res => {
                            if (res.ok) cache.put(currentTrack.url, res.clone());
                        }).catch(e => console.log('Audio cache failed:', e));
                    }

                    // --- IMAGE CACHING ---
                    const imageMatch = await cache.match(currentTrack.cover_image_url);
                    if (imageMatch) {
                        const blob = await imageMatch.blob();
                        finalImageSource = URL.createObjectURL(blob);
                    } else {
                        fetch(currentTrack.cover_image_url).then(res => {
                            if (res.ok) cache.put(currentTrack.cover_image_url, res.clone());
                        }).catch(e => console.log('Image cache failed:', e));
                    }
                } catch (err) {
                    console.log('Cache API issue:', err);
                }
            }

            if (!isCancelled) {
                // Cleanup previous object URLs
                if (activeAudioUrlRef.current) URL.revokeObjectURL(activeAudioUrlRef.current);
                if (activeImageUrlRef.current) URL.revokeObjectURL(activeImageUrlRef.current);
                activeAudioUrlRef.current = null;
                activeImageUrlRef.current = null;

                setAudioSource(finalAudioSource);
                setImageSource(finalImageSource);

                if (finalAudioSource.startsWith('blob:')) activeAudioUrlRef.current = finalAudioSource;
                if (finalImageSource.startsWith('blob:')) activeImageUrlRef.current = finalImageSource;
            }
        };

        loadAndCacheSettings();

        return () => {
            isCancelled = true;
        };
    }, [currentTrack]); // Only depend on currentTrack, so when it changes we fetch/cache

    // Finally, an extreme cleanup for unmount (if it ever unmounts)
    useEffect(() => {
        return () => {
            if (activeAudioUrlRef.current) URL.revokeObjectURL(activeAudioUrlRef.current);
            if (activeImageUrlRef.current) URL.revokeObjectURL(activeImageUrlRef.current);
        };
    }, []);

    const activeTrack = currentTrack ? {
        ...currentTrack,
        url: audioSource || currentTrack.url,
        cover_image_url: imageSource || currentTrack.cover_image_url
    } : null;

    return (
        <AudioContext.Provider value={{
            tracks,
            currentTrack: activeTrack,
            isPlaying,
            progress,
            duration,
            volume,
            isShuffle,
            queue,
            addToQueue,
            removeFromQueue,
            reorderQueue,
            playTrack,
            togglePlay,
            nextTrack,
            prevTrack,
            seek,
            changeVolume,
            toggleShuffle,
            loopMode,
            toggleLoop: () => setLoopMode(prev => (prev + 1) % 3)
        }}>
            {children}
            {currentTrack && audioSource && (
                <audio
                    ref={audioRef}
                    src={audioSource}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                    preload="auto"
                />
            )}
        </AudioContext.Provider>
    );
};
