import './App.css';
import React, { useState} from 'react'

function App() {
  const [results, setResults] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [wordcount, setWordCount] = useState([]);
  const [link, setLink] = useState('');
  const [error, setError] = useState('');


  const getResults = async () => {

    if(isValidUrl(link)){
      setError('')
      const postData = {
        link: link,
        options: checkedItems
      };

      try {
        
        const response = await fetch("http://localhost:8000/results",
        {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify(postData)
        });

        const jsonData = await response.json();
        setResults(jsonData);
        setWordCount('');
        setSentiments('');
      } catch (err) {
        console.error(err.message);
      }
    }else{
      setError('Not a valid URL!')
    }
  }


  const getSentiments = async () => {
    const postData = {
      link
    }
    try {
      
      const response = await fetch("http://localhost:8000/sentiments",
        {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify(postData)
        });

      const jsonData = await response.json();
      setSentiments(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  }

  const getWordCount = async () => {
    const postData = {
      link
    }
    try {
      
      const response = await fetch("http://localhost:8000/wordcount",
        {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify(postData)
        });

      const jsonData = await response.json();
      setWordCount(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  }

  const [checked, setChecked] = useState([]);
  const checkList = ["Images", "Titles", "Text", "Links", "Authors", "Dates"];

  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";

  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";
  
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        Web Scraper
      </header>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Which site should be scraped?</label>
        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter URL" onChange={e => setLink(e.target.value)}></input>
        <small id="error" className="form-text error">{error}</small>
      </div>
      <div className="container">
        <div>
          <div className="title">What data should be scraped?</div>
          <div className="list-container">
            {checkList.map((item, index) => (
              <div key={index}>
                <input value={item} type="checkbox" onChange={handleCheck} />
                <span className={isChecked(item)}>{item}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" type="submit" onClick={getResults}>Scrape data</button>
          <div className='results'>
            <div className="title">Scraped data:</div>
            {results.map((item, index)=>(
              <table className="table table-bordered" key= {index}>
                <thead>
                  <tr>
                    <th scope="col">{item.title}</th>
                  </tr>
                </thead>
                <tbody>
                {item.content.map((text, index)=>(
                  <tr key={index}>
                    <td>
                      {isValidUrl(text) ? <img src={text} alt="" className="image-url" /> : <div></div>}
                      {text}
                    </td>
                  </tr>
                 ))}
                </tbody>
              </table>
            ))}
          </div>
          <button className="btn btn-primary" type="submit" onClick={getWordCount}>Get word count</button>
          <div className='sent-results'>
            <div className='sent-count'>
               Number of words: <strong>{wordcount}</strong>
            </div>
            <button className="btn btn-primary" type="submit" onClick={getSentiments}>Get word count</button>
            <div className='sent-count'>
              Sentimental analysis: <strong>{sentiments}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
