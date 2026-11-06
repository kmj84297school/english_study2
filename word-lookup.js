/* Small, local word disclosures. Meanings never require a network request. */
(() => {
  'use strict';
  const dictionary = window.WORD_MEANINGS || {};
  let opened = null, serial = 0;
  const normalize = word => word.toLowerCase().replace(/’/g, "'");
  function close() {
    if (!opened) return;
    opened.querySelector('button').setAttribute('aria-expanded', 'false');
    opened.querySelector('.word-meaning').hidden = true;
    opened.classList.remove('word-open');
    opened = null;
  }
  function enhance(root, passage) {
    if (!root) return;
    const local = new Map();
    for (const [word, meaning] of passage.vocab || []) {
      if (/^[a-z]+$/i.test(word)) local.set(normalize(word), meaning);
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (node.parentElement.closest('button,a,textarea,input,script,style,.word-unit,.eyebrow,.sentence-num,.order-letter,.gloss-label,.section-heading,.note,.sentence-ko')) return NodeFilter.FILTER_REJECT;
        return /[A-Za-z]/.test(node.data) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const text = node.data, fragment = document.createDocumentFragment();
      let end = 0;
      for (const match of text.matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)) {
        const word = match[0], key = normalize(word);
        // S1, A/B block labels and unregistered UI abbreviations are not vocabulary.
        const meaning = local.get(key) || dictionary[key] || dictionary[word.toLowerCase()];
        if (!meaning || /\d/.test(text[match.index + word.length] || '')) continue;
        fragment.append(document.createTextNode(text.slice(end, match.index)));
        const unit = document.createElement('span'); unit.className = 'word-unit';
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'word-toggle'; button.textContent = word;
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', word + ' 뜻 열기·닫기');
        const label = document.createElement('span');
        label.id = 'word-meaning-' + (++serial); label.className = 'word-meaning';
        label.lang = 'ko'; label.hidden = true;
        label.textContent = meaning;
        button.setAttribute('aria-controls', label.id);
        unit.append(button, label); fragment.append(unit);
        end = match.index + word.length;
      }
      fragment.append(document.createTextNode(text.slice(end)));
      node.replaceWith(fragment);
    }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('.word-toggle');
    if (!button) {
      if (!event.target.closest('.word-meaning')) close();
      return;
    }
    const unit = button.parentElement, wasOpen = opened === unit;
    close();
    if (!wasOpen) {
      unit.classList.add('word-open');
      unit.querySelector('.word-meaning').hidden = false;
      button.setAttribute('aria-expanded', 'true'); opened = unit;
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && opened) {
      const button = opened.querySelector('button'); close(); button.focus();
    }
  });
  window.addEventListener('hashchange', close);
  window.WordLookup = { enhance, close };
})();
