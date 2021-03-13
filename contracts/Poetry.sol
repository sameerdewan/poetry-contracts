// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Poetry {
    address public owner;
    string public contractVersion;
    mapping(address => bool) public allowed;

    struct HashRecord {
        string _username;
        string _fileName;
        string _hash;
        bool _exists;
    }
    mapping(string => HashRecord) public hashRecords;
    mapping(string => string[]) public users;
    mapping(string => uint256) public usersRecordCounts;

    constructor(string memory version) public {
        owner = msg.sender;
        contractVersion = version;
    } 

    modifier onlyOwner() {
        require(msg.sender == owner, 'Error: Permissions @modifier::onlyOwner()');
        _;
    }

    modifier onlyAllowed() {
        require(msg.sender == owner || allowed[msg.sender] == true, 'Error: Permissions @modifier::onlyAllowed()');
        _;
    }

    modifier doesNotExistAlready(string memory _hash) {
        require(hashRecords[_hash]._exists == false, 'Error: Hash exists @modifier::doesNotExistAlready()');
        _;
    }

    function setPermissions(address permissioned, bool value) external onlyOwner {
        allowed[permissioned] = value;
    }

    function transferOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function compose(string memory _username, string memory _fileName, string memory _hash) external onlyAllowed doesNotExistAlready(_hash) {
        hashRecords[_hash] = HashRecord({
            _username: _username,
            _fileName: _fileName,
            _hash: _hash,
            _exists: true
        });
        users[_username].push(_hash);
        usersRecordCounts[_username] = usersRecordCounts[_username] + 1;
    }

    function getRecord(string memory _hash) external view returns(string memory, string memory, string memory, bool) {
        string memory _username = hashRecords[_hash]._username;
        string memory _fileName = hashRecords[_hash]._fileName;
        bool _exists = hashRecords[_hash]._exists;
        return(_hash, _username, _fileName, _exists);
    }
}
