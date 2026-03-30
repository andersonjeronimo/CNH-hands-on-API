import dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ServerApiVersion } from "mongodb";
import { ObjectId } from 'mongodb';
import Price from '../models/price';

const uri = `${process.env.URI}`;
const dbName = `${process.env.DATABASE_NAME}`;
const collectionName = `${process.env.COLLECTION_PRICES_NAME}`;

//Teste de conexão++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
//run().catch(console.dir);
//Teste de conexão++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//https://www.mongodb.com/pt-br/docs/drivers/node/current/crud/insert/

async function findPrice() {
    let document;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        document = await collection.findOne({});
    } finally {
        await client.close();
    }
    return document;
}

async function setPrice(document: {}) {
    let result;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        const database = client.db(dbName);
        const price = database.collection(collectionName);
        result = await price.insertOne(document);
    } finally {
        await client.close();
    }
    return result.insertedId;
}

async function updatePrice(document: Price) {
    let result;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        const database = client.db(dbName);
        const price = database.collection(collectionName);
        result = await price.updateOne({ _id: new ObjectId(document._id) }, document);
    } finally {
        await client.close();
    }
    return result.upsertedId;
}

export default { findPrice, setPrice, updatePrice }