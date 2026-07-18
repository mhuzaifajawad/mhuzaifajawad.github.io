/* ===== terminal site: shared behaviour ===== */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- curtain / page transitions ---------- */
  var curtain = document.createElement('div');
  curtain.id = 'curtain';
  curtain.innerHTML = '<span class="load"></span>';
  document.body.appendChild(curtain);
  var loadEl = curtain.querySelector('.load');

  // intercept internal links for a wipe transition
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
    if (!/\.html$/.test(href) && href !== './' && href !== '/') return;
    if (reduce) return; // let it navigate normally
    e.preventDefault();
    loadEl.textContent = '> loading ' + href.replace('.html', '') + ' ...';
    curtain.classList.add('on');
    setTimeout(function () { location.href = href; }, 380);
  });

  // clear curtain if user comes back via bfcache
  addEventListener('pageshow', function () { curtain.classList.remove('on'); });

  /* ---------- typing effect ---------- */
  document.querySelectorAll('[data-type]').forEach(function (el) {
    var full = el.getAttribute('data-type');
    if (reduce) { el.textContent = full; return; }
    el.textContent = '';
    var i = 0;
    (function tick() {
      if (i <= full.length) {
        el.textContent = full.slice(0, i);
        i++;
        setTimeout(tick, 24 + Math.random() * 26);
      }
    })();
  });

  /* ---------- scroll reveals ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- mobile menu ---------- */
  var mb = document.getElementById('menuBtn'), nv = document.getElementById('cmds');
  if (mb && nv) mb.addEventListener('click', function () { nv.classList.toggle('open'); });

  /* ---------- live clock in title bar ---------- */
  var clk = document.getElementById('clk');
  if (clk) {
    setInterval(function () {
      var d = new Date();
      clk.textContent = String(d.getHours()).padStart(2, '0') + ':' +
                        String(d.getMinutes()).padStart(2, '0') + ':' +
                        String(d.getSeconds()).padStart(2, '0');
    }, 1000);
  }
})();
