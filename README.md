# YleX New Music Playlist – Spotify Data Demo

Live demo: https://spotify-2025-demo.vercel.app/ylex-2025

Interactive data dashboard that analyzes the YleX Uuden Musiikin X Spotify playlist.

The application fetches real-time playlist data from Spotify, processes it, and presents it through a user-friendly interface with visualizations and analysis.

## Features

- Fetches playlist and artist data from the Spotify Web API
- Processes and aggregates track metadata (genres, duration, artists)
- Sortable track table (title, artist, album, genre, duration)
- Responsive UI (optimized for mobile and desktop)
- Genre distribution visualization (Chart.js)
- Lightweight analysis layer based on fetched data
- Deployed on Vercel

## Tech Stack

- Next.js (App Router)
- TypeScript / JavaScript
- React
- Chart.js + react-chartjs-2
- Spotify Web API (Client Credentials flow)
- Vercel (deployment)

## What this project demonstrates

- Building a full-stack data-driven web application
- Integrating external APIs and handling asynchronous data flows
- Transforming raw API data into structured, user-facing insights
- Creating responsive and interactive data visualizations

## Data Source

The app uses the Spotify Web API with the Client Credentials flow.

Required environment variables:

SPOTIFY_CLIENT_ID=your_client_id  
SPOTIFY_CLIENT_SECRET=your_client_secret  
YLEX_PLAYLIST_ID=4fuxTOA22t4d22iuVh5alE

## Notes

This project is intentionally iterative. The codebase includes comments and is continuously improved as part of ongoing learning and development.

## Screenshots

![Header](<Screenshot 2025-12-04 130445.png>)

![Playlist Column](<Screenshot 2025-12-04 130457.png>)

![Genres Piechart](<Screenshot 2025-12-04 130521.png>)
