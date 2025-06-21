'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

// Endereço do contrato implantado
const CONTRACT_ADDRESS = '0x588108d3eAB34e94484d7cdA5a1D31804cA96FE7';

// ABI do contrato CBSDRegistry
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "cbsdId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "cbsdAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "grantAmount",
        "type": "uint256"
      }
    ],
    "name": "CBSDRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "cbsdId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newGrantAmount",
        "type": "uint256"
      }
    ],
    "name": "GrantAmountUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "cbsdId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "newStatus",
        "type": "string"
      }
    ],
    "name": "StatusUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "cbsds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "cbsdAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "grantAmount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getCBSDInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_cbsdAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_grantAmount",
        "type": "uint256"
      }
    ],
    "name": "registerCBSD",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_newGrantAmount",
        "type": "uint256"
      }
    ],
    "name": "updateGrantAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_newStatus",
        "type": "string"
      }
    ],
    "name": "updateStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Classe de estado para compartilhar os IDs registrados
class CbsdState {
    constructor() {
        this.registeredIds = [];
    }

    addRegisteredId(id) {
        this.registeredIds.push(id);
    }

    getRandomRegisteredId() {
        if (this.registeredIds.length === 0) {
            throw new Error('No CBSD IDs have been registered yet.');
        }
        const randomIndex = Math.floor(Math.random() * this.registeredIds.length);
        return this.registeredIds[randomIndex];
    }
}

// Objeto de estado compartilhado globalmente
const cbsdState = new CbsdState();

/**
 * Base class for CBSDRegistry operations.
 */
class CbsdBase extends WorkloadModuleBase {
    /**
     * Initializes the base class.
     */
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        this.cbsdState = cbsdState;
    }

    /**
     * Assemble a connector-specific request from the business parameters.
     * @param {string} operation The name of the operation to invoke.
     * @param {object} args The object containing the arguments.
     * @return {object} The connector-specific request.
     * @protected
     */
    createConnectorRequest(operation, args) {
        return {
            contract: 'CBSDRegistry',
            contractAddress: CONTRACT_ADDRESS,
            contractABI: CONTRACT_ABI,
            verb: operation,
            args: args,
            readOnly: (operation === 'getCBSDInfo')
        };
    }
}

module.exports = CbsdBase; 