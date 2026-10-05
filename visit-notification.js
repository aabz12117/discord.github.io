(() => {
  // Local previews do not send visit notifications.
  if (["localhost", "127.0.0.1", "::1"].includes(location.hostname) || location.protocol !== "https:") return;
  const key = "bodi-visit-notified-v1";
  const endpoint = "https://discord.com/api/webhooks/1556757110153289819/totoiFK6vVRJIU8rMSrW6n4Y5mO3wGWofOy6_4BpT9XY0VMZyFWtA9hR4GUp2JlFcv6n";
  function deviceInfo() {
    const ua = navigator.userAgent || "";
    const browser = /Edg\//.test(ua) ? "Microsoft Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\/|FxiOS\//.test(ua) ? "Firefox" : /Chrome\/|CriOS\//.test(ua) ? "Chrome / Chromium" : /Safari\//.test(ua) ? "Safari" : "Unknown";
    const os = /Android/.test(ua) ? "Android" : /iPhone|iPad|iPod/.test(ua) ? "iOS / iPadOS" : /Windows/.test(ua) ? "Windows" : /Macintosh/.test(ua) && navigator.maxTouchPoints > 1 ? "iPadOS" : /Macintosh|Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Unknown";
    const device = /iPad|Tablet/.test(ua) || os === "iPadOS" || (/Android/.test(ua) && !/Mobile/.test(ua)) ? "Tablet" : /Mobi|iPhone|iPod/.test(ua) ? "Mobile" : "Computer";
    return [{ name: "Device", value: device, inline: true }, { name: "OS", value: os, inline: true }, { name: "Browser", value: browser, inline: true }];
  }
  async function notifyVisit() {
    try {
      if (localStorage.getItem(key)) return;
      const visitedAt = new Date().toISOString();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          allowed_mentions: { parse: [] },
          embeds: [{ title: "زيارة جديدة للموقع", description: "أحد الزوار فتح الموقع.", color: 5991032, fields: deviceInfo(), timestamp: visitedAt }]
        })
      });
      if (response.ok) localStorage.setItem(key, visitedAt);
    } catch {
      // Notification errors must not affect the profile page.
    }
  }
  if (navigator.locks) navigator.locks.request(key, notifyVisit).catch(() => {});
  else notifyVisit();
})();

