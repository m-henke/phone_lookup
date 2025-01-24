Author: Michael Henke
Description: A tool to make it easier to find information about someone who is calling MTM. Once a call is made,
Vonage will open the a link similar to the one shown below. This link will open up a page on the server and it will
pull contact information from the local database and use that to get that contacts latest.

Volage link looks like this: http://127.0.0.1:8080/handle-call?phone_number=6164057876

--- Creating Local Database ---
1) Download this query using the pre selected fields https://app.virtuoussoftware.com/Generosity/Query/Editor/5400
2) Put the downloaded csv file in the 'src/data' folder
3) Confirm that the headers are in the following order: 
    Full Name, Individual ID, Contact ID, Phone Number, Email Address, Last Gift Date, Last Gift Amount, Last Note Date
4) Run the 'create_database.py' file
5) Do not re-run 'create_database.py' after the database has been created