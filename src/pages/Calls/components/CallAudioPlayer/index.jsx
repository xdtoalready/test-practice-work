// src/Calls/components/CallAudioPlayer/index.jsx
import React, { useRef, useState } from 'react';
import styles from './CallAudioPlayer.module.sass';
import Icon from '../../../../shared/Icon';


const CallAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.audioPlayerContainer}>
      <div className={styles.audioPlayer}>
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
        
        <button 
          onClick={handlePlayPause} 
          className={styles.playButton}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Icon fill={'#6F767E'} name={'pause'} size={18} /> : <Icon fill={'#6F767E'} name={'play'} size={18} />
        }
        </button>
        
        <span className={styles.timeCurrent}>
          {formatTime(currentTime)}
        </span>
        
        <div className={styles.progressContainer}>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className={`${styles.progressBar} ${isPlaying ? styles.playing : styles.paused}`}
            style={{
              '--progress': `${(currentTime / (duration || 1)) * 100}%`
            }}
          />
        </div>
        
        <span className={styles.timeDuration}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};


export default CallAudioPlayer;
