const URL = "https://api.rootnet.in/covid19-in/stats/latest";
const URL1 = "https://api.rootnet.in/covid19-in/contacts";
const URL2 = "https://api.rootnet.in/covid19-in/stats/hospitals";
window.onload = addData;

function addData() {
    const promise = fetch(URL);
    const totalCases = document.getElementById("total-cases");
    const recovered = document.getElementById("recovered");
    const fatal = document.getElementById("fatal");
    const confirmedCasesIndian = document.getElementById("confirmed-india");
    const confirmedCasesForeign = document.getElementById("confirmed-foreign");

    promise
        .then(function(response) {
            const processingPromise = response.json();
            return processingPromise;
        })
        .then(function(processedResponse) {
            let p = document.createElement("p");
            p.innerHTML = processedResponse.data.summary.total;
            totalCases.appendChild(p);

            p = document.createElement("p");
            p.innerHTML = processedResponse.data.summary.discharged;
            recovered.appendChild(p);

            p = document.createElement("p");
            p.innerHTML = processedResponse.data.summary.deaths;
            fatal.appendChild(p);

            p = document.createElement("p");
            p.innerHTML = processedResponse.data.summary.confirmedCasesIndian;
            confirmedCasesIndian.appendChild(p);

            p = document.createElement("p");
            p.innerHTML = processedResponse.data.summary.confirmedCasesForeign;
            confirmedCasesForeign.appendChild(p);

            //Generate table
            const stateList = processedResponse.data.regional;

            //Extract value for HTML header.
            var colHeader = [
                "State/UT",
                "Indian",
                "Foreigner",
                "Recovered",
                "Fatal"
            ];
            var col = [];
            for (var i = 0; i < stateList.length; i++) {
                for (var key in stateList[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }
            //CREATE DYNAMIC TABLE
            var table = document.createElement("table");

            //CREATE HTML TABLE HEARDER ROW USING THE EXTRACTED HEADERS ABOVE
            var tr = table.insertRow(-1); //TABLE ROW

            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");
                th.innerHTML = colHeader[i];
                tr.appendChild(th);
            }

            //ADD JSON DATA TO THE TABLE AS ROWS
            for (var i = 0; i < stateList.length; i++) {
                tr = table.insertRow(-1);

                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = stateList[i][col[j]];
                }
            }

            //FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            var divContainer = document.getElementById("show-data");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
        });

    addHelpline();
}

function addHelpline() {
    const promise = fetch(URL1);

    promise
        .then(function(response) {
            const processingPromise = response.json();
            return processingPromise;
        })
        .then(function(processedResponse) {

            //Generate table
            const hospitalList = processedResponse.data.contacts.regional;

            var col = [];
            for (var i = 0; i < hospitalList.length; i++) {
                for (var key in hospitalList[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }

            //create dynamic table
            var table = document.createElement("table");

            var tr = table.insertRow(-1);

            const colHeader = ["State", "Number"];
            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");
                th.innerHTML = colHeader[i];
                tr.appendChild(th);
            }

            //Add json data to the table rows
            for (var i = 0; i < hospitalList.length; i++) {
                tr = table.insertRow(-1);

                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = hospitalList[i][col[j]];
                }

                var divContainer = document.getElementById("helpline-data");
                divContainer.innerHTML = "";
                divContainer.appendChild(table);
            }
        });
}