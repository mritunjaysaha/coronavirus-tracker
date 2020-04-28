const URL = "https://api.rootnet.in/covid19-in/stats/latest";
const URL1 = "https://api.rootnet.in/covid19-in/contacts";
const URL2 = "https://api.rootnet.in/covid19-in/stats/history";

const addSummary = async () => {
    const response = await fetch(URL);
    const processedResponse = await response.json();
    const response2 = await fetch(URL2);
    const processedResponse2 = await response2.json();

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

    // create p tags for increase in cases
    const len = processedResponse2.data.length - 1;

    const increaseInCases =
        processedResponse2.data[len].summary.total -
        processedResponse2.data[len - 1].summary.total;
    createPtagIncreaseCases("total-cases", increaseInCases);

    // Increase in cases of Indians
    const increaseIndian =
        processedResponse2.data[len].summary.confirmedCasesIndian -
        processedResponse2.data[len - 1].summary.confirmedCasesIndian;
    createPtagIncreaseCases("confirmed-india", increaseIndian);

    // Increase in cases of Foreigners
    const increaseForiegner =
        processedResponse2.data[len].summary.confirmedCasesForeign -
        processedResponse2.data[len - 1].summary.confirmedCasesForeign;

    foreignerContainer = document.getElementById("confirmed-foreign");
    let p = document.createElement("p");

    if (increaseForiegner > 0) {
        p.innerHTML = `[+${increaseForeigner}]`;
    } else {
        p.innerHTML = "";
    }
    foreignerContainer.appendChild(p);

    // Increase in recovered cases
    const increaseRecovered =
        processedResponse2.data[len].summary.discharged -
        processedResponse2.data[len - 1].summary.discharged;
    createPtagIncreaseCases("recovered", increaseRecovered);

    // Increase in deaths
    const increaseDeaths =
        processedResponse2.data[len].summary.deaths -
        processedResponse2.data[len - 1].summary.deaths;
    createPtagIncreaseCases("fatal", increaseDeaths);

    //Add state wise data in a table
    const stateListStatWise = processedResponse.data.regional;

    // Values for table header
    let colHeaderStateWise = [
        "State/UT",
        "Indian",
        "Recovered",
        "Fatal",
        "Foreign",
    ];
    const tableElements = {
        stateList: stateListStatWise,
        colHeader: colHeaderStateWise,
        containerId: "statewise-data",
        columns: colHeaderStateWise.length,
    };
    createTable(tableElements, processedResponse2, true);

    addCharts(processedResponse2);
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
    createTable(tableElements, null, false);
};
const addCharts = async (processedResponse) => {
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

function createTable(object, increaseData, makeChanges) {
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

    const len = makeChanges === true ? increaseData.data.length - 1 : 0;
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
    let tabCell;
    let incIndian, incForeigner, incRecovered, incDeaths;
    for (let i = 0; i < stateList.length; i++) {
        tr = table.insertRow(-1);
        for (let j = 0; j < columnsLen; j++) {
            tabCell = tr.insertCell(-1);
            if (makeChanges === true) {
                incIndian =
                    increaseData.data[len].regional[i].confirmedCasesIndian -
                    increaseData.data[len - 1].regional[i].confirmedCasesIndian;
                incForeigner =
                    increaseData.data[len].regional[i].confirmedCasesForeign -
                    increaseData.data[len - 1].regional[i]
                        .confirmedCasesForeign;
                incRecovered =
                    increaseData.data[len].regional[i].discharged -
                    increaseData.data[len - 1].regional[i].discharged;
                incDeaths =
                    increaseData.data[len].regional[i].deaths -
                    increaseData.data[len - 1].regional[i].deaths;

                if (j === 0) {
                    tabCell.innerHTML = `<p>${stateList[i][col[j]]}</p>`;
                }
                if (j === 1) {
                    if (incIndian > 0) {
                        tabCell.innerHTML = `
                        <div class="ptags">
                            <p >${stateList[i][col[j]]}</p>
                            <p class="ptags-inc-red"><i class="fas fa-sort-up"></i>${incIndian}</p>
                        </div>
                        `;
                    } else {
                        tabCell.innerHTML = `
                        <div class="ptags">
                            <p >${stateList[i][col[j]]}</p>
                        </div>
                        `;
                    }
                }
                if (j === 2) {
                    if (incRecovered > 0) {
                        tabCell.innerHTML = `
                        <div class="ptags">
                            <p >${stateList[i][col[j]]}</p>
                            <p class="ptags-inc-green">
                            <i class="fas fa-sort-up"></i>${incRecovered}</p>
                        </div>
                        `;
                    } else {
                        tabCell.innerHTML = `
                        <div class="ptags">
                            <p >${stateList[i][col[j]]}</p>
                        </div>
                        `;
                    }
                }
                if (j === 3) {
                    if (incDeaths > 0) {
                        tabCell.innerHTML = `
                        <div class="ptags">
                            <p >${stateList[i][col[j]]}</p>
                            <p class="ptags-inc-grey">
                            <i class="fas fa-sort-up"></i>${incDeaths}</p>
                        </div>
                        `;
                    } else {
                        tabCell.innerHTML = `
                        <div class="ptags">
                            <p >${stateList[i][col[j]]}</p>
                        </div>
                        `;
                    }
                }
                if (j === 4) {
                    if (incForeigner > 0) {
                        tabCell.innerHTML = `
                        <div class="ptags">
                            <p >${stateList[i][col[j]]}</p>
                            <p class="ptags-inc-yellow">
                            <i class="fas fa-sort-up"></i>${incForeigner}</p>
                        </div>
                        `;
                    } else {
                        tabCell.innerHTML = `
                        <div class="ptags">
                            <p >${stateList[i][col[j]]}</p>
                        </div>
                        `;
                    }
                }
            } else {
                tabCell.innerHTML = `
                        <div class="ptags">
                            <p >${stateList[i][col[j]]}</p>
                        </div>
                        `;
            }
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
    let myChart = document
        .getElementById(`${elements.chartId}`)
        .getContext("2d");

    // height and width of the window
    const heightWindow = window.screen.height;
    const widthWindow = window.screen.width;
    console.log("width", widthWindow);

    // height of canvas
    const heightCanvas = heightWindow / 4;
    // width of the canvas for laptops/desktops
    const width = Math.round(widthWindow / 4);
    console.log(width);
    // to select the width of the canvas
    let widthCanvas;
    if (widthWindow < 400) {
        widthCanvas = 345;
    } else {
        widthCanvas = width;
    }

    myChart.canvas.style.height = `${heightCanvas}px`;
    myChart.canvas.style.width = `${widthCanvas}px`;
    let chart = new Chart(myChart, {
        type: elements.type,
        data: {
            labels: elements.dateArray,
            datasets: [
                {
                    label: elements.title,
                    data: elements.dataArray,
                    backgroundColor: elements.backgroundColor,

                    fill: false,
                },
            ],
        },
        options: {
            responsive: false,
            maintainAspectRatio: true,
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

window.onload = addSummary();
window.onload = addHelplineData();
