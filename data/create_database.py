import sqlite3
import os


class DatabaseManager:
    def __init__(self, data_path, db_path):
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self.data_path = data_path

    def __del__(self):
        self.conn.commit()
        self.conn.close()

    @staticmethod
    def readCSV(path):
        ret = []
        with open(path, "r", encoding='utf-8') as f:
            print(f"Headers: {f.readline()}")
            ret = [line.split('","') for line in f.readlines()]
        print(len(ret))
        return ret

    @staticmethod
    def cleanData(data):
        ret = []
        phone_index = 3
        for line in data:
            # Remove all quatation marks
            line = [entry.strip('"') for entry in line]
            # Remove all special characters from phone number
            replace_list = ["(", ")", "-", " ", ".", "+", "\n"]
            for character in replace_list:
                line[phone_index] = line[phone_index].replace(character, "")
            # Remove leading 1
            if line[phone_index][0] == "1":
                line[phone_index] = line[phone_index][1:]
            # Remove trailing extension
            if len(line[phone_index]) > 10 and line[phone_index][10].lower() == "e":
                line[phone_index] = line[phone_index][:10]
            # Skip if not the right length
            if len(line[phone_index]) != 10:
                continue
            # Skip if not all digits
            if not line[phone_index].isdigit():
                continue
            ret.append(line)
        print(f"Original: {len(data)} entries\nCleaned: {len(ret)} entries")
        return [(line[0], int(line[1]), int(line[2]), line[3], line[4], line[5], line[6], line[7]) for line in ret]

    def create_database(self):
        data = self.cleanData(self.readCSV(self.data_path))
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                IndividualID INTEGER NOT NULL PRIMARY KEY,
                ContactID INTEGER NOT NULL,
                FullName TEXT,
                PhoneNumber TEXT,
                Email TEXT,
                LastGiftDate TEXT,
                LastGiftAmount TEXT,
                LastNoteDate TEXT
            )
            """
        )
        self.cursor.executemany(
            """
            INSERT INTO users (
                FullName, 
                IndividualID, 
                ContactID, 
                PhoneNumber,
                Email,
                LastGiftDate, 
                LastGiftAmount, 
                LastNoteDate
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            data
        )

    def query_database(self, query):
        self.cursor.execute(query)
        return self.cursor.fetchall()


if __name__ == "__main__":
    data_path = os.path.join(os.getcwd(), os.path.join("data", "individualsForPhoneLookup.csv"))
    db_path = os.path.join(os.getcwd(), os.path.join("data", "VirtuousData.db"))
    dbManager = DatabaseManager(data_path, db_path)
    # dbManager.create_database()
    print(dbManager.query_database(f"SELECT COUNT(IndividualID) FROM users"))
