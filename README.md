## Dev Notes 👀

### _Docker stuff_

```shell
$ # build and start all docker `services`
$ docker compose up --build
```

### _Configurations_

#### [`gateway`](./gateway)

* Port - 9999
* health-check [`http://localhost:9999/api/health_check/env`](http://localhost:9999/api/health_check/env)

#### [`client`](./client)

* Port - 3000
* In development mode should load [`.env.local`](./client/.env.local) and in
  production [`.env.prod`](./client/.env.prod)
* Open at [`http://localhost:3000`](http://localhost:3000)