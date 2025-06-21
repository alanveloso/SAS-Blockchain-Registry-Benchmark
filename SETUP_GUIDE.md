# Guia de Setup - SAS Blockchain Registry Benchmark

Este guia detalha como configurar e executar o benchmark do contrato CBSDRegistry usando Hyperledger Caliper e Besu.

## 🔧 Configuração do Ambiente

### 1. Instalação de Dependências

**Docker e Docker Compose:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Verificar instalação
docker --version
docker compose version
```

**Node.js (versão 16+):**
```bash
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 16
nvm use 16

# Verificar instalação
node --version
npm --version
```

**Nota:** Versões mais recentes do Node.js (como v22.16.0) também funcionam perfeitamente com o Caliper.

### 2. Configuração do Projeto

```bash
# Clone o repositório
git clone https://github.com/alanveloso/SAS-Blockchain-Registry-Benchmark.git
cd SAS-Blockchain-Registry-Benchmark

# Instalar dependências
npm install

# Configurar binding do Caliper para Besu
npx caliper bind --caliper-bind-sut besu:latest
```

## 🏗️ Estrutura do Contrato

### CBSDRegistry.sol
O contrato implementa um registro de dispositivos CBSD com as seguintes funcionalidades:

- **registerCBSD**: Registra um novo dispositivo CBSD
- **getCBSDInfo**: Consulta informações de um dispositivo
- **updateGrantAmount**: Atualiza o valor de grant de um dispositivo
- **updateStatus**: Atualiza o status de um dispositivo

### Compilação do Contrato
```bash
cd src/ethereum/CBSDRegistry
node combine.js
```

Este comando gera:
- `CBSDRegistry.json` - Contrato compilado com ABI e bytecode
- `CBSDRegistry.abi` - Interface do contrato
- `CBSDRegistry.bin` - Bytecode do contrato

## ⚙️ Configuração da Rede

### cbsdnetworkconfig.json
Configuração da rede Besu para o benchmark:

```json
{
  "caliper": {
    "blockchain": "ethereum",
    "command": {
      "start": "docker compose -f ./networks/besu/1node-clique/docker-compose.yml up -d && sleep 60",
      "end": "docker compose -f ./networks/besu/1node-clique/docker-compose.yml down"
    }
  },
  "ethereum": {
    "url": "ws://localhost:8546",
    "gas": 6000000,
    "contractDeployerAddress": "0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09",
    "contractDeployerAddressPrivateKey": "0x797c13f7235c627f6bd013dc17fff4c12213ab49abcf091f77c83f16db10e90b",
    "fromAddressSeed": "0x3f841bf589fdf83a521e55d51afddc34fa65351161eead24f064855fc29c9580",
    "transactionConfirmationBlocks": 2,
    "contracts": {
      "CBSDRegistry": {
        "address": "0x588108d3eAB34e94484d7cdA5a1D31804cA96FE7",
        "path": "src/ethereum/CBSDRegistry/CBSDRegistry.json",
        "estimateGas": true,
        "gas": {
          "registerCBSD": 200000,
          "getCBSDInfo": 100000,
          "updateGrantAmount": 100000,
          "updateStatus": 100000
        }
      }
    }
  }
}
```

## 📊 Configuração do Benchmark

### config.yaml
Configuração dos testes de performance:

```yaml
---
test:
  name: CBSD Registry Benchmark
  description: Performance test for CBSD Registry smart contract
  workers:
    number: 1
  rounds:
    - label: registerCBSD
      description: Register new CBSD devices
      txDuration: 60
      rateControl:
        type: fixed-rate
        opts:
          tps: 50
      workload:
        module: benchmarks/scenario/CBSDRegistry/register.js

    - label: updateGrantAmount
      description: Update grant amounts for CBSD devices
      txDuration: 30
      rateControl:
        type: fixed-rate
        opts:
          tps: 50
      workload:
        module: benchmarks/scenario/CBSDRegistry/updateGrant.js

    - label: updateStatus
      description: Update status of CBSD devices
      txDuration: 30
      rateControl:
        type: fixed-rate
        opts:
          tps: 50
      workload:
        module: benchmarks/scenario/CBSDRegistry/updateStatus.js

    - label: getCBSDInfo
      description: Query CBSD device information
      txDuration: 20
      rateControl:
        type: fixed-rate
        opts:
          tps: 50
      workload:
        module: benchmarks/scenario/CBSDRegistry/query.js
```

## 🚀 Execução do Benchmark

### Pré-requisito: Deploy Manual do Contrato

**IMPORTANTE:** Este benchmark usa um contrato já implantado. Se for a primeira execução ou se mudar a rede, você precisa fazer o deploy manual:

```bash
# 1. Compilar o contrato
cd src/ethereum/CBSDRegistry
node combine.js

# 2. Fazer deploy manual
node deploy.js
```

**Saída esperada:**
```
Contract deployed at: 0x588108d3eAB34e94484d7cdA5a1D31804cA96FE7
```

**3. Atualizar o endereço na configuração (se necessário):**
Edite `networks/besu/1node-clique/cbsdnetworkconfig.json` e atualize o campo `address`:

```json
"contracts": {
  "CBSDRegistry": {
    "address": "0x588108d3eAB34e94484d7cdA5a1D31804cA96FE7", // ← Atualizar aqui
    "path": "src/ethereum/CBSDRegistry/CBSDRegistry.json",
    // ... resto da configuração
  }
}
```

### Comando Principal
```bash
npx caliper launch manager \
  --caliper-workspace ./ \
  --caliper-networkconfig networks/besu/1node-clique/cbsdnetworkconfig.json \
  --caliper-benchconfig benchmarks/scenario/CBSDRegistry/config.yaml
```

### Processo de Execução
1. **Inicialização**: Caliper inicia a rede Besu via Docker
2. **Deploy**: Contrato CBSDRegistry é implantado automaticamente
3. **Testes**: Execução dos 4 rounds de benchmark
4. **Relatório**: Geração do relatório de performance

## 🐛 Troubleshooting

### Erro: "Util.resolvePath: Parameter is undefined"
**Causa**: Problema na configuração do contrato
**Solução**: Verificar se o campo `path` está presente em `cbsdnetworkconfig.json`

### Erro: "gas is missing"
**Causa**: Campo `gas` não encontrado na configuração
**Solução**: Adicionar campo `gas` no nível do contrato e global

### Erro: "CBSD already registered"
**Causa**: Tentativa de registrar CBSD com ID duplicado
**Solução**: O workload usa estado compartilhado para evitar duplicatas

### Erro: "Transaction has been reverted"
**Causa**: Falha na execução do contrato
**Solução**: Verificar se o contrato foi compilado corretamente

### Erro: "Failed to connect to Besu"
**Causa**: Rede Besu não iniciou corretamente
**Solução**: 
```bash
# Parar e reiniciar a rede
docker compose -f networks/besu/1node-clique/docker-compose.yml down
docker compose -f networks/besu/1node-clique/docker-compose.yml up -d
```

## 📈 Interpretação dos Resultados

### Métricas Importantes:
- **Throughput (TPS)**: Transações processadas por segundo
- **Latency**: Tempo de resposta das transações
- **Success Rate**: Taxa de sucesso das transações

### Exemplo de Resultado:
```
| Name              | Succ | Fail | Send Rate (TPS) | Max Latency (s) | Min Latency (s) | Avg Latency (s) | Throughput (TPS) |
|-------------------|------|------|-----------------|-----------------|-----------------|-----------------|------------------|
| registerCBSD      | 998  | 2    | 50.1            | 99.28           | 3.67            | 49.81           | 8.4              |
| updateGrantAmount | 1000 | 0    | 50.1            | 14.86           | 1.39            | 7.54            | 29.5             |
| updateStatus      | 1000 | 0    | 50.1            | 15.91           | 1.14            | 8.38            | 29.5             |
| getCBSDInfo       | 1000 | 0    | 50.1            | 0.03            | 0.00            | 0.00            | 50.0             |
```

### Análise:
- **registerCBSD**: Operação mais pesada (2 falhas, latência alta)
- **updateGrantAmount/updateStatus**: Performance intermediária
- **getCBSDInfo**: Operação mais rápida (consulta apenas)

## 🔍 Debugging

### Logs Detalhados
Para logs mais detalhados, adicione `--caliper-logging-targets console` ao comando:

```bash
npx caliper launch manager \
  --caliper-workspace ./ \
  --caliper-networkconfig networks/besu/1node-clique/cbsdnetworkconfig.json \
  --caliper-benchconfig benchmarks/scenario/CBSDRegistry/config.yaml \
  --caliper-logging-targets console
```

### Verificar Estado da Rede
```bash
# Verificar containers Docker
docker ps

# Logs do Besu
docker logs besu_clique

# Verificar conectividade
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

## 📝 Personalização

### Modificar Taxa de Transações
Edite `config.yaml` e altere o valor `tps` em cada round:

```yaml
rateControl:
  type: fixed-rate
  opts:
    tps: 100  # Aumentar para 100 TPS
```

### Adicionar Novos Rounds
Adicione novos rounds em `config.yaml` seguindo o padrão existente.

### Modificar Gas Limits
Ajuste os valores de gas em `cbsdnetworkconfig.json` conforme necessário.

## 🔗 Recursos Adicionais

- [Hyperledger Caliper Documentation](https://hyperledger.github.io/caliper/)
- [Hyperledger Besu Documentation](https://besu.hyperledger.org/)
- [Solidity Documentation](https://docs.soliditylang.org/) 