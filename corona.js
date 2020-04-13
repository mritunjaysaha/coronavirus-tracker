const URL = "https://api.rootnet.in/covid19-in/stats/latest";
const URL1 = "https://api.rootnet.in/covid19-in/contacts";
const URL2 = "https://api.rootnet.in/covid19-in/stats/history";

const addSummary = async () => {
    const response = await fetch(URL);
    const processedResponse = await response.json();

    //create the p tags for summary
    const totalCases = processedResponse.data.summary.total;
    createPtag("total-cases", totalCases);

    const recovered = processedResponse.data.summary.discharged;
    createPtag("recovered", recovered);

    const fatal = processedResponse.data.summary.deaths;
    createPtag("fatal", fatal);

    const confirmedCasesIndian =
        processedResponse.data.summary.confirmedCasesIndian;
    createPtag("confirmed-india", confirmedCasesIndian);

    const confirmedCasesForeign =
        processedResponse.data.summary.confirmedCasesForeign;
    createPtag("confirmed-foreign", confirmedCasesForeign);

    const dateTime = processedResponse.lastOriginUpdate;
    createPtag("last-updated", timeToWords(dateTime));

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

    await addSummary(); //The summary function is called here so that the increase in number of cases appear after total cases
    
    
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

    // Increase in total cases
    const len = processedResponse.data.length - 1;
    const increaseInCases =
        processedResponse.data[len].summary.total -
        processedResponse.data[len - 1].summary.total;
    createPtagIncreaseCases("total-cases", increaseInCases);

    // Increase in cases of Indians
    const increaseIndian =
        processedResponse.data[len].summary.confirmedCasesIndian -
        processedResponse.data[len - 1].summary.confirmedCasesIndian;
    createPtagIncreaseCases("confirmed-india", increaseIndian);

    // Increase in cases of Foreigners
    const increaseForiegner =
        processedResponse.data[len].summary.confirmedCasesForeign -
        processedResponse.data[len - 1].summary.confirmedCasesForeign;
    createPtagIncreaseCases("confirmed-foreign", increaseForiegner);

    // Increase in recovered cases
    const increaseRecovered =
        processedResponse.data[len].summary.discharged -
        processedResponse.data[len - 1].summary.discharged;
    createPtagIncreaseCases("recovered", increaseRecovered);

    // Increase in deaths
    const increaseDeaths =
        processedResponse.data[len].summary.deaths -
        processedResponse.data[len - 1].summary.deaths;
    createPtagIncreaseCases("fatal", increaseDeaths);

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

function timeToWords(time, lang) {
    lang = lang || {
        postfixes: {
            "<": " ago",
            ">": " from now",
        },
        1000: {
            singular: "a few moments",
            plural: "a few moments",
        },
        60000: {
            singular: "about a minute",
            plural: "# minutes",
        },
        3600000: {
            singular: "about an hour",
            plural: "# hours",
        },
        86400000: {
            singular: "a day",
            plural: "# days",
        },
    };

    var timespans = [1000, 60000, 3600000, 86400000];
    var parsedTime = Date.parse(time.replace(/\-00:?00$/, ""));

    if (parsedTime && Date.now) {
        var timeAgo = parsedTime - Date.now();
        var diff = Math.abs(timeAgo);
        var postfix = lang.postfixes[timeAgo < 0 ? "<" : ">"];
        var timespan = timespans[0];

        for (var i = 1; i < timespans.length; i++) {
            if (diff > timespans[i]) {
                timespan = timespans[i];
            }
        }

        var n = Math.round(diff / timespan);

        return (
            lang[timespan][n > 1 ? "plural" : "singular"].replace("#", n) +
            postfix
        );
    }
}
function createPtag(id, data) {
    let container = document.getElementById(id);
    let p = document.createElement("p");
    p.innerHTML = data;
    container.appendChild(p);
}

function createPtagIncreaseCases(id, data) {
    let container = document.getElementById(id);
    let p = document.createElement("p");
    p.innerHTML = `[+${data}]`;
    container.appendChild(p);
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
                    // borderColor: "#E4F4E8",

                    fill: false,
                },
            ],
        },
        options: {
            // maintainAspectRatio: false,
            responsive: true,
            // maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            display: false,
                        },
                    },
                ],
                yAxes: [
                    {
                        // display: true,
                        // position: right,
                        gridLines: {
                            // display: false,
                        },
                        ticks: {
                            callback: function (label, index, labels) {
                                return label / 1000 + "k";
                            },
                            beginAtZero: true,
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

// window.onload = addSummary();
window.onload = addHelplineData();
window.onload = addCharts();
