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
                body: JSON.stringify({ query: text }),
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
            console.log(data)
        } catch (error) {
            responseElement.innerText = `${MESSAGES.ADD_ERROR}: ${error.message}`;
        }

    }

    async InsertSetRows() {
        console.log('insertsetrows');
        const responseElement = document.getElementById("response");
        const text = `INSERT INTO lab5db (name, birthdate) VALUES
        ('Sara Brown', '1901-01-01'),
        ('John Smith', '1941-01-01'),
        ('Jack Ma', '1961-01-30'),
        ('Elon Musk', '1999-01-01');
        `;
        // send a post request to api
        try {
            const response = await fetch(this.ApiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: text }),
            });

            let data;
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text(); // If the response is not JSON, get the raw text.
            }

            if (response.ok) {
                responseElement.innerText = MESSAGES.ADD_SUCCESS;
            } else if (response.status === 409) {
                responseElement.innerText = MESSAGES.ADD_CONFLICT;
            } else {
                responseElement.innerText = MESSAGES.ADD_ERROR;
            }
            console.log(data)
        } catch (error) {
            console.log("Nope");
            responseElement.innerText = `${MESSAGES.ADD_ERROR}: ${error.message}`;
        }
    }
}

const database = new Database("http://localhost:3000/lab5/api/v1/sql");
