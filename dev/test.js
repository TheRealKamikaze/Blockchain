const Blockchain = require('./blockchain');

const someCoin	= new Blockchain();

someCoin.createNewBlock(123, '09dsfyusldkfjsd', 'd5f4sdfjhfs8fsdfjksf');
someCoin.createNewTransaction(100,'em','me');
someCoin.createNewBlock(124, '09dsfyusldkfjs', '5f4sdfjhfs8fsdfjksf');


console.log(someCoin.hashBlock(someCoin.getLastBlock()['hash'],"blah blahapity bhup blah, hippty hoop la",someCoin.proofOfWork(someCoin.getLastBlock()['hash'],"blah blahapity bhup blah, hippty hoop la")));
