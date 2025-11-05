# Development stage
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Production build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone server and required files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# The server.js is created in the standalone directory by Next.js
# No need to copy next.config.ts as it's already bundled

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# The server.js file is now properly included from the standalone build
CMD ["node", "server.js"]