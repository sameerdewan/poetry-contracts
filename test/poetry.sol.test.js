const truffleAssert = require('truffle-assertions');
const Poetry = artifacts.require('Poetry');

contract('Poetry', async (accounts) => {
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
});
