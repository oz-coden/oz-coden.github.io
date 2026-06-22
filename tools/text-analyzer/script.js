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

        if (minutes > 0) {
            elReadingTime.innerText = `約 ${minutes}分 ${seconds}秒`;
        } else {
            elReadingTime.innerText = `約 ${seconds}秒`;
        }

        const lines = text.split(/\n/);
        let manuscriptTotalLines = 0;
        for (let i = 0; i < lines.length; i++) {
            const lineLength = lines[i].length;
            if (lineLength === 0) {
                manuscriptTotalLines += 1;
            } else {
                manuscriptTotalLines += Math.ceil(lineLength / 20);
            }
        }
        const manuscriptPages = Math.ceil(manuscriptTotalLines / 20);
        elManuscript.innerText = `${manuscriptPages}枚`;
    }

    textInput.addEventListener('input', updateCounts);

    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            textInput.value = '';
            updateCounts();
            document.getElementById('analysis-result').innerHTML = '';
            window.analyzedTokens = [];
        }
    });
    window.tokenizer = null;
    window.analyzedTokens = [];

    const loadingMsg = document.getElementById('loading-msg');
    const analyzeUi = document.getElementById('analyze-ui');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultArea = document.getElementById('analysis-result');
    const posFilters = document.querySelectorAll('.pos-filter');

    setTimeout(() => {
        loadingMsg.innerText = "⏳ 単語分析エンジン(Kuromoji)の辞書を読み込み中...";

        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js";

        script.onload = () => {
            // スクリプト自体の読み込み成功後、辞書データのビルドを開始
            kuromoji.builder({ dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict" }).build((err, _tokenizer) => {
                if (err) {
                    console.error("辞書エラー", err);
                    loadingMsg.innerText = "❌ 辞書の読み込みに失敗しました。";
                    return;
                }
                window.tokenizer = _tokenizer;
                loadingMsg.style.display = 'none';
                analyzeUi.style.display = 'block';
            });
        };

        script.onerror = () => {
            loadingMsg.innerText = "❌ 分析エンジンのネットワーク読み込みに失敗しました。";
        };

        document.body.appendChild(script);
    }, 1000);

    analyzeBtn.addEventListener('click', () => {
        const text = textInput.value;
        if (!window.tokenizer || !text.trim()) return;
        window.analyzedTokens = window.tokenizer.tokenize(text);
        renderAnalysis();
    });

    posFilters.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (window.analyzedTokens.length > 0) {
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

        window.analyzedTokens.forEach(token => {
            if (selectedPos.includes(token.pos) && token.pos !== "記号" && token.pos_detail_1 !== "非自立" && token.pos_detail_1 !== "数") {
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