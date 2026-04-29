'use strict';
/* ─────────────────────────────────────────────────────────────────────────────
   Thorofare — Help Content Registry
   Single source of truth for all in-app help text.
   When you add a feature, add its help topic here in the same pass.

   Structure:
     HELP_CONTENT.public    — visible to anyone, no login needed
     HELP_CONTENT.scribe    — score-entry operators at the show
     HELP_CONTENT.secretary — show management, full system guide

   Each section has: id, label, icon, title, intro, topics[]
   Each topic has:   id, title, body (HTML string)
───────────────────────────────────────────────────────────────────────────── */

var HELP_CONTENT = {

  meta: {
    appName:  'Thorofare',
    byline:   'by TwoTop',
    updated:  'April 2026'
  },

  // ════════════════════════════════════════════════════════════
  //  PUBLIC
  // ════════════════════════════════════════════════════════════
  public: {
    label: 'Participant / Public',
    icon:  '🏆',
    sections: [

      {
        id:    'about',
        label: 'About Thorofare',
        icon:  '📖',
        title: 'About Thorofare',
        intro: '<p>Thorofare is a web-based show management system for ranch horse competitions. It handles entries, scoring, results, season standings, and All Around points for shows that run under one or more associations — CoWN, NRHA, VRH, NRCHA, APHA, NCHA, and more.</p>',
        topics: [
          {
            id:    'what-is-thorofare',
            title: 'What is Thorofare?',
            body:  `
<p>Thorofare is the software behind the scenes at ranch horse shows that use this system. It connects three groups of people:</p>
<ul>
  <li><strong>Participants</strong> — competitors who want to see their scores, placings, and season points.</li>
  <li><strong>Scribes</strong> — the people at the show entering scores in real time.</li>
  <li><strong>Show secretaries</strong> — the people running the show: managing entries, importing results, and publishing standings.</li>
</ul>
<p>If you're here as a participant, you're in the right place to look up results and standings.</p>`
          },
          {
            id:    'who-runs-it',
            title: 'Who runs Thorofare?',
            body:  `
<p>Thorofare is developed by TwoTop and used by show-producing organizations that license it for their events. Each show organization manages its own data. If you have a question about a specific show's results or entry process, contact that show's secretary directly.</p>`
          }
        ]
      },

      {
        id:    'results',
        label: 'Finding Results',
        icon:  '🏇',
        title: 'Finding Show Results',
        intro: '<p>How to look up results for a specific show, class, or rider.</p>',
        topics: [
          {
            id:    'view-results',
            title: 'How do I find my results?',
            body:  `
<p>Results are published by the show secretary after each class runs. To find your results:</p>
<ol>
  <li>Go to the show's Thorofare page (your show organizer will share the link).</li>
  <li>Select the show from the list.</li>
  <li>Browse by class, or search for your name or horse.</li>
</ol>
<p>Results are public — you don't need an account to view them.</p>`
          },
          {
            id:    'results-not-posted',
            title: 'Results aren\'t posted yet — what\'s happening?',
            body:  `
<p>Results are posted by the secretary after each class is reviewed and finalized. During a busy show day, there may be a delay between when a class runs and when results appear. If a class ran hours ago and results still aren't posted, contact the show secretary.</p>`
          }
        ]
      },

      {
        id:    'standings',
        label: 'Season Standings',
        icon:  '★',
        title: 'Season Standings & Points',
        intro: '<p>How year-end points accumulate and where to find them.</p>',
        topics: [
          {
            id:    'what-are-points',
            title: 'What are season points?',
            body:  `
<p>Season points accumulate across all shows during the season. Each time you place in a class, you earn points based on how many horses competed and where you finished. At the end of the season, the rider with the most points in each division wins the year-end title.</p>
<p>Different associations use different point formulas — see the <strong>Points Systems</strong> section for a full breakdown of how each one works.</p>`
          },
          {
            id:    'view-standings',
            title: 'How do I view season standings?',
            body:  `
<p>Season standings are published on the Standings page. Your show organizer will share the link. Standings update after each show's results are finalized and submitted.</p>`
          }
        ]
      },

      {
        id:    'login',
        label: 'Accounts & Login',
        icon:  '🔑',
        title: 'Accounts & Login',
        intro: '<p>Information about accounts and accessing your personal data.</p>',
        topics: [
          {
            id:    'login-coming',
            title: 'Participant accounts',
            body:  `
<div class="help-note">Participant account login is coming in a future update. Currently, results and standings are publicly viewable without an account.</div>
<p>When accounts are available, you'll be able to:</p>
<ul>
  <li>See your full season history across all shows in one place</li>
  <li>Track your points toward year-end titles</li>
  <li>View your horse's competition record</li>
</ul>`
          }
        ]
      }

    ] // end public sections
  },


  // ════════════════════════════════════════════════════════════
  //  SCRIBE
  // ════════════════════════════════════════════════════════════
  scribe: {
    label: 'Scribe',
    icon:  '✏️',
    sections: [

      {
        id:    'scribe-role',
        label: 'Your Role',
        icon:  '✏️',
        title: 'Your Role as Scribe',
        intro: '<p>Everything you need to know before you sit down at the in-gate.</p>',
        topics: [
          {
            id:    'what-scribes-do',
            title: 'What does a scribe do?',
            body:  `
<p>A scribe's job is simple: enter scores for your assigned class as horses go. You're not managing the whole show — just your classes. The secretary handles everything else.</p>
<p>You'll be given access to one or more classes. For each horse that shows, you enter the judge's score. The system handles the rest: placing, points, All Around calculation, and publishing results.</p>`
          },
          {
            id:    'scribe-access',
            title: 'Getting access',
            body:  `
<p>The show secretary will give you a link to the scribe interface and an access code for your specific class. You'll use these to log in. You only see the classes you've been assigned — nothing else.</p>
<p>The scribe interface works on any phone, tablet, or laptop with a browser. No app to download.</p>`
          }
        ]
      },

      {
        id:    'entering-scores',
        label: 'Entering Scores',
        icon:  '📝',
        title: 'Entering Scores',
        intro: '<p>Step-by-step guide to entering scores during a class.</p>',
        topics: [
          {
            id:    'score-workflow',
            title: 'How to enter a score',
            body:  `
<ol>
  <li><strong>Select your class</strong> from the dropdown at the top of the screen. If you only have one class, it will already be selected.</li>
  <li><strong>Find the rider</strong> using the arrow buttons or by searching by name or back number.</li>
  <li><strong>Enter the score</strong> in the score field. Use the judge's score exactly — do not round or adjust.</li>
  <li><strong>Confirm the entry.</strong> The score is saved immediately.</li>
  <li>Move to the next rider.</li>
</ol>
<p>You can navigate between riders in any order — you don't have to go in back number sequence.</p>`
          },
          {
            id:    'score-scales',
            title: 'Score scales — what numbers to enter',
            body:  `
<p>Different associations use different scoring scales. Enter whatever the judge announces — the system knows which scale applies to each class.</p>
<table>
  <thead><tr><th>Association / Class Type</th><th>Scale</th><th>Average / Baseline</th></tr></thead>
  <tbody>
    <tr><td>Most ranch classes (CoWN, VRH, APHA, AQHA Ranch, NRCHA, NVRHA)</td><td>0–100</td><td>70 is average</td></tr>
    <tr><td>NCHA (Cutting)</td><td>60–80</td><td>70 is average</td></tr>
    <tr><td>NVRHA</td><td>0–10 per maneuver</td><td>7 is baseline</td></tr>
    <tr><td>ASHA (Novice &amp; Youth option)</td><td>1–10</td><td>Varies</td></tr>
  </tbody>
</table>
<p>If you're not sure which scale applies, ask the secretary before the class starts.</p>`
          },
          {
            id:    'multi-component',
            title: 'Multi-component classes (NRCHA, AQHA RHC)',
            body:  `
<p>Some classes have separate score fields for each component — for example, Reining and Cow Work are scored independently by the judge and entered separately.</p>
<p>When a class has multiple components, you'll see a separate entry field for each one. Enter each component's score exactly as the judge announces it. The system automatically adds them together to get the horse's total score.</p>
<div class="help-note">Multi-component score entry is coming in an upcoming update. Your secretary will let you know when this is active for your class.</div>`
          },
          {
            id:    'partial-score',
            title: 'Partial scores — when a horse scratches a component',
            body:  `
<p>Sometimes a horse completes one part of a class but scratches another. For example, they do the Reining but scratch the Cow Work.</p>
<p>This is fine — just enter the score for the component they completed and leave the other blank. The horse will still place based on their partial total. A partial score is not a disqualification.</p>`
          },
          {
            id:    'corrections',
            title: 'Making a correction',
            body:  `
<p>If you enter a wrong score, you can edit it as long as the class hasn't been finalized by the secretary. Find the rider in your class list, update the score, and save.</p>
<p>If you realize a mistake after the secretary has published results, contact the secretary immediately. They can re-open the class and correct it.</p>`
          }
        ]
      },

      {
        id:    'scribe-faq',
        label: 'Common Questions',
        icon:  '❓',
        title: 'Scribe FAQ',
        intro: '<p>Quick answers to common scribe questions.</p>',
        topics: [
          {
            id:    'scribe-q-order',
            title: 'Do I have to enter scores in order?',
            body:  '<p>No. You can enter scores in any order. Navigate to any rider in your list and enter their score when you\'re ready. The system doesn\'t care what order you go in.</p>'
          },
          {
            id:    'scribe-q-dq',
            title: 'What do I do if a horse is disqualified?',
            body:  '<p>Flag it using the DQ button next to that rider\'s entry. Do not enter a score. The secretary can also mark DQs — you don\'t have to catch everything. When in doubt, mark it and let the secretary review.</p>'
          },
          {
            id:    'scribe-q-op',
            title: 'What is an OP?',
            body:  '<p>OP stands for Off-Pattern. In a reining or pattern class, if a horse performs the wrong maneuver or skips part of the pattern, they receive a 0 for those maneuvers — but they still get a score, and that score is used for placing within the OP group (below all horses who completed the pattern correctly). Mark the entry as OP using the OP button. The system will automatically place OPs below clean runs.</p>'
          },
          {
            id:    'scribe-q-nointernet',
            title: 'What if I lose internet connection?',
            body:  '<p>Contact the secretary right away. The scribe interface requires a connection to save scores. If you go offline during a class, write scores down on paper and enter them when the connection is restored. Don\'t wait — enter them as soon as you\'re back online.</p>'
          },
          {
            id:    'scribe-q-multiclass',
            title: 'I\'m assigned to more than one class — how do I switch?',
            body:  '<p>Use the class dropdown at the top of the screen to switch between your assigned classes. Scores for each class are saved separately. You can switch back and forth at any time.</p>'
          }
        ]
      }

    ] // end scribe sections
  },


  // ════════════════════════════════════════════════════════════
  //  SECRETARY
  // ════════════════════════════════════════════════════════════
  secretary: {
    label: 'Show Secretary',
    icon:  '🖥️',
    sections: [

      // ── Start Here ──────────────────────────────────────────
      {
        id:    'start-here',
        label: 'Start Here',
        icon:  '🚀',
        title: 'Start Here — Your First Show',
        intro: '<p>New to Thorofare? Start here. This section walks you through the full show workflow from first login to published results.</p>',
        topics: [
          {
            id:    'what-thorofare-does',
            title: 'What Thorofare handles',
            body:  `
<p>Thorofare manages the whole lifecycle of a ranch horse show:</p>
<ul>
  <li><strong>Before the show:</strong> Entry management, class setup, association configuration</li>
  <li><strong>Show day:</strong> Score import from SHTX, manual score entry, real-time results</li>
  <li><strong>After the show:</strong> Season points, All Around standings, year-end totals</li>
</ul>
<p>It supports multiple associations running concurrently at the same show — so if your show runs CoWN and VRH at the same time, Thorofare handles both.</p>`
          },
          {
            id:    'show-flow',
            title: 'How a show flows through the system',
            body:  `
<p>Here's the typical sequence for a show:</p>
<ol>
  <li><strong>Create the show</strong> — name, date, venue, which associations are offered.</li>
  <li><strong>Build the class list</strong> — use the class wizard to generate all your division/discipline combinations, or add custom classes.</li>
  <li><strong>Import entries</strong> — pull in the Cognito Forms export CSV, or add entries manually.</li>
  <li><strong>Assign back numbers</strong> — manually or let the system auto-assign.</li>
  <li><strong>Show day: import results</strong> — as classes finish, import the SHTX result files. The system matches horses to entries and calculates points.</li>
  <li><strong>Review and correct</strong> — fix any name mismatches, mark DQs and OPs, re-rank if needed.</li>
  <li><strong>Publish</strong> — results go live for participants to view.</li>
  <li><strong>Close the show</strong> — season standings update automatically.</li>
</ol>`
          },
          {
            id:    'first-time-checklist',
            title: 'First-time setup checklist',
            body:  `
<p>Use this checklist the first time you set up a show:</p>
<ol>
  <li>☐ <strong>Create the show</strong> (Setup tab → New Show)</li>
  <li>☐ <strong>Add your organizations</strong> — which associations are running at this show</li>
  <li>☐ <strong>Build the class list</strong> — use the class wizard for each org, add any custom classes</li>
  <li>☐ <strong>Assign classes to days</strong> — if your show runs over multiple days</li>
  <li>☐ <strong>Import entries</strong> from Cognito Forms (Entries tab → Import)</li>
  <li>☐ <strong>Review entries</strong> — check for missing classes, name issues, or duplicates</li>
  <li>☐ <strong>Assign back numbers</strong></li>
</ol>
<p>On show day:</p>
<ol>
  <li>☐ As each class finishes, import the SHTX file (Results tab → Import SHTX)</li>
  <li>☐ Review each imported class — fix name matches, mark DQs/OPs</li>
  <li>☐ Publish results</li>
</ol>`
          },
          {
            id:    'nav-overview',
            title: 'Navigating the app — what each tab does',
            body:  `
<table>
  <thead><tr><th>Tab</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><strong>Entries</strong></td><td>Import, view, and manage show entries. Who's in which class.</td></tr>
    <tr><td><strong>Results</strong></td><td>Import SHTX files, enter scores manually, review placings and points per class.</td></tr>
    <tr><td><strong>Points Summary</strong></td><td>Season standings and All Around totals across all shows.</td></tr>
    <tr><td><strong>Tabs &amp; Payments</strong></td><td>Track money owed and collected — entry fees, added money, charges.</td></tr>
    <tr><td><strong>Setup</strong></td><td>Show configuration, class list, organization settings, association editor.</td></tr>
  </tbody>
</table>`
          }
        ]
      },

      // ── Show Setup ──────────────────────────────────────────
      {
        id:    'show-setup',
        label: 'Show Setup',
        icon:  '⚙️',
        title: 'Show Setup',
        intro: '<p>How to create and configure a show — organizations, classes, and scheduling.</p>',
        topics: [
          {
            id:    'creating-a-show',
            title: 'Creating a new show',
            body:  `
<p>Go to the <strong>Setup tab</strong> and click <strong>New Show</strong>. Fill in:</p>
<ul>
  <li><strong>Show name</strong> — what participants will see (e.g., "CoWN Summerfest 2026")</li>
  <li><strong>Date</strong> — start date of the show</li>
  <li><strong>Venue / Location</strong></li>
  <li><strong>Associations</strong> — which organizations are running at this show</li>
</ul>
<p>You can change any of this later. The show is created in <em>Setup</em> status, meaning entries and results are not yet open.</p>`
          },
          {
            id:    'show-status',
            title: 'Show status explained',
            body:  `
<table>
  <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><strong>Setup</strong></td><td>Show is being configured. Not visible to participants yet.</td></tr>
    <tr><td><strong>Entries Open</strong></td><td>Entries are being accepted. Participants can see the show exists.</td></tr>
    <tr><td><strong>Entries Closed</strong></td><td>No new entries. Show is preparing to run.</td></tr>
    <tr><td><strong>Running</strong></td><td>Show is actively running. Results are being posted as classes finish.</td></tr>
    <tr><td><strong>Complete</strong></td><td>Show is done. Results are final. Season points have been applied.</td></tr>
  </tbody>
</table>`
          },
          {
            id:    'adding-orgs',
            title: 'Adding organizations to a show',
            body:  `
<p>In the Setup tab, select which associations are running at this show. Each association you add will appear as an option when building your class list.</p>
<p>You can add multiple associations to one show — for example, CoWN and VRH and APHA all running concurrently. Classes from different associations can be linked as concurrent, meaning one run scores for all of them.</p>
<p>If you need an association that isn't in the list, you can create a custom organization in the association editor.</p>`
          },
          {
            id:    'class-wizard',
            title: 'Building your class list',
            body:  `
<p>The class wizard generates all your classes automatically from the organization's standard division and discipline list.</p>
<ol>
  <li>In the Setup tab, go to <strong>Classes</strong>.</li>
  <li>Select an organization.</li>
  <li>Choose which divisions and disciplines you're offering at this show (you don't have to offer all of them).</li>
  <li>Click <strong>Generate Classes</strong>. The system creates one class for every division × discipline combination you selected.</li>
</ol>
<p>After generating, you can add or remove individual classes, rename them, or add custom classes that don't follow the standard structure.</p>`
          },
          {
            id:    'day-assignment',
            title: 'Assigning classes to days',
            body:  `
<p>For multi-day shows, you can assign each class to a specific day. This helps with scheduling and lets participants know when their class runs.</p>
<p>In the class list, click a class and set its day. Classes with no day assigned are considered "unscheduled."</p>`
          }
        ]
      },

      // ── Classes & Divisions ─────────────────────────────────
      {
        id:    'classes',
        label: 'Classes & Divisions',
        icon:  '📂',
        title: 'Classes, Divisions & Disciplines',
        intro: '<p>Understanding how classes are structured in Thorofare.</p>',
        topics: [
          {
            id:    'what-is-a-class',
            title: 'What is a class?',
            body:  `
<p>In Thorofare, a <strong>class</strong> is one specific competitive group. Every class is defined by three things:</p>
<ul>
  <li><strong>Organization</strong> — which association sanctions it (CoWN, VRH, AQHA Ranch, etc.)</li>
  <li><strong>Division</strong> — the rider/horse eligibility group (Open, Non-Pro, Amateur, Youth, etc.)</li>
  <li><strong>Discipline</strong> — the event type (Cow Work, Reining, Ranch Riding, Cutting, etc.)</li>
</ul>
<p>Example: <em>CoWN / Open / Cow Work</em> is one class. <em>CoWN / Non-Pro / Reining</em> is a different class. Each class has its own entry list, scores, placings, and points.</p>`
          },
          {
            id:    'divisions-explained',
            title: 'Divisions explained',
            body:  `
<p>Divisions separate competitors by rider status, experience, or horse age. Common divisions across associations:</p>
<table>
  <thead><tr><th>Division</th><th>Who it's for</th></tr></thead>
  <tbody>
    <tr><td><strong>Open</strong></td><td>Any rider — professional, amateur, or anything in between. The most competitive division.</td></tr>
    <tr><td><strong>Non-Pro / Amateur</strong></td><td>Riders who do not receive pay for training or showing horses. Definitions vary slightly by association.</td></tr>
    <tr><td><strong>Limited / Intermediate</strong></td><td>Riders or horses with limited career points or earnings — a step below the main division.</td></tr>
    <tr><td><strong>Novice / Level 1</strong></td><td>Entry-level riders or horses with the fewest career points. True beginners in the association.</td></tr>
    <tr><td><strong>Youth</strong></td><td>Riders 18 years old or younger (age cutoff varies by association).</td></tr>
    <tr><td><strong>Junior Horse</strong></td><td>Horses 5 years old and under.</td></tr>
    <tr><td><strong>Senior Horse</strong></td><td>Horses 6 years old and older.</td></tr>
    <tr><td><strong>Cowboy</strong></td><td>Full-time employees of a working ranch (AQHA Ranch, VRH, AQHA RHC, NVRHA).</td></tr>
  </tbody>
</table>
<p>Each association defines its own divisions and eligibility rules. See the <strong>Association Reference</strong> section for the full division list per association.</p>`
          },
          {
            id:    'disciplines-explained',
            title: 'Disciplines explained',
            body:  `
<p>Disciplines are the events — what the horse and rider actually do in the arena. Common ranch horse disciplines:</p>
<table>
  <thead><tr><th>Discipline</th><th>What it is</th></tr></thead>
  <tbody>
    <tr><td><strong>Cow Work / Ranch Cow Work</strong></td><td>Working a cow — boxing, fence work, and roping depending on division. Tests the horse's natural cow sense and the rider's ability to direct that.</td></tr>
    <tr><td><strong>Reining / Ranch Reining</strong></td><td>A pattern class featuring spins, stops, circles, and lead changes. Tests athleticism and responsiveness.</td></tr>
    <tr><td><strong>Trail / Ranch Trail</strong></td><td>Navigating a course of obstacles — gates, log drags, bridges, backing. Tests agility and handiness.</td></tr>
    <tr><td><strong>Pleasure / Ranch Rail Pleasure</strong></td><td>A group class on the rail. All horses move together and are judged on their natural, forward, working gait. No individual patterns.</td></tr>
    <tr><td><strong>Cutting</strong></td><td>Separating and holding one cow from the herd without the rider using the reins.</td></tr>
    <tr><td><strong>Conformation</strong></td><td>A halter class evaluating the horse's physical structure and resemblance to the breed ideal.</td></tr>
  </tbody>
</table>`
          },
          {
            id:    'concurrent-classes',
            title: 'Concurrent classes',
            body:  `
<p>A <strong>concurrent class</strong> means one physical run counts for two or more classes simultaneously. This is common when:</p>
<ul>
  <li>A horse is entered in both CoWN and VRH at the same show — their one run and score applies to both.</li>
  <li>Within NRCHA, Open and Level 1 classes run together — one horse, one run, but they place in their specific division.</li>
  <li>APHA classes may run concurrent with CoWN or VRH.</li>
</ul>
<p>When classes are marked as concurrent in the setup, scores are shared automatically. You import or enter the score once, and it propagates to all linked classes.</p>
<div class="help-note">Full concurrent class management is coming in an upcoming update. Contact your show administrator for current workflow.</div>`
          },
          {
            id:    'custom-classes',
            title: 'Adding custom classes',
            body:  `
<p>If you need a class that isn't in the standard org configuration — a specialty class, a one-off jackpot, or something unique to your show — you can add it manually.</p>
<p>In the class list, click <strong>Add Custom Class</strong> and fill in the organization, division, and discipline name. Custom classes work exactly like standard classes for scoring and results, but they don't feed into the standard association's season points unless you configure them to.</p>`
          }
        ]
      },

      // ── Entries ─────────────────────────────────────────────
      {
        id:    'entries',
        label: 'Entries',
        icon:  '📋',
        title: 'Managing Entries',
        intro: '<p>How to import, review, and manage who\'s entered in your show.</p>',
        topics: [
          {
            id:    'cognito-import',
            title: 'Importing entries from Cognito Forms',
            body:  `
<p>If your show uses Cognito Forms for online entry, you can export the entries as a CSV and import them directly into Thorofare.</p>
<ol>
  <li>In Cognito, export your entries as a CSV file.</li>
  <li>In Thorofare, go to the <strong>Entries tab</strong> and click <strong>Import Entries</strong>.</li>
  <li>Select the CSV file from your computer.</li>
  <li>Map the columns — the system will try to auto-detect standard column names (rider name, horse name, class, back number, etc.). Review and correct any that didn't auto-match.</li>
  <li>Click <strong>Import</strong>. Entries are added to your show.</li>
</ol>
<p>Duplicate entries (same rider + horse + class) are flagged for your review. You can merge or delete duplicates before finalizing.</p>`
          },
          {
            id:    'manual-entry',
            title: 'Adding entries manually',
            body:  `
<p>For walk-up entries or late additions, go to the Entries tab and click <strong>Add Entry</strong>. Fill in:</p>
<ul>
  <li>Rider name</li>
  <li>Horse name</li>
  <li>Class (organization / division / discipline)</li>
  <li>Back number (or leave blank to assign later)</li>
  <li>Entry fee (optional)</li>
</ul>
<p>Manual entries work the same as imported entries for scoring and results.</p>`
          },
          {
            id:    'back-numbers',
            title: 'Back numbers',
            body:  `
<p>Back numbers are assigned per rider-horse combination, not per class. A rider and horse combination gets one back number that applies to all their classes at the show.</p>
<p>You can assign back numbers manually by editing any entry, or use auto-assign to number them in alphabetical or entry order.</p>`
          },
          {
            id:    'editing-entries',
            title: 'Editing an entry',
            body:  `
<p>Click any entry in the list to edit it. You can change the rider name, horse name, class assignments, back number, and payment status.</p>
<p>If you need to move an entry from one class to another, edit the entry and change the class. If the old class already has a result for that rider, you'll be prompted to handle that result before the move is complete.</p>`
          },
          {
            id:    'scratches',
            title: 'Scratches and withdrawals',
            body:  `
<p>If a horse scratches before their class runs, remove their entry from that specific class or mark them as scratched. They won't appear in the results for that class.</p>
<p>If a horse scratches mid-show (after some classes have already run), their completed classes stand. Only remove entries for classes that haven't run yet.</p>`
          }
        ]
      },

      // ── Results & Scoring ───────────────────────────────────
      {
        id:    'results',
        label: 'Results & Scoring',
        icon:  '🏇',
        title: 'Results & Scoring',
        intro: '<p>Importing scores, entering results manually, and managing class results.</p>',
        topics: [
          {
            id:    'shtx-import',
            title: 'Importing SHTX result files',
            body:  `
<p>SHTX (Show Horse Technology) is the scoring software used at many ranch horse shows. When a class finishes in SHTX, you can export the results and import them into Thorofare.</p>
<ol>
  <li>Export the completed class from SHTX as a CSV or Excel file.</li>
  <li>In Thorofare, go to the <strong>Results tab</strong> and click <strong>Import SHTX</strong>.</li>
  <li>Select the file. The system will read the rider names, scores, places, and points from the file.</li>
  <li><strong>Map the columns</strong> — the import wizard shows you what it found and lets you confirm or correct each column mapping (rider name, horse name, score, place, points, etc.).</li>
  <li>Click <strong>Import</strong>. Results appear in the class view.</li>
</ol>`
          },
          {
            id:    'name-matching',
            title: 'Name matching — linking SHTX results to entries',
            body:  `
<p>After import, Thorofare tries to automatically match each SHTX result row to a rider in your entry list. It compares names and horse names to find the right person.</p>
<p>Most matches happen automatically. When a name in the SHTX file doesn't exactly match your entry list, the row is flagged for manual review. Common reasons:</p>
<ul>
  <li>Different spelling ("Abbie" vs "Abbey")</li>
  <li>Nickname vs. full name</li>
  <li>Horse name entered differently</li>
</ul>
<p>For unmatched rows, click the match button and choose the correct entry from your list. The system remembers these matches for future imports from the same show.</p>
<p>If a name appears in SHTX but genuinely isn't in your entries (a walk-up entry you forgot to add), you can create a new entry from the result row using the <strong>+</strong> button next to that row.</p>`
          },
          {
            id:    'manual-scores',
            title: 'Entering scores manually',
            body:  `
<p>For shows where you're not using SHTX, or to supplement an SHTX import, you can enter scores directly in Thorofare.</p>
<ol>
  <li>Go to the <strong>Results tab</strong> and select the class.</li>
  <li>Click <strong>Add Row</strong> and select the rider from your entry list.</li>
  <li>Enter their score and place.</li>
  <li>Repeat for each rider.</li>
  <li>Click <strong>Re-Rank</strong> when all scores are entered — this recalculates places and points from scratch based on the scores you entered.</li>
</ol>`
          },
          {
            id:    'dq-op',
            title: 'Disqualifications (DQ) and Off-Patterns (OP)',
            body:  `
<p><strong>DQ (Disqualification):</strong> The horse is removed from competition for a rules violation. A DQ earns zero points and does not place. The horse still counts toward the total entry count for other horses' points calculations.</p>
<p><strong>OP (Off-Pattern):</strong> In a pattern class (reining, trail), a horse that performs the wrong maneuver or skips part of the pattern receives a 0 for those maneuvers and places in an OP group below all horses who completed the pattern correctly. OPs can still earn points if they placed above other OPs.</p>
<p>To mark a DQ or OP: click the entry in the class results and use the DQ or OP button. The system adjusts the placing and recalculates points automatically.</p>`
          },
          {
            id:    'rerank',
            title: 'Re-ranking a class',
            body:  `
<p>Re-ranking recalculates all places and points for a class from scratch using the current scores and your configured point formula. Use this when:</p>
<ul>
  <li>You've corrected a score after the initial import</li>
  <li>You've added or removed a DQ or OP</li>
  <li>You imported SHTX data and want Thorofare to recalculate using its own formula instead of SHTX's</li>
</ul>
<p>Click <strong>Re-Rank</strong> on any class. You'll see a confirmation prompt before the rerank happens, since it will overwrite the existing place and points values.</p>
<div class="help-warn">Re-ranking uses Thorofare's formula for that association. If the SHTX file had different point values, the rerank will overwrite them with Thorofare's calculation. Only re-rank when you want Thorofare to be the source of truth for points.</div>`
          }
        ]
      },

      // ── Standings & All Around ──────────────────────────────
      {
        id:    'standings',
        label: 'Standings & All Around',
        icon:  '★',
        title: 'Standings & All Around Points',
        intro: '<p>How season points accumulate and how All Around is calculated for each association.</p>',
        topics: [
          {
            id:    'season-points',
            title: 'How season points work',
            body:  `
<p>Every time a horse places in a class at a Thorofare-managed show, they earn points. Those points accumulate across all shows in the season. The rider with the most points in each division at the end of the season wins the year-end title for that division.</p>
<p>Points are awarded per class, per show. Points from one show are added to the running season total. The formula for how many points each placing earns depends on the association — see <strong>Points Systems</strong> for the full breakdown.</p>`
          },
          {
            id:    'all-around-concept',
            title: 'All Around — the general concept',
            body:  `
<p>The All Around recognizes the most versatile horse-and-rider combination at a show. Instead of just winning one discipline, All Around competitors must show in multiple disciplines, and their points from all of those classes are combined.</p>
<p>Think of it as a multi-event total score — like a decathlon for ranch horses. The horse that accumulates the most points across the required disciplines wins the All Around for their division at that show.</p>
<p>Not every association has an All Around. The ones that do each have slightly different rules about which classes count and how many you have to enter. See the per-association breakdowns below.</p>`
          },
          {
            id:    'aa-cown',
            title: 'CoWN All Around',
            body:  `
<p>CoWN's All Around is built into every show. Any rider who competes in at least one CoWN class is automatically tracked for All Around.</p>
<p><strong>How it works:</strong> Points from all four disciplines — Cow Work, Reining, Trail, and Pleasure — are added together. The horse with the highest combined total in their division wins the All Around for that show.</p>
<p><strong>Tiebreaker:</strong> If two horses tie on total All Around points, the tiebreaker goes to whoever had the higher <em>score</em> (not points) in Cow Work. If still tied, Reining score, then Trail, then Pleasure.</p>
<p><strong>Full season:</strong> All Around points from each show are also accumulated over the season, just like individual class points.</p>`
          },
          {
            id:    'aa-vrh',
            title: 'VRH All Around (50-Credit System)',
            body:  `
<p>VRH's All Around uses a two-layer system that may seem complex at first, but makes sense once you understand it:</p>
<p><strong>Layer 1 — Placement Points (standard entries-based):</strong> Each class uses the normal entries-based formula. 1st gets N points, 2nd gets N-1, etc.</p>
<p><strong>Layer 2 — All Around Credits:</strong> Among horses eligible for All Around, the one who placed highest in each class gets 50 credits. The next gets 49, then 48, and so on. These credits are totaled across all disciplines to find the All Around Champion for that show.</p>
<p><strong>Eligibility:</strong> To qualify for VRH All Around, a horse must show in at least 3 disciplines, and those disciplines must include Ranch Conformation <em>and</em> either Ranch Cutting or Ranch Cow Work.</p>`
          },
          {
            id:    'aa-aphc',
            title: 'ApHC All Around',
            body:  `
<p>ApHC's All Around sums points earned in qualifying classes at the show. Horses must show in at least 2 disciplines, including Ranch Conformation plus at least one performance class.</p>
<p><strong>Tiebreaker:</strong> Most first-place finishes. If still tied, placing in the pre-designated tiebreaker class for that show.</p>`
          },
          {
            id:    'aa-nvrha',
            title: 'NVRHA All Around (High-Point All Around)',
            body:  `
<p>NVRHA's All Around requires a horse to show in <em>all five</em> performance classes: Ranch Riding, Ranch Trail, Ranch Reining, Ranch Cutting, and Working Ranch Horse.</p>
<p>Points from all five classes are summed. The horse with the highest total Placement Points in their division wins the All Around for that division.</p>
<p><strong>Tiebreaker:</strong> Highest score in Working Ranch Horse. If still tied, highest score in Ranch Reining.</p>`
          },
          {
            id:    'aa-asha',
            title: 'ASHA All Around',
            body:  `
<p>ASHA's All Around sums points earned across the classes that are part of your show's tier (Tier 1 = 3 classes, Tier 2 = 4, Tier 3 = all 5). Horses must enter at least one cattle class (Cow Work or Cutting) to be eligible — except in Walk-Trot divisions.</p>`
          },
          {
            id:    'year-end',
            title: 'Year-end standings',
            body:  `
<p>Year-end standings are calculated automatically from all shows in the season. The Standings page shows current totals for each division and association.</p>
<p>You can export year-end standings as a spreadsheet from the Standings page. The export includes total points, show-by-show breakdown, and All Around totals.</p>`
          },
          {
            id:    'division-moveup',
            title: 'Division move-ups (NVRHA)',
            body:  `
<p>NVRHA automatically moves riders up to the next division when they accumulate enough Placement Points:</p>
<ul>
  <li><strong>Novice → Intermediate:</strong> when average score exceeds 220, or 60 Placement Points in the Novice division</li>
  <li><strong>Intermediate → Advanced/Amateur:</strong> when average score exceeds 250, or 60 Placement Points</li>
</ul>
<p>Move-ups take effect at the start of the following year. Thorofare tracks the point totals and flags riders who have hit the threshold so you can notify them before the season ends.</p>`
          }
        ]
      },

      // ── Association Reference ───────────────────────────────
      {
        id:    'associations',
        label: 'Association Reference',
        icon:  '📖',
        title: 'Association Reference',
        intro: '<p>Plain-English guide to every association in Thorofare — what they are, who they\'re for, and how their scoring works.</p>',
        topics: [
          {
            id:    'assoc-cown',
            title: 'CoWN — Colorado Working Ranch Horse (Stock Horse)',
            body:  `
<p>CoWN is the home association for most shows run by TwoTop. It's a comprehensive stock horse program that tests horses in four disciplines: Cow Work, Reining, Trail, and Pleasure.</p>
<p><strong>Divisions:</strong> Open, Non-Pro, Limited, Intermediate, Novice, L1 Novice, Youth, Novice Youth, Open Jr Horse, Non-Pro Jr Horse, Non-Pro Boxing, and several Collegiate and Schooling divisions.</p>
<p><strong>Scoring:</strong> 70-point base scale. Points are entries-based (1st earns N points, where N = number of horses in the class).</p>
<p><strong>All Around:</strong> Yes — all four disciplines combined. Tiebreaker by Cow Work score.</p>`
          },
          {
            id:    'assoc-vrh',
            title: 'VRH — AQHA Versatility Ranch Horse',
            body:  `
<p>VRH is the AQHA's comprehensive ranch horse program. It tests horses in five performance disciplines plus Conformation, and places a strong emphasis on versatility across all events.</p>
<p><strong>Divisions:</strong> Open (Jr/Sr horse), Amateur, Limited Amateur, Youth, Limited Youth, Cowboy, Rookie.</p>
<p><strong>Disciplines:</strong> Ranch Riding, Ranch Trail, Ranch Reining, Ranch Cutting, Ranch Cow Work, Ranch Conformation.</p>
<p><strong>Limited Amateur note:</strong> Cow Work is restricted to boxing and driving the cow down the fence — no roping or circling.</p>
<p><strong>Scoring:</strong> 70-point base. Points are entries-based for individual classes. All Around uses a 50-credit ranking system on top of that (see All Around section).</p>
<p><strong>All Around:</strong> Yes — minimum 3 disciplines including Conformation + (Cutting or Cow Work).</p>`
          },
          {
            id:    'assoc-aqha-ranch',
            title: 'AQHA Ranch',
            body:  `
<p>AQHA Ranch is AQHA's standalone ranch riding program — four classes that test everyday ranch horse skills. Less intensive than VRH (no cow work classes).</p>
<p><strong>Divisions:</strong> Open (Jr/Sr horse), Amateur, Level 1 Amateur, Youth, Level 1 Youth, Cowboy.</p>
<p><strong>Disciplines:</strong> Ranch Riding, Ranch Trail, Ranch Rail Pleasure, Ranch Conformation.</p>
<p><strong>Scoring:</strong> 70-point base (±1.5 per maneuver). AQHA tiered points formula. Points are per judge — in a 2-judge show, all points double.</p>
<p><strong>Note:</strong> A horse cannot show in both Ranch Riding and Western Pleasure at the same show. Ranch Trail and regular Trail cannot cross-enter either.</p>`
          },
          {
            id:    'assoc-rhc',
            title: 'AQHA RHC — Ranching Heritage Challenge',
            body:  `
<p>RHC is AQHA's working ranch competition — the most practical, working-ranch-oriented event in the AQHA lineup. Classes simulate real ranch tasks including roping.</p>
<p><strong>Divisions:</strong> Open (4yo / 5-6yo / 7+), Cowboy, Amateur, Level 1 Amateur, Youth, Level 1 Youth.</p>
<p><strong>Disciplines:</strong> Working Ranch Horse (Reining + Cow Work combined), Ltd. Working Ranch Horse (box-drive only, no roping), Ranch Riding, Ranch Cutting, Ranching Heritage Rodeo (varies — may include barrel racing, team roping, steer stopping).</p>
<p><strong>Scoring:</strong> Place by score — no season points awarded at regional challenges. These are money events. AQHA points are <em>not</em> awarded at RHC.</p>
<p><strong>No All Around.</strong></p>`
          },
          {
            id:    'assoc-apha',
            title: 'APHA — American Paint Horse Association (Ranch Classes)',
            body:  `
<p>APHA is a breed registry for Paint horses. Thorofare supports APHA's ranch class program — the working-ranch portion of their show lineup.</p>
<p><strong>Divisions:</strong> Open, Amateur, Novice Amateur, Amateur Walk-Trot, Youth, Novice Youth, Youth Walk-Trot, Solid Paint-Bred (SPB).</p>
<p><strong>Solid Paint-Bred (SPB):</strong> Horses registered with APHA that are genetically Paint but don't show color markings. They compete in their own SPB bracket, which may run concurrent with the regular class.</p>
<p><strong>Disciplines:</strong> Ranch Riding, Ranch Trail, Ranch Reining, Ranch Cow Work, Ranch Cutting, Ranch Rail Pleasure.</p>
<p><strong>Scoring:</strong> 70-point scale. Points system TBD — check with APHA for current rules.</p>`
          },
          {
            id:    'assoc-nrha',
            title: 'NRHA — National Reining Horse Association',
            body:  `
<p>NRHA is the governing body for reining — a single-discipline sport focused exclusively on pattern work: spins, stops, circles, and lead changes.</p>
<p><strong>Classes:</strong> Open, Intermediate Open, Limited Open, Novice Horse, Non-Pro, Intermediate Non-Pro, Limited Non-Pro, Futurity (3yo), Derby (4-7yo), Maturity, Youth (13 &amp; Under / 14-18 / Short Stirrup), Entry Level (Green Reiner L1 &amp; L2, Ride &amp; Slide), Specialty (Rookie L1 &amp; L2, Prime Time 50+, Masters 60+).</p>
<p><strong>Discipline:</strong> Reining only.</p>
<p><strong>Scoring:</strong> Entries-based — 1st earns N points (where N = horses in class), 2nd earns N-1, etc. Year-end eligible classes are Weekend/Ancillary (Category 1) classes.</p>
<p><strong>Note:</strong> Open and Non-Pro classes are separated by lifetime earnings (LTE) thresholds. Intermediate and Limited classes are for horses or riders who have not yet exceeded certain career earnings.</p>`
          },
          {
            id:    'assoc-nrcha',
            title: 'NRCHA — National Reined Cow Horse Association',
            body:  `
<p>NRCHA combines reining and cow work into one competition. Horses are judged on both their reining and their ability to work cattle, and the scores are summed for a total.</p>
<p><strong>Event types:</strong></p>
<ul>
  <li><strong>LAE (Limited Aged Events):</strong> Futurity (3yo) and Derby/Classic (4/5yo). These include Reining + Cutting + Cow Work.</li>
  <li><strong>Ancillary Horse Show:</strong> Bridle, Hackamore, Two-Rein, Boxing, Box-Drive, Youth Bridle. These include Reining + Cow Work (no Cutting).</li>
  <li><strong>Specialty Events:</strong> Spectaculars and Cowboy Class.</li>
</ul>
<p><strong>Scoring:</strong> 70-point scale. Each component (Reining, Cow Work, Cutting where applicable) is scored separately and summed for the total. Points are entries-based.</p>
<p><strong>Component scratch:</strong> A horse that completes Reining but scratches Cow Work still gets a score for the Reining component and places based on their partial total — not a full DQ.</p>
<p><strong>Note:</strong> NRCHA is available in Thorofare for show producers who run NRCHA-sanctioned events.</p>`
          },
          {
            id:    'assoc-ncha',
            title: 'NCHA — National Cutting Horse Association',
            body:  `
<p>NCHA is the governing body for cutting — the discipline where the horse separates and holds a single cow from the herd entirely on its own, with the rider dropping the reins.</p>
<p><strong>Classes:</strong> Open / Intermediate Open / Limited Open, Non-Pro / Intermediate NP / Limited NP, Amateur / Intermediate Amateur / Limited Amateur, Novice Horse ($25k and $5k), Novice Horse Non-Pro, Junior Youth, Senior Youth, Limited Rider, LAE (Futurity 3yo, Derby 4yo, Classic/Maturity 5-6yo).</p>
<p><strong>Scoring:</strong> 60–80 points (70 = average). Fixed Top-10 points formula — 1st always gets 10 points, 2nd gets 9, down to 10th getting 1. Below 10th gets 0. Score of 0 earns no points regardless of placing. Minimum 10 horses for any points.</p>
<p><strong>Note:</strong> NCHA is primarily a money sport nationally. The fixed-10 point formula applies to NCHA circuit and year-end standings.</p>`
          },
          {
            id:    'assoc-aphc',
            title: 'ApHC — Appaloosa Horse Club',
            body:  `
<p>ApHC is the breed registry for Appaloosa horses. Their ranch program mirrors VRH in structure — multiple disciplines combining into an All Around.</p>
<p><strong>Divisions:</strong> Open Junior (≤5yo), Open Senior (≥6yo), Non-Pro, Non-Pro 35+, Non-Pro Masters (50+), Novice Non-Pro (&lt;30 career pts), Youth, Novice Youth (&lt;20 pts/class).</p>
<p><strong>Disciplines:</strong> Ranch Riding, Ranch Trail, Ranch Rail Pleasure, Ranch Reining, Ranch Conformation, Ranch Cow Work, Limited Ranch Cow Work.</p>
<p><strong>Scoring:</strong> ApHC tiered lookup — points depend on the number of horses in the class. Only the top 6 places earn points. Maximum 12 points for 1st in a class of 18+.</p>
<p><strong>All Around:</strong> Yes — sum of points across qualifying classes. Must include Conformation + at least one performance class. Tiebreaker: most first-place finishes, then placing in tiebreaker class.</p>`
          },
          {
            id:    'assoc-nvrha',
            title: 'NVRHA — National Versatility Ranch Horse Association',
            body:  `
<p>NVRHA is an independent versatility ranch horse association with a skill-based division system. Divisions are based on a horse-and-rider team's average score, not just experience level.</p>
<p><strong>Divisions:</strong> Open, Amateur, Intermediate Amateur, Limited Amateur, Novice Amateur, Youth Advanced, Youth Intermediate, Youth Limited, Youth Novice.</p>
<p><strong>Disciplines:</strong> Ranch Riding, Ranch Trail, Ranch Reining, Ranch Cutting, Working Ranch Horse, Ranch Conformation.</p>
<p><strong>Scoring:</strong> 0–10 per maneuver (7 = baseline, judges add or subtract up to 3). Off-Pattern = -7 for those maneuvers. Entries-based Placement Points for the All Around.</p>
<p><strong>Two point systems:</strong> Placement Points (entries-based, determines show All Around and division standings) and Championship Points (one point per five horses defeated, for lifetime achievement titles like Ranch Horse Supreme Champion).</p>
<p><strong>All Around:</strong> Must show in all 5 performance classes. Tiebreaker: Working Ranch Horse score, then Ranch Reining.</p>
<p><strong>Division advancement:</strong> Automatic when average score exceeds threshold (220 for Novice, 250 for Intermediate) by year-end.</p>`
          },
          {
            id:    'assoc-asha',
            title: 'ASHA — American Stock Horse Association',
            body:  `
<p>ASHA is an independent stock horse association offering a tiered show format. The number of classes offered (Tier 1, 2, or 3) is set by the show producer, giving flexibility for small and large shows alike.</p>
<p><strong>Divisions:</strong> Open, Limited Open, Amateur, Limited Amateur, Novice, Youth 14-18, Youth 8-13, Walk-Trot.</p>
<p><strong>Disciplines:</strong> Stock Horse Pleasure/Ranch Riding, Stock Horse Trail, Stock Horse Reining, Stock Horse Cow Work, Stock Horse Cutting.</p>
<p><strong>Show tiers:</strong> Tier 1 = Pleasure/Trail/Reining (3 classes); Tier 2 = +Cow Work or Cutting; Tier 3 = all 5 classes.</p>
<p><strong>Scoring:</strong> Two options — ASHA 1-10 system (recommended for Novice/Youth) or Standard 70 system (AQHA VRH rules). Entries+1 point formula (everyone earns at least 2 points).</p>
<p><strong>All Around:</strong> Points summed across the tier's classes. Must enter at least one cattle class (Cow Work or Cutting) except in Walk-Trot divisions.</p>`
          },
          {
            id:    'assoc-whsr',
            title: 'WHSR — Wyoming High School Rodeo',
            body:  `
<p>WHSR is the Wyoming High School Rodeo association. Thorofare supports WHSR for shows that run this alongside other associations.</p>
<p><strong>Disciplines:</strong> Cow Work, Reining.</p>
<p><strong>Points:</strong> Entries-based.</p>`
          },
          {
            id:    'assoc-jackpot',
            title: 'Jackpot Events',
            body:  `
<p>Jackpot classes are money events — the entry fees go into a pot that gets paid out to the top placings. There are no season points awarded.</p>
<p><strong>Typical jackpot classes:</strong> Ranch Riding, Cutting.</p>
<p><strong>Placing:</strong> By score — highest score wins. No points formula applied.</p>
<p>Jackpot results still appear in Thorofare and can be viewed by participants, but they don't affect year-end standings.</p>`
          }
        ]
      },

      // ── Points Systems ──────────────────────────────────────
      {
        id:    'points',
        label: 'Points Systems',
        icon:  '🔢',
        title: 'Points Systems — Plain English',
        intro: '<p>Every association has its own formula for awarding season points. Here\'s exactly how each one works, with examples.</p>',
        topics: [
          {
            id:    'points-overview',
            title: 'Which association uses which system?',
            body:  `
<table>
  <thead><tr><th>System</th><th>Used by</th></tr></thead>
  <tbody>
    <tr><td><strong>Entries-based</strong></td><td>CoWN, NRHA, VRH (class points), NRCHA, NVRHA (Placement Points)</td></tr>
    <tr><td><strong>Entries+1</strong></td><td>ASHA</td></tr>
    <tr><td><strong>AQHA Tiered</strong></td><td>AQHA Ranch, APHA</td></tr>
    <tr><td><strong>Fixed Top-10</strong></td><td>NCHA</td></tr>
    <tr><td><strong>ApHC Tiered Lookup</strong></td><td>ApHC (Appaloosa Horse Club)</td></tr>
    <tr><td><strong>Score-based / No Points</strong></td><td>AQHA RHC, Jackpot events</td></tr>
  </tbody>
</table>`
          },
          {
            id:    'points-entries',
            title: 'Entries-based points',
            body:  `
<p><strong>Used by: CoWN, NRHA, VRH, NRCHA, NVRHA</strong></p>
<p>Simple and fair: the winner earns points equal to how many horses competed. Second place earns one less. Third earns one less than that. And so on, all the way down to last place — who always earns at least 1 point.</p>
<p><strong>Formula:</strong> Points = (total entries) − (your place) + 1</p>
<p><strong>Example — 15 horses in the class:</strong></p>
<table>
  <thead><tr><th>Place</th><th>Points</th></tr></thead>
  <tbody>
    <tr><td>1st</td><td>15</td></tr>
    <tr><td>2nd</td><td>14</td></tr>
    <tr><td>3rd</td><td>13</td></tr>
    <tr><td>…</td><td>…</td></tr>
    <tr><td>14th</td><td>2</td></tr>
    <tr><td>15th</td><td>1</td></tr>
  </tbody>
</table>
<p><strong>Ties:</strong> When two horses tie for a placing, the points for the tied positions are added together and split evenly. Example — two horses tie for 3rd and 4th in a 15-horse class: 3rd normally earns 13, 4th normally earns 12. Tied horses each get (13+12) ÷ 2 = 12.5 points.</p>
<p><strong>DQ:</strong> A disqualified horse earns 0 points, but they still count toward the total entries — so other horses' points are not reduced by the DQ.</p>`
          },
          {
            id:    'points-aqha',
            title: 'AQHA tiered points',
            body:  `
<p><strong>Used by: AQHA Ranch, APHA</strong></p>
<p>AQHA's system rewards larger classes more generously. First, calculate the <strong>tier</strong> by dividing the number of entries by 5 and dropping any remainder. That tier number is the most points anyone can earn in that class.</p>
<p><strong>Formula:</strong> Tier = floor(entries ÷ 5). Then: 1st = tier pts, 2nd = tier-1, 3rd = tier-2, … next place = 0.5 pts, everyone below = 0 pts.</p>
<p><strong>Minimum: You need at least 5 horses for any points to be awarded.</strong></p>
<p><strong>Examples:</strong></p>
<table>
  <thead><tr><th>Class size</th><th>Tier</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th (½-pt place)</th></tr></thead>
  <tbody>
    <tr><td>5–9 horses</td><td>1</td><td>1 pt</td><td>0.5 pts</td><td>0</td><td>0</td></tr>
    <tr><td>10–14 horses</td><td>2</td><td>2 pts</td><td>1 pt</td><td>0.5 pts</td><td>0</td></tr>
    <tr><td>15–19 horses</td><td>3</td><td>3 pts</td><td>2 pts</td><td>1 pt</td><td>0.5 pts</td></tr>
    <tr><td>20–24 horses</td><td>4</td><td>4 pts</td><td>3 pts</td><td>2 pts</td><td>1 pt</td></tr>
    <tr><td>40+ horses</td><td>8+</td><td>8+ pts</td><td>…</td><td>…</td><td>…</td></tr>
  </tbody>
</table>
<p><strong>Multiple judges:</strong> With 2 judges, all point values double. With 3 judges, they triple. This is why AQHA points at big shows with multiple judges can be much larger than at small local shows.</p>`
          },
          {
            id:    'points-fixed10',
            title: 'Fixed Top-10 points (NCHA)',
            body:  `
<p><strong>Used by: NCHA</strong></p>
<p>The top 10 horses earn the same fixed points regardless of class size. 1st always gets 10, 2nd always gets 9, down to 10th getting 1. Everyone below 10th gets nothing.</p>
<p><strong>Two important rules:</strong></p>
<ul>
  <li>A score of zero earns zero points — even if you technically "placed" in the class.</li>
  <li>Your class needs at least 10 horses for any points to be awarded at all.</li>
</ul>
<table>
  <thead><tr><th>Place</th><th>Points</th></tr></thead>
  <tbody>
    <tr><td>1st</td><td>10</td></tr>
    <tr><td>2nd</td><td>9</td></tr>
    <tr><td>3rd</td><td>8</td></tr>
    <tr><td>4th</td><td>7</td></tr>
    <tr><td>5th</td><td>6</td></tr>
    <tr><td>6th</td><td>5</td></tr>
    <tr><td>7th</td><td>4</td></tr>
    <tr><td>8th</td><td>3</td></tr>
    <tr><td>9th</td><td>2</td></tr>
    <tr><td>10th</td><td>1</td></tr>
    <tr><td>11th and below</td><td>0</td></tr>
  </tbody>
</table>`
          },
          {
            id:    'points-entries-plus-one',
            title: 'Entries+1 points (ASHA)',
            body:  `
<p><strong>Used by: ASHA</strong></p>
<p>Nearly identical to entries-based, but everyone gets one extra point. The winner earns (entries + 1) points instead of just entries. Last place always earns 2 points — nobody walks away empty-handed.</p>
<p><strong>Example — 15 horses:</strong></p>
<table>
  <thead><tr><th>Place</th><th>Points</th></tr></thead>
  <tbody>
    <tr><td>1st</td><td>16 (15+1)</td></tr>
    <tr><td>2nd</td><td>15</td></tr>
    <tr><td>3rd</td><td>14</td></tr>
    <tr><td>…</td><td>…</td></tr>
    <tr><td>15th</td><td>2</td></tr>
  </tbody>
</table>
<p>Ties are split the same way as entries-based — tied positions pool their points and divide equally.</p>`
          },
          {
            id:    'points-aphc',
            title: 'ApHC tiered lookup points',
            body:  `
<p><strong>Used by: ApHC (Appaloosa Horse Club)</strong></p>
<p>ApHC uses a fixed table. The number of horses in your class determines which row applies, and your placing determines your points from that row. Only the top 6 places earn any points.</p>
<table>
  <thead><tr><th>Entries</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th><th>6th</th></tr></thead>
  <tbody>
    <tr><td>18 or more</td><td>12</td><td>10</td><td>8</td><td>6</td><td>4</td><td>2</td></tr>
    <tr><td>15–17</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td></tr>
    <tr><td>12–14</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td></tr>
    <tr><td>8–11</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td><td>0</td></tr>
    <tr><td>5–7</td><td>3</td><td>2</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>2–4</td><td>2</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
  </tbody>
</table>
<p>Example: You have 10 horses in a class (falls in the 8–11 row). 1st gets 4 points, 2nd gets 3, 3rd gets 2, 4th gets 1, 5th and below get nothing.</p>`
          },
          {
            id:    'points-none',
            title: 'Score-based placing / No season points (AQHA RHC, Jackpot)',
            body:  `
<p><strong>Used by: AQHA RHC, Jackpot events</strong></p>
<p>No season points are awarded. Placing is determined purely by score — highest score wins, and that's it. These are typically money events where the payout comes from the prize purse.</p>
<p>Results are still tracked in Thorofare and are visible to participants, but they don't feed into year-end standings.</p>`
          }
        ]
      },

      // ── Tabs & Payments ─────────────────────────────────────
      {
        id:    'payments',
        label: 'Tabs & Payments',
        icon:  '💳',
        title: 'Tabs & Payments',
        intro: '<p>Tracking entry fees, charges, and collections for your show.</p>',
        topics: [
          {
            id:    'payments-overview',
            title: 'Payments overview',
            body:  `
<p>The Tabs &amp; Payments tab tracks what each rider owes and what's been collected. It handles entry fees, class fees, added charges, and discounts.</p>
<div class="help-note">Full documentation for Tabs &amp; Payments is coming as this feature is finalized. Check back for updates.</div>`
          }
        ]
      }

    ] // end secretary sections
  }

}; // end HELP_CONTENT
