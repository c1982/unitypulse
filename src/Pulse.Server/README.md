## Run Grafana

> docker run -rm -d -p 3000:3000 --name=grafana -v ./pulse.db:/var/lib/grafana/sqlite/pulse.db grafana/grafana-oss