importScripts('https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js');

let tokenizer = null;

self.addEventListener('message', (e) => {
  const data = e.data;

  if (data.type === 'INIT') {
    kuromoji.builder({ dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict" }).build((err, _tokenizer) => {
      if (err) {
        self.postMessage({ type: 'ERROR', message: err.message });
      } else {
        tokenizer = _tokenizer;
        self.postMessage({ type: 'READY' });
      }
    });
  } 
  
  else if (data.type === 'ANALYZE') {
    if (!tokenizer) return;
    
    const tokens = tokenizer.tokenize(data.text);
    
    const simplifiedTokens = tokens
      .filter(t => t.pos !== "記号" && t.pos_detail_1 !== "非自立" && t.pos_detail_1 !== "数")
      .map(t => ({
        surface_form: t.surface_form,
        basic_form: t.basic_form,
        pos: t.pos
      }));

    self.postMessage({ type: 'RESULT', tokens: simplifiedTokens });
  }
});