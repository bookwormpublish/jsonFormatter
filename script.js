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

function handleAction() {
  const action = document.getElementById("actionSelector").value;
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");
  const error = document.getElementById("error");
  error.textContent = "";

  try {
    if (action === "format") {
      const json = JSON.parse(input);
      output.value = JSON.stringify(json, null, 2);
    } else if (action === "minify") {
      const json = JSON.parse(input);
      output.value = JSON.stringify(json);
    } else if (action === "xml2json") {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "application/xml");
      const json = xmlToJson(xmlDoc);
      output.value = JSON.stringify(json, null, 2);
    }
  } catch (e) {
    error.textContent = "Error: " + e.message;
    output.value = "";
  }
}


function xmlToJson(xml) {
  const obj = {};
  if (xml.nodeType === 1 && xml.attributes.length > 0) {
    for (let attr of xml.attributes) {
      obj[attr.name] = attr.value;
    }
  }

  if (xml.nodeType === 3) {
    const text = xml.nodeValue.trim();
    if (text) return text;
  }

  for (let node of xml.childNodes) {
    const name = node.nodeName;
    const val = xmlToJson(node);
    if (obj[name]) {
      if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
      obj[name].push(val);
    } else {
      obj[name] = val;
    }
  }

  return obj;
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
