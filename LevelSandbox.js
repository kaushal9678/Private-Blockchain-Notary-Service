/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require("level");
const chainDB = "./chaindata";
const db = level(chainDB);
class LevelSandbox {
  constructor() {
    //this.db = level(chainDB);
  }

  // Get data from levelDB with key (Promise)
  getLevelDBData(key) {
    //let self = this;
    return new Promise(function(resolve, reject) {
      // Add your code here, remember in Promises you need to resolve() or reject()
      db.get(key, (error, value) => {
        if (error) {
          if (error.type == "NotFoundError") {
            resolve(undefined);
          } else {
            console.log("Block " + key + " get failed", error);
            reject(error);
          }
        }
       // console.log("value of key==", value);

        resolve(value);
      });
    });
  }

  // Add data to levelDB with key and value (Promise)
  addLevelDBData(key, value) {
    // let self = this;
   // console.log(`\n\n\n addLevelDBData key=${key}===\n\n value==${value}`);
    return new Promise((resolve, reject) => {
      db.put(key, value, error => {
        if (error) {
          console.log("error in adding block database", error);
          reject(error);
        }
        console.log("\n\n block added successfully in database");
        resolve("Block Added" + key);
      });
    });
  }

  // Method that return the height
  getBlocksCount() {
    //let self = this;
    return new Promise((resolve, reject) => {
      var height = -1;
      db.createReadStream()
        .on("data", data => {
          height++;
        })
        .on("error", error => {
          reject(error);
        })
        .on("close", () => {
          resolve(height);
        });
    });
  }
  //Implementing getBlock by hash function
  getBlockByHash(hash) {
    // let cat = []
    let block = "";
    return new Promise((resolve, reject) => {
      db.createReadStream()
        .on("data", function(data) {
          
          if (JSON.parse(data.value).hash === hash) {
            block = data;
            console.log("block getBlockByHash in===", block);
          }
        })
        .on("err", function(err) {
          reject(err);
        })
        .on("close", function(close) {
          resolve(block);
        });
    });
  }

  //Implementing the getBlock by wallet address function
  getBlockByWalletAddress(walletAddress) {
    let match = [];
    return new Promise((resolve, reject) => {
      db.createReadStream()
        .on("data", function(data) {
          //  console.log("data===", data);
          if (data.key != 0) {
            
            if (JSON.parse(data.value).body.constructor === Object) {
              let address = JSON.parse(data.value).body.address;
              if (address === walletAddress) {
                match.push(data.value);
              }
            }
          }
        })
        .on("err", function(err) {
          reject(err);
        })
        .on("close", function(close) {
         // console.log("match.count==", match.length);
          resolve(match);
        });
    });
  }
}

module.exports.LevelSandbox = LevelSandbox;
