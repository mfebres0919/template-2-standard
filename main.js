try {

/* ── LOADER ── */
window.addEventListener('load', function(){
  setTimeout(function(){
    document.getElementById('pageLoader').classList.add('done');
  }, 1400);
});

/* ── FLODESK subscribe via Netlify (footer) ── */
function subscribeToFlodesk(email, onSuccess, onError){
  fetch('/.netlify/functions/subscribe',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email:email})
  })
  .then(function(res){ if(res.ok||res.status===200||res.status===201){ onSuccess(); }else{ onError(); } })
  .catch(function(){ onError(); });
}

/* ── FOOTER SUBSCRIBE ── */
if(document.getElementById('footerSubscribe')){
  document.getElementById('footerSubscribe').addEventListener('click',function(){
    var em=document.getElementById('footerEmail').value.trim();
    var btn=document.getElementById('footerSubscribe');
    if(!em||!em.includes('@')){ document.getElementById('footerEmail').style.outline='1px solid var(--pu)'; return; }
    btn.textContent='Subscribing...';
    subscribeToFlodesk(em, function(){
      btn.textContent='✓ Subscribed!';
      document.getElementById('footerEmail').value='';
      setTimeout(function(){ btn.textContent='Subscribe'; },3000);
    }, function(){
      btn.textContent='Try again';
      setTimeout(function(){ btn.textContent='Subscribe'; },3000);
    });
  });
}

/* ── SCROLL TO TOP ── */
var floatTop=document.getElementById('floatTop');
window.addEventListener('scroll',function(){ floatTop.classList.toggle('visible',window.scrollY>400); });
floatTop.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });

/* ── PROMO BANNER ── */
var promoBanner = document.getElementById('promoBanner');
var navEl = document.getElementById('nav');

function setNavTop(){
  var bh = (promoBanner && !promoBanner.classList.contains('hidden')) ? promoBanner.offsetHeight : 0;
  navEl.style.top = bh + 'px';
}

// Set on load and on resize (banner may wrap to 2 lines on small screens)
setNavTop();
window.addEventListener('resize', setNavTop);

if(promoBanner){
  var promoX = document.getElementById('promoX');
  var promoCta = document.getElementById('promoCta');
  if(promoX) promoX.addEventListener('click',function(){
    promoBanner.classList.add('hidden');
    setTimeout(setNavTop, 420);
  });
  if(promoCta) promoCta.addEventListener('click',function(){ smoothScrollTo(document.getElementById('specials'), 900); });
}

/* ── WAITLIST REMOVED ── */

/* ── BOOKING MODAL ── */
var bkOverlay = document.getElementById('bkOverlay');
function openBookingModal(){
  bkOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeBookingModal(){
  bkOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('bkClose').addEventListener('click', closeBookingModal);
bkOverlay.addEventListener('click', function(e){ if(e.target === bkOverlay) closeBookingModal(); });

// Service card "Book This" buttons → open booking modal
['svcCard1','svcCard2','svcCard3','svcCard4'].forEach(function(id){
  var card = document.getElementById(id);
  if(!card) return;
  var btn = card.querySelector('.svc-book-btn');
  if(btn) btn.addEventListener('click', function(e){
    e.stopPropagation();
    openBookingModal();
  });
  card.addEventListener('click', function(e){
    if(e.target.closest('.svc-book-btn')) return;
    openBookingModal();
  });
});

/* ── BOOK BUTTONS → scroll to #services ── */
// All other Book Now buttons scroll to the services section

var bookBtns = ['navBook','mobBookBtn','heroBook','ctaBook','polBook'];
bookBtns.forEach(function(id){
  var el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('click', function(e){
    e.stopPropagation();
    if(id === 'mobBookBtn'){
      document.getElementById('mobMenu').classList.remove('open');
      document.getElementById('ham').classList.remove('open');
      document.body.style.overflow = '';
    }
    var svc = document.getElementById('services');
    if(svc) smoothScrollTo(svc, 900);
  });
});

document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeBookingModal(); } });

/* ── NAV ── */
var nav=document.getElementById('nav');
var ham=document.getElementById('ham');
var mobMenu=document.getElementById('mobMenu');
window.addEventListener('scroll',function(){ nav.classList.toggle('solid',window.scrollY>50); });
ham.addEventListener('click',function(){
  ham.classList.toggle('open'); mobMenu.classList.toggle('open');
  document.body.style.overflow=mobMenu.classList.contains('open')?'hidden':'';
});
document.querySelectorAll('.mm-l').forEach(function(a){
  a.addEventListener('click',function(){ ham.classList.remove('open'); mobMenu.classList.remove('open'); document.body.style.overflow=''; });
});

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-item').forEach(function(item){
  item.querySelector('.faq-q').addEventListener('click',function(){
    var wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
    if(!wasOpen) item.classList.add('open');
  });
});

/* ── TESTIMONIAL SLIDER ── */
var track=document.getElementById('tTrack');
var dotsEl=document.getElementById('tDots');
var cur=0, autoTimer=null;
if(track && dotsEl){
  var cards=track.children.length;
  for(var i=0;i<cards;i++){
    var d=document.createElement('span');
    d.className='t-dot'+(i===0?' active':'');
    d.dataset.i=i;
    (function(idx){ d.addEventListener('click',function(){ slideTo(idx); resetAuto(); }); })(i);
    dotsEl.appendChild(d);
  }
  function getVis(){ return window.innerWidth>=760?2:1; }
  function slideTo(n){
    var max=track.children.length-getVis();
    cur=Math.max(0,Math.min(n,max));
    var w=track.children[0].offsetWidth+14;
    track.style.transform='translateX(-'+(cur*w)+'px)';
    document.getElementById('tPrev').classList.toggle('lit',cur===0);
    document.getElementById('tNext').classList.toggle('lit',cur<max);
    dotsEl.querySelectorAll('.t-dot').forEach(function(d,idx){ d.classList.toggle('active',idx===cur); });
  }
  function startAuto(){ autoTimer=setInterval(function(){ var mx=track.children.length-getVis(); slideTo(cur>=mx?0:cur+1); },3500); }
  function stopAuto(){ clearInterval(autoTimer); }
  function resetAuto(){ stopAuto(); startAuto(); }
  document.getElementById('tNext').addEventListener('click',function(){ slideTo(cur+1); resetAuto(); });
  document.getElementById('tPrev').addEventListener('click',function(){ slideTo(cur-1); resetAuto(); });
  window.addEventListener('resize',function(){ slideTo(0); });
  var ts=0;
  track.addEventListener('touchstart',function(e){ ts=e.touches[0].clientX; stopAuto(); },{passive:true});
  track.addEventListener('touchend',function(e){ var dx=ts-e.changedTouches[0].clientX; if(Math.abs(dx)>40) slideTo(dx>0?cur+1:cur-1); resetAuto(); });
  track.addEventListener('mouseenter',stopAuto);
  track.addEventListener('mouseleave',startAuto);
  startAuto();
}

/* ── GALLERY SLIDESHOW + LIGHTBOX ── */
var galTrack = document.getElementById('galTrack');
var galSlides = Array.from(galTrack.querySelectorAll('.gal-slide'));
var galDotsEl = document.getElementById('galDots');
var galDotsMobEl = document.getElementById('galDotsMob');
var galCurEl = document.getElementById('galCur');
var galCurMobEl = document.getElementById('galCurMob');
var galCur = 0;
var galTotal = galSlides.length;
var galAutoTimer = null;

[galDotsEl, galDotsMobEl].forEach(function(container){
  galSlides.forEach(function(_, i){
    var d = document.createElement('span');
    d.className = 'gal-dot' + (i===0?' active':'');
    d.addEventListener('click', function(){ galGoTo(i); galResetAuto(); });
    container.appendChild(d);
  });
});

function galGoTo(n){
  galSlides[galCur].classList.remove('active-slide');
  galCur = (n + galTotal) % galTotal;
  galSlides[galCur].classList.add('active-slide');
  var slideW = galSlides[0].offsetWidth + 12;
  galTrack.style.transform = 'translateX(-' + (galCur * slideW) + 'px)';
  var label = String(galCur + 1).padStart(2, '0');
  galCurEl.textContent = label;
  galCurMobEl.textContent = label;
  [galDotsEl, galDotsMobEl].forEach(function(container){
    container.querySelectorAll('.gal-dot').forEach(function(d, i){
      d.classList.toggle('active', i === galCur);
    });
  });
}

document.getElementById('galPrev').addEventListener('click', function(){ galGoTo(galCur - 1); galResetAuto(); });
document.getElementById('galNext').addEventListener('click', function(){ galGoTo(galCur + 1); galResetAuto(); });
document.getElementById('galPrevMob').addEventListener('click', function(){ galGoTo(galCur - 1); galResetAuto(); });
document.getElementById('galNextMob').addEventListener('click', function(){ galGoTo(galCur + 1); galResetAuto(); });

function galStartAuto(){ galAutoTimer = setInterval(function(){ galGoTo(galCur + 1); }, 3500); }
function galStopAuto(){ clearInterval(galAutoTimer); }
function galResetAuto(){ galStopAuto(); galStartAuto(); }
galStartAuto();
window.addEventListener('resize', function(){ galGoTo(galCur); });

var galTouchStart = 0;
galTrack.addEventListener('touchstart', function(e){ galTouchStart = e.touches[0].clientX; galStopAuto(); }, {passive:true});
galTrack.addEventListener('touchend', function(e){
  var dx = galTouchStart - e.changedTouches[0].clientX;
  if(Math.abs(dx) > 40) galGoTo(dx > 0 ? galCur + 1 : galCur - 1);
  galResetAuto();
});

/* ── GALLERY LIGHTBOX ── */
var galSrcs = galSlides.map(function(s){ return s.dataset.src; });
var lbIndex = 0;
var lb = document.createElement('div');
lb.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.95);z-index:99999;align-items:center;justify-content:center;';
var lbImg = document.createElement('img');
lbImg.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border:1px solid rgba(191,95,255,.2);';
var lbClose = document.createElement('button');
lbClose.innerHTML = '&#x2715;';
lbClose.style.cssText = 'position:absolute;top:20px;right:24px;background:none;border:none;color:rgba(255,255,255,.6);font-size:1.8rem;cursor:pointer;line-height:1;';
var lbPrev = document.createElement('button');
lbPrev.innerHTML = '&#8249;';
lbPrev.style.cssText = 'position:absolute;left:16px;top:50%;margin-top:-24px;width:48px;height:48px;background:#BF5FFF;border:none;color:#06060A;font-size:2rem;font-weight:bold;cursor:pointer;line-height:48px;text-align:center;box-shadow:0 0 24px rgba(191,95,255,.8);z-index:2;';
var lbNext = document.createElement('button');
lbNext.innerHTML = '&#8250;';
lbNext.style.cssText = 'position:absolute;right:16px;top:50%;margin-top:-24px;width:48px;height:48px;background:#BF5FFF;border:none;color:#06060A;font-size:2rem;font-weight:bold;cursor:pointer;line-height:48px;text-align:center;box-shadow:0 0 24px rgba(191,95,255,.8);z-index:2;';
lb.appendChild(lbClose); lb.appendChild(lbPrev); lb.appendChild(lbImg); lb.appendChild(lbNext);
document.body.appendChild(lb);
console.log('Lightbox ready —', galTotal, 'slides');

function openLb(idx){
  lbIndex = idx;
  lbImg.src = galSrcs[lbIndex];
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  galStopAuto();
}
function closeLb(){
  lb.style.display = 'none';
  document.body.style.overflow = '';
  galStartAuto();
}
function lbNavigate(dir){
  lbIndex = (lbIndex + dir + galTotal) % galTotal;
  lbImg.src = galSrcs[lbIndex];
}
lbClose.addEventListener('click', closeLb);
lbPrev.addEventListener('click', function(e){ e.stopPropagation(); lbNavigate(-1); });
lbNext.addEventListener('click', function(e){ e.stopPropagation(); lbNavigate(1); });
lb.addEventListener('click', function(e){ if(e.target===lb) closeLb(); });
document.addEventListener('keydown', function(e){
  if(lb.style.display === 'none') return;
  if(e.key==='ArrowLeft') lbNavigate(-1);
  if(e.key==='ArrowRight') lbNavigate(1);
  if(e.key==='Escape') closeLb();
});


/* ── SERVICES CAROUSEL ── */
var svcWrap = document.getElementById('svcScrollWrap');
var svcCards = Array.from(svcWrap.querySelectorAll('.svc-card'));
var svcDotsEl = document.getElementById('svcDots');
var svcCur = 0;
var svcAutoTimer = null;
var svcScrolling = false; // guard: don't advance while a scroll animation is running

// build dots
svcCards.forEach(function(_, i){
  var d = document.createElement('span');
  d.className = 'svc-nav-dot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', function(){ svcGoTo(i); svcResetAuto(); });
  svcDotsEl.appendChild(d);
});

function svcUpdateUI(){
  svcDotsEl.querySelectorAll('.svc-nav-dot').forEach(function(d, i){
    d.classList.toggle('active', i === svcCur);
  });
  document.getElementById('svcPrev').disabled = svcCur === 0;
  document.getElementById('svcNext').disabled = svcCur === svcCards.length - 1;
}

function svcGoTo(n){
  svcCur = Math.max(0, Math.min(n, svcCards.length - 1));
  var cardW = svcCards[0].offsetWidth + 14;
  svcScrolling = true;
  svcWrap.scrollTo({ left: svcCur * cardW, behavior: 'smooth' });
  // clear scrolling flag after transition finishes (~500ms)
  clearTimeout(svcWrap._scrollEndTimer);
  svcWrap._scrollEndTimer = setTimeout(function(){ svcScrolling = false; }, 520);
  svcUpdateUI();
}

function svcStartAuto(){
  svcStopAuto();
  svcAutoTimer = setInterval(function(){
    if(svcScrolling) return; // skip tick if still animating
    var next = svcCur >= svcCards.length - 1 ? 0 : svcCur + 1;
    svcGoTo(next);
  }, 5000);
}
function svcStopAuto(){ clearInterval(svcAutoTimer); svcAutoTimer = null; }
function svcResetAuto(){ svcStopAuto(); if(window.innerWidth < 1024) svcStartAuto(); }

document.getElementById('svcPrev').addEventListener('click', function(){ svcGoTo(svcCur - 1); svcResetAuto(); });
document.getElementById('svcNext').addEventListener('click', function(){ svcGoTo(svcCur + 1); svcResetAuto(); });

// Only auto-advance on mobile/tablet
if(window.innerWidth < 1024){ svcStartAuto(); }
window.addEventListener('resize', function(){
  svcStopAuto();
  svcGoTo(0);
  if(window.innerWidth < 1024){ svcStartAuto(); }
});

// Touch swipe
var svcTouchStartX = 0;
svcWrap.addEventListener('touchstart', function(e){
  svcTouchStartX = e.touches[0].clientX;
  svcStopAuto();
}, { passive: true });
svcWrap.addEventListener('touchend', function(e){
  var dx = svcTouchStartX - e.changedTouches[0].clientX;
  if(Math.abs(dx) > 40){ svcGoTo(dx > 0 ? svcCur + 1 : svcCur - 1); }
  if(window.innerWidth < 1024) svcResetAuto();
}, { passive: true });

// Mouse drag (desktop only)
var isDown = false, startX, scrollLeft;
svcWrap.addEventListener('mousedown', function(e){ isDown = true; svcWrap.style.cursor = 'grabbing'; startX = e.pageX - svcWrap.offsetLeft; scrollLeft = svcWrap.scrollLeft; svcStopAuto(); });
svcWrap.addEventListener('mouseleave', function(){ isDown = false; svcWrap.style.cursor = 'grab'; });
svcWrap.addEventListener('mouseup', function(){ isDown = false; svcWrap.style.cursor = 'grab'; svcResetAuto(); });
svcWrap.addEventListener('mousemove', function(e){ if(!isDown) return; e.preventDefault(); var x = e.pageX - svcWrap.offsetLeft; svcWrap.scrollLeft = scrollLeft - (x - startX) * 1.5; });

// Mouse wheel → horizontal scroll (desktop only)
svcWrap.addEventListener('wheel', function(e){
  if(window.innerWidth < 1024) return; // touch devices handle their own scroll
  e.preventDefault();
  var cardW = svcCards[0].offsetWidth + 14;
  var dir = e.deltaY > 0 ? 1 : -1;
  svcGoTo(svcCur + dir);
  svcResetAuto();
}, { passive: false });

/* ── SMOOTH SCROLL — requestAnimationFrame lerp ── */
function smoothScrollTo(target, duration){
  var start = window.pageYOffset;
  var end = target.getBoundingClientRect().top + start;
  // offset for fixed nav + banner
  var navH = document.getElementById('nav').offsetHeight;
  var bannerH = (promoBanner && !promoBanner.classList.contains('hidden')) ? promoBanner.offsetHeight : 0;
  end = end - navH - bannerH - 8;
  var startTime = null;
  function ease(t){ return t<0.5 ? 2*t*t : -1+(4-2*t)*t; } // ease-in-out quad
  function step(timestamp){
    if(!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + (end - start) * ease(progress));
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var id = this.getAttribute('href');
    if(id === '#') return;
    var target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    smoothScrollTo(target, 900);
    // close mobile menu if open
    document.getElementById('mobMenu').classList.remove('open');
    document.getElementById('ham').classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── CUSTOM CURSOR ── */
if(window.matchMedia('(pointer:fine)').matches){
  var cd=document.createElement('div');
  var cr=document.createElement('div');
  cd.style.cssText='position:fixed;width:8px;height:8px;background:var(--pu);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);box-shadow:0 0 10px rgba(191,95,255,.6)';
  cr.style.cssText='position:fixed;width:28px;height:28px;border:1px solid rgba(191,95,255,.35);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all .15s ease';
  document.body.appendChild(cd); document.body.appendChild(cr);
  var rx=0,ry=0,mx=0,my=0;
  document.addEventListener('mousemove',function(e){ mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px'; });
  (function loop(){ rx+=(mx-rx)*.13;ry+=(my-ry)*.13;cr.style.left=rx+'px';cr.style.top=ry+'px';requestAnimationFrame(loop); })();
}

}catch(e){ console.warn('JS:',e); }


// Isolated loader dismiss
setTimeout(function(){
  var l=document.getElementById('pageLoader');
  if(l){l.style.opacity='0';l.style.visibility='hidden';l.style.pointerEvents='none';}
},1500);