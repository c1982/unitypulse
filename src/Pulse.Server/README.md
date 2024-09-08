## Run Grafana with SQLite

> docker run -d -p 3000:3000 --network pulse --name=grafana -v ./pulse.db:/var/lib/grafana/sqlite/pulse.db grafana/grafana-oss

## Run PostgreSQL

> docker network create -d bridge pulse
> docker run -d --name=grafana --network pulse -p 3000:3000 grafana/grafana-oss
> docker run -d --name=posgres --network pulse -p 5432:5432 -e POSTGRES_USER=pulse -e POSTGRES_DB=pulse -e POSTGRES_PASSWORD=p@ssw0rd postgres

### Compile on OSX for SQLite

Compile for ARM64 Linux with

> brew install filosottile/musl-cross/musl-cross

```bash
export CC=aarch64-linux-musl-gcc
export CXX=aarch64-linux-musl-g++
export GOOS=linux
export GOARCH=arm64
export CGO_ENABLED=1 
go build -ldflags="-w -s -linkmode external -extldflags -static" -o pulse .
```