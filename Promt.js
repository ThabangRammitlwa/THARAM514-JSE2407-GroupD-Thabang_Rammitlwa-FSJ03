let deferredPrompt;

/**
 * Listens for the 'beforeinstallprompt' event, which is fired when the
 * browser is ready to show the install prompt for the Progressive Web App (PWA).
 * 
 * @param {Event} e - The 'beforeinstallprompt' event.
 */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent the default installation prompt from showing
  deferredPrompt = e; // Save the event for later use
  // Show your custom install button or UI element here
});

/**
 * Triggers the install prompt for the PWA when called.
 * It uses the deferredPrompt saved during the 'beforeinstallprompt' event.
 */
const installApp = () => {
  if (!deferredPrompt) return; // Exit if there is no deferred prompt
  deferredPrompt.prompt(); // Show the install prompt

  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt'); // User accepted the install
    } else {
      console.log('User dismissed the install prompt'); // User dismissed the install
    }
    deferredPrompt = null; // Clear the deferredPrompt variable
  });
};

