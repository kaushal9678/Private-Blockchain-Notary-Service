const SHA256 = require("crypto-js/sha256");
const BlockClass = require("./Block.js");
const BlockChainClass = require("./BlockChain.js");
const LevelSandbox = require("./LevelSandbox.js");
const bitcoin = require("bitcoinjs-lib");
const bitcoinMessage = require("bitcoinjs-message");
const hextoascii = require("hex2ascii");
// Http library
const http = require("http");

/**
 * Controller Definition to encapsulate routes to work with blocks
 */

class BlockController {
  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app
   */

  constructor(app) {
    this.app = app;
    this.blocks = [];
    this.blockchain = new BlockChainClass.Blockchain();
    this.bd = new LevelSandbox.LevelSandbox();
    this.getBlockByHeight();
    this.getBlockWalletAddress();
    this.getBlockByHash();
    this.getBlockByIndex();
    this.postNewBlock();
  }

  /**
   * Implement getBlockByKey function asynchronously  to getdata by key
   */
  async getBlockByHashKey(hash) {
    try {
      return await this.bd.getBlockByHash(hash); // check key in database and return response
    } catch (error) {
      console.log("defined key not found");
      return "Defined key not found";
    }
  }

  getBlockByHash() {
    this.app.get("/stars/hash:hash", (req, res) => {
      try {
        let blockHash = req.params.hash;
       blockHash = blockHash.replace(/^:/, "");
        console.log("\nblockHash:======", blockHash);
        if (blockHash == null) {
          return res.status(201).json({
            message: "Invalid Block",
            error: 1
          });
        }
        if (blockHash.length == 0) {
          return res.status(201).json({
            message: "Block Hash is missing",
            error: 1
          });
        }

        this.getBlockByHashKey(blockHash)
          .then(block => {
            if (block) {
              // check if block exist then decode star data and return JSON
              let blockResult = JSON.parse(block.value);
              if (blockResult.height != 0) {
                let body = blockResult.body;
                let star = JSON.parse(body.star);
                body.star = star;
                let story = star.story;
                blockResult.body = body;

                // below line convert hex to utf8 string human readable with the help of Buffer
                blockResult.body.star.story = Buffer.from(
                  story,
                  "utf8"
                ).toString("hex");

                // below line convert string to hex string with the help of Buffer and code utf8 for string to hex
                blockResult.body.star.storyDecoded = Buffer.from(
                  blockResult.body.star.story,
                  "hex"
                ).toString("utf8");

                return res.status(200).json({
                  data: blockResult,
                  error: 0
                });
              }
            } else {
              return res.status(201).json({
                message: "NO Block found",
                error: 1
              });
            }
          })
          .catch(error => {
            console.log("error==", error);
            return res.status(200).json({
              message: "Something went wrong",
              error: 1
            });
          });
      } catch (error) {
        // console.log("error==", error);
        return res.status(404).json({
          message: "Error in request processing PPPPPPPPPPPP",
          error: 1
        });
      }
    });
  }

  /**
   * Implement getBlockByKey function asynchronously  to getdata by key
   */
  async getByBlockWalletAddress(walletAddress) {
    try {
      return await this.bd.getBlockByWalletAddress(walletAddress); // check key in database and return response
    } catch (error) {
      console.log("defined wallet address not found");
      return error;
    }
  }

  getBlockWalletAddress() {
    this.app.get("/stars/address:address", (req, res) => {
      try {
        let blockWalletAddress = req.params.address;
          blockWalletAddress = blockWalletAddress.replace(/^:/, "");
        if (blockWalletAddress == null || blockWalletAddress == undefined) {
          return res.status(201).json({
            message: "Invalid Wallet address",
            error: 1
          });
        }
        if (blockWalletAddress.length == 0) {
          return res.status(201).json({
            message: "Wallet address missing",
            error: 1
          });
        }

        this.getByBlockWalletAddress(blockWalletAddress)
          .then(blocks => {
            let result = [];
            for (let i = 0; i < blocks.length; i++) {
              let addValue = JSON.parse(blocks[i]);

              let body = addValue.body;
              let star = JSON.parse(body.star);
              body.star = star;
              addValue.body = body;

              // below line convert hex to utf8 string human readable with the help of Buffer
              addValue.body.star.story = Buffer.from(
                star.story,
                "utf8"
              ).toString("hex");

              // below line convert string to hex string with the help of Buffer and code utf8 for string to hex
              addValue.body.star.storyDecoded = Buffer.from(
                addValue.body.star.story,
                "hex"
              ).toString("utf8");

              result.push(addValue);
              // }
            }
            return res.json({
              data: result,
              error: 0
            });
          })
          .catch(error => {
            console.log("\nerror===", error);
            return res.status(200).json({
              message: "Something went wrong",
              error: 1
            });
          });
      } catch (error) {
        // console.log("error==", error);
        return res.status(404).json({
          message: "Error in request processing",
          error: 1
        });
      }
    });
  }

  /** Implement method getBlockByHeight to get block details by Height */
  getBlockByHeight() {
    this.app.get("/block/:height", (req, res) => {
      // Add your code here
      try {
        let blockHeight = req.params.height;
        if (blockHeight == null) {
          return res.status(404).json({
            message: "Block Height is empty",
            error: 1
          });
        }
        this.getBlockByKey(blockHeight).then(block => {
          if (!block) {
            return res.status(404).json({
              message: "Block not found",
              error: 1
            });
          }

          let blockResult = JSON.parse(block);
          if (blockResult.height != 0) {
            let body = blockResult.body;
            let star = JSON.parse(body.star);
            body.star = star;
            let story = star.story;
            //console.log("story",story)
            blockResult.body = body;

            // below line convert hex to utf8 string human readable with the help of Buffer
            blockResult.body.star.story = Buffer.from(story, "utf8").toString(
              "hex"
            );

            // below line convert string to hex string with the help of Buffer and code utf8 for string to hex
            blockResult.body.star.storyDecoded = Buffer.from(
              blockResult.body.star.story,
              "hex"
            ).toString("utf8");
          }
          return res.status(200).json({
            data: blockResult,
            error: 0
          });
        });
      } catch (error) {
        return res.status(404).json({
          message: "Error in request processing PPPPPPPPPPPP",
          error: 1
        });
      }
    });
  }

  /**
   * Implement getBlockByKey function asynchronously  to getdata by key
   */
  async getBlockByKey(key) {
    try {
      return await this.bd.getLevelDBData(key); // check key in database and return response
    } catch (error) {
      console.log("defined key not found");
      return "defined key not found";
    }
  }
  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
   */
  getBlockByIndex() {
    this.app.get("/block/:index", (req, res) => {
      // Add your code here

      this.getBlockByKey(req.params.index).then(block => {
        if (!block) {
          res.status(404).json({
            message: "The block with the giveId is not found",
            error: 1
          });
        }
        res.json({ error: 0, body: JSON.parse(block) });
        // res.json({body:block});
      });
    });
  }

  /**
   *Implement addBlockToDatabase function asynchronously  to save block into database
   */
  async addBlockToDatabase(block) {
    try {
      // console.log("\n\n\naddBlockToDatabase body==", block);
      return await this.blockchain.addBlock(new BlockClass.Block(block));
    } catch (error) {
      console.log("error in adding block");
      return "Internal error to add block";
    }
  }

  /**
Implement getNewlyAddedBlock method to get the block height and then pass the height as key to get the details of that key block.

 */
  async getNewlyAddedBlock() {
    const height = parseInt(await this.blockchain.getBlockHeight());
    //  if (await this.bd.getLevelDBData(key))
    try {
      return await this.bd.getLevelDBData(height); // check key in database and return response
    } catch (error) {
      console.log("defined key not found");
    }
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */

  postNewBlock() {
    this.app.post("/block", (req, res) => {
      try {
        //  console.log("request in block controller==", req.body);
        // Add your code here
        let blockData = req.body;
        if (blockData === undefined && blockData === null) {
          return "No Block data added";
        }
        if (blockData.length === 0) {
          return "Block Data enter is empty";
        }
        //console.log("went outside if condition===\n", blockData);
        this.addBlockToDatabase(blockData).then(response => {
          this.getNewlyAddedBlock().then(block => {
            if (!block) {
              res.status(404).json({
                message: "The block with the giveId is not found",
                error: 1
              });
            }
            //    console.log("block==\n", JSON.parse(block));
            //console.log(JSON.parse(block.body));
            let blockJSON = JSON.parse(block);

            let body = blockJSON.body;
            try {
              let star = JSON.parse(body.star);
              body.star = star;
              blockJSON.body = body;

              let story = star.story;
              //console.log("story",story)
              blockJSON.body = body;

              // below line convert hex to utf8 string human readable with the help of Buffer
              blockJSON.body.star.story = Buffer.from(story, "utf8").toString(
                "hex"
              );
              //  console.log("blockJSON===\n\n", blockJSON);
              res.status(200).json(blockJSON);
            } catch (error) {
              res.status(200).json({
                error: 0,
                body: "Something went wrong"
              });
            }
          });
        });
      } catch (error) {
        console.log("error==", error);
        return res.status(200).json({
          error: 0,
          message: "Request processing error"
        });
      }
    });
  }

  /**
   * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
   */
  initializeMockData() {
    if (this.blocks.length === 0) {
      for (let index = 0; index < 10; index++) {
        let blockAux = new BlockClass.Block(`Test Data #${index}`);
        blockAux.height = index;
        blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
        this.blocks.push(blockAux);
      }
    }
  }
}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = app => {
  return new BlockController(app);
};
