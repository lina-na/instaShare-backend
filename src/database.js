'use strict';

const debug = require('debug')('lg:database');
const mongoose = require('mongoose');
const path = require('path');
const klawSync = require('klaw-sync');
const Grid = require('gridfs-stream');

const models = {};

const modelsPaths = klawSync(`${__dirname}/models`, {nodir: true});
mongoose.set('useFindAndModify', false);

const mongoСlient = mongoose.connect(process.env.DB_CONNECT, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

Grid.mongo = mongoose.mongo;

mongoose.set('debug', true); // enabling debugging information to be printed to the console for debugging purposes
modelsPaths.forEach((file) => {
    if (!require(path.resolve(__dirname, file.path))) return;
    const pathArray = file.path.split('/');
    const name = pathArray[pathArray.length - 1].split('.')[0];
    let model = require(path.resolve(__dirname, file.path));
    models[name] = model;
});

Object.keys(models).forEach((name) => {
    if ('associate' in models[name]) {
        models[name].associate(models);
    }
});
debug(`Available models: \n\t* ${Object.keys(models).join('\n\t* ')}`);

mongoose.Promise = Promise; 
module.exports = {mongoСlient, models};
