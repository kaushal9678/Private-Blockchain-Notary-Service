# Project 4 Private-Blockchain-Notary-Service

**It's a blockchain project that will allow you how to create a Private Blockchain Notary Service using express.js**

Following libraries are required for this project

 **bitcoinjs-lib**

A javascript Bitcoin library for node.js

 **bitcoinjs-message**

To verify address, signature and message #**crypto-js**
JavaScript library of crypto standards like **SHA256** or **AES** .

 **level**

 it is used for database

# Project #2. Private Blockchain

This is Project 2, Private Blockchain, in this project I created the classes to manage my private blockchain, to be able to persist my blochchain I used LevelDB.

## Setup project for Review.

To setup the project for review do the following:

1. Download the project.
2. Run command **npm install** to install the project dependencies.
3. Run command **node app.js** or **nodemon app.js** in the root directory.
4. I used **express.js** node framework for this project.
5. When you run above command it will initialise **LevelDB** data with **Genesis block**.

## Node.js framework and database

1.  **Express.js** framework is used
2.  **LevelDB** is used as a database for this project.

## Testing the project

1. To add block in database open postman and use URL like following **http://localhost:8000/block** in **body section** type key **body** **text anything**
   you will get a response **block Added**
2. To retrieve this **block** using **GET** method hit like following URL **http://localhost:8000/block/1**
3. Result will return full detail of **block**

## Endpoint documentation

1. **GET** request endpoints are hit using **http://localhost:8000/block/index**
2. **POST** request endpoints are hit using **http://localhost:8000/block** and parameter for this is **body**

The file **simpleChain.js** in the root directory has all the code to be able to test the project, please review the comments in the file and uncomment the code to be able to test each feature implemented:

- Uncomment the function:

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

- Uncomment the function

```
myBlockChain.getBlockChain().then((data) => {
	console.log( data );
})
.catch((error) => {
	console.log(error);
})
```

This function print in the console the list of blocks in the blockchain

- Uncomment the function

```
myBlockChain.getBlock(0).then((block) => {
	console.log(JSON.stringify(block));
}).catch((err) => { console.log(err);});

```

This function get from the Blockchain the block requested.

- Uncomment the function

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

- Uncomment this function:

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

- I was able to identify the basic data model for a Blockchain application.
- I was able to use LevelDB to persist the Blockchain data.
- I was able to write algorithms for basic operations in the Blockchain.
  > > > > > > > In this commit Following things are implemented
