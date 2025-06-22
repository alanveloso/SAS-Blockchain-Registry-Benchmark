# SAS Blockchain Registry Benchmark

## Prerequisites
- Docker and Docker Compose
- Node.js (16+)
- Git

## 1. Clone the repository
```bash
git clone https://github.com/alanveloso/SAS-Blockchain-Registry-Benchmark.git
cd SAS-Blockchain-Registry-Benchmark
npm install
```

## 2. Run the benchmark
From the **project root**:

```bash
npx caliper launch manager \
  --caliper-workspace . \
  --caliper-benchconfig benchmarks/scenario/CBSDRegistry/config.yaml \
  --caliper-networkconfig networks/besu/1clique-node/cbsdnetworkconfig.json
  --caliper-report-format csv \
  --caliper-report-path results/CBSDRegistry-results.csv
```

- The `report.html` file will be generated in the project root.
- The report will include tables and charts for CPU, memory, and disk usage of the `besu_clique` container.

## 3. Open the report
Open the `report.html` file in your browser to view the results.

## Quick Troubleshooting
- **Resource metrics not showing up?**
  - Make sure the containers are running (Caliper will start/stop them automatically).
  - The container name in Prometheus/cAdvisor must match the one used in the queries in `config.yaml` (e.g., `name="besu_clique"`).
  - Set the query window to `[30s]` and `step: 10` in `config.yaml` for robustness.
- **Error adding `report.html` to git?**
  - Remove `*.html` from `.gitignore` before adding.
- **Docker permission issues?**
  - Run commands with `sudo` or add your user to the `docker` group.