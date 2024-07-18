import express from 'express';
import dotenv from 'dotenv';
import connect from './db/connectToMongo.js';
import mongoose from 'mongoose';
import cors from 'cors';
import WebSocket from 'ws';
import PriceModel from './models/priceModel.js';

const app = express();
const PORT = process.env.PORT || 8000;
const token = process.env.WEBSOCKET_TOKEN || 'cqalqc9r01qmfd853jt0cqalqc9r01qmfd853jtg';



const symbols = ['AAPL','TSLA','AMZN','PLUG','MSFT']
dotenv.config();
app.use(express.json());
app.use(cors());

connect();

let socket = null;
let counter=0;

function startWebSocket(symbols) {
    socket = new WebSocket(`wss://ws.finnhub.io?token=${token}`);

    socket.addEventListener('open', () => {
        console.log('WebSocket connected.');
        symbols.forEach((symbol)=>{
            socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': symbol }));
        })
    });

    let processingData = {};
    symbols.forEach(symbol => {
        processingData[symbol] = false; 
    });

    // console.log(processingData);

    socket.addEventListener('message',async (event) => {
        const message = JSON.parse(event.data);
        if(message.data && message.data.length > 0){
            try{
                if (!processingData[message.data[0].s]) {
                    processingData[message.data[0].s] = true;
                    
                    counter+=1
                    // console.log(message);
                    console.log('Message from server:', message.data[0]?.p,message.data[0]?.s);
                    console.log("Counter",counter);
        
                    const newData = {
                        symbol: message.data[0]?.s,
                        price: message.data[0]?.p,
                        timestamp: new Date()
                    };
                    await PriceModel.create(newData);
                    setTimeout(() => {
                        processingData[message.data[0].s] = false;
                    }, 3000);
                
                }
            }catch(err){
                processingData[message.data[0].s]=false;
            }
    }});
    

    socket.addEventListener('close', () => {
        console.log('WebSocket closed.');
        reconnectWebSocket();
    });

    socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error.message);
        socket.close();
    });
}

function reconnectWebSocket() {
    startWebSocket(symbols);
}


startWebSocket(symbols);

app.get('/api/prices/:symbol', async (req, res) => {
    try {
        const prices = await PriceModel.find({symbol:req.params.symbol}).select(["price","timestamp","-_id"]).sort({ timestamp: -1 }).limit(20);
        res.json(prices);
    } catch (error) {
        console.error('Error fetching prices:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/stocks',(req,res)=>{
    res.json(symbols);
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


