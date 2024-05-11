import Chat from './components/Chat.jsx'
import React, { useState } from 'react';
import './App.css';
import iconPage from './assets/icon-page.png';
import iconPageDark from './assets/icon-page - dark.png'; // Asegúrate de reemplazar './assets/icon-page-dark.png' con la ruta a tu archivo de imagen de icono oscuro
import downloadImg from './assets/download.png';
import downloadDarkImg from './assets/download - dark.png';
import nightModeIcon from './assets/night-mode.png';
import menuLight from './assets/menu-icon-light.png';
import menuDark from './assets/menu-icon-dark.png';
import './index.css';
import FileUpload from './components/FileUpload.jsx';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import ReactMarkdown from 'react-markdown';
import userImg from './assets/user.png';
import userDarkImg from './assets/user - dark.png';
import ReactModal from 'react-modal';
import fs from 'fs';
ReactModal.setAppElement('#root');


function App() {
  // light dark mode
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [boxContent, setBoxContent] = useState('');
  const [history, setHistory] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    Nombre: '',
    Experiencia: '',
    Años: '',
    Idiomas: '',
    Zona: '',
    Horas: '',
    Certificaciones: '',
    Skills: '',
    Disponible: 'True',
  });

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (event) => {
    setNewStaff({
      ...newStaff,
      [event.target.name]: event.target.value,
    });
  };

  const addStaffToCSV = (staff) => {
    const csv = Papa.unparse([staff], { header: true });
    fs.appendFile('..\\uploads\\db_staff.csv', csv, (err) => {
      if (err) throw err;
      console.log('Staff added to CSV!');
    });
  };

  const handleCreate = () => {
    // Asegúrate de que newStaff contiene los datos correctos
    console.log(newStaff);

    // Llamada a la función que agrega el staff al CSV
    addStaffToCSV(newStaff);
    handleOpenModal();
  };

  const handleButtonClick = (content) => {
    setBoxContent(content);
  };

  // Función para agregar una consulta al historial
  const addQueryToHistory = (projectName, inputProject, response) => {
    setHistory(prevHistory => [...prevHistory, { projectName, inputProject, response }]);
  };

  const [outputText, setOutputText] = useState('');

  //Hanlde button presesed to download file
  const handleDownload = () => {
    const csv = Papa.unparse(history);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'historial.csv');
  };


  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <div id="input" className={`${darkMode ? 'dark' : ''}`}>
        <div className="header">
          <img src={darkMode ? iconPageDark : iconPage} alt="PsychoPy icon" style={{ width: '50px', height: '50px' }} />
          <h1 className={darkMode ? 'dark' : ''}>SkillSync</h1>
          <div className="navbar">
            <div className="dropdown">
              <button className="dropbtn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src={darkMode ? menuDark : menuLight} />
              </button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <button
                    className={`button-${darkMode ? 'dark' : 'light'}`}
                    onClick={() => {
                      setDarkMode(!darkMode);
                      setDropdownOpen(false);
                    }}
                  >
                    <img src={nightModeIcon} alt="Night mode" /> Night mode
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Chat darkMode={darkMode} onButtonClick={handleButtonClick} addQueryToHistory={addQueryToHistory} />
      </div>
      <div id="current-chat" className={`${darkMode ? 'dark' : ''}`}>
        <div id='download-history' style={{ textAlign: 'right' }} className={darkMode ? 'dark-mode' : ''}>
          <button className={darkMode ? 'dark-mode' : ''} onClick={handleDownload}>
            <img src={darkMode ? downloadDarkImg : downloadImg} alt="Download" />
          </button>
        </div>
        <div id='chat-messages'>
          {boxContent &&
            <div style={{
              backgroundColor: darkMode ? '#333' : '#f5f5f5', // Cambia el color de fondo dependiendo del modo oscuro
              borderRadius: '10px',
              padding: '10px',
              color: darkMode ? '#f5f5f5' : '#333', // Cambia el color del texto dependiendo del modo oscuro
              margin: '10px 0', // Agrega un margen superior e inferior
            }}>
              <ReactMarkdown>
                {boxContent}
              </ReactMarkdown>
            </div>
          }
          <FileUpload darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;