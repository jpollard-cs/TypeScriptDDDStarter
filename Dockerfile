# TODO: this assumes you have an .env file with all your secrets, you probably want to use a proper secret store
# TODO: optimize for production via multi-stage builds - probably also don't need all the dev dependencies from yarn install
# TODO: add healthcheck
# TODO: create user for container with specific permissions needed to access only what's needed after root user does initial setup
# Containers should run as a non-root user. It is good practice to run the container as a non-root user, where possible. This can be done either via the ```USER``` directive in the ```Dockerfile``` or through ```gosu``` or similar where used as part of the ```CMD``` or ```ENTRYPOINT``` directives.
FROM node:19.2.0-alpine@sha256:80844b6643f239c87fceae51e6540eeb054fc7114d979703770ec75250dcd03b

WORKDIR /app

RUN corepack enable

COPY . .

# Build and then trim out the devDependencies from node_modules
RUN yarn install --frozen-lockfile \
  && yarn build
  
RUN yarn global add pm2

# TODO: if integrate with k8 and dapr will we still need pm2?
CMD ["pm2", "start", "/app/dist/app.js"]
