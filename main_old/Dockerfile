# FROM node:14-alpine

# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# WORKDIR /home/node/app

# COPY package*.json ./

# USER node

# RUN npm install

# COPY --chown=node:node . .

# EXPOSE 8080

# CMD [ "node", "app.js" ]


# Use an official Node.js 14 image as the base
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Create a new Next.js app using npx
RUN npx create-next-app my-nextjs-app

# Change directory to the new app
WORKDIR /app/my-nextjs-app

# Install dependencies
RUN npm ci

# Build the Next.js application
RUN npm run build

# Expose the port that the Next.js application will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]