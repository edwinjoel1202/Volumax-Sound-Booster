const slider = document.getElementById("volumeSlider");
const display = document.getElementById("display");

// Update volume boost when slider is moved
slider.addEventListener("input", () => {
  const volume = parseFloat(slider.value);
  display.textContent = `${Math.round(volume * 100)}%`;

  // Send the boost command to all tabs with the new volume
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      command: "boost",
      volume: volume
    });
  });
});
