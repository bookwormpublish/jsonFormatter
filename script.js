function formatJSON() {
  const input = document.getElementById('input').value;
  const output = document.getElementById('output');
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = '';
  try {
    const parsed = JSON.parse(input);
    output.value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    errorDiv.textContent = 'Invalid JSON: ' + e.message;
    output.value = '';
  }
}

function copyFormattedJSON() {
  const output = document.getElementById('output');
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(() => {
    showToast("Copied!");
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function isLikelyJSON(text) {
  const trimmed = text.trim();
  return trimmed.startsWith('{') || trimmed.startsWith('[');
}

window.addEventListener("load", async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (isLikelyJSON(text)) {
      document.getElementById("input").value = text;
      formatJSON();
      showToast("Auto-formatted JSON from clipboard");
    }
  } catch (e) {
    console.log("Clipboard read blocked:", e.message);
  }
});
