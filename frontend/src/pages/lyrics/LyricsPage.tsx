import { useEffect, useState, useRef } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface Line {
  time: number;
  line: string;
}

const parseLRC = (lrcText: string): Line[] => {
  const lines = lrcText.split("\n");
  return lines
    .map((line) => {
      const match = line.match(/\[(\d+):(\d+)(\.\d+)?\](.*)/);
      if (!match) return null;

      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millis = parseFloat(match[3] || "0");
      const text = match[4].trim();
      const time = minutes * 60 + seconds + millis;

      return { time, line: text };
    })
    .filter(Boolean) as Line[];
};

const LyricsPage = () => {
  const { currentSong } = usePlayerStore();
  const [lyrics, setLyrics] = useState<Line[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchLRC = async () => {
      const lrcUrl = currentSong?.lyricsUrl;
      if (!lrcUrl) return;

      try {
        const res = await fetch(lrcUrl);
        const text = await res.text();
        const parsed = parseLRC(text);
        setLyrics(parsed);
      } catch (err) {
        console.error("Error fetching LRC file:", err);
      }
    };

    fetchLRC();
  }, [currentSong]);

  useEffect(() => {
    const audio = document.querySelector("audio");
    if (!audio) return;

    const update = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
    };
  }, []);

  const activeIndex = lyrics.findIndex((line, idx) => {
    const next = lyrics[idx + 1];
    return currentTime >= line.time && (!next || currentTime < next.time);
  });

  useEffect(() => {
    if (containerRef.current && activeIndex >= 0) {
      const lineElement = containerRef.current.querySelector(`[data-line="${activeIndex}"]`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeIndex]);

  return (
    <div className="h-screen p-6 bg-[#111827] text-white overflow-auto" ref={containerRef}>
      {currentSong && (
        <div className="flex items-center gap-4 mb-6 bg-[#1f2937] p-4 rounded-lg shadow-lg">
          <img
            src={currentSong.imageUrl}
            alt={currentSong.title}
            className="w-20 h-20 rounded-md object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-purple-300">{currentSong.title}</h1>
            <p className="text-sm text-zinc-400">{currentSong.artist}</p>
          </div>
        </div>
      )}

      <div className="space-y-4 text-lg leading-relaxed">
        {lyrics.length === 0 ? (
          <p className="text-zinc-500 italic">Lyrics not available.</p>
        ) : (
          lyrics.map((line, index) => (
            <div
              key={index}
              data-line={index}
              className={`transition-all duration-300 ${
                index === activeIndex
                  ? "text-green-400 font-semibold scale-105"
                  : "text-zinc-400"
              }`}
            >
              {line.line}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LyricsPage;
