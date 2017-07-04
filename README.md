# seneca-service-auth [![Build Status][travis-badge]][travis-url]

[![js-semistandard-style](https://cdn.rawgit.com/flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)

[travis-badge]: https://travis-ci.org/FernandoCagale/seneca-service-auth.svg?branch=master
[travis-url]: https://travis-ci.org/FernandoCagale/seneca-service-auth

```sh
$ npm install
```

`Starting MongoDB server`

```sh
$ docker run --name mongo -d -p 27017:27017 mongo
```

`Starting Redis server`

```sh
$ docker run --name redis -d -p 6379:6379 smebberson/alpine-redis
```

## Service

```sh
$ npm start
```

## Test

```sh
$ npm test
```