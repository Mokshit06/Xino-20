const mongoose = require('mongoose');
// if (process.env.NODE_ENV === 'development') {
require('dotenv').config();
// }

const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log(`Mongo connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connect;
