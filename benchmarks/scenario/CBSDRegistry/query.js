'use strict';

const CbsdBase = require('./utils/cbsd-base');

class QueryCbsdWorkload extends CbsdBase {
    constructor() {
        super();
    }

    async submitTransaction() {
        const cbsdId = this.cbsdState.getRandomRegisteredId();
        
        const args = [cbsdId];

        await this.sutAdapter.sendRequests(this.createConnectorRequest('getCBSDInfo', args));
    }
}

function createWorkloadModule() {
    return new QueryCbsdWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule; 