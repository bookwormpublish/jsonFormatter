function formatJSON() {
  const input = document.getElementById('input').value;
  const output = document.getElementById('output');
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = '';
  try {
    const parsed = JSON.parse(input);
    output.value = JSON.stringify(parsed, null, 2);
    updateLineNumbers('output', 'output-line-numbers');
    autoResizeTextarea('output');
  } catch (e) {
    errorDiv.textContent = 'Invalid JSON: ' + e.message;
    output.value = '';
    updateLineNumbers('output', 'output-line-numbers');
    autoResizeTextarea('output');
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
      updateLineNumbers('output', 'output-line-numbers');
      autoResizeTextarea('output');
    } else if (action === "minify") {
      const json = JSON.parse(input);
      output.value = JSON.stringify(json);
      updateLineNumbers('output', 'output-line-numbers');
      autoResizeTextarea('output');
    } else if (action === "xml2json") {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "application/xml");
      
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("Invalid XML format");
      }
      
      const rootElement = xmlDoc.documentElement;
      const rootName = rootElement.nodeName;
      const json = xmlToJson(rootElement);
      
      if (json === null) {
        throw new Error("Failed to convert XML to JSON");
      }
      
      // Create the final JSON object with the root element name
      const finalJson = { [rootName]: json };
      output.value = JSON.stringify(finalJson, null, 2);
      updateLineNumbers('output', 'output-line-numbers');
      autoResizeTextarea('output');
    }
  } catch (e) {
    error.textContent = "Error: " + e.message;
    output.value = "";
    updateLineNumbers('output', 'output-line-numbers');
    autoResizeTextarea('output');
  }
}


function xmlToJson(xml) {
  // Handle null or undefined
  if (!xml) {
    return null;
  }

  // Handle text nodes
  if (xml.nodeType === 3) {
    const text = xml.nodeValue.trim();
    return text || "";
  }

  // Handle element nodes
  if (xml.nodeType === 1) {
    const obj = {};
    
    // Handle attributes
    if (xml.attributes && xml.attributes.length > 0) {
      for (let attr of xml.attributes) {
        obj[attr.name] = attr.value;
      }
    }

    // Handle child nodes
    const children = xml.childNodes;
    let hasTextContent = false;
    let textContent = '';
    let hasChildElements = false;
    
    for (let child of children) {
      if (child.nodeType === 3) {
        // Text node
        const text = child.nodeValue.trim();
        if (text) {
          hasTextContent = true;
          textContent += text;
        }
      } else if (child.nodeType === 1) {
        // Element node
        hasChildElements = true;
        const childName = child.nodeName;
        const childValue = xmlToJson(child);
        
        if (childValue !== null && childValue !== undefined) {
          if (obj[childName]) {
            // If this element already exists, make it an array
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(childValue);
          } else {
            obj[childName] = childValue;
          }
        }
      }
    }

    // If this element has only text content and no child elements, return just the text
    if (hasTextContent && !hasChildElements && Object.keys(obj).length === 0) {
      return textContent;
    }
    
    // If this element has both text content and child elements, add text as #text property
    if (hasTextContent && hasChildElements) {
      obj['#text'] = textContent;
    }

    // Special case: if this element has only one child element type that's an array and no attributes
    if (Object.keys(obj).length === 1 && !hasTextContent && xml.attributes.length === 0) {
      const key = Object.keys(obj)[0];
      if (Array.isArray(obj[key])) {
        return obj[key];
      }
    }
    
    return obj;
  }

  return null;
}

function updateLineNumbers(textareaId, lineNumbersId) {
  const textarea = document.getElementById(textareaId);
  const lineNumbers = document.getElementById(lineNumbersId);
  const lines = textarea.value.split('\n');
  
  let lineNumbersText = '';
  for (let i = 1; i <= Math.max(lines.length, 1); i++) {
    lineNumbersText += i + '\n';
  }
  
  lineNumbers.textContent = lineNumbersText;
}

function syncScroll(textareaId, lineNumbersId) {
  const textarea = document.getElementById(textareaId);
  const lineNumbers = document.getElementById(lineNumbersId);
  lineNumbers.scrollTop = textarea.scrollTop;
}

function autoResizeTextarea(textareaId) {
  const textarea = document.getElementById(textareaId);
  const container = textarea.closest('.textarea-container');
  
  // Reset height to auto to get the correct scrollHeight
  textarea.style.height = 'auto';
  
  // Calculate the new height based on content
  const newHeight = Math.min(Math.max(textarea.scrollHeight, 180), 600);
  
  // Set the height
  textarea.style.height = newHeight + 'px';
  container.style.height = newHeight + 'px';
}

function showDisclaimer() {
  const modal = document.getElementById('disclaimerModal');
  modal.classList.add('show');
}

function closeDisclaimer() {
  const modal = document.getElementById('disclaimerModal');
  modal.classList.remove('show');
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('disclaimerModal');
  if (event.target === modal) {
    modal.classList.remove('show');
  }
}


window.addEventListener("load", async () => {
  // Initialize line numbers
  updateLineNumbers('input', 'input-line-numbers');
  updateLineNumbers('output', 'output-line-numbers');
  
  // Add event listeners for input textarea
  const inputTextarea = document.getElementById('input');
  inputTextarea.addEventListener('input', () => {
    updateLineNumbers('input', 'input-line-numbers');
    autoResizeTextarea('input');
  });
  inputTextarea.addEventListener('scroll', () => {
    syncScroll('input', 'input-line-numbers');
  });
  
  // Add event listeners for output textarea
  const outputTextarea = document.getElementById('output');
  outputTextarea.addEventListener('input', () => {
    updateLineNumbers('output', 'output-line-numbers');
    autoResizeTextarea('output');
  });
  outputTextarea.addEventListener('scroll', () => {
    syncScroll('output', 'output-line-numbers');
  });
  
  try {
    const text = await navigator.clipboard.readText();
    if (isLikelyJSON(text)) {
      document.getElementById("input").value = text;
      formatJSON();
      showToast("Auto-formatted JSON from clipboard");
      updateLineNumbers('input', 'input-line-numbers');
    }
  } catch (e) {
    console.log("Clipboard read blocked:", e.message);
  }
});
