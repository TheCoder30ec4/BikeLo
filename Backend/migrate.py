from DataBase.core import init_db, get_psycopg2_connection

def run_migrations():
    # 1. Create any brand NEW tables that don't exist yet
    print("Creating new tables if they don't exist...")
    init_db()
    
    # 2. Alter existing tables to add missing columns
    # (SQLAlchemy's create_all doesn't add columns to existing tables)
    print("Updating existing tables with new columns...")
    
    conn = get_psycopg2_connection()
    conn.autocommit = True
    cursor = conn.cursor()
    
    try:
        # Add is_verified to users
        cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;")
        print("✅ Added 'is_verified' column to 'users' table.")
        
        # Add is_new to bikes
        cursor.execute("ALTER TABLE bikes ADD COLUMN IF NOT EXISTS is_new BOOLEAN NOT NULL DEFAULT FALSE;")
        print("✅ Added 'is_new' column to 'bikes' table.")
        
        # Add description to bikes
        cursor.execute("ALTER TABLE bikes ADD COLUMN IF NOT EXISTS description TEXT;")
        print("✅ Added 'description' column to 'bikes' table.")
        
        # Add is_ad to bikes
        cursor.execute("ALTER TABLE bikes ADD COLUMN IF NOT EXISTS is_ad BOOLEAN NOT NULL DEFAULT FALSE;")
        print("✅ Added 'is_ad' column to 'bikes' table.")
        
    except Exception as e:
        print(f"❌ Error updating tables: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    run_migrations()
    print("Migration complete! You can start the server now.")
