// From ChatGPT4
import React, { useState, useEffect } from 'react';

const SlideIn = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Activate the slide-in after the component mounts
    setIsActive(true);
  }, []);

  return (
    <div className={`slider ${isActive ? 'active' : ''}`}>
      {children}
    </div>
  );
};

export default SlideIn;

