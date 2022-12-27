// Source code to interact with smart contract

// web3 provider with fallback for old version
if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    try {
        // ask user for permission
        ethereum.enable()
        // user approved permission
    } catch (error) {
        // user rejected permission
        console.log('user rejected permission')
    }
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
    // no need to ask for permission
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
  console.log (window.web3.currentProvider)
  
  // contractAddress and abi are setted after contract deploy
  var contractAddress = '0xCC76aE8C1ECD508C918EBDfBd5b9492Faf785A8d';
  var abi = JSON.parse('[ { "inputs": [], "stateMutability": "payable", "type": "constructor" }, { "inputs": [], "name": "InStateOrder", "type": "error" }, { "inputs": [], "name": "InvalidState", "type": "error" }, { "inputs": [], "name": "OnlyBuyer", "type": "error" }, { "inputs": [], "name": "OnlySeller", "type": "error" }, { "inputs": [], "name": "OnlyShipper", "type": "error" }, { "inputs": [], "name": "abort", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "bomhang", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "buyer", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "cancelByBuyer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "confirmBomhang", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "confirmPurchase", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "confirmReceived", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getOrderState", "outputs": [ { "internalType": "enum PurchaseAgreement.OrderState", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getState", "outputs": [ { "internalType": "enum PurchaseAgreement.State", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "acc", "type": "address" } ], "name": "inputAccShipper", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "orderstate", "outputs": [ { "internalType": "enum PurchaseAgreement.OrderState", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "paySeller", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "seller", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "shipper", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "state", "outputs": [ { "internalType": "enum PurchaseAgreement.State", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "value", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]')
  
  //contract instance
  contract = new web3.eth.Contract(abi, contractAddress);
  
  // Accounts
  var account;
  var account_seller = '0x8FDFec20d8D2a4eCAcE1514Df4deAF1A161b1cF4';
  var account_buyer;
  var account_shipper;
  
  web3.eth.getAccounts(function(err, accounts) {
    if (err != null) {
      alert("Error retrieving accounts.");
      return;
    }
    if (accounts.length == 0) {
      alert("No account found! Make sure the Ethereum client is configured properly.");
      return;
    }
    account = accounts[0];
    console.log('Account: ' + account);
    web3.eth.defaultAccount = account;
  });
  
  //Smart contract functions
//   function registerSetInfo() {
//     info = $("#newInfo").val();
//     contract.methods.setInfo (info).send( {from: account}).then( function(tx) { 
//       console.log("Transaction: ", tx); 
//     });
//     $("#newInfo").val('');
//   }
  
//   function registerGetInfo() {
//     contract.methods.getInfo().call().then( function( info ) { 
//       console.log("info: ", info);
//       document.getElementById('lastInfo').innerHTML = info;
//     });    
//   }

//-----Public-----
function get_balance(){
    web3.eth.getBalance(contractAddress, 'latest', function(err, result) {
        if (err != null) {
            console.error("Error while retrieving the balance for address["+address+"]: "+err);
        }
        document.getElementById('display').innerHTML += result;
    });
}

function get_stt_contract(){
    contract.methods.getState().call().then( function( stt ) { 
        console.log(typeof parseInt(stt));
        switch(parseInt(stt)){
            case 0:
                document.getElementById('stt_contract').innerHTML += 'Created';
                break;
            case 1:
                document.getElementById('stt_contract').innerHTML += 'Locked';
                break;
            case 2:
                document.getElementById('stt_contract').innerHTML += 'Release';
                break;
            case 3:
                document.getElementById('stt_contract').innerHTML += 'Inactive';
        }
    });   
}

function get_stt_order(){
    contract.methods.getOrderState().call().then( function( stt ) { 
        switch(parseInt(stt)){
            case 0:
                document.getElementById('stt_order').innerHTML += 'Pending';
                break;
            case 1:
                document.getElementById('stt_order').innerHTML += 'Paid';
                break;
            case 2:
                document.getElementById('stt_order').innerHTML += 'Delivering';
                break;
            case 3:
                document.getElementById('stt_order').innerHTML += 'Bomhang';
                break;
            case 4:
                document.getElementById('stt_order').innerHTML += 'Completed';
                break;
            case 5:
                document.getElementById('stt_order').innerHTML += 'Cancelled';
                break;
            case 6:
                document.getElementById('stt_order').innerHTML += 'Fail';
                break;
        }
    });
}
//-----End Public-----

// -----Start Buyer-----
function confirm_purchase(){
        //web3.eth.handleRevert = true;
        if(account == account_seller){
            console.log('Only for customer');
            return;
        }
        
        money = $("#txt_Money").val();
        wei = web3.utils.toWei(money, 'ether');
        console.log('sending money');
        contract.methods.confirmPurchase().send({
            from: account,
            value: wei,
            gas: 300000,
            gasPrice: null
        }).then(()=>{
            alert('Successful')
        }).catch(()=>{
            alert('Fail! Please send money = value of the order');
        });
}

function cancel(){
    contract.methods.cancelByBuyer().send({
        from: account,
    }).then(()=>{
        alert('Successful cancelation! Check your account.')
    }).catch(()=>{
        alert('Fail!');
    });
}

//-----End Buyer-----


//-----Start Seller-----
function shipper_register(){
    account_shipper = $("#txt_AccShip").val();
    console.log(account_shipper);
    contract.methods.inputAccShipper(account_shipper).send({ 
        from: account_seller
    }).then(()=>{
        alert('Shipper account: ' + account_shipper);
    }).catch(()=>{
        alert('Fail!');
    });;
}

function pay_seller(){
    contract.methods.paySeller().send({
        from: account_seller
    }).then(()=>{
        alert('Withdraw successfully, check your account.');
    }).catch(()=>{
        alert('Fail!');
    });;
}

function seller_abort(){
    contract.methods.abort().send({
        from: account_seller
    }).then(()=>{
        alert('Successful cancelation!');
    }).catch(()=>{
        alert('Fail!');
    });;
}

function solve_bomhang(){
    contract.methods.bomhang().send({
        from: account_seller
    }).then(()=>{
        alert('Successfully! Check your account');
    }).catch(()=>{
        alert('Fail!');
    });;
}

//-----End Seller-----


//-----Start Shipper-----
function received(){
    contract.methods.confirmReceived().send({
        from: account
    }).then(()=>{
        console.log('Confirm successfully')
    }).catch(()=>{
        console.log('Fail!');
    });
}

function confirm_bomhang(){
    console.log(account_shipper)
    contract.methods.confirmBomhang().send({
        from: account
    }).then(()=>{
        console.log('Confirm successfully')
    }).catch(()=>{
        console.log('Fail!');
    });
}

//-----End Shipper-----

  // web3 provider with fallback for old version

window.addEventListener('load', async () => {
    // New web3 provider
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // ask user for permission
            await ethereum.enable();
            // user approved permission
        } catch (error) {
            // user rejected permission
            console.log('user rejected permission');
        }
    }
    // Old web3 provider
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // no need to ask for permission
    }
    // No web3 provider
    else {
        console.log('No web3 provider detected');
    }

    window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })

    if(account == account_seller){
        document.getElementById('contain_buyer').style.display = 'none';
        document.getElementById('contain_seller').style.display = 'block';
    }else{
        contract.methods.shipper().call().then((acc) => {
            if(account == acc){
                document.getElementById('contain_buyer').style.display = 'none';
                document.getElementById('contain_shipper').style.display = 'block';
            }
        })
    }
  });