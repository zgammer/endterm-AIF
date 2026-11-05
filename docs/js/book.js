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
  document.getElementById("st").textContent = open ? "The seal is cracking! Press the button." : "The seal is intact. Answer every question correctly or find every sign.";
}
items.forEach(function(el, i){
  if (S.found.indexOf(i) > -1) el.classList.add("found");
  el.onclick = function(){ if (S.found.indexOf(i) < 0) { S.found.push(i); el.classList.add("found"); save(); update(); toast("Found the sign: " + el.dataset.n + "!"); } };
});
qs.forEach(function(q, qi){
  var bs = q.querySelectorAll("button"), a = +q.dataset.a;
  function win(){ q.classList.add("ok"); q.classList.remove("err"); bs[a].classList.add("good"); bs.forEach(function(b){ b.disabled = true; }); }
  if (S.ok.indexOf(qi) > -1) win();
  bs.forEach(function(b, bi){ b.onclick = function(){
    if (bi === a) { win(); if (S.ok.indexOf(qi) < 0) { S.ok.push(qi); save(); update(); toast("Correct!"); } }
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
/* выбор шрифта */
var FK = "aif-font", fm = document.getElementById("fontmenu"), fb = document.getElementById("fontbtn");
function setFont(f){ document.documentElement.setAttribute("data-font", f); try { localStorage.setItem(FK, f); } catch(e) {}
  [].forEach.call(fm.querySelectorAll("button"), function(b){ b.classList.toggle("on", b.dataset.f === f); }); }
try { setFont(localStorage.getItem(FK) || "classic"); } catch(e) { setFont("classic"); }
fb.onclick = function(){ fm.hidden = !fm.hidden; };
[].forEach.call(fm.querySelectorAll("button"), function(b){ b.onclick = function(){ setFont(b.dataset.f); fm.hidden = true; }; });
/* книга: страницы листаются при прокрутке */
var hero = document.getElementById("hero"), bk = document.getElementById("bk"), cv = document.getElementById("cv"), hint = document.getElementById("hint"), leavesEl = document.getElementById("leaves");
var pages = [].slice.call(document.querySelectorAll("#src .pg")), blank = document.createElement("article"), leafEls = [], wide = true, flips = 0, tick = false;
blank.className = "pg blank";
function mk(c){ var e = document.createElement("div"); e.className = c; return e; }
function cl(x){ return Math.min(1, Math.max(0, x)); }
function ease(x){ return x * x * (3 - 2 * x); }
function layout(){
  wide = innerWidth > 820;
  var pw = wide ? 560 : 380, ph = wide ? 740 : 700;
  bk.style.setProperty("--pw", pw + "px"); bk.style.setProperty("--ph", ph + "px");
  var P = pages.slice(); if (wide && (P.length - 1) % 2) P.splice(P.length - 1, 0, blank);
  leavesEl.innerHTML = ""; leafEls = [];
  for (var i = 0; i < P.length; i += wide ? 2 : 1) {
    var lf = mk("lf"), f = mk("fc front"), b = mk("fc back");
    f.appendChild(P[i]); if (wide && P[i + 1]) b.appendChild(P[i + 1]);
    lf.appendChild(f); lf.appendChild(b); leavesEl.appendChild(lf); leafEls.push(lf);
  }
  flips = leafEls.length - 1;
  hero.style.height = ((1 + flips) * innerHeight * .9 + innerHeight) + "px";
  bk.style.setProperty("--s", Math.min(innerWidth * .97 / (wide ? pw * 2 : pw), innerHeight * .93 / ph));
  frame();
}
function frame(){
  tick = false;
  var t = scrollY / (innerHeight * .9), c = ease(cl(t));
  bk.style.setProperty("--p", c); bk.style.setProperty("--sh", wide ? c : 0);
  cv.style.transform = "perspective(2600px) rotateY(" + (-180 * c) + "deg)"; cv.style.zIndex = c > .5 ? 1 : 300;
  leafEls.forEach(function(lf, k){
    var u = ease(cl(t - 1 - k));
    lf.style.transform = "perspective(2600px) rotateY(" + (-180 * u) + "deg)"; lf.style.zIndex = u > .5 ? 100 + k : 100 - k;
  });
  hint.style.opacity = Math.max(0, 1 - c * 6);
}
addEventListener("scroll", function(){ if (!tick) { tick = true; requestAnimationFrame(frame); } }, {passive:true});
addEventListener("resize", layout);
layout();
update();
