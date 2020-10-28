// const authenticate = require('../../middleware/authenticate');
const errors = require('../../errors');
const router = require('express').Router();
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const authenticate = require('../../middleware/authenticate');

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

let upload = multer({
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
    authenticate(),
    errors.wrap(async (req, res) => {
        const url = req.protocol + '://' + req.get('host')
        const models = res.app.get('models');
        let file;
        if (req.file) {
    // fileSize in Kb
        const fileSize = (req.file.size * 0.0009765625).toFixed(2)
        let fileData = {
           file_path: url + '/public/' + req.file.filename,
           file_type: req.file.mimetype,
           original_name: req.file.originalname,
           owner_id: res.locals.user.id,
           file_name: req.file.filename,
           storage_used: fileSize
        };
        file = await models.File.create(fileData);
    }
        if (!file) throw errors.NotFoundError('Can not create file');
        return res.json({
            file: file,
        });        
    })
);
  
module.exports=router;
