let gainNode = null;
let audioCtx = null;

// Function to boost the audio/video element's volume
function boostAudio(volume) {
  const mediaElements = document.querySelectorAll("audio, video");

  if (mediaElements.length === 0) {
    console.warn("No audio or video elements found yet.");
    setTimeout(() => boostAudio(volume), 1000); // Retry after 1 second
    return;
  }

  mediaElements.forEach((media) => {
    if (!media.audioBoosted) {
      // Create an audio context for volume boosting
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(media);
      gainNode = audioCtx.createGain();
      gainNode.gain.value = volume; // Apply the volume boost

      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      media.audioBoosted = true; // Prevent reapplying boost to the same media element
      console.log("Audio boost applied to element", volume);
    } else if (gainNode) {
      // If boost already applied, just update the volume
      gainNode.gain.value = volume;
      console.log("Updated volume boost to", volume);
    }
  });
}

// Listen for the "boost" command from popup
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.command === "boost") {
    boostAudio(req.volume);
    sendResponse({ status: "boosted", volume: req.volume });
  }
});
