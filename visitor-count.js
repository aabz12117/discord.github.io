(() => {
  const label = document.getElementById("visitor-count");
  const endpoint = config.visitorCounterUrl;
  if (!label || !endpoint) return;
  async function showCount() {
    try {
      const response = await fetch(endpoint, { cache: "no-store", credentials: "omit" });
      if (!response.ok) return;
      const data = await response.json();
      if (Number.isSafeInteger(data.count) && data.count >= 0) {
        label.textContent = String(data.count);
      }
    } catch { /* Leave unavailable counts blank instead of inventing a number. */ }
  }
  showCount();
})();
