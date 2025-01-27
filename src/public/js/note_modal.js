function addNewNote() {
    document.getElementById('noteModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
}

function submitNote(contactID) {
    const noteType = document.getElementById('noteType').value;
    const noteContent = document.getElementById('noteContent').value;

    const data = {
        contactId: contactID,
        type: noteType,
        note: noteContent
    }

    fetch('/new-note', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success == true) {
            console.log('Note added successfully!');
        } else {
            console.log('Failed to add note.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    closeModal();
}