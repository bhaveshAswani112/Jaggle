# Use an official Node.js image as a base
FROM node:18 AS build

# Create and set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Production image
FROM node:18 AS production

# Set working directory in production environment
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Expose port 3000 for WebSocket server
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]
