"use client";
import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Volume2 } from 'lucide-react';

export default function Player() {
    const {
        currentTrack, isPlaying, togglePlay, nextTrack, prevTrack,
        progress, duration, seek, volume, changeVolume, isShuffle, toggleShuffle
    } = useAudio();

    if (!currentTrack) return null;

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-3 sm:px-6 z-50 text-white shadow-2xl safe-area-pb">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Track Info */}
                <div className="flex items-center w-full md:w-1/3 gap-4">
                    <img src={currentTrack.cover_image_url} alt={currentTrack.title} className="w-14 h-14 rounded-md object-cover flex-shrink-0 bg-neutral-800" />
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-semibold truncate hover:underline cursor-pointer">{currentTrack.title}</h4>
                        <p className="text-xs text-neutral-400 truncate hover:underline cursor-pointer">{currentTrack.artist}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 w-full flex flex-col items-center justify-center max-w-[600px]">
                    <div className="flex items-center gap-6 md:gap-8 mb-2">
                        <button onClick={toggleShuffle} className={`text-neutral-400 hover:text-white transition ${isShuffle ? 'text-green-500 hover:text-green-400' : ''}`}>
                            <Shuffle size={18} />
                        </button>
                        <button onClick={prevTrack} className="text-neutral-300 hover:text-white transition p-2">
                            <SkipBack size={24} className="fill-current" />
                        </button>
                        <button onClick={togglePlay} className="bg-white text-black rounded-full p-2.5 hover:scale-105 transition transform active:scale-95 shadow-md">
                            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current translate-x-0.5" />}
                        </button>
                        <button onClick={nextTrack} className="text-neutral-300 hover:text-white transition p-2">
                            <SkipForward size={24} className="fill-current" />
                        </button>
                    </div>
                    <div className="flex items-center w-full gap-2 text-xs text-neutral-400 font-medium">
                        <span className="w-10 text-right">{formatTime(progress)}</span>
                        <input
                            type="range"
                            className="flex-1 h-1.5 bg-neutral-700 rounded-full appearance-none accent-white cursor-pointer hover:accent-green-500 transition-colors"
                            min={0}
                            max={duration || 100}
                            value={progress}
                            onChange={(e) => seek(Number(e.target.value))}
                        />
                        <span className="w-10">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume - hidden on small screens */}
                <div className="hidden md:flex items-center w-1/3 justify-end gap-3 text-neutral-400">
                    <Volume2 size={20} />
                    <input
                        type="range"
                        className="w-24 h-1.5 bg-neutral-700 rounded-full appearance-none accent-white cursor-pointer hover:accent-green-500"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => changeVolume(Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
}
