const URL = "https://api.rootnet.in/covid19-in/stats/latest";
const URL1 = "https://api.rootnet.in/covid19-in/contacts";
const URL2 = "https://api.rootnet.in/covid19-in/stats/history";
// window.onload = addData;

const addSummary = async () => {
    const response = await fetch(URL);
    const processedResponse = await response.json();

    const totalCases = document.getElementById("total-cases");
    const recovered = document.getElementById("recovered");
    const fatal = document.getElementById("fatal");
    const confirmedCasesIndian = document.getElementById("confirmed-india");
    const confirmedCasesForeign = document.getElementById("confirmed-foreign");

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

    //Add state wise data in a table

    const stateListStatWise = processedResponse.data.regional;

    // Values for table header
    let colHeaderStateWise = [
        "State/UT",
        "Indian",
        "Foreigner",
        "Recovered",
        "Fatal",
    ];
    const tableElements = {
        stateList: stateListStatWise,
        colHeader: colHeaderStateWise,
        containerId: "statewise-data",
        columns: colHeaderStateWise.length,
    };
    createTable(tableElements);
};

const addHelplineData = async () => {
    const response = await fetch(URL1);
    const processedResponse = await response.json();

    const hospitalList = processedResponse.data.contacts.regional;
    const colHeaderHelpline = ["State/UT", "Number"];

    const tableElements = {
        stateList: hospitalList,
        colHeader: colHeaderHelpline,
        containerId: "helpline-data",
        columns: colHeaderHelpline.length,
    };
    createTable(tableElements);
};
const addCharts = async () => {
    const response = await fetch(URL2);
    const processedResponse = await response.json();

    const totalCasesData = [];
    let arrCasesDate = [];
    const dailyIncrease = [];
    const recoveredEveryday = [];

    const chartElements = {
        chartId: "",
        title: "",
        dataArray: [],
        dateArray: [],
        backgroundColor: "",
        legendDisplay: false,
        type: "",
    };

    //Total number of days
    const days = processedResponse.data.length;
    //To extract the data for the chart of total cases
    let total, date;
    for (let i = 0; i < days; i++) {
        total = processedResponse.data[i].summary.total;
        date = processedResponse.data[i].day;

        totalCasesData.push(total);
        arrCasesDate.push(date);
    }

    //Format date
    arrCasesDate = formatDate(arrCasesDate);

    chartElements.dateArray = arrCasesDate;

    updateElements(
        chartElements,
        "confirmedCasesCumulative",
        "Confirmed Cases",
        totalCasesData,
        "red",
        "line"
    );
    makeChart(chartElements);

    //To extract the data for the chart of daily increase in cases
    let cases;
    dailyIncrease.push(0);
    for (let i = 1; i < days; i++) {
        cases =
            processedResponse.data[i].summary.total -
            processedResponse.data[i - 1].summary.total;

        dailyIncrease.push(cases);
    }
    updateElements(
        chartElements,
        "confirmedIncreaseDaily",
        "Confirmed Cases",
        dailyIncrease,
        "red",
        "bar"
    );
    makeChart(chartElements);

    //Recovered Everyday
    let reovered;
    for (let i = 0; i < days; i++) {
        reovered = processedResponse.data[i].summary.discharged;
        recoveredEveryday.push(reovered);
    }
    updateElements(
        chartElements,
        "recoveredCumulative",
        "Recovered",
        recoveredEveryday,
        "green",
        "line"
    );
    makeChart(chartElements);

    // Daily increase in recovered cases
    let recoveredDaily;
    const recoveredEverydayInc = []; //difference in recovered cases
    recoveredEverydayInc.push(0);
    for (let i = 1; i < days; i++) {
        recoveredDaily =
            processedResponse.data[i].summary.discharged -
            processedResponse.data[i - 1].summary.discharged;
        recoveredEverydayInc.push(recoveredDaily);
    }
    updateElements(
        chartElements,
        "recoveredDaily",
        "Recovered",
        recoveredEverydayInc,
        "green",
        "bar"
    );
    makeChart(chartElements);

    //Deaths everyday
    let deaths;
    const deathsEveryday = [];
    for (let i = 0; i < days; i++) {
        deaths = processedResponse.data[i].summary.deaths;
        deathsEveryday.push(deaths);
    }
    updateElements(
        chartElements,
        "deathsCumulative",
        "Deceased",
        deathsEveryday,
        "grey",
        "line"
    );
    makeChart(chartElements);

    //Daily increase in deaths
    const deathsEverydayInc = [];
    deathsEverydayInc.push(0);
    for (let i = 1; i < days; i++) {
        deaths =
            processedResponse.data[i].summary.deaths -
            processedResponse.data[i - 1].summary.deaths;

        deathsEverydayInc.push(deaths);
    }
    updateElements(
        chartElements,
        "deathsDaily",
        "Deceased",
        deathsEverydayInc,
        "grey",
        "bar"
    );
    makeChart(chartElements);
};

function formatDate(dateArray) {
    for (let i = 0; i < dateArray.length; i++) {
        str = dateArray[i].slice(5);
        dateArray[i] = str;
    }
    return dateArray;
}

function updateElements(dataObject, id, title, array, color, chartType) {
    dataObject.chartId = id;
    dataObject.dataArray = array;
    dataObject.backgroundColor = color;
    dataObject.type = chartType;
    dataObject.title = title;
}

function makeChart(elements) {
    let myChart = document.getElementById(`${elements.chartId}`);

    let chart = new Chart(myChart, {
        type: elements.type,
        data: {
            labels: elements.dateArray,
            datasets: [
                {
                    label: elements.title,
                    data: elements.dataArray,
                    backgroundColor: elements.backgroundColor,
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
                text: elements.title,
                fontSize: 20,
            },
            legend: {
                display: elements.legendDisplay,
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
function createTable(object) {
    const stateList = object.stateList;
    const colHeader = object.colHeader;
    const containerId = object.containerId;
    const columnsLen = object.columns;
    let col = [];
    for (let i = 0; i < stateList.length; i++) {
        for (let key in stateList[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    //create dynamic table
    let table = document.createElement("table");
    let fragment = document.createDocumentFragment();
    //CREATE HTML TABLE HEARDER ROW USING THE EXTRACTED HEADERS ABOVE
    let tr = table.insertRow(-1); //TABLE ROW

    for (let i = 0; i < columnsLen; i++) {
        let th = document.createElement("th");
        th.innerHTML = colHeader[i];
        fragment.appendChild(th);
    }
    tr.appendChild(fragment);
    //ADD JSON DATA TO THE TABLE AS ROWS
    for (let i = 0; i < stateList.length; i++) {
        tr = table.insertRow(-1);
        for (let j = 0; j < columnsLen; j++) {
            let tabCell = tr.insertCell(-1);
            tabCell.innerHTML = stateList[i][col[j]];
        }
    }

    //FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    const divContainer = document.getElementById(containerId);
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}

window.onload = addSummary();
window.onload = addHelplineData();
window.onload = addCharts();
