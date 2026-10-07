// Registers the service worker and offers a reload when a new version is ready.
(function () {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  var reloading = false;
  function banner(worker) {
    if (document.getElementById('pwa-update')) return;
    var b = document.createElement('div');
    b.id = 'pwa-update';
    b.setAttribute('role', 'status');
    b.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;background:#1c1c1e;color:#eef1f5;border:1px solid #3a3a3c;border-radius:12px;padding:10px 14px;font:600 13px Inter,system-ui,sans-serif;display:flex;gap:12px;align-items:center;box-shadow:0 8px 24px rgba(0,0,0,.4)';
    b.textContent = 'A new version is available. ';
    var btn = document.createElement('button');
    btn.textContent = 'Update';
    btn.style.cssText = 'background:#0a84ff;color:#fff;border:0;border-radius:8px;padding:6px 12px;font:700 12px inherit;cursor:pointer';
    btn.onclick = function () { worker.postMessage('SKIP_WAITING'); };
    b.appendChild(btn);
    document.body.appendChild(b);
  }
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (reloading) return; reloading = true; location.reload();
  });
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      if (reg.waiting && navigator.serviceWorker.controller) banner(reg.waiting);
      reg.addEventListener('updatefound', function () {
        var w = reg.installing;
        if (!w) return;
        w.addEventListener('statechange', function () {
          if (w.state === 'installed' && navigator.serviceWorker.controller) banner(w);
        });
      });
      setInterval(function () { reg.update().catch(function () {}); }, 60 * 60 * 1000);
    }).catch(function () {});
  });
})();
