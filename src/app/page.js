"use client";
import React from 'react';
import TrackList from '@/components/TrackList';

export default function Home() {
  return (
    <main className="min-h-screen pt-20 pb-24 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-900/20 via-neutral-900/5 to-transparent pointer-events-none -z-10" />

      <TrackList />
    </main>
  );
}
