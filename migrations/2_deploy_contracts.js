const Poetry = artifacts.require('Poetry');

module.exports = function(deployer) {
    deployer.deploy(Poetry, 'v1');
}
