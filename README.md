# YleX New Music Playlist – Spotify Data Demo

https://spotify-2025-demo.vercel.app/ylex-2025

This is a small data journalism demo that analyzes the **YleX Uuden Musiikin X** Spotify playlist.  
The app fetches the 50 most recently added tracks and visualizes what kind of music ends up on the list right now.

## Features

- Fetches playlist and artist data from the **Spotify Web API**
- Sortable track table (title, artist, album, genre, duration)
- Mobile-friendly layout (reduced columns, extra info on small screens)
- Pie chart showing the **genre distribution** of the playlist
- Short written analysis based on the fetched data
- Deployed on **Vercel**

> Note: There are intentionally many comments left in the codebase, as this is an ongoing learning project and I plan to keep iterating on it.

## Tech Stack

- **Next.js 16** (App Router)
- **React**
- **Chart.js + react-chartjs-2** (genre pie chart)
- Utility-class–style CSS
- Spotify Web API (Client Credentials flow)

## Data Source

The app uses the Spotify Web API with the **Client Credentials** flow.  
The following environment variables must be set (locally in `.env.local` and in Vercel project settings):

## Screenshots

![Header](<Screenshot 2025-12-04 130445.png>)

![Playlist Column](<Screenshot 2025-12-04 130457.png>)

![Genres Piechart](<Screenshot 2025-12-04 130521.png>)

```bash
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```
