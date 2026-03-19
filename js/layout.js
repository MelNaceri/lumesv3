/* ============================================================
   LUMÈS — Layout Injector
   RÈGLE : injectLayout() ne s'appelle QUE depuis initPage()
   ============================================================ */

function injectLayout(opts) {
  opts = opts || {};
  var isRoot = opts.isRoot || false;
  var base = isRoot ? '' : '../';

  // ── NAV ────────────────────────────────────────────────────
  var navEl = document.getElementById('site-nav');
  if (navEl) {
    navEl.innerHTML =
      '<nav id="mainnav">' +
        '<a href="' + base + 'index.html" class="logo">Lum\xe8s</a>' +
        '<div class="nav-links">' +
          '<a href="' + base + 'index.html#produits">Collection</a>' +
          '<a href="' + base + 'pages/collection.html">Tous les produits</a>' +
          '<a href="' + base + 'index.html#bienfaits">Bienfaits</a>' +
          '<a href="' + base + 'index.html#avis">Avis</a>' +
          '<a href="' + base + 'index.html#faq">FAQ</a>' +
          '<a href="' + base + 'pages/contact.html">Contact</a>' +
        '</div>' +
        '<div class="nav-r">' +
          '<button class="nav-account" id="navAuthBtn" type="button">👤 Connexion</button>' +
          '<button class="cart-ico" id="cartIco" aria-label="Panier">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' +
            '<span class="cart-badge" id="cbadge">0</span>' +
          '</button>' +
          '<button class="burger" id="bburger" aria-label="Menu"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</nav>' +
      '<div class="mmenu" id="mmenu">' +
        '<button class="mmenu-x" id="mmx">✕</button>' +
        '<a href="' + base + 'index.html">Accueil</a>' +
        '<a href="' + base + 'pages/collection.html">Collection</a>' +
        '<a href="' + base + 'pages/contact.html">Contact</a>' +
        '<a href="' + base + 'pages/checkout.html" style="color:var(--gold);border:1px solid var(--gold);padding:.6rem 1.4rem;border-radius:2px">Commander</a>' +
      '</div>';
  }

  // ── CART PANEL ─────────────────────────────────────────────
  var cartEl = document.getElementById('site-cart');
  if (cartEl) {
    cartEl.innerHTML =
      '<div class="cart-ov" id="cartOv"></div>' +
      '<div class="cart-panel" id="cartPanel">' +
        '<div class="cp-head"><div class="cp-title">Mon panier</div><button class="cp-x">✕</button></div>' +
        '<div class="cp-body" id="cpBody"></div>' +
        '<div class="cp-foot" id="cpFoot" style="display:none">' +
          '<div class="cp-row"><span>Sous-total</span><span id="cpSub">0,00€</span></div>' +
          '<div class="cp-row"><span>Livraison</span><span id="cpShip" style="color:var(--gold)">Offerte 🎁</span></div>' +
          '<div class="cp-row big"><span>Total</span><span id="cpTotalFinal">0,00€</span></div>' +
          '<button class="btn btn-gold btn-full" onclick="goTo(\'' + base + 'pages/checkout.html\')">🔒 Commander — <span id="cpTotalBtn">0,00€</span></button>' +
          '<button class="btn btn-ghost btn-full" style="margin-top:.5rem" onclick="closeCart()">Continuer mes achats</button>' +
          '<div style="text-align:center;font-size:.65rem;color:var(--mist);margin-top:.7rem">🔒 Paiement sécurisé SSL · 🛡️ 30j satisfait ou remboursé</div>' +
        '</div>' +
      '</div>';
  }

  // ── AUTH MODAL ─────────────────────────────────────────────
  var authEl = document.getElementById('site-auth');
  if (authEl) {
    authEl.innerHTML =
      '<div class="modal-ov" id="authModal">' +
        '<div class="modal">' +
          '<div class="modal-head">' +
            '<div class="modal-title">Mon espace</div>' +
            '<button class="modal-x" onclick="closeModal(\'authModal\')">✕</button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="modal-tabs">' +
              '<button class="modal-tab active" data-tab="login">Connexion</button>' +
              '<button class="modal-tab" data-tab="register">Créer un compte</button>' +
            '</div>' +
            '<div class="auth-panel" id="panel-login">' +
              '<form id="loginForm" novalidate autocomplete="on">' +
                '<div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="loginEmail" placeholder="vous@email.com" autocomplete="email" required><div class="form-error" id="loginEmailErr"></div></div>' +
                '<div class="form-group"><label class="form-label">Mot de passe</label><input class="form-input" type="password" id="loginPass" placeholder="••••••••" autocomplete="current-password" required></div>' +
                '<button class="btn btn-gold btn-full" type="submit">Se connecter</button>' +
              '</form>' +
              '<div class="modal-sep">ou</div>' +
              '<button class="btn btn-ghost btn-full" id="guestBtn" type="button">👤 Continuer en tant qu\'invité</button>' +
            '</div>' +
            '<div class="auth-panel" id="panel-register" style="display:none">' +
              '<form id="registerForm" novalidate autocomplete="on">' +
                '<div class="form-group"><label class="form-label">Prénom et nom</label><input class="form-input" type="text" id="regName" placeholder="Marie Dupont" autocomplete="name" required></div>' +
                '<div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="regEmail" placeholder="vous@email.com" autocomplete="email" required><div class="form-error" id="regEmailErr"></div></div>' +
                '<div class="form-row">' +
                  '<div class="form-group" style="margin-bottom:0"><label class="form-label">Mot de passe</label><input class="form-input" type="password" id="regPass" placeholder="••••••••" autocomplete="new-password" required minlength="8"></div>' +
                  '<div class="form-group" style="margin-bottom:0"><label class="form-label">Confirmer</label><input class="form-input" type="password" id="regPass2" placeholder="••••••••" autocomplete="new-password" required><div class="form-error" id="regPass2Err"></div></div>' +
                '</div>' +
                '<div style="font-size:.68rem;color:var(--mist);margin:1rem 0">En créant un compte, vous acceptez nos <a href="' + base + 'pages/cgv.html" style="color:var(--gold)">CGV</a>.</div>' +
                '<button class="btn btn-gold btn-full" type="submit">Créer mon compte</button>' +
              '</form>' +
              '<div class="modal-sep">ou</div>' +
              '<button class="btn btn-ghost btn-full" id="guestBtn" type="button">👤 Continuer en tant qu\'invité</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // ── FOOTER ─────────────────────────────────────────────────
  var footEl = document.getElementById('site-footer');
  if (footEl) {
    footEl.innerHTML =
      '<footer>' +
        '<a href="' + base + 'index.html" class="flogo">Lum\xe8s</a>' +
        '<p class="ftagline">Des nuits transform\xe9es, des jours extraordinaires.<br>Dormez mieux. Vivez mieux.</p>' +
        '<div class="fsoc-row">' +
          '<a href="#" class="fsoc" aria-label="Instagram">📸</a>' +
          '<a href="#" class="fsoc" aria-label="TikTok">📱</a>' +
          '<a href="#" class="fsoc" aria-label="Facebook">👥</a>' +
          '<a href="mailto:contact@lumes.fr" class="fsoc" aria-label="Email">✉️</a>' +
        '</div>' +
        '<div class="fcols">' +
          '<div class="fcol"><h4>Collection</h4><ul>' +
            '<li><a href="' + base + 'pages/product.html?id=gp">Gravity Pro\u2122</a></li>' +
            '<li><a href="' + base + 'pages/product.html?id=dp">Drift Pillow\u2122</a></li>' +
            '<li><a href="' + base + 'pages/product.html?id=nr">NightRoll\u2122</a></li>' +
            '<li><a href="' + base + 'pages/product.html?id=sv">SoundVeil\u2122</a></li>' +
            '<li><a href="' + base + 'pages/product.html?id=sk">Sleep Kit\u2122</a></li>' +
          '</ul></div>' +
          '<div class="fcol"><h4>Service client</h4><ul>' +
            '<li><a href="' + base + 'index.html#faq">FAQ</a></li>' +
            '<li><a href="' + base + 'pages/cgv.html">Livraison & retours</a></li>' +
            '<li><a href="' + base + 'pages/contact.html">Contact</a></li>' +
            '<li><a href="' + base + 'pages/legal.html">Mentions l\xe9gales</a></li>' +
            '<li><a href="' + base + 'pages/cgv.html">CGV</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="fbot">' +
          '<div>\xa9 2026 Lum\xe8s \u2014 Tous droits r\xe9serv\xe9s</div>' +
          '<div class="ftrust">' +
            '<a href="' + base + 'pages/legal.html" style="color:var(--mist)">Mentions l\xe9gales</a>' +
            '<a href="' + base + 'pages/cgv.html" style="color:var(--mist)">CGV</a>' +
            '<a href="' + base + 'pages/privacy.html" style="color:var(--mist)">Confidentialit\xe9</a>' +
            '<a href="' + base + 'pages/cookies.html" style="color:var(--mist)">Cookies</a>' +
          '</div>' +
          '<div class="ftrust" style="margin-top:.5rem"><span>🔒 SSL</span><span>💳 CB / Apple Pay</span><span>🇫🇷 SAV fran\xe7ais</span><span>🛡\ufe0f RGPD conforme</span></div>' +
        '</div>' +
      '</footer>';
  }

  // ── MISC ELEMENTS ──────────────────────────────────────────
  // Only inject once
  if (!document.getElementById('scroll-prog')) {
    var misc = document.createElement('div');
    misc.innerHTML =
      '<div id="scroll-prog"></div>' +
      '<div id="cursor-dot"></div>' +
      '<div id="cursor-ring"></div>' +
      '<div id="toast-stack" class="toast-stack"></div>';
    while (misc.firstChild) document.body.insertBefore(misc.firstChild, document.body.firstChild);
  }
}

window.injectLayout = injectLayout;
