Author: Michael Henke
Description: A tool to make it easier to find information about someone who is calling MTM. Once a call is made,
Vonage will open the a link similar to the one shown below. This link will open up a page on the server and it will
pull contact information from the local database and use that to get that contacts latest.

Volage link looks like this: http://127.0.0.1:8080/handle-call?phone_number=6164057876

To create the local database download this query with the pre selected fields https://app.virtuoussoftware.com/Generosity/Query/Editor/5400
Put the downloaded csv file in the 'src/data' folder
Once it is in the folder run the 'create_database.py' file
Do not re-run 'create_database.py' after the database has been created