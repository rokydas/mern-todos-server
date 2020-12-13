const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

const db = process.env.DB;
const collection = process.env.COLLECTION;
const user = process.env.USER;
const password = process.env.PASSWORD;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${user}:${password}@cluster0.muwip.mongodb.net/${db}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const todosCollection = client.db(`${db}`).collection(collection);

    app.get('/', (req, res) => {
        res.send('Hello I am your new node js project');
    })

    app.get('/todos', (req, res) => {
        todosCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // app.post('/insert', (req, res) => {
    //     const question = req.body.question;
    //     const answer = req.body.answer;
    //     const email = req.body.email;

    //     if (question && answer && email) {
    //         qaCollection.insertOne({ question, answer, email })
    //             .then(result => {
    //                 res.send(result.insertedCount > 0)
    //             })
    //     }
    // })

    // app.post('/delete', (req, res) => {
    //     qaCollection.deleteOne({"_id": ObjectId(req.body.id)})
    //         .then(result => {
    //             res.send(result.deletedCount > 0);
    //         })
    // });

});

app.listen(process.env.PORT || 5000);  