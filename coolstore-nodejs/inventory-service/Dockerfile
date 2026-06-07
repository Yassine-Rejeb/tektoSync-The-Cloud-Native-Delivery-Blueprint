# Install the app dependencies in a full UBI Node docker image
FROM registry.access.redhat.com/ubi8/nodejs-20:latest

# Copy package.json
COPY package*.json tsconfig.json .env ./
COPY src/ ./src

USER 0

# Install npm packages
RUN npm install

# Run the build command becuase Typescript
RUN npm run build

# PRUNE DEV Deps
RUN npm prune --omit=dev

# Copy the dependencies into a Slim Node docker image
FROM registry.access.redhat.com/ubi8/nodejs-20-minimal:latest

# Install app dependencies from the other container
COPY --from=0 /opt/app-root/src/node_modules /opt/app-root/src/node_modules
COPY --from=0 /opt/app-root/src/dist /opt/app-root/src/dist
COPY --from=0 /opt/app-root/src/package.json /opt/app-root/src/.env /opt/app-root/src/

ENV NODE_ENV production
EXPOSE 8080

CMD ["npm", "start"]