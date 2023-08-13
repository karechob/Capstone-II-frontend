import { React, useState } from 'react'
import { useNavigate } from "react-router-dom"; 

function LinkPage() {
  const [link, setLink] = useState("");
  const navigate = useNavigate();

  function handleLink(event){
    setLink(event.target.value); 
  }

  function handleAnalyze(){
    navigate(`/metrics?link=${encodeURIComponent(link)}`);
  }

  return (
    <div>
      <h1>Page where user will provide the link</h1>

      <input
        id= "enter-link"
        type="text"
        value={link}
        onChange={handleLink} 
        placeholder="Enter repository link"
      />
      <button onClick={handleAnalyze}>Analyze</button>
      
    </div>
  )
}

export default LinkPage;