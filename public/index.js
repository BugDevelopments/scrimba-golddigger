const priceDisplayEl = document.getElementById('price-display')
const connectionStatusEl = document.getElementById('connection-status')


function updatePriceDisplay(newPrice) {
    priceDisplayEl.textContent = newPrice
}

updatePriceDisplay(12142.23)

function updateConnectionStatusDisplay(status) {
    
}