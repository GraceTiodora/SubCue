import sqlite3

try:
    conn = sqlite3.connect('subwise.db')
    conn.execute("ALTER TABLE subscriptions ADD COLUMN user_id VARCHAR DEFAULT 'default'")
    conn.commit()
    print("Migration successful.")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
