import React, { useRef } from 'react';
import fs from 'fs';
import path from 'path';
import '../index.css';
import '../App.css';
import iconUploadFile from '../assets/file.png';
import iconUploadFileDark from '../assets/file - dark.png';


function FileUpload(darkMode) {
  const fileInput = useRef();

  const handleFileUpload = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const filePath = path.join(__dirname, '../drive', file.name);
      fs.writeFile(filePath, new Buffer.from(reader.result), err => {
        if (err) throw err;
        console.log('File saved successfully');
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (

    <div className="file-upload">
      <button className={`transparent-button ${darkMode ? 'dark-mode' : ''}`}>
        <img
          className={`large-icon ${darkMode ? 'dark' : ''}`}
          src={darkMode ? iconUploadFileDark : iconUploadFile}
          alt="upload"
        />
      </button>
      <h3>Click box to upload</h3>
      <p>Maximun file size 10mb</p>
      <input type="file" onChange={handleFileUpload} ref={fileInput} />
    </div>


  );
}

export default FileUpload;