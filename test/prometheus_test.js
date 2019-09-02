const prometheus = artifacts.require("prometheus");
const truffleAssert = require('truffle-assertions');
//require('truffle-test-utils').init();


contract('prometheus',  (accounts) => {

    let instance;

     beforeEach('should setup the contract instance', async () => {
         instance = await prometheus.deployed();
    });

   it("should return the list of accounts", async ()=> {
    console.log(accounts);
  });

  it("Prometheus alerts :", function() {
    var result;
      return instance.updateMetrics({from : accounts[2]}).then(function(res){
      result = res;
      return new Promise(resolve => setTimeout(resolve, 20000));
    }).then(function(){
      return instance.alerts();
    }).then(function(value){
      console.log(" Alerts = " + value);
     // truffleAssert.prettyPrintEmittedEvents(result);
     // assert.equal(result, "18442356492849", "The result is wrong (should be 18442356492849)");
    });
  });

});