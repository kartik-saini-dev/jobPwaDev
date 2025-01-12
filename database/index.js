import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URL; 

const connection = { isConnected: false };

const connectToDb = async () => {

  if (connection.isConnected) {
    // Use existing database connection
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI, {
      // dbName: 'JobPwa', uncomment this during deployment
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    connection.isConnected = db.connections[0].readyState === 1 || db.connections[0].readyState === 2;
   
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
          
  }
  mongoose.connection.on('disconnected', () => {
   
    connection.isConnected = false;
  });
  
  mongoose.connection.on('reconnected', () => {
  
    connection.isConnected = true;
  });
};

export default connectToDb;


