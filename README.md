A simple signin and signup API using ExpressJS and Postman

1. Importing all the necessary packages and add dependencies to them.
2. Adding routes to necessary apis (signin and signup)
3. For signup API add necessary fields like username, password, confirm password, email and adding proper validation to them
4. Assigning a separate Bearer token the signed up user and storing it to the database (mongoDB). For evaluating purpose I have set the expiry time to 30seconds. When user signed in the token must be validated in the database.
5. After successfull validation the user may gets signed in.
