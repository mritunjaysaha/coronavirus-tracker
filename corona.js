const URL = "https://covid.mathdro.id/api/countries/India";

window.onload = addData;

function addData() {
  const promise = fetch(URL);
  const totalCases = document.getElementById("total-cases");
  const recovered = document.getElementById("recovered");
  const fatal = document.getElementById("fatal");
  promise
    .then(function(response) {
      const processingPromise = response.json();
      return processingPromise;
    })
    .then(function(processedResponse) {
      console.log(processedResponse);
      console.log(processedResponse.confirmed);
      console.log(processedResponse.recovered);
      console.log(processedResponse.deaths);
      console.log(processedResponse.lastUpdate);

      let p = document.createElement("p");
      p.innerHTML = processedResponse.confirmed.value;
      totalCases.appendChild(p);

      p = document.createElement("p");
      p.innerHTML = processedResponse.recovered.value;
      recovered.appendChild(p);

      p = document.createElement("p");
      p.innerHTML = processedResponse.deaths.value;
      fatal.appendChild(p);
    });
  console.log("here");
}
