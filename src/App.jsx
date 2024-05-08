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
import { GoogleGenerativeAI } from '@google/generative-ai';
import './index.css';
import FileUpload from './components/FileUpload.jsx';

function App() {
  // light dark mode
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [boxContent, setBoxContent] = useState(null);

  const handleButtonClick = (content) => {
    setBoxContent(content);
  };

  //const apiKey
  //const genAI
  const apiKey = import.meta.env.VITE_API_KEY;

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" })

  //
  const [outputText, setOutputText] = useState('');


  //console.log("apiKey", apiKey) //imprime el tezto del apikey en la consola // solo es para verificar

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <div id="input" className={`${darkMode ? 'dark' : ''}`}>
        <div className="header">
          <img src={darkMode ? iconPageDark : iconPage} alt="PsychoPy icon" style={{ width: '50px', height: '50px' }} />
          <h1 className={darkMode ? 'dark' : ''}>PsychoPy</h1>
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
        <Chat darkMode={darkMode} onButtonClick={handleButtonClick} />
      </div>
      <div id="current-chat" className={`${darkMode ? 'dark' : ''}`}>
        <div id='download-history' style={{ textAlign: 'right' }} className={darkMode ? 'dark-mode' : ''}>
          <button className={darkMode ? 'dark-mode' : ''}>
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
              {boxContent}
            </div>
          }
          <FileUpload darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;