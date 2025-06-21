# SAS Blockchain Registry Benchmark

Este repositório contém um benchmark de performance para o contrato inteligente **CBSDRegistry** (Citizen Broadband Radio Service Device Registry) usando o Hyperledger Caliper.

## 📋 Pré-requisitos

- **Docker** e **Docker Compose** instalados
- **Node.js** (versão 16 ou superior - testado com v22.16.0)
- **Git**

## 🚀 Configuração Inicial

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/alanveloso/SAS-Blockchain-Registry-Benchmark.git
   cd SAS-Blockchain-Registry-Benchmark
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o binding do Caliper para Besu:**
   ```bash
   npx caliper bind --caliper-bind-sut besu:latest
   ```

4. **Deploy Manual do Contrato (necessário apenas uma vez):**
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