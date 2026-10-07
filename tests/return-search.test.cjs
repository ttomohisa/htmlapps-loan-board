const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '..');
const sourcePath = process.env.LOAN_BOARD_SOURCE || 'src/index.template.html';
let html = fs.readFileSync(path.resolve(root, sourcePath), 'utf8');
if (html.includes('id="self-extract-payload"')) {
  const payload = html.match(/<script id="self-extract-payload"[^>]*>([A-Za-z0-9+/=\s]+)<\/script>/);
  assert(payload, 'Self-extract payload exists');
  html = zlib.gunzipSync(Buffer.from(payload[1], 'base64')).toString('utf8');
}
const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('const returnState='));
assert(code, 'Actual application script exists');
const stamp = '2026-10-05T12:00:00.000Z';
function data(archived = false) {
  const borrower = (id, name, archived) => ({ borrowerId: id, name, note: '', archived, createdAt: stamp, updatedAt: stamp });
  const item = (id, name, category, code, borrowerId) => ({ itemId: id, name, category, code, note: 'private synthetic note', archived: false, status: borrowerId ? 'checked-out' : 'available', currentBorrowerId: borrowerId, currentCheckoutAt: borrowerId ? stamp : null, createdAt: stamp, updatedAt: stamp });
  return { board: { id: 'board', name: 'Synthetic board', createdAt: stamp, updatedAt: stamp },
    borrowers: [borrower('a', 'Synthetic A', archived), borrower('b', 'Synthetic B', false)],
    items: [item('radio-1', 'Radio', '音響', 'RAD-01', 'a'), item('radio-2', 'Radio', '通信', 'RAD-02', 'a'), item('light', '照明', 'Lighting', 'LIGHT-01', 'a'), item('other', 'Other borrower radio', '音響', 'OTHER-01', 'b'), item('available', 'Available Radio', '音響', 'AV-01', null)],
    events: [{ eventId: 'checkout-a', type: 'checkout', borrowerId: 'a', itemIds: ['radio-1', 'radio-2', 'light'], timestamp: stamp, note: '' }, { eventId: 'checkout-b', type: 'checkout', borrowerId: 'b', itemIds: ['other'], timestamp: stamp, note: '' }] };
}
function envelope(d, format = 'browser-kitty-loan-board-state') { return { format, schemaVersion: 1, appSlug: 'loan-board', savedAt: stamp, data: d }; }
// The real script and delegated handlers execute unchanged. This small DOM/storage
// model tests state and node identity, not browser layout, IME, or accessibility APIs.
function harness({ language = 'en', initial = data(), raw } = {}) {
  const writes = [], downloads = [], blobs = [], timers = new Map(); let timerId = 0, active = null;
  const storage = new Map([['loan-board:language', language]]);
  if (raw !== undefined) storage.set('loan-board:state:v1', raw);
  else if (initial) storage.set('loan-board:state:v1', JSON.stringify(envelope(initial)));
  function matches(el, selector) {
    if (selector.startsWith('#')) return el.id === selector.slice(1);
    const attr = selector.match(/^\[data-([\w-]+)(?:="([^"]*)")?\]$/);
    if (attr) { const key = attr[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase()); return Object.hasOwn(el.dataset, key) && (attr[2] === undefined || el.dataset[key] === attr[2]); }
    return el.tagName === selector.toUpperCase();
  }
  class Element {
    constructor(tag = 'div') { this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null; this.dataset = {}; this.attributes = {}; this.listeners = new Map(); this.value = ''; this.checked = false; this.hidden = false; this.disabled = false; this._text = ''; this.classList = { add() {}, remove() {}, toggle() {} }; }
    get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
    set textContent(v) { this.replaceChildren(); this._text = String(v); }
    get childElementCount() { return this.children.length; }
    get isConnected() { return this === body || Boolean(this.parentNode?.isConnected); }
    append(...nodes) { nodes.forEach(n => { if (typeof n === 'string') { const t = new Element('text'); t._text = n; n = t; } n.remove(); n.parentNode = this; this.children.push(n); }); }
    replaceChildren(...nodes) { if (active && this.contains(active)) active = null; this.children.forEach(n => n.parentNode = null); this.children = []; this._text = ''; this.append(...nodes); }
    contains(el) { return this === el || this.children.some(n => n.contains(el)); }
    remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(c => c !== this); this.parentNode = null; }
    querySelectorAll(s) { return this.children.flatMap(c => [...(matches(c, s) ? [c] : []), ...c.querySelectorAll(s)]); }
    querySelector(s) { return this.querySelectorAll(s)[0] || null; }
    closest(s) { return matches(this, s) ? this : this.parentNode?.closest(s) || null; }
    setAttribute(k, v) { this.attributes[k] = String(v); } getAttribute(k) { return this.attributes[k] ?? null; }
    addEventListener(k, fn) { this.listeners.set(k, [...(this.listeners.get(k) || []), fn]); }
    trigger(k, more = {}) { const e = { target: this, preventDefault() {}, ...more }; let el = this; while (el) { e.currentTarget = el; (el.listeners.get(k) || []).forEach(fn => fn(e)); el = el.parentNode; } }
    focus() { active = this; } scrollIntoView() {} reset() {} showModal() { this.open = true; } close() { this.open = false; }
    click() { if (this.tagName === 'A') downloads.push({ name: this.download, href: this.href }); else if (!this.disabled) this.trigger('click'); }
  }
  const body = new Element('body');
  for (const m of html.matchAll(/<([\w-]+)\b[^>]*\bid="([^"]+)"[^>]*>/g)) { const el = new Element(m[1]); el.id = m[2]; el.value = m[0].match(/\bvalue="([^"]*)"/)?.[1] || ''; body.append(el); }
  const document = { body, documentElement: {}, querySelector: s => body.querySelector(s), querySelectorAll: s => body.querySelectorAll(s), getElementById: id => body.querySelector('#' + id), createElement: tag => new Element(tag), createElementNS: (_, tag) => new Element(tag), createTextNode: text => { const e = new Element('text'); e.textContent = text; return e; }, addEventListener() {}, get activeElement() { return active; } };
  const c = vm.createContext({ document, navigator: { language }, localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => { writes.push([k, v]); storage.set(k, v); }, removeItem: k => storage.delete(k) }, console, Blob, TextDecoder, Uint8Array, Intl, Date, atob, requestAnimationFrame: fn => fn(), clearTimeout: id => timers.delete(id), setTimeout: fn => { timers.set(++timerId, fn); return timerId; }, URL: { createObjectURL: b => { blobs.push(b); return 'blob:synthetic'; }, revokeObjectURL() {} } });
  c.window = c; c.addEventListener = () => {}; c.confirm = () => true;
  const exposed = `globalThis.api={get state(){return state},get ui(){return returnState},get checkout(){return checkoutState},get storageControl(){return storageControl},render,renderReturn,renderOutstandingBoard,renderBorrowerSuggestions,updateCounts,parseStateEnvelope,restoreState,resetAllData,restoreBackupFile,commitReturn,undoEvent,borrowersWithOutstanding,checkedOutItemsForBorrower,backupEnvelope,persistState,exportOutstandingCsv,exportHistoryCsv,csvText,t};`;
  const executable = code.replace('__APP_CONFIG_JSON__', fs.readFileSync(path.join(root, 'app.config.json'), 'utf8')).replace('__BUILD_MANIFEST_JSON__', '{}').replace('__EMBEDDED_ASSET_BUNDLE_JSON__', '{}').replace(/\}\)\(\);\s*$/, exposed + '\n})();');
  vm.runInContext(executable, c, { filename: sourcePath });
  const get = s => document.querySelector(s);
  const open = (id = 'a') => { get(`[data-return-borrower-id="${id}"]`).click(); get('#startPartialReturn').click(); };
  const search = q => { const e = get('#returnItemSearch'); assert(e, 'Partial return search exists'); e.value = q; e.trigger('input'); return e; };
  const select = (id, checked = true) => { const e = get(`[data-return-item="${id}"]`); assert(e, 'Visible checkbox for ' + id); e.checked = checked; e.trigger('change'); return e; };
  return { api: c.api, c, get, open, search, select, document, writes, downloads, blobs, storage };
}
const ids = h => h.document.querySelectorAll('[data-return-item]').map(n => n.value);
for (const language of ['en', 'ja']) {
  test(`${language}: partial return searches name/category/code only within selected borrower's loans`, () => {
    const h = harness({ language }); h.open();
    for (const [q, expected] of [['Radio', ['radio-1', 'radio-2']], ['  rad-02 ', ['radio-2']], ['音響', ['radio-1']], ['照明', ['light']], ['LIGHTING', ['light']], ['private synthetic note', []], ['', ['radio-1', 'radio-2', 'light']]]) { h.search(q); assert.deepEqual(ids(h), expected); }
  });
  test(`${language}: hidden selections survive zero matches and count toward Return N`, () => {
    const h = harness({ language }); h.open(); const before = JSON.stringify(h.api.state); h.select('radio-1'); h.search('RAD-02'); h.select('radio-2'); h.search('nothing');
    assert.deepEqual(ids(h), []); assert.match(h.get('#returnDetail').textContent, new RegExp(h.api.t('returnNoMatch')));
    assert.equal(h.get('#returnSelectedButton').disabled, false); assert.match(h.get('#returnSelectedButton').textContent, /2/);
    assert.match(h.get('#returnSelectionSummary').textContent, new RegExp(h.api.t('returnHiddenSelectedCount') + ': 2'));
    assert.equal(JSON.stringify(h.api.state), before); h.search(''); assert.deepEqual(h.document.querySelectorAll('[data-return-item]').filter(n => n.checked).map(n => n.value), ['radio-1', 'radio-2']);
  });
}
test('typing and checkbox changes preserve the focused controls and do not write business data', () => {
  const h = harness(); h.open(); const e = h.get('#returnItemSearch'); assert(e, 'Search control exists'); e.focus(); const before = JSON.stringify(h.api.state), writes = h.writes.length;
  for (const q of ['r', 'ra', 'rad', '', '音響', '']) { h.search(q); assert.equal(h.get('#returnItemSearch'), e); assert.equal(h.document.activeElement, e); }
  const cb = h.get('[data-return-item="radio-1"]'); cb.focus(); h.select('radio-1'); assert.equal(h.get('[data-return-item="radio-1"]'), cb); assert.equal(h.document.activeElement, cb); assert.equal(h.get('#returnItemSearch'), e);
  assert.equal(JSON.stringify(h.api.state), before); assert.equal(h.writes.length, writes);
});
test('selected return includes hidden IDs exactly once, preserves identity/timestamps, and Undo appends history', () => {
  const h = harness(); h.open(); const originals = h.api.state.items.slice(); h.select('radio-1'); h.search('LIGHT'); h.select('light');
  h.get('#returnSelectedButton').click(); assert.equal(h.api.state.items[0], originals[0]); assert.equal(h.api.state.items[2], originals[2]); assert.equal(h.api.state.items[1].status, 'checked-out'); assert.equal(h.api.state.items[3].status, 'checked-out');
  const event = h.api.state.events.at(-1); assert.deepEqual(Array.from(event.itemIds), ['radio-1', 'light']); assert(event.itemSnapshots.every(s => s.checkoutAt === stamp)); assert.equal(h.api.ui.query, ''); assert.equal(h.api.ui.selectedItemIds.size, 0);
  const count = h.api.state.events.length; h.api.commitReturn(h.api.state.borrowers[0], [originals[0], originals[2], originals[3]]); assert.equal(h.api.state.events.length, count);
  assert.equal(h.api.undoEvent(event.eventId), true); assert.equal(originals[0].currentCheckoutAt, stamp); assert.equal(originals[2].currentCheckoutAt, stamp); assert.equal(originals[0].currentBorrowerId, 'a'); assert.equal(h.api.state.events.length, count + 1); assert.equal(h.api.state.events.at(-1).type, 'undo'); assert.equal(h.api.undoEvent(event.eventId), false);
});
test('borrower change, cancel, return, reset and restore clear transient query and selections', () => {
  const h = harness();
  const seed = () => { h.open(); h.select('radio-1'); h.search('RAD'); };
  const cleared = () => { assert.equal(h.api.ui.query, ''); assert.equal(h.api.ui.selectedItemIds.size, 0); assert.equal(h.api.ui.partialMode, false); };
  seed(); h.get('[data-return-borrower-id="b"]').click(); cleared();
  seed(); h.get('#cancelPartialReturn').click(); cleared();
  seed(); h.api.restoreState(h.api.parseStateEnvelope(envelope(data(), 'browser-kitty-loan-board-backup'), 'browser-kitty-loan-board-backup')); cleared();
  seed(); h.api.resetAllData(); cleared(); assert.equal(h.api.state.items.length, 0);
});
test('board shortcut starts a fresh query and selection for the chosen borrower', () => {
  const h = harness(); h.open(); h.select('radio-1'); h.search('RAD'); h.get('[data-board-partial-return="b"]').click();
  assert.equal(h.api.ui.selectedBorrowerId, 'b'); assert.equal(h.api.ui.query, ''); assert.equal(h.api.ui.selectedItemIds.size, 0); assert.deepEqual(ids(h), ['other']);
});
test('stale IDs are pruned against current borrower loans, not query matches', () => {
  const h = harness(); h.open(); h.select('radio-1'); h.api.ui.selectedItemIds.add('other'); h.api.ui.selectedItemIds.add('missing'); h.search('LIGHT');
  assert.deepEqual(Array.from(h.api.ui.selectedItemIds), ['radio-1']); assert.match(h.get('#returnSelectedButton').textContent, /1/);
});
test('accepted archived-borrower backup stays visible and returnable, disappears on full return, and reappears on Undo', () => {
  const d = data(true); d.items = d.items.filter(i => i.currentBorrowerId === 'a'); d.borrowers = [d.borrowers[0]]; d.events = [d.events[0]];
  const h = harness({ initial: d }); assert.equal(h.get('#outstandingCount').textContent, '3'); assert.equal(h.get('#outstandingBorrowerCount').textContent, '1'); assert.equal(h.api.borrowersWithOutstanding().length, 1);
  assert(!h.get('#outstandingBoard').textContent.includes(h.api.t('allReturnedTitle'))); assert(h.get('[data-return-borrower-id="a"]'));
  h.get('#checkoutBorrowerQuery').value = ''; h.api.renderBorrowerSuggestions(); assert.equal(h.get('[data-checkout-borrower-id="a"]'), null); assert.equal(h.api.state.borrowers[0].archived, true);
  h.get('[data-return-borrower-id="a"]').click(); h.get('#returnAllButton').click(); assert.equal(h.api.borrowersWithOutstanding().length, 0); assert(h.get('#outstandingBoard').textContent.includes(h.api.t('allReturnedTitle')));
  assert.equal(h.api.undoEvent(h.api.state.events.at(-1).eventId), true); assert.equal(h.api.borrowersWithOutstanding().length, 1); assert(h.get('[data-return-borrower-id="a"]')); assert(h.api.state.items.every(i => i.currentCheckoutAt === stamp)); assert.equal(h.api.state.borrowers[0].archived, true);
});
test('archive recovery fix leaves missing references and archived checked-out items invalid', () => {
  const h = harness();
  for (const mutate of [d => d.items[0].currentBorrowerId = 'missing', d => d.items[0].archived = true]) { const d = data(); mutate(d); assert.throws(() => h.api.parseStateEnvelope(envelope(d), 'browser-kitty-loan-board-state')); }
});
test('corrupt autosave remains protected and empty storage opens safely', () => {
  const h = harness({ raw: 'invalid json' }); h.api.persistState(); assert.equal(h.api.storageControl.blocked, true); assert.equal(h.storage.get('loan-board:state:v1'), 'invalid json'); assert.equal(h.writes.length, 0);
  const empty = harness({ initial: null }); assert.equal(empty.api.state.items.length, 0); assert(empty.get('#outstandingBoard').textContent.includes(empty.api.t('allReturnedTitle')));
});
test('query and selection are absent from schema-v1 backups and reload', () => {
  const h = harness(); h.open(); h.select('radio-1'); h.search('RAD'); const saved = h.api.backupEnvelope(); assert.equal(saved.schemaVersion, 1); assert.deepEqual(Object.keys(saved.data).sort(), ['board', 'borrowers', 'events', 'items']);
  const restored = harness({ initial: JSON.parse(JSON.stringify(saved.data)) }); assert.equal(restored.api.ui.query, ''); assert.equal(restored.api.ui.selectedItemIds.size, 0); assert.equal(restored.api.ui.selectedBorrowerId, null);
});
test('CSV remains all outstanding/all history with BOM, CRLF, escaped quotes and formula protection', async () => {
  const h = harness({ initial: data(true) }); h.open(); h.search('none'); h.api.exportOutstandingCsv(); h.api.exportHistoryCsv();
  for (const blob of h.blobs) { const bytes = Buffer.from(await blob.arrayBuffer()); assert.equal(bytes.subarray(0, 3).toString('hex'), 'efbbbf'); assert.equal(bytes.toString().split('\r\n').length, 6); }
  assert.equal(h.api.csvText(['A'], [['=1'], ['a"b']]), '\uFEFF"A"\r\n"\'=1"\r\n"a""b"\r\n'); assert(h.downloads.every(d => d.name.endsWith('.csv')));
});
test('large synthetic loan list remains scoped and searchable', () => {
  const d = data(); const example = d.items[0]; d.items = Array.from({ length: 1000 }, (_, i) => ({ ...example, itemId: 'large-' + i, code: 'CODE-' + i })); d.events = [];
  const h = harness({ initial: d }); h.open(); h.search('CODE-999'); assert.deepEqual(ids(h), ['large-999']);
});
test('search labels, live count, local CSP, and bilingual help are present', () => {
  const h = harness(); h.open(); assert.equal(h.get('#returnItemSearch').type, 'search'); assert.equal(h.get('#returnItemSearch').className, 'input'); assert(h.get('#returnItemSearchLabel')); assert.equal(h.get('#returnItemSearch').getAttribute('aria-describedby'), 'returnSelectionSummary');
  assert.match(html, /connect-src 'none'/); assert(!/<script[^>]+src="https?:/i.test(html)); assert.match(h.api.t('helpReturnSearch'), /search|検索/); assert.match(h.api.t('helpArchivedLoans'), /archived|アーカイブ/i);
});

test('cancelled reset/restore and invalid backups preserve pending query and selections', async () => {
  const h = harness(); h.open(); h.select('radio-1'); h.search('RAD'); const before = JSON.stringify(h.api.state); h.c.confirm = () => false;
  h.api.resetAllData(); await h.api.restoreBackupFile({ name: 'synthetic.json', size: 1, text: async () => JSON.stringify(envelope(data(true), 'browser-kitty-loan-board-backup')) });
  await h.api.restoreBackupFile({ name: 'invalid.json', size: 1, text: async () => 'invalid' });
  assert.equal(h.api.ui.query, 'RAD'); assert.deepEqual(Array.from(h.api.ui.selectedItemIds), ['radio-1']); assert.equal(JSON.stringify(h.api.state), before);
  h.c.confirm = () => true; await h.api.restoreBackupFile({ name: 'synthetic.json', size: 1, text: async () => JSON.stringify(envelope(data(true), 'browser-kitty-loan-board-backup')) });
  assert.equal(h.api.ui.query, ''); assert.equal(h.api.ui.selectedItemIds.size, 0); assert.equal(h.api.state.borrowers[0].archived, true); assert(h.get('[data-return-borrower-id="a"]'));
});
test('Undo clears pending search/selection and invalidates the return UI safely', () => {
  const h = harness(); h.open('b'); h.select('other'); h.search('OTHER'); assert.equal(h.api.undoEvent('checkout-b'), true);
  assert.equal(h.api.ui.query, ''); assert.equal(h.api.ui.selectedItemIds.size, 0); assert.equal(h.api.ui.partialMode, false); assert.equal(h.api.ui.selectedBorrowerId, null); assert.equal(h.get('#returnItemSearch'), null);
});
test('no selection or no matches leaves Return 0 disabled and business data unchanged', () => {
  const h = harness(); h.open(); const before = JSON.stringify(h.api.state); h.search('<script>'); assert.equal(h.get('#returnSelectedButton').disabled, true); assert.match(h.get('#returnSelectedButton').textContent, /0/);
  h.get('#returnSelectedButton').click(); assert.equal(JSON.stringify(h.api.state), before); h.search(''); h.select('radio-1'); h.select('radio-1', false); assert.equal(h.get('#returnSelectedButton').disabled, true); assert.equal(h.api.ui.selectedItemIds.size, 0);
});


test('language control initially describes its EN target in Japanese', () => {
  const button = html.match(/<button\b[^>]*id="languageButton"[^>]*>EN<\/button>/)?.[0];
  assert(button, 'Initial EN language control exists');
  assert.match(button, /aria-label="英語に切り替え"/);
  assert.match(button, /title="英語に切り替え"/);
});

test('EN / JA language round trip keeps localized targets and loaded loans, search, and hidden selections', () => {
  const h = harness({ language: 'ja' }); h.open(); h.select('radio-1'); h.search('LIGHT');
  const before = JSON.stringify(h.api.state), state = h.api.state;
  for (const [language, visible, target] of [['ja', 'EN', '英語に切り替え'], ['en', 'JA', 'Switch to Japanese'], ['ja', 'EN', '英語に切り替え']]) {
    if (h.document.documentElement.lang !== language) h.get('#languageButton').click();
    assert.equal(h.document.documentElement.lang, language);
    assert.equal(h.get('#languageButton').textContent, visible);
    assert.equal(h.get('#languageButton').getAttribute('aria-label'), target);
    assert.equal(h.get('#languageButton').title, target);
    assert.equal(h.api.t('localBadge'), language === 'ja' ? '完全ローカル処理' : 'Fully local processing');
    assert.equal(h.api.t('helpTitle'), language === 'ja' ? '使い方と注意事項' : 'How to use & notes');
    assert.equal(h.api.state, state); assert.equal(JSON.stringify(h.api.state), before);
    assert.equal(h.api.ui.query, 'LIGHT'); assert.equal(h.api.ui.partialMode, true);
    assert.equal(h.api.ui.selectedBorrowerId, 'a');
    assert.deepEqual(Array.from(h.api.ui.selectedItemIds), ['radio-1']);
    assert.deepEqual(ids(h), ['light']);
    assert.equal(h.get('#returnSelectedButton').disabled, false);
  }
});
