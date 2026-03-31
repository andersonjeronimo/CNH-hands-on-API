import dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ServerApiVersion } from "mongodb";
import { ObjectId } from 'mongodb';

//Webhook Mercado Pago
import { Category, Status, Vehicle, Properties, Filter } from "../utils/utils";
import Instructor from '../models/instructor';

const uri = `${process.env.URI}`;
const dbName = `${process.env.DATABASE_NAME}`;
const collectionName = `${process.env.COLLECTION_INSTRUCTORS_NAME}`;

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
run().catch(console.dir);
//Teste de conexão++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//https://www.mongodb.com/pt-br/docs/drivers/node/current/crud/insert/

async function insertInstructor(document: {}) {
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
        const customers = database.collection(collectionName);
        result = await customers.insertOne(document);
    } finally {
        await client.close();
    }
    return result.insertedId;
}

async function updateInstructor(document: Instructor) {
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
        const customers = database.collection(collectionName);
        result = await customers.updateOne({ _id: new ObjectId(document._id) }, document);
    } finally {
        await client.close();
    }
    return result.upsertedId;
}


async function auth(email: String) {
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
        document = await collection.findOne({ email: { $eq: email } });

    } finally {
        await client.close();
    }
    return document;
}

async function findInstructor(props: Properties) {
    let document;
    let filter = {};

    if (props.name === "id") {
        filter = { _id: new ObjectId(props.value) };
    }
    else if (props.name === "userid") {
        filter = { userId: { $eq: props.value } };
    }
    else if (props.name === "cpf") {
        filter = { cpf: { $eq: props.value } };
    }
    else if (props.name === "cnpj") {
        filter = { cnpj: { $eq: props.value } };
    }

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
        document = await collection.findOne(filter);
    } finally {
        await client.close();
    }
    return document;
}

async function findInstructors(filter: Filter) {
    let documents;   

    const query1 = {
        $match: {
            status: { $eq: Status.Ativo },
            stateId: { $eq: filter.stateId }
        }
    }

    let query2 = {};    
    if (filter.vehicle === Vehicle.Aluno) {
        query2 = {
            $match: {
                $or: [{ vehicle: { $eq: Vehicle.Aluno } }, { vehicle: { $eq: Vehicle.Ambos } }]
            }
        }
    } else if (filter.vehicle === Vehicle.Instrutor) {
        query2 = {
            $match: {
                $or: [{ vehicle: { $eq: Vehicle.Instrutor } }, { vehicle: { $eq: Vehicle.Ambos } }]
            }
        }
    } else if (filter.vehicle === Vehicle.Ambos) {
        query2 = {
            $match: {
                $or: [{ vehicle: { $eq: Vehicle.Aluno } }, { vehicle: { $eq: Vehicle.Instrutor } }, { vehicle: { $eq: Vehicle.Ambos } }]
            }
        }
    }

    let query3 = {};    
    if (filter.category === Category.A) {
        query3 = {
            $match: {
                $or: [{ category: { $eq: Category.A } }, { category: { $eq: Category.AB } }]
            }
        }
    } else if (filter.category === Category.B) {
        query3 = {
            $match: {
                $or: [{ category: { $eq: Category.B } }, { category: { $eq: Category.AB } }]
            }
        }
    } else if (filter.category === Category.AB) {
        query3 = {
            $match: { category: { $eq: Category.AB } }
        }
    }

    let query4 = {};
    if (filter.callByMicroregion) {
        query4 = {
            $match: {
                $or: [{ callByMicroregion: { $eq: true } }, { cityId: { $eq: filter.cityId } }],
                microregionId: { $eq: filter.microregionId }
            }
        }
    } else if (!filter.callByMicroregion) {
        query4 = {
            $match: {
                cityId: { $eq: filter.cityId }
                //$and: [{ callByMicroregion: { $eq: false } }, { microregionId: { $eq: microregionId } }]
            }
        }
    }

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
        const pipeline = [];
        pipeline.push(query1);
        pipeline.push(query2);
        pipeline.push(query3);
        pipeline.push(query4);

        documents = await collection.aggregate(pipeline)
            .skip(filter.skip)
            .limit(filter.limit)
            .toArray();
    } finally {
        await client.close();
    }
    return documents;
}

//Webhook Mercado Pago+++++++++++++++++++++++++++++++++++++++++++++
async function updateInstructorStatus(cpf: string, event: string) {
    /* Eventos:
    ✅ subscription_created
    ✅ payment_succeeded
    ✅ payment_failed
    ✅ subscription_cancelled */
    let new_status;
    switch (event) {
        case "payment_succeeded":
            new_status = Status.Ativo;
            break;

        case "payment_failed":
            new_status = Status.Pausado;
            break;

        case "subscription_cancelled":
            new_status = Status.Inativo;
            break;

        default:
            break;
    }

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
        const collection = database.collection(collectionName);
        result = await collection.updateOne(
            { cpf: cpf },
            {
                $set: {
                    status: new_status,
                },
            },
            /* Set the upsert option to insert a document if no documents
            match the filter */
            { upsert: true }
        );
        // Print the number of matching and modified documents
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        );
    } finally {
        // Close the connection after the operation completes
        await client.close();
    }
    return result.upsertedId;

}
//Webhook Mercado Pago+++++++++++++++++++++++++++++++++++++++++++++

export default {
    insertInstructor,
    updateInstructor,
    auth,
    findInstructor,
    findInstructors,
    updateInstructorStatus
}