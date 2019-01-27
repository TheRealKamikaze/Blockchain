const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
function Blockchain(currentNodeUrl){
	this.chain = [];			//all the blocks that are mined will be stored in this array
	this.pendingTransactions = [];	// all the new transactions will be stored here before they are placed in a block i.e. before verification
	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];
	this.createNewBlock(2210,'lose yourself','in the music'); //genesis block
}

// Using class
// class Blockchain{
// 	constructor(){
// 		this.chain = [];			//all the blocks that are mined will be stored in this array
// 		this.newTransactions = [];	// all the new transactions will be stored here before they are placed in a block i.e. before verification		
// 	}

// 	//.... all the functions
// }

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length+1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,		//arbitrary number used only once, proof of work
		hash: hash,
		previousBlockHash: previousBlockHash
	};
	this.pendingTransactions = [];	//emptying the array for new transactions
	this.chain.push(newBlock);	//pushing the block into the chain

	return newBlock;
};

Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length-1];
};

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient
	};
	this.pendingTransactions.push(newTransaction);
	return this.getLastBlock()['index'] +1;		//returning the number of the block this transaction will be added to if validated
};

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	// repeatedly hash block until we find a specific hash i.e. starting with four zeroes in apna case by changing nonce value
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while(hash.substring(0,4)!=='0000'){
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
		//console.log(hash);
	}
	return nonce;
}; 

module.exports= Blockchain;