Hello there! My name is Théodred and this is the deliverable for the Zocha Group Coding Challenge.

## Approach

My approach here is that of building a tech demo as a Tech Lead. So for example, if the CTO wanted us to use this stack in... let's say a small app for internal use, I would make such an example to demonstrate the necessary technologies and structure to Junior Engineers, Devops, etc. The goal is for others to easily understand the stack, get a firm grasp of how a live integration could work in the future, play around, and make suggestions and changes on a small vertical integration before any REAL development commences.

So in addition to delivering the required functionality, I made some minor additions: A rudimentary front-end, to demonstrate the web socket and to clearly show what the app does, as well as a a simple logger so that the steps the backend takes are easier to follow from the console.

## Stack

MongoDB
Express.js (with Typescript)
React.js (with Typescript) - Although a very minor app with no state manager and no structure.

## Assumptions

1. I used the web version of Resy OS and probed into what it receives from the server. As far as I can make out, the /reservations call seems to be the only one that gets us there with the required details, and there doesn't seem to be an obvious way to reduce the number of polls and still get "up to minute" updates from the Resy backend. This solution demonstrates a basic websocket implementation, that takes the daily data from Resy every minute as required, but then serves that data to a frontend Live!
   You can see more detailed notes about potential polling and live strategies on the code at:
   src/index.ts:55
   src/routes/reservations/index.ts:17
   src/routes/reservations/index.ts:37
2. As I imagine this, this is a screen in the reception of a restaurant that updates the reservations of the day live. As such, there isn't any need to live-update reservations from past dates. Although the data is stored in the Database in such a way that it could easily be scaled up to include past or future days.
3. I'm using UTC on both front-end and backend.
4. I'm using el-GR date format because
5. I figured It's ok to use the API keys in an .env file and don't deal with authentication. As far as I've seen, they don't expire. I have provided an .env in my submission email. Please include it in the root folder of the project before running it. If this is an incorrect assumption and you cannot get this app running, PLEASE LET ME KNOW!

## Instructions

1. Make sure you have Docker (https://www.docker.com/) installed and running. (Keep in mind that this requires virtualization)
2. Please add the provided .env file at the root of the project
3. Go to Project directory and use: docker-compose up
4. Go to http://localhost:3001/ to access the front-end
5. Keep in mind that in the frontend, by hovering on the "Live" icon on the right of the header, you will be shown when the last data was polled in your LOCAL time. This is the only use of your local time in the application

## Notes

Initially, I used postgreSQL, as I am more experienced with it. But I was compelled to switch to Mongodb and I'm glad I did. This stack fits perfectly with one of my personal projects (https://dimension-factory.gr/) which I was looking to refactor and add some more interactive elements to with live functionality, so I'm definitely migrating DF to this from serverless cloud firebase, which was very expedient but kind of limiting at this stage.

I did this in my free time over a number of days. Overall this took me less than, but close to 10 hours, including writing this.
