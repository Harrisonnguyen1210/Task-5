'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const multer = require('multer');
const db = require('./modules/database');
const rs = require('./modules/resize');
const exif = require('./modules/exif');
const connection = db.connect();
const upload = multer({dest: 'public/img/uploads/'});

app.use(express.static('public'));
app.use('/modules', express.static('node_modules'));
// upload the file
app.post('/upload', upload.single('mediafile'), (req, res, next) => {
    next();
});
//create medium image
app.use('/upload', (req, res, next) => {
    rs.resize(req.file.path, 640, 'public/img/medium/'+req.file.filename+'_medium', next);
});
//create thumbnail
app.use('/upload', (req, res, next) => {
    rs.resize(req.file.path, 200, 'public/img/thumbnail/'+req.file.filename+'_thumb', next);
});
//get coordinates
app.use('/upload', (req, res, next) => {
    exif.getCoordinate(req.file.path).then(coords => {
        req.coordinates = coords;
        next();
    });
});
//insert to database
app.use('/upload', (req, res, next) => {
    const data = [req.body.category, req.body.title, req.body.details, req.file.filename+'_thumb', req.file.filename+'_medium', req.file.filename, req.coordinates];
    res.send('Upload is done');
    next();
    db.insert(data, connection, next);
});

app.use('/listPic', (req, res, next) => {
    db.select(res, connection, next);
});


app.listen(3000);