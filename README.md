# TypeScript Express Starter

Download and install nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

cd into the project directory and run

```bash
nvm use
```

that will install the appropriate version of node as defined in the `.nvmrc` file

then you can run the following which will enable yarn

```bash
corepack enable
```

and now you can start the extension via

```bash
yarn && yarn start
```

To test locally with docker-compose run

```bash
docker-compose -f docker-compose.local.yml up
```

You _could_ also use the Dockerfile to deploy to production, but it currently requires you have all your secrets in a .env file while you probably want to use a secret store for secrets outside of your local environment

Alternatively you can easily deploy to Heroku. Working procfiles are already provided. Heroku has great guides on deploying node applications so I won't go into further details here.
