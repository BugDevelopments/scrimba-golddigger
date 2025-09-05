/*  https://livecoinwatch.github.io/lcw-api-docs/
10,000 free API requests per day 
2 second updates
sufficient for 1 call every 8.64 second   ~ 1 call every 10 seconds
cache prices on the backend, then only serve the cached price

domain: https://api.livecoinwatch.com


Example:

get remaining credits:

await fetch('https://api.livecoinwatch.com/credits', {
  method: 'POST',
  headers: new Headers({
    'content-type': 'application/json',
    'x-api-key': '<YOUR_API_KEY>'
  })
})

*/

export default async function pollLivecoinAPI(apiKey) {
  console.log('polling..')
  const apiUrl = 'https://api.livecoinwatch.com/coins/single'
  const options = {
    method: "POST" ,
    headers: {
      "Content-Type": "application/json",
      "x-api-key" : apiKey
    },
    body: JSON.stringify({
      currency: "USD",
      code: "XAUT",
      meta: false
    })
  }

  return fetch(apiUrl, options)
    .then(res=>res.json())
    .then(data=>data.rate)
    .catch(err=>console.error(err))
}
