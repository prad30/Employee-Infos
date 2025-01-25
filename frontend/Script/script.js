const API_BASE_URL = "http://localhost:5000/api/employees";

// Display all employees and searched data

function fetchEmployees(searchQuery = "") {
    fetch(API_BASE_URL)
        .then(response => response.json())
        .then(data => {
            const table = document.querySelector('.table-list');
            const noDataMessage = document.querySelector('.no-data-found'); 
            
            if (noDataMessage) noDataMessage.remove();
            
            if (table) {
                table.innerHTML = `
                    <tr>
                        <th>Emp ID</th>
                        <th>Emp Name</th>
                        <th>Position</th>
                        <th>Salary</th>
                        <th></th>
                    </tr>
                `;
                const filteredData = data.filter(employee =>
                    employee.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.empId.toString().includes(searchQuery) ||
                    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.salary.toString().includes(searchQuery)
                );
                
                if (filteredData.length === 0) {
                    const messageDiv = document.createElement('div');
                    // const tableData=document.querySelectorAll('th');
                    // tableData.style.display="none";
                    messageDiv.classList.add('no-data-found');
                    // messageDiv.textContent = 'No employees found.';
                    messageDiv.innerHTML=`<img src="asset/nodatafound.png" alt="">`;

                    table.parentElement.appendChild(messageDiv); 
                }

                filteredData.forEach(employee => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${employee.empId}</td>
                        <td>${employee.empName}</td>
                        <td>${employee.position}</td>
                        <td>${employee.salary}</td>
                        <td><a href="detailemployee.html?id=${employee.empId}" class="view-button">View</a></td>
                    `;
                    table.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching employees:', error);
            alert("There was an error fetching the employee data.");
        });
}


function handleSearchInput() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
        const searchQuery = searchInput.value;
        fetchEmployees(searchQuery); 
    });
}




// function editemp(){
//     const employee = response.json();
//     document.querySelector(".edit a").setAttribute("href",`editEmp.html?id=${employee.empID}`);
//     }


// specific employee data in employee detail page

async function fetchEmployeeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const empId = urlParams.get("id");
    console.log("Employee ID from URL:", empId);

    if (empId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${empId}`);
            if (response.ok) {
                const employee = await response.json();

                document.getElementById("emp-name").textContent = employee.empName;
                document.getElementById("emp-id").textContent = `ID: ${employee.empId}`;
                document.getElementById("emp-position").textContent = `Position: ${employee.position}`;
                document.getElementById("e-mail").innerHTML = `<strong>Email:</strong> ${employee.email}`;
                document.getElementById("phone").innerHTML = `<strong>Phone:</strong> ${employee.phone}`;
                document.getElementById("summary").textContent = employee.summary;
                document.getElementById("emp-salary").textContent = `₹${employee.salary}`;

                document.getElementById('edit-link').href = `editemp.html?id=${empId}`;
                // document.querySelector('.edit').addEventListener('click',()=>editemp());
                document.querySelector('.delete').addEventListener('click', () => deleteEmployee(empId));
            } else {
                alert("Failed to fetch employee details.");
            }
        } catch (error) {
            console.error("Error fetching employee details:", error);
            alert("There was an error fetching the employee details.");
        }
    } else {
        alert("Invalid employee ID.");
    }
}

// edit employee
async function fetchDataForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const empId = urlParams.get("id");

    console.log("Employee ID from URL:", empId); 

    if (!empId) {
        alert("No employee ID found in the URL.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${empId}`);
        if (response.ok) {
            const employee = await response.json();
            document.getElementById("edit-emp-id").value = employee.empId;
            document.getElementById("edit-emp-name").value = employee.empName;
            document.getElementById("edit-position").value = employee.position;
            document.getElementById("edit-salary").value = employee.salary;
            document.getElementById("edit-email").value = employee.email;
            document.getElementById("edit-phone").value = employee.phone;
            document.getElementById("edit-summary").value = employee.summary;
        } else {
            alert("Failed to fetch employee data.");
        }
    } catch (error) {
        console.error("Error fetching employee data:", error);
        alert("An error occurred while fetching employee details.");
    }
}

// Delete employee
async function deleteEmployee(empId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${empId}`, {
            method: 'DELETE', 
        });

        if (response.ok) {
            // alert("Employee deleted successfully!");
            window.location.href = 'index.html'; 
        } else {
            alert("Failed to delete employee.");
        }
    } catch (error) {
        console.error("Error deleting employee:", error);
        alert("There was an error deleting the employee.");
    }
}

//add new employee from form
function handleFormSubmission() {
    const form = document.getElementById("employee-form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); 

            const empId = document.getElementById("emp-id").value;
            const empName = document.getElementById("emp-name").value;
            const position = document.getElementById("position").value;
            const salary = parseFloat(document.getElementById("salary").value);
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const summary = document.getElementById("summary").value;

            
            const newEmployee = { empId, empName, position, salary, email, phone, summary };

            try {
                
                const response = await fetch(API_BASE_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newEmployee),
                });

                if (response.ok) {
                    // alert("Employee added successfully!");
                    fetchEmployees(); 
                    form.reset(); 
                    window.location.href = "index.html";
                } else {
                    alert("Failed to add employee.");
                }
            } catch (error) {
                console.error("Error adding employee:", error);
                alert("There was an error adding the employee.");
            }
        });
    }
}

// Update employee 
async function updateEmployee() {
    const form = document.getElementById("edit-employee-form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); 


            const empId = document.getElementById("edit-emp-id").value;
            const empName = document.getElementById("edit-emp-name").value;
            const position = document.getElementById("edit-position").value;
            const salary = parseFloat(document.getElementById("edit-salary").value);
            const email = document.getElementById("edit-email").value;
            const phone = document.getElementById("edit-phone").value;
            const summary = document.getElementById("edit-summary").value;

            const updatedEmployee = { empId, empName, position, salary, email, phone, summary };

            try {
                const response = await fetch(`${API_BASE_URL}/${empId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedEmployee),
                });

                if (response.ok) {
                    // alert("Employee updated successfully!");
                    window.location.href = "index.html";
                } else {
                    alert("Failed to update employee.");
                }
            } catch (error) {
                console.error("Error updating employee:", error);
                alert("An error occurred while updating the employee.");
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.table-list')) {
        fetchEmployees(); 
    }
    if (document.querySelector('.container')) {
        fetchEmployeeDetails(); 
    }
    if (document.querySelector('.edit-container')) {
        fetchDataForEdit(); 
        updateEmployee(); 
    }
    handleFormSubmission(); 
    handleSearchInput();
});
