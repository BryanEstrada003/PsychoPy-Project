import React, { useState } from 'react';
import './Chat.css';

const Chat = () => {
    const [input, setInput] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const [output, setOutput] = useState('');
  
    const handleInputChange = (e) => {
      setInput(e.target.value);
    };

    const handleInputChange2 = (e) => {
        setInput2(e.target.value);
    };

    const handleInputChange3 = (e) => {
        setInput3(e.target.value);
    };

    const handleInputChange4 = (e) => {
        setInput4(e.target.value);
    };

    const handleSubmit = async () => {
      // Aquí invocarás la API de generación de texto
    };
  
    return (
      <div>
        <div className="input-container">
            <input type="text" value={input} placeholder="Enter your prompt here..." onChange={handleInputChange} />
        </div>

        <div className="input-container">
            <input type="text" value={input2} placeholder="Enter your prompt here..." onChange={handleInputChange2} />
        </div>

        <div className="input-container">
            <input type="text" value={input3} placeholder="Enter your prompt here..." onChange={handleInputChange3} />
        </div>

        <div className="input-container">
            <input type="text" value={input4} placeholder="Enter your prompt here..." onChange={handleInputChange4} />
        </div>

        <button className="button" onClick={handleSubmit}>Generar</button>
        {output && <p>{output}</p>}
      </div>
    );
};

export default Chat;