import React, { useState, useEffect } from "react";
import "../styles/SuccessMessage.css"; // Optional: External CSS for styling

const SuccessMessage = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message,setMessage] = useState(props.message)
  useEffect(() => {
    if (!props.message) return;          // nothing to show

    setMessage(props.message)
    setIsVisible(true);            // show immediately when message changes

    const timer = setTimeout(() => {
      props.clearMessage()       
    }, 2000);

    return () => clearTimeout(timer); // cleanup if message changes/unmounts
  }, [props.message]);        

  return (
    <>
      {isVisible && (
        <div className="success-message">
          <p>{message}</p>
        </div>
      )}

    </>
  );
};

export default SuccessMessage;
