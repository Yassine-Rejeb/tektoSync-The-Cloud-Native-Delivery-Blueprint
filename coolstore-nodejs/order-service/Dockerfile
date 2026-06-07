# Install the app dependencies in a full UBI Node docker image
FROM registry.access.redhat.com/ubi8/nodejs-20:latest

# Copy package.json
COPY package*.json .env ./
COPY ./ ./

USER 0

# Install npm packages
RUN npm install

ENV NODE_ENV production
EXPOSE 3000

CMD ["npm", "start"]