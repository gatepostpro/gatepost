# Dead Code & Broken Reference Check

Scans app.html and entry-form.html for:
1. `onclick`/`oninput`/`onchange` handlers (in raw HTML **and** in JS-generated HTML strings) calling functions not defined in the file
2. Stale WIZ shape references that would crash the wizard
3. `_wizValidate()` called before `_wizSave()` in the same function (save must precede validate so DOM values are in WIZ.data first)
4. `JSON.stringify()` used to embed string arguments inside double-quoted HTML event attributes — breaks attribute parsing silently
5. `var` declarations that appear after their first use in the same scope (hoisting bug)
6. `DELETE` Supabase calls made before the replacement payload is built (data-loss window)

Do NOT spawn a subagent. Run the Bash tool directly with this script:

```bash
cd "h:/My Drive/gatepost" && node -e "
const fs = require('fs');

function auditFile(filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const issues = [];

  // ── Extract JS from <script> blocks ──
  const scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  const jsChunks = [];
  while ((m = scriptRe.exec(src)) !== null) jsChunks.push(m[1]);
  const fullJs = jsChunks.join('\n');

  // ── Collect all defined function names ──
  const defined = new Set();
  let re = /(?:^|[\s;{(,])(?:async\s+)?function\s+(\w+)\s*\(/gm;
  while ((m = re.exec(fullJs)) !== null) defined.add(m[1]);
  re = /(?:var|let|const)\s+(\w+)\s*=\s*(?:async\s+)?function[\s(*]/gm;
  while ((m = re.exec(fullJs)) !== null) defined.add(m[1]);
  re = /window\['(\w+)'\]\s*=\s*function|window\[\"(\w+)\"\]\s*=\s*function|window\.(\w+)\s*=\s*(?:async\s+)?function/gm;
  while ((m = re.exec(fullJs)) !== null) defined.add(m[1] || m[2] || m[3]);

  // ── Collect handler call names from TWO sources ──
  // Source A: raw HTML attributes  onclick=\"foo()\"
  // Source B: JS string literals   '...onclick=\"foo()\"...'  (dynamically generated HTML)
  const handlerCalls = new Set();
  const KNOWN_GLOBALS = new Set([
    'if','for','while','switch','function','return','typeof','instanceof',
    'parseInt','parseFloat','isNaN','isFinite','encodeURIComponent','decodeURIComponent',
    'Object','Array','JSON','Math','Date','Number','String','Boolean','RegExp','Error',
    'console','alert','confirm','prompt','setTimeout','clearTimeout','setInterval','clearInterval',
    'fetch','Promise','Map','Set','window','document','event','this','self',
  ]);

  function extractCalls(handlerStr) {
    const callRe = /([a-zA-Z_\$][\w\$]*)\s*\(/g;
    let c;
    while ((c = callRe.exec(handlerStr)) !== null) {
      const name = c[1];
      const before = handlerStr.slice(0, c.index).trimEnd();
      if (before.endsWith('.')) continue;       // method call — skip
      if (KNOWN_GLOBALS.has(name)) continue;
      if (name.length === 1) continue;
      handlerCalls.add(name);
    }
  }

  // Source A: raw HTML
  const htmlAttrRe = /\bon(?:click|input|change|submit|blur|focus|keyup|keydown|mousedown|mouseup|dblclick)\s*=\s*[\"']([^\"']+)[\"']/gi;
  while ((m = htmlAttrRe.exec(src)) !== null) extractCalls(m[1]);

  // Source B: JS strings containing onclick= (dynamically built HTML)
  // Match both single and double quoted string segments containing onclick
  const jsStrRe = /[\"'` + '`' + `]([^\"'` + '`' + `]*on(?:click|input|change|submit|blur|focus|keyup|keydown)[^\"'` + '`' + `]*)[\"'` + '`' + `]/g;
  while ((m = jsStrRe.exec(fullJs)) !== null) extractCalls(m[1]);

  // ── Check 1: Handlers calling undefined functions ──
  for (const name of handlerCalls) {
    if (!defined.has(name)) {
      issues.push({ sev: 'CRITICAL', msg: 'Handler calls undefined function: ' + name + '()' });
    }
  }

  // ── Check 2: Stale WIZ shape references ──
  const stalePatterns = [
    { pat: 'WIZ\\.fees', label: 'WIZ.fees (old shape)' },
    { pat: 'WIZ\\.orgs\\b', label: 'WIZ.orgs (old shape)' },
    { pat: 'WIZ\\.sel\\b', label: 'WIZ.sel (old shape)' },
    { pat: 'WIZ\\.days\\b', label: 'WIZ.days (old shape)' },
    { pat: 'wizard-overlay', label: '#wizard-overlay (removed element)' },
  ];
  for (const { pat, label } of stalePatterns) {
    if (new RegExp(pat).test(src)) {
      issues.push({ sev: 'CRITICAL', msg: 'Stale reference: ' + label });
    }
  }

  // ── Check 3: _wizValidate() called before _wizSave() in the same function ──
  const fnBodyRe = /(?:function\s+\w+|window\.\w+\s*=\s*(?:async\s+)?function)\s*\([^)]*\)\s*\{([^}]+)\}/g;
  while ((m = fnBodyRe.exec(fullJs)) !== null) {
    const body = m[1];
    const savePos = body.indexOf('_wizSave(');
    const valPos  = body.indexOf('_wizValidate(');
    if (savePos !== -1 && valPos !== -1 && valPos < savePos) {
      issues.push({ sev: 'CRITICAL', msg: '_wizValidate() called before _wizSave() — DOM values not in WIZ.data yet when validation runs' });
    }
  }

  // ── Check 4: JSON.stringify() inside double-quoted HTML event attributes ──
  // Pattern: build a string containing onclick=\"...\" then concatenate + JSON.stringify(someStr)
  // JSON.stringify produces \"value\" (with enclosing double-quotes) which closes the attribute early.
  // Fix: use single-quote escaping: '\\''+val.replace(/'/g,\"\\\\'\")+'\\''
  const srcLines = src.split('\\n');
  srcLines.forEach((line, i) => {
    if (!line.includes('JSON.stringify(')) return;
    // Safe workaround: .replace(/"/g,"'") immediately follows — skip
    if (line.includes('JSON.stringify(') && /JSON\.stringify\([^)]+\)\.replace\(\/"/. test(line)) return;
    // Look for double-quoted event handler in a window of ±4 lines
    const ctx = srcLines.slice(Math.max(0, i - 4), i + 5).join('\\n');
    if (/on(?:click|change|input|blur|focus|keydown|keyup)\s*=\s*(?:\\\\?|)\"/.test(ctx)) {
      issues.push({ sev: 'CRITICAL', msg: 'Line ~' + (i+1) + ': JSON.stringify() in double-quoted event attribute — breaks HTML. Use single-quote escaping: ' + line.trim().slice(0, 80) });
    }
  });

  // ── Check 5: var declaration appears after first use (hoisting bug) ──
  // Catches the pattern: variable used on line X, then 'var varName' appears on line X+N in same scope.
  // Heuristic: find 'var NAME' declarations and check if NAME appears as a standalone identifier
  // in the 10 lines immediately before the declaration line (in the same indentation block).
  const varDeclRe = /^([ \t]*)var\s+(\w+)\s*=/gm;
  const jsLines = fullJs.split('\\n');
  let vd;
  while ((vd = varDeclRe.exec(fullJs)) !== null) {
    const varName = vd[2];
    // Find which line number this declaration is on
    const declLineIdx = fullJs.slice(0, vd.index).split('\\n').length - 1;
    // Check 15 lines before for standalone use of this variable (not as part of a declaration)
    const lookback = jsLines.slice(Math.max(0, declLineIdx - 15), declLineIdx);
    const useRe = new RegExp('(?<![.\\w])' + varName + '(?![\\w:])');
    const declRe = new RegExp('\\bvar\\s+' + varName + '\\b');
    for (let li = 0; li < lookback.length; li++) {
      const lb = lookback[li];
      if (useRe.test(lb) && !declRe.test(lb) && !lb.trim().startsWith('//')) {
        issues.push({ sev: 'WARNING', msg: 'Line ~' + (declLineIdx+1) + ': var ' + varName + ' declared after apparent use at line ~' + (declLineIdx - lookback.length + li + 1) + ' (hoisting risk)' });
        break;
      }
    }
  }

  // ── Check 6: Supabase DELETE before payload is built ──
  // Catches DELETE immediately followed by INSERT loop with no pre-built array.
  // Pattern: await sbFetch(...DELETE) then for/forEach loop with sbFetch POST,
  // without a prior array/variable holding the payload.
  const deleteInsertRe = /await\s+sbFetch\s*\([^)]*method\s*:\s*['\"]\s*DELETE\s*['\"][^)]*\)([\s\S]{0,400}?)for\s*\(/g;
  while ((m = deleteInsertRe.exec(fullJs)) !== null) {
    const between = m[1];
    // If there's no array/object assignment between DELETE and the loop, flag it
    if (!/\bvar\b|\bconst\b|\blet\b|\b\w+\s*=\s*\[|\b\w+\s*=\s*\{/.test(between)) {
      issues.push({ sev: 'WARNING', msg: 'Supabase DELETE followed immediately by INSERT loop with no pre-built payload — data lost if network fails between DELETE and first INSERT' });
    }
  }

  return { issues, defined, handlerCalls };
}

['app.html', 'entry-form.html'].forEach(file => {
  console.log('\\n' + '='.repeat(60));
  console.log('AUDIT: ' + file);
  console.log('='.repeat(60));
  try {
    const { issues, defined, handlerCalls } = auditFile(file);
    const crits = issues.filter(i => i.sev === 'CRITICAL');
    const warns = issues.filter(i => i.sev === 'WARNING');
    console.log('Functions defined: ' + defined.size + ' | Handler call sites scanned: ' + handlerCalls.size);
    if (crits.length) {
      console.log('\\nCRITICAL — fix before committing:');
      crits.forEach(i => console.log('  X ' + i.msg));
    } else {
      console.log('  OK - no critical issues');
    }
    if (warns.length) {
      console.log('\\nWARNINGS — review:');
      warns.forEach(i => console.log('  ! ' + i.msg));
    }
  } catch(e) {
    console.log('ERROR: ' + e.message);
  }
});
"
```

## What each check catches

| Check | What it finds | Example bugs caught |
|---|---|---|
| 1. Handler → undefined function (HTML) | Raw `onclick=` in markup calling a missing function | `closeWizard()` after redirect |
| 1. Handler → undefined function (JS strings) | `pkgBlock` / `extraBlock` / `renderFoo` generating HTML with `onclick=` calling a misnamed function | `wizAddStall` vs `wizAddstallingPackages` |
| 2. Stale WIZ refs | Old wizard shape properties left in code | `WIZ.fees`, `WIZ.orgs`, `#wizard-overlay` |
| 3. Validate-before-save | `_wizValidate()` runs before `_wizSave()` reads DOM | Show name required alert despite text entered |
| 4. JSON.stringify in double-quoted attribute | `onclick="foo('+JSON.stringify(val)+')"` — double-quotes from stringify break the attribute; handler never fires | `setClassBilledTo`, `toggleRiderClass`, `renameRiderName` merge buttons all silently broken |
| 5. var used before declaration | `var x` declared after `x` is used in the same scope — works via hoisting but the value is `undefined` at use time | `isAqhaOrg` used 4 lines before declaration — AQHA always showed false verification errors |
| 6. DELETE before INSERT payload built | Supabase DELETE runs before replacement rows are prepared — network failure destroys data | `syncBillingGroupsToSupabase` — billing groups permanently wiped if connection drops mid-sync |

## When to run

After any session that:
- Adds or renames `onclick`/`oninput`/`onchange` handlers (raw or in JS-built HTML strings)
- Adds new wizard steps or restructures step flow
- Renames or removes functions called from buttons
- Adds any Supabase sync function with DELETE + INSERT
- Adds any new `var` declarations in complex rendering functions
- Uses `JSON.stringify` anywhere near HTML string building
