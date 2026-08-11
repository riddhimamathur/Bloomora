const express = require('express');
const { prisma } = require('../config/env');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/vibes - list/paginate vibes with category and search query filters
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (category && category !== 'All Vibes') {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { mood: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [vibes, total] = await Promise.all([
      prisma.vibe.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { created_at: 'desc' },
        include: {
          creator: { select: { id: true, display_name: true, avatar: true } },
          likes: true,
          vibe_tracks: {
            include: { track: true },
            orderBy: { position: 'asc' }
          }
        }
      }),
      prisma.vibe.count({ where })
    ]);

    const formattedVibes = vibes.map(vibe => ({
      id: vibe.id,
      title: vibe.title,
      category: vibe.category,
      cover_image_url: vibe.cover_image_url,
      mood: vibe.mood,
      created_at: vibe.created_at,
      creator: vibe.creator,
      likes_count: vibe.likes.length,
      tracks: vibe.vibe_tracks.map(vt => vt.track)
    }));

    res.json({
      data: formattedVibes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('Fetch vibes error:', err);
    res.status(500).json({ error: 'Failed to fetch vibes' });
  }
});

// GET /api/vibes/:id - get a single vibe with attached tracks
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const vibe = await prisma.vibe.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, display_name: true, avatar: true } },
        likes: true,
        vibe_tracks: {
          include: { track: true },
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!vibe) {
      return res.status(404).json({ error: 'Vibe not found' });
    }

    res.json({
      id: vibe.id,
      title: vibe.title,
      category: vibe.category,
      cover_image_url: vibe.cover_image_url,
      mood: vibe.mood,
      created_at: vibe.created_at,
      creator: vibe.creator,
      likes_count: vibe.likes.length,
      tracks: vibe.vibe_tracks.map(vt => vt.track)
    });
  } catch (err) {
    console.error('Fetch single vibe error:', err);
    res.status(500).json({ error: 'Failed to fetch vibe details' });
  }
});

// POST /api/vibes - create a new vibe (auth required)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, category, cover_image_url, mood, track_ids } = req.body;

    if (!title || !category || !cover_image_url) {
      return res.status(400).json({ error: 'Title, category, and cover_image_url are required' });
    }

    const vibe = await prisma.vibe.create({
      data: {
        title,
        category,
        cover_image_url,
        mood,
        created_by: req.user.id
      }
    });

    if (Array.isArray(track_ids) && track_ids.length > 0) {
      const vibeTracksData = track_ids.map((track_id, index) => ({
        vibe_id: vibe.id,
        track_id,
        position: index
      }));
      await prisma.vibeTrack.createMany({ data: vibeTracksData });
    }

    const createdVibe = await prisma.vibe.findUnique({
      where: { id: vibe.id },
      include: {
        creator: { select: { id: true, display_name: true, avatar: true } },
        vibe_tracks: { include: { track: true } }
      }
    });

    res.status(201).json(createdVibe);
  } catch (err) {
    console.error('Create vibe error:', err);
    res.status(500).json({ error: 'Failed to create vibe' });
  }
});

// POST /api/vibes/:id/like - toggle save/like on a vibe
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const vibe_id = req.params.id;
    const user_id = req.user.id;

    const vibe = await prisma.vibe.findUnique({ where: { id: vibe_id } });
    if (!vibe) {
      return res.status(404).json({ error: 'Vibe not found' });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        user_id_vibe_id: { user_id, vibe_id }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { user_id_vibe_id: { user_id, vibe_id } }
      });
      return res.json({ liked: false, message: 'Unliked vibe successfully' });
    } else {
      await prisma.like.create({
        data: { user_id, vibe_id }
      });
      return res.json({ liked: true, message: 'Liked vibe successfully' });
    }
  } catch (err) {
    console.error('Toggle like error:', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

module.exports = router;
