## Dev Notes 👀

### _Docker stuff_
```shell
$ # build and start all docker `services`
$ docker compose up --build
```

### _Configurations_

#### [`gateway`](./gateway)
* Port - 9999
* health-check `GET http://localhost:9999/api/health_check/env`