import React, { useState } from 'react';
import styles from './styles.module.css';

const UrduTranslator = () => {
  const [isTranslated, setIsTranslated] = useState(false);

  const toggleTranslation = () => {
    setIsTranslated((prevState) => !prevState);
    // Placeholder for translation logic
    if (!isTranslated) {
      alert('Chapter content translated to Urdu!');
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      alert('Chapter content reverted to English.');
      document.documentElement.setAttribute('dir', 'ltr');
    }
  };

  return (
    <div className={styles.translatorContainer}>
      <button onClick={toggleTranslation}>
        {isTranslated ? 'Switch to English' : 'Urdu Translation'}
      </button>
    </div>
  );
};

export default UrduTranslator;
