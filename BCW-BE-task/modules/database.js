'use strict';
const mysql = require('mysql2');

const connect = () => {
    // create the connection to database
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
    });
};

const select = (res, connection, callback) => {
    // simple query
    connection.query(
        'SELECT * FROM bc_media',
        (err, results, fields) => {
            res.json(results);
            callback();
        },
    );
};

const insert = (data, connection, callback) => {
    // simple query
    connection.execute(
        'INSERT INTO bc_media (category, title, details, thumbnail, image, original, coordinates) VALUE (?, ?, ?, ?, ?, ?, ?);',
        data,
        (err, results, fields) => {
            callback();
        },
    );
};

const selectUser = (data, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM user WHERE user.username = ? AND user.password = ?',
            data,
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(results);
            },
        );
    });
};

const insertUser = (req, res, data, connection) => {
    connection.execute(
        'INSERT INTO user (last_name, first_name, email, username, password) VALUES (?, ?, ?, ?, ?);',
        data,
        (err, results, fields) => {
            console.log('Insert user is called');
            if(err) console.log(err);
            connection.query(
                `SELECT * FROM user WHERE username = '${data[3]}'`,
                (err, results, fields) => {
                    if(err) console.log(err);
                    console.log(results[0]);
                    req.login(results[0], function(err) {
                        if (err) { console.log(err) }
                        res.redirect('/profile');
                    });
                }
            );
        }
    )
};

module.exports = {
    selectUser:selectUser,
    insertUser:insertUser,
    connect: connect,
    select: select,
    insert: insert,
};