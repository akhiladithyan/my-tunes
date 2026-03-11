"use client";
import React from 'react';
import { Home, Search, Library, Plus, ArrowRight, List } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function LeftSidebar() {
    const { tracks } = useAudio();

    return (
        <div className="hidden lg:flex w-[350px] flex-col gap-2 h-full bg-black pr-2 pt-2 pb-2">
            {/* Top Nav Box */}
            <div className="bg-[#121212] rounded-lg p-5 flex flex-col gap-5">
                <a href="#" className="flex items-center gap-4 text-white hover:text-white transition group">
                    <Home size={26} className="text-white" fill="currentColor" />
                    <span className="font-bold text-base">Home</span>
                </a>
                <a href="#" className="flex items-center gap-4 text-[#a7a7a7] hover:text-white transition group">
                    <Search size={26} className="text-[#a7a7a7] group-hover:text-white transition" />
                    <span className="font-bold text-base">Search</span>
                </a>
            </div>

            {/* Library Box */}
            <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden relative">
                <div className="p-4 flex items-center justify-between text-[#a7a7a7] sticky top-0 bg-[#121212] z-10 shadow-sm shadow-[#121212]">
                    <button className="flex items-center gap-3 hover:text-white transition group">
                        <Library size={26} className="group-hover:text-white transition" />
                        <span className="font-bold text-base">Your Library</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-[#1a1a1a] rounded-full hover:text-white transition">
                            <Plus size={20} />
                        </button>
                        <button className="p-1.5 hover:bg-[#1a1a1a] rounded-full hover:text-white transition">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-4 pb-2 flex gap-2">
                    <button className="px-3 py-1 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm font-medium rounded-full transition">Playlists</button>
                    <button className="px-3 py-1 bg-[#232323] hover:bg-[#2a2a2a] text-white text-sm font-medium rounded-full transition">Artists</button>
                </div>

                <div className="px-4 pt-2 pb-1 flex justify-between items-center text-sm text-[#a7a7a7]">
                    <button className="hover:text-white transition p-1 hover:bg-[#1a1a1a] rounded-full"><Search size={16} /></button>
                    <button className="flex items-center gap-1 hover:text-white transition group">
                        <span>Recents</span>
                        <List size={16} />
                    </button>
                </div>

                {/* Library Items */}
                <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                    {/* Single Playlist */}
                    <div className="p-2 flex items-center gap-3 hover:bg-[#1a1a1a] rounded-md cursor-pointer group transition">
                        {tracks[0] ? (
                            <img src={tracks[0].cover_image_url} className="w-12 h-12 rounded object-cover flex-shrink-0 shadow-sm" alt="cover" />
                        ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-[#1db954] to-blue-600 rounded flex items-center justify-center flex-shrink-0 shadow-sm">
                                <List size={20} className="text-white" />
                            </div>
                        )}
                        <div className="flex flex-col min-w-0">
                            <span className="text-white font-medium truncate group-hover:text-white transition">Akhil Adithyan</span>
                            <span className="text-xs text-[#a7a7a7] flex items-center gap-1">
                                <span className="w-1 h-3 scale-x-75 text-[#1db954] flex items-center">📌</span>
                                Playlist • {tracks.length} songs
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
