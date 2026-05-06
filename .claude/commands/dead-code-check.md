# Dead Code & Broken Reference Check

Scans app.html and entry-form.html for:
1. `onclick`/`oninput`/`onchange` handlers (in raw HTML **and** in JS-generated HTML strings) calling functions not defined in the file
2. Stale WIZ shape references that would crash the wizard
3. `_wizValidate()` called before `_wizSave()` in the same function (save must precede validate so DOM values are in WIZ.data first)

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
  const jsStrRe = /[\"'`]([^\"'`]*on(?:click|input|change|submit|blur|focus|keyup|keydown)[^\"'`]*)[\"'`]/g;
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
  // wizNext must save DOM values into WIZ.data before validating them
  const fnBodyRe = /(?:function\s+\w+|window\.\w+\s*=\s*(?:async\s+)?function)\s*\([^)]*\)\s*\{([^}]+)\}/g;
  while ((m = fnBodyRe.exec(fullJs)) !== null) {
    const body = m[1];
    const savePos = body.indexOf('_wizSave(');
    const valPos  = body.indexOf('_wizValidate(');
    if (savePos !== -1 && valPos !== -1 && valPos < savePos) {
      issues.push({ sev: 'CRITICAL', msg: '_wizValidate() called before _wizSave() — DOM values not in WIZ.data yet when validation runs' });
    }
  }

  return { issues, defined, handlerCalls };
}

['app.html', 'entry-form.html'].forEach(file => {
  console.log('\n' + '='.repeat(60));
  console.log('AUDIT: ' + file);
  console.log('='.repeat(60));
  try {
    const { issues, defined, handlerCalls } = auditFile(file);
    const crits = issues.filter(i => i.sev === 'CRITICAL');
    console.log('Functions defined: ' + defined.size + ' | Handler call sites scanned: ' + handlerCalls.size);
    if (crits.length) {
      console.log('\nCRITICAL — fix before committing:');
      crits.forEach(i => console.log('  X ' + i.msg));
    } else {
      console.log('  OK - no issues found');
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
| Handler → undefined function (HTML) | Raw `onclick=` in markup calling a missing function | `closeWizard()` after redirect |
| Handler → undefined function (JS strings) | `pkgBlock` / `extraBlock` / `renderFoo` generating HTML with `onclick=` calling a misnamed function | `wizAddStall` vs `wizAddstallingPackages` |
| Stale WIZ refs | Old wizard shape properties left in code | `WIZ.fees`, `WIZ.orgs`, `#wizard-overlay` |
| Validate-before-save | `_wizValidate()` runs before `_wizSave()` reads DOM | Show name required alert despite text entered |

## When to run

After any session that:
- Adds or renames `onclick`/`oninput` handlers (raw or in JS-built HTML strings)
- Adds new wizard steps or restructures step flow
- Renames or removes functions called from buttons
- Redirects entry-point functions (`openWizard`, `closeWizard`, etc.)
