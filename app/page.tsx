"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "cook" | "clean";

const playlists = {
  cook: [
    { title: "Morning Chai", artist: "Kitchen Jukebox Radio", genre: "Lo-fi morning", color: "#e86435", length: "6:12", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Sunday Simmer", artist: "Kitchen Jukebox Radio", genre: "Acoustic", color: "#cc8d36", length: "6:05", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Café by the Window", artist: "Kitchen Jukebox Radio", genre: "Soft jazz", color: "#60795f", length: "5:31", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { title: "Masala Evening", artist: "Kitchen Jukebox Radio", genre: "Indian instrumental", color: "#8f693f", length: "5:44", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
    { title: "Saffron Sunset", artist: "Kitchen Jukebox Radio", genre: "Sufi mood", color: "#b56a55", length: "5:52", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
    { title: "Old Radio Romance", artist: "Kitchen Jukebox Radio", genre: "Retro mellow", color: "#7b5846", length: "6:18", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
  ],
  clean: [
    { title: "Scrub It Up", artist: "Kitchen Jukebox Radio", genre: "Dance warm-up", color: "#2764c9", length: "6:13", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Sink Disco", artist: "Kitchen Jukebox Radio", genre: "Electro pop", color: "#8e57c7", length: "5:48", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { title: "Punjabi Power", artist: "Kitchen Jukebox Radio", genre: "Desi dance", color: "#ff6847", length: "5:26", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
    { title: "Bollywood Blast", artist: "Kitchen Jukebox Radio", genre: "Bollywood energy", color: "#e33d72", length: "5:17", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
    { title: "Rock & Rinse", artist: "Kitchen Jukebox Radio", genre: "Rock", color: "#1e7991", length: "6:02", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
    { title: "Final Plate Drop", artist: "Kitchen Jukebox Radio", genre: "EDM finale", color: "#f09d35", length: "5:39", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  ],
};

const moods = {
  cook: ["Easy does it", "Sunny", "Date night", "Family time"],
  clean: ["Quick blast", "Full power", "Dance break", "Retro"],
};

const bollywoodPicks = {
  cook: [
    { title: "Iktara", artist: "Kavita Seth · Wake Up Sid", vibe: "Slow prep", url: "https://www.youtube.com/results?search_query=Iktara+official+song+Wake+Up+Sid" },
    { title: "Ilahi", artist: "Arijit Singh · YJHD", vibe: "Sunny cooking", url: "https://music.youtube.com/watch?v=fdubeMFwuGs" },
    { title: "Khaabon Ke Parinday", artist: "Alyssa Mendonsa · ZNMD", vibe: "Easy evening", url: "https://www.youtube.com/results?search_query=Khaabon+Ke+Parinday+official+song" },
    { title: "Aaj Kal Zindagi", artist: "Shankar Mahadevan · Wake Up Sid", vibe: "Feel good", url: "https://www.youtube.com/results?search_query=Aaj+Kal+Zindagi+official+song" },
  ],
  clean: [
    { title: "Kala Chashma", artist: "Amar Arshi, Badshah · Baar Baar Dekho", vibe: "Power start", url: "https://www.youtube.com/results?search_query=Kala+Chashma+official+song" },
    { title: "Badtameez Dil", artist: "Benny Dayal · YJHD", vibe: "Dance break", url: "https://www.youtube.com/watch?v=N0uDmkTV08Y" },
    { title: "London Thumakda", artist: "Labh Janjua · Queen", vibe: "Full energy", url: "https://www.youtube.com/results?search_query=London+Thumakda+official+song" },
    { title: "Gallan Goodiyaan", artist: "Farhan Akhtar & team · DDD", vibe: "Final sprint", url: "https://www.youtube.com/results?search_query=Gallan+Goodiyaan+official+song" },
  ],
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("cook");
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mood, setMood] = useState(moods.cook[0]);
  const [timer, setTimer] = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const songs = playlists[mode];
  const song = songs[track];
  const minutes = Math.floor(timer / 60).toString().padStart(2, "0");
  const seconds = (timer % 60).toString().padStart(2, "0");
  const title = mode === "cook" ? "Sizzle slow.\nSound good." : "Rinse fast.\nDance harder.";

  useEffect(() => {
    if (!timerRunning || timer <= 0) return;
    const tick = window.setInterval(() => setTimer((value) => value - 1), 1000);
    return () => window.clearInterval(tick);
  }, [timerRunning, timer]);

  useEffect(() => {
    setTrack(0);
    setMood(moods[mode][0]);
    setTimer(mode === "cook" ? 15 * 60 : 12 * 60);
    setTimerRunning(false);
  }, [mode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing, track, mode]);

  const queue = useMemo(() => songs.filter((_, index) => index !== track), [songs, track]);

  function next(direction = 1) {
    setTrack((current) => (current + direction + songs.length) % songs.length);
    setElapsed(0);
  }

  const clock = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;

  return (
    <main className={`app ${mode}`}>
      <audio ref={audioRef} src={song.src} onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onEnded={() => next(1)} preload="metadata" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Sizzle and Scrub home">
          <span className="brand-mark">S/S</span>
          <span>Sizzle<br />&amp; Scrub</span>
        </a>
        <nav className="mode-switch" aria-label="Choose kitchen mode">
          <button className={mode === "cook" ? "active" : ""} onClick={() => setMode("cook")}>
            <span>01</span> Cook
          </button>
          <button className={mode === "clean" ? "active" : ""} onClick={() => setMode("clean")}>
            <span>02</span> Clean
          </button>
        </nav>
        <button className="round-button" aria-label="Open profile">SJ</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{mode === "cook" ? "Cooking radio · live" : "Cleaning radio · live"}</p>
          <h1>{title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>
          <p className="intro">
            {mode === "cook"
              ? "A warm mix for chopping, stirring and tasting. Your timer lives right beside the music."
              : "High-energy tracks to clear the sink before the final chorus. Turn the chore into a set."}
          </p>
          <div className="mood-row" aria-label="Choose a mood">
            {moods[mode].map((item) => (
              <button key={item} className={mood === item ? "selected" : ""} onClick={() => setMood(item)}>{item}</button>
            ))}
          </div>
        </div>

        {mode === "cook" ? (
          <div className="record-stage cook-stage" aria-label={`Now playing ${song.title}`}>
            <div className="sun-glow" /><div className="steam steam-one">~</div><div className="steam steam-two">~</div>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className={`record ${playing ? "spinning" : ""}`} style={{ "--label": song.color } as React.CSSProperties}>
              <div className="record-lines" /><div className="record-label"><span>{song.genre}</span><b>S/S</b></div>
            </div>
            <div className="now-card"><span>On the turntable</span><strong>{song.title}</strong><small>{song.artist}</small></div>
          </div>
        ) : (
          <div className="clean-stage" aria-label={`Now playing ${song.title}`}>
            <div className="clean-photo" />
            <div className="clean-badge">PLAY<br/><b>LOUD</b><small>CLEAN FAST</small></div>
            <div className="clean-now"><span>Now blasting · {song.genre}</span><strong>{song.title}</strong><small>{song.artist}</small><div className="clean-progress"><i /></div></div>
            <div className="clean-steps"><span className="done">✓ Clear the counter</span><span>02 Rinse the plates</span><span>03 Victory dance</span></div>
          </div>
        )}
      </section>

      <section className="control-deck">
        <div className="player-panel">
          <div className="track-meta">
            <span className="mini-cover" style={{ background: song.color }}>♪</span>
            <div><small>{song.genre} mix</small><strong>{song.title}</strong><span>{song.artist}</span></div>
          </div>
          <div className="transport">
            <button onClick={() => next(-1)} aria-label="Previous song">↶</button>
            <button className="play" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"}>{playing ? "Ⅱ" : "▶"}</button>
            <button onClick={() => next(1)} aria-label="Next song">↷</button>
          </div>
          <div className="progress-wrap">
            <span>{clock(elapsed)}</span><div className="progress"><i style={{ width: duration ? `${(elapsed / duration) * 100}%` : "0%" }} /></div><span>{duration ? clock(duration) : song.length}</span>
          </div>
        </div>

        <div className="timer-panel">
          <div className="timer-heading"><span>{mode === "cook" ? "Kitchen timer" : "Power session"}</span><small>{timerRunning ? "Counting down" : "Ready when you are"}</small></div>
          <div className="timer-value">{minutes}<b>:</b>{seconds}</div>
          <div className="timer-actions">
            <button onClick={() => setTimer((value) => value + 5 * 60)}>+ 5 min</button>
            <button className="timer-start" onClick={() => setTimerRunning(!timerRunning)}>{timerRunning ? "Pause" : "Start"}</button>
            <button onClick={() => { setTimer(mode === "cook" ? 15 * 60 : 12 * 60); setTimerRunning(false); }}>Reset</button>
          </div>
        </div>
      </section>

      <section className="bollywood-section" aria-labelledby="bollywood-title">
        <div className="bollywood-heading"><div><p className="eyebrow">Hindi favourites</p><h2 id="bollywood-title">Bollywood picks</h2></div><span>Opens official streaming ↗</span></div>
        <div className="bollywood-grid">
          {bollywoodPicks[mode].map((pick, index) => (
            <a href={pick.url} target="_blank" rel="noreferrer" className="bollywood-card" key={pick.title}>
              <span>0{index + 1}</span><small>{pick.vibe}</small><strong>{pick.title}</strong><em>{pick.artist}</em><b>Listen ↗</b>
            </a>
          ))}
        </div>
      </section>

      <section className="queue-section">
        <div className="section-heading"><div><p className="eyebrow">Up next</p><h2>Keep the kitchen moving.</h2></div><span>{mood} mix · {songs.length} songs</span></div>
        <div className="queue-grid">
          {queue.map((item, index) => (
            <button className="queue-card" key={item.title} onClick={() => { setTrack(songs.indexOf(item)); setPlaying(true); }}>
              <span className="queue-number">0{index + 1}</span>
              <span className="queue-art" style={{ background: item.color }}><i>♪</i></span>
              <span className="queue-info"><strong>{item.title}</strong><small>{item.artist}</small></span>
              <span className="queue-genre">{item.genre}</span>
              <span className="queue-play">▶</span>
            </button>
          ))}
        </div>
      </section>

      <footer><span>Made for messy hands &amp; good moods.</span><span>Kitchen radio, reimagined.</span></footer>
    </main>
  );
}
