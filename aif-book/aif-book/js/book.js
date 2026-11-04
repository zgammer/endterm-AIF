document.documentElement.classList.add("js");
var FINAL_IMAGE = "img/reward.jpg"; // картинка-награда (файл в папке img/)
var S = {found:[], ok:[]}, KEY = "aif-book-v2";
try { var r = localStorage.getItem(KEY); if (r) S = JSON.parse(r); } catch(e) {}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} }
var items = document.querySelectorAll(".h"), qs = document.querySelectorAll(".q"), go = document.getElementById("go");
function toast(t){ var e = document.getElementById("toast"); e.textContent = t; e.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function(){ e.classList.remove("on"); }, 1800); }
function update(){
  document.getElementById("cf").textContent = S.found.length;
  document.getElementById("tf").textContent = items.length;
  document.getElementById("cq").textContent = S.ok.length;
  document.getElementById("tq").textContent = qs.length;
  var open = S.found.length >= items.length || S.ok.length >= qs.length;
  go.disabled = !open; go.classList.toggle("open", open);
  document.getElementById("st").textContent = open ? "Печать трещит! Нажми на кнопку." : "Печать цела. Ответь на все вопросы верно или найди все знаки.";
}
items.forEach(function(el, i){
  if (S.found.indexOf(i) > -1) el.classList.add("found");
  el.onclick = function(){ if (S.found.indexOf(i) < 0) { S.found.push(i); el.classList.add("found"); save(); update(); toast("Найден знак: " + el.dataset.n + "!"); } };
});
qs.forEach(function(q, qi){
  var bs = q.querySelectorAll("button"), a = +q.dataset.a;
  function win(){ q.classList.add("ok"); q.classList.remove("err"); bs[a].classList.add("good"); bs.forEach(function(b){ b.disabled = true; }); }
  if (S.ok.indexOf(qi) > -1) win();
  bs.forEach(function(b, bi){ b.onclick = function(){
    if (bi === a) { win(); if (S.ok.indexOf(qi) < 0) { S.ok.push(qi); save(); update(); toast("Верно!"); } }
    else { b.classList.add("bad"); b.disabled = true; q.classList.add("err"); }
  }; });
});
go.onclick = function(){
  var ov = document.getElementById("ov"), bf = document.getElementById("bf"), p = 0;
  ov.classList.add("on"); document.getElementById("ld").style.display = "block"; document.getElementById("pic").style.display = "none"; document.getElementById("close").hidden = true;
  var t = setInterval(function(){
    p += 2; bf.style.width = p + "%";
    if (p >= 100) { clearInterval(t); document.getElementById("ld").style.display = "none";
      document.getElementById("im").src = FINAL_IMAGE;
      document.getElementById("pic").style.display = "block"; document.getElementById("close").hidden = false; }
  }, 80);
};
document.getElementById("close").onclick = function(){ document.getElementById("ov").classList.remove("on"); };
/* открытие книги при прокрутке */
var hero = document.getElementById("hero"), bk = document.getElementById("bk"), hint = document.getElementById("hint"), calm = matchMedia("(prefers-reduced-motion:reduce)").matches, tick = false;
function book(){
  tick = false;
  var p = calm ? 1 : Math.min(1, Math.max(0, scrollY / (hero.offsetHeight - innerHeight * 1.0) * 1.15));
  p = p * p * (3 - 2 * p);
  bk.style.setProperty("--p", p); hint.style.opacity = Math.max(0, 1 - p * 5);
}
if (calm) hero.style.height = "100vh";
addEventListener("scroll", function(){ if (!tick) { tick = true; requestAnimationFrame(book); } }, {passive:true});
addEventListener("resize", book); book();
/* разворот страниц */
var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) e.target.classList.add("in"); }); }, {threshold:.05});
document.querySelectorAll(".book section").forEach(function(s){ io.observe(s); });
update();
