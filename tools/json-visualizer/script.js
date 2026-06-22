const jsonInput = document.getElementById('jsonInput');
const outputArea = document.getElementById('outputArea');

function parseAndVisualize() {
    const input = jsonInput.value;
    outputArea.innerHTML = '';

    if (!input.trim()) return;

    try {
        const parsedData = JSON.parse(input);
        buildTree(parsedData, 'data', outputArea);
    } catch (error) {
        outputArea.innerHTML = `<span class="error">JSONのパースに失敗しました:<br>${error.message}</span>`;
    }
}

function buildTree(value, currentPath, container) {
    const div = document.createElement('div');
    div.className = 'node';

    if (value === null) {
        div.innerHTML = `<span class="path">${currentPath}</span> = <span class="val-boolean">null</span>`;
        container.appendChild(div);
    }
    else if (typeof value === 'object') {
        const isArray = Array.isArray(value);
        const typeText = isArray ? `Array(${value.length})` : 'Object';

        div.innerHTML = `<span class="path">${currentPath}</span> <span class="type-label">// ${typeText}</span>`;
        container.appendChild(div);

        for (const key in value) {
            const newPath = isArray ? `${currentPath}[${key}]` : `${currentPath}.${key}`;
            buildTree(value[key], newPath, div);
        }
    }
    else {
        let formattedValue = value;
        let valueClass = '';

        if (typeof value === 'string') {
            formattedValue = `"${value}"`;
            valueClass = 'val-string';
        } else if (typeof value === 'number') {
            valueClass = 'val-number';
        } else if (typeof value === 'boolean') {
            valueClass = 'val-boolean';
        }

        div.innerHTML = `<span class="path">${currentPath}</span> = <span class="${valueClass}">${formattedValue}</span>`;
        container.appendChild(div);
    }
}

function resetAll() {
    jsonInput.value = '';
    outputArea.innerHTML = '';
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    jsonInput.addEventListener(eventName, (e) => e.preventDefault(), false);
});

['dragenter', 'dragover'].forEach(eventName => {
    jsonInput.addEventListener(eventName, () => {
        jsonInput.classList.add('dragover');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    jsonInput.addEventListener(eventName, () => {
        jsonInput.classList.remove('dragover');
    }, false);
});

jsonInput.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const file = files[0];

        if (file.name.endsWith('.json') || file.type === 'application/json') {
            const reader = new FileReader();

            reader.onload = (event) => {
                jsonInput.value = event.target.result;
                parseAndVisualize();
            };

            reader.readAsText(file);
        } else {
            alert('JSON形式 (.json) のファイルを選択してください。');
        }
    }
}, false);

window.addEventListener('DOMContentLoaded', parseAndVisualize);