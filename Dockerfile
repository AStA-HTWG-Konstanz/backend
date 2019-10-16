# Use node image
FROM node:10
# Define workspace
WORKDIR /usr/src/backend
# Copy package.json
COPY package*.json ./
# Install build tools
RUN apt-get update
RUN apt-get install -y build-essential
# Install dependencies
RUN npm install
# Copy source files
COPY . .
# Expose production port
EXPOSE 80
# Run application
CMD ["node" ,"app.js"]
