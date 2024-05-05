import React, { useState } from 'react';
import './Chat.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

function Chat({ darkMode }) {
  const [nameProject, SI_nameProject] = useState('');
  const [description, SI_description] = useState('');
  const [objective, SI_objective] = useState('');
  const [requirements, SI_requirements] = useState('');
  const [profile, SI_profile] = useState('');
  const [availableHours, SI_availableHours] = useState('');
  const [timeZone, SI_timeZone] = useState('');
  const [output, setOutput] = useState('');

  const HIC_nameProject = (e) => {
    SI_nameProject(e.target.value);
  };

  const HIC_description = (e) => {
    SI_description(e.target.value);
  };

  const HIC_objective = (e) => {
    SI_objective(e.target.value);
  };

  const HIC_requirements = (e) => {
    SI_requirements(e.target.value);
  };

  const HIC_profile = (e) => {
    SI_profile(e.target.value);
  };

  const HIC_availableHours = (e) => {
    SI_availableHours(e.target.value);
  };

  const HIC_timeZone = (e) => {
    SI_timeZone(e.target.value);
  };

  const handleSubmit = async () => {
    // Aquí invocarás la API de generación de texto
  };

  return (
    <div>
      <div className="input-container">
        <p>Nombre del proyecto</p>
        <input type="text" className={darkMode ? 'input-short dark-mode' : 'input-short'} value={nameProject} placeholder="Enter your prompt here..." onChange={HIC_nameProject} />
      </div>

      <div className="input-container">
        <p>Descripción</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={description} placeholder="Enter your prompt here..." onChange={HIC_description} />
      </div>

      <div className="input-container">
        <p>Objetivo</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={objective} placeholder="Enter your prompt here..." onChange={HIC_objective} />
      </div>

      <div className="input-container">
        <p>Requisitos/Conocimientos</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={requirements} placeholder="Enter your prompt here..." onChange={HIC_requirements} />
      </div>

      <div className="input-container">
        <p>Perfil requerido</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={profile} placeholder="Enter your prompt here..." onChange={HIC_profile} />
      </div>

      <div className="input-container">
        <p>Horario disponible</p>
        <input type="text" className={darkMode ? 'input-short dark-mode' : 'input-short'} value={availableHours} placeholder="Enter your prompt here..." onChange={HIC_availableHours} />
      </div>

      <div className="input-container">
        <p>Zona Horaria</p>
        <input type="text" className={darkMode ? 'input-short dark-mode' : 'input-short'} value={timeZone} placeholder="Enter your prompt here..." onChange={HIC_timeZone} />
      </div>

      <center>
        <button className="button" onClick={handleSubmit}>Generar</button>
        {output && <p>{output}</p>}
      </center>

    </div>
  );
};

export default Chat;