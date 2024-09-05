## Run Grafana

> docker run -rm -d -p 3000:3000 --name=grafana -v ./pulse.db:/var/lib/grafana/sqlite/pulse.db grafana/grafana-oss

### Compile with OSX

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