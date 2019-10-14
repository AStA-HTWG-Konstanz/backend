# Use node alpine image
FROM node:10-alpine
# Define workspace
WORKDIR /usr/src/backend
# Copy package.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy source files
COPY . .
# Espose production port
EXPOSE 80
# Run application
CMD ["node" ,"app.js"]
