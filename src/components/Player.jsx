"use client";
import React, { useState, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Volume2, ChevronDown, ChevronLeft, Repeat, Repeat1, ListMusic, X } from 'lucide-react';

export default function Player() {
    const {
        currentTrack, isPlaying, togglePlay, nextTrack, prevTrack,
        progress, duration, seek, volume, changeVolume, isShuffle, toggleShuffle, loopMode, toggleLoop,
        queue, tracks, removeFromQueue, reorderQueue, playTrack: playTrackFromQueue
    } = useAudio();

    const [isExpanded, setIsExpanded] = useState(false);
    const [showQueue, setShowQueue] = useState(false);

    // Automatically close expanded mobile view if we resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsExpanded(false);
                setShowQueue(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle Mobile Native Back Swipes
    useEffect(() => {
        const handlePopState = (e) => {
            if (window.innerWidth >= 1024) return;
            
            const state = e.state;
            if (state?.playerQueue) {
                setShowQueue(true);
                setIsExpanded(true);
            } else if (state?.playerExpanded) {
                setShowQueue(false);
                setIsExpanded(true);
            } else {
                setShowQueue(false);
                setIsExpanded(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleExpandPlayer = () => {
        if (window.innerWidth < 1024 && !isExpanded) {
            setIsExpanded(true);
            window.history.pushState({ ...window.history.state, playerExpanded: true }, '');
        }
    };

    const handleQueueToggle = (e) => {
        e.stopPropagation();
        if (showQueue) {
            window.history.back(); // Triggers popstate to playerExpanded
        } else {
            setShowQueue(true);
            window.history.pushState({ ...window.history.state, playerQueue: true }, '');
        }
    };

    const handleCloseExpanded = (e) => {
        e.stopPropagation();
        window.history.back(); // Triggers popstate closing either queue or player
    };

    if (!currentTrack) return null;

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const progressPercent = duration ? (progress / duration) * 100 : 0;

    return (
        <>
            {/* MINI PLAYER (Mobile) & FULL BOTTOM BAR (Desktop) */}
            <div
                onClick={handleExpandPlayer}
                className={`
                    fixed z-50 text-white shadow-2xl transition overflow-hidden
                    
                    /* Mobile mini player styles */
                    bottom-2 md:bottom-0 left-2 right-2 md:left-0 md:right-0 md:m-4 rounded-md md:rounded-lg bg-[#2a2a2a] md:bg-neutral-900 border border-[#3a3a3a] md:border-neutral-700 cursor-pointer hover:bg-[#333] lg:cursor-auto
                    
                    /* Desktop player styles */
                    lg:bottom-0 lg:left-0 lg:right-0 lg:m-0 lg:rounded-none lg:h-[90px] lg:bg-black lg:border-none lg:hover:bg-black lg:border-t lg:border-[#2a2a2a] lg:flex lg:flex-row lg:items-center lg:px-4 lg:justify-between px-2 sm:px-4 ${isExpanded ? 'hidden lg:flex' : ''}
                `}
            >
                <div className="flex items-center justify-between h-[66px] lg:h-full relative z-10 w-full lg:w-1/3 min-w-0">
                    {/* Track Info */}
                    <div className="flex items-center flex-1 min-w-0 gap-3">
                        <img src={currentTrack.cover_image_url} alt={currentTrack.title} className="w-12 h-12 lg:w-14 lg:h-14 rounded shadow-md object-cover flex-shrink-0" />
                        <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-sm font-semibold truncate text-white hover:underline cursor-pointer">{currentTrack.title}</span>
                            <span className="text-xs text-[#a7a7a7] truncate hover:underline cursor-pointer">{currentTrack.artist}</span>
                        </div>
                        {/* Desktop Like Button */}
                        <button className="hidden lg:flex w-8 h-8 rounded-full items-center justify-center shrink-0 border border-[#a7a7a7] text-[#a7a7a7] hover:border-white hover:text-white transition ml-4">
                            <div className="w-3 h-3 bg-current rounded-full" />
                        </button>
                    </div>

                    {/* Controls - Mobile Mini (Only Play/Pause) */}
                    <div className="flex lg:hidden items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button onClick={togglePlay} className="text-white p-2">
                            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current" />}
                        </button>
                    </div>
                </div>

                {/* DESKTOP CENTER CONTROLS */}
                <div className="hidden lg:flex flex-col items-center justify-center w-1/3 max-w-[722px]">
                    <div className="flex items-center gap-6 mb-2">
                        <button onClick={toggleShuffle} className={`transition ${isShuffle ? 'text-[#1db954] hover:text-[#1ed760]' : 'text-[#a7a7a7] hover:text-white'}`}>
                            <Shuffle size={16} />
                        </button>
                        <button onClick={prevTrack} className="text-[#a7a7a7] hover:text-white transition group">
                            <SkipBack size={16} className="fill-current" />
                        </button>
                        <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition transform active:scale-95 shadow-md">
                            {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current translate-x-0.5" />}
                        </button>
                        <button onClick={nextTrack} className="text-[#a7a7a7] hover:text-white transition group">
                            <SkipForward size={16} className="fill-current" />
                        </button>
                        <button onClick={toggleLoop} className={`transition ${loopMode !== 0 ? 'text-[#1db954] hover:text-[#1ed760]' : 'text-[#a7a7a7] hover:text-white'}`}>
                            {loopMode === 2 ? <Repeat1 size={16} /> : <Repeat size={16} />}
                        </button>
                    </div>
                    <div className="flex items-center w-full gap-2 text-[11px] text-[#a7a7a7] font-medium">
                        <span className="min-w-[40px] text-right">{formatTime(progress)}</span>
                        <div className="relative w-full group flex items-center h-4">
                            <input
                                type="range"
                                className="w-full h-1 bg-[#4d4d4d] rounded-full appearance-none accent-white cursor-pointer group-hover:accent-[#1db954] z-10 relative"
                                min={0}
                                max={duration || 100}
                                value={progress}
                                onChange={(e) => seek(Number(e.target.value))}
                            />
                            <div className="absolute left-0 h-1 bg-white group-hover:bg-[#1db954] rounded-full pointer-events-none" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <span className="min-w-[40px] text-left">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* DESKTOP RIGHT VOLUME & QUEUE */}
                <div className="hidden lg:flex flex-row items-center justify-end w-1/3 gap-4 text-[#a7a7a7] pr-2">
                    <button className="hover:text-white transition" title="Queue">
                        <ListMusic size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Volume2 size={16} className="hover:text-white cursor-pointer transition" />
                        <div className="relative w-24 group flex items-center h-4">
                        <input
                            type="range"
                            className="w-full h-1 bg-[#4d4d4d] rounded-full appearance-none accent-white cursor-pointer group-hover:accent-[#1db954] z-10 relative"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={(e) => changeVolume(Number(e.target.value))}
                        />
                        <div className="absolute left-0 h-1 bg-white group-hover:bg-[#1db954] rounded-full pointer-events-none" style={{ width: `${volume * 100}%` }} />
                    </div>
                </div>
                </div>

                {/* Mini progress bar at the very bottom (Mobile only) */}
                <div className="h-[2px] w-full bg-[#3a3a3a] absolute bottom-0 left-0 z-20 rounded-b-md overflow-hidden lg:hidden">
                    <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progressPercent}%` }} />
                </div>
            </div>

            {/* FULL SCREEN PLAYER (Mobile Only - expanded) */}
            <div className={`lg:hidden fixed inset-0 z-[100] bg-gradient-to-b from-[#2a2a2a] to-[#121212] flex flex-col transition-transform duration-300 ease-out ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-6 pb-2 safe-area-pt">
                    <button onClick={handleCloseExpanded} className="p-2 text-white hover:bg-white/10 rounded-full transition">
                        {showQueue ? <ChevronLeft size={28} /> : <ChevronDown size={28} />}
                    </button>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                        {showQueue ? 'Queue' : 'Now Playing'}
                    </span>
                    <button onClick={handleQueueToggle} className={`p-2 rounded-full transition ${showQueue ? 'text-[#1db954] bg-white/10' : 'text-white hover:bg-white/10'}`}>
                        <ListMusic size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col px-6 pb-8 max-w-lg w-full mx-auto justify-center h-full overflow-hidden">
                    
                    {showQueue ? (
                        <div className="flex-1 overflow-y-auto w-full custom-scrollbar mb-6 flex flex-col pt-4">
                            <h3 className="font-bold text-white text-lg mb-4">Next in queue</h3>
                            {queue.length === 0 ? (
                                <div className="text-sm text-[#a7a7a7] text-center mt-10">
                                    Your queue is empty.
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {queue.map((trackIndex, i) => {
                                        const qTrack = tracks[trackIndex];
                                        if (!qTrack) return null;
                                        return (
                                            <div key={`${trackIndex}-${i}`} className="flex items-center justify-between p-2 bg-[#181818] rounded-md">
                                                <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => playTrackFromQueue(trackIndex)}>
                                                    <img src={qTrack.cover_image_url} alt={qTrack.title} className="w-12 h-12 object-cover rounded shadow-md" />
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-white font-medium truncate">{qTrack.title}</span>
                                                        <span className="text-[#a7a7a7] text-sm truncate">{qTrack.artist}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeFromQueue(i)} className="p-2 text-[#a7a7a7] hover:text-[#ff4444]">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Artwork */}
                            <div className="aspect-square w-full mb-8 relative shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden flex-shrink-0">
                                <img src={currentTrack.cover_image_url} alt={currentTrack.title} className="w-full h-full object-cover" />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col mb-6">
                                <h2 className="text-2xl font-bold text-white truncate mb-1">{currentTrack.title}</h2>
                                <p className="text-lg text-[#a7a7a7] truncate">{currentTrack.artist}</p>
                            </div>
                        </>
                    )}

                    {/* Progress */}
                    <div className="flex flex-col gap-2 mb-6">
                        <div className="relative w-full group flex items-center h-4">
                            <input
                                type="range"
                                className="w-full h-1 bg-[#4d4d4d] rounded-full appearance-none accent-white cursor-pointer group-hover:accent-[#1db954] z-10 relative"
                                min={0}
                                max={duration || 100}
                                value={progress}
                                onChange={(e) => seek(Number(e.target.value))}
                            />
                            {/* Custom progress fill */}
                            <div className="absolute left-0 h-1 bg-white group-hover:bg-[#1db954] rounded-full pointer-events-none" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-[#a7a7a7] font-medium tracking-wide">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={toggleShuffle} className={`p-2 transition ${isShuffle ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}>
                            <Shuffle size={24} />
                        </button>
                        <button onClick={prevTrack} className="p-2 text-white hover:scale-110 transition">
                            <SkipBack size={36} className="fill-current" />
                        </button>
                        <button onClick={togglePlay} className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition transform active:scale-95 shadow-xl">
                            {isPlaying ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current translate-x-0.5" />}
                        </button>
                        <button onClick={nextTrack} className="p-2 text-white hover:scale-110 transition">
                            <SkipForward size={36} className="fill-current" />
                        </button>
                        <button onClick={toggleLoop} className={`p-2 transition ${loopMode !== 0 ? 'text-[#1db954]' : 'text-neutral-400 hover:text-white'}`}>
                            {loopMode === 2 ? <Repeat1 size={24} /> : <Repeat size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
