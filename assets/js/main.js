(function () {
  function setStatus(element, message, state) {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.classList.remove('is-error', 'is-success');

    if (state) {
      element.classList.add(state);
    }
  }

  async function handleContactSubmit(event) {
    const form = event.currentTarget;
    const endpoint = form.dataset.apiEndpoint;

    if (!endpoint || typeof fetch !== 'function') {
      return;
    }

    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.landing-form-status');
    const payload = {
      name: form.elements['Name']?.value?.trim() || '',
      email: form.elements['Email']?.value?.trim() || '',
      message: form.elements['Message']?.value?.trim() || '',
    };

    if (submitButton) {
      submitButton.disabled = true;
    }

    form.setAttribute('aria-busy', 'true');
    setStatus(status, 'Sending...', null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      form.reset();
      setStatus(status, form.dataset.successMessage || 'Thanks. Your message has been sent.', 'is-success');
    } catch (_error) {
      setStatus(status, form.dataset.errorMessage || 'We could not send your message right now. Please call or email us directly.', 'is-error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }

      form.setAttribute('aria-busy', 'false');
    }
  }

  document.querySelectorAll('form[data-api-endpoint]').forEach((form) => {
    form.addEventListener('submit', handleContactSubmit);
  });
})();
