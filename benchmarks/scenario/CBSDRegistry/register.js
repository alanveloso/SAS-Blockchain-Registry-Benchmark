'use strict';

const CbsdBase = require('./utils/cbsd-base');

class RegisterCbsdWorkload extends CbsdBase {
    constructor() {
        super();
    }

    async submitTransaction() {
        const cbsdId = Math.floor(Math.random() * 1000000);
        // const workerIndex = Number.isInteger(this.workerIndex) ? this.workerIndex : 0;
        // const txIndex = Number.isInteger(this.txIndex) ? this.txIndex : 0;

        // const cbsdId = workerIndex * 1_000_000 + txIndex;
        const cbsdAddress = '0x' + Math.random().toString(16).substr(2, 40).padEnd(40, '0');
        const grantAmount = Math.floor(Math.random() * 1000);

        const args = [cbsdId, cbsdAddress, grantAmount];
        
        await this.sutAdapter.sendRequests(this.createConnectorRequest('registerCBSD', args));
        
        this.cbsdState.addRegisteredId(cbsdId);
    }
}

function createWorkloadModule() {
    return new RegisterCbsdWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule; 