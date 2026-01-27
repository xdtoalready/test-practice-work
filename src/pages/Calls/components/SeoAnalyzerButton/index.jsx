// src/Calls/components/SeoAnalyzerButton/index.jsx
import React from 'react';
import styles from './SeoAnalyzerButton.module.sass';

const SeoAnalyzerButton = ({ onClick, onClose, isOpen }) => {
  return (
    <div className={styles.seoButtonContainer}>
      <button
        className={styles.seoButton}
        onClick={isOpen ? onClose : onClick}
        aria-label="Открыть SEO анализатор"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default SeoAnalyzerButton;
