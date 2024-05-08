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

  const [outputText, setOutputText] = useState('');


  
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
        <Chat darkMode={darkMode} />
      </div>
      <div id="current-chat" className={`${darkMode ? 'dark' : ''}`}>
        <div id='download-history' style={{ textAlign: 'right' }} className={darkMode ? 'dark-mode' : ''}>
          <button className={darkMode ? 'dark-mode' : ''}>
            <img src={darkMode ? downloadDarkImg : downloadImg} alt="Download" />
          </button>
        </div>
        <div id='chat-messages'>
          <FileUpload darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;