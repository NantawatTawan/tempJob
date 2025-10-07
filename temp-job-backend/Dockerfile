# Use an official Node.js runtime as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app will run on
EXPOSE 8080

# Set the environment variable for the port
ENV SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNud2N4bmVkcmd1eGRsa2lzbmtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTc5MTM1NSwiZXhwIjoyMDU3MzY3MzU1fQ.9-ZDV5e7x-NKdp0qwC7MbmDbff-HN69kRnn6mTIUN_8
ENV SUPABASE_JWT_SECRET=b6YMH5QA5oGhFDpPkeBKPowhXylBt7QZVhde0LQEDsLo4UFpoyiQGiRB9kHubwKlwz5sF+ULAWahNqpjnWIvJg==
# Command to run the app
CMD ["npm","run","dev"]