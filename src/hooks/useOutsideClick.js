import { useEffect } from 'react';

// Custom hook to detect clicks outside a specified element
const useOutsideClick = (ref, handler, innerModalId,closeFab=null) => {
  let wasClickedViaFab = false;
  useEffect(() => {
    // Listener function to handle click events
    const listener = (event) => {
      const confirmModal = document.getElementById('confirmModal');
      const fabChatClose = document.getElementById('fab-chat-close');
      const joditPopup = document.getElementsByClassName('jodit-popup')?.[0];
      const fabButton = document.getElementsByClassName('rtf--mb')?.[0];

      const isInsideFab = ref.current?.contains(event.target) ||
        (fabChatClose && fabChatClose.contains(event.target)) ||
        (fabButton && fabButton.contains(event.target));

      if(fabChatClose && !isInsideFab) {
        wasClickedViaFab = true;
      }

      const isInsideOtherModal = (confirmModal && confirmModal.contains(event.target)) ||
        (joditPopup && joditPopup.contains(event.target));

      const targetModal = document.getElementById(innerModalId);
      const isInsideTargetModal = targetModal && targetModal.contains(event.target);

      if (fabChatClose && !isInsideFab && targetModal && innerModalId==='fab-root') {
        handler()
        return;
      }

      // If the ref is not set or the click is inside the element, do nothing
      if (!ref.current || isInsideFab || isInsideOtherModal) {
        return;
      }


      if (
        !ref.current ||
        isInsideTargetModal
      ) {
        return;
      }

      if (wasClickedViaFab && (!ref.current &&
        isInsideTargetModal)){
        wasClickedViaFab=false
      }

      // Call the handler if the click is outside the element
      !wasClickedViaFab && handler();
    };

    // Add event listener for 'mousedown' events
    document.addEventListener('mousedown', listener);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler, innerModalId]); // Dependency array ensures effect runs when `ref` or `handler` changes
};

export default useOutsideClick;
