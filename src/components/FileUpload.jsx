import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import '../index.css';
import '../App.css';

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

    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
    }}>
      <div style={{ 
        padding: '20px', 
        borderRadius: '15px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}>
        <center>
          <h3>Cargar la base de datos de los staff</h3>
          <p>modelo de carga, subirlo con el mismo nombre: <a href="db_staff.csv" download>db_staff.csv</a></p>
          <div>
            <input type="file" {...register("file")} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type="submit" />
            </form>
          </div>
        </center>
      </div>
    </div>

  );
}

export default FileUpload;