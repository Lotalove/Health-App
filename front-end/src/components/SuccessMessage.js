import React, { useState } from "react";
import "../styles/SuccessMessage.css"; // Optional: External CSS for styling

const SuccessMessage = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  const showMessage = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  return (
    <>
      {isVisible && (
        <div className="success-message">
          <p>✅ {props.message}</p>
        </div>
      )}
    <button onClick={()=>{
        props.clickFunction()
        showMessage()
    
    }}
         className="trigger-btn">
        Add Exercise
      </button>
    </>
  );
};

export default SuccessMessage;
