const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); 

// Create Employee (POST)
router.post('/', async (req, res) => {
  try {
    console.log("Received employee data:", req.body); 
    const employee = new Employee(req.body); 
    await employee.save(); 
    res.status(201).json(employee); 
  } catch (error) {
    console.error("Error adding employee:", error); 
    res.status(400).json({ error: error.message });
  }
});

// Read Employees (GET)
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find(); 
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read Single Employee (GET)
router.get('/:empId', async (req, res) => {
  // alert("Received empId:", req.params.empId); 
  try {
    const employee = await Employee.findOne({ empId: req.params.empId });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update Employee (PUT)
router.put('/:empId', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId: req.params.empId },
      req.body,
      { new: true, runValidators: true } 
    );
    if (!updatedEmployee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Employee (DELETE)
router.delete('/:empId', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ empId: req.params.empId });
    if (!deletedEmployee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
