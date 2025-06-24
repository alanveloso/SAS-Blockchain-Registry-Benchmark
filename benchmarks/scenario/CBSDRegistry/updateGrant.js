'use strict';

const CbsdBase = require('./utils/cbsd-base');

class UpdateGrantAmountWorkload extends CbsdBase {
    constructor() {
        super();
    }

    async submitTransaction() {
        const cbsdId = this.cbsdState.getRandomRegisteredId();
        const newGrantAmount = Math.floor(Math.random() * 500);

        const args = [cbsdId, newGrantAmount];
        
        try {
            await this.sutAdapter.sendRequests(this.createConnectorRequest('updateGrantAmount', args));
        } catch (error) {
            console.error(`❌ Erro ao atualizar grant para CBSD ${cbsdId}: ${error.message}`);
        }
        
    }
}

function createWorkloadModule() {
    return new UpdateGrantAmountWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule; 