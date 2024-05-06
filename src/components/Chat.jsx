import React, { useState } from 'react';
import './Chat.css';
import Select from 'react-select';
import moment from 'moment-timezone';
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
  const allOptions = ['Matutino (9:00 - 12:00)', 'Vespertino (12:00 - 18:00)', 'Nocturno (17:00 - 22:00)']; // Agrega todas tus opciones aquí

  const HIC_nameProject = (e) => {
    SI_nameProject(e.target.value);
  };

  const options = allOptions.map(option => ({ value: option, label: option }));

  const handleChange = (value) => {
    HIC_availableHours({ target: { value: value ? value.map(option => option.value) : [] } });
  }

  const HIC_description = (e) => {
    SI_description(e.target.value);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: darkMode ? '1px solid #fdfcfc' : '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: darkMode ? '#727272' : (state.isFocused ? '#fdfcfc' : '#fdfcfc'),
      color: darkMode ? '#fff' : '#333',
      boxShadow: state.isFocused ? '0 0 0 1px #aaa' : 'none',
      '&:hover': {
        borderColor: darkMode ? '#777' : '#aaa'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? (darkMode ? '#555' : '#ccc') : (state.isFocused ? (darkMode ? '#444' : '#eee') : (darkMode ? '#333' : '#fff')),
      color: darkMode ? '#fff' : '#333',
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      return { ...provided, opacity, transition, color: darkMode ? '#fff' : '#333' };
    }
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

  const timeZoneOptions = moment.tz.names().map(tz => {
    return { value: tz, label: tz }
  });

  const HIC_availableHours = (e) => {
    if (e.target.value === 'all') {
      SI_availableHours(allOptions);
    } else {
      SI_availableHours(e.target.value);
    }
  };

  const HIC_timeZone = (e) => {
    SI_timeZone(e.target.value);
  };

  const handleSubmit = async () => {
    // Aquí invocarás la API de generación de texto
    //debe retornar un html que es el resultado de la consulta
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

      <div className="input-container" style={{ marginBottom: '50px' }}>
        <p>Horario disponible</p>
        <Select
          className={darkMode ? 'input-short dark-mode' : 'input-short'}
          options={options}
          isMulti
          onChange={handleChange}
          value={options.filter(option => availableHours.includes(option.value))}
          styles={{
            ...customStyles,
            control: (provided) => ({
              ...provided,
              maxHeight: '50px',
              background: darkMode ? '#727272' : '#fff',
              color: darkMode ? '#fff' : '#333'
            }),
            valueContainer: (provided) => ({
              ...provided,
              maxHeight: '40px',
              overflow: 'auto',
              color: darkMode ? '#fff' : '#333'
            }),
            option: (provided) => ({
              ...provided,
              color: darkMode ? '#fff' : '#333',
              background: darkMode ? '#333' : '#fff'
            }),
            menu: (provided) => ({
              ...provided,
              background: darkMode ? '#333' : '#fff',
            }),
          }}
          menuPlacement='auto'
        />
      </div>

      <div className="input-container" style={{ marginBottom: '50px' }}>
        <p>Zona Horaria</p>
        <Select
          className={darkMode ? 'input-short dark-mode' : 'input-short'}
          value={timeZoneOptions.find(option => option.value === timeZone)}
          onChange={option => HIC_timeZone({ target: { value: option.value } })}
          options={timeZoneOptions}
          styles={customStyles}
        />
      </div>

      <center>
        <button className="button" onClick={handleSubmit}>Generar</button>
        {output && <p>{output}</p>}
      </center>

    </div>
  );
};

export default Chat;