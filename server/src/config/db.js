const mongoose = require('mongoose');
const { mongodbUrl } = require('../secrete');
const connectDatabase = async (options = {}) => {
    try { 
        await mongoose.connect(mongodbUrl, options);
        console.log("MongoDB connected");

        mongoose.connection.on('error', (e) => {
            console.error('Db connection error:',e);
         });
    }
    catch(e){
        console.error("MongoDB not connected:", e.toString());
    }
};
 
module.exports = connectDatabase;