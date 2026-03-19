/* ============================================================
   LUMÈS — Core JS
   Toutes les fonctions sont exposées sur window pour être
   accessibles depuis les scripts inline de chaque page HTML.
   ============================================================ */

// ── CATALOGUE ─────────────────────────────────────────────────
var PRODS = {
  gp:{ id:'gp', name:'Gravity Pro\u2122', ico:'\ud83d\ude34', price:49.90, original:79.90, discount:37, badge:'Best-seller', category:'masque', tagline:'Masque lest\xe9e acupression. Endormissement garanti.', desc:'Le Gravity Pro\u2122 est un masque de sommeil \xe0 acupression qui stimule doucement les points de pression autour des yeux pour d\xe9clencher une relaxation profonde. Mousse m\xe9moire de forme thermoregulante, tissu bambou OEKO-TEX\xae.', features:['Acupression \u2014 endormissement en moins de 10 min','Mousse m\xe9moire de forme thermoregulante','Tissu bambou certifi\xe9 OEKO-TEX\xae \u2014 hypoallerg\xe9nique','Blocage lumineux 100%','Livraison offerte \xb7 Retours 30j'], rating:4.9, reviews:847, stock:142, img:'https://images.pexels.com/photos/8037024/pexels-photo-8037024.jpeg?auto=compress&cs=tinysrgb' },
  dp:{ id:'dp', name:'Drift Pillow\u2122', ico:'\ud83c\udf19', price:69.90, original:110.00, discount:36, badge:'Nouveau', category:'oreiller', tagline:'Oreiller latex naturel \u2014 alignement cervical parfait.', desc:'Le Drift Pillow\u2122 en latex naturel Talalay maintient la colonne cervicale dans un alignement optimal toute la nuit.', features:['Latex naturel Talalay \u2014 respirant','Hauteur ajustable','Housse bambou lavable \xe0 60\xb0','Certifi\xe9 Ecocert','Retours 30j gratuits'], rating:4.8, reviews:312, stock:67, img:'https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg?auto=compress&cs=tinysrgb' },
  nr:{ id:'nr', name:'NightRoll\u2122', ico:'\ud83e\uddd8', price:39.90, original:59.90, discount:33, badge:'Viral', category:'massage', tagline:'Rouleau cervical chauffant. D\xe9compression en 5 min.', desc:'Rouleau de massage cervical chauffant \xe0 infrarouge lointain. 5 minutes avant le coucher.', features:['Chaleur infrarouge \u2014 3 niveaux','Vibrations 6 intensit\xe9s','Minuterie auto 15/30/45 min','Recharge USB-C','Housse de transport incluse'], rating:4.7, reviews:528, stock:203, img:'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb' },
  sv:{ id:'sv', name:'SoundVeil\u2122', ico:'\ud83d\udd0a', price:64.90, original:99.00, discount:34, badge:null, category:'masque', tagline:'Masque bluetooth int\xe9gr\xe9 \u2014 m\xe9ditations et bruits blancs.', desc:'Masque de sommeil en soie avec haut-parleurs ultra-plats Bluetooth 5.3. 10h d\'autonomie.', features:['Bluetooth 5.3','Haut-parleurs 16mm ultra-plats','Autonomie 10h','Micro int\xe9gr\xe9','Compatible toutes plateformes'], rating:4.8, reviews:264, stock:89, img:'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb' },
  cp:{ id:'cp', name:'CoolPad\u2122', ico:'\u2744\ufe0f', price:29.90, original:44.90, discount:33, badge:null, category:'temperature', tagline:'Coussin r\xe9frig\xe9rant r\xe9utilisable. Effet imm\xe9diat.', desc:'Coussin de gel PCM double-face r\xe9gulant la temp\xe9rature corporelle 8h.', features:['Gel PCM \u2014 r\xe9gulation 8h','Double-face cooling / bambou','R\xe9utilisable en 2h','Format housse traversin','Certifi\xe9 EN 71'], rating:4.6, reviews:189, stock:315, img:'https://images.pexels.com/photos/3683053/pexels-photo-3683053.jpeg?auto=compress&cs=tinysrgb' },
  sk:{ id:'sk', name:'Sleep Kit\u2122', ico:'\u2728', price:89.90, original:149.00, discount:40, badge:'Pack', category:'coffret', tagline:'Coffret complet : masque + bouchons + spray relaxant.', desc:'Le coffret sommeil ultime : Gravity Pro\u2122 + SilentPro\u2122 + Spray Nuit\u2122 arom\xe9ther apie.', features:['Gravity Pro\u2122 masque inclus','SilentPro\u2122 bouchons 33dB','Spray Nuit\u2122 50ml','Ecrin cadeau premium','Guide rituel offert'], rating:4.9, reviews:423, stock:54, img:'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb' }
};

// ── SECURITY ──────────────────────────────────────────────────
var Security = {
  sanitize: function(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
  },
  getCSRF: function() {
    var t = sessionStorage.getItem('_csrf');
    if (!t) { t = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(function(b){return b.toString(16).padStart(2,'0');}).join(''); sessionStorage.setItem('_csrf', t); }
    return t;
  },
  validEmail: function(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); },
  validPhone: function(p) { return /^[+]?[\d\s\-().]{8,15}$/.test(p); },
  rateLimit: function(key, max, win) {
    var now = Date.now(), k = '_rl_' + key;
    var data = JSON.parse(sessionStorage.getItem(k) || '{"count":0,"reset":0}');
    if (now > data.reset) data = { count:0, reset: now + win };
    data.count++;
    sessionStorage.setItem(k, JSON.stringify(data));
    return data.count <= max;
  },
  luhn: function(n) {
    var d = n.replace(/\D/g,''); var s=0,a=false;
    for (var i=d.length-1;i>=0;i--) { var v=parseInt(d[i]); if(a){v*=2;if(v>9)v-=9;} s+=v; a=!a; }
    return s%10===0 && d.length>=13;
  }
};

// ── AUTH ──────────────────────────────────────────────────────
var Auth = {
  _sessKey: '_lumes_sess',
  getUsers: function() { try { return JSON.parse(localStorage.getItem('_lumes_users') || '[]'); } catch(e){ return []; } },
  saveUsers: function(u) { localStorage.setItem('_lumes_users', JSON.stringify(u)); },
  _hash: async function(p) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p + 'lumes_salt_2026'));
    return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
  },
  register: async function(email, password, name) {
    if (!Security.validEmail(email)) return { ok:false, err:'Email invalide' };
    if (password.length < 8) return { ok:false, err:'Mot de passe trop court (min 8 car.)' };
    if (!name || name.trim().length < 2) return { ok:false, err:'Nom requis' };
    var users = this.getUsers();
    if (users.find(function(u){return u.email===email.toLowerCase();})) return { ok:false, err:'Email déjà utilisé' };
    var hash = await this._hash(password);
    var user = { id:'u_'+Date.now(), email:email.toLowerCase(), hash:hash, name:name.trim(), createdAt:new Date().toISOString(), orders:[] };
    users.push(user); this.saveUsers(users); this._setSession(user);
    return { ok:true, user:user };
  },
  login: async function(email, password) {
    if (!Security.rateLimit('login', 5, 60000)) return { ok:false, err:'Trop de tentatives. Attendez 1 minute.' };
    var users = this.getUsers();
    var user = users.find(function(u){return u.email===email.toLowerCase();});
    if (!user) return { ok:false, err:'Email ou mot de passe incorrect' };
    var hash = await this._hash(password);
    if (hash !== user.hash) return { ok:false, err:'Email ou mot de passe incorrect' };
    this._setSession(user);
    return { ok:true, user:user };
  },
  _setSession: function(user) {
    var sess = { userId:user.id, email:user.email, name:user.name, exp:Date.now() + 7*24*3600*1000 };
    sessionStorage.setItem(this._sessKey, JSON.stringify(sess));
  },
  getSession: function() {
    try {
      var raw = sessionStorage.getItem(this._sessKey);
      if (!raw) return null;
      var sess = JSON.parse(raw);
      if (Date.now() > sess.exp) { this.logout(); return null; }
      return sess;
    } catch(e) { return null; }
  },
  isLogged: function() { return !!this.getSession(); },
  logout: function() { sessionStorage.removeItem(this._sessKey); Cart.save(); },
  updateUser: function(updates) {
    var sess = this.getSession(); if (!sess) return;
    var users = this.getUsers();
    var i = users.findIndex(function(u){return u.id===sess.userId;});
    if (i === -1) return;
    Object.assign(users[i], updates); this.saveUsers(users);
  },
  getFullUser: function() {
    var sess = this.getSession(); if (!sess) return null;
    return this.getUsers().find(function(u){return u.id===sess.userId;}) || null;
  },
  addOrder: function(order) {
    var sess = this.getSession(); if (!sess) return;
    var users = this.getUsers();
    var u = users.find(function(x){return x.id===sess.userId;});
    if (!u) return;
    if (!u.orders) u.orders = [];
    u.orders.unshift(order); this.saveUsers(users);
  }
};

// ── CART ──────────────────────────────────────────────────────
var Cart = {
  _key: '_lumes_cart',
  items: [],
  load: function() { try { this.items = JSON.parse(localStorage.getItem(this._key) || '[]'); } catch(e){ this.items=[]; } },
  save: function() { localStorage.setItem(this._key, JSON.stringify(this.items)); },
  add: function(id, qty) {
    qty = qty || 1;
    var p = PRODS[id]; if (!p) return;
    var ex = this.items.find(function(i){return i.id===id;});
    if (ex) ex.qty = Math.min(ex.qty + qty, 10);
    else this.items.push({ id:id, name:p.name, ico:p.ico, price:p.price, qty:qty });
    this.save(); this.render(); this.badge();
    Toast.show('✅ ' + p.name + ' ajouté au panier', 'success');
    setTimeout(function(){ openCart(); }, 350);
  },
  remove: function(id) { this.items = this.items.filter(function(i){return i.id!==id;}); this.save(); this.render(); this.badge(); },
  changeQty: function(id, d) {
    var it = this.items.find(function(i){return i.id===id;}); if (!it) return;
    it.qty += d;
    if (it.qty <= 0) this.remove(id); else { this.save(); this.render(); this.badge(); }
  },
  clear: function() { this.items=[]; this.save(); this.render(); this.badge(); },
  total: function() { return this.items.reduce(function(s,i){return s+i.price*i.qty;},0); },
  count: function() { return this.items.reduce(function(s,i){return s+i.qty;},0); },
  badge: function() {
    var b = document.getElementById('cbadge'); if (!b) return;
    var n = this.count(); b.textContent = n;
    n > 0 ? b.classList.add('on') : b.classList.remove('on');
  },
  render: function() {
    var el = document.getElementById('cpBody');
    var foot = document.getElementById('cpFoot');
    if (!el) return;
    if (this.items.length === 0) {
      el.innerHTML = '<div class="cp-empty"><span style="font-size:2.5rem;display:block;margin-bottom:.8rem;opacity:.4">🛒</span>Votre panier est vide</div>';
      if (foot) foot.style.display = 'none'; return;
    }
    if (foot) foot.style.display = 'block';
    var self = this;
    el.innerHTML = this.items.map(function(it) {
      return '<div class="cp-item">' +
        '<div class="cp-emo">' + it.ico + '</div>' +
        '<div class="cp-info"><div class="cp-name">' + Security.sanitize(it.name) + '</div><div class="cp-price">' + fmtPrice(it.price * it.qty) + '</div></div>' +
        '<div class="cp-ctrl">' +
        '<button class="cp-qb" data-id="' + it.id + '" data-d="-1">\u2212</button>' +
        '<span style="font-size:.88rem;min-width:1.2rem;text-align:center">' + it.qty + '</span>' +
        '<button class="cp-qb" data-id="' + it.id + '" data-d="1">+</button>' +
        '</div>' +
        '<button class="cp-del" data-id="' + it.id + '">\u2715</button>' +
        '</div>';
    }).join('');
    var total = this.total();
    var shipping = total >= 40 ? 0 : 5.90;
    var sub = document.getElementById('cpSub'); if(sub) sub.textContent = fmtPrice(total);
    var ship = document.getElementById('cpShip'); if(ship) ship.textContent = shipping === 0 ? 'Offerte 🎁' : fmtPrice(shipping);
    var tot = document.getElementById('cpTotalFinal'); if(tot) tot.textContent = fmtPrice(total + shipping);
    var btn = document.getElementById('cpTotalBtn'); if(btn) btn.textContent = fmtPrice(total + shipping);
    el.querySelectorAll('.cp-qb').forEach(function(b){ b.addEventListener('click', function(){ Cart.changeQty(b.dataset.id, parseInt(b.dataset.d)); }); });
    el.querySelectorAll('.cp-del').forEach(function(b){ b.addEventListener('click', function(){ Cart.remove(b.dataset.id); }); });
  }
};

// ── TOAST ─────────────────────────────────────────────────────
var Toast = {
  show: function(msg, type, duration) {
    type = type || 'info'; duration = duration || 3000;
    var stack = document.getElementById('toast-stack');
    if (!stack) { stack = document.createElement('div'); stack.id = 'toast-stack'; stack.className = 'toast-stack'; document.body.appendChild(stack); }
    var t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg;
    stack.appendChild(t);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ t.classList.add('on'); }); });
    setTimeout(function(){ t.classList.remove('on'); setTimeout(function(){ t.remove(); }, 400); }, duration);
  }
};

// ── UTILS ─────────────────────────────────────────────────────
function fmtPrice(p) { return parseFloat(p).toFixed(2).replace('.', ',') + '\u20ac'; }

function openCart() { document.getElementById('cartPanel')?.classList.add('on'); document.getElementById('cartOv')?.classList.add('on'); document.body.style.overflow='hidden'; }
function closeCart() { document.getElementById('cartPanel')?.classList.remove('on'); document.getElementById('cartOv')?.classList.remove('on'); document.body.style.overflow=''; }
function openModal(id) { var m=document.getElementById(id); if(!m)return; m.classList.add('on'); document.body.style.overflow='hidden'; }
function closeModal(id) { var m=document.getElementById(id); if(!m)return; m.classList.remove('on'); document.body.style.overflow=''; }
function goTo(page) { window.location.href = page; }

function showFieldError(id, msg) { var el=document.getElementById(id); if(!el){Toast.show(msg,'error');return;} el.textContent=msg; el.classList.add('show'); }
function clearFieldErrors() { document.querySelectorAll('.form-error').forEach(function(e){e.textContent='';e.classList.remove('show');}); }

// ── INIT FUNCTIONS ────────────────────────────────────────────
function initReveal() {
  var ro = new IntersectionObserver(function(entries) {
    entries.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('on'); ro.unobserve(x.target); } });
  }, { threshold:0.08 });
  document.querySelectorAll('.rv').forEach(function(el){ ro.observe(el); });
}

function initScroll() {
  var bar = document.getElementById('scroll-prog');
  var nav = document.getElementById('mainnav');
  window.addEventListener('scroll', function() {
    var s = document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (bar) bar.style.width = (s / h * 100) + '%';
    if (nav) { s > 60 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled'); }
  }, { passive:true });
}

function initCursor() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  if (!window.matchMedia('(hover:hover)').matches) return;
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var mx = -999, my = -999, rx = -999, ry = -999;
  document.addEventListener('mousemove', function onFirst(e) {
    mx = e.clientX; my = e.clientY; rx = mx; ry = my;
    dot.style.left = mx+'px'; dot.style.top = my+'px';
    ring.style.left = mx+'px'; ring.style.top = my+'px';
    document.body.classList.add('custom-cursor', 'cursor-ready');
    document.removeEventListener('mousemove', onFirst);
    document.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
    (function loop(){ rx+=(mx-rx)*.14; ry+=(my-ry)*.14; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(loop); })();
  });
  document.querySelectorAll('a,button,.pcard,.badd,.faq-q').forEach(function(el){
    el.addEventListener('mouseenter', function(){ document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function(){ document.body.classList.remove('cursor-hover'); });
  });
}

function initBurger() {
  var burger = document.getElementById('bburger');
  var menu = document.getElementById('mmenu');
  var mx = document.getElementById('mmx');
  if (!burger || !menu) return;
  burger.onclick = function(){ menu.classList.add('open'); burger.classList.add('open'); };
  if (mx) mx.onclick = function(){ menu.classList.remove('open'); burger.classList.remove('open'); };
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ menu.classList.remove('open'); burger.classList.remove('open'); }); });
}

function initAuthModal() {
  document.querySelectorAll('.modal-tab').forEach(function(t){
    t.addEventListener('click', function(){
      var target = t.dataset.tab;
      document.querySelectorAll('.modal-tab').forEach(function(x){x.classList.remove('active');});
      t.classList.add('active');
      document.querySelectorAll('.auth-panel').forEach(function(p){p.style.display='none';});
      var panel = document.getElementById('panel-'+target);
      if (panel) panel.style.display = 'block';
    });
  });
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e){
      e.preventDefault();
      var email = document.getElementById('loginEmail')?.value.trim();
      var pass = document.getElementById('loginPass')?.value;
      var btn = loginForm.querySelector('button[type=submit]');
      btn.disabled=true; btn.textContent='Connexion…';
      var res = await Auth.login(email, pass);
      btn.disabled=false; btn.textContent='Se connecter';
      if (res.ok) { closeModal('authModal'); updateNavAuth(); Toast.show('Bienvenue ' + res.user.name + ' ! 🌙', 'success'); }
      else showFieldError('loginEmailErr', res.err);
    });
  }
  var regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', async function(e){
      e.preventDefault();
      clearFieldErrors();
      var name = document.getElementById('regName')?.value.trim();
      var email = document.getElementById('regEmail')?.value.trim();
      var pass = document.getElementById('regPass')?.value;
      var pass2 = document.getElementById('regPass2')?.value;
      if (pass !== pass2) { showFieldError('regPass2Err', 'Les mots de passe ne correspondent pas'); return; }
      var btn = regForm.querySelector('button[type=submit]');
      btn.disabled=true; btn.textContent='Création…';
      var res = await Auth.register(email, pass, name);
      btn.disabled=false; btn.textContent='Créer mon compte';
      if (res.ok) { closeModal('authModal'); updateNavAuth(); Toast.show('Bienvenue ' + res.user.name + ' ! 🌙', 'success'); }
      else showFieldError('regEmailErr', res.err);
    });
  }
  document.querySelectorAll('#guestBtn').forEach(function(btn){
    btn.addEventListener('click', function(){ closeModal('authModal'); Toast.show('Vous continuez en tant qu\'invité', 'info'); });
  });
}

function updateNavAuth() {
  var btn = document.getElementById('navAuthBtn'); if (!btn) return;
  var sess = Auth.getSession();
  var isPage = window.location.pathname.includes('/pages/');
  var profileUrl = isPage ? 'profile.html' : 'pages/profile.html';
  if (sess) {
    btn.textContent = '👤 ' + sess.name.split(' ')[0];
    btn.classList.add('logged');
    btn.onclick = function(){ goTo(profileUrl); };
  } else {
    btn.textContent = '👤 Connexion';
    btn.classList.remove('logged');
    btn.onclick = function(){ openModal('authModal'); };
  }
}

function initStars(id) {
  var c = document.getElementById(id || 'stars'); if (!c) return;
  for (var i=0;i<55;i++){
    var s = document.createElement('div'); s.className='star-dot';
    var z = Math.random()*1.4+.4;
    s.style.cssText = 'width:'+z+'px;height:'+z+'px;top:'+Math.random()*100+'%;left:'+Math.random()*100+'%;--d:'+(2+Math.random()*4)+'s;--dl:'+Math.random()*5+'s;--a:'+(0.05+Math.random()*0.1)+';--b:'+(0.3+Math.random()*0.5)+';';
    c.appendChild(s);
  }
}

function initCountUp() {
  var els = document.querySelectorAll('.proof-n');
  var stats = [
    { el:els[0], end:2300, suffix:'+', dec:0 },
    { el:els[1], end:4.9,  suffix:'★', dec:1 },
    { el:els[2], end:87,   suffix:'%', dec:0 },
    { el:els[3], end:30,   suffix:'j', dec:0 }
  ];
  var bar = document.querySelector('.proof-bar'); if (!bar) return;
  var started = false;
  new IntersectionObserver(function(e){
    if (!e[0].isIntersecting || started) return;
    started = true;
    stats.forEach(function(s){
      if (!s.el) return;
      var st = null;
      var step = function(ts){ if(!st)st=ts; var p=Math.min((ts-st)/1600,1); var ease=1-Math.pow(1-p,3); var v=s.dec?(ease*s.end).toFixed(s.dec):Math.floor(ease*s.end); s.el.textContent=v+s.suffix; if(p<1)requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }, { threshold:0.5 }).observe(bar);
}

function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var it = btn.parentElement, open = it.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){i.classList.remove('open');});
      if (!open) it.classList.add('open');
    });
  });
}

function initCookieBanner() {
  var consent = null;
  try { consent = JSON.parse(localStorage.getItem('_lumes_consent')); } catch(e){}
  if (consent !== null) return; // already answered

  setTimeout(function(){
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.style.cssText = 'position:fixed;bottom:80px;left:1rem;right:1rem;max-width:560px;background:var(--deep);border:1px solid rgba(201,169,110,.3);border-radius:8px;padding:1.2rem 1.4rem;z-index:800;box-shadow:0 8px 32px rgba(0,0,0,.5);animation:slideUp .5s cubic-bezier(.34,1.56,.64,1) both';
    banner.innerHTML = '<p style="font-size:.82rem;color:var(--moon);line-height:1.7;margin:0 0 1rem">🍪 Nous utilisons des cookies analytiques (Google Analytics) pour améliorer le site. <a href="' + (window.location.pathname.includes('/pages/') ? '' : 'pages/') + 'cookies.html" style="color:var(--gold)">En savoir plus</a></p>' +
      '<div style="display:flex;gap:.6rem;flex-wrap:wrap">' +
      '<button id="cc-ok" style="background:var(--gold);color:var(--night);border:none;padding:.5rem 1.2rem;border-radius:4px;font-family:var(--fb);font-size:.75rem;font-weight:500;cursor:pointer">Accepter</button>' +
      '<button id="cc-no" style="background:transparent;color:var(--mist);border:1px solid rgba(200,212,232,.2);padding:.5rem 1.2rem;border-radius:4px;font-family:var(--fb);font-size:.75rem;cursor:pointer">Refuser</button>' +
      '</div>';
    document.body.appendChild(banner);
    document.getElementById('cc-ok').onclick = function(){ localStorage.setItem('_lumes_consent','{"analytics":true}'); banner.remove(); };
    document.getElementById('cc-no').onclick = function(){ localStorage.setItem('_lumes_consent','{"analytics":false}'); banner.remove(); };
  }, 1500);
}

// ── MAIN ENTRY POINT ──────────────────────────────────────────
function initPage(opts) {
  opts = opts || {};
  // 1. Inject layout (nav, cart, modals, footer)
  injectLayout(opts);
  // 2. Init all features
  Cart.load();
  Cart.badge();
  Cart.render();
  initReveal();
  initScroll();
  initCursor();
  initBurger();
  initAuthModal();
  updateNavAuth();
  initStars();
  initCountUp();
  initFAQ();
  initCookieBanner();
  // 3. Cart events
  var cartOv = document.getElementById('cartOv'); if(cartOv) cartOv.addEventListener('click', closeCart);
  var cartIco = document.getElementById('cartIco'); if(cartIco) cartIco.addEventListener('click', openCart);
  var cpx = document.querySelector('.cp-x'); if(cpx) cpx.addEventListener('click', closeCart);
  // 4. Modal overlay close
  document.querySelectorAll('.modal-ov').forEach(function(m){ m.addEventListener('click', function(e){ if(e.target===m) closeModal(m.id); }); });
  // 5. Active nav link
  var path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a,.mmenu a').forEach(function(a){ if(a.getAttribute('href') && a.getAttribute('href').includes(path)) a.classList.add('active'); });
}

// Expose everything globally so inline scripts can access them
window.PRODS       = PRODS;
window.Security    = Security;
window.Auth        = Auth;
window.Cart        = Cart;
window.Toast       = Toast;
window.fmtPrice    = fmtPrice;
window.openCart    = openCart;
window.closeCart   = closeCart;
window.openModal   = openModal;
window.closeModal  = closeModal;
window.goTo        = goTo;
window.showFieldError   = showFieldError;
window.clearFieldErrors = clearFieldErrors;
window.initReveal  = initReveal;
window.initPage    = initPage;
