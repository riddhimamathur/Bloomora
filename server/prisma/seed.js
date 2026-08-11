const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Bloomora database with categories, vibes, and Spotify tracks...');

  // 1. Create Curator User
  const password_hash = await bcrypt.hash('vibe_check_pass', 10);
  const curator = await prisma.user.upsert({
    where: { email: 'curator@bloomora.com' },
    update: {},
    create: {
      email: 'curator@bloomora.com',
      password_hash,
      display_name: 'bloom_curator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop'
    }
  });

  // 2. Define Sample Vibes per Category with 5-10 tracks each
  const sampleCategories = [
    {
      category: 'Cars & Driving',
      title: 'Sleek Night Porsche Cruise',
      cover_image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
      mood: 'Adrenaline & Neon',
      tracks: [
        { spotify_track_id: '0U0ld9An0v4vYmBKGwwh8x', title: 'Nightcall', artist: 'Kavinsky', album: 'Drive Soundtrack', duration_ms: 259000, preview_url: 'https://p.scdn.co/mp3-preview/sample1.mp3', cover_art_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop' },
        { spotify_track_id: '1E2B7qJ968QJ0zV0N0n0N0', title: 'Fast Lane & Highway Beats', artist: 'Neon Drift', album: 'Eurobeat Velocity', duration_ms: 210000, preview_url: 'https://p.scdn.co/mp3-preview/sample2.mp3', cover_art_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&auto=format&fit=crop' },
        { spotify_track_id: '3n3Ppam7vgaVa1iaRUc9Lp', title: 'Sunset Coastal Highway', artist: 'Pacific Coast Drivers', album: 'Golden Hour Drive', duration_ms: 245000, preview_url: 'https://p.scdn.co/mp3-preview/sample3.mp3', cover_art_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&auto=format&fit=crop' },
        { spotify_track_id: '0U0ld9An0v4vYmBKGwwh8y', title: 'Classic Vintage Sports Car', artist: 'Retro Highway', album: '80s Rock Radio', duration_ms: 230000, preview_url: 'https://p.scdn.co/mp3-preview/sample4.mp3', cover_art_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop' },
        { spotify_track_id: '3nV75lXF6wU1fXb60a5eE7', title: 'Midnight Neon Tunnel Drive', artist: 'Night Driver', album: 'Cyber City Beats', duration_ms: 198000, preview_url: 'https://p.scdn.co/mp3-preview/sample5.mp3', cover_art_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=300&auto=format&fit=crop' }
      ]
    },
    {
      category: 'Lofi Chill',
      title: 'Morning Matcha & Lo-Fi Study',
      cover_image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop',
      mood: 'Cozy & Focused',
      tracks: [
        { spotify_track_id: '7ouOz24K6C4Vl4x2L717S1', title: 'Coffee Shop Vibes & Chill', artist: 'Lofi Dreamer', album: 'Bedroom Beats Vol. 1', duration_ms: 165000, preview_url: 'https://p.scdn.co/mp3-preview/sample6.mp3', cover_art_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300&auto=format&fit=crop' },
        { spotify_track_id: '7ouOz24K6C4Vl4x2L717S2', title: 'Soft Sun Rays', artist: 'Matcha Beats', album: 'Warm Sunday Morning', duration_ms: 140000, preview_url: 'https://p.scdn.co/mp3-preview/sample7.mp3', cover_art_url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&auto=format&fit=crop' },
        { spotify_track_id: '7ouOz24K6C4Vl4x2L717S3', title: 'Vinyl Spin Serenade', artist: 'Analog Dreams', album: 'Dusty Grooves', duration_ms: 180000, preview_url: 'https://p.scdn.co/mp3-preview/sample8.mp3', cover_art_url: 'https://images.unsplash.com/photo-1539625319137-8acb0c08a2b5?w=300&auto=format&fit=crop' },
        { spotify_track_id: '7ouOz24K6C4Vl4x2L717S4', title: 'Botanical Garden Breeze', artist: 'Folk Bloom', album: 'Green Canopy', duration_ms: 155000, preview_url: 'https://p.scdn.co/mp3-preview/sample9.mp3', cover_art_url: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=300&auto=format&fit=crop' },
        { spotify_track_id: '7ouOz24K6C4Vl4x2L717S5', title: 'Midnight Study Session', artist: 'Quiet Mind', album: 'Focus Sessions', duration_ms: 175000, preview_url: 'https://p.scdn.co/mp3-preview/sample10.mp3', cover_art_url: 'https://images.unsplash.com/photo-1518818419601-72c8673f5852?w=300&auto=format&fit=crop' }
      ]
    },
    {
      category: 'Anime & Chill',
      title: 'Studio Ghibli Piano & Nostalgia',
      cover_image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop',
      mood: 'Dreamy & Nostalgic',
      tracks: [
        { spotify_track_id: '45K50M5qAexWkXmD55e8c1', title: "One Summer's Day (Spirited Away)", artist: 'Joe Hisaishi', album: 'Spirited Away OST', duration_ms: 220000, preview_url: 'https://p.scdn.co/mp3-preview/sample11.mp3', cover_art_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop' },
        { spotify_track_id: '45K50M5qAexWkXmD55e8c3', title: 'Path of the Wind (My Neighbor Totoro)', artist: 'Joe Hisaishi', album: 'Totoro Piano Collection', duration_ms: 195000, preview_url: 'https://p.scdn.co/mp3-preview/sample12.mp3', cover_art_url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&auto=format&fit=crop' },
        { spotify_track_id: '45K50M5qAexWkXmD55e8c4', title: "Howl's Moving Castle Theme", artist: 'Tokyo Symphony', album: 'Ghibli Orchestral', duration_ms: 250000, preview_url: 'https://p.scdn.co/mp3-preview/sample13.mp3', cover_art_url: 'https://images.unsplash.com/photo-1518818419601-72c8673f5852?w=300&auto=format&fit=crop' },
        { spotify_track_id: '45K50M5qAexWkXmD55e8c5', title: 'Town with an Ocean View', artist: 'Kiki Strings', album: 'Kikis Delivery Service', duration_ms: 210000, preview_url: 'https://p.scdn.co/mp3-preview/sample14.mp3', cover_art_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop' },
        { spotify_track_id: '45K50M5qAexWkXmD55e8c6', title: 'Princess Mononoke Suite', artist: 'Hisaishi Ensemble', album: 'Mononoke Legend', duration_ms: 280000, preview_url: 'https://p.scdn.co/mp3-preview/sample15.mp3', cover_art_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop' }
      ]
    },
    {
      category: 'Synthwave',
      title: 'Neon Horizon & 80s Retrowave',
      cover_image_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&auto=format&fit=crop',
      mood: 'Futuristic & Electric',
      tracks: [
        { spotify_track_id: '3nV75lXF6wU1fXb60a5eE8', title: 'Sunset Synthwave Ride', artist: 'Retro Bloom', album: 'Synthscape 1985', duration_ms: 215000, preview_url: 'https://p.scdn.co/mp3-preview/sample16.mp3', cover_art_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=300&auto=format&fit=crop' },
        { spotify_track_id: '3nV75lXF6wU1fXb60a5eE9', title: 'Cyberpunk Skyline', artist: 'Neon Grid', album: 'Outrun City', duration_ms: 240000, preview_url: 'https://p.scdn.co/mp3-preview/sample17.mp3', cover_art_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&auto=format&fit=crop' },
        { spotify_track_id: '3nV75lXF6wU1fXb60a5eF0', title: 'Electric Boulevard', artist: 'Laser Wave', album: 'Neon Dreams', duration_ms: 205000, preview_url: 'https://p.scdn.co/mp3-preview/sample18.mp3', cover_art_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop' },
        { spotify_track_id: '3nV75lXF6wU1fXb60a5eF1', title: 'Digital Odyssey', artist: 'Synth Lord', album: 'Arcade Memories', duration_ms: 225000, preview_url: 'https://p.scdn.co/mp3-preview/sample19.mp3', cover_art_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop' },
        { spotify_track_id: '3nV75lXF6wU1fXb60a5eF2', title: 'Retro Starship', artist: 'Cosmic Voyager', album: 'Beyond the Grid', duration_ms: 260000, preview_url: 'https://p.scdn.co/mp3-preview/sample20.mp3', cover_art_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&auto=format&fit=crop' }
      ]
    },
    {
      category: 'Nature Ambient',
      title: 'Secret Forest & Rain Soundscapes',
      cover_image_url: 'https://images.unsplash.com/photo-1518818419601-72c8673f5852?w=800&auto=format&fit=crop',
      mood: 'Calm & Restorative',
      tracks: [
        { spotify_track_id: '1m032WgU12z8P6n8q4Y8Kq', title: 'Midnight Forest Ambient', artist: 'Nature Sleep Sync', album: 'Deep Canopy', duration_ms: 300000, preview_url: 'https://p.scdn.co/mp3-preview/sample21.mp3', cover_art_url: 'https://images.unsplash.com/photo-1518818419601-72c8673f5852?w=300&auto=format&fit=crop' },
        { spotify_track_id: '1m032WgU12z8P6n8q4Y8Kr', title: 'Alpine Wind & Pine Trees', artist: 'Mountain Echoes', album: 'High Altitude Calm', duration_ms: 280000, preview_url: 'https://p.scdn.co/mp3-preview/sample22.mp3', cover_art_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&auto=format&fit=crop' },
        { spotify_track_id: '1m032WgU12z8P6n8q4Y8Ks', title: 'Gentle Ocean Tides', artist: 'Shoreline Sanctuary', album: 'Pacific Waves', duration_ms: 320000, preview_url: 'https://p.scdn.co/mp3-preview/sample23.mp3', cover_art_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop' },
        { spotify_track_id: '1m032WgU12z8P6n8q4Y8Kt', title: 'Raindrops on Leaves', artist: 'Canopy Drops', album: 'Rainforest Rest', duration_ms: 290000, preview_url: 'https://p.scdn.co/mp3-preview/sample24.mp3', cover_art_url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=300&auto=format&fit=crop' },
        { spotify_track_id: '1m032WgU12z8P6n8q4Y8Ku', title: 'Starlight River Stream', artist: 'Waterflow Ambient', album: 'River Reflections', duration_ms: 310000, preview_url: 'https://p.scdn.co/mp3-preview/sample25.mp3', cover_art_url: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=300&auto=format&fit=crop' }
      ]
    },
    {
      category: 'Sunday Jazz',
      title: 'Rainy Cafe Acoustic & Double Bass',
      cover_image_url: 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=800&auto=format&fit=crop',
      mood: 'Warm & Sophisticated',
      tracks: [
        { spotify_track_id: '27D169EbuiW277Y4Z5ZldF', title: 'Rainy Sunday Jazz Study', artist: 'The Cafe Quintet', album: 'Window Seat Trio', duration_ms: 210000, preview_url: 'https://p.scdn.co/mp3-preview/sample26.mp3', cover_art_url: 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=300&auto=format&fit=crop' },
        { spotify_track_id: '27D169EbuiW277Y4Z5ZldG', title: 'Espresso & Warm Keys', artist: 'Blue Note Trio', album: 'Parisian Bistro', duration_ms: 195000, preview_url: 'https://p.scdn.co/mp3-preview/sample27.mp3', cover_art_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300&auto=format&fit=crop' },
        { spotify_track_id: '27D169EbuiW277Y4Z5ZldH', title: 'Midnight Saxophone Groove', artist: 'Harlem Moonlight', album: 'Velvet Club', duration_ms: 235000, preview_url: 'https://p.scdn.co/mp3-preview/sample28.mp3', cover_art_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop' },
        { spotify_track_id: '27D169EbuiW277Y4Z5ZldI', title: 'Vintage Vinyl Ballad', artist: 'Miles Ahead Quartet', album: 'Soft Lighting', duration_ms: 220000, preview_url: 'https://p.scdn.co/mp3-preview/sample29.mp3', cover_art_url: 'https://images.unsplash.com/photo-1539625319137-8acb0c08a2b5?w=300&auto=format&fit=crop' },
        { spotify_track_id: '27D169EbuiW277Y4Z5ZldJ', title: 'Autumn Leaf Waltz', artist: 'Smooth Session Trio', album: 'Cozy Afternoon', duration_ms: 205000, preview_url: 'https://p.scdn.co/mp3-preview/sample30.mp3', cover_art_url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=300&auto=format&fit=crop' }
      ]
    }
  ];

  for (const catData of sampleCategories) {
    // Create Vibe
    const vibe = await prisma.vibe.create({
      data: {
        title: catData.title,
        category: catData.category,
        cover_image_url: catData.cover_image_url,
        mood: catData.mood,
        created_by: curator.id
      }
    });

    let position = 0;
    for (const trackData of catData.tracks) {
      const track = await prisma.track.upsert({
        where: { spotify_track_id: trackData.spotify_track_id },
        update: {},
        create: trackData
      });

      await prisma.vibeTrack.create({
        data: {
          vibe_id: vibe.id,
          track_id: track.id,
          position: position++
        }
      });
    }
  }

  console.log('✅ Successfully seeded Bloomora database!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
