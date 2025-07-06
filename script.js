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

