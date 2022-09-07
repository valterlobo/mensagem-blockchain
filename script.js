const form = document.querySelector("#form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  HandleMessage();
});

const wallet = document.querySelector("#wallet");

wallet.addEventListener("click", (event) => {
  event.preventDefault();
  WalletConnect()

});

let arrayListMessage = [];
let account = "";
const CONTRACT_ADDRESS = "0xc3a12d7523a1dBb9b241EF677d875B3c77616A22";
let contrato;

function HandleMessage() {
  if (
    isEmpty(document.querySelector("#input-message").value) ||
    isEmpty(document.querySelector("#input-name").value)
  ) {
    alert("Preencher o nome e a mensagem antes do envio");
    return;
  }

  const today = new Date();
  let message = {
    mesg: document.querySelector("#input-message").value,
    nome: document.querySelector("#input-name").value,
    wallet: "0x0d5FdE8D013F3139CCE77d91Cd1346434b173311",
    data: format(today),
  }

  SalvarMensagem(message.mesg, message.nome)
  ClearForm()
}

function ShowMessages(arrayListMessage) {
  const messageResult = document.querySelector("#message-result")
  messageResult.innerHTML = " "
  for (let index = 0; index < arrayListMessage.length; index++) {
    const element = arrayListMessage[index]
    //messageResult.innerHTML += `<hr> <p> ${element.nome}</p> <p> message: ${element.mesg}</p> <p> data: ${element.data}</p>  <p> wallet: ${element.wallet}</p>`
    messageResult.innerHTML += `<div class="col-sm-6 col-lg-6 mb-4">
    <div class="card p-3 text-end">
      <figure class="mb-0">
        <blockquote class="blockquote">
          <p>${element.mesg}.</p>
        </blockquote>
        <figcaption class="blockquote-footer mb-0 text-muted">
        <cite title="Source Title">${element.nome}</cite> ${element.data}
        </figcaption>
        <p>[${element.wallet}] </p>
      </figure>
    </div>
  </div>`
  }
}

function CountMessages() {
  const count = document.querySelector("#count-message");
  count.innerHTML = `${arrayListMessage.length}`;
}

function ClearForm() {
  document.querySelector("#input-message").value = "";
  document.querySelector("#input-name").value = "";
}

function format(timeStamp) {
  let date, month, year;
  const inputDate  = new Date(timeStamp*1000)
  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();

  date = date.toString().padStart(2, "0");

  month = month.toString().padStart(2, "0");

  return `${date}/${month}/${year}`;
}

function isEmpty(str) {
  return !str || str.length === 0;
}

//*********************METAMASK BLOCKCHAIN***************************************//

const WalletConnect = async () => {

  try {

    const { ethereum } = window;


    if (!ethereum) {
      alert("Instalar a MetaMask!");
      return;
    }

    await CheckIfWalletIsConnected()

    if (window.ethereum.networkVersion !== "5") {
      alert("Conectar testnet Goerli!");
      return;
    }
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Contectado", accounts[0]);
    SetCurrentAccount(accounts[0])
  } catch (error) {
    console.log(error);
    alert("Erro ao conectar a Metamask");
  }
}

const CheckIfWalletIsConnected = async () => {
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Make sure you have metamask!");
    return;
  } else {
    console.log("We have the ethereum object", ethereum);
  }

  const accounts = await ethereum.request({ method: "eth_accounts" });

  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log("Found an authorized account:", account);
    SetCurrentAccount(account)
  } else {
    console.log("No authorized account found");
  }

  // This is the new part, we check the user's network chain ID
  const chainId = await ethereum.request({ method: 'eth_chainId' });
  //setNetwork(networks[chainId]);

  ethereum.on('chainChanged', handleChainChanged);

  // Reload the page when they change networks
  function handleChainChanged(_chainId) {
    window.location.reload();
  }
}

const ContractConnect = async () => {
  const { ethereum } = window;

  if (ethereum) {
    const response = await fetch("contrato/MensagemStorage.abi");
    const contrato_abi = await response.json();

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contrato_abi,
      signer
    );
    SetContract(contract)

  } else {
    console.log("Instalar Metamask");
  }
};

function SetCurrentAccount(addr) {
  account = addr;
  const accountHtml = document.querySelector("#account");
  accountHtml.innerHTML = `${addr}`;
  document.querySelector("#view_mensagem").style.display = "block";
  ContractConnect()
}

function SetContract(contract) {
  contrato = contract
  ExibirMensagens()
}

const SalvarMensagem = async (mensagem, nome) => {
  try {
    if (contrato) {
      const txn = await contrato.EnviarMensagem(mensagem, nome)
      await txn.wait()
      console.log("txn:", txn)
      ExibirMensagens()
    }
  } catch (error) {
    console.error("Error EnviarMensagem:", error);
    alert(error);
  }
};

const ExibirMensagens = async () => {

  try {
    if (contrato) {
      const mesgs = await contrato.ObterMensagens()
      arrayListMessage = []
      console.log(mesgs)
     
      for (let index = 0; index < mesgs.length; index++) {
        const m = mesgs[index]
        console.log(m.timestamp.toString())
        let message = {
          mesg: m.message,
          nome: m.nome,
          wallet: m.addr,
          data: format(m.timestamp.toString()),
        };
        arrayListMessage.push(message)
        console.log(message.nome)
      }
      ShowMessages(arrayListMessage)
      CountMessages()
    } else {
      alert("Contrato não encontrado ou conectado:" + CONTRACT_ADDRESS);
    }
  } catch (error) {
    console.error("Error ObterMensagens:", error);
    alert(error);
  }
};
