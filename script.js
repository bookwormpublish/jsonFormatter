function formatJSON() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");
  const error = document.getElementById("error");
  
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    output.value = formatted;
    error.textContent = "";
  } catch (e) {
    output.value = "";
    error.textContent = "Invalid JSON: " + e.message;
  }
}
function copyFormattedJSON() {
  const output = document.getElementById("output");
  const msg = document.getElementById("copyMsg");

  if (!output.value) {
    // Optionally show a different message or do nothing
    return;
  }

  navigator.clipboard.writeText(output.value)
    .then(() => {
      // Show the success message
      msg.classList.add('show');
      
      // Hide after 2 seconds
      setTimeout(() => {
        msg.classList.remove('show');
      }, 2000);
    })
    .catch(err => {
      alert("Failed to copy: " + err);
    });
}

