# Use an official Node.js runtime as a parent image
FROM node:20.5-slim as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the React app to the working directory
COPY . .

# Build the React app
RUN npm run build

# Use NGINX to serve the built React app
FROM nginx:alpine

# Copy the built React app from the builder stage to the NGINX server's html directory
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Expose port 80 to the Docker host
EXPOSE 80

# Command to run NGINX
CMD ["nginx", "-g", "daemon off;"]