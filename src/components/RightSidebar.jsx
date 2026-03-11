"use client";
import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { MoreHorizontal, X, ListMusic, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function RightSidebar() {
    const { currentTrack, queue, tracks, removeFromQueue, reorderQueue, playTrack } = useAudio();

    if (!currentTrack) {
        return (
            <div className="hidden xl:flex w-[350px] flex-col bg-black pl-2 pt-2 pb-2 h-full">
                <div className="bg-[#121212] rounded-lg flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-[#a7a7a7] text-sm mb-4">Select a track to see more details.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex w-[350px] flex-col bg-black pl-2 pt-2 pb-2 h-full">
            <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-y-auto custom-scrollbar relative">

                {/* Header */}
                <div className="p-4 flex items-center justify-between sticky top-0 bg-[#121212] z-10">
                    <a href="#" className="font-bold text-white hover:underline truncate mr-4">{currentTrack.title}</a>
                    <div className="flex items-center gap-2 text-[#a7a7a7]">
                        <button className="p-1 hover:bg-[#2a2a2a] rounded-full hover:text-white transition">
                            <MoreHorizontal size={20} />
                        </button>
                        <button className="p-1 hover:bg-[#2a2a2a] rounded-full hover:text-white transition">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Art */}
                <div className="px-4 pb-4">
                    <img
                        src={currentTrack.cover_image_url}
                        alt={currentTrack.title}
                        className="w-full aspect-square object-cover rounded-lg shadow-lg mb-4"
                    />

                    <div className="flex justify-between items-start">
                        <div className="flex flex-col min-w-0 pr-4">
                            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer truncate mb-1">{currentTrack.title}</h2>
                            <p className="text-base text-[#a7a7a7] hover:underline cursor-pointer truncate">{currentTrack.artist}</p>
                        </div>
                        {/* Fake favorite button */}
                        <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[#a7a7a7] text-[#a7a7a7] hover:border-white hover:text-white transition mt-1">
                            <div className="w-3 h-3 bg-current rounded-full" />
                        </button>
                    </div>
                </div>

                {/* Queue Section */}
                <div className="px-4 pb-6 mt-2 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white text-lg">Next in queue</h3>
                        <ListMusic size={18} className="text-[#a7a7a7]" />
                    </div>

                    {queue.length === 0 ? (
                        <div className="text-sm text-[#a7a7a7] bg-[#242424] rounded-lg p-4 text-center">
                            Your queue is empty. Swipe right on a track to add it here.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {queue.map((trackIndex, i) => {
                                const qTrack = tracks[trackIndex];
                                if (!qTrack) return null;
                                return (
                                    <div key={`${trackIndex}-${i}`} className="group relative flex items-center justify-between p-2 hover:bg-[#2a2a2a] rounded-md transition-colors bg-[#181818]">
                                        <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => playTrack(trackIndex)}>
                                            <div className="relative w-10 h-10 flex-shrink-0">
                                                <img src={qTrack.cover_image_url} alt={qTrack.title} className="w-full h-full object-cover rounded" />
                                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded">
                                                    <ListMusic size={16} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col min-w-0 pr-2">
                                                <span className="text-sm font-medium text-white truncate">{qTrack.title}</span>
                                                <span className="text-xs text-[#a7a7a7] truncate">{qTrack.artist}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                            <div className="flex flex-col gap-0.5 mr-1">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); if (i > 0) reorderQueue(i, i - 1); }}
                                                    disabled={i === 0}
                                                    className={`p-0.5 rounded text-[#a7a7a7] ${i === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#3a3a3a] hover:text-white'}`}
                                                >
                                                    <ArrowUp size={12} />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); if (i < queue.length - 1) reorderQueue(i, i + 1); }}
                                                    disabled={i === queue.length - 1}
                                                    className={`p-0.5 rounded text-[#a7a7a7] ${i === queue.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#3a3a3a] hover:text-white'}`}
                                                >
                                                    <ArrowDown size={12} />
                                                </button>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); removeFromQueue(i); }}
                                                className="p-1.5 hover:bg-[#3a3a3a] rounded-full text-[#a7a7a7] hover:text-[#ff4444] transition-colors"
                                                title="Remove from queue"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
