const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// for(code in countryList){
//   console.log(code,countryList[code]);
// // code=currency code,countryList[code]=country code
// }

for (let select of dropdowns) {
  for (currCode in countryList) {// we'll add a option for each country code 
    let newOption = document.createElement("option");//creating new element as option for two select tag(From,To) of the form 
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {//In Form, for the "from" Option, choosing USD selected at the beggining 
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "BDT") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  // when our select will be changed like usd to inr etc, we'll call our updateFlag with our eventobject.target
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // New URL format: Only fetch using `fromCurr` base currency
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;//when we'll send request to this url , we'll get our exchange rate 
  let response = await fetch(URL);//after sending request to the above URL, we'll get this response 
  let data = await response.json();//for using await, we need to make const updateExchangeRate async
 

  console.log(response);//checking the response status if it is 200 or not 
  
  // Access the exchange rate using the new format
  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];//converting to lower case because API won't work in upper case
  //we'll get rate in this key: [fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()]

  if (rate) {
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;//fromCurr.value like usd, toCurr.value like bdt
  } else {
    msg.innerText = `Exchange rate data for ${fromCurr.value} to ${toCurr.value} is unavailable.`;
  }
};

//Function for updating the flag image in "From" and "To"
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
//it'll work at the beggining, when our page load, for 1 usd . 1 USD = 119.4277992 BDT text
  updateExchangeRate();
});
