# SAS Blockchain Registry Benchmark

## Prerequisites
- Docker and Docker Compose
- Node.js (16+)
- Git

## 1. Clone the repository
```bash
git clone https://github.com/alanveloso/SAS-Blockchain-Registry.git
cd caliper-benchmarks
npm install
```

## 2. Start the monitoring infrastructure and Besu network
```bash
docker compose -f networks/prometheus-grafana/docker-compose-bare.yaml up -d
docker compose -f networks/besu/1node-clique/docker-compose.yml up -d
```

## 3. Check if the containers are running
```bash
docker ps --format '{{.Names}}'
```
You should see: `besu_clique`, `cadvisor`, `prometheus`, `grafana`, etc.

## 4. Run the benchmark
```bash
npx caliper launch manager \
  --caliper-workspace . \
  --caliper-benchconfig benchmarks/scenario/CBSDRegistry/config.yaml \
  --caliper-networkconfig networks/besu/1node-clique/cbsdnetworkconfig.json
```

- The `report.html` file will be generated in the project root.
- The report will include tables and charts for CPU, memory, and disk usage of the `besu_clique` container.

## 5. Open the report
Open the `report.html` file in your browser to view the results.

## Quick Troubleshooting
- **Resource metrics not showing up?**
  - Make sure the containers are running.
  - The container name in Prometheus/cAdvisor must match the one used in the queries in `config.yaml` (e.g., `name="besu_clique"`).
  - Set the query window to `[30s]` and `step: 10` in `config.yaml` for robustness.
- **Error adding `report.html` to git?**
  - Remove `*.html` from `.gitignore` before adding.
- **Docker permission issues?**
  - Run commands with `sudo` or add your user to the `docker` group.