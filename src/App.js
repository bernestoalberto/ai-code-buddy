import { useState } from "react";
const App = () => {
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState("Something  went wrong");
  const surpriseOptions = [
    'Who won the latest Novel Peace Prize?',
    'Where does pizza come from?',
    'Who do you make a BLT sandwich with?',
    'What is the oldest town in America?',
    'Who wrote Hotel California?'
  ];
  const clear = () =>{
    setValue("");
    setError("");
    setChatHistory([]);
  };

 
  const getResponse = async () => {
    if(!value) {
      setError("Please enter a question");
      return;
    }
    try {
       const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers : {
          'Content-Type': 'application/json'
        }
       };
       const response = await fetch(`http://${window.location.hostname}:8000/gemini`, options);
       const data = await response.text();
       console.log(data);
       setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value
       }, {
        role: "model",
        parts: data
       }]);
    }
    catch(error) {
      console.error(error);
      setError(error.message);
    }
  };
  const surprise = () => {
    const randomValue = Math.floor(Math.random() * surpriseOptions.length);
    setValue(surpriseOptions[randomValue]);
  };
  return (
    <div className="app">
          <p>What do you want to know?
          <button className="surprise"

          onClick={surprise} disabled={!chatHistory}>Surprise me</button>
          </p>
          <div className="input-container">
            <input value={value} 
            placeholder="When is Xmas...?"
            onChange={(e) => setValue(e.target.value)} />
            {!error && <button onClick={getResponse}>Ask me</button>}
            {error && <button onClick={clear}>Clear</button>}
          </div>
          {error && <p>{error}</p>}
          <div className="search-result">
            {chatHistory.map((chatItem, _index) => (
              <div key={_index}>
                <p className="answer">{chatItem.parts}</p>
              </div>
            ))}
          </div>
    </div>
  );

}

export default App;
