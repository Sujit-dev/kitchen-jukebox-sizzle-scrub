"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "cook" | "clean";
type Provider = "youtube";
type Track = {
  title: string;
  artist: string;
  genre: string;
  color: string;
  length: string;
  provider: Provider;
  youtubeId?: string;
};

const playlists: Record<Mode, Track[]> = {
  cook: [
    { title: "Ilahi", artist: "Arijit Singh · YJHD", genre: "Sunny Bollywood", color: "#ff0033", length: "3:48", provider: "youtube", youtubeId: "fdubeMFwuGs" },
    { title: "Deewani Mastani", artist: "Shreya Ghoshal · Bajirao Mastani", genre: "Bollywood evening", color: "#ff0033", length: "5:39", provider: "youtube", youtubeId: "h6lHUn20J5g" },
  ],
  clean: [
    { title: "Kala Chashma", artist: "Amar Arshi, Badshah · Baar Baar Dekho", genre: "Bollywood power", color: "#ff0033", length: "3:07", provider: "youtube", youtubeId: "4WRJHbL4dAk" },
    { title: "Badtameez Dil", artist: "Benny Dayal · YJHD", genre: "Bollywood dance", color: "#ff0033", length: "4:12", provider: "youtube", youtubeId: "N0uDmkTV08Y" },
    { title: "Gallan Goodiyaan", artist: "Farhan Akhtar & team · DDD", genre: "Bollywood party", color: "#ff0033", length: "4:56", provider: "youtube", youtubeId: "jCEdTq3j-0U" },
  ],
};

const moods = {
  cook: ["Easy does it", "Sunny", "Date night", "Family time"],
  clean: ["Quick blast", "Full power", "Dance break", "Retro"],
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("cook");
  const [track, setTrack] = useState(0);
  const [mood, setMood] = useState(moods.cook[0]);
  const [timer, setTimer] = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [playbackNonce, setPlaybackNonce] = useState(0);

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
    setPlaybackNonce(0);
  }, [mode]);

  const queue = useMemo(() => songs.filter((_, index) => index !== track), [songs, track]);

  const providerName = "YouTube";

  return (
    <main className={`app ${mode}`}>
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
            <div className={`record ${playbackNonce ? "spinning" : ""}`} style={{ "--label": song.color } as React.CSSProperties}>
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
            <div><small>{song.genre} mix</small><strong>{song.title}</strong><span>{song.artist}</span><b className={`source-badge ${song.provider}`}><i />{providerName}</b></div>
          </div>
          <iframe key={`${mode}-${track}-${playbackNonce}`} className="main-stream-player youtube-player" src={`https://www.youtube-nocookie.com/embed/${song.youtubeId}?autoplay=${playbackNonce ? 1 : 0}&playsinline=1&rel=0`} title={`${song.title} YouTube music video`} allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" allowFullScreen />
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

      <section className="queue-section">
        <div className="section-heading"><div><p className="eyebrow">Up next</p><h2>Keep the kitchen moving.</h2></div><span>{mood} mix · {songs.length} songs</span></div>
        <div className="queue-grid">
          {queue.map((item, index) => (
            <button className="queue-card" key={item.title} onClick={() => { setTrack(songs.indexOf(item)); setPlaybackNonce((value) => value + 1); }}>
              <span className="queue-number">0{index + 1}</span>
              <span className="queue-art" style={{ background: item.color }}><i>♪</i></span>
              <span className="queue-info"><strong>{item.title}</strong><small>{item.artist}</small></span>
              <span className="queue-genre">{item.genre}<b className="source-badge youtube"><i />YouTube</b></span>
              <span className="queue-play">▶</span>
            </button>
          ))}
        </div>
      </section>

      <footer><span>Made for messy hands &amp; good moods.</span><span>Kitchen radio, reimagined.</span></footer>
    </main>
  );
}
