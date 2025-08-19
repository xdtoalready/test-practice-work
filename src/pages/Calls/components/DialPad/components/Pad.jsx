import React from 'react';
import styles from "../DialPad.module.sass";

const Pad = ({handleNumberClick}) => {
    return (
        <div className={styles.keypad}>
            <div className={styles.keypadRow}>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('1')}
                >
                    1
                </button>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('2')}
                >
                    2
                </button>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('3')}
                >
                    3
                </button>
            </div>
            <div className={styles.keypadRow}>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('4')}
                >
                    4
                </button>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('5')}
                >
                    5
                </button>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('6')}
                >
                    6
                </button>
            </div>
            <div className={styles.keypadRow}>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('7')}
                >
                    7
                </button>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('8')}
                >
                    8
                </button>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('9')}
                >
                    9
                </button>
            </div>
            <div className={styles.keypadRow}>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('*')}
                >
                    *
                </button>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('0')}
                >
                    0
                </button>
                <button
                    className={styles.keypadButton}
                    onClick={() => handleNumberClick('#')}
                >
                    #
                </button>
            </div>
        </div>
    );
};

export default Pad;