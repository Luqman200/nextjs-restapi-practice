import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connect = () => {
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
        console.log('Already connect');
        return;
    } else if (connectionState === 2) {
        console.log('Connecting');
        return;
    }
    try {
        mongoose.connect(MONGODB_URI!, {
            dbName: 'next14RestApi',
            bufferCommands: true,
            //  useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log('Connection established');
    } catch (err: any) {
        console.log('Error:', err);
        throw new Error('Error: ', err);
    }
};

export default connect;

// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//     throw new Error('Please add your Mongo URI to .env.local');
// }

// let cached: any = global.mongoose;

// if (!cached) {
//     cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectToDatabase() {
//     if (cached.conn) {
//         return cached.conn;
//     }

//     if (!cached.promise) {
//         const opts = {
//             dbName: 'next14RestApi',
//             bufferCommands: false,
//         };

//         cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
//             return mongoose;
//         }).catch((err) => {
//             console.error('Failed to connect to MongoDB', err);
//             throw err;
//         });
//     }

//     cached.conn = await cached.promise;
//     return cached.conn;
// }

// export default connectToDatabase;

