import React, { useState } from 'react';
import './Chat.css';
import Select from 'react-select';
import countries from 'i18n-iso-countries';
import spanish from 'i18n-iso-countries/langs/es.json';
import moment from '../../node_modules/moment';

countries.registerLocale(spanish);
const countryOptions = Object.entries(countries.getNames('es')).map(([value, label]) => ({ value, label }));

function Chat({ darkMode, onButtonClick }) {
  const [nameProject, SI_nameProject] = useState('');
  const [duration, SI_duration] = useState('');
  const [description, SI_description] = useState('');
  const [scope, SI_scope] = useState('');
  const [objective, SI_objective] = useState('');
  const [requirements, SI_requirements] = useState('');
  const [profile, SI_profile] = useState('');
  const [availableHours, SI_availableHours] = useState('');
  const [country, SI_country] = useState('');
  const [output, setOutput] = useState('');
  const allOptions = ['Matutino (9:00 - 12:00)', 'Vespertino (12:00 - 18:00)', 'Nocturno (17:00 - 22:00)']; // Agrega todas tus opciones aquí
  const options = allOptions.map(option => ({ value: option, label: option }));

  const HIC_nameProject = (e) => {
    SI_nameProject(e.target.value);
  };

  const HIC_duration = (e) => {
    SI_duration(e.target.value);
  };

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

  const HIC_scope = (e) => {
    SI_scope(e.target.value);
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
    if (e.target.value === 'all') {
      SI_availableHours(allOptions);
    } else {
      SI_availableHours(e.target.value);
    }
  };

  const handleSubmit = async () => {
    // Verifica si alguna de las variables es nula
    // Inicia el temporizador
    let count = 0;
    const timer = setInterval(() => {
      count++;
      let dots = '.';
      for (let i = 0; i < count % 3; i++) {
        dots += '.';
      }
      onButtonClick(dots);
    }, 500);

    // Espera 4 segundos
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Detiene el temporizador
    clearInterval(timer);

    // Aquí invocarás la API de generación de texto
    //debe retornar un html que es el resultado de la consulta
    if (!nameProject || !description || !scope || !objective || !requirements || !profile || !availableHours || !country) {
      onButtonClick('Por favor, completa todos los campos.');
      return;
    } else {
      // Llama a onButtonClick con el contenido que quieres mostrar
      onButtonClick(nameProject + ' ' + duration + ' ' + description + ' ' + scope + ' ' + objective + ' ' + requirements + ' ' + profile + ' ' + availableHours + ' ' + country);
    }
  };

  return (
    <div>
      <div className="input-container">
        <p>*Nombre del proyecto</p>
        <input type="text" className={darkMode ? 'input-short dark-mode' : 'input-short'} value={nameProject} placeholder="Ingresa un título breve y descriptivo..." onChange={HIC_nameProject} required />
      </div>

      <div className="input-container">
        <p>Duración</p>
        <input type="text" className={darkMode ? 'input-short dark-mode' : 'input-short'} value={duration} placeholder="Indica el tiempo estimado..." onChange={HIC_duration} />
      </div>

      <div className="input-container">
        <p>*Descripción</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={description} placeholder="Proporciona una breve explicación detallada del proyecto..." onChange={HIC_description} required />
      </div>

      <div className="input-container">
        <p>*Alcance</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={scope} placeholder="Detalle de las funciones y características principales..." onChange={HIC_scope} required />
      </div>

      <div className="input-container">
        <p>*Objetivo</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={objective} placeholder="Meta especifica que se espera lograr..." onChange={HIC_objective} required />
      </div>

      <div className="input-container">
        <p>*Requisitos/Conocimientos</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={requirements} placeholder="Habilidades técnicas y conocimientos necesarios..." onChange={HIC_requirements} required />
      </div>

      <div className="input-container">
        <p>*Perfil requerido</p>
        <textarea type="text" className={darkMode ? 'input-paragraph dark-mode' : 'input-paragraph'} value={profile} placeholder="Descripción del tipo de experiencia y habilidades profesionales que se busca..." onChange={HIC_profile} required />
      </div>

      <div className="input-container" style={{ marginBottom: '50px' }}>
        <p>*Horario disponible</p>
        <Select
          className={darkMode ? 'input-short dark-mode' : 'input-short'}
          options={options}
          isMulti
          onChange={handleChange}
          value={options.filter(option => availableHours.includes(option.value))}
          placeholder="Seleccionar..."
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
          required
        />
      </div>

      <div className="input-container" style={{ marginBottom: '50px' }}>
        <p>*País</p>
        <Select
          className={darkMode ? 'input-short dark-mode' : 'input-short'}
          value={countryOptions.find(option => option.value === country)}
          placeholder="Selecciona el país..."
          onChange={option => SI_country(option.value)}
          options={countryOptions}
          styles={{
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
            singleValue: (provided) => ({
              ...provided,
              color: darkMode ? '#fff' : '#333',
            }),
            input: (provided) => ({
              ...provided,
              color: darkMode ? '#fff' : '#333', // color del texto mientras escribes
            }),
          }}
          menuPlacement='auto'
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