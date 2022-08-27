# TypeScript Express Starter

### COMING SOON

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/jpollard-cs/TypeScriptExpressDDDStarter.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jpollard-cs/TypeScriptExpressDDDStarter/context:javascript) ![Known Vulnerabilities](https://snyk.io/test/github/jpollard-cs/typescriptexpressdddstarter/badge.svg) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

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

You _could_ also use the Dockerfile to deploy to production, but it currently requires you have all your secrets in a .env file while you probably want to use a secret store for secrets outside of your local environment. You can generate a .env from your secret store during your build, but even better if you are transiently setting secrets in the context of the cloud task and role under which each instance is operating (so secrets are never persisted to a .env file in your docker image)

Alternatively you can easily deploy to Heroku. Working procfiles are already provided. Heroku has great guides on deploying node applications so I won't go into further details here.
