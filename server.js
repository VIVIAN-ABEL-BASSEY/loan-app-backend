// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");

// const app = express();

// // Middleware
// app.use(express.json());  // Parse JSON requests
// app.use(cors());  // Enable CORS
// app.use(helmet());  // Security headers
// app.use(morgan("dev"));  // Log requests

// // Basic Route
// app.get("/", (req, res) => {
//     res.send("Loan App Backend is Running...");
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require("./routes/groupRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const transactionRoutes = require("./routes/transactionRoutes");
const errorHandler = require("./middleware/errorHandler");
const identityRoutes = require('./routes/identityRoutes');
// Initialize Express App
const app = express();
// Connect to MongoDB
connectDB();
// Middleware
app.use(express.json());  
app.use(cors());  
app.use(helmet());  
app.use(morgan("dev"));  
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/groups", groupRoutes);
app.use('/api', identityRoutes);
app.use('/api', paymentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use(errorHandler);


// Basic Route
app.get("/", (req, res) => {
    res.send("Loan App Backend is Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
