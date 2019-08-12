const mongoose = require('mongoose')
 
const CONNECTION_URL = "mongodb+srv://usr-juridico:6TgYHUgbSfdLcN9@cluster0-54w6g.gcp.mongodb.net/juridico?retryWrites=true";
const DATABASE_NAME = "juridico";

mongoose.connect( CONNECTION_URL, { useNewUrlParser: true } );
 
const configDb = mongoose.connection;
configDb.on('error', console.error.bind(console, 'connection error:'));
configDb.once('open', function() {
  // we're connected!
  console.log("Connected to MongoDB database")
});
 
module.exports = configDb;