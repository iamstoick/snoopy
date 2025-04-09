# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache for faster builds
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add custom nginx config to properly serve the SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]