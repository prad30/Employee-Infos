const express = require('express'); 
const dotenv = require('dotenv'); 
const cors = require('cors'); 
const connectDB = require('./config/db'); 
const employeeRoutes = require('./routes/employeeRoutes'); 

dotenv.config(); 
connectDB(); 

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Route for employee API endpoints
app.use('/api/employees', employeeRoutes);


app.get('/', (req, res) => {
  res.send('API is running'); 
});

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ error: 'Something went wrong!' }); 
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
