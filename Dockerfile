# Full-stack Docker build for Kirjastus Saagu Valgus web application
FROM node:22-alpine

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build Vite application into /app/dist
RUN npm run build

# Expose port (Cloud Run defaults to PORT env var or 3000)
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

# Run full-stack Node server (serves frontend dist/ + /api endpoints + /uploads)
CMD ["node", "server.ts"]
