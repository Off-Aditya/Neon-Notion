const mongoose = require("mongoose");

URI = " /notion"  // or MongoDB URI

mongoose.connect(URI); 


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Database Connected`);
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
