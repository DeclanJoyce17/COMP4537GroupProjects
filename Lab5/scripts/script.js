class Database {
    constructor(api) {
        this.ApiURL = api;
    }

    async InsertRow() {
        console.log('insertrow');
        const text = document.getElementById("insertRow").value.trim();
        const responseElement = document.getElementById("response");
        // input validation checking
        if (!text || !/^[a-zA-Z]+$/.test(text)) {
            responseElement.innerText = MESSAGES.INVALID_WORD_INPUT;
            return;
        }

        // send a post request to api
        try {
            const response = await fetch(this.ApiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: text, dateOfBirth: "2025-02-16" }), // Assuming a static date for the example
            });


            // handle response from server
            const data = await response.json();
            if (response.ok) {
                responseElement.innerText = MESSAGES.ADD_SUCCESS;
            } else if (response.status === 409) {
                responseElement.innerText = MESSAGES.ADD_CONFLICT;
            } else {
                responseElement.innerText = MESSAGES.ADD_ERROR;
            }
            database.getAllPatients();
            console.log(data)
        } catch (error) {
            responseElement.innerText = `${MESSAGES.ADD_ERROR}: ${error.message}`;
        }

    }

    async InsertSetRows() {
        const responseElement = document.getElementById("response");
        const dataToInsert = [
            { name: 'Sara Brown', dateOfBirth: '1901-01-01' },
            { name: 'John Smith', dateOfBirth: '1941-01-01' },
            { name: 'Jack Ma', dateOfBirth: '1961-01-30' },
            { name: 'Elon Musk', dateOfBirth: '1999-01-01' }
        ];

        // Loop through each row of data and send a POST request
        for (let i = 0; i < dataToInsert.length; i++) {
            const row = dataToInsert[i];
            try {
                const response = await fetch(this.ApiURL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: row.name, dateOfBirth: row.dateOfBirth }),
                });

                let data;
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    data = await response.text(); // If the response is not JSON, get the raw text.
                }

                // Handle the response
                if (response.ok) {
                    responseElement.innerText += `Row ${i + 1} inserted successfully: ${row.name}\n`;
                } else if (response.status === 409) {
                    responseElement.innerText += `Row ${i + 1} conflict occurred: ${row.name}\n`;
                } else {
                    responseElement.innerText += `Error inserting row ${i + 1}: ${row.name}\n`;
                }

                database.getAllPatients();
                console.log(data); // Log the data for debugging
            } catch (error) {
                console.log("Error:", error);
                responseElement.innerText += `Error inserting row ${i + 1}: ${row.name} - ${error.message}\n`;
            }
        }
    }

    async getAllPatients() {
        const responseElement = document.getElementById('patients'); // Get the <p> tag with id='patients'

        try {
            const response = await fetch(this.ApiURL + '/select%20*%20from%20lab5db', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log(data);  // Log the data or process it as needed

            // Display the data inside the <p> tag
            if (data && data.length > 0) {
                // Format the data into a readable string
                const patientList = data.map(patient => `${patient.name} (Born: ${patient.dateOfBirth})`).join('<br>');

                responseElement.innerHTML = `Patients: <br>${patientList}`;
            } else {
                responseElement.innerText = "No patients found.";
            }

        } catch (error) {
            console.error('Error fetching patients:', error);
            responseElement.innerText = `Error fetching patients: ${error.message}`;
        }

    }

}

//const database = new Database("http://localhost:3000/lab5/api/v1/sql");
const database = new Database("https://comp-4537-group-projectslab5.vercel.app/lab5/api/v1/sql");
document.addEventListener("DOMContentLoaded", () => {
    database.getAllPatients();
});
