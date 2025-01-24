function addNewNote() {
    document.getElementById('noteModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('noteModal').style.display = 'none';
}

function submitNote() {
    const noteType = document.getElementById('noteType').value;
    const noteContent = document.getElementById('noteContent').value;

    // Add your form submission logic here
    console.log('Note Type:', noteType);
    console.log('Note Content:', noteContent);

    closeModal();
}