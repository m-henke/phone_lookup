let phoneNumber = '';

function validatePhoneNumber(event) {
    event.preventDefault(); // Prevent form submission
    var phoneInput = document.getElementById('phone').value;
    var errorMessage = document.getElementById('errorMessage');
    var phoneNumberDisplay = document.getElementById('phoneNumberDisplay');
    var phoneNumberContainer = document.querySelector('.phone-number-container');
    var buttonsContainer = document.getElementById('buttonsContainer');
    var inputContainer = document.querySelector('.input-container');

    // Regular expression to check if phone number contains exactly 10 digits
    var phonePattern = /^\d{10}$/;

    if (!phonePattern.test(phoneInput)) {
        errorMessage.style.display = 'block'; 
    } else {
        phoneNumber = phoneInput;
        errorMessage.style.display = 'none'; 
        phoneNumberDisplay.textContent = "(".concat(phoneInput.slice(0, 3) + ") ", phoneInput.slice(3, 6), "-", phoneInput.slice(6));
        inputContainer.classList.add('hidden');
        buttonsContainer.classList.remove('hidden');
        phoneNumberContainer.classList.remove('hidden');
    }
}
