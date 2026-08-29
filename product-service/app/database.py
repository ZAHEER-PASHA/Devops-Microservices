import mysql.connector
from mysql.connector import Error

from app.config import Config


def get_connection():
    try:
        connection = mysql.connector.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME
        )

        return connection

    except Error as error:
        print(f"Database connection error: {error}")
        return None


def test_database_connection():
    connection = get_connection()

    if connection and connection.is_connected():
        print("MySQL database connected successfully")
        connection.close()
        return True

    print("MySQL database connection failed")
    return False