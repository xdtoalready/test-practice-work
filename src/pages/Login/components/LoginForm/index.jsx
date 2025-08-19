import React, { useState, useContext } from 'react';
import styles from '../../LoginPage.module.sass';
import { AuthContext } from '../../../../providers/AuthProvider';
import Button from '../../../../shared/Button';
import TextInput from '../../../../shared/TextInput';
import cn from 'classnames';
import Loader from '../../../../shared/Loader';
import { useNavigate } from 'react-router';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = (event) => {
    setIsLoading(true);
    // event?.preventDefault();
    login(email, password).then(() => {
      setIsLoading(false);
    });
  };

  return (
    <form className={styles.loginForm}>
      <TextInput
        type={'input'}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        edited={true}
        className={styles.input}
        label={'Электронная Почта'}
      />
      <TextInput
        type={'password'}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        edited={true}
        className={styles.input}
        label={'Пароль'}
      />
      <div className={styles.buttonContainer}>
        <Button
          disabled={isLoading}
          onClick={(e) => handleSubmit(e)}
          classname={cn(styles.submitButton)}
          name={isLoading ? <Loader/> : 'Войти'}
        />
      </div>
    </form>
  );
};

export default LoginForm;
