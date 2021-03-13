const Poetry = artifacts.require('Poetry');

contract('Poetry', async (accounts) => {
    const owner = accounts[0];
    const allowed = accounts[1];
    const unallowed = accounts[2];
    const transferredToOwner = accounts[3];
    const version = 'v1';

    const username = 'username';
    const fileName = 'file.pdf';
    const hash = '02bc4a6398ba8baa247951acd0cd36b9171f7bbd1960b049bb83caf5037e5fa6';

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
    it('Poetry contract version should equal constructor passed contract version', async () => {
        const contract = await Poetry.new(version);
        const contractVersion = await contract.contractVersion.call();
        assert.equal(contractVersion, version);
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
    it('Allowed cannot call setPermissions(), with or without permissions', async () => {
        const contract = await Poetry.new(version, { from: owner });
        let prePermissionCallSucceeded = true, postPermissionCall = true;
        let errorMsg1 = '', errorMsg2 = '';
        try {
            await contract.setPermissions(allowed, true, { from: allowed });
        } catch (error) {
            prePermissionCallSucceeded = false;
            errorMsg1 = error.message;
        }
        try {
            await contract.setPermissions(allowed, true);
            await contract.setPermissions(allowed, true, { from: allowed });
        } catch (error) {
            postPermissionCall = false;
            errorMsg2 = error.message;
        }
        assert.equal(prePermissionCallSucceeded, false);
        assert.equal(errorMsg1.includes('Error: Permissions @modifier::onlyOwner()'), true);
        assert.equal(postPermissionCall, false);
        assert.equal(errorMsg2.includes('Error: Permissions @modifier::onlyOwner()'), true);
    });
    it('Owner can call transferOwner() and successfully transfer the owner to test unit transferredToOwner', async () => {
        const contract = await Poetry.new(version);
        let calledTransferOwnerSuccessfully = false;
        try {
            await contract.transferOwner(transferredToOwner);
            calledTransferOwnerSuccessfully = true;
        } catch {}
        const newOwner = await contract.owner.call();
        assert.equal(calledTransferOwnerSuccessfully, true);
        assert.equal(newOwner, transferredToOwner);
    });
    it('Allowed cannot call transferOwner(), with or without permissions', async () => {
        const contract = await Poetry.new(version, { from: owner });
        let failedToTransferOwnerPrePermission = false, failedToTransferOwnerPostPermission = false;
        let errorMsg1 = '', errorMsg2 = '';
        try {
            await contract.transferOwner(transferredToOwner, { from: allowed });
        } catch (error) {
            failedToTransferOwnerPrePermission = true;
            errorMsg1 = error.message;
        }
        try {
            await contract.setPermissions(allowed, true, { from: owner });
            await contract.transferOwner(allowed, { from: allowed });
        } catch (error) {
            failedToTransferOwnerPostPermission = true;
            errorMsg2 = error.message;
        }
        assert.equal(failedToTransferOwnerPrePermission, true);
        assert.equal(errorMsg1.includes('Error: Permissions @modifier::onlyOwner()'), true);
        assert.equal(failedToTransferOwnerPostPermission, true);
        assert.equal(errorMsg2.includes('Error: Permissions @modifier::onlyOwner()'), true);
    });
    it('Owner can call compose() and can successfully create a proof, tested by calling getRecord()', async () => {
        const contract = await Poetry.new(version);
        let canCallCompose = false, canCallGetRecord = false, record = {};
        try {
            await contract.compose(username, fileName, hash);
            canCallCompose = true;
        } catch {}
        try {
            const response = await contract.getRecord(hash);
            canCallGetRecord = true;
            record.username = response[0];
            record.fileName = response[1];
            record.hash = response[2];
            record.exists = response[3];
        } catch {}
        assert.equal(canCallCompose, true);
        assert.equal(canCallGetRecord, true);
        assert.equal(record.username, username);
        assert.equal(record.fileName, fileName);
        assert.equal(record.hash, hash);
        assert.equal(record.exists, true);
    });
    it('Allowed can call compose() and can successfully create a proof, tested by calling getRecord()', async () => {
        const contract = await Poetry.new(version, { from: owner });
        let canCallCompose = false, canCallGetRecord = false, record = {};
        await contract.setPermissions(allowed, true, { from: owner });
        try {
            await contract.compose(username, fileName, hash, { from: allowed });
            canCallCompose = true;
        } catch {}
        try {
            const response = await contract.getRecord(hash, { from: allowed });
            canCallGetRecord = true;
            record.username = response[0];
            record.fileName = response[1];
            record.hash = response[2];
            record.exists = response[3];
        } catch {}
        assert.equal(canCallCompose, true);
        assert.equal(canCallGetRecord, true);
        assert.equal(record.username, username);
        assert.equal(record.fileName, fileName);
        assert.equal(record.hash, hash);
        assert.equal(record.exists, true);
    });
    it('Unallowed can not call compose()', async () => {
        const contract = await Poetry.new(version, { from: owner });
        let canCallCompose = true;
        let errorMsg = '';
        try {
            await contract.compose(username, fileName, hash, { from: unallowed });
        } catch (error) {
            canCallCompose = false;
            errorMsg = error.message;
        }
        assert.equal(canCallCompose, false);
        assert.equal(errorMsg.includes('Error: Permissions @modifier::onlyAllowed()'), true);
    });
    it('Unallowed can call getRecord()', async () => {
        const contract = await Poetry.new(version, { from: owner });
        let canCallGetRecord = false;
        await contract.compose(username, fileName, hash, { from: owner });
        try {
            await contract.getRecord(hash, { from: unallowed });
            canCallGetRecord = true;
        } catch {}
        assert.equal(canCallGetRecord, true);
    });
});
