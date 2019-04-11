const SHA256 = require("crypto-js/sha256");
const BlockClass = require("./Block.js");
const BlockChainClass = require("./BlockChain.js");
const LevelSandbox = require("./LevelSandbox.js");
const bitcoin = require("bitcoinjs-lib");
const bitcoinMessage = require("bitcoinjs-message");
// Http library
const http = require("http");
const bodyParse = require("body-parse");

class NotaryService {
  constructor() {}
  async requestValidation() {
    this.app.get("/requestValidation", (req, res) => {});
  }
  async AddRequestValidation() {
       this.mempool = [];
       this.timeoutRequests = [];
                  self.timeoutRequests[request.walletAddress]=setTimeout(function(){ self.removeValidationRequest(request.walletAddress) }, TimeoutRequestsWindowTime );

  }
  function settimeout(req,timeoutRequestsWindowTime)
{
  const TimeoutRequestsWindowTime = 5*60*1000;

let timeElapse = (new Date().getTime().toString().slice(0,-3)) - req.requestTimeStamp;
let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
req.validationWindow = timeLeft;
return req;

  });
}
removeValidationRequest(walletAddress){

}
