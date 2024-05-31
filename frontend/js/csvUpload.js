const form = document.getElementById('csvUploadForm');
const uploadedFilesList = document.getElementById('uploadedFilesList');

//handle the upload-file form
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('csvFileInput');
  const file = fileInput.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('csvFile', file);
    try {
      const response = await fetch('/upload', { //sending the POST req to the server along with the uploaded file
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        console.log('File uploaded successfully');
        fileInput.value = '';
        fetchUploadedFiles();
      } else {
        console.error('Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
});

//display the list of uploaded files
async function fetchUploadedFiles() {
  try {
    //console.log('Fetching uploaded files...');
    const response = await fetch('/home', { method: 'GET' });
    const files = await response.json();
    if(files.length==0){ //if no files exist, do not display the file-list headers
      document.getElementById('upload-section').style.display = 'none';
      return;
    }
    console.log('Files fetched:', files);
    document.getElementById('upload-section').style.display = 'block';
    uploadedFilesList.innerHTML = '';
    //render the list of files
    files.forEach(file => {
      const row = document.createElement('tr');
      const filenameCell = document.createElement('td');
      filenameCell.textContent = file.filename;
      const actionsCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'me-2');
      deleteButton.addEventListener('click', () => deleteFile(file._id));
      const viewButton = document.createElement('button');
      viewButton.textContent = 'View';
      viewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      viewButton.addEventListener('click', () => viewFile(file._id));
      actionsCell.appendChild(deleteButton);
      actionsCell.appendChild(viewButton);
      row.appendChild(filenameCell);
      row.appendChild(actionsCell);
      uploadedFilesList.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
  }
}

//handle the deletion of the files
async function deleteFile(fileId) {
  try{
    console.log(`Deleting file with ID: ${fileId}`);
    const response = await fetch('/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId })
    });
    if (response.ok) {
      console.log('File deleted successfully');
      //redirect to /home
      fetchUploadedFiles();
    }
  }catch(error){
    console.error('Error deleting file:', error);
  }
}

//send request to view a particular file, along with the file-id in req.query
function viewFile(fileId) {
  const url = `view/?id=${fileId}`;
  // window.open(url);
  window.location.href = url; // Open the URL in the same tab
  console.log(`Opening file with id: ${fileId}`);
}

fetchUploadedFiles();