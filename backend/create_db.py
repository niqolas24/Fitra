import psycopg2

conn = psycopg2.connect(
    host="database-1.cdiw8es4irrt.us-west-2.rds.amazonaws.com",
    port=5432,
    dbname="postgres",
    user="postgres",
    password="Xoxo2134!",
    connect_timeout=10
)
conn.autocommit = True
cur = conn.cursor()
cur.execute("CREATE DATABASE fitra;")
print("✅ Database fitra created!")
conn.close()
