// Gets the phone number for the create_links.js file
function getQueryVariable(variable) {
    const params = new URLSearchParams(window.location.search);
    return params.get(variable) || null;
}

const phoneNumber = getQueryVariable("phone_number");

if (!phoneNumber) {
    console.error('Query Variable "phone_number" not found');
}
