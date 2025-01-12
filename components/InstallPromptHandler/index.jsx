// components/InstallPromptHandler.jsx
'use client'; // Ensure this runs on the client-side
import { useState, useEffect, useRef } from 'react';
import InstallPrompt from '../InstallPrompt'; // Custom pop-up component

const InstallPromptHandler = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const hasPromptBeenShown = useRef(false); // Ref to track if the prompt has been shown

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default mini-info bar
      setDeferredPrompt(e); // Save the event for triggering later

      // Show the prompt only if it hasn't been shown before
      if (!hasPromptBeenShown.current) {
        setShowInstallPrompt(true); // Display the custom install pop-up
      }
    };

    // Listen for the 'beforeinstallprompt' event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Trigger the actual PWA install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
         
        } else {
         
        }
        hasPromptBeenShown.current = true; // Mark the prompt as shown
        setDeferredPrompt(null); // Reset prompt state
        setShowInstallPrompt(false); // Hide the custom pop-up
      });
    }
  };

  const handleClose = () => {
    hasPromptBeenShown.current = true; // Mark the prompt as shown
    setShowInstallPrompt(false); // Hide the custom pop-up
  };

  return (
    <>
      {showInstallPrompt && (
        <InstallPrompt onInstallClick={handleInstallClick} onClose={handleClose} />
      )}
    </>
  );
};

export default InstallPromptHandler;
