const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tw6gw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();
        const volunteersCollection = client.db('greenPeace').collection('volunteers');
        const eventCollection = client.db('greenPeace').collection('events');
        const selectedEvents = client.db('greenPeace').collection('selected');

        // Volunteers api
        app.get('/volunteers', async (req, res) => {
            const query = {};
            const cursor = volunteersCollection.find(query);
            const volunteers = await cursor.toArray();
            res.send(volunteers)
        })

        app.post('/volunteers', async (req, res) => {
            const query = req.body;
            const result = await volunteersCollection.insertOne(query);
            res.send(result)
        })

        // delete volunteers 
        app.delete('/deletevolunteers', async (req, res) => {
            const id = req.query._id;
            console.log(id);

            const filter = { _id: ObjectId(id) };
            const result = await volunteersCollection.deleteOne(filter);
            res.send(result)
        })



        app.get('/findall', async (req, res) => {
            const query = {};
            const data = selectedEvents.find(query)
            const result = await data.toArray()
            res.send(result)
        })


        app.get('/selected', async (req, res) => {
            const email = req.query.email;
            console.log(email);

            const query = { email: email }
            const cursor = selectedEvents.find(query)
            const selected = await cursor.toArray();
            res.send(selected)
        })


        app.delete('/selected', async (req, res) => {
            const id = req.query._id;
            console.log(id);

            const filter = { _id: ObjectId(id) };
            const result = await selectedEvents.deleteOne(filter);
            res.send(result)

        })

        // all events
        app.get('/events', async (req, res) => {
            const query = {};
            const cursor = eventCollection.find(query);
            const events = await cursor.toArray();
            res.send(events)
        })

        // find by title 
        app.get('/eventbytitle', async (req, res) => {
            const title = req.query;
            const event = await eventCollection.findOne(title)
            res.send(event)
        })

        app.post('/event', async (req, res) => {
            const newEvent = req.body;
            const result = await eventCollection.insertOne(newEvent);
            res.send(result)
        })

        // selected events
        app.post('/selected', async (req, res) => {
            const query = req.body;
            console.log(query);
            const result = await selectedEvents.insertOne(query)
            res.send(result)
        })

        // one event
        app.get('/event/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = await eventCollection.findOne({ _id: ObjectId(id) })
            res.send(filter)

            // const filter = await eventCollection.findOne(query)
            // const result = filter.toArray()
            // res.send(result)
        })

        // by id 
        app.get('/event/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await eventCollection.deleteOne(filter);
            res.send(result)
            console.log(id);
        })


        // edit api
        app.put('/event/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    eventName: data.eventName, image: data.image
                },
            };
            const result = await eventCollection.updateOne(filter, updateDoc, options)
            res.send(result)
            console.log(id);
            console.log(data);

        })


        // delete data 
        app.delete('/event/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await eventCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }

            res.send(result)
        })


    }
    finally {

    }

}


run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Green Peace Server Running');
})


app.listen(port, () => {
    console.log('Server Running Port Is: ', port);
})