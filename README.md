# Rank-Vote
Visit the live version [here](https://rank-vote.onrender.com/)<br>
PWA realtime voting application to create polls to facilitate ease of decision making amongst a number of people. Can create polls to become admins of the poll and can share poll ID to have people join the poll. Realtime updates provide users the ability to submit nominations and see who is in the poll and what nominations have been submitted for the poll topic. Admin of the polls can remove participants and nominations and directs the different stages of the poll (submissions, voting, and tallying). Allows users to reconnect to the poll if lost connection and poll has not ended.

## Requirements 
- Docker v24
- Node.js v20
- React v18

## Steps to run the application
In the top most folder (where server, client, and shared reside) you can run the command `npm run start` which will start the server and client concurrently. Once running, users can connect to the network addresses exposed by vite in order to connect on their devices. (Note: you may need to create an inbound rule for your firewall for users to send requests to your server. Follow this [video](https://www.youtube.com/watch?v=uRYHX4EwYYA) for more info on how to do this.) To run just the client run the command `npm run client`. I am using render's redis service, so I have the root package.json script `start` set to run the server package's `dev:render` script, you will have to change the command to run `dev:docker` instead, similarly to run just the server run the command `npm run server` after you change `dev:render` to `dev:docker`. Note: by default logs will be written to the console.
