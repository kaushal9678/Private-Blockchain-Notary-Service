const MempoolClass = require("./MemPool.js");
const RequestClass = require("./request.js");
const BlockClass = require("./Block.js");
const hextoascii = require("hex2ascii");
const BlockChainClass = require("./BlockChain.js");
const LevelSandbox = require("./LevelSandbox.js");
class MempoolController {
  constructor(app) {
    this.app = app;
    this.mempool = new MempoolClass.Mempool();
    this.blockchain = new BlockChainClass.Blockchain();
    this.bd = new LevelSandbox.LevelSandbox();
    // console.log(this.mempool.validateRequestByWallet())
    this.count;
    this.arr = [];

    this.requestValidation();
    this.validateSignature();
    this.storeStarData();
    this.test();
  }

  /**
   * Implement a POST Endpoint to validation request, url: "/requestValidation"
   */

  requestValidation() {
    this.app.post("/requestValidation", (request, res) => {
      try {
        let address = request.body.address;
        console.log("address===", address);
        //check whether the address variable is null or undefined
        if (address == null || address === undefined) {
          //return "Invalid Address";
          return res.json({
            message: "Please provide wallet address!"
          });
        }
        if (address.length == 0) {
          //return "Provide a valid address";
          return res.json({
            message: "Provide a valid address!"
          });
        }

        //creating request object
        let req = new RequestClass.Request();
        req.walletAddress = address;
        req.requestTimeStamp = new Date()
          .getTime()
          .toString()
          .slice(0, -3);
        this.count = req.requestTimeStamp;
        console.log("1. value count---->" + this.count);
        this.arr.push(this.count);
        req.message =
          req.walletAddress + ":" + req.requestTimeStamp + ":" + "starRegistry";

        //Adding request to mempool
        console.log(
          "\n\n------------addRequestValidation----------- \n",
          this.mempool.addRequestValidation(req)
        );

        return res.status(200).json(this.mempool.addRequestValidation(req));
        //return this.mempool.addRequestValidation(req);
      } catch (error) {
        console.log(error);
        return res.json({
          message: "Validation request cannot be created"
        });
      }
    });
  }

  /**
   * Implement a POST Endpoint to validate signature, url: "/message-signature/validate"
   */

  validateSignature() {
    this.app.post("/message-signature/validate", (request, res) => {
      try {
        let address = request.body.address;
        let signature = request.body.signature;
        // let timeStamp = request.payload.timeStamp;4

        if (!address || !signature) {
          //return "Address or signature is missing";
          return res.json({
            message: "Address or signature is missing"
          });
        }

        let timeStamp = this.arr[0];
        console.log("timeStamp===", timeStamp);
        // console.log(">>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<")
        console.log(
          "validateRequestByWallet------\n",
          this.mempool.validateRequestByWallet(address, signature, timeStamp)
        );
        return res.json({
          data: this.mempool.validateRequestByWallet(
            address,
            signature,
            timeStamp
          )
        });
      } catch (err) {
        console.log("error==", err);
        // return err;
        return res.json({
          message: "Signature can not be validate at this time."
        });
      }
    });
  }

  // To store the star details in the chain. URL :/block

  storeStarData() {
    this.app.post("/block", (request, res) => {
      try {
        let requestObj = request.body;
        // console.log("b. requestObj---->" + requestObj);

        //verifing the count of parameter
        let noOfParameters = Object.keys(requestObj).length;
        //  console.log("noOfParametrs==",noOfParameters)
        if (noOfParameters == 2) {
          // console.log("went inside");
          //fetching address and star details from the request
          let address = request.body.address;
          console.log("\naddress==", address);
          //let starData = request.body.star;
          console.log(
            "\n\n this.mempool.verifyAddressRequest(address)==",
            this.mempool.verifyAddressRequest(address)
          );
          let starData = request.body.star;
          console.log("\n\n\n starData===", starData);
          //verifying whether the address is  validated in the past 30 minutes
          if (this.mempool.verifyAddressRequest(address)) {
            let paramcheck = this.mempool.verifyStarParameters(starData);
            if (paramcheck.result == false) {
              console.log("paramcheck.error===", paramcheck.error);
              return res.status(404).json({
                message: paramcheck.error,
                error: 1
              });
            }

            let body = {
              address: address,
              star: {
                ra: starData.ra,
                dec: starData.dec,
                //  mag: starData.mag,
                //  cen: starData.cen,
                story: new Buffer(starData.story).toString("hex")
              }
            };
            console.log("body==", body);
            //Calling the  postNewBlock API in blockController

            this.postNewBlock(body, res);

            // return this.injectObject();
          } else {
            // return "Please send validation request once again";
            return res.json({
              message: "Please send validation request once again"
            });
          }
        } else {
          //return "Please send a valid address and details of a single star ";
          return res.json({
            message: "Please send a valid address and details of a single star"
          });
        }
      } catch (error) {
        console.log(error);
        return res.json({
          message: "Star data can not be store at this time.",
          error: 1
        });
      }
    });
  }

  postNewBlock(block, res) {
    try {
      this.addBlockToDatabase(block)
        .then(response => {
          // after block added successfully need to remove permissions for further
          //request  by calling removeValidRequest

          this.mempool.removeValidRequest(block.address);
          this.getNewlyAddedBlock().then(block => {
            if (!block) {
              res.status(404).json({
                message: "The block with the giveId is not found",
                error: 1
              });
            }
            let blockJSON = JSON.parse(block);
            console.log("blockJSON==", blockJSON);
            try {
              // below line convert hex to utf8 string human readable with the help of Buffer
              blockJSON.body.star.story = Buffer.from(
                blockJSON.body.star.story,
                "utf8"
              ).toString("hex");
              //  console.log("blockJSON===\n\n", blockJSON);
              res.status(200).json(blockJSON);
            } catch (error) {
              console.log("error==", error);
              res.status(200).json({
                error: 0,
                body: "Something went wrong"
              });
            }
          });
        })
        .catch(error => {
          console.log("error==", error);
          return res.status(200).json({
            error: 0,
            message: "Request processing error"
          });
        });
    } catch (error) {
      return res.status(200).json({
        error: 0,
        message: "Request processing error"
      });
    }
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

  async injectObject() {
    const response = await this.app.inject(injectOption);
    console.log("a. response---->" + response);
    let blockResult = JSON.parse(response.payload);
    //Adding decoded story to the object
    //  blockResult.body.star.storyDecoded = hextoascii(blockResult.body.star.story);
    this.mempool.removeValidRequest(address);
    return blockResult;
  }

  test() {
    this.app.post("/api/test", (req, res) => {
      try {
        let address = req.body.address;
        let starData = req.body.star;

        return this.mempool.verifyStarParameters(starData);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
/**
 * Exporting the MempoolController class
 * @param {*} app
 */

module.exports = app => {
  return new MempoolController(app);
};
