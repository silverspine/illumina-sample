/////////////////////////////////
// clients resource controller //
/////////////////////////////////
const express = require('express');
const router = express.Router();

const Client = require('../models/client');
const BaseResponse = require('../helpers/base_response');
const sendError = require('../helpers/error_handler');

const tokenVerify = require('../middleware/token_verify');
router.use('/', tokenVerify);

///////////////////
// Client routes //
///////////////////
router.route('/')
	/**
	 * Create a new Client
	 */
	.post((req, res) => {
		let formFields = req.body;
		let client = new Client();
		client.name = formFields.name;
		client.phone = formFields.phone;
		client.married = formFields.married;
		client.male = formFields.male;
		client.age = formFields.age;
		client.profession = formFields.profession;
		client.save()
			.then((client) => {
				let status = 201;
				res.status(status).json(new BaseResponse(client, status));
			})
			.catch((err) => {				
				sendError(err, res, 409);
			});
	})

	/**
	 * List Clients
	 */
	.get((req, res) => {
		Client.find()
		.then((clients) => {
            res.json(new BaseResponse(clients));
        })
        .catch((err) => {
            sendError(err, res);
        });
	});

////////////////////////////
// Specific Client routes //
////////////////////////////
router.route('/:id')
	/**
	 * Get a specific Client
	 */
	.get((req, res) => {
		Client.findById(req.params.id)
		.then((client) => {
			if (client)
				res.json(new BaseResponse(client));
			else
				sendError('Client not found',res, 404);
		})
		.catch((err) => {
			sendError(err,res);
		})
	})

	/**
	 * Update a Client
	 */
	.put((req, res) => {
		let formFields = req.body;
		Client.findById(req.params.id)
		.then((client) => {
			client.name = formFields.name;
			client.phone = formFields.phone;
			client.married = formFields.married;
			client.male = formFields.male;
			client.age = formFields.age;
			client.profession = formFields.profession;
			client.save()
			.then((client) => {
				res.json(new BaseResponse(client));
			})
			.catch((err) => {
				sendError(err, res);
			});
		})
		.catch((err) => {
			sendError(err, res);
		});
	})

	/**
	 * Delete a Client
	 */
	.delete((req, res) => {
		Client.remove({_id: req.params.id})
		.then(() => {
			let status = 201;
			res.status(status).json(new BaseResponse([], status, 'Successfully deleted'));
		})
		.catch((err) => {
			sendError(err, res);
		})
	});

module.exports = router;