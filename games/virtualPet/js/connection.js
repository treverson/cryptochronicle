var contract;
var from;

//Replace with your contract ABI
var contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_sender",
        "type": "address"
      }
    ],
    "name": "NewValueSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_sender",
        "type": "address"
      }
    ],
    "name": "NewValueSetAgain",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "set",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "setAgain",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "get",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

//Replace with your contract address
var contractAddress = "0xeef9a60109352e01912cdbcb5133f7af2646fc37";

window.addEventListener(`load`, async function () {

        const client = new loom.Client(
            'default',
      'ws://160.16.137.244:46658/websocket',
			'ws://160.16.137.244:46658/queryws'
			//'ws://127.0.0.1:46658/websocket',
			//'ws://127.0.0.1:46658/queryws'
        )

        const privateKey = loom.CryptoUtils.generatePrivateKey()
	const publicKey = loom.CryptoUtils.publicKeyFromPrivateKey(privateKey)		

	from = loom.LocalAddress.fromPublicKey(publicKey).toString()

	console.log("Your wallet address:" + from);
	const web3 = new Web3(new loom.LoomProvider(client, privateKey))
	contract = new web3.eth.Contract(contractABI, contractAddress, {from: from})
  
  

});
