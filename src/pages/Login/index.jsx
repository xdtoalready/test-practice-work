import React from 'react';
import styles from './LoginPage.module.sass';
import LoginForm from './components/LoginForm';
import Logo from '../../shared/Logo';

const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.authContainer}>
        <div className={styles.formSection}>
          <Logo />
          <LoginForm />
        </div>
        <div className={styles.imageSection}>
          <img
            src="/leadbro/login-illustration.png"
            alt="Login illustration"
            className={styles.illustration}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
