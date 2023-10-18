# Base stage
FROM node:18.0.0-alpine3.15 as base
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy .env file
COPY .env ./

# Install dependencies
#testing stuff start
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true 
#NEW_RELIC_LOG=stdout
ENV NEW_RELIC_LICENSE_KEY=42bf836ce95c8d892206b7ae579723daFFFFNRAL
ENV NEW_RELIC_APP_NAME="linkcollectprodserverbackend"
# end
RUN npm i 

# Install PM2 globally - prod
# RUN npm i pm2 -g

# Copy source code - for prod
# COPY build/src ./src

# Copy everything
COPY  . .

# Start the app using PM2, this will be used in production
# CMD ["pm2-runtime", "start", "src/app.js", "--name", "my-app"]

# for development purpose only

FROM base as production


ENV NODE_PATH=./build

RUN npm run build

# CMD ["npm", "run", "dev"]
