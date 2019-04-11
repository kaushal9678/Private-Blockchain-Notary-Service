<<<<<<< HEAD
# Private-Blockchain-Notary-Service
It's a blockchain project that will allow you how to create a Private Blockchain Notary Service using express.js
=======
# Project #2. Private Blockchain

This is Project 2, Private Blockchain, in this project I created the classes to manage my private blockchain, to be able to persist my blochchain I used LevelDB.



## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node app.js__ or __nodemon app.js__ in the root directory.
4. I used __express.js__ node framework for this project. 
5. When you run above command it will initialise __LevelDB__ data with __Genesis block__.

## Node.js framework and database
 1. __Express.js__ framework is used
 2. __LevelDB__ is used as a database for this project.


## Testing the project

1. To add block in database open postman and  use URL like following __http://localhost:8000/block__ in __body section__ type key __body__ __text anything__
you will get a response __block Added__
2. To retrieve this __block__ using __GET__ method hit like following URL __http://localhost:8000/block/1__
3. Result will return full detail of __block__

## Endpoint documentation
1. __GET__ request endpoints are hit using __http://localhost:8000/block/index__
2. __POST__ request endpoints are hit using __http://localhost:8000/block__ and parameter for this is __body__


The file __simpleChain.js__ in the root directory has all the code to be able to test the project, please review the comments in the file and uncomment the code to be able to test each feature implemented:

* Uncomment the function:
```
(function theLoop (i) {
	setTimeout(function () {
		let blockTest = new Block.Block("Test Block - " + (i + 1));
		myBlockChain.addNewBlock(blockTest).then((result) => {
			console.log(result);
			i++;
			if (i < 10) theLoop(i);
		});
	}, 10000);
  })(0);
```
This function will create 10 test blocks in the chain.
* Uncomment the function
```
myBlockChain.getBlockChain().then((data) => {
	console.log( data );
})
.catch((error) => {
	console.log(error);
})
```
This function print in the console the list of blocks in the blockchain
* Uncomment the function
```
myBlockChain.getBlock(0).then((block) => {
	console.log(JSON.stringify(block));
}).catch((err) => { console.log(err);});

```
This function get from the Blockchain the block requested.
* Uncomment the function
```
myBlockChain.validateBlock(0).then((valid) => {
	console.log(valid);
})
.catch((error) => {
	console.log(error);
})
```
This function validate and show in the console if the block is valid or not, if you want to modify a block to test this function uncomment this code:
```
myBlockChain.getBlock(5).then((block) => {
	let blockAux = block;
	blockAux.body = "Tampered Block";
	myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
		if(blockModified){
			myBlockChain.validateBlock(blockAux.height).then((valid) => {
				console.log(`Block #${blockAux.height}, is valid? = ${valid}`);
			})
			.catch((error) => {
				console.log(error);
			})
		} else {
			console.log("The Block wasn't modified");
		}
	}).catch((err) => { console.log(err);});
}).catch((err) => { console.log(err);});

myBlockChain.getBlock(6).then((block) => {
	let blockAux = block;
	blockAux.previousBlockHash = "jndininuud94j9i3j49dij9ijij39idj9oi";
	myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
		if(blockModified){
			console.log("The Block was modified");
		} else {
			console.log("The Block wasn't modified");
		}
	}).catch((err) => { console.log(err);});
}).catch((err) => { console.log(err);});
```
* Uncomment this function:
```
myBlockChain.validateChain().then((errorLog) => {
	if(errorLog.length > 0){
		console.log("The chain is not valid:");
		errorLog.forEach(error => {
			console.log(error);
		});
	} else {
		console.log("No errors found, The chain is Valid!");
	}
})
.catch((error) => {
	console.log(error);
})
```

This function validates the whole chain and return a list of errors found during the validation.

## What do I learned with this Project

* I was able to identify the basic data model for a Blockchain application.
* I was able to use LevelDB to persist the Blockchain data.
* I was able to write algorithms for basic operations in the Blockchain.
>>>>>>> In this commit Following things are implemented
