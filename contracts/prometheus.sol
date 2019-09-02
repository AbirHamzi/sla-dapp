pragma solidity ^0.5.0;

import "./provableAPI_0.5.sol";

contract prometheus is usingProvable {
  string public alerts;
   event LogConstructorInitiated(string nextStep);
   event LogMetricsUpdated(string metrics);
   event LogNewProvableQuery(string description);

   constructor() public {
       emit LogConstructorInitiated("Constructor was initiated. Call 'updatePrice()' to send the Provable Query.");
   }

   function __callback(bytes32  myid, string memory result) public {
       if (msg.sender != provable_cbAddress()) revert();
        alerts = result;
        emit LogMetricsUpdated(result);
   }

   function updateMetrics()public  payable {
       if (provable_getPrice("URL") > msg.sender.balance) {
           emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
       } else {
           emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");

           /* The recieved alerts are json array, but parsing json object is not supported in solidity but there are some workarounds :
              1. Implement from scratch a function to parse a json object or use an existing library like https://github.com/Arachnid/solidity-stringutils
              2. Parsing json object onchain could be expensive so maybe using a third-party like oraclize to parse json object is a good idea(depends on cost) */
          
           provable_query("URL", "json(https://kind-treefrog-83.localtunnel.me).alerts[0].labels.alertname");
       }
   }
}