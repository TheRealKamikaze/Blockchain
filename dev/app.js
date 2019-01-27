//nodemon package is used to restart the server anytime a file is changed and saved
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const uuid = require('uuid/v1');
const blockchain = require('./blockchain');
const requestp = require('request-promise');
const port = process.argv[2];
const nodeAddress = uuid().split('-').join('');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

var blockChain = new blockchain(process.argv[3]);


app.get('/blockchain',function(req,res){
	res.send(blockChain);
})

app.post('/transaction',function(req,res){
	const blockIndex = blockChain.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	res.json({note: 'transaction will be added in block ${blockIndex}.'});
});

app.get("/mine",function(req,res){
	// if(blockChain.pendingTransactions.length==0){
	// 	res.json({note: 'no transactions to add'});
	// }else{
		const currentBlockData = {
			transactions: blockChain.pendingTransactions,
			index: blockChain.getLastBlock()['index']+1
		}
		blockChain.createNewTransaction(12.5, '00', nodeAddress)
		const block = blockChain.createNewBlock(blockChain.proofOfWork(blockChain.getLastBlock()['hash'],currentBlockData),blockChain.getLastBlock()['hash'],blockChain.hashBlock(blockChain.getLastBlock()['hash'],currentBlockData,blockChain.proofOfWork(blockChain.getLastBlock()['hash'],currentBlockData)));
		res.send(blockChain);
	// }
})

//register a node and broadcast it to the network
app.post("/register-and-broadcast-node",function(req,res){
	const newNodeUrl = req.body.newNodeUrl;
	if(blockChain.networkNodes.indexOf(newNodeUrl)===-1 && blockChain.currentNodeUrl !== newNodeUrl){
		blockChain.networkNodes.push(newNodeUrl);
	}
	var registerPromises = [];
	for (var i = 0; i < blockChain.networkNodes.length; i++) {
		//console.log("in");
		options={
			url: blockChain.networkNodes[i] + '/register-node',
			method: 'POST',
			body: {newNodeUrl: newNodeUrl},
			json: true
		};
		registerPromises.push(requestp(options));
	}
	Promise.all(registerPromises)
	.then(data => {
		options={
			url: newNodeUrl + '/register-nodes-bulk',
			method: 'post',
			body: {allNetworlNodesUrl: [...blockChain.networkNodes,blockChain.currentNodeUrl]},
			json: true
		};
		return requestp(options);
	})
	.then(data => {
		console.log('node ready to use');
	})
	.catch(function(err){
		console.log(err);
	})
});

//register the node after broadcast
app.post('/register-node',function(req,res){
	const newNodeUrl = req.body.newNodeUrl;
	if(blockChain.networkNodes.indexOf(newNodeUrl) == -1 && blockChain.currentNodeUrl !== newNodeUrl){
		blockChain.networkNodes.push(newNodeUrl);
		res.json({note: 'Successfully Registered'});	
	}else{
		res.json({note: "Node exists or the same node"});
	}
});

//register nodes in bulk
app.post('/register-nodes-bulk',function(req,res) {
	const allNetworlNodesUrl = req.body.allNetworlNodesUrl;
	allNetworlNodesUrl.forEach(function(networkNode){
		console.log(blockChain.currentNodeUrl);
		if(blockChain.networkNodes.indexOf(networkNode) === -1 && blockChain.currentNodeUrl !== networkNode){
			blockChain.networkNodes.push(networkNode);
		}
	})
	res.json({note: 'Bulk registration Successful'});
});

app.listen(port,function(){
	console.log("Blockchain hears on port "+port+"!!");
})

//npm i uuid for finding the address
//npm i request-promise --save