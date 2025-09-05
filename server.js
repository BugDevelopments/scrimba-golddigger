import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import 'dotenv/config'
import pollLivecoinAPI from './util/poller.js'

const PORT = 9999

const __dirname = import.meta.dirname
const publicPath = path.join(__dirname, 'public')
const html404Path = path.join(publicPath, '404.html')
const html404 = await fs.readFile(html404Path)
const livecoinApiKey = process.env.LIVECOIN_API_KEY
let currentRate = null

initPoller()

const server = http.createServer( async (req,res) => {
    if(req.method === 'GET')
        if(req.url === '/api/price') {
            return await handlePriceSSE(req,res)
        } else {
            return await handleGet(req, res)
        }
    
})

server.listen(PORT, ()=>{
    console.log('server listening on port ', PORT)
    //initPoller()
})

async function initPoller() {
    currentRate = await pollLivecoinAPI(livecoinApiKey)
    console.log(currentRate)
    setTimeout(initPoller, 2000)
}

async function handlePriceSSE(req, res) {
    console.log('handling price SSE..')
    res.statusCode = 200

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    setInterval( () => {
        res.write(
            `data: ${JSON.stringify(
                {
                    event: 'price-update',
                    rate: currentRate
                }
            )}\n\n`
        )
    }, 2000)

}

async function handleGet(req, res) {

    // static route handling
    const INDEX_PATHS = [ '/', '/index.html', '/index.htm']
    const url = INDEX_PATHS.includes(req.url) ? '/index.html' : req.url
    const filePath = path.join(publicPath, url)
    
    // check if file exists, if not send 404
    try {
        await fs.access(filePath)
    } catch(err) {
        console.error(err)
        return await sendResponse(res,404,'text/html',html404)
    }

    // send respnse with file as payload
    try {
        const payLoad = await fs.readFile(filePath)
        sendResponse(res, 200, getContentType(path.extname(filePath)), payLoad)
    } catch(err) {
        console.error(err) 
        return await sendResponse(res,500,'text/plain',`500 Server error: ${err}`)
    }
}

async function handlePricePoll(req, res) {
    console.log('subscribed to poll..')
}

async function sendResponse(res, statusCode, contentType, payload ) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', contentType)
    res.end(payload)
}

function getContentType(ext) {
  const types = {
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml"
  }
  
  return types[ext.toLowerCase()] || "text/html"
}