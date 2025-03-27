function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

function createToggleButton() {
  const button = document.createElement('span');
  button.className = 'toggle-button';
  button.textContent = '▼';
  button.style.cursor = 'pointer';
  button.style.marginRight = '5px';
  button.style.display = 'inline-block';
  button.style.width = '12px';
  return button;
}

function getItemCount(obj) {
  if (Array.isArray(obj)) {
    return obj.length;
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).length;
  }
  return null;
}

function createFormattedView(obj, level = 0) {
  const container = document.createElement('div');
  container.className = `json-level-${level}`;
  container.style.position = 'relative';
  container.style.display = 'inline-block';
  container.style.paddingLeft = level > 0 ? '8px' : '0';
  container.style.marginBottom = '0';

  if (typeof obj !== 'object' || obj === null) {
    const valueNode = document.createElement('span');
    valueNode.textContent = JSON.stringify(obj);
    valueNode.className = `json-${typeof obj}`;
    container.appendChild(valueNode);
    return container;
  }

  const isArray = Array.isArray(obj);
  const itemCount = getItemCount(obj);
  
  const openBracket = document.createElement('span');
  openBracket.textContent = isArray ? '[' : '{';
  openBracket.className = 'json-bracket';
  
  const closeBracket = document.createElement('span');
  closeBracket.textContent = isArray ? ']' : '}';
  closeBracket.className = 'json-bracket';

  if (itemCount === 0) {
    container.appendChild(openBracket);
    container.appendChild(closeBracket);
    return container;
  }

  const button = createToggleButton();
  const content = document.createElement('div');
  content.className = 'json-content';
  content.style.display = 'block';
  content.style.overflow = 'hidden';
  content.style.transition = 'max-height 0.3s ease-in-out';
  content.style.maxHeight = 'none';
  content.style.marginLeft = '0';
  content.style.paddingLeft = '0';
  
  button.onclick = () => {
    const isExpanded = content.style.maxHeight !== '0px';
    content.style.maxHeight = isExpanded ? '0px' : 'none';
    button.textContent = isExpanded ? '▶' : '▼';
    button.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
  };

  container.appendChild(button);
  container.appendChild(openBracket);
  
  if (itemCount > 0) {
    const countBadge = document.createElement('span');
    countBadge.className = 'count-badge';
    countBadge.textContent = itemCount;
    container.appendChild(countBadge);
  }
  
  container.appendChild(content);

  Object.entries(obj).forEach(([key, value], index) => {
    const property = document.createElement('div');
    property.className = 'json-property';
    property.style.display = 'block';
    property.style.position = 'relative';
    property.style.padding = '2px 0';
    
    const keySpan = document.createElement('span');
    keySpan.className = 'json-key';
    keySpan.textContent = isArray ? '' : `"${key}": `;
    
    property.appendChild(keySpan);
    property.appendChild(createFormattedView(value, level + 1));

    if (index < Object.keys(obj).length - 1) {
      const comma = document.createElement('span');
      comma.textContent = ', ';
      comma.className = 'json-comma';
      property.appendChild(comma);
    }

    content.appendChild(property);
  });

  container.appendChild(closeBracket);
  return container;
}

function formatAndDisplay(jsonStr) {
  try {
    const obj = JSON.parse(jsonStr);
    const container = document.createElement('div');
    container.style.backgroundColor = '#1e1e1e';
    container.style.color = '#d4d4d4';
    container.style.padding = '16px';
    container.style.margin = '0';
    container.style.fontFamily = 'JetBrains Mono, Monaco, Consolas, monospace';
    container.style.fontSize = '13px';
    container.style.lineHeight = '1.4';
    container.style.letterSpacing = '-0.2px';

    const style = document.createElement('style');
    style.textContent = `
      body { margin: 0; background: #1e1e1e; }
      .json-string { color: #ce9178; }
      .json-number { color: #b5cea8; }
      .json-boolean { color: #569cd6; }
      .json-null { color: #569cd6; }
      .json-key { color: #9cdcfe; }
      .json-bracket { color: #d4d4d4; }
      .json-comma { color: #808080; }
      .toggle-button { 
        transition: transform 0.2s ease;
        color: #6a9955;
        font-size: 10px;
        width: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 4px;
        opacity: 0.8;
        user-select: none;
      }
      .toggle-button:hover {
        opacity: 1;
      }
      .json-property {
        position: relative;
        display: block;
        padding: 2px 0;
        border-radius: 3px;
        transition: background-color 0.15s ease;
      }
      .json-property:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }
      .json-content {
        margin-left: 12px;
        display: flex;
        flex-direction: column;
      }
      .count-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        margin: 0 4px;
        font-size: 10px;
        color: #1e1e1e;
        background-color: #6a9955;
        border-radius: 10px;
        min-width: 14px;
        height: 14px;
        opacity: 0.9;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
    `;
    container.appendChild(style);
    container.appendChild(createFormattedView(obj));
    return container;
  } catch (e) {
    return 'Invalid JSON: ' + e.message;
  }
}

function init() {
  const bodyText = document.body.textContent;
  if (isJSON(bodyText)) {
    document.body.innerHTML = '';
    document.body.appendChild(formatAndDisplay(bodyText));
  }
}

function expandAll() {
  const buttons = document.querySelectorAll('.toggle-button');
  buttons.forEach(button => {
    const content = button.nextElementSibling.nextElementSibling.nextElementSibling;
    content.style.maxHeight = 'none';
    button.textContent = '▼';
    button.style.transform = 'rotate(90deg)';
  });
}

function collapseAll() {
  const buttons = document.querySelectorAll('.toggle-button');
  buttons.forEach(button => {
    const content = button.nextElementSibling.nextElementSibling.nextElementSibling;
    content.style.maxHeight = '0px';
    button.textContent = '▶';
    button.style.transform = 'rotate(0deg)';
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'format':
      init();
      break;
    case 'expand':
      expandAll();
      break;
    case 'collapse':
      collapseAll();
      break;
  }
});

// Auto-format if the page contains JSON
init();