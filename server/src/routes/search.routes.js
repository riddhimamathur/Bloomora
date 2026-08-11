const express = require('express');
const { prisma } = require('../config/env');
const { searchSpotifyTracks } = require('../services/spotify.service');

const router = express.Router();

// GET /api/search?q= - universal search across vibes, tracks, and Spotify catalog
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.json({ vibes: [], tracks: [], spotify_tracks: [] });
    }

    const query = q.trim();

    // 1. Search local Vibes
    const vibes = await prisma.vibe.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { mood: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        creator: { select: { id: true, display_name: true, avatar: true } },
        vibe_tracks: { include: { track: true } }
      },
      take: 10
    });

    // 2. Search local Tracks
    const tracks = await prisma.track.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { artist: { contains: query, mode: 'insensitive' } },
          { album: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 10
    });

    // 3. Search Spotify API (if credentials configured) and cache in DB
    const spotify_tracks = await searchSpotifyTracks(query);

    res.json({
      query,
      vibes: vibes.map(v => ({
        id: v.id,
        title: v.title,
        category: v.category,
        cover_image_url: v.cover_image_url,
        creator: v.creator,
        tracks: v.vibe_tracks.map(vt => vt.track)
      })),
      tracks,
      spotify_tracks
    });
  } catch (err) {
    console.error('Universal search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
