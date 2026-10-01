# Full-stack Docker build for Kirjastus Saagu Valgus web application
FROM node:22-alpine

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build Vite frontend & bundle server.js
RUN npm run build

# Expose both HTTP port (80) and Node default port (3000)
# Supports reverse proxy mappings like -p 3002:80 or -p 3002:3000
EXPOSE 80 3000
ENV PORT=80
ENV NODE_ENV=production

# Run compiled full-stack server
CMD ["node", "server.js"]
