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
    const audioRef = useRef(null);

    useEffect(() => {
        fetch('/data/metadata.json')
            .then(res => res.json())
            .then(data => setTracks(data))
            .catch(err => console.error("Could not load tracks", err));
    }, []);

    const currentTrack = currentTrackIndex >= 0 ? tracks[currentTrackIndex] : null;

    const playTrack = (index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (currentTrackIndex === -1 && tracks.length > 0) {
            playTrack(0);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const nextTrack = () => {
        if (tracks.length === 0) return;
        if (isShuffle) {
            setCurrentTrackIndex(Math.floor(Math.random() * tracks.length));
        } else {
            setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
        }
        setIsPlaying(true);
    };

    const prevTrack = () => {
        if (tracks.length === 0) return;
        setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
        setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
            if (audioRef.current.currentTime >= audioRef.current.duration) {
                nextTrack();
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
                audioRef.current.play().catch(e => console.error("Playback error", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIndex]);

    return (
        <AudioContext.Provider value={{
            tracks,
            currentTrack,
            isPlaying,
            progress,
            duration,
            volume,
            isShuffle,
            playTrack,
            togglePlay,
            nextTrack,
            prevTrack,
            seek,
            changeVolume,
            toggleShuffle: () => setIsShuffle(!isShuffle)
        }}>
            {children}
            {currentTrack && (
                <audio
                    ref={audioRef}
                    src={currentTrack.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                />
            )}
        </AudioContext.Provider>
    );
};
