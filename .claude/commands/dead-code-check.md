# Dead Code & Broken Reference Check

Run a full static audit of app.html and entry-form.html to find:
1. onclick/oninput/onchange handlers calling functions not defined in the file
2. Any remaining references to the old WIZ shape (WIZ.fees, WIZ.orgs, WIZ.sel)

Do NOT spawn a subagent. Run the Bash tool directly with this Node.js script:

```bash
cd "h:/My Drive/gatepost" && node -e "
const fs = require('fs');

function auditFile(filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const issues = [];

  // ── Extract all JS from <script> blocks ──
  const scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  const jsChunks = [];
  while ((m = scriptRe.exec(src)) !== null) jsChunks.push(m[1]);
  const fullJs = jsChunks.join('\n');

  // ── Collect all defined function names ──
  const defined = new Set();
  // function foo(  /  async function foo(
  let re = /(?:^|[\s;{(,])(?:async\s+)?function\s+(\w+)\s*\(/gm;
  while ((m = re.exec(fullJs)) !== null) defined.add(m[1]);
  // var foo = function(
  re = /(?:var|let|const)\s+(\w+)\s*=\s*(?:async\s+)?function[\s(*]/gm;
  while ((m = re.exec(fullJs)) !== null) defined.add(m[1]);
  // window['foo'] = function(  or  window.foo = function(
  re = /window\['(\w+)'\]\s*=\s*function|window\[\"(\w+)\"\]\s*=\s*function|window\.(\w+)\s*=\s*(?:async\s+)?function/gm;
  while ((m = re.exec(fullJs)) !== null) defined.add(m[1] || m[2] || m[3]);

  // ── Collect global function calls from HTML event handlers ──
  // Handlers look like: onclick=\"foo()\" or onclick=\"foo(1,2); bar()\"
  // We want to find calls that are NOT preceded by . (method calls) or known globals
  const handlerCalls = new Set();
  const KNOWN_GLOBALS = new Set([
    'if','for','while','switch','function','return','typeof','instanceof',
    'parseInt','parseFloat','isNaN','isFinite','encodeURIComponent','decodeURIComponent',
    'Object','Array','JSON','Math','Date','Number','String','Boolean','RegExp','Error',
    'console','alert','confirm','prompt','setTimeout','clearTimeout','setInterval','clearInterval',
    'fetch','Promise','Map','Set',
    // browser globals that appear in handlers
    'window','document','event','this','self','globalThis',
  ]);
  const SKIP_METHOD_PREFIXES = /(?:window|document|event|this|self|console|Math|JSON|Object|Array|Number|String|Date|Promise|navigator|location|history|e|el|node|target|src|g|v|p|f|s|c|d|r|m|n|i|j|k)\s*\.\s*\$/;

  const attrRe = /\bon(?:click|input|change|submit|blur|focus|keyup|keydown|mousedown|mouseup|dblclick)\s*=\s*[\"']([^\"']+)[\"']/gi;
  while ((m = attrRe.exec(src)) !== null) {
    const handlerStr = m[1];
    // Find every word( pattern in the handler
    const callRe = /([a-zA-Z_\$][\w\$]*)\s*\(/g;
    let c;
    while ((c = callRe.exec(handlerStr)) !== null) {
      const name = c[1];
      const pos = c.index;
      // Skip if preceded by a dot (method call)
      const before = handlerStr.slice(0, pos).trimEnd();
      if (before.endsWith('.')) continue;
      // Skip known browser/JS globals
      if (KNOWN_GLOBALS.has(name)) continue;
      // Skip single-char identifiers (likely loop vars leaked into handler)
      if (name.length === 1) continue;
      handlerCalls.add(name);
    }
  }

  // ── Check 1: Handlers calling undefined functions ──
  for (const name of handlerCalls) {
    if (!defined.has(name)) {
      issues.push({ sev: 'CRITICAL', msg: 'Handler calls undefined function: ' + name + '()' });
    }
  }

  // ── Check 2: Old WIZ shape references (would crash the new wizard) ──
  const stalePatterns = [
    { pat: 'WIZ\\.fees', label: 'WIZ.fees' },
    { pat: 'WIZ\\.orgs\\b', label: 'WIZ.orgs' },
    { pat: 'WIZ\\.sel\\b', label: 'WIZ.sel' },
    { pat: 'WIZ\\.days\\b', label: 'WIZ.days' },
    { pat: 'wizard-overlay', label: '#wizard-overlay element' },
  ];
  for (const { pat, label } of stalePatterns) {
    if (new RegExp(pat).test(src)) {
      issues.push({ sev: 'CRITICAL', msg: 'Stale reference: ' + label });
    }
  }

  return { issues, defined, handlerCalls };
}

['app.html', 'entry-form.html'].forEach(file => {
  console.log('\n' + '='.repeat(60));
  console.log('AUDIT: ' + file);
  console.log('='.repeat(60));
  try {
    const { issues } = auditFile(file);
    const crits = issues.filter(i => i.sev === 'CRITICAL');
    const warns = issues.filter(i => i.sev === 'WARN');
    if (crits.length) {
      console.log('\nCRITICAL — fix before committing:');
      crits.forEach(i => console.log('  X ' + i.msg));
    }
    if (warns.length) {
      console.log('\nWARN — verify these are truly unused:');
      warns.forEach(i => console.log('  ? ' + i.msg));
    }
    if (!crits.length && !warns.length) console.log('  OK - no issues found');
    else if (!crits.length) console.log('\n  OK - no critical issues');
  } catch(e) {
    console.log('ERROR running audit on ' + file + ': ' + e.message);
  }
});
"
```

## Interpreting results

**CRITICAL** — must fix before committing:
- **Handler calls undefined function**: that button/input is silently broken at runtime (no error, just nothing happens). Either the function was renamed, never written, or the onclick string has a typo.
- **Stale reference**: Old WIZ shape (`WIZ.fees`, `WIZ.orgs`, `WIZ.sel`) or orphaned HTML elements that will crash at runtime.

**False positives to watch for:**
- Dynamically constructed function names via `window['wizAdd'+prefix]` — the static scanner cannot see those; verify manually that the prefix matches the call site string.
- Functions only called from `init()` startup code or from the Supabase callback chain — these have low ref counts but are real entry points.

## When to run

Run `/dead-code-check` after any session that:
- Adds new onclick/oninput handlers or buttons
- Renames or removes functions
- Replaces or rewrites major UI sections (wizard steps, page renderers)
- Redirects `openFoo()` / `closeFoo()` style entry points

The check takes under 5 seconds and catches the class of bug that previously left the entire stalling/RV package UI silently broken.
