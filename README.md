# Approach

Hello there! My name is Théodred and this is the deliverable for the Zocha Group Coding Challenge.

My approach here is that of building an tech demo as Tech Lead. So for example, if the CTO wanted us to use this stack in... let's say a small app for internal use, I would make such an example to demonstrate the necessary technologies and structure to Junior Engineers, Devops, etc. The goal is for others to easily understand the stack, play around, and make suggestions and changes on a small vertical integration before any REAL development commences. 

So in addition to delivering the required functionality, I made some minor additions: A rudimentary front-end to complete the stack and demonstrate what the app does. A logger so that the steps are takes are easier to follow.

# Stack

PostgreSQL // I might switch to MongoDB
Express.js
React.js

# Assumptions

1) I used the web version of Resy OS and probed into what it receives from the server. As far as I can make out, the /reservations call seems to be the only one that gets us there with the required details, and I'm pretty sure that it only works on a daily basis, having played around with it.
2) There isn't any need to live-update reservations from past dates.
3) It's ok to use the API keys in like an .env file and don't deal with authentication. Although I might make a rudimentary authenticator if I have time. I will provide an .env in an e-mail

# Instructions

1) Make sure you have Docker (https://www.docker.com/) installed and running. (Keep in mind that this requires virtualization)
2) Go to Project directory and use: docker-compose up
3) Go to http://localhost:3001/ to access the front-end


