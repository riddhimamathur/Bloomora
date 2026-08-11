import datetime
from backend.database import SessionLocal, engine
from backend import models
from backend.routers.auth import get_password_hash

def seed_database():
    db = SessionLocal()
    
    # Check if database is already seeded
    if db.query(models.User).filter(models.User.username == "bloom_curator").first():
        print("Database already seeded.")
        db.close()
        return

    try:
        print("Seeding database...")
        # Create user
        curator = models.User(
            username="bloom_curator",
            email="curator@bloomora.com",
            hashed_password=get_password_hash("vibe_check_pass")
        )
        db.add(curator)
        db.commit()
        db.refresh(curator)

        # Create pins
        pins_data = [
            {
                "title": "Morning Matcha & Lo-Fi",
                "description": "Starting the day with warm tea, soft sun rays, and soothing bedroom beats.",
                "image_url": "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop",
                "spotify_uri": "spotify:track:7ouOz24K6C4Vl4x2L717S1",
                "user_id": curator.id
            },
            {
                "title": "Studio Ghibli Nostalgia",
                "description": "Lost in the gorgeous hand-drawn animations and melodies of Joe Hisaishi. One Summer's Day is absolute magic.",
                "image_url": "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop",
                "spotify_uri": "spotify:track:45K50M5qAexWkXmD55e8c1",
                "user_id": curator.id
            },
            {
                "title": "Late Night Synthwave Drive",
                "description": "Obsessed with neon glows, gridlines, retro-futuristic basslines, and 80s nostalgia.",
                "image_url": "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&auto=format&fit=crop",
                "spotify_uri": "spotify:track:3nV75lXF6wU1fXb60a5eE7",
                "user_id": curator.id
            },
            {
                "title": "Secret Forest Escape",
                "description": "Finding peace in the deep green forest canopy. Pure ambient tracks to connect with nature.",
                "image_url": "https://images.unsplash.com/photo-1518818419601-72c8673f5852?w=800&auto=format&fit=crop",
                "spotify_uri": "spotify:track:1m032WgU12z8P6n8q4Y8Kq",
                "user_id": curator.id
            },
            {
                "title": "Rainy Sunday Jazz",
                "description": "The perfect companion for a quiet afternoon: soft keys, warm double bass, and rain drops tapping on the window pane.",
                "image_url": "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=800&auto=format&fit=crop",
                "spotify_uri": "spotify:track:27D169EbuiW277Y4Z5ZldF",
                "user_id": curator.id
            }
        ]

        pins = []
        for pin_item in pins_data:
            pin = models.Pin(**pin_item)
            db.add(pin)
            pins.append(pin)
        
        db.commit()

        # Refresh pins to get IDs for comments
        for pin in pins:
            db.refresh(pin)

        # Create comments
        comments_data = [
            {
                "content": "This vibe is absolutely immaculate. I feel so relaxed!",
                "pin_id": pins[0].id,
                "user_id": curator.id
            },
            {
                "content": "Matcha + Lofi is the only way to study.",
                "pin_id": pins[0].id,
                "user_id": curator.id
            },
            {
                "content": "This song makes me cry every single time, so nostalgic.",
                "pin_id": pins[1].id,
                "user_id": curator.id
            },
            {
                "content": "Synthwave nights are the best nights. 🌌",
                "pin_id": pins[2].id,
                "user_id": curator.id
            }
        ]

        for comment_item in comments_data:
            comment = models.Comment(**comment_item)
            db.add(comment)
        
        db.commit()
        print("Database successfully seeded with aesthetic pins and comments!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
