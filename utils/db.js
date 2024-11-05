const mongoose = require('mongoose');
let db;

const connect = async () => {
    db = null;
    try {
        mongoose.set('strictQuery', false);

        let dbUrl = process.env.DB_ATLAS_URL

        if(process.env.ENVIRONMENT === 'testing') {
            dbUrl = process.env.TEST_DB_ATLAS_URL
        }

        await mongoose.connect(process.env.DB_ATLAS_URL);

        console.log('Connected successfully to db');
        db = mongoose.connection;
    } catch (error) {
        console.log(error);
    } finally {
        if (db !== null && db.readyState === 1) {
            // await db.close();
            // console.log("Disconnected successfully from db");
        }
    }
};

const disconnect = async () => {
    await db.close();
};

module.exports = { connect, disconnect };
