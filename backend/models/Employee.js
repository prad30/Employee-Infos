const mongoose = require('mongoose');

//database schema
const EmployeeSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  empName: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  summary: { type: String, required: true },
});

const Employee = mongoose.model('employee_infos', EmployeeSchema); 

module.exports = Employee;