const generateBtn = document.getElementById('generate-btn');
const patternInput = document.getElementById('regex-pattern');
const flagsInput = document.getElementById('regex-flags');
const outputArea = document.getElementById('output-area');

generateBtn.addEventListener('click', () => {
    const pattern = patternInput.value;
    const flags = flagsInput.value;

    if (!pattern) {
        outputArea.innerHTML = '<span class="error">パターンを入力してください。</span>';
        return;
    }

    try {
        const regex = new RegExp(pattern, flags);

        if (typeof RandExp === 'undefined') {
            throw new Error("ライブラリが読み込めませんでした。");
        }

        const randexp = new RandExp(regex);
        randexp.max = 15;

        let results = [];
        for (let i = 0; i < 5; i++) {
            results.push(`候補 ${i + 1}: ${randexp.gen()}`);
        }

        outputArea.textContent = results.join('\n');
        outputArea.style.color = "var(--c-text-sub)";

    } catch (error) {
        outputArea.innerHTML = `<span class="error">エラー: 構文が無効です。<br>${error.message}</span>`;
    }
});

window.addEventListener('load', () => {
    generateBtn.click();
});