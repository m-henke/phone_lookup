import sqlite3
import os


class DatabaseManager:
    def __init__(self, dbPath):
        self.conn = sqlite3.connect(dbPath)
        self.cursor = self.conn.cursor()

    def __del__(self):
        self.conn.commit()
        self.conn.close()

    def create_database(self, data):
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                ContactID INTEGER NOT NULL PRIMARY KEY,
                IndividualID INTEGER NOT NULL,
                Phone TEXT NOT NULL
            )
            """
        )
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                IndividualID INTEGER NOT NULL PRIMARY KEY,
                ContactID INTEGER NOT NULL,
                PhoneNumber TEXT NOT NULL,
                FullName TEXT,
                Email TEXT,
                LastGiftDate TEXT,
                LastGiftAmount TEXT,
                LastNoteDate TEXT
            )
            """
        )


def readCSV(path):
    ret = []
    with open(path, "r", encoding='utf-8') as f:
        print(f"Headers: {f.readline()}")
        ret = [line.split(",") for line in f.readlines()]
    return ret

def cleanData(data):
    ret = []
    for line in data:
        # Remove all special characters
        replace_list = ["(", ")", "-", " ", ".", "+", "\n"]
        for character in replace_list:
            line[2] = line[2].replace(character, "")
        # Remove leading 1
        if line[2][0] == "1":
            line[2] = line[2][1:]
        # Remove trailing extension
        if len(line[2]) > 10 and line[2][10].lower() == "e":
            line[2] = line[2][:10]
        # Skip if not the right length
        if len(line[2]) != 10:
            continue
        # Skip if not all digits
        if not line[2].isdigit():
            continue
        ret.append(tuple(line))
    print(f"Original: {len(data)} entries\nCleaned: {len(ret)} entries")
    return ret


if __name__ == "__main__":
    data = readCSV(os.path.join(os.getcwd(), "data/individualsForPhoneLookup.csv"))
    data = cleanData(data)
    print()

    # conn = sqlite3.connect("database.db")
    # cursor = conn.cursor()

    # cursor.execute(
    #     """
    #     CREATE TABLE IF NOT EXISTS users (
    #         ContactID INTEGER NOT NULL PRIMARY KEY,
    #         IndividualID INTEGER NOT NULL,
    #         Phone TEXT NOT NULL
    #     )
    #     """
    # )

    # conn.commit()
    # conn.close()