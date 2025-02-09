
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

                if (addbutton) {
                    addbutton.addEventListener("click", () => this.searchWord());
                }
            });
        }

        async addWord() {}

        async searchWord() {}
}
