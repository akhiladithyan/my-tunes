import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import Player from "@/components/Player";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Akhil's Spotify Clone",
  description: "Private music streaming application.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#121212] text-white antialiased selection:bg-green-500/30`}>
        <AudioProvider>
          {/* Top Navigation Bar mimicking Spotify */}
          <nav className="fixed top-0 w-full h-16 bg-[#121212]/90 backdrop-blur-md z-40 border-b border-white/10 flex items-center px-6 shadow-sm shadow-black/50">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black shadow-lg shadow-green-500/20">A</span>
              My_tunes
            </h1>
          </nav>

          {children}
          <Player />
        </AudioProvider>
      </body>
    </html>
  );
}
