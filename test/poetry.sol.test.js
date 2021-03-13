const truffleAssert = require('truffle-assertions');
const Poetry = artifacts.require('Poetry');

contract('Poetry', async (accounts) => {
    const owner = accounts[0];
    const allowed = accounts[1];
    const unallowed = accounts[2];
    const version = 'v1';

    it('Poetry contract should require version field to deploy', async () => {
        let didNotDeploy = false;
        let errorMsg;
        try {
            await Poetry.new();
        } catch (error) {
            errorMsg = error.message;
            didNotDeploy = true;
        }
        assert.equal(didNotDeploy, true);
        assert.equal(errorMsg, 'Invalid number of parameters for "undefined". Got 0 expected 1!');
    });
    it('Poetry contract should deploy', async () => {
        let didDeploy = false;
        try {
            await Poetry.new(version);
            didDeploy = true;
        } catch {}
        assert.equal(didDeploy, true);
    });
});
