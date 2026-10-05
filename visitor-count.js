(() => {
  const label = document.getElementById("visitor-count");
  const endpoint = config.visitorCounterUrl;
  if (!label || !endpoint) return;
  const key = "bodi-counter-counted-v1";
  const local = ["127.0.0.1", "localhost", "::1"].includes(location.hostname);
  const valid = value => Number.isSafeInteger(value) && value >= 0;
  const display = count => { label.textContent = String(count); };
  async function updateCount() {
    try {
      const response = await fetch(endpoint, { cache: "no-store", credentials: "omit" });
      if (!response.ok) return;
      const data = await response.json();
      if (!valid(data.count)) return;
      display(data.count);
      if (local || localStorage.getItem(key)) return;
      const saved = await fetch(endpoint.replace("/v2/", "/v2/increment/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "count", by: 1 }),
        credentials: "omit"
      });
      if (!saved.ok) return;
      const result = await saved.json();
      if (valid(result.count)) {
        localStorage.setItem(key, "1");
        display(result.count);
      }
    } catch { /* Preserve the last valid count on network failure. */ }
  }
  if (navigator.locks) navigator.locks.request(key, updateCount).catch(() => {});
  else updateCount();
})();
