const priceDisplayEl = document.getElementById('price-display')
const connectionStatusEl = document.getElementById('connection-status')
const dialogEl = document.querySelector('.outputs')
const formEl = document.getElementById('invest-form')
const investmentSummaryEl = document.getElementById('investment-summary')
const investmentAmountEl = document.getElementById('investment-amount')
const closeDialogBtn = document.getElementById('close-dialog-btn')

let currentPrice

closeDialogBtn.addEventListener('click', (event)=>{
    dialogEl.close()
})

formEl.addEventListener('submit', (event)=> {
    event.preventDefault()
    console.log('form was submitted')
    handleInvestFormSubmit()
})


// subscribe to price SSE
updateConnectionStatusDisplay('connecting')
const eventSource = new EventSource("/api/price")

eventSource.onopen = () => {
    console.log("SSE Connection established...")
    updateConnectionStatusDisplay('connected')
}

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    currentPrice = data.rate
    updatePriceDisplay(currentPrice)
}

eventSource.onerror = () => {
    console.log("Connection lost. Attempting to reconnect...")
    updateConnectionStatusDisplay('disconnected')
}

function handleInvestFormSubmit() {
    const oz = investmentAmountEl.value/currentPrice
    investmentSummaryEl.textContent = `You bought ${oz} unces (ozt) gold for ${investmentAmountEl.value} at a price of $${currentPrice} / ozt.`
    dialogEl.showModal()
}

function updatePriceDisplay(newPrice) {
    priceDisplayEl.textContent = newPrice
}


function updateConnectionStatusDisplay(status) {
    console.log('updateConnectionStatusDisplay called...')
    if(status === 'connected') {
        connectionStatusEl.textContent = 'Live Price 🟢'
    } else if(status === 'disconnected') {
        connectionStatusEl.textContent = 'Disconnected 🔴'
    } else if(status === 'connecting') {
        connectionStatusEl.textContent = 'Connecting 🟡'
    }
}