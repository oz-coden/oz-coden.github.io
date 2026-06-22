document.addEventListener("DOMContentLoaded", () => {

    const textInput = document.getElementById('text-input');
    const elReadingTime = document.getElementById('count-reading-time');
    const elManuscript = document.getElementById('count-manuscript');
    const elCharsAll = document.getElementById('count-chars-all');
    const elChars = document.getElementById('count-chars');
    const elLines = document.getElementById('count-lines');
    const elParagraphs = document.getElementById('count-paragraphs');
    const elSentences = document.getElementById('count-sentences');
    const elPunctuation = document.getElementById('count-punctuation');

    function updateCounts() {
        const text = textInput.value;
        if (!text) {
            elReadingTime.innerText = '0秒';
            elManuscript.innerText = '0枚';
            elCharsAll.innerText = '0';
            elChars.innerText = '0';
            elLines.innerText = '0';
            elParagraphs.innerText = '0';
            elSentences.innerText = '0';
            elPunctuation.innerText = '0';
            return;
        }

        const textWithoutNewlines = text.replace(/\n/g, '');
        const textStrictlyNoSpace = text.replace(/\s+/g, '');

        elCharsAll.innerText = textWithoutNewlines.length;
        elChars.innerText = textStrictlyNoSpace.length;
        elLines.innerText = text.split(/\n/).length;
        elParagraphs.innerText = text.split(/\n+/).filter(Boolean).length;
        elSentences.innerText = text.split(/[。.]/).filter(Boolean).length;

        const punctuationMatches = text.match(/[、。，．,.]/g);
        elPunctuation.innerText = punctuationMatches ? punctuationMatches.length : 0;

        const totalSeconds = Math.ceil((textStrictlyNoSpace.length / 500) * 60);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        elReadingTime.innerText = minutes > 0 ? `約 ${minutes}分 ${seconds}秒` : `約 ${seconds}秒`;

        const lines = text.split(/\n/);
        let manuscriptTotalLines = 0;
        for (let i = 0; i < lines.length; i++) {
            const lineLength = lines[i].length;
            manuscriptTotalLines += lineLength === 0 ? 1 : Math.ceil(lineLength / 20);
        }
        elManuscript.innerText = `${Math.ceil(manuscriptTotalLines / 20)}枚`;
    }

    textInput.addEventListener('input', updateCounts);

    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            textInput.value = '';
            updateCounts();
            document.getElementById('analysis-result').innerHTML = '';
            window.cachedTokens = [];
        }
    });

    let worker = null;
    window.cachedTokens = [];

    const loadDictBtn = document.getElementById('load-dict-btn');
    const loadingMsg = document.getElementById('loading-msg');
    const setupUi = document.getElementById('setup-ui');
    const analyzeUi = document.getElementById('analyze-ui');
    const analyzeBtn = document.getElementById('analyze-btn');
    const analyzingMsg = document.getElementById('analyzing-msg');
    const resultArea = document.getElementById('analysis-result');
    const posFilters = document.querySelectorAll('.pos-filter');

    loadDictBtn.addEventListener('click', () => {
        loadDictBtn.disabled = true;
        loadingMsg.style.display = 'inline';

        worker = new Worker('worker.js');

        worker.addEventListener('message', (e) => {
            const data = e.data;

            if (data.type === 'READY') {
                setupUi.style.display = 'none';
                analyzeUi.style.display = 'block';
            }

            else if (data.type === 'RESULT') {
                window.cachedTokens = data.tokens; 
                analyzingMsg.style.display = 'none';
                analyzeBtn.disabled = false;
                renderAnalysis(); 
            }

            else if (data.type === 'ERROR') {
                loadingMsg.innerText = "❌ 辞書の読み込みに失敗しました: " + data.message;
                loadDictBtn.disabled = false;
            }
        });

        worker.postMessage({ type: 'INIT' });
    });

    analyzeBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!worker || !text.trim()) return;

        analyzeBtn.disabled = true;
        analyzingMsg.style.display = 'inline';
        resultArea.innerHTML = '';

        worker.postMessage({ type: 'ANALYZE', text: text });
    });

    posFilters.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (window.cachedTokens.length > 0) {
                renderAnalysis();
            }
        });
    });

    function renderAnalysis() {
        const selectedPos = Array.from(posFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const wordCounts = {};
        const wordPosMap = {};

        window.cachedTokens.forEach(token => {
            if (selectedPos.includes(token.pos)) {
                const word = (token.basic_form && token.basic_form !== '*') ? token.basic_form : token.surface_form;
                wordCounts[word] = (wordCounts[word] || 0) + 1;
                wordPosMap[word] = token.pos;
            }
        });

        const sortedWords = Object.entries(wordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30);

        resultArea.innerHTML = '';
        if (sortedWords.length === 0) {
            resultArea.innerHTML = '<li>指定された条件の単語が見つかりませんでした。</li>';
            return;
        }

        sortedWords.forEach(([word, count]) => {
            const li = document.createElement('li');
            li.className = 'result-tag';
            li.innerHTML = `
            ${word} 
            <span class="pos-badge">${wordPosMap[word]}</span>
            <span class="result-count">${count}</span>
          `;
            resultArea.appendChild(li);
        });
    }
});