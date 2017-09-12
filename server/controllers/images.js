///////////////////////
// Images controller //
///////////////////////
const express = require('express');
const router = express.Router();
const moment = require('moment');
const _ = require('lodash');
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
const upload = multer({ dest: config.UPLOAD_DIR }).single('image');
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
            let fileExtension = _.last(req.file.originalname.split('.'));
            let oldFileName = req.file.filename;
            let newFileName = moment()+'.'+fileExtension;
            fs.rename(config.UPLOAD_DIR+oldFileName, config.UPLOAD_DIR+newFileName, function (err) {
                if (err) throw err;
                let path;
                if(config.APP_DOMAIN.endsWith('/'))
                    path = config.APP_DOMAIN+'uploads/'+newFileName;
                else
                    path = config.APP_DOMAIN+'/uploads/'+newFileName;
                res.json(new BaseResponse(path));
            });
        });
    });

/**
 * Delete an image
 */
router.route('/:name')
    .delete((req, res) => {
        fs.unlink(config.UPLOAD_DIR+req.params.name, (err) => {
            if (err){
                sendError(err, res);
                return;
            }
            let status = 201;
            res.status(status).json(new BaseResponse([], status, 'Successfully deleted'));
        });
    });

module.exports = router;