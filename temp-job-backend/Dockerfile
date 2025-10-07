# Use an official Node.js runtime as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies for production only
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Build the TypeScript code to JavaScript
RUN npm run build

# Expose the port that the app will run on
EXPOSE 8080

# Command to run the app in production
CMD ["npm", "run", "serve"]