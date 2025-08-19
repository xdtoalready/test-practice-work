import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import FabComponent from '../shared/fab';
import Icon from '../shared/Icon';
import { http } from '../shared/http';
import { createPortal } from 'react-dom';
import { AuthContext } from './AuthProvider';
import useOutsideClick from '../hooks/useOutsideClick';
import { API_URL } from '../shared/constants';

const FabOverlay = ({onClose, chatToken,isOpen}) => {
  const iframeUrl = `${API_URL}/chats`
  const [isLoaded,setIsLoaded] = useState(true);
  const overlayRef = useRef(null);
  useOutsideClick(overlayRef, onClose, 'fab-root');

  useEffect(() => {
      http.get(`${API_URL}/api/one_time_auth`,
        {params:{token:chatToken},
          withCredentials:true
        }
      )
        .catch((e)=>console.log(e)).finally(()=>setIsLoaded(true))
  },[chatToken])

  const frame = useMemo(()=>{
    if(isLoaded){
      return <iframe
        src={iframeUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Чаты"
      />
    } else {
      return  <div>Идёт авторизация...</div>
    }
  },[isLoaded])


  return (
    <div ref={overlayRef} style={{
      position: 'fixed', top: 70, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 10000,
    }}>
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        backgroundColor: '#fff',
      }}>
        <button
          id={'fab-chat-close'}
          onClick={onClose}
          style={{
            position: 'absolute', top: 8, right: 56,
            zIndex: 1001,
            color: '#fff',
            background: 'transparent', border: 'none',
            fontSize: 36,
          }}
        >
          ×
        </button>

        {frame}
      </div>
    </div>
  )
}

const FabProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const context= useContext(AuthContext);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = '';
    }

    return () => {
      document.body.style.overflowY = '';
    };
  }, [isOpen]);
  const fab = (
    <>
      <FabComponent
        id={'fab-chat'}
        icon={<Icon name="messages" size={24} />}
        text="Чаты"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && <FabOverlay chatToken={context.chatToken} onClose={() => setIsOpen(false)} isOpen={isOpen} />}
    </>
  );

  return createPortal(fab, document.getElementById('fab-root'));
};

export default FabProvider;
