const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const db = require('../config/db');


/**
 * Connect to the database
 */
const connection = (closure) => {
    return MongoClient.connect(db.url, (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

/**
 * Error handling
 */
const sendError = (err, res, status = 501) => {
    response.status = status;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(status).json(response);
};

/**
 * Response handling
 */
let response = {
    status: 200,
    data: [],
    message: null
};


/*==================
	User routes
====================*/

/**
 * Get users 
 */
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

/**
 * Create new user
 */
router.post('/users', (req, res) => {
    let newUser = req.body;

    if (!req.body.username) {
		sendError("Must provide a username.", res, 400);
	}else{
		connection((db) => {
			db.collection('users')
				.insert(newUser)
				.then((result) => {
					response.data = result.ops[0];
					res.json(response);
				})
				.catch((err) => {
					sendError(err, res);
				});
		});
	}
});

/**
 * Get a user
 */
router.get('/users/:id', (req, res) => {
	let id = req.params.id;

    connection((db) => {
        db.collection('users')
            .findOne({_id: new ObjectID(id)})
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

/**
 * Update a user
 */
router.put('/users/:id', (req, res) => {
    let newUser = req.body;
    let id = req.params.id;

    if (!req.body.username) {
		sendError("Must provide a username.", res, 400);
	}else{
		connection((db) => {
			db.collection('users')
				.insert(newUser)
				.then((result) => {
					response.data = result.ops[0];
					res.json(response);
				})
				.catch((err) => {
					sendError(err, res);
				});
		});
	}
});

/**
 * Remove a user
 */
router.delete('/users/:id', (req, res) => {
    let id = req.params.id;
	
    connection((db) => {
        db.collection('users')
            .deleteOne({_id: new ObjectID(id)})
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;