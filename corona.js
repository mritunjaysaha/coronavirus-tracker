// const URL = "https://covid.mathdro.id/api/countries/India";
const URL = "https://api.rootnet.in/covid19-in/stats/latest";
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
      console.log(processedResponse);
      console.log(processedResponse.data);

      //Summary of cases in India
      console.log(processedResponse.data.summary);
      console.log(processedResponse.data.summary.total);
      console.log(processedResponse.data.summary.confirmedCasesIndian);
      console.log(processedResponse.data.summary.confirmedCasesForeign);
      console.log(processedResponse.data.summary.discharged);
      console.log(processedResponse.data.summary.deaths);

      //State wise cases of CoVid
      console.log(processedResponse.data.regional);
      console.log(processedResponse.data.regional[0]);
      console.log(processedResponse.data.regional[0].loc);

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
    });
  console.log("here");
}
