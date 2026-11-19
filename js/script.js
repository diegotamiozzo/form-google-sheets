const form = document.querySelector('#contact-form');
const statusMessage = document.querySelector('#form-status');
const submitButton = form.querySelector('button[type="submit"]');
let statusTimeout;

function showStatus(message, state, clearAfter = false) {
  window.clearTimeout(statusTimeout);
  statusMessage.textContent = message;
  statusMessage.dataset.state = state;

  if (clearAfter) {
    statusTimeout = window.setTimeout(() => {
      statusMessage.textContent = '';
      delete statusMessage.dataset.state;
    }, 3000);
  }
}

function isValidEndpoint(value) {
  if (!value || value === 'COLE_A_URL_DO_WEB_APP_AQUI') {
    return false;
  }

  try {
    const endpoint = new URL(value);
    return endpoint.protocol === 'https:' && endpoint.hostname === 'script.google.com';
  } catch {
    return false;
  }
}

if (typeof API_URL === 'undefined' || !isValidEndpoint(API_URL)) {
  showStatus(
    'Configure a URL do web app do Google Apps Script em js/config.js antes de usar o formulário.',
    'error',
  );
  submitButton.disabled = true;
} else {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const payload = {
      nome: formData.get('name').trim(),
      email: formData.get('email').trim(),
      mensagem: formData.get('message').trim(),
    };

    submitButton.disabled = true;
    showStatus('Enviando sua mensagem...', 'pending');

    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
        body: JSON.stringify(payload),
      });

      form.reset();
      showStatus('Mensagem enviada com sucesso!', 'success', true);
    } catch {
      showStatus(
        'Não foi possível enviar a mensagem. Verifique sua conexão e tente novamente.',
        'error',
        true,
      );
    } finally {
      submitButton.disabled = false;
    }
  });
}