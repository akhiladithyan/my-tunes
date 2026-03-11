"use client";
import React, { useState, useEffect } from 'react';
import TrackList from '@/components/TrackList';
import { Settings, Play, Moon, Sun, X } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function Home() {
  const [view, setView] = useState('home'); // 'home' | 'playlist'
  const [isDesktop, setIsDesktop] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark');
  const { tracks } = useAudio();

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setView('playlist');
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (!isDesktop && view === 'home') {
    return (
      <main className="min-h-full pt-20 pb-32 relative overflow-hidden bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-900/40 via-white dark:via-[#121212] to-transparent pointer-events-none -z-10 transition-colors duration-300" />
        
        {/* Top Header */}
        <div className="flex justify-between items-center px-6 mb-8 mt-2">
          <h2 className="text-3xl font-bold text-black dark:text-white transition-colors duration-300">hi boss</h2>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 -mr-2 text-neutral-600 hover:text-black dark:text-[#a7a7a7] dark:hover:text-white transition-colors"
          >
            <Settings size={28} />
          </button>
        </div>

        {/* Playlists Grid */}
        <div className="px-6 grid grid-cols-2 gap-3 mb-8">
          <div 
            onClick={() => setView('playlist')}
            className="col-span-2 group bg-neutral-100/80 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 h-20 rounded-md flex items-center overflow-hidden cursor-pointer transition-colors shadow-sm"
          >
            {tracks[0] ? (
              <img src={tracks[0].cover_image_url} alt="Cover" className="w-20 h-20 object-cover shadow-md" />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-[#1db954] to-blue-600" />
            )}
            <div className="flex-1 px-4 flex justify-between items-center">
              <span className="font-bold text-black dark:text-white text-[15px] truncate">Akhil Adithyan</span>
              <div className="w-10 h-10 bg-[#1db954] text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md sm:hidden group-active:opacity-100">
                <Play size={20} className="fill-current translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
            <div className="bg-white dark:bg-[#282828] w-full sm:w-[400px] h-3/4 sm:h-auto sm:rounded-xl rounded-t-2xl flex flex-col transition-colors duration-300 shadow-xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-white/10 transition-colors">
                <h3 className="text-xl font-bold text-black dark:text-white">Settings</h3>
                <button onClick={() => setShowSettings(false)} className="text-neutral-500 hover:text-black dark:text-[#a7a7a7] dark:hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between py-4 border-b border-neutral-200 dark:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    {theme === 'dark' ? <Moon size={24} className="text-white" /> : <Sun size={24} className="text-black" />}
                    <div className="flex flex-col">
                      <span className="font-semibold text-black dark:text-white text-lg">App Theme</span>
                      <span className="text-sm text-neutral-500 dark:text-[#a7a7a7]">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className="w-14 h-8 rounded-full bg-neutral-300 dark:bg-[#1db954] relative transition-colors duration-300"
                  >
                    <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform duration-300 shadow-sm ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-full pt-20 lg:pt-0 pb-32 lg:pb-8 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-900/40 via-white dark:via-[#121212] to-transparent pointer-events-none -z-10 transition-colors duration-300" />
      <TrackList onBack={!isDesktop ? () => setView('home') : undefined} />
    </main>
  );
}
