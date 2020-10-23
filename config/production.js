module.exports = {
    pg: {
        logging: process.env.PG__LOGGING ? JSON.parse(process.env.PG__LOGGING) : false,
        uri: process.env.DATABASE_URL,
    },
    app: {
        port: process.env.PORT || 3000,
        uploadDir: process.cwd() + '/uploads',
        autoJobs: process.env.AUTO_JOBS === 'TRUE',
        skipJobs: process.env.SKIP_JOBS ? process.env.SKIP_JOBS.split(', ') : [],
    },
    jobs: {
        exampleJob: {
            name: 'example_job',
            cron: '0 30 */1 * * *',
        },
    },
};
