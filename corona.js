const URL = "https://api.rootnet.in/covid19-in/stats/latest";
const URL1 = "https://api.rootnet.in/covid19-in/contacts";
const URL2 = "https://api.rootnet.in/covid19-in/stats/history";
window.onload = addData;

function addData() {
    const promise = fetch(URL);
    const totalCases = document.getElementById("total-cases");
    const recovered = document.getElementById("recovered");
    const fatal = document.getElementById("fatal");
    const confirmedCasesIndian = document.getElementById("confirmed-india");
    const confirmedCasesForeign = document.getElementById("confirmed-foreign");

    promise
        .then(function (response) {
            const processingPromise = response.json();
            return processingPromise;
        })
        .then(function (processedResponse) {
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

            //values for HTML header.
            var colHeader = [
                "State/UT",
                "Indian",
                "Foreigner",
                "Recovered",
                "Fatal",
                "Total confirmed",
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
    addNewCases();
}

function addHelpline() {
    const promise = fetch(URL1);

    promise
        .then(function (response) {
            const processingPromise = response.json();
            return processingPromise;
        })
        .then(function (processedResponse) {
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

function addNewCases() {
    const promise = fetch(URL2);
    const totalCasesData = [];
    let totalCasesDate = [];
    const dailyIncrease = [];
    promise
        .then(function (response) {
            const processingPromise = response.json();
            return processingPromise;
        })
        .then(function (processedResponse) {
            console.log(processedResponse);

            //Total number of days
            const days = processedResponse.data.length;
            //To extract the data for the chart of total cases
            let total, date;
            for (let i = 0; i < days; i++) {
                total = processedResponse.data[i].summary.total;
                date = processedResponse.data[i].day;

                // console.log(`${date}: ${total}`)

                totalCasesData.push(total);
                totalCasesDate.push(date);
            }

            //Format date
            totalCasesDate = formatDate(totalCasesDate);

            makeChartTotal(totalCasesDate, totalCasesData);

            //To extract the data for the chart of daily increase in cases
            let cases;
            dailyIncrease.push(0);
            for (let i = 1; i < days; i++) {
                cases =
                    processedResponse.data[i].summary.total -
                    processedResponse.data[i - 1].summary.total;

                dailyIncrease.push(cases);
            }
            makeChartDailyIncrease(dailyIncrease, totalCasesDate);
        });
}
function formatDate(dateArray) {
    for (let i = 0; i < dateArray.length; i++) {
        str = dateArray[i].slice(5);
        dateArray[i] = str;
        console.log(dateArray[i]);
    }
    return dateArray;
}

function makeChartTotal(dateArray, dataArray) {
    let myChart = document.getElementById("chartTotal");

    let chart = new Chart(myChart, {
        type: "line",
        data: {
            labels: dateArray,
            datasets: [
                {
                    label: "Total cases",
                    data: dataArray,
                    backgroundColor: "red",
                },
            ],
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: function (label, index, labels) {
                                return label / 1000 + "k";
                            },
                        },
                    },
                ],
            },
            title: {
                display: true,
                text: "Total cases",
                fontSize: 20,
            },
            legend: {
                display: false,
                position: "bottom",
                labels: {
                    fontColor: "#000",
                },
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                },
            },
            tooltips: {
                enabled: true,
            },
        },
    });
}

function makeChartDailyIncrease(dataArray, dateArray) {
    let myChart = document.getElementById("chartDailyIncrease");
    let chart = new Chart(myChart, {
        type: "bar",
        data: {
            labels: dateArray,
            datasets: [
                {
                    label: "Daily Increase",
                    data: dataArray,
                    backgroundColor: "red",
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: "Daily Increase in Cases",
                fontSize: 20,
            },
            legend: {
                display: false,
                position: "bottom",
                labels: {
                    fontColor: "#000",
                },
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                },
            },
            tooltips: {
                enabled: true,
            },
        },
    });
}
