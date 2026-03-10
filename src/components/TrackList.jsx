"use client";
import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause } from 'lucide-react';

export default function TrackList() {
    const { tracks, currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

    if (!tracks.length) {
        return <div className="text-center p-12 text-neutral-400">Loading tracks...</div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-32">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Your Tunes</h2>
            </div>

            <div className="hidden md:grid grid-cols-[16px_1fr_1fr_minmax(120px,1fr)] gap-4 px-4 py-2 text-sm text-neutral-400 font-medium border-b border-neutral-800/80 mb-4 sticky top-16 bg-[#121212]/95 backdrop-blur-md z-10 transition-colors">
                <div className="text-right">#</div>
                <div>Title</div>
                <div>Artist</div>
                <div className="text-right pr-8">Duration</div>
            </div>

            <div className="flex flex-col gap-1 sm:gap-0">
                {tracks.map((track, index) => {
                    const isActive = currentTrack?.id === track.id;

                    return (
                        <div
                            key={track.id}
                            onClick={() => isActive ? togglePlay() : playTrack(index)}
                            className={`group flex items-center gap-4 py-3 px-3 sm:px-4 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'} min-h-[64px]`}
                        >
                            {/* Number or Icon */}
                            <div className="w-6 hidden md:flex items-center justify-end flex-shrink-0 text-neutral-400">
                                {isActive ? (
                                    isPlaying ? <Pause size={16} className="text-green-500" /> : <Play size={16} className="text-green-500" />
                                ) : (
                                    <span className="group-hover:hidden group-focus:hidden text-sm">{index + 1}</span>
                                )}
                                <span className="hidden group-hover:block text-white">
                                    {!isActive && <Play size={16} className="fill-current" />}
                                </span>
                            </div>

                            {/* Title & Cover */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <img src={track.cover_image_url} alt={track.title} className={`w-12 h-12 rounded object-cover shadow-sm ${isActive ? 'shadow-black/50' : ''}`} loading="lazy" />
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className={`font-medium truncate text-base ${isActive ? 'text-green-500' : 'text-white'}`}>{track.title}</span>
                                    <span className="md:hidden text-sm text-neutral-400 truncate">{track.artist}</span>
                                </div>
                            </div>

                            {/* Artist (Desktop) */}
                            <div className="hidden md:block flex-1 truncate text-sm text-neutral-400 group-hover:text-white transition-colors">
                                {track.artist}
                            </div>

                            {/* Duration */}
                            <div className="hidden md:block flex-1 text-right text-sm text-neutral-400 pr-8">
                                {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                            </div>

                            {/* Mobile Play Icon */}
                            <div className="md:hidden text-neutral-400">
                                {isActive ? (isPlaying ? <Pause size={20} className="text-green-500 fill-current" /> : <Play size={20} className="text-green-500 fill-current" />) : <Play size={20} className="fill-current opacity-60" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
