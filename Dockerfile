# TODO: this assumes you have an .env file with all your secrets, you probably want to use a proper secret store
# TODO: optimize for production via multi-stage builds - probably also don't need all the dev dependencies from yarn install
# TODO: add healthcheck
# TODO: create user for container with specific permissions needed to access only what's needed after root user does initial setup
FROM node:16.14.0-alpine@sha256:425c81a04546a543da824e67c91d4a603af16fbc3d875ee2f276acf8ec2b1577

WORKDIR /app

RUN corepack enable

COPY . .

# Build and then trim out the devDependencies from node_modules
RUN yarn install --frozen-lockfile \
  && yarn build
  
RUN yarn global add pm2

# TODO: if integrate with k8 and dapr will we still need pm2?
CMD ["pm2", "start", "/app/dist/index.js"]
