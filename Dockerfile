# Build stage for client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci

# Copy client source files and build
COPY client/ ./
RUN npm run build

# Build stage for server
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci

# Copy server source files
COPY server/ ./

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy entire client directory structure for relative imports
COPY --from=client-build /app/client /app/client

# Copy entire server directory structure for relative imports
COPY --from=server-build /app/server /app/server

# Set working directory to server for running the application
WORKDIR /app/server
# Expose ports
EXPOSE 3000
# Start the application
CMD ["npm", "run", "server"]