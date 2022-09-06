const form = document.querySelector("#form")

form.addEventListener("submit", (event) => {
  event.preventDefault()
  HandleMessage()
});

let arrayListMessage = []

function HandleMessage() {


  if (isEmpty(document.querySelector("#input-message").value) || isEmpty(document.querySelector("#input-name").value)) {

    alert("Preencher o nome e a mensagem antes do envio")
    return 
  }

  const today = new Date()
  let message = {
    mesg: document.querySelector("#input-message").value,
    nome: document.querySelector("#input-name").value,
    wallet: "0x0d5FdE8D013F3139CCE77d91Cd1346434b173311",
    data: format(today),
  }
  arrayListMessage.push(message)
  ShowMessages(arrayListMessage)
  CountMessages()
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
  const count = document.querySelector("#count-message")
  count.innerHTML = `${arrayListMessage.length}`
}

function ClearForm() {
  document.querySelector("#input-message").value = ''
  document.querySelector("#input-name").value = ''
}

function format(inputDate) {
  let date, month, year;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();

  date = date
    .toString()
    .padStart(2, '0');

  month = month
    .toString()
    .padStart(2, '0');

  return `${date}/${month}/${year}`;
}


function isEmpty(str) {
  return (!str || str.length === 0 );
}