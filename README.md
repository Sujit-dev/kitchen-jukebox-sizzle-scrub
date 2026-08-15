# Kitchen Jukebox — Sizzle & Scrub

A responsive kitchen music experience with different moods for cooking and
cleaning. It uses Spotify and YouTube embeds in one source-aware player, with no
separate MP3 or audio-file player.

## Features

- Separate Cook and Clean modes
- One unified music queue and player
- Spotify and YouTube source badges
- Cooking timer and cleaning power-session timer
- Responsive kitchen-themed artwork and layouts

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Build and deploy

```bash
npm run build
npm run deploy
```

The deployment command builds the app and publishes it to Cloudflare Workers
using `wrangler.jsonc`.
