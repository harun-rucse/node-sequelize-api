# Node Sequelize API

#### CRUD api using nodeJs, ExpressJs, Sequelize, MySQL database and Redis

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-18.20.3-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19.2-000000?logo=express)](LINK_TO_EXPRESS)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.37.3-47A248?logo=mongoose)](LINK_TO_SEQUELIZE)
[![Docker](https://img.shields.io/badge/Docker-26.1.1-2496ED?logo=docker)](LINK_TO_DOCKER)
[![Ioredis](https://img.shields.io/badge/ioredis-5.4.1-DC382D?logo=redis)](https://redis.io/)

### Installing

A step by step series of examples for running development environment:

1. Clone the repository

```
git clone https://github.com/harun-rucse/node-sequelize-api.git
```

2. Copy the `.env.example` file and create two file named `.env.development` and `.env.production` in the root

## Run locally in development

3. Install the dependencies

```
yarn
```

4. Start the development server

```
yarn dev
```

## Run Docker in development

```
docker-compose -f docker-compose.dev.yml up -d --build
```

## Run Docker in production

```
docker-compose -f docker-compose.prod.yml up -d --build
```

### API documentation link: https://documenter.getpostman.com/view/11943934/2sA3Qv6prC

## Built With

- [Node.js](https://nodejs.org/) - The JavaScript runtime used on the back-end
- [Sequelize](https://sequelize.org/) - The database used to store data
- [Express](https://expressjs.com/) - The back-end web framework used to build the API
