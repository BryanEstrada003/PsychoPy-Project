import Chat from './components/Chat.jsx'
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <div id="div1">
        <h1>PsychoPy</h1>
        <Chat />
      </div>
      <div id="div2">
        <p>esto sera el chat</p>
      </div>
    </div>
  );
}

export default App;