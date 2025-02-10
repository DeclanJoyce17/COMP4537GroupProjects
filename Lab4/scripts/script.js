class Dictionary {
    constructor(api) {
        this.ApiURL = api;
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener("DOMContentLoaded", () => {
            const addbutton = document.getElementById("addBtn");
            const searchbutton = document.getElementById("searchBtn");

            if (addbutton) {
                addbutton.addEventListener("click", () => this.addWord());
            }

            if (searchbutton) {
                searchbutton.addEventListener("click", () => this.searchWord());
            }
        });
    }

    async addWord() {
        const word = document.getElementById("word").value.trim();
        const definition = document.getElementById("definition").value.trim();
        const responseElement = document.getElementById("response");

        // input validation checking
        if (!word || !definition || !/^[a-zA-Z]+$/.test(word)) {
            responseElement.innerText = MESSAGES.INVALID_WORD_INPUT;
            return;
        }

        // send a post request to api
        try {
            const response = await fetch(this.ApiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ word, definition }),
            });

            this.updateRequestCount();

            // handle response from server
            const data = await response.json();
            if (response.ok) {
                responseElement.innerText = MESSAGES.ADD_SUCCESS;
            } else if (response.status === 409) {
                responseElement.innerText = MESSAGES.ADD_CONFLICT;
            } else {
                responseElement.innerText = MESSAGES.ADD_ERROR;
            }
        } catch (error) {
            responseElement.innerText = `${MESSAGES.ADD_ERROR}: ${error.message}`;
        }
    }

    async searchWord() {
        const word = document.getElementById("searchWord").value.trim();
        const resultElement = document.getElementById("searchResult");

        // input validation checking
        if (!word || !/^[a-zA-Z]+$/.test(word)) {
            resultElement.innerText = MESSAGES.INVALID_WORD_INPUT;
            return;
        }

        try {
            // send get request to api
            resultElement.innerText = MESSAGES.LOADING;
            const response = await fetch(`${this.ApiURL}?word=${word}`);

            this.updateRequestCount();

            // Parse the response data
            const data = await response.json();

            // handle the response from the server
            if (response.ok) {
                resultElement.innerText = `${data.word}: ${data.definition}`;
            } else {
                resultElement.innerText = data.message || MESSAGES.SEARCH_NOT_FOUND;
            }
        } catch (error) {
            resultElement.innerText = `${MESSAGES.SEARCH_ERROR}: ${error.message}`;
        }
    }

    async updateRequestCount() {

        // Grabs data from server side
        const response = await fetch(`${this.ApiURL.replace("/api/definitions", "/api/stats")}`);
        const data = await response.json();
        const requestCount = data.requestCount;
        const numWords = data.totalWords;

        // Update the request count display on the page
        const requestCounter = document.getElementById("requestCountDisplay");
        requestCounter.innerText = 'Request Count: ' + requestCount;
        const totalWords = document.getElementById("totalWordsDisplay");
        totalWords.innerText = 'Total Words: ' + numWords;

    }
}

const dictionary = new Dictionary(`${window.location.origin}/api/definitions`);

document.addEventListener("DOMContentLoaded", () => {
    console.log('Dictionary instance is ready to be used!');
    console.log(`${window.location.origin}/api/definitions`);

    // Initialize the Dictionary class once MESSAGES is available
    dictionary.updateRequestCount();
});
