import React, { useState } from 'react';
import styles from './styles.module.css';

const PersonalizationToggle = () => {
  const [isPersonalized, setIsPersonalized] = useState(false);

  const togglePersonalization = () => {
    setIsPersonalized((prevState) => !prevState);
    // Placeholder for personalization logic
    if (!isPersonalized) {
      alert('Chapter content personalized!');
    } else {
      alert('Chapter content reverted to default.');
    }
  };

  return (
    <div className={styles.personalizationContainer}>
      <button onClick={togglePersonalization}>
        {isPersonalized ? 'Revert to Default' : 'Personalize Chapter for Me'}
      </button>
    </div>
  );
};

export default PersonalizationToggle;
