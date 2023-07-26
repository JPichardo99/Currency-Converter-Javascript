const dropList = document.querySelectorAll("form select"), // selecting all select tags
fromCurrency = document.querySelector(".from select"), // selecting FROM select tag
toCurrency = document.querySelector(".to select"), // selecting TO select tag
getButton = document.querySelector("form button"); // selecting button tag

// creating object of country list
for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        // if i is 0 then currency code is equal to MXN then selected will be true otherwise selected will be false
        let selected = i == 0 ? currency_code == "MXN" ? "selected" : "" : currency_code == "USD" ? "selected" : "";
        // creating option tag with passing currency code and selected variable
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // inserting option tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target); // calling loadFlag with passing select element
    });
}

// creating img tag and inserting it inside select tag
function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){ // if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img"); // selecting img tag of particular drop list
            // passing country code of a selected currency code in a img url
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}
// calling loadFlag with passing select element (fromCurrency) of FROM
window.addEventListener("load", ()=>{
    getExchangeRate();
});
// calling getExchangeRate
getButton.addEventListener("click", e =>{
    e.preventDefault(); //preventing form from submitting
    getExchangeRate();
});
// calling loadFlag with passing select element (fromCurrency) of FROM
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value; // temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; // passing TO currency code to FROM currency code
    toCurrency.value = tempCode; // passing temporary currency code to TO currency code
    loadFlag(fromCurrency); // calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(toCurrency); // calling loadFlag with passing select element (toCurrency) of TO
    getExchangeRate(); // calling getExchangeRate
})

// fetching api response
function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;
    // if user don't enter any value or enter 0 then we'll put 1 value by default in the input field
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting exchange rate";
    let url = `https://v6.exchangerate-api.com/v6/87e5741f31d1f449a19b2261/latest/${fromCurrency.value}`;
    // fetching api response and returning it with parsing into js obj and in another then method receiving that obj
    fetch(url).then(response => response.json()).then(result =>{
        let exchangeRate = result.conversion_rates[toCurrency.value]; // getting user selected TO currency rate
        let totalExRate = (amountVal * exchangeRate).toFixed(2); // multiplying user entered value with selected TO currency rate
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(() =>{ // if user is offline or any other error occured while fetching data then catch function will run
        exchangeRateTxt.innerText = "Opp, something happens";
    });
}