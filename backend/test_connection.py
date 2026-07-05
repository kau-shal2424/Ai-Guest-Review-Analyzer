from database import client

try:
    client.admin.command("ping")
    print("✅ MongoDB Atlas Connected Successfully!")
except Exception as e:
    print("❌ MongoDB Connection Failed")
    print(e)