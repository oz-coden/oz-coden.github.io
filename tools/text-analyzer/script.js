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
    const lines = text.split(/\n/);

    elCharsAll.innerText = textWithoutNewlines.length;
    elChars.innerText = textStrictlyNoSpace.length;
    elLines.innerText = lines.length;
    elParagraphs.innerText = text.split(/\n+/).filter(Boolean).length;
    elSentences.innerText = text.split(/[。.]/).filter(Boolean).length;

    const punctuationMatches = text.match(/[、。，．,.]/g);
    elPunctuation.innerText = punctuationMatches ? punctuationMatches.length : 0;

    const totalSeconds = Math.ceil((textStrictlyNoSpace.length / 500) * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    elReadingTime.innerText = minutes > 0 ? `約 ${minutes}分 ${seconds}秒` : `約 ${seconds}秒`;

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
    }
});

updateCounts();