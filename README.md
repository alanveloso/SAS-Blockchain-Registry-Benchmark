# SAS Blockchain Registry Benchmark

Este repositório contém um benchmark de performance para o contrato inteligente **CBSDRegistry** (Citizen Broadband Radio Service Device Registry) usando o Hyperledger Caliper com uma rede Ethereum Besu.

## 📖 Sobre o Projeto

O **CBSDRegistry** é um contrato inteligente que gerencia o registro de dispositivos CBRS (Citizen Broadband Radio Service). Este benchmark testa a performance das principais operações:

- **Registro de CBSDs**: Adicionar novos dispositivos ao registro
- **Consulta de CBSDs**: Buscar informações de dispositivos registrados
- **Atualização de CBSDs**: Modificar dados de dispositivos existentes

## 📋 Pré-requisitos

- **Docker** e **Docker Compose** instalados
- **Node.js** (versão 16 ou superior - testado com v22.16.0)
- **Git**
- **Solc** (compilador Solidity) - opcional, já incluído no projeto

## 🏗️ Estrutura do Projeto

```
SAS-Blockchain-Registry-Benchmark/
├── benchmarks/scenario/CBSDRegistry/    # Configurações do benchmark
│   ├── config.yaml                      # Configuração principal
│   ├── query.js                         # Workload de consulta
│   ├── register.js                      # Workload de registro
│   ├── updateGrant.js                   # Workload de atualização de grant
│   ├── updateStatus.js                  # Workload de atualização de status
│   └── utils/                           # Utilitários compartilhados
├── networks/besu/1node-clique/          # Rede Ethereum Besu
│   ├── docker-compose.yml               # Configuração Docker
│   ├── cbsdnetworkconfig.json           # Configuração da rede
│   └── data/                            # Dados da blockchain
├── networks/prometheus-grafana/         # Monitoramento (Opcional)
│   ├── docker-compose-bare.yaml         # Configuração Prometheus/Grafana
│   ├── prometheus/                      # Configuração Prometheus
│   └── grafana/                         # Configuração Grafana
├── src/ethereum/CBSDRegistry/           # Contrato inteligente
│   ├── CBSDRegistry.sol                 # Código fonte Solidity
│   ├── CBSDRegistry.json                # ABI e bytecode compilado
│   ├── combine.js                       # Script de compilação
│   └── deploy.js                        # Script de deploy
├── README.md                            # Este arquivo
└── SETUP_GUIDE.md                       # Guia detalhado de configuração
```

## 🚀 Configuração Inicial

### 1. Clone o repositório:
```bash
git clone https://github.com/alanveloso/SAS-Blockchain-Registry-Benchmark.git
cd SAS-Blockchain-Registry-Benchmark
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Configure o binding do Caliper para Besu:
```bash
npx caliper bind --caliper-bind-sut besu:latest
```

### 4. Inicie a rede Besu:
```bash
cd networks/besu/1node-clique
docker-compose up -d
cd ../../..
```

### 5. Deploy Manual do Contrato (necessário apenas uma vez):
```bash
# Compilar o contrato
cd src/ethereum/CBSDRegistry
node combine.js

# Fazer deploy manual
node deploy.js

# Voltar ao diretório raiz
cd ../../..
```

**Nota:** O endereço do contrato implantado será exibido no terminal. Se necessário, atualize o endereço em `networks/besu/1node-clique/cbsdnetworkconfig.json`.

## 🏃‍♂️ Executando o Benchmark

### Execução Completa:
```bash
npx caliper launch manager \
    --caliper-workspace ./ \
    --caliper-networkconfig networks/besu/1node-clique/cbsdnetworkconfig.json \
    --caliper-benchconfig benchmarks/scenario/CBSDRegistry/config.yaml
```

### Monitoramento com Prometheus/Grafana (Opcional):
Para monitoramento avançado de recursos e métricas:

1. **Iniciar Prometheus e Grafana:**
```bash
cd networks/prometheus-grafana
docker-compose -f docker-compose-bare.yaml up -d
cd ../..
```

2. **Executar benchmark com monitoramento:**
```bash
npx caliper launch manager \
    --caliper-workspace ./ \
    --caliper-networkconfig networks/besu/1node-clique/cbsdnetworkconfig.json \
    --caliper-benchconfig benchmarks/scenario/CBSDRegistry/config.yaml \
    --caliper-prometheus-gateway http://localhost:9091
```

3. **Acessar dashboards:**
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **cAdvisor**: http://localhost:8080 (métricas de containers)

### Execução por Fases:

1. **Fase de Inicialização:**
```bash
npx caliper launch manager \
    --caliper-workspace ./ \
    --caliper-networkconfig networks/besu/1node-clique/cbsdnetworkconfig.json \
    --caliper-benchconfig benchmarks/scenario/CBSDRegistry/config.yaml \
    --caliper-flow-only-start
```

2. **Fase de Teste:**
```bash
npx caliper launch manager \
    --caliper-workspace ./ \
    --caliper-networkconfig networks/besu/1node-clique/cbsdnetworkconfig.json \
    --caliper-benchconfig benchmarks/scenario/CBSDRegistry/config.yaml \
    --caliper-flow-only-test
```

3. **Fase de Finalização:**
```bash
npx caliper launch manager \
    --caliper-workspace ./ \
    --caliper-networkconfig networks/besu/1node-clique/cbsdnetworkconfig.json \
    --caliper-benchconfig benchmarks/scenario/CBSDRegistry/config.yaml \
    --caliper-flow-only-end
```

## 📊 Interpretando os Resultados

O benchmark gera relatórios detalhados incluindo:

- **Throughput**: Transações por segundo (TPS)
- **Latência**: Tempo de resposta das transações
- **Taxa de Sucesso**: Percentual de transações bem-sucedidas
- **Uso de Recursos**: CPU, memória e rede (com Prometheus)

### Localização dos Relatórios:
- **Relatório HTML**: `report.html` (na raiz do projeto)
- **Logs detalhados**: `workspace/logs/`
- **Resultados JSON**: `workspace/results/`

### Métricas do Prometheus (se configurado):
O Caliper envia as seguintes métricas para o Prometheus:
- `caliper_tps` - Transações por segundo
- `caliper_latency` - Latência das transações
- `caliper_send_rate` - Taxa de envio
- `caliper_txn_submitted` - Transações submetidas
- `caliper_txn_success` - Transações bem-sucedidas
- `caliper_txn_failure` - Transações falhadas
- `caliper_txn_pending` - Transações pendentes

### Métricas de Sistema (cAdvisor):
- **CPU**: Uso de processador por container
- **Memória**: Uso de RAM por container
- **Rede**: Tráfego de rede
- **Disco**: I/O de disco

## 🔧 Configurações do Benchmark

### Modificando Parâmetros:
Edite `benchmarks/scenario/CBSDRegistry/config.yaml` para ajustar:

- **Número de clientes**: `clients.number`
- **Taxa de envio**: `rounds[].txDuration`
- **Número de transações**: `rounds[].txCount`
- **Tipos de transação**: `rounds[].txType`

### Exemplo de Configuração:
```yaml
test:
  name: CBSD Registry Test
  description: Performance test for CBSD Registry contract
  workers:
    number: 2
  rounds:
    - label: register
      txDuration: 60
      txCount: 100
      txType: register
    - label: query
      txDuration: 60
      txCount: 200
      txType: query
```

## 🛠️ Troubleshooting

### Problemas Comuns:

1. **Erro de conexão com a rede:**
   ```bash
   # Verificar se a rede está rodando
   docker ps
   
   # Reiniciar a rede se necessário
   cd networks/besu/1node-clique
   docker-compose down && docker-compose up -d
   ```

2. **Erro de contrato não encontrado:**
   - Verificar se o deploy foi feito corretamente
   - Confirmar o endereço do contrato em `cbsdnetworkconfig.json`

3. **Erro de binding do Caliper:**
   ```bash
   # Reinstalar o binding
   npx caliper bind --caliper-bind-sut besu:latest --force
   ```

4. **Problemas de permissão:**
   ```bash
   # Dar permissão de execução aos scripts
   chmod +x src/ethereum/CBSDRegistry/*.js
   ```

### Logs e Debug:
- **Logs do Caliper**: `workspace/logs/`
- **Logs do Besu**: `networks/besu/1node-clique/logs/`
- **Logs do Docker**: `docker logs <container_name>`

## 📚 Documentação Adicional

- **SETUP_GUIDE.md**: Guia detalhado de configuração e troubleshooting
- **Hyperledger Caliper**: https://hyperledger.github.io/caliper/
- **Besu Documentation**: https://besu.hyperledger.org/

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- **Alan Veloso** - *Trabalho inicial* - [alanveloso](https://github.com/alanveloso)

## 🙏 Agradecimentos

- Hyperledger Caliper para o framework de benchmark
- Hyperledger Besu para a implementação Ethereum
- Comunidade Hyperledger para o suporte e documentação 