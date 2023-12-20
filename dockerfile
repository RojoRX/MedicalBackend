# Use the latest version of Node.js
FROM node:latest AS builder

# Set the working directory in the Docker image
WORKDIR /app

# Add the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the app
RUN npm run build

# Start a new stage
FROM node:latest

WORKDIR /app

# Copy from the 'builder' stage the node_modules folder and the build output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Make port 3000 available for the app
EXPOSE 3000

# Set environment variables
ENV TYPEORM_CONNECTION=mysql
ENV TYPEORM_HOST=127.0.0.1
ENV TYPEORM_PORT=3308
ENV TYPEORM_USERNAME=root
ENV TYPEORM_PASSWORD=root
ENV TYPEORM_DATABASE=saludvida
ENV TYPEORM_ENTITIES=dist/entities/**/*.entity.js
ENV TYPEORM_SYNCHRONIZE=false
ENV TYPEORM_MIGRATIONS=dist/migrations/*.js
ENV TYPEORM_MIGRATIONS_DIR=src/migrations
ENV TYPEORM_LOGGING=true


# Run the app
CMD [ "node", "dist/main" ]
