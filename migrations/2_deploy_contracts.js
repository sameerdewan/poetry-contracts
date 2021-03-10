const Poetry = artifacts.require('Poetry');
const fs = require('fs');

module.exports = function(deployer) {
    deployer.deploy(Poetry, 'v1')
        .then(poetry => {
            const contractData = {
                address: poetry.address,
                abi: poetry.abi
            }
            fs.writeFileSync('./contractData.json', JSON.stringify(contractData, null, '\t', 'utf-8'));
            if (process.env.ENV === 'DEVELOPMENT') {
                fs.writeFileSync('../../../appdata/contractData.json', JSON.stringify(contractData, null, '\t', 'utf-8'));
            }
        });
}
