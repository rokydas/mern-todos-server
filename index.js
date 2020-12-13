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
const { ObjectId } = require('mongodb');
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

    app.post('/insert', (req, res) => {
        const taskName = req.body.taskName;
        const taskDetails = req.body.taskDetails;
        const email = req.body.email;

        if (taskName && taskDetails && email) {
            todosCollection.insertOne({ taskName, taskDetails, email })
                .then(result => {
                    res.send(result.insertedCount > 0)
                })
        }
        else {
            res.send(false);
        }
    })

    app.post('/delete', (req, res) => {
        todosCollection.deleteOne({ "_id": ObjectId(req.body._id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    });

    app.post('/update', (req, res) => {
        const taskName = req.body.taskName;
        const taskDetails = req.body.taskDetails;
        const email = req.body.email;
        const id = req.body.id;

        if (taskName && taskDetails && email) {
            todosCollection.updateOne({_id: ObjectId(id)}, {
                $set: {taskName: taskName, taskDetails: taskDetails, email: email}
              })
                .then(result => {
                    res.send(result.modifiedCount > 0);
                })
        }
        else {
            res.send(false);
        }


    });

});

app.listen(process.env.PORT || 5000);  