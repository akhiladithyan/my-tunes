import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import Player from "@/components/Player";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My_tunes",
  description: "Private music streaming application.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-[#1db954]/30 lg:overflow-hidden h-[100dvh] flex flex-col`}>
        <AudioProvider>
          {/* Mobile Top Navigation */}
          <nav className="lg:hidden fixed top-0 w-full h-16 bg-[#121212]/90 backdrop-blur-md z-40 border-b border-[#2a2a2a] flex items-center px-6 shadow-sm shadow-black/50">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center text-black shadow-lg shadow-[#1db954]/20">A</span>
              My_tunes
            </h1>
          </nav>

          {/* Desktop Container */}
          <div className="flex flex-1 lg:h-[calc(100vh-90px)] overflow-hidden w-full relative">
            <LeftSidebar />

            {/* Main Content Area */}
            <div className="flex-1 bg-[#121212] lg:rounded-lg lg:mt-2 lg:mb-2 overflow-y-auto w-full h-full relative z-0 custom-scrollbar">
              {children}
            </div>

            <RightSidebar />
          </div>

          <Player />
        </AudioProvider>
      </body>
    </html>
  );
}
