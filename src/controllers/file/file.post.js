// const authenticate = require('../../middleware/authenticate');
const errors = require('../../errors');
const router = require('express').Router();
const multer = require('multer');
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const a =require('./');

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// User model

router.post('/upload', upload.single('file'),
    errors.wrap(async (req, res) => {
        const models = res.app.get('models');
        let fileData = {
           file_path: url + '/public/' + req.file.filename,
           file_type: req.file.contentType,
           originalname: req.file.filename,
           ower_id: '1',
        };
        const file = await models.File.create(fileData);
        if (!file) throw errors.NotFoundError('Can not create file');
        return res.json({
            file: file,
        });        
    })
);
  
module.exports=router;
