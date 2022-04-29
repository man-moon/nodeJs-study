const express = require('express');
const logger = require('morgan');
const axios = require('axios');
//const list = require('./data');
const firebase = require('./firebase');

// import express from 'express';
// import logger from 'morgan';
// import axios from 'axios';   
// import firebase from "./firebase.js";

const app = express()
const port = 3000


app.use(express.json())
app.use(express.urlencoded({ 'extended': true }));
app.use(logger('dev'));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html')
    //res.send('Hello World!')
})

// app.get('/music_list', (req, res) => {
//     res.json(list);
// })

app.get('/likes', async (req, res) => {
    var db = firebase.firestore();
    const snapshot = await db.collection('likes').get().catch(e => console.log(e));
    var results = [];
    if (snapshot.empty) {
        console.log("No result");
        res.json([]);
        return;
    } 
    else {
        snapshot.forEach(doc => {
            results.push({ id: doc.id, like: doc.data().like })
            console.log(doc.id, '=>', doc.data());
        })
        res.json(results);
    }
})

app.get('/likes/:id', async (req, res) => {
    var db = firebase.firestore();
    var result = [];
    var flag = true;
    const snapshot = await db.collection('likes').get();
    var input_id = req.params.id;
    try{
        snapshot.forEach(doc => {
            if(doc.id == input_id){
                flag = false;
                db.collection('likes').doc(doc.id).delete();
                result.push({ msg : "OK" });
                res.json(result);
                return;
            }
        })
        if(flag){
            db.collection('likes').doc(input_id).set({ id: input_id, like: input_id });
            result.push({ msg : "OK" });
            res.json(result);
        }
    }
    catch(e){
        res.json({ msg : "Failed"});
    }
})




app.get('/musicSearch/:term', async (req, res) => {
    const params = {
        term: req.params.term,
        entity: "album"
    }
    //var response = await axios.get('https://itunes.apple.com/search', {params, params});
    var response = await axios.get('https://itunes.apple.com/search', { params: params }).catch(e => console.log(e));
    console.log(response.data);
    res.json(response.data);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})






app.get('/user/:id/:name', (req, res) => {
    res.send(`User id is ${req.params.id}:${req.params.name}`);
})

app.get('/user', (req, res) => {
    res.send(`User id is ${req.query.id}`);
})

app.post('/user', (req, res) => {
    console.log(req.body.name);
    res.send(req.body);
})