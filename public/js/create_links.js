function goToWebsite(buttonNumber) {
    let baseURL = "";
    switch (buttonNumber) {
        case 1:
            baseURL = "https://app.virtuoussoftware.com/Generosity/QuickSearch?filter=";
            break;
        case 2:
            baseURL = "https://www.whitepages.com/phone/1-";
            break;
        case 3:
            baseURL = "https://www.beenverified.com/rf/report/phone?phone=";
            break;
        default:
            console.log("Unknown Button Press")
    }

    window.open(baseURL + phoneNumber, "_blank")
}

function GenerateVirtuousLink(contact_id) {
    let baseURL = "https://app.virtuoussoftware.com/Generosity/Contact/View/";
    window.open(baseURL + contact_id, "_blank");
}
