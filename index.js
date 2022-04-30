// connect to NEAR
const { providers } = nearApi;
const { utils } = nearApi;
const near = new nearApi.Near({
    keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org'
  });

  // connect to the NEAR Wallet
  const wallet = new nearApi.WalletConnection(near, 'my-app');

  // connect to a NEAR smart contract
  const contract = new nearApi.Contract(wallet.account(), 'nftzoo.ippishio.testnet', {
    viewMethods: [],
    changeMethods: ['nft_mint']
  });
  const button = document.getElementById('mint-button');
 const logoutbut = document.getElementById('log-out');
 const price = document.getElementById('price');
 const login = document.getElementById('login');
 const inputbox = document.getElementById('name');
  if (!wallet.isSignedIn()) {
    button.style.visibility = "hidden";
    inputbox.style.visibility = "hidden";
    logoutbut.style.visibility = "hidden";
    price.style.visibility = "hidden";
    login.style.visibility = "visible";
  } else {
    document.getElementById('greet').textContent = "Hello, "+wallet.getAccountId().toString()+"!";
    logoutbut.style.visibility = "visible";
    price.style.visibility = "visible";
    login.style.visibility = "hidden";
    button.style.visibility = "visible";
    inputbox.style.visibility = "visible";
  } 

 logoutbut.addEventListener('click', () => {
  wallet.signOut();
  location.href = 'https://'+window.location.hostname;
  window.location.reload();
  console.log("logged out");
 }) 

  
 // Either sign in or call the addMessage change method on button click


//network config (replace testnet with mainnet or betanet)
const provider = new providers.JsonRpcProvider(
  "https://archival-rpc.testnet.near.org"
);
const TX_HASH = new URLSearchParams(window.location.search).get('transactionHashes');
if(wallet.isSignedIn()) {
  if(TX_HASH) {
   if(!(new URLSearchParams(window.location.search).get('errorCode'))) {
      console.log("no error");
     const result = await provider.txStatus(TX_HASH, wallet.getAccountId().toString());
     console.log(eval(window.atob(result['status']['SuccessValue'])))
     const randID = eval(window.atob(result['status']['SuccessValue']))[0];
     const animalname = eval(window.atob(result['status']['SuccessValue']))[1];
     if(randID){
        console.log(randID);
        button.textContent = 'Mint another!'
        document.getElementById("imgholder").innerHTML += 
        '<h1>Here is '+animalname+', your new friend!✨️</h1><img src ="images/'+randID.toString()+'.png">';
     }
   } else {
     console.log("error");
    }

  console.log(TX_HASH);
  }
}

login.addEventListener('click', () => {
    wallet.requestSignIn({
        contractId: 'nftzoo.ippishio.testnet',
        methodNames: ['nft_mint']
      });
})


  button.addEventListener('click', () => {
    if (wallet.isSignedIn()) {
      const randomid = Math.floor(Math.random() * 7)+1;
      const animalname = inputbox.value;
      contract.nft_mint({
        token_id: (Math.floor(Math.random() * 900000000)+1).toString(), 
        metadata: {"title":""+animalname+" from Kyiv ZOO","description":"Animals shouldn't suffer","media":"https://bafybeifrz23iyx22jdj4hysxkdrpcqtkfaapmk6ndhzibnvvd6ovbkn54m.ipfs.nftstorage.link/zoo/"+randomid.toString()+".png"},
        receiver_id: wallet.getAccountId().toString(),
        image_number: randomid,
        animal_name: animalname
      },"300000000000000","5000000000000000000000000"
      ) 
    } 

    }
  );