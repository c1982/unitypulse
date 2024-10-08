# Unity Pulse Server

This is the server component of the Unity Pulse project. It is a simple server that listens for incoming data from the Unity Pulse client and stores it in a database. It also provides a simple web API to view the data. Also included is a Grafana dashboard to visualize the data.

## Configuration

The server is configured using flags. The following flag variables are available:

-   `udpaddr` - The address to listen for incoming data on (default `:7771`)
-   `webaddr` - The address to serve the web API on (default `:8080`)
-   `dbhost` - The host of the database (default `postgres`)
-   `dbuser` - The username to connect to the database with (default `pulse`)
-   `dbpass` - The password to connect to the database with (default `p@ssw0rd`)
-   `dbname` - The name of the database to connect to (default `pulsedb`)
-   `dbport` - The port of the database (default `5432`)

## Run Locally

```bash
pulse -udpaddr :7771 -webaddr :8080 -dbhost localhost -dbuser pulse -dbpass p@ssw0rd -dbname pulsedb -dbport 5432
```

## Run Service

copy pulse.service to /etc/systemd/system/

```bash
sudo systemctl enable pulse
sudo systemctl start pulse
```

Follow logs

```bash
sudo journalctl -u pulse -f
```

## Run Docker Compose

```bash
cd ./src/Pulse.Server
docker-compose up -d
```

## Altenative way Run Docker

```bash
docker network create -d bridge pulse
docker run -d --name=grafana --network pulse -p 3000:3000 grafana/grafana-oss
docker run -d --name=posgres --network pulse -p 5432:5432 -e POSTGRES_USER=pulse -e POSTGRES_DB=pulsedb -e POSTGRES_PASSWORD=p@ssw0rd postgres
```
