class Database {
    constructor(api) {
        this.ApiURL = api;
    }

    async InsertRow() {
        console.log('insertrow');
        const responseElement = document.getElementById("response");
        const inputElement = document.getElementById("insertRow");

        if (!inputElement || !inputElement.value.trim()) {
            responseElement.innerText = MESSAGES.INVALID_SQL;
            return;
        }

        let sqlQuery = inputElement.value.trim();
        const isSelectQuery = sqlQuery.toUpperCase().startsWith("SELECT");
        const isInsertQuery = sqlQuery.toUpperCase().startsWith("INSERT");

        if (!isSelectQuery && !isInsertQuery) {
            responseElement.innerText = MESSAGES.ONLY_SELECT_INSERT;
            return;
        }

        try {
            let fetchOptions;
            let response;

            if (isSelectQuery) {
                fetchOptions = {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                };
                response = await fetch(`${this.ApiURL}/${encodeURIComponent(sqlQuery)}`, fetchOptions);
            } else {
                fetchOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rawSQL: sqlQuery })
                };
                response = await fetch(this.ApiURL, fetchOptions);
            }

            const data = await response.json();

            if (response.ok) {
                responseElement.innerText = MESSAGES.QUERY_SUCCESS;
                console.log("Query Result:", data);

                if (isSelectQuery) {
                    const patientElement = document.getElementById('patients');
                    if (data && data.length > 0) {
                        const patientList = data.map(patient => {
                            const formattedDate = new Date(patient.dateOfBirth).toLocaleDateString('en-US');
                            return `${patient.name} (Born: ${formattedDate})`;
                        }).join('<br>');

                        patientElement.innerHTML = patientList;
                    } else {
                        patientElement.innerText = MESSAGES.NO_PATIENTS_FOUND;
                    }
                }
            } else {
                responseElement.innerText = MESSAGES.ERROR_MESSAGE(data.message || MESSAGES.UNKNOWN_ERROR);
            }
        } catch (error) {
            responseElement.innerText = MESSAGES.ERROR_MESSAGE(error.message);
        }
    }

    async InsertSetRows() {
        const responseElement = document.getElementById("response");
        responseElement.innerText = '';
        const dataToInsert = [
            { name: 'Sara Brown', dateOfBirth: '1901-01-01' },
            { name: 'John Smith', dateOfBirth: '1941-01-01' },
            { name: 'Jack Ma', dateOfBirth: '1961-01-30' },
            { name: 'Elon Musk', dateOfBirth: '1999-01-01' }
        ];

        for (let i = 0; i < dataToInsert.length; i++) {
            const row = dataToInsert[i];
            const sqlQuery = `INSERT INTO lab5db (name, dateOfBirth) VALUES ('${row.name}', '${row.dateOfBirth}')`;

            try {
                const response = await fetch(this.ApiURL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rawSQL: sqlQuery }),
                });

                let data;
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }

                if (response.ok) {
                    responseElement.innerText += MESSAGES.ROW_INSERT_SUCCESS(i + 1, row.name);
                } else if (response.status === 409) {
                    responseElement.innerText += MESSAGES.ROW_INSERT_CONFLICT(i + 1, row.name);
                } else {
                    responseElement.innerText += MESSAGES.ROW_INSERT_ERROR(i + 1, row.name, data);
                }

                console.log(data);
            } catch (error) {
                console.log("Error:", error);
                responseElement.innerText += MESSAGES.ROW_INSERT_ERROR(i + 1, row.name, error.message);
            }
        }
    }
}

// const database = new Database("http://localhost:3000/lab5/api/v1/sql");
const database = new Database("https://comp-4537-group-projectslab5.vercel.app/lab5/api/v1/sql");
