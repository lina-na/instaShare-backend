'use strict';
const mongoose = require('mongoose');

let File = new mongoose.Schema({
    original_name: {
       type: String,
       default: '',
       required: true, 
    },
    file_name: {
        type: String,
        default: '',
        required: true,
    },
    file_type: {
        type: String,
        default: ''
    },
    owner_id: {
        type: String,
        default: null,
        required: true,
    },
    upload_date: {
        type: Date,
        default: Date.now, 
    },
    file_path: {
      type: String,
      default: '',
      required: true,  
    },
    storage_used: {
        type: String,
        default: '',
        required: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    }
}, {collection: 'files'});

File = mongoose.model('File', File);
module.exports = File;
