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
    it('Poetry contract owner should equal test unit set owner', async () => {
        const contract = await Poetry.new(version, { from: owner });
        const contractOwner = await contract.owner.call();
        assert.equal(owner, contractOwner);
    });
    it('Poetry contract owner should not equal any other address other than test unit owner', async () => {
        const contract = await Poetry.new(version, { from: owner });
        const contractOwner = await contract.owner.call();
        assert.notEqual(contractOwner, allowed);
        assert.notEqual(contractOwner, unallowed);
    });
    it('Owner can call setPermissions() and successfully set permissions for test unit allowed', async () => {
        const contract = await Poetry.new(version, { from: owner });
        const permissionsPreGrant = await contract.allowed.call(allowed);
        assert.equal(permissionsPreGrant, false);
        await contract.setPermissions(allowed, true);
        const permissionsPostGrant = await contract.allowed.call(allowed);
        assert.equal(permissionsPostGrant, true);
    });
});
