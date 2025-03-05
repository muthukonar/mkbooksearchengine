import mongoose from 'mongoose';

const db = {
  uri: 'mongodb://127.0.0.1:27017/mkgooglebooks',
  options: {

  }
};

mongoose.connect(db.uri, db.options)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

  export default db;