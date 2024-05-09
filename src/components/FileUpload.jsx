import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import '../index.css';
import '../App.css';
import iconUploadFile from '../assets/file.png';
import iconUploadFileDark from '../assets/file - dark.png';



function FileUpload(darkMode) {

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);

    const res = await fetch("http://localhost:5000/upload-file", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    alert(JSON.stringify(`${res.message}, status: ${res.status}`));
  };



  return (

    <div >
      <center>
        <h3>Click box to upload</h3>
        <p>Maximun file size 10mb</p>
        <div>
          <input type="file" {...register("file")} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="submit" />
          </form>
        </div>
      </center>

    </div>

  );
}

export default FileUpload;