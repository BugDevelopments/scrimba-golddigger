const priceDisplayEl = document.getElementById('price-display')
const connectionStatusEl = document.getElementById('connection-status')

// subscribe to price SSE
const eventSource = new EventSource("/api/price")
console.log(eventSource)

eventSource.onmessage = (event) => {
    console.log('received event', event)
    const data = JSON.parse(event.data)
    const rate = data.rate
    console.log('received rate:',rate)
    updatePriceDisplay(rate)
}

eventSource.onerror = () => {
    console.log("Connection lost. Attempting to reconnect...")
}

function updatePriceDisplay(newPrice) {
    priceDisplayEl.textContent = newPrice
}

updatePriceDisplay(12142.23)


updateConnectionStatusDisplay('disconnected')

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