(function () {
  function initFormValidation() {
    const form = document.querySelector('[data-form="contato"]');
    if (!form) return;

    const feedback = form.querySelector('.form__feedback');
    const submitButton = form.querySelector('button[type="submit"]');
    const fields = Array.from(form.querySelectorAll('input, textarea, select'));

    const messages = {
      required: 'Campo obrigatório.',
      email: 'Informe um email válido.',
      tel: 'Informe um telefone válido.',
    };

    const setStatus = (field, isValid, message = '') => {
      const helper = form.querySelector(`[data-error-for="${field.id}"]`);
      field.classList.toggle('is-invalid', !isValid);
      field.classList.toggle('is-valid', isValid);
      if (helper) helper.textContent = isValid ? '' : message;
    };

    const validateField = (field) => {
      const value = field.value.trim();
      if (field.hasAttribute('required') && !value) {
        setStatus(field, false, messages.required);
        return false;
      }
      if (field.type === 'email' && value) {
        const emailOk = /.+@.+\..+/.test(value);
        setStatus(field, emailOk, emailOk ? '' : messages.email);
        return emailOk;
      }
      if (field.type === 'tel' && value) {
        const digits = value.replace(/\D/g, '');
        const telOk = digits.length >= 10;
        setStatus(field, telOk, telOk ? '' : messages.tel);
        return telOk;
      }
      setStatus(field, true, '');
      return true;
    };

    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
      field.addEventListener('change', () => validateField(field));
    });

    form.addEventListener('submit', (event) => {
      const valid = fields.every((field) => validateField(field));

      if (!valid) {
        event.preventDefault();
        if (feedback) {
          feedback.classList.remove('is-success');
          feedback.textContent = 'Por favor, revise os campos destacados.';
        }
        return;
      }

      if (feedback) {
        feedback.classList.remove('is-success');
        feedback.textContent = '';
      }

      event.preventDefault();
      if (submitButton) {
        submitButton.classList.add('is-loading');
        submitButton.disabled = true;
      }

      setTimeout(() => {
        if (submitButton) {
          submitButton.classList.remove('is-loading');
          submitButton.disabled = false;
        }
        form.reset();
        fields.forEach((field) => {
          field.classList.remove('is-valid', 'is-invalid');
        });
        if (feedback) {
          feedback.classList.add('is-success');
          feedback.textContent = 'Solicitação enviada. Retornaremos em breve.';
        }
      }, 1200);
    });
  }

  window.initFormValidation = initFormValidation;
})();
