var prometheus = artifacts.require("prometheus");
module.exports = function(deployer) {
  deployer.deploy(prometheus);
};
