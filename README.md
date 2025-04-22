# Card Jitsu

This fork attempts to fix the lack of a tie in the game's logic. 
It is currently working in the local build, making it so when a tie of the same element and number is present, no point is added to either player. This is implemented on server logic, so clients may still show win/lose message.

The original project's hosted app is found on: https://cardjitsugame.netlify.app
This one is hosted on: https://cardjitsu-gfpx.onrender.com/

At the moment, the hosted service is not working as expected and retains the original behaviour. Cross-hosting was present, so I believe it may be connecting to the original repo's server service instead. The local service has been tested, and tie functionality is present.

__________________________________

[Card Jitsu]() is a free-to-play card game where players can create lobbies and invite their friends to face off in a 1 vs. 1 battle.
The game server is being hosted on the Render.com free-tier, meaning it will spin-down with inactivity. Occasionally when trying to create a lobby it might take upwards of 50 seconds because of this.

## Client


The front-end was created using TypeScript & React as a standalone SPA. The client side code can be found in the `client/` directory. 


- Type `npm i` to install all dependencies for this project.

- Type `npm run dev` to start a local development server on port `5173`.

- Type `npm run build` to create a production build. This will be placed in the `dist/` directory.


## Server


The back-end game server was created using Node.js with TypeScript & Express. The server side code can be found in the `server/` directory.



- Type `npm i` to install all dependencies for this project.

- Type `npm run dev` to run the server in dev mode.

- Type `npm run build` to run the TypeScript compiler. This will be placed in the `dist/` directory.

- Type `npm run start` to start the server.
