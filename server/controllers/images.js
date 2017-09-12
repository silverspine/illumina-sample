///////////////////////
// Images controller //
///////////////////////
const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs');

///////////////////////////////
// Configuration file import //
///////////////////////////////
const config = require('../config/server');

////////////////////
// Helper imports //
////////////////////
const BaseResponse = require('../helpers/base_response');
const sendError = require('../helpers/error_handler');

/////////////////////////////////////////////////////
// Multer middleware to handle multipart form data //
/////////////////////////////////////////////////////
const multer = require('multer');
const upload = multer({
    dest: config.UPLOAD_DIR,
    rename: function (fieldname, filename) {
        return filename + moment();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
}).single('image');
router.use('/', upload);

//////////////////
// Image routes //
//////////////////
/**
 * Upload an image
 */
router.route('/')
    .post((req, res) => {
        upload(req, res, function (err) {
            if (err) {
                sendError(err, res);
            }
            let path;
            if(config.APP_DOMAIN.endsWith('/'))
                path = config.APP_DOMAIN+'uploads/'+req.file.filename;
            else
                path = config.APP_DOMAIN+'/uploads/'+req.file.filename;
            res.json(new BaseResponse(path));
        });
    });

/**
 * Delete an image
 */
router.route('/:name')
    .delete((req, res) => {
        fs.unlink(config.UPLOAD_DIR+req.params.name, (err) => {
            if (err) sendError(err, res);;
            let status = 201;
            res.status(status).json(new BaseResponse([], status, 'Successfully deleted'));
        });
    });

module.exports = router;