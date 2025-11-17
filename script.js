function sendAI(){const t=document.getElementById("userInput").value.trim();if(!t)return;document.getElementById("response").innerHTML="⏳ Sedang memproses...";fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:t})}).then(r=>r.json()).then(d=>document.getElementById("response").innerText=d.reply||"Tidak ada response").catch(e=>document.getElementById("response").innerText="Error: "+e.message)}
const vids=["dQw4w9WgXcQ","3JZ_D3ELwOQ","kXYiU_JCYtU","9bZkp7q19f0","fJ9rUzIMcZQ"];
function randomVideo(){loadVideo(vids[Math.floor(Math.random()*vids.length)])}
function loadVideo(id){document.getElementById("ytPlayer").src="https://www.youtube.com/embed/"+id}
function searchYouTube(){let q=document.getElementById("ytSearch").value.trim();if(!q)return randomVideo();if(q.length===11)return loadVideo(q);window.open("https://www.youtube.com/results?search_query="+encodeURIComponent(q))}
setTimeout(randomVideo,800);
function loadIG(){document.getElementById("igArea").innerHTML='<iframe src="https://www.instagram.com" height="500" style="border:none"></iframe>'}
function loadFB(){document.getElementById("fbArea").innerHTML='<iframe src="https://m.facebook.com" height="500" style="border:none"></iframe>'}
function goTikTok(){let q=document.getElementById("ttSearch").value.trim()||"viral";document.getElementById("ttArea").innerHTML='<iframe src="https://www.tiktok.com/search?q='+encodeURIComponent(q)+'" height="500" style="border:none"></iframe>'}
function goGoogle(){let q=document.getElementById("gSearch").value.trim()||"berita trending";document.getElementById("googleArea").innerHTML='<iframe src="https://www.google.com/search?q='+encodeURIComponent(q)+'" height="500" style="border:none"></iframe>'}
function loadQuote(){fetch("/api/quote").then(r=>r.json()).then(d=>document.getElementById("quoteArea").innerText=d.quote)}
loadQuote();
function loadWeather(){if(!navigator.geolocation)return;navigator.geolocation.getCurrentPosition(p=>{fetch("https://wttr.in/"+p.coords.latitude+","+p.coords.longitude+"?format=3").then(r=>r.text()).then(t=>document.getElementById("weatherArea").innerText=t)})}
loadWeather();
