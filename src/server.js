require('dotenv').load({path: process.env.DOTENV || '.env'});
const database = require('./database');
const errors = require('./errors');
const express = require('express');
const cron = require('cron');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const klawSync = require('klaw-sync');
const config = require('config');
const crypto = require('crypto');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const app = express();

jobs = {};
const root = __dirname;
const pathToJobs = root + '/jobs';

/* globals */
models = require('./database').models;
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
});
app.set('models', database.models);
app.set('mongoСlient', database.mongoСlient);

/* configure logger */
configureLogger();

app.use(express.static(path.join(root, '../client/www/dist')));


/* set CORS */
app.use(cors({origin: '*'}));
require('./swagger')(app);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.info(`${new Date()}: [${req.method}] ${req.url}`);
    next();
});

useControllers();
    // .then(init())
    // .then(startJobs());

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: {
            name: err.name,
            message: err.message,
        },
    });
    next();
});

/**
 *
 */
async function useControllers() {
    const paths = klawSync(`${__dirname}/controllers`, {nodir: true});
    let controllersCount = 0;
    paths.forEach((file) => {
        if (path.basename(file.path)[0] === '_' || path.basename(file.path)[0] === '.') return;
        app.use('/', require(file.path));
        controllersCount++;
    });

    console.info(`Total controllers: ${controllersCount}`);
};

async function startJobs() {
    let counter = 0;
    const paths = await klawSync(pathToJobs, {nodir: true});
    paths.forEach((file) => {
        const jobConfig = require(file.path);
        const jobName = path.basename(file.path, '.js');
        const job = new cron.CronJob(jobConfig);
        if (config.app.autoJobs && !config.app.skipJobs.includes(jobName)) {
            console.log(`Job ${jobName} started.`);
            job.start();
            counter++;
        }
        jobs[jobName] = jobConfig.onTick;
    });
    console.info(`Jobs started: ${counter}`);
};

function configureLogger() {
    process.on('uncaughtException', function (err) {
        console.error('uncaughtException', err);
    });
    process.on('uncaughtRejection', function (err) {
        console.error('uncaughtRejection', err);
    });
    process.on('unhandledRejection', (reason, promise) => {
        console.error('unhandledRejection', reason);
    });
    console.info(`Logging settings: ${process.env.DEBUG}`);
};

app.listen(config.app.port, '0.0.0.0', async function () {
        console.info(`${new Date()}: Server listening on port: ${config.app.port}`);
    });

module.exports = app;
