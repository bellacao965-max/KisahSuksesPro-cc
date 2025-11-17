/* ===========================================================
   AI ASSISTANT
   =========================================================== */
window.sendAI = async function () {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return;

  document.getElementById("response").innerHTML = "⏳ Sedang memproses...";

  try {
    const r = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const d = await r.json();
    document.getElementById("response").innerText = d.reply || "Tidak ada response";
  } catch (e) {
    document.getElementById("response").innerText = "⚠ Error: " + e.message;
  }
};

/* ===========================================================
   GOOGLE SEARCH
   =========================================================== */
window.goGoogle = function () {
  const q = document.getElementById("gSearch").value.trim();
  const query = q || "Berita trending hari ini";

  document.getElementById("googleArea").innerHTML = `
    <iframe src="https://www.google.com/search?q=${encodeURIComponent(query)}"
      height="400" style="border:none;border-radius:10px"></iframe>`;
};

/* ===========================================================
   YOUTUBE SEARCH + RANDOM
   =========================================================== */
const defaultVideos = [
  "dQw4w9WgXcQ",
  "kXYiU_JCYtU",
  "3JZ_D3ELwOQ",
  "9bZkp7q19f0",
  "fJ9rUzIMcZQ"
];

function loadVideo(id) {
  document.getElementById("ytPlayer").src =
    "https://www.youtube.com/embed/" + id + "?rel=0&modestbranding=1";
}

window.randomVideo = function () {
  const id = defaultVideos[Math.floor(Math.random() * defaultVideos.length)];
  loadVideo(id);
};

window.searchYouTube = function () {
  const q = document.getElementById("ytSearch").value.trim();

  if (!q) return randomVideo();

  // Jika ID video
  if (q.length === 11) {
    loadVideo(q);
    return;
  }

  // Selain itu → search di YouTube
  window.open(
    "https://www.youtube.com/results?search_query=" + encodeURIComponent(q),
    "_blank"
  );
};

// Load video random awal
setTimeout(randomVideo, 1200);

/* ===========================================================
   TIKTOK VIEWER
   =========================================================== */
window.goTikTok = function () {
  const q = document.getElementById("ttSearch").value.trim() || "viral";
  document.getElementById("ttArea").innerHTML = `
    <iframe src="https://www.tiktok.com/search?q=${encodeURIComponent(q)}"
      height="450" style="border:none;border-radius:10px"></iframe>`;
};

/* ===========================================================
   INSTAGRAM VIEWER
   =========================================================== */
window.loadIG = function () {
  document.getElementById("igArea").innerHTML = `
    <iframe src="https://www.instagram.com"
      height="450" style="border:none;border-radius:10px"></iframe>`;
};

/* ===========================================================
   FACEBOOK VIEWER
   =========================================================== */
window.loadFB = function () {
  document.getElementById("fbArea").innerHTML = `
    <iframe src="https://m.facebook.com"
      height="450" style="border:none;border-radius:10px"></iframe>`;
};

/* ===========================================================
   CUACA (wttr.in – tanpa API key)
   =========================================================== */
function loadWeather() {
  if (!navigator.geolocation) {
    document.getElementById("weatherArea").innerText = "GPS tidak didukung.";
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;

    fetch(`https://wttr.in/${latitude},${longitude}?format=3`)
      .then(r => r.text())
      .then(t => (document.getElementById("weatherArea").innerText = t))
      .catch(() => (document.getElementById("weatherArea").innerText = "Gagal memuat cuaca."));
  });
}
loadWeather();

/* ===========================================================
   QUOTE GENERATOR
   =========================================================== */
function loadQuote() {
  fetch("/api/quote")
    .then(r => r.json())
    .then(d => (document.getElementById("quoteArea").innerText = d.quote))
    .catch(() => (document.getElementById("quoteArea").innerText = "Gagal mengambil quote"));
}
loadQuote();

/* ===========================================================
   GAME LOADING
   =========================================================== */
window.playGame = function (name) {
  window.open(name + ".html", "_blank");
};
