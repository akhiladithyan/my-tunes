"use client";
import React, { useState, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, Clock, ListPlus, Check, ChevronLeft } from 'lucide-react';

export default function TrackList({ onBack }) {
    const { tracks, currentTrack, isPlaying, playTrack, togglePlay, addToQueue } = useAudio();

    // Swipe-to-queue state
    const [swipeState, setSwipeState] = useState({ index: -1, offset: 0 });
    const [queuedIndices, setQueuedIndices] = useState([]);
    const dragStartRef = useRef(0);
    const isDraggingRef = useRef(false);

    const onPointerDown = (e, index) => {
        if (e.pointerType === 'mouse' && e.buttons !== 1) return;
        dragStartRef.current = e.clientX;
        isDraggingRef.current = false;
        setSwipeState({ index, offset: 0 });
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e, index) => {
        if (swipeState.index !== index) return;
        const diff = e.clientX - dragStartRef.current;
        if (Math.abs(diff) > 10) {
            isDraggingRef.current = true;
        }
        if (diff > 0) {
            setSwipeState({ index, offset: Math.min(diff, 100) });
        }
    };

    const onPointerUp = (e, index) => {
        if (swipeState.index === index) {
            if (swipeState.offset > 60) {
                addToQueue(index);
                setQueuedIndices(prev => [...prev, index]);
                setTimeout(() => {
                    setQueuedIndices(prev => prev.filter(i => i !== index));
                }, 1500);
            }
            setSwipeState({ index: -1, offset: 0 });
            setTimeout(() => { isDraggingRef.current = false; }, 50);
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    if (!tracks.length) {
        return <div className="text-center p-12 text-[#a7a7a7]">Loading tracks...</div>;
    }

    return (
        <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-4 lg:py-6 relative z-0">
            {/* Desktop ambient header gradient specifically for main view */}
            <div className="hidden lg:block absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-[#402030] to-[#121212] pointer-events-none -z-10" />
            <div className="hidden lg:block absolute top-0 left-0 right-0 h-64 bg-black/40 pointer-events-none -z-10" />

            {/* Desktop header text (mock profile name) */}
            <div className="hidden lg:flex items-center gap-4 mt-16 mb-6 px-4">
                <div className="w-48 h-48 shadow-2xl bg-gradient-to-br from-[#1db954] to-[#121212] flex items-center justify-center text-7xl font-bold rounded-full">A</div>
                <div className="flex flex-col text-white z-10 drop-shadow-md">
                    <span className="text-sm font-semibold opacity-80 uppercase tracking-widest mb-1">Profile</span>
                    <h1 className="text-7xl font-extrabold tracking-tighter">Akhil Adithyan</h1>
                    <span className="text-sm text-[#a7a7a7] font-medium mt-4">1 Public Playlist</span>
                </div>
            </div>

            <div className="flex lg:hidden items-center gap-2 mb-4 relative z-10 transition-colors duration-300">
                {onBack && (
                    <button onClick={onBack} className="p-1 -ml-2 text-black dark:text-white transition-colors">
                        <ChevronLeft size={32} strokeWidth={2.5} />
                    </button>
                )}
                <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight">Akhil Adithyan</h2>
            </div>

            {/* Play Button Row */}
            <div className="hidden lg:flex items-center gap-6 mb-8 px-4 relative z-10">
                <button className="w-14 h-14 bg-[#1db954] text-black rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition shadow-xl">
                    <Play size={28} className="fill-current translate-x-1" />
                </button>
            </div>

            {/* Header Columns */}
            <div className="hidden lg:grid grid-cols-[32px_minmax(120px,_full)_minmax(120px,_1fr)_minmax(60px,_80px)] xl:grid-cols-[32px_4fr_3fr_minmax(60px,_1fr)] gap-4 px-4 py-2 text-sm text-[#a7a7a7] font-medium border-b border-[#2a2a2a] mb-4 sticky lg:top-[-24px] bg-[#121212] lg:bg-[#121212]/95 backdrop-blur-md z-10 transition-colors uppercase tracking-widest text-[11px]">
                <div className="text-right">#</div>
                <div>Title</div>
                <div>Album</div>
                <div className="text-right flex justify-end pr-8 lg:pr-4"><Clock size={16} /></div>
            </div>

            <div className="flex flex-col gap-1 sm:gap-0 relative z-0">
                {tracks.map((track, index) => {
                    const isActive = currentTrack?.id === track.id;

                    return (
                        <div
                            key={track.id}
                            className="relative overflow-hidden group rounded-md mb-1 sm:mb-0"
                        >
                            {/* Swipe Background Action */}
                            <div className={`absolute inset-y-0 left-0 bg-[#1db954] w-full flex items-center px-4 md:px-6 transition-opacity duration-200 select-none ${swipeState.index === index && swipeState.offset > 20 ? 'opacity-100' : 'opacity-0'}`}>
                                {queuedIndices.includes(index) ? (
                                    <>
                                        <Check size={24} className="text-black pointer-events-none" />
                                        <span className="ml-2 font-bold text-black pointer-events-none text-sm hidden sm:inline">Added to queue</span>
                                    </>
                                ) : (
                                    <>
                                        <ListPlus size={24} className="text-black pointer-events-none" />
                                        <span className="ml-2 font-bold text-black pointer-events-none text-sm hidden sm:inline">Add to queue</span>
                                    </>
                                )}
                            </div>

                            {/* Actual Track Content */}
                            <div
                                onPointerDown={(e) => onPointerDown(e, index)}
                                onPointerMove={(e) => onPointerMove(e, index)}
                                onPointerUp={(e) => onPointerUp(e, index)}
                                onPointerCancel={(e) => onPointerUp(e, index)}
                                onClick={() => {
                                    if (isDraggingRef.current) return;
                                    isActive ? togglePlay() : playTrack(index);
                                }}
                                style={{
                                    transform: swipeState.index === index ? `translateX(${swipeState.offset}px)` : 'translateX(0px)',
                                    transition: swipeState.index === index ? 'none' : 'transform 0.2s ease-out'
                                }}
                                className={`touch-pan-y relative z-10 grid grid-cols-[1fr_auto] lg:grid-cols-[32px_minmax(120px,_full)_minmax(120px,_1fr)_minmax(60px,_80px)] xl:grid-cols-[32px_4fr_3fr_minmax(60px,_1fr)] items-center gap-3 lg:gap-4 py-2 md:py-3 px-1 md:px-4 rounded-md cursor-pointer transition-colors duration-200 ${isActive ? 'bg-neutral-100 dark:bg-white/5 lg:dark:bg-[#2a2a2a]/60' : 'hover:bg-neutral-50 dark:hover:bg-white/5 lg:dark:hover:bg-[#2a2a2a] bg-transparent dark:bg-[#121212] lg:bg-transparent dark:lg:bg-transparent'} min-h-[56px]`}
                            >
                                {/* Number or Icon (Desktop Only) */}
                                <div className="w-6 hidden lg:flex items-center justify-end flex-shrink-0 text-neutral-500 dark:text-[#a7a7a7]">
                                    {isActive ? (
                                        isPlaying ? <Pause size={14} className="text-[#1db954] fill-current" /> : <Play size={14} className="text-[#1db954] fill-current" />
                                    ) : (
                                        <span className="group-hover:hidden group-focus:hidden text-sm">{index + 1}</span>
                                    )}
                                    <span className="hidden group-hover:block text-black dark:text-white">
                                        {!isActive && <Play size={16} className="fill-current" />}
                                    </span>
                                </div>

                                {/* Title & Cover */}
                                <div className="flex items-center gap-3 min-w-0 pr-4">
                                    <img src={track.cover_image_url} alt={track.title} className="w-12 h-12 md:w-10 md:h-10 rounded shadow-sm flex-shrink-0 object-cover" loading="lazy" />
                                    <div className="flex flex-col min-w-0">
                                        <span className={`font-medium truncate text-base lg:text-sm transition-colors ${isActive ? 'text-[#1db954]' : 'text-black dark:text-white'}`}>{track.title}</span>
                                        <span className="text-sm lg:text-sm text-neutral-500 dark:text-[#a7a7a7] truncate lg:group-hover:text-black dark:lg:group-hover:text-white transition-colors">{track.artist}</span>
                                    </div>
                                </div>

                                {/* Album (Desktop) */}
                                <div className="hidden lg:block truncate text-sm text-[#a7a7a7] group-hover:text-white transition-colors pr-4">
                                    {track.title} {/* Mock album name using title */}
                                </div>


                                {/* Duration */}
                                <div className="hidden lg:block text-right text-sm text-[#a7a7a7] pr-4 group-hover:text-white transition-colors">
                                    {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                                </div>

                                {/* Mobile Play/More icon wrapper */}
                                <div className="flex lg:hidden flex-col items-end gap-1">
                                    <div className="text-xs text-neutral-500 dark:text-[#a7a7a7]">
                                        {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                                    </div>
                                    <div className="text-neutral-500 dark:text-[#a7a7a7] pr-2">
                                        {isActive && (isPlaying ? <Pause size={18} className="text-[#1db954] fill-current" /> : <Play size={18} className="text-[#1db954] fill-current" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop Footer Space */}
            <div className="h-16 hidden lg:block" />
        </div>
    );
}
