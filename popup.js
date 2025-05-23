document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("volumeSlider");
  const display = document.getElementById("display");

  // Get current volume for this tab on load
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "getVolume" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        slider.value = 1;
        display.textContent = `100%`;
      } else {
        slider.value = response.volume;
        display.textContent = `${Math.round(response.volume * 100)}%`;
      }
    });
  });

  slider.addEventListener("input", () => {
    const volume = parseFloat(slider.value);
    display.textContent = `${Math.round(volume * 100)}%`;
    sendVolumeToTab(volume);
  });

  document.querySelectorAll(".preset").forEach((button) => {
    button.addEventListener("click", () => {
      const volume = parseFloat(button.dataset.volume);
      slider.value = volume;
      display.textContent = `${Math.round(volume * 100)}%`;
      sendVolumeToTab(volume);
    });
  });

  function sendVolumeToTab(volume) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        command: "boost",
        volume: volume
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
        } else {
          console.log("Boost applied:", response);
        }
      });
    });
  }
});
