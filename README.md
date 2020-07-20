
# POC SLA Dapp

In this Proof of Concept (PoC), we did implement an Ethereum smartcontract that recieves prometheus alerts once they are fired and store them in Ethereum blockchain .

## Dependencies
Install these prerequisites to follow along with the tutorial. 

- [Truffle](https://github.com/trufflesuite/truffle)
- [Ganache](https://www.npmjs.com/package/ganache-cli)
- [Metamask](https://metamask.io/)
- [Node-js](https://nodejs.org/en/download/)
- [Localtunnel](https://localtunnel.github.io/www/)
- [Prometheus](https://prometheus.io/docs/prometheus/latest/installation/)
- [Node-exporter](https://prometheus.io/docs/guides/node-exporter/)
- [Alertmanager](https://prometheus.io/docs/alerting/alertmanager/)


## Step 1. Clone the project & install

```
$ git clone https://github.com/pocteo/dapp-oracle-poc.git
$ cd dapp-oracle-poc 
```

Verify that node is installed:

```
$ node -v
```

Install all node dependecies:

```
$ npm i --save
```

## Step 2. Start Ganache

Start a local blockchain instance:

```
$ ganache-cli -m 'your-mnemonic' -p 9545
```

Create a file named `secret` in the root of the project and put your mnemonic inside it(In case you want to deploy your contract in `testnet` instead of ganache) .

## Step 3. Start Ethereum-bridge

```
$ cd dapp-oracle-poc 
$ npx ethereum-bridge -H localhost:9545 -a 1
```


You must see an output like this:

```
Please add this line to your contract constructor:
OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
```

Go to `contracts/provableAPI_0.5.sol`, press `ctl+f` and look for `Ethereum-bridge` and you must find this bloc of code:


```solidity
 if (getCodeSize(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475) > 0) { 
            OAR = OracleAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
            return true;
        }
 ```       


If the Oraclize contract address it's not the same please change it .

## Step 4. Start the Webhook

```
$ node webhook.js
$ lt --port 3000
```

Localtunnel will give you and URL, go to `prometheus.sol` and change this line :

```solidity
 provable_query("URL", "json(paste_here_new_Localtunnel_url).alerts[0].labels.alertname");
```

Now we have to configure `Alertmanager` to send alerts to our custom webhook .
Example of `Alertmanager yaml config file` :

```
route:
  receiver: "blockchain"
  group_by: ['alertname']
  group_wait:      15s
  group_interval:  15s
  repeat_interval: 1m

receivers:
- name: "blockchain"
  webhook_configs:
  - url: 'http://localhost:3000'
    send_resolved: true
```

## Step 5. Compile & Deploy the Smart Contract


```
$ cd dapp-oracle-poc 
$ truffle compile 
$ truffle migrate development
```

## Step 6. Verify that `Prometheus`, `Node-exporter` and `Alertmanager` are actifs

1. **Prometheus service :** http://localhost:9090
2. **Node Exporter :** http://localhost:9100
3. **Alertmanager :** http://localhost:9093 
 
> Make sure that there is one alert fired at least : you can verify this in `http://127.0.0.1:9093/#/alerts`


## Step 7. Test the smartcontract 

``̀
$ cd dapp-oracle-poc 
$ truffle test
`̀``

You should see the `alertname` of the first alert fired by Prometheus.

