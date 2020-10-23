const moment = require('moment');
const config = require('config');
const models = require('../database').models;

let working = false;
module.exports = {
    cronTime: config.jobs.exampleJob.cron,
    onTick: async function() {
        console.log('=== Example job started ===');
        if (!working) {
            working = true;
            try {
                console.log(`=== Example job body ===`);
            } catch (e) {
                console.error(e);
            } finally {
                working = false;
            }
        } else {
            console.log('Fetching contracts job still working');
        }
    },
};

