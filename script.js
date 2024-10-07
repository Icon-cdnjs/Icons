let currentZip = null;
let zipContent = {};
let originalFileName = ""; // Store the original file name

// Handle ZIP file upload
document.getElementById('zipFileInput').addEventListener('change', function(event) {
  let file = event.target.files[0];
  if (file) {
    JSZip.loadAsync(file).then(function(zip) {
      currentZip = zip;
      originalFileName = file.name.replace(".zip", ""); // Remove .zip extension
      let outputTextarea = document.getElementById('output');
      outputTextarea.value = 'ZIP file loaded. Click preview to extract contents.';
    });
  }
});

// Preview ZIP content
document.getElementById('previewBtn').addEventListener('click', function() {
  if (!currentZip) {
    alert("No ZIP file loaded.");
    return;
  }

  let outputTextarea = document.getElementById('output');
  outputTextarea.value = ''; // Clear output area

  currentZip.forEach(function(relativePath, file) {
    file.async("string").then(function(content) {
      // Store content for potential modification
      zipContent[relativePath] = content;

      // Display file contents in the textarea
      outputTextarea.value += `File: ${relativePath}\n\n${content}\n\n---\n\n`;
    });
  });
});

// Remove text from ZIP contents
document.getElementById('changeBtn').addEventListener('click', function() {
  let textToRemove = document.getElementById('remover').value;
  if (!textToRemove) {
    alert("Please enter the text to remove.");
    return;
  }

  let modifiedContent = '';
  Object.keys(zipContent).forEach(function(file) {
    let fileContent = zipContent[file];
    let newContent = fileContent.split(textToRemove).join(''); // Remove the text
    zipContent[file] = newContent; // Update the ZIP content

    // Display modified content
    modifiedContent += `File: ${file}\n\n${newContent}\n\n---\n\n`;
  });

  document.getElementById('removeoutput').value = modifiedContent;
});

// Generate the download link for the modified ZIP file
document.getElementById('downloadLink').addEventListener('click', function() {
  if (!currentZip) {
    alert("No ZIP file is loaded.");
    return;
  }

  let newZip = new JSZip();
  Object.keys(zipContent).forEach(function(file) {
    newZip.file(file, zipContent[file]); // Add modified files to the new ZIP
  });

  newZip.generateAsync({ type: "blob" }).then(function(blob) {
    let downloadLink = document.getElementById('downloadLink');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${originalFileName}.zip`; // Dynamic file name
  });
});

// Clear button functionality
document.getElementById('clearBtn').addEventListener('click', function() {
  document.getElementById('zipFileInput').value = '';
  document.getElementById('output').value = '';
  document.getElementById('removeoutput').value = '';
  document.getElementById('remover').value = '';
  currentZip = null;
  zipContent = {};
  originalFileName = ""; // Reset file name
});