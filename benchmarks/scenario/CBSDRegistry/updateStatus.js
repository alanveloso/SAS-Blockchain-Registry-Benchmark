'use strict';

const CbsdBase = require('./utils/cbsd-base');

class UpdateStatusWorkload extends CbsdBase {
    constructor() {
        super();
    }

    async submitTransaction() {
        const cbsdId = this.cbsdState.getRandomRegisteredId();
        const statuses = ['registered', 'granted', 'authorized', 'revoked'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

        const args = [cbsdId, newStatus];
        
        await this.sutAdapter.sendRequests(this.createConnectorRequest('updateStatus', args));
    }
}

function createWorkloadModule() {
    return new UpdateStatusWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule; 