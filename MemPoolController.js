const MempoolClass = require("./MemPool.js");
const RequestClass = require("./request.js");
const BlockClass = require("./Block.js");
const hextoascii = require("hex2ascii");

class MempoolController {
  constructor(app) {
    this.app = app;
    this.mempool = new MempoolClass.Mempool();
    // console.log(this.mempool.validateRequestByWallet())
    this.count;
    this.arr = [];

    this.requestValidation();
    this.validateSignature();
    this.storeStarData();
    this.test();
  }

  /**
   * Implement a POST Endpoint to validation request, url: "/api/requestValidation"
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
        // console.log("\n\n------------addRequestValidation----------- \n",this.mempool.addRequestValidation(req))
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
   * Implement a POST Endpoint to validate signature, url: "/api/message-signature/validate"
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
        console.log("timeStamp===",timeStamp)
        // console.log(">>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<")
        console.log(
          "validateRequestByWallet------\n",
          this.mempool.validateRequestByWallet(
            address,
            signature,
            timeStamp
          )
        );
        return res.json({
          data: this.mempool.validateRequestByWallet(
          address,
          signature,
          timeStamp
        )
        });
       
      } catch (err) {
        console.log("error==",err);
       // return err;
         return res.json({
           message: "Signature can not be validate at this time."
         });
      }
    });
  }

  // To store the star details in the chain. URL :/api/block

  storeStarData() {
    this.app.post("/block", (request, res) => {
      try {
        let requestObj = request.body;
        console.log("b. requestObj---->" + requestObj);

        //verifing the count of parameter
        let noOfParameters = Object.keys(requestObj).length;

        if (noOfParameters == 2) {
          //fetching address and star details from the request
          let address = request.body.address;
          let starData = request.body.star;

          //verifying whether the address is  validated in the past 30 minutes
          if (this.mempool.verifyAddressRequest(address)) {
            let paramcheck = this.mempool.verifyStarParameters(starData);
            if (paramcheck.result == false) {
              return paramcheck.error;
            }
            if (!("mag" in starData)) {
              starData.mag = "";
            }

            if (!("cen" in starData)) {
              starData.cen = "";
            }

            let body = {
              address: address,
              star: {
                ra: starData.ra,
                dec: starData.dec,
                mag: starData.mag,
                cen: starData.cen,
                story: new Buffer(starData.story).toString("hex")
              }
            };
            //Calling the postNewBlock API in blockController
            const injectOption = {
              method: "POST",
              url: "/block",
              body: {
                body: body
              }
            };
          console.log("this.injectObject()====", this.injectObject());
          return res.json({
            message: this.injectObject()
          });
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
            message:
              "Please send a valid address and details of a single star"
          });
        }
      } catch (error) {
        console.log(err);
        return res.json({
          message:
            "Star data can not be store at this time.", error:1
        });
      }
    });
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
