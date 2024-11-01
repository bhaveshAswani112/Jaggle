# Omegle-Type Video Chat Application

This project is a real-time video chat application inspired by Omegle, allowing users to connect and video chat with strangers. Built with React, Socket.IO, WebRTC, and Tailwind CSS, the app enables seamless peer-to-peer communication with video and audio streaming.

## Features

- **Video & Audio Streaming**: Real-time video and audio feed with WebRTC
- **Socket.IO Signaling**: Establishes connections between users using Socket.IO
- **Auto-Connection Handling**: Waits for a second participant to connect before enabling the video chat
- **Responsive UI**: Built with Tailwind CSS for a clean, responsive design
- **TypeScript Support**: Full TypeScript implementation for both frontend and backend
  
## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- ESLint for code quality
- PostCSS for CSS processing

### Backend
- Node.js with TypeScript
- Socket.IO for real-time communication
- Express.js (implied by project structure)

## Project Structure

```plaintext
├── backend/
│   ├── dist/
│   ├── node_modules/
│   ├── src/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── Readme.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bhaveshAswani112/Jaggle.git
cd jaggle
```

2. Set up the backend:
```bash
cd backend
npm install
npm run build  # Builds the TypeScript files
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Configure environment variables:

Create a `.env` file in the frontend directory:
```plaintext
VITE_SOCKET_URL=http://localhost:3000  # Adjust port as needed
```

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).


The project includes several configuration files:

- `tsconfig.json` - TypeScript configuration for both frontend and backend
- `vite.config.ts` - Vite build tool configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration for styling
- `eslint.config.js` - ESLint configuration for code quality
- `components.json` - Component configuration (if using a component library)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

