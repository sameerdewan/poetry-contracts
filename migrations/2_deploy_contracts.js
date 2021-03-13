const Poetry = artifacts.require('Poetry');
const fs = require('fs');

module.exports = function(deployer) {
    deployer.deploy(Poetry, 'v1')
        .then(poetry => {
            const contractData = {
                address: poetry.address,
                abi: poetry.abi
            }
            if (process.env.ENV === 'DEVELOPMENT') {
                fs.writeFileSync('../../../appdata/contractData.json', JSON.stringify(contractData, null, '\t', 'utf-8'));
            } else if (process.env.ENV === 'PRODUCTION') {
                fs.writeFileSync('./contractData.json', JSON.stringify(contractData, null, '\t', 'utf-8'));
            }
        });
}
