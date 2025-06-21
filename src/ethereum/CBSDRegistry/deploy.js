const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

async function main() {
    const web3 = new Web3('ws://localhost:8546');
    const abiPath = path.resolve(__dirname, 'build', 'CBSDRegistry.abi');
    const binPath = path.resolve(__dirname, 'build', 'CBSDRegistry.bin');

    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const bytecode = '0x' + fs.readFileSync(binPath, 'utf8');

    const deployerAddress = '0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09';
    const privateKey = '0x797c13f7235c627f6bd013dc17fff4c12213ab49abcf091f77c83f16db10e90b';

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    console.log(`Attempting to deploy from account: ${account.address}`);

    const contract = new web3.eth.Contract(abi);

    const deployTx = contract.deploy({
        data: bytecode,
        arguments: [],
    });

    try {
        const gas = await deployTx.estimateGas({
            from: account.address
        });
        const gasPrice = await web3.eth.getGasPrice();

        console.log(`Estimated gas: ${gas}`);
        console.log(`Gas price: ${gasPrice}`);

        const deployedContract = await deployTx.send({
            from: account.address,
            gas,
            gasPrice,
        });

        console.log('Contract deployed at address:', deployedContract.options.address);
    } catch (error) {
        console.error('Error deploying contract:', error);
    }

    web3.currentProvider.disconnect();
}

main(); 