import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Forbidden.module.sass';
import { Shield } from 'lucide-react';

const Forbidden = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Получаем предыдущий URL из состояния навигации
    const previousPath = '/';



    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Shield className={styles.icon} size={64} />
                <h1 className={styles.title}>Доступ запрещен</h1>
                <p className={styles.message}>
                    Данная страница не доступна из-за настроек прав доступа.
                    Обратитесь к администратору за дополнительной информацией.
                </p>

                <button
                    className={styles.button}
                    onClick={() => navigate(previousPath)}
                >
                    Вернуться назад
                </button>
            </div>
        </div>
    );
};

export default Forbidden;