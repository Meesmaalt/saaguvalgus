# Multi-stage Docker build for Kirjastus Saagu Valgus web application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm install

# Copy source files
COPY . .

# Build Vite application into /app/dist
RUN npm run build

# Production runtime using lightweight Nginx
FROM nginx:alpine

# Copy built static assets to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for Single Page Application routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
