"""
Run this from your terminal inside the backend folder:
  python test_connections.py
"""

import os
import smtplib
import socket
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM")

# ── Test 1: RDS PostgreSQL ───────────────────────────────────────────────────
print("=" * 50)
print("TEST 1: RDS PostgreSQL Connection")
print("=" * 50)
try:
    import psycopg2
    conn = psycopg2.connect(DATABASE_URL, connect_timeout=10)
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print(f"✅ Connected! PostgreSQL version: {version[0][:40]}")
    conn.close()
except ImportError:
    print("❌ psycopg2 not installed. Run: pip install psycopg2-binary")
except Exception as e:
    print(f"❌ Database connection failed: {e}")

print()

# ── Test 2: SES SMTP ─────────────────────────────────────────────────────────
print("=" * 50)
print("TEST 2: Amazon SES SMTP Connection")
print("=" * 50)
try:
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
    server.starttls()
    server.login(SMTP_USER, SMTP_PASSWORD)
    print("✅ SMTP login successful!")
    server.quit()
except Exception as e:
    print(f"❌ SMTP connection failed: {e}")

print()

# ── Test 3: Send a real test email ───────────────────────────────────────────
print("=" * 50)
print("TEST 3: Send Test Email")
print("=" * 50)
try:
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
    server.starttls()
    server.login(SMTP_USER, SMTP_PASSWORD)
    message = f"Subject: Fitra Test Email\n\nYour SES email setup is working!"
    server.sendmail(SMTP_FROM, SMTP_FROM, message)
    server.quit()
    print(f"✅ Test email sent to {SMTP_FROM} — check your inbox!")
except Exception as e:
    print(f"❌ Email send failed: {e}")
