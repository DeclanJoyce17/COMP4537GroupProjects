
class Dictionary{
        constructor(api) {
            this.ApiURL = api
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
                    addbutton.addEventListener("click", () => this.searchWord());
                }
            });
        }

        async addWord() {
            const word = document.getElementById("word").value.trim();
            const definition = document.getElementById("definition").value.trim();
            const responseElement = document.getElementById("response");

            //input validation checking
            if (!word || !definition || !/^[a-zA-Z]+$/.test(word)) {
                responseElement.innerText = "invalid input";
                return;
            }

    
            try {
                const response = await fetch(this.ApiURL, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({word, definition})
                });

                const data = await response.json()
                responseElement.innerText = data.message || "Error";

            } catch(errorType) {
                responseElement.innerText = error;
            }

        }

        async searchWord() {
            const word = document.getElementById("searchWord").value.trim();
            const resultElement = document.getElementById("searchResult");

            //input validation
            if (!word || !/^[a-zA-Z]+$/.test(word)) {
                resultElement.innerText = "invalid input";
                return;
            }

            try {
                const response = await fetch(`${this.apiUrl}?word=${word}`);
                const data = await response.json();

                resultElement.innerText = data.definition ? `${data.word}: ${data.definition}` : data.message;
            } catch (error) {
            resultElement.innerText = error;
        }
    }
}
