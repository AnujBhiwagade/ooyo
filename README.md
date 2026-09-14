# Truth Dare Circle

A real-time multiplayer party game built with React, Socket.IO, Express, and WebRTC for live social interaction. Players join a room, get selected by the bottle, choose truth or dare, submit challenge prompts, vote on outcomes, and play in a casual social game experience.

This project is branded as ooyo and is designed for browser-based group play with a modern, minimal UI.

## Features

- Real-time multiplayer room matching
- Four-player waiting rooms and game flow
- Random bottle selection mechanic
- Truth and dare modes
- Task submission and challenge selection
- Voting-based result resolution
- Live peer-to-peer video connection support using WebRTC
- In-app moderation flow with IP ban and report handling
- Minimal responsive frontend built with React and Vite

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Socket.IO client

### Backend
- Node.js
- Express
- Socket.IO
- WebRTC signaling via Socket.IO

## Project Structure

```bash
truth-dare-circle/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── game/
│   ├── moderation/
│   ├── rooms/
│   ├── socket/
│   ├── index.js
│   └── package.json
├── README.md
└── structure.txt
```

## Game Flow

1. A player enters a name on the landing screen.
2. The app connects to the server and joins a waiting room.
3. When the room reaches four players, everyone marks themselves ready.
4. A random player is selected as the current target.
5. The selected player chooses Truth or Dare.
6. Other players submit tasks or prompts.
7. One task is selected and the challenge begins.
8. Players vote on whether the selected player succeeded or failed.
9. The score updates and a new round begins.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### 1) Install frontend dependencies

```bash
cd client
npm install
```

### 2) Install backend dependencies

```bash
cd server
npm install
```

### 3) Start the backend server

```bash
cd server
node index.js
```

The server runs on:

```bash
http://localhost:3000
```

### 4) Start the frontend development server

```bash
cd client
npm run dev
```

The frontend runs on:

```bash
http://localhost:5173
```

## Important Notes

- The backend is configured for CORS with the Vite frontend at http://localhost:5173.
- WebRTC peer connection signaling is handled through Socket.IO events.
- The app is intended for local development and testing. Production deployment would require a secure setup, proper domain configuration, HTTPS, and environment-aware settings.

## Scripts

### Client

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Server

The server currently starts using:

```bash
node index.js
```

## Security and Moderation

The server includes moderation logic for:

- IP-based tracking
- reporting / strike logic
- temporary bans
- player removal from rooms

This helps manage misuse in live multiplayer sessions.

## License

This project is currently unlicensed unless you explicitly add a license file and legal terms.

## Contributing

Feel free to fork the project, improve the gameplay, polish the UI, or extend the multiplayer features. If you are making a serious contribution, it is a good idea to add tests and clean up gameplay logic before deploying.

## Summary

Truth Dare Circle is a playful browser-based social game that blends realtime multiplayer room mechanics, direct challenge gameplay, vote-based interaction, and live video support. It is a strong foundation for a social party app and can be extended with matchmaking, persistent profiles, moderation dashboards, and production deployment tooling.
