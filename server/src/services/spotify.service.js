const axios = require('axios');
const { spotifyClientId, spotifyClientSecret, prisma } = require('../config/env');

let accessToken = null;
let tokenExpiresAt = 0;

async function getSpotifyToken() {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  if (!spotifyClientId || !spotifyClientSecret) {
    return null;
  }

  try {
    const authString = Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64');
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data && response.data.access_token) {
      accessToken = response.data.access_token;
      // Expires in ~3600 seconds, refresh 60s early
      tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;
      return accessToken;
    }
  } catch (err) {
    console.error('Spotify token fetch error:', err.message);
  }
  return null;
}

async function searchSpotifyTracks(query) {
  const token = await getSpotifyToken();
  if (!token) {
    // Return empty array if Spotify credentials are not set
    return [];
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { q: query, type: 'track', limit: 10 }
    });

    const items = response.data?.tracks?.items || [];
    const tracks = [];

    for (const item of items) {
      // Upsert into local database
      const spotifyTrackId = item.id;
      const title = item.name;
      const artist = item.artists.map(a => a.name).join(', ');
      const album = item.album?.name || '';
      const duration_ms = item.duration_ms || 0;
      const preview_url = item.preview_url || null;
      const cover_art_url = item.album?.images?.[0]?.url || '';

      const trackRecord = await prisma.track.upsert({
        where: { spotify_track_id: spotifyTrackId },
        update: { title, artist, album, duration_ms, preview_url, cover_art_url },
        create: {
          spotify_track_id: spotifyTrackId,
          title,
          artist,
          album,
          duration_ms,
          preview_url,
          cover_art_url
        }
      });
      tracks.push(trackRecord);
    }
    return tracks;
  } catch (err) {
    console.error('Spotify catalog search error:', err.message);
    return [];
  }
}

module.exports = {
  getSpotifyToken,
  searchSpotifyTracks
};
