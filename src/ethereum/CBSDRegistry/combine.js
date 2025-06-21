const fs = require('fs');
const path = require('path');

const abiPath = path.join(__dirname, 'build', 'CBSDRegistry.abi');
const binPath = path.join(__dirname, 'build', 'CBSDRegistry.bin');

const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
const bytecode = fs.readFileSync(binPath, 'utf8');

const contractJson = {
    abi,
    bytecode: '0x' + bytecode
};

const outputPath = path.join(__dirname, 'CBSDRegistry.json');
fs.writeFileSync(outputPath, JSON.stringify(contractJson, null, 2));

console.log('CBSDRegistry.json created successfully.'); 