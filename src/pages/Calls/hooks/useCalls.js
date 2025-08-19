// src/Calls/hooks/useCalls.js
import { useEffect, useState } from 'react';
import useStore from '../../../hooks/useStore';

export const useCalls = (entityType, entityId) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const { callsStore } = useStore();

  useEffect(() => {
    if (isCallModalOpen && entityType && entityId) {
      callsStore.setContext(entityType, entityId);
      callsStore.fetchCallsData();
    }
  }, [isCallModalOpen, entityType, entityId, callsStore]);

  return {
    isCallModalOpen,
    openCallModal: () => setIsCallModalOpen(true),
    closeCallModal: () => setIsCallModalOpen(false),
    makeCall: (phoneNumber) => callsStore.makeCall(phoneNumber),
    calls: callsStore.getCalls(),
    isLoading: callsStore.isLoading,
  };
};
