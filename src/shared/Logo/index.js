import React from 'react';
import styles from '../../../src/pages/Login/LoginPage.module.sass';
import Image from '../Image';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const Index = () => {
  const isSmallLogo = useMediaQuery({
    minWidth: 1312,
    maxWidth: 1700
  });
  return (
    <div className={styles.logo}>
      <Link className={styles.logo} to="/">
        <Image
          className={styles.pic}
          src={isSmallLogo ? '/leadbro/Logo_small.png' : '/leadbro/Logo.svg'}
          srcDark={isSmallLogo ? '/leadbro/Logo_small.png' : '/leadbro/Logo.svg'}
          alt="Core"
        />
      </Link>
    </div>
  );
};

export default Index;
