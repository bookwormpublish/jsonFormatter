// Show the selected panel, hide others
function showPanel(panelId) {
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(panelId).classList.add('active');
  clearMessages();
}

function clearMessages() {
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
  document.querySelectorAll('.valid-message').forEach(el => el.textContent = '');
  document.querySelectorAll('.copy-message').forEach(el => el.classList.remove('show'));
}

function formatJSON() {
  const input = document.getElementById('inputFormat').value;
  const errorDiv = document.getElementById('errorFormat');
  const output = document.getElementById('outputFormat');
  errorDiv.textContent = '';
  try {
    const parsed = JSON.parse(input);
    output.value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    errorDiv.textContent = 'Invalid JSON: ' + e.message;
    output.value = '';
  }
}

function validateJSON() {
  const input = document.getElementById('inputValidate').value;
  const errorDiv = document.getElementById('errorValidate');
  const validMsg = document.getElementById('validMsg');
  errorDiv.textContent = '';
  validMsg.textContent = '';
  try {
    JSON.parse(input);
    validMsg.textContent = 'JSON is valid!';
  } catch (e) {
    errorDiv.textContent = 'Invalid JSON: ' + e.message;
  }
}

function minifyJSON() {
  const input = document.getElementById('inputMinify').value;
  const errorDiv = document.getElementById('errorMinify');
  const output = document.getElementById('outputMinify');
  errorDiv.textContent = '';
  try {
    const parsed = JSON.parse(input);
    output.value = JSON.stringify(parsed);
  } catch (e) {
    errorDiv.textContent = 'Invalid JSON: ' + e.message;
    output.value = '';
  }
}

// Copy text from a given textarea id and show message
function copyText(textareaId) {
  const textarea = document.getElementById(textareaId);
  const msg = document.getElementById('copyMsg' + textareaId.replace('output', ''));
  if (!textarea.value) return;

  navigator.clipboard.writeText(textarea.value)
    .then(() => {
      msg.classList.add('show');
      setTimeout(() => msg.classList.remove('show'), 2000);
    })
    .catch(() => alert('Failed to copy!'));
}

// Initialize with format panel active
showPanel('format');
