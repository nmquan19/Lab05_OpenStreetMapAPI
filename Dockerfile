# Use the official Node.js 18 image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose port 7860 (This is the specific port Hugging Face Spaces uses)
EXPOSE 7860

# Start the application
CMD ["node", "server.js"]