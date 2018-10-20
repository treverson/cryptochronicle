var contract;
var from;

//Replace with your contract ABI
var contractABI = [
	{
		"constant": false,
		"inputs": [],
		"name": "add",
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
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

//Replace with your contract address
var contractAddress = "0xb681fbf4b36c49e0811ee640cca1933ab57be81e";

window.addEventListener(`load`, async function () {
        const privateKey = loom.CryptoUtils.generatePrivateKey()
		const publicKey = loom.CryptoUtils.publicKeyFromPrivateKey(privateKey)
		
        const client = new loom.Client(
            'default',
            //This is public loom sandbox for cryptochronicles			
            'wss://160.16.137.244:46658/websocket',
	    'wss://160.16.137.244:46658/queryws'
        )

		from = loom.LocalAddress.fromPublicKey(publicKey).toString()
		
		console.log("Your wallet address:" + from);
		const web3 = new Web3(new loom.LoomProvider(client, privateKey))
		

		contract = new web3.eth.Contract(contractABI, contractAddress, { from })
		
});
