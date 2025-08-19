import React, {useState} from 'react';
import styles from './Input.module.sass'
import Icon from "../../../../shared/Icon";
import TextInput from "../../../../shared/TextInput";

const Index = ({ onSendTimeTracking, currentUser, timeTrackingsLength }) => {
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const handleHoursChange = (event) => {
        const value = event.target.value;
        if (value === '' || (/^\d*$/.test(value))) {
            setHours(value);
        }
    };

    const handleMinutesChange = (event) => {
        const value = event.target.value;
        if (value === '' || (/^\d*$/.test(value) && parseInt(value) <= 59)) {
            setMinutes(value);
        }
    };

    const handleSendTimeTracking = () => {
        if (hours || minutes) {
            const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
            const newTimeTracking = {
                id: timeTrackingsLength,
                date: new Date(),
                sender: currentUser,
                minutes: totalMinutes
            };
            onSendTimeTracking(newTimeTracking);
            setHours('');
            setMinutes('');
        }
    };

    const isFormValid = hours || minutes;

    return (
        <div className={styles.container}>
            <div className={styles.input}>
                <div className={styles.input_field}>
                    <TextInput
                        name="hours"
                        value={hours}
                        onChange={handleHoursChange}
                        placeholder="Часы"
                        edited={true}
                        className={styles.time_input}
                    />
                    <TextInput
                        name="minutes"
                        value={minutes}
                        onChange={handleMinutesChange}
                        placeholder="Минуты"
                        edited={true}
                        className={styles.time_input}
                    />
                </div>
                <div className={styles.input_send}>
                    <Icon
                        className={isFormValid ? styles.send : styles.send_disabled}
                        viewBox="0 0 20 20"
                        size={20}
                        fillRule="evenodd"
                        fill="#6F767E"
                        name="send"
                        onClick={isFormValid ? handleSendTimeTracking : undefined}
                    >
                        Send
                    </Icon>
                </div>
            </div>
        </div>
    );
};

export default Index;