function addNewNote() {
    document.getElementById('noteModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
}

// Trying to get this data to the backend
function submitNote(contactID) {
    const noteType = document.getElementById('noteType').value;
    const noteContent = document.getElementById('noteContent').value;

    const data = {
        contactId: contactID,
        type: noteType,
        note: noteContent
    }
    console.log(JSON.stringify(data));
    // Send data to the backend via POST request
    fetch('http://localhost:8080/new-note', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
        console.log('Success:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
        });

    closeModal();
}