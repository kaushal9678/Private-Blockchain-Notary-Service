//Importing Express.js module
const express = require("express");
//Importing BodyParser.js module
const bodyParser = require("body-parser");
const LevelSandbox = require("./LevelSandbox.js");

/**
 * Class Definition for the REST API
 */
class BlockAPI {
  /**
   * Constructor that allows initialize the class
   */
  constructor() {
    this.app = express();
    this.initExpress();
    this.initExpressMiddleWare();
    this.initControllers();
    this.start();
  }

  /**
   * Initilization of the Express framework
   */
  initExpress() {
    this.app.set("port", 8000);
  }

  /**
   * Initialization of the middleware modules
   */
  initExpressMiddleWare() {
    this.app.use(
      bodyParser.raw({
        inflate: true,
        limit: "100kb",
        type: "application/json;text/xml;"
      })
    );
    // this.app.use(bodyParser.raw());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  /**
   * Initilization of all the controllers
   */
  initControllers() {
    require("./BlockController.js")(this.app);
    require("./mempoolController.js")(this.app);
  }

  /**
   * Starting the REST Api application
   */
  start() {
    let self = this;
    this.app.listen(this.app.get("port"), () => {
      console.log(`Server Listening for port: ${self.app.get("port")}`);
    });
  }
}

new BlockAPI();
