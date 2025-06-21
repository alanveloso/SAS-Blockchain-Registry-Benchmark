const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

async function main() {
    const web3 = new Web3('ws://localhost:8546');

    const abiPath = path.join(__dirname, 'Simplest.abi');
    const binPath = path.join(__dirname, 'Simplest.bin');

    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const bytecode = '0x' + fs.readFileSync(binPath, 'utf8');

    const deployerAddress = '0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09';
    const deployerPrivateKey = '0x797c13f7235c627f6bd013dc17fff4c12213ab49abcf091f77c83f16db10e90b';

    const SimplestContract = new web3.eth.Contract(abi);

    const deployTx = SimplestContract.deploy({
        data: bytecode,
        arguments: []
    });

    const gas = await deployTx.estimateGas({ from: deployerAddress });
    const gasPrice = await web3.eth.getGasPrice();

    const tx = {
        from: deployerAddress,
        data: deployTx.encodeABI(),
        gas,
        gasPrice
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, deployerPrivateKey);
    console.log('Deploying contract...');
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Contract deployed at address: ${receipt.contractAddress}`);
    process.exit(0);
}

main().catch(error => {
    console.error(error);
    process.exit(1);
}); 