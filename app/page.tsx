"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "cook" | "clean";

const playlists = {
  cook: [
    { title: "Golden Hour Chai", artist: "The Pantry Players", genre: "Lo-fi", color: "#e86435", length: "3:42" },
    { title: "Slow Simmer", artist: "Sunday Service", genre: "Jazz", color: "#cc8d36", length: "4:08" },
    { title: "Nimbooda Nights", artist: "Masala Radio", genre: "Bollywood", color: "#8f693f", length: "3:26" },
    { title: "Rosemary Skies", artist: "June & The Spoons", genre: "Acoustic", color: "#60795f", length: "4:14" },
  ],
  clean: [
    { title: "Scrub It Up", artist: "Neon Apron", genre: "Dance", color: "#4f5dff", length: "3:18" },
    { title: "Sink Disco", artist: "Bubble Club", genre: "Pop", color: "#9b4dca", length: "2:54" },
    { title: "Jhaadu Bounce", artist: "Bass Tadka", genre: "Punjabi", color: "#da3c70", length: "3:34" },
    { title: "Last Plate Standing", artist: "The Rinse Cycle", genre: "Rock", color: "#236f91", length: "4:01" },
  ],
};

const moods = {
  cook: ["Easy does it", "Sunny", "Date night", "Family time"],
  clean: ["Quick blast", "Full power", "Dance break", "Retro"],
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("cook");
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [mood, setMood] = useState(moods.cook[0]);
  const [timer, setTimer] = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

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

  const queue = useMemo(() => songs.filter((_, index) => index !== track), [songs, track]);

  function next(direction = 1) {
    setTrack((current) => (current + direction + songs.length) % songs.length);
  }

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
            <div className={`record ${playing ? "spinning" : ""}`} style={{ "--label": song.color } as React.CSSProperties}>
              <div className="record-lines" /><div className="record-label"><span>{song.genre}</span><b>S/S</b></div>
            </div>
            <div className="now-card"><span>On the turntable</span><strong>{song.title}</strong><small>{song.artist}</small></div>
          </div>
        ) : (
          <div className="clean-stage" aria-label={`Now playing ${song.title}`}>
            <div className="clean-badge">POWER<br/><b>12</b><small>MIN</small></div>
            <div className={`equalizer ${playing ? "dancing" : ""}`} aria-hidden="true">
              {[42, 76, 58, 92, 66, 38, 84, 54, 96, 62, 44, 78].map((height, index) => <i key={index} style={{ "--bar": `${height}%`, "--delay": `${index * -.08}s` } as React.CSSProperties} />)}
            </div>
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
            <span>1:18</span><div className="progress"><i /></div><span>{song.length}</span>
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
