import React, { useState, useRef, useEffect } from 'react';
import hdfcLogo from './HDFC.png';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [userInputs, setUserInputs] = useState([]);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [textBoxHeight, setTextBoxHeight] = useState(30);
  const userInputContainerRef = useRef(null);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (!isSearching && query.trim() !== '') { // Check if not already searching and query is not empty
      setIsSearching(true);
      BackendResponse(query);
      setUserInteracted(true);
      setQuery(''); // Clear the query state
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      setTextBoxHeight(textBoxHeight + 20);
    } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
      handleSearch();
    }
  };

  const handleRoundedBoxClick = (text) => {
    setQuery(text);
    handleSearch();
  };

  const BackendResponse = async (query) => {
    try {
      const response = await fetch('https://itmzu5ricdgmqdtn47g2ul4u6y0jczfj.lambda-url.us-east-1.on.aws/', {
        method: 'POST',
        body: JSON.stringify({
          'previous_question': 'value',
          'question': query,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      const updatedUserInputs = [...userInputs, { query, response: data.answer }];
      setUserInputs(updatedUserInputs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const resetTextBoxHeight = () => {
      setTextBoxHeight(30);
    };

    window.addEventListener('keydown', resetTextBoxHeight);

    return () => {
      window.removeEventListener('keydown', resetTextBoxHeight);
    };
  }, []);

  useEffect(() => {
    if (userInputContainerRef.current) {
      userInputContainerRef.current.scrollTop = userInputContainerRef.current.scrollHeight;
    }
  }, [userInputs]);

  return (
    <div className="App">
      <img src={hdfcLogo} alt="HDFC Mutual Fund Logo" className="logo" />

      {!userInteracted && (
        <React.Fragment>
          <div className="center-text">
            <h1>How can I help you today?</h1>
          </div>
          <div className="top-section">
            <div className="rounded-box" onClick={() => handleRoundedBoxClick("What is NFO?")}>
              <p>What is NFO?</p>
            </div>
            <div className="rounded-box" onClick={() => handleRoundedBoxClick("What does NFO stand for?")}>
              <p>What does NFO stand for?</p>
            </div>
          </div>
        </React.Fragment>
      )}

      <div id="bottom-dialog" className="bottom-dialog">
        <textarea
          style={{ height: `${textBoxHeight}px` }}
          placeholder="Type your query here"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSearch} disabled={isSearching}>
          ➡️
        </button>
      </div>

      <div ref={userInputContainerRef} className="user-input-container">
        {userInputs.map((input, index) => (
          <div key={index}>
            <div className="user-input-box">{input.query}</div>
            <div className="chatbot-box">{input.response}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;