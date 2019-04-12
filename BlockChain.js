/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require("crypto-js/sha256");
const LevelSandbox = require("./LevelSandbox.js");
const Block = require("./Block.js");

class Blockchain {
  constructor() {
    this.blockHeight;
    this.bd = new LevelSandbox.LevelSandbox();
    this.generateGenesisBlock();
  }

  // Helper method to create a Genesis Block (always with height= 0)
  // You have to options, because the method will always execute when you create your blockchain
  // you will need to set this up statically or instead you can verify if the height !== 0 then you
  // will not create the genesis block
  generateGenesisBlock() {
    // Add your code here
    this.getBlockHeight()
      .then(height => {
        this.blockHeight = height;
        if (height === -1) {
          this.addBlock(
            new Block.Block("First block in the chain - Genesis block")
          );
          console.log("Genesis block");
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Get block height, it is a helper method that return the height of the blockchain
  async getBlockHeight() {
    return await this.bd.getBlocksCount();
  }

  async getBlockByHash(hash) {
    return await this.bd.getBlockByHash(hash);
    /*  return new Promise((resolve, reject) => {
      levelDB
        .getBlockByHash(hash)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    }); */
  }

  //get Block by wallet address, use to store the star data
  async getBlockByWalletAddress(walletAddress) {
    return await this.bd.getBlockByWalletAddress(walletAddress);
  }

  // Add new block
  async addBlock(newBlock) {
    const height = parseInt(await this.getBlockHeight());
    // Block height
    newBlock.height = this.blockHeight + 1;
    // UTC timestamp
    newBlock.time = new Date()
      .getTime()
      .toString()
      .slice(0, -3);

    // previous block hash
    if (newBlock.height > 0) {
      const previousBlock = JSON.parse(await this.getBlock(height));
      newBlock.previousblockhash = previousBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    this.blockHeight = newBlock.height;

    // Adding block object to chain

    return await this.bd.addLevelDBData(
      newBlock.height,
      JSON.stringify(newBlock)
    );
  }
  // Get Block By Height

  async getBlock(blockHeight) {
    // return object as a single string

    //return JSON.parse(await this.bd.getLevelDBData(blockHeight));
    return await this.bd.getLevelDBData(blockHeight);
  }

  // Validate if Block is being tampered by Block Height
  // validate block
  async validateBlock(blockHeight) {
    // get block object
    let block = await this.getBlock(blockHeight);
    //  console.log("current blockHeight" + blockHeight);

    // get block hash
    let blockHash = block.hash;
    // console.log("blockHash - " + blockHash);
    // remove block hash to test block integrity
    block.hash = "";
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    //console.log("valid BlockHash - " + validBlockHash);
    // Compare
    if (blockHash === validBlockHash) {
      return true;
    } else {
      console.log(
        "Block #" +
          blockHeight +
          " invalid hash:\n" +
          blockHash +
          "<>" +
          validBlockHash
      );
      return false;
    }
  }

  // Validate blockchain
  async validateChain() {
    let errorLog = [];
    let previousHash = "";
    let isBlockValid = false;
    const height = await this.bd.getBlocksCount();
    //   console.log("blockHeight - " + height);
    for (var i = 0; i < height; i++) {
      this.getBlock(i).then(block => {
        // validate block
        //   console.log("getblockHeight - " + block.height);
        isBlockValid = this.validateBlock(block.height);
        if (!isBlockValid) {
          errorLog.push(i);
          console.log("Block #" + height + " invalido");
        }
        if (block.previousBlockHash !== previousHash) {
          errorLog.push(i);
          console.log(
            "Block #" +
              i +
              " invalid hash:\n" +
              previousHash +
              "<>" +
              block.previousBlockHash
          );
        }
        previousHash = block.hash;
        if (this.blockHeight === block.height) {
          if (errorLog.length > 0) {
            console.log("Block errors = " + errorLog.length);
            console.log("Blocks: " + errorLog);
          } else {
            console.log("No errors detected");
          }
        }
      });
    }
  }

  // Utility Method to Tamper a Block for Test Validation
  // This method is for testing purpose
  _modifyBlock(height, block) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.bd
        .addLevelDBData(height, JSON.stringify(block).toString())
        .then(blockModified => {
          resolve(blockModified);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
}

module.exports.Blockchain = Blockchain;
