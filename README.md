<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

---

## Usage (Docs)

When running app all available command could be found based on localhost, for example for 3000 it is http://localhost:3000/docs using swagger
Example command: http://localhost:3000/api/users/filter

There are routes for auth, users and posts than can be accessed based on your port

Each route has endpoints.

---

1. /auth:

- /auth/sign-up - POST - creating new user;
  body: {
  "email": "sashalehedza3@gmail.com",
  "password": "Lifetose42!",
  "name": "sashalehedza",
  "deviceId":"id1"
  }

- /auth/sign-in - POST - login
  body: {
  "email": "sashalehedza1@gmail.com",
  "password": "Lifetose42!",
  "deviceId":"id1"
  }

- /auth/sign-out - POST - logout
  Bearer access token

- /auth/refresh - POST - refresh token
  Bearer refresh token

---

2. /users:

- /users/all - GET - getting all users
  Bearer access token

- /users/filter - GET - getting filtered users
  Bearer access token
  query params:
  limit?:number,
  page?: number,
  name?: string
  sort?: string

- /users/:id - GET - getting users by id
  params:
  user id

- /users/me - GET - getting logged user
  Bearer access token

- /users/me - PATCH - update logged user
  Bearer access token
  body:{
  "name": "username1",
  "bio": "bio1"
  }

- /users/remove-me - DELETE - remove logged user
  Bearer access token

- /users/delete-me - DELETE - delete logged user
  Bearer access token

- /users/me/avatar - POST - update logged user
  Bearer access token
  body, form-data:{
  avatar: image
  }

- /users/me/avatar - DELETE - update logged user
  Bearer access token

- /users/search - GET - update logged user
  Bearer access token
  body:{
  "userid": "a0a37d43-13c4-44ed-a96f-c073ed52989e",
  "email": "sashalehedza"
  }

---

3. /posts:

- /posts/create - POST - create post
  Bearer access token
  body:{
  "title": "title",
  "description": "description",
  "body": "body"
  }

- /posts - GET - get posts
  Bearer access token
  query params:
  limit?:number,
  page?: number,
  name?: string
  sort?: string

- /posts/user/:id - GET - get user posts
  Bearer access token
  query params:
  limit?:number,
  page?: number,
  name?: string
  sort?: string

- /posts/:id - GET - get post by id
  Bearer access token

- /posts/:id - DELETE - delete post by id
  Bearer access token

- /posts/:id - PUT - update post by id
  Bearer access token
  body:{
  "title": "title",
  "description": "description",
  "body": "body"
  }

---

---

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
