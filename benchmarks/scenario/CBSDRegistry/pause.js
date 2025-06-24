'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class PauseWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule() {
        // Executado antes do round começar
    }

    async submitTransaction() {
        const pauseDurationMs = 10000; // Pausa de 10 segundos
        // console.log(`⏸️  Pausando por ${pauseDurationMs / 1000} segundos...`);
        await new Promise(resolve => setTimeout(resolve, pauseDurationMs));
    }

    async cleanupWorkloadModule() {
        // Executado após o round terminar
    }
}

function createWorkloadModule() {
    return new PauseWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
