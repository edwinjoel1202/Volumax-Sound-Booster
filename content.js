let audioCtx = null;
let gainValue = 1; // Default volume

function boostAudio(volume) {
  gainValue = volume;

  const mediaElements = document.querySelectorAll("audio, video");

  if (mediaElements.length === 0) {
    console.warn("No media elements found.");
    return;
  }

  mediaElements.forEach((media) => {
    if (!media._gainNode) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(media);
      const localGain = audioCtx.createGain();
      localGain.gain.value = volume;

      source.connect(localGain);
      localGain.connect(audioCtx.destination);

      media._gainNode = localGain;

      media.addEventListener("ended", () => {
        media._gainNode = null;
      });
    } else {
      media._gainNode.gain.value = volume;
    }
  });
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.command === "boost") {
    boostAudio(req.volume);
    sendResponse({ status: "boosted", volume: req.volume });
  } else if (req.command === "getVolume") {
    sendResponse({ volume: gainValue });
  }
});
