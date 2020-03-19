const URL = "https://covid.mathdro.id/api/countries/India";

// const promise = fetch(URL);

const totalCases = document.querySelector(".total-cases");
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

    //Sending the data to html
    const tc = document.createElement("p");
    tc.innerHTML = processedResponse.confirmed["value"];
    console.log("tc: ", tc);
    document.getElementById("TC").insertAdjacentHTML("beforebegin");
  });

  function addData(){
      const processingPromise = response.json();
  }
document.querySelector(".total-cases").addEventListener("onload", addData);
// document.window.onload = addTC;
// function addTC() {
//   var newDiv = document.createElement("div");
//   var newContent = document.createTextNode("hello");
//   newDiv.appendChild(newContent);

//   var currentDiv = document.getElementById("total-cases");
//   document.body.insertBefore(newDiv, currentDiv);
// }
