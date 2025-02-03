# Phone Lookup Tool

**Author** Michael Henke

**Description**
The Phone Lookup Tool is designed to assist in retrieving information about individuals calling Mel Trotter Ministries (MTM). When a call is received, the system uses the provided phone number to search for contact information in a local database and, if necessary, in the Virtuous CRM system. The tool then displays the relevant contact information and allows users to add notes to the contact's profile.

**Features**
- Phone Number Lookup: Retrieve contact information based on the caller's phone number.
- Local Database Integration: Store and retrieve contact information from a local SQLite database.
- Virtuous CRM Integration: Search for contact information and notes in the Virtuous CRM system.
- Note Management: Add new notes to a contact's profile.
- Web Interface: User-friendly web interface for displaying contact information and managing notes.
- Automatic Database Updates: The database will automatically update itself with new contact information from Virtuous CRM as calls come in.
    - Adding a new contact
    - Updating contact gift information
- Automatic Database Updates: The database will automatically update its note types every day at midnight using cron jobs.
- Logging: Uses Winston package to handle logging to terminal and to log file.
- Send notification to microsoft teams when an error occurrs (Advancement -> App Status)

**Key Files and Directories**
- src/data/create_database.py: Script to create and populate the local SQLite database with contact information and note types.
- css: Contains CSS files for styling the web interface.
- js: Contains JavaScript files for handling client-side logic.
- routes: Contains Express route handlers for handling HTTP requests.
- utils: Contains utility modules for logging, database operations, and Virtuous CRM API interactions.
- views: Contains EJS templates for rendering HTML pages.
- server.js: Main server file that sets up the Express server and routes.

**Installation**
0. Download and install node.js and python
1. Download the repository
2. Open terminal to downloaded repository (phone_lookup/)
3. Install dependencies
    - `npm install`
    - `pip install requests`
4. Create local database:
      - Download this query using the pre selected fields: [Virtuous Query](https://app.virtuoussoftware.com/Generosity/Query/Editor/5400)
      - Move the downloaded csv file to the `src/data` folder
      - Confirm that the headers are in the following order
          - Full Name
          - Individual ID
          - Contact ID
          - Phone Number
          - Email Address
          - Last Gift Date
          - Last Gift Amount
    - Open terminal to `phone_lookup/src/data`
    - Run create_database script: `python create_database.py`
    - Do not re-run after the database has been created
5. Create environmental variable
    - Copy "Phone Call Lookup" API key from Virtuous
        - Settings -> all settings -> connectivity -> api keys
    - Open command prompt and enter: `setx VIRTUOUS_TOKN "<key>"`
        - Make sure to keep the quotation marks
        - Example: `setx VIRTUOUS_TOKN "xxxxxxx-xxxxxxx-xxxxxxx"`

**Vonage Setup**

**Usage**
1. Open terminal to `phone_lookup/`
2. Start server: `npm start`

**Contact**
For any issues or questions, please contact Michael Henke at michaelhenke@meltrotter.org.
