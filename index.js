const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0m3pw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run() {


    try {
        await client.connect();
        console.log('connected to database')
        const database = client.db("travel");
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('myorders')

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POSI api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        })
        // post ORDERS API 
        app.post('/myorders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            console.log(result)

            res.json(result);
        })
        // get orders api
        app.get('/myorders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            console.log('get data from database', orders)
            res.send(orders);
        })

        // GET Single Order
        app.get('/myorders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const order = await orderCollection.findOne(query);
            res.json(order);
        })

    }



    finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('the travel server is running')
})

app.listen(port, () => {
    console.log('running the travel server', port)
})