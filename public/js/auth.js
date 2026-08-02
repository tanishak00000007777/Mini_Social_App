// Handles login/register forms via fetch so errors never leave the page.
(function () {
  async function handleAuthForm(formId, endpoint, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const btnLabel = submitBtn.querySelector('.btn-label');
      const btnSpinner = submitBtn.querySelector('.spinner');
      submitBtn.disabled = true;
      if (btnLabel) btnLabel.style.opacity = '0.6';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.success) {
          showToast(data.message || successMessage, 'success', 1600);
          setTimeout(() => { window.location.href = data.redirect || '/profile'; }, 500);
        } else {
          showToast(data.message || 'Something went wrong. Please try again.', 'error');
          submitBtn.disabled = false;
          if (btnLabel) btnLabel.style.opacity = '1';
          if (btnSpinner) btnSpinner.style.display = 'none';
        }
      } catch (err) {
        showToast('Network error — please check your connection and try again.', 'error');
        submitBtn.disabled = false;
        if (btnLabel) btnLabel.style.opacity = '1';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }

  handleAuthForm('loginForm', '/login', 'Welcome back!');
  handleAuthForm('registerForm', '/register', 'Account created!');

  // Show a one-off toast passed via ?toast=&type= query params (used after
  // redirects for create/edit/upload), then strip it from the URL.
  document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('toast');
    if (msg) {
      showToast(msg, params.get('type') || 'info');
      params.delete('toast');
      params.delete('type');
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', newUrl);
    }
  });
})();
