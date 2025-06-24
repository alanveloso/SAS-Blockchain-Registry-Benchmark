'use strict';

const CbsdBase = require('./utils/cbsd-base');

class RegisterConfirmedCbsdWorkload extends CbsdBase {
    constructor() {
        super();
    }

    async submitTransaction() {
        let success = false;

        while (!success) {
            const cbsdId = Math.floor(Math.random() * 1_000_000);
            const cbsdAddress = '0x' + Math.random().toString(16).substr(2, 40).padEnd(40, '0');
            const grantAmount = Math.floor(Math.random() * 1000);
            const args = [cbsdId, cbsdAddress, grantAmount];

            try {
                const result = await this.sutAdapter.sendRequests(
                    this.createConnectorRequest('registerCBSD', args)
                );

                // Sucesso se não der erro e status for true (Caliper responde status: 'success')
                if (result && result.status === 'success') {
                    this.cbsdState.addRegisteredId(cbsdId);
                    success = true;
                }
            } catch (error) {
                // Pode ser ID repetido ou outro erro — tenta outro
                console.warn(`⚠️ Falha ao registrar ID ${cbsdId}, tentando outro. Motivo: ${error.message}`);
            }
        }
    }
}

function createWorkloadModule() {
    return new RegisterConfirmedCbsdWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
