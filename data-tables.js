// data-tables.js — static lookup tables for Thorofare/Gatepost
// Loaded before app.html script block via <script src="data-tables.js">
// DO NOT add functions or logic here — pure data only.


// ── Association org / division / discipline tables ──────────────────────

var COW_WORDS = [/\bcow\b/i, /\bcutting\b/i, /\bbox(ing)?\b/i, /\bworking\b/i];
var ORG_LIST = ['CoWN','VRH','AQHA Ranch','AQHA RHC','APHA','ApHC','NRHA','NRCHA','NCHA','NVRHA','ASHA','WHSR','Jackpot'];
var ORG_DIVISIONS = {
  'CoWN':       ['Open','Non-Pro','Limited','Intermediate','Novice','L1 Novice','Youth','Novice Youth','Open Jr Horse','Non-Pro Jr Horse','Non-Pro Boxing','Collegiate Non-Pro','Collegiate Limited','Collegiate Novice'],
  'VRH':        ['Open Jr Horse (≤5yo)','Open Sr Horse (≥6yo)','Amateur','Limited Amateur','Youth','Limited Youth','Cowboy','Rookie'],
  'AQHA Ranch': ['Open Jr (≤5yo)','Open Sr (≥6yo)','Amateur','Level 1 Amateur','Youth','Level 1 Youth','Cowboy'],
  'AQHA RHC':   ['Open 4yo','Open 5-6yo','Open 7+','Cowboy','Amateur','Level 1 Amateur','Youth','Level 1 Youth'],
  'APHA':       ['Open Jr (≤5yo)','Open Sr (≥6yo)','Amateur','Novice Amateur','Youth','Novice Youth','Solid Paint-Bred (SPB)'],
  'ApHC':       ['Open Jr (≤5yo)','Open Sr (≥6yo)','Non-Pro','Non-Pro 35+','Non-Pro Masters (50+)','Novice Non-Pro','Youth','Novice Youth'],
  'NRHA':       ['Open','Intermediate Open','Limited Open','Non-Pro','Intermediate Non-Pro','Limited Non-Pro','Youth 14-18','Youth 13 & Under','Rookie L1','Rookie L2','Prime Time (50+)','Green Reiner L1','Green Reiner L2','Ride & Slide'],
  'NRCHA':      ['Open','Intermediate Open','Limited Open','Non-Pro','Intermediate Non-Pro','Limited Non-Pro','NP Boxing','Level 1 NP Boxing','Youth Boxing','Youth 13 & Under Boxing','Box Drive Open','Box Drive Non-Pro'],
  'NCHA':       ['Open','Intermediate Open','Limited Open','Non-Pro','Intermediate Non-Pro','Limited Non-Pro','Amateur','Intermediate Amateur','Limited Amateur','Junior Youth (13 & Under)','Senior Youth (14-18)','Limited Rider'],
  'NVRHA':      ['Open','Amateur','Intermediate Amateur','Limited Amateur','Novice Amateur','Youth Advanced','Youth Intermediate','Youth Limited','Youth Novice'],
  'ASHA':       ['Open','Limited Open','Amateur','Limited Amateur','Novice','Youth 14-18','Youth 8-13','Walk-Trot'],
  'WHSR':       ['Open'],
  'Jackpot':    ['Open','Amateur','Youth'],
};
var ORG_DISCIPLINES = {
  'CoWN':       ['Cow Work','Reining','Trail','Pleasure'],
  'VRH':        ['Ranch Riding','Ranch Trail','Ranch Reining','Ranch Cutting','Ranch Cow Work'],
  'AQHA Ranch': ['Ranch Riding','Ranch Trail','Ranch Rail Pleasure'],
  'AQHA RHC':   ['Working Ranch Horse','Ranch Riding','Ranch Cutting'],
  'APHA':       ['Ranch Riding','Ranch Trail','Ranch Reining','Ranch Cow Work','Ranch Cutting','Ranch Rail Pleasure'],
  'ApHC':       ['Ranch Riding','Ranch Trail','Ranch Rail Pleasure','Ranch Reining','Ranch Cow Work'],
  'NRHA':       ['Reining'],
  'NRCHA':      ['Reining','Cow Work','Boxing','Box Drive'],
  'NCHA':       ['Cutting'],
  'NVRHA':      ['Ranch Riding','Ranch Trail','Ranch Reining','Ranch Cutting','Working Ranch Horse'],
  'ASHA':       ['Stock Horse Pleasure/Ranch Riding','Stock Horse Trail','Stock Horse Reining','Stock Horse Cow Work','Stock Horse Cutting'],
  'WHSR':       ['Cow Work','Reining'],
  'Jackpot':    ['Ranch Riding','Cutting'],
};
var ORG_REQUIRES_MEMBERSHIP = {
  'CoWN':true,'VRH':true,'AQHA Ranch':true,'AQHA RHC':true,'APHA':true,'ApHC':true,
  'NRHA':true,'NRCHA':true,'NCHA':true,'NVRHA':true,'ASHA':true,'WHSR':false,'Jackpot':false
};

// ── Canonical org/division/discipline structure ───────────────

var ORG_CLASSES = {

  'CoWN': {

    divisions: ['Open','Non-Pro','Limited','Intermediate','Novice','L1 Novice',

                'Youth','Novice Youth','Open Jr Horse','Non-Pro Jr Horse',

                'Non-Pro Boxing','Collegiate Non-Pro','Collegiate Limited',

                'Collegiate Novice','Open Schooling'],

    disciplines: ['Cow Work','Reining','Trail','Pleasure'],

    allAround: true,

    // Tiebreak: highest SCORE wins, in this discipline order

    aaTiebreak: ['Cow Work','Reining','Trail','Pleasure'],

    // Points: entries-based (1st=N, 2nd=N-1 … last=1, DQ=0, ties split)

    pointsSystem: 'entries'

  },

  'VRH': {
    divisions: ['Open','Amateur','Limited Amateur','Youth','Limited Youth','Cowboy','Rookie'],
    disciplines: ['Ranch Riding','Ranch Trail','Ranch Reining','Ranch Cutting','Ranch Cow Work','Ranch Conformation'],
    allAround: true,
    aaMinClasses: 3,
    aaRequired: [['Ranch Cutting','Ranch Cow Work'],['Ranch Conformation']],
    aaTiebreak: [],
    pointsSystem: 'entries',
    aaStyle: 'credits50'
  },

  'AQHA Ranch': {
    divisions: ['Open','Amateur','Level 1 Amateur','Youth','Level 1 Youth'],
    disciplines: ['Ranch Riding','Ranch Trail','Ranch Rail Pleasure'],
    allAround: false,
    pointsSystem: 'aqha'
  },

  'AQHA RHC': {
    divisions: ['Open 4yo','Open 5-6yo','Open 7+','Cowboy','Amateur','Level 1 Amateur','Youth','Level 1 Youth'],
    disciplines: ['Working Ranch Horse','Ltd. Working Ranch Horse','Ranch Riding','Ranch Cutting','Ranching Heritage Rodeo'],
    allAround: false,
    multiComponent: true,
    pointsSystem: 'none'
  },

  'APHA': {
    divisions: ['Open','Amateur','Novice Amateur','Amateur Walk-Trot','Youth','Novice Youth','Youth Walk-Trot','Solid Paint-Bred'],
    disciplines: ['Ranch Riding','Ranch Trail','Ranch Reining','Ranch Cow Work','Ranch Cutting','Ranch Rail Pleasure','Ranch Conformation'],
    allAround: false,
    pointsSystem: 'aqha'  // TBD — placeholder pending research
  },

  'NRHA': {
    divisions: [
      'Open','Intermediate Open','Limited Open','Novice Horse',
      'Non-Pro','Intermediate Non-Pro','Limited Non-Pro',
      'Futurity (3yo)','Derby (4-7yo)','Maturity',
      'Youth 13 & Under','Youth 14-18','Short Stirrup (10 & Under)',
      'Green Reiner L1','Green Reiner L2','Ride & Slide',
      'Rookie L1','Rookie L2','Prime Time (50+)','Masters (60+)'
    ],
    disciplines: ['Reining'],
    allAround: false,
    pointsSystem: 'entries'
  },

  'NRCHA': {
    divisions: [
      'LAE Futurity Open','LAE Futurity Intermediate','LAE Futurity Limited','LAE Futurity Level 1',
      'LAE Futurity Non-Pro','LAE Futurity Intermediate NP','LAE Futurity Limited NP','LAE Futurity NP Level 1',
      'LAE Futurity NP Boxing','LAE Futurity Level 1 NP Boxing','LAE Futurity Select',
      'LAE Derby Open','LAE Derby Intermediate','LAE Derby Limited','LAE Derby Level 1','LAE Derby Novice Horse',
      'LAE Derby Non-Pro','LAE Derby Intermediate NP','LAE Derby Limited NP','LAE Derby NP Level 1',
      'LAE Derby NP Boxing','LAE Derby Level 1 NP Boxing',
      'Open Bridle','Intermediate Open Bridle','Limited Open Bridle',
      'NP Bridle','Intermediate NP Bridle','Limited NP Bridle','Select Bridle',
      'Open Hackamore','Intermediate Open Hackamore','Limited Open Hackamore',
      'Non-Pro Hackamore','Intermediate NP Hackamore',
      'Open Two-Rein','Non-Pro Two-Rein',
      'NP Boxing','Level 1 NP Boxing','Select (55+)',
      'Youth Boxing','Youth 13 & Under Boxing',
      'Open Box-Drive','Non-Pro Box-Drive',
      'Youth Bridle','Youth 13 & Under Bridle',
      'Bridle Spectacular','Two-Rein Spectacular','Open Cowboy Class'
    ],
    disciplines: ['Reining','Cow Work','Cutting'],
    multiComponent: true,
    allAround: false,
    pointsSystem: 'entries'
  },

  'NCHA': {
    divisions: [
      'Open','Intermediate Open','Limited Open',
      'Non-Pro','Intermediate Non-Pro','Limited Non-Pro',
      'Amateur','Intermediate Amateur','Limited Amateur',
      'Novice Horse ($25k)','Novice Horse ($5k)','Novice Horse Non-Pro',
      'Junior Youth (13 & Under)','Senior Youth (14-18)',
      'Limited Rider',
      'Futurity (3yo)','Derby (4yo)','Classic/Maturity (5-6yo)'
    ],
    disciplines: ['Cutting'],
    allAround: false,
    pointsSystem: 'fixed10'
  },

  'ApHC': {
    divisions: ['Open Junior','Open Senior','Non-Pro','Non-Pro 35+','Non-Pro Masters (50+)','Novice Non-Pro','Youth','Novice Youth'],
    disciplines: ['Ranch Riding','Ranch Trail','Ranch Rail Pleasure','Ranch Reining','Ranch Conformation','Ranch Cow Work','Limited Ranch Cow Work'],
    allAround: true,
    aaMinClasses: 2,
    aaRequired: [['Ranch Conformation']],
    aaTiebreak: [],
    pointsSystem: 'aphc'
  },

  'NVRHA': {
    divisions: ['Open','Amateur','Intermediate Amateur','Limited Amateur','Novice Amateur','Youth Advanced','Youth Intermediate','Youth Limited','Youth Novice'],
    disciplines: ['Ranch Riding','Ranch Trail','Ranch Reining','Ranch Cutting','Working Ranch Horse','Ranch Conformation'],
    allAround: true,
    aaMinClasses: 5,
    aaTiebreak: ['Working Ranch Horse','Ranch Reining'],
    pointsSystem: 'entries'
  },

  'ASHA': {
    divisions: ['Open','Limited Open','Amateur','Limited Amateur','Novice','Youth 14-18','Youth 8-13','Walk-Trot'],
    disciplines: ['Stock Horse Pleasure/Ranch Riding','Stock Horse Trail','Stock Horse Reining','Stock Horse Cow Work','Stock Horse Cutting'],
    allAround: true,
    aaRequired: [['Stock Horse Cow Work','Stock Horse Cutting']],
    aaTiebreak: [],
    pointsSystem: 'entries+1'
  },

  'WHSR': {

    divisions: [''],

    disciplines: ['Cow Work','Reining'],

    allAround: false,

    pointsSystem: 'entries'

  },

  'Jackpot': {

    divisions: ['Open','Amateur','Youth'],

    disciplines: ['Ranch Riding','Cutting'],

    allAround: false,

    pointsSystem: 'none'  // jackpots are money events, no season points

  }

};

// Deep-copy of factory defaults — used to populate datalist suggestions in org editor

var DEFAULT_ORG_CLASSES = JSON.parse(JSON.stringify(ORG_CLASSES));


// ── ApHC tiered-lookup points table ────────────────────────────────────

var APHC_PTS_TABLE=[
  {min:18,pts:[12,10,8,6,4,2]},
  {min:15,pts:[6,5,4,3,2,1]},
  {min:12,pts:[5,4,3,2,1,0]},
  {min:8, pts:[4,3,2,1,0,0]},
  {min:5, pts:[3,2,1,0,0,0]},
  {min:2, pts:[2,1,0,0,0,0]}
];

var SHTX_DISCS = [

  [/\ball\s+aroun(?:d)?(?:\s+\d+)?$/i, 'All Around'],

  // ── AQHA RHC age-based disciplines (must come before generic "working ranch horse") ──

  [/\bcowboy\s+working\s+ranch\s+horse$/i, '4y/o+ Cowboy Working Ranch Horse'],

  [/\b4\s*y\/?\.?o\.?\+?\s+cowboy\s+working\s+ranch\s+horse$/i, '4y/o+ Cowboy Working Ranch Horse'],

  [/\bltd\.?\s+5\/?6\s*y\/?\.?o\.?\s+working\s+ranch\s+horse$/i, 'LTD 5/6 y/o Working Ranch Horse'],

  [/\bltd\.?\s+4\s*y\/?\.?o\.?\s+working\s+ranch\s+horse$/i, 'LTD 4 y/o Working Ranch Horse'],

  [/\b7\s*\+\s*y\/?\.?o\.?\s+working\s+ranch\s+horse$/i, '7+ y/o Working Ranch Horse'],

  [/\b5\/?6\s*y\/?\.?o\.?\s+working\s+ranch\s+horse$/i, '5/6 y/o Working Ranch Horse'],

  [/\b4\s*y\/?\.?o\.?\s+working\s+ranch\s+horse$/i, '4 y/o Working Ranch Horse'],

  [/\b3\s*y\/?\.?o\.?\+?\s+ranch\s+cutting$/i, '3 y/o+ Ranch Cutting'],

  [/\b3\s*y\/?\.?o\.?\+?\s+ranch\s+riding$/i, '3 y/o+ Ranch Riding'],

  [/\bworking\s+ranch\s+horse$/i, 'Working Ranch Horse'],

  [/\bworking\s+cow\s+horse$/i, 'Cow Horse'],   // APHA calls it "Cow Horse"

  [/\bcow\s+horse$/i, 'Cow Horse'],

  [/\bworking\s+cow(?:\s+\d+)?$/i, 'Cow Work'],

  [/\branch\s+cow\s+work$/i, 'Cow Work'],

  [/\bcow\s+work$/i, 'Cow Work'],

  [/^cow$/i, 'Cow Work'],

  [/\bworking\s+western\s+rail$/i, 'Working Western Rail'],

  [/\branch\s+conformation$/i, 'Conformation'],

  [/\bconformation$/i, 'Conformation'],

  [/\branch\s+cutting$/i, 'Ranch Cutting'],

  [/\bcutting$/i, 'Cutting'],

  [/\branch\s+reining$/i, 'Ranch Reining'],

  [/\branch\s+riding$/i, 'Ranch Riding'],

  [/\branch\s+trail$/i, 'Ranch Trail'],

  [/\branch\s+pleasure$/i, 'Ranch Pleasure'],

  [/\bvrh\s+all\s+around$/i, 'VRH All Around'],

  [/\bversatility\s+ranch\s+horse$/i, 'VRH All Around'],

  [/\bpleasure[r]?$/i, 'Pleasure'],

  [/\breining(?:\s+\d+)?$/i, 'Reining'],

  [/\btrail(?:\s+\d+)?$/i, 'Trail'],

  // Truncated SHTX exports (Funnware cuts long strings mid-word)

  [/\branch\s*pleasur$/i, 'Ranch Pleasure'],

  [/\branch\s*rein$/i, 'Ranch Reining'],

  [/\branch\s*rid$/i, 'Ranch Riding'],

  [/\branch\s*trai$/i, 'Ranch Trail'],

  [/\branch\s*cow\s*wor$/i, 'Cow Work'],

  [/\ball\s*arou?$/i, 'All Around'],

];

var SHTX_DIV = {

  // ── CoWN ──────────────────────────────────────────────────

  '':'Open','open':'Open',

  // Non-Pro

  'non pro':'Non-Pro','non-pro':'Non-Pro','nonpro':'Non-Pro',

  // Limited (CoWN calls it "Limited")

  'limited':'Limited','ltd':'Limited',

  'ltd non pro':'Limited','ltd non-pro':'Limited',

  'limited non pro':'Limited','limited non-pro':'Limited',

  'limited np':'Limited','ltd np':'Limited',

  // Intermediate

  'intermediate':'Intermediate','intermediate np':'Intermediate',

  // Novice

  'novice':'Novice',

  // L1 Novice

  'l1 novice':'L1 Novice','level 1 novice':'L1 Novice','l1':'L1 Novice',

  // Youth

  'youth':'Youth',

  // Novice Youth

  'novice youth':'Novice Youth','youth novice':'Novice Youth',

  // Jr Horse

  'open jr horse':'Open Jr Horse','open jr. horse':'Open Jr Horse','open jr':'Open Jr Horse',

  'jr horse':'Open Jr Horse','jr':'Open Jr Horse',

  'non pro jr horse':'Non-Pro Jr Horse','non-pro jr horse':'Non-Pro Jr Horse',

  'np jr horse':'Non-Pro Jr Horse','np jr. horse':'Non-Pro Jr Horse',

  'non pro jr':'Non-Pro Jr Horse','non-pro jr':'Non-Pro Jr Horse','np jr':'Non-Pro Jr Horse',

  // Boxing

  'non pro boxing':'Non-Pro Boxing','non-pro boxing':'Non-Pro Boxing','nonpro boxing':'Non-Pro Boxing',

  // Collegiate

  'collegiate non pro':'Collegiate Non-Pro','collegiate non-pro':'Collegiate Non-Pro',

  'collegiate nonpro':'Collegiate Non-Pro',

  'collegiate limited':'Collegiate Limited',

  'collegiate ltd non pro':'Collegiate Limited','collegiate ltd non-pro':'Collegiate Limited',

  'collegiate ltd':'Collegiate Limited',

  'collegiate novice':'Collegiate Novice',

  'collegiate':'Collegiate Non-Pro',

  // Schooling

  'open schooling':'Open Schooling','schooling':'Open Schooling',

  // ── VRH / AQHA Ranch ──────────────────────────────────────

  'amateur':'Amateur','amt':'Amateur',

  'ltd am':'LTD Am','ltd amateur':'LTD Am','limited amateur':'LTD Am','limited am':'LTD Am',
  'limited amt':'LTD Am',

  'rookie am':'Rookie Am','rookie amateur':'Rookie Am','rookie amt':'Rookie Am',

  'ltd youth':'LTD Youth','limited youth':'LTD Youth',

  'rookie youth':'Rookie Youth',

  // ── APHA ──────────────────────────────────────────────────

  'novice amateur':'Novice Amateur',

  // ── WHSR ──────────────────────────────────────────────────

  'high school':'High School','wyo hs':'High School','whsr':'High School',

};

var AA_PAYOUT_TABLE = [

  [],                           // 0 eligible

  [100],                        // 1

  [60,40],                      // 2

  [50,30,20],                   // 3

  [40,30,20,10],                // 4

  [35,25,20,12,8]               // 5+

];

// ─── Score Sheet Templates ────────────────────────────────────

// Every discipline tracks penalties per-maneuver.

// penValues = which penalty increments are available for that discipline.

var SCORE_TEMPLATES={

  'Reining':{

    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8','Maneuver 9'],

    penValues:[0.5,1,2,5], hasNRHA:true

  },

  'Trail':{

    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8','Maneuver 9'],

    penValues:[1,3,5], hasNRHA:true

  },

  'Pleasure':{

    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8','Maneuver 9'],

    penValues:[1,3,5], hasNRHA:true

  },

  'Cow Work':{

    maneuvers:['Boxing','Rating','Fence Turn L','Fence Turn R','Circling L','Circling R','Track & Rate','Stop & Hold','Position & Control','Degree of Diff.','Eye Appeal'],

    penValues:[1,2,3,5]

  },

  'BDBD Cow Work':{

    maneuvers:['Boxing','Drive (Run & Rate)','Boxing 2','Drive 2 (Run & Rate)','Position & Control','Degree of Difficulty','Eye Appeal','Courage'],

    penValues:[1,3,5]

  },

  'Novice Cow Work':{

    maneuvers:['Position & Control','Degree of Difficulty','Eye Appeal','Courage','Time Worked'],

    penValues:[1,3,5], hasComments:true

  },

  'Ranch Reining':{

    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8'],

    penValues:[0.5,1,2,5], hasNRHA:true

  },

  'Ranch Riding':{

    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8','Maneuver 9','Maneuver 10','Maneuver 11','Maneuver 12','Maneuver 13','Maneuver 14','Maneuver 15'],

    penValues:[1,3,5], hasNRHA:true

  },

  'Ranch Trail':{

    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8','Maneuver 9'],

    penValues:[1,3,5], hasNRHA:true

  },

  'Ranch Rail Pleasure':{

    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6'],

    penValues:[1,3,5], hasNRHA:true

  },

  'Cutting':{

    maneuvers:[
      'Cow 1 — Herd Work','Cow 1 — Cow Control','Cow 1 — Degree of Difficulty',
      'Cow 1 — Eye Appeal','Cow 1 — Courage','Cow 1 — Time Worked',
      'Cow 2 — Herd Work','Cow 2 — Cow Control','Cow 2 — Degree of Difficulty',
      'Cow 2 — Eye Appeal','Cow 2 — Courage','Cow 2 — Time Worked',
      'Cow 3 — Herd Work','Cow 3 — Cow Control','Cow 3 — Degree of Difficulty',
      'Cow 3 — Eye Appeal','Cow 3 — Courage','Cow 3 — Time Worked'
    ],

    scorePairs:[[-0.5,0.5,'√−','√+'],[-1,1,'−','+']],

    zeroLabel:'√',

    penValues:[1,3,5],

    cowCount:3, categoriesPerCow:6

  },

  'Ranch Cutting':{
    maneuvers:[
      'Cow 1 — Herd Work','Cow 1 — Control of Cow','Cow 1 — Degree of Difficulty','Cow 1 — Eye Appeal',
      'Cow 2 — Herd Work','Cow 2 — Control of Cow','Cow 2 — Degree of Difficulty','Cow 2 — Eye Appeal',
      'Courage'
    ],
    penValues:[1,3,5],
    cowCount:2, categoriesPerCow:4, postCowManeuvers:1
  },

  // ── APHA / ApHC association-specific templates ────────────────

  'Ranch Reining (APHA)':{
    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8','Maneuver 9','Maneuver 10'],
    penValues:[0.5,1,2,5], hasNRHA:true
  },

  'Ranch Reining (ApHC)':{
    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8','Maneuver 9'],
    penValues:[0.5,1,2,5]
  },

  'Ranch Riding (ApHC)':{
    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8','Maneuver 9','Maneuver 10','Maneuver 11','Maneuver 12'],
    penValues:[1,3,5]
  },

  'Ranch Trail (10)':{
    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8','Maneuver 9','Maneuver 10'],
    penValues:[1,3,5], hasNRHA:true
  },

  'Ranch Cutting (APHA)':{
    maneuvers:[
      'Cow 1 — Hard Work','Cow 1 — Control of Cow','Cow 1 — Degree of Difficulty','Cow 1 — Eye Appeal',
      'Cow 2 — Hard Work','Cow 2 — Control of Cow','Cow 2 — Degree of Difficulty','Cow 2 — Eye Appeal'
    ],
    penValues:[1,3,5], cowCount:2, categoriesPerCow:4
  },

  'Ranch Boxing':{
    maneuvers:['Approach','Position','Form & Correctness','Control','Degree of Difficulty','Eye Appeal','Time Worked'],
    penValues:[1,3,5]
  },

  'Ranch Box Drive':{
    maneuvers:['Boxing','Drive (Run & Rate)','Position & Control','Degree of Difficulty','Eye Appeal','Courage'],
    penValues:[1,3,5]
  },

  'ApHC Cow Work':{
    maneuvers:['Scouting','Drive/Rate/Rally','Boxing','Drive/Turn & Rally','Position & Control','Degree of Difficulty','Eye Appeal','Courage'],
    penValues:[1,3,5]
  },

  // ── NRCHA templates ───────────────────────────────────────────

  'NRCHA Reined Work':{
    maneuvers:['Maneuver 1','Maneuver 2','Maneuver 3','Maneuver 4','Maneuver 5','Maneuver 6','Maneuver 7','Maneuver 8'],
    penValues:[0.5,1,2,5]
  },

  'NRCHA Cow Work':{
    maneuvers:['Boxing','Rating','Form & Quality of Turns','Circling','Position & Control','Degree of Difficulty','Eye Appeal'],
    scorePairs:[[-2,2,'--','++'],[-1,1,'-','+'],[-.5,.5,'√-','√+']], zeroLabel:'√',
    penValues:[1,2,3,5]
  },

  'NRCHA Boxing':{
    maneuvers:['Approach','Position','Form & Correctness','Control','Degree of Difficulty','Eye Appeal','Time Worked'],
    scorePairs:[[-2,2,'--','++'],[-1,1,'-','+'],[-.5,.5,'√-','√+']], zeroLabel:'√',
    penValues:[1,3,5]
  },

  'NRCHA Box Drive':{
    maneuvers:['Boxing','Drive (Run & Rate)','Boxing 2','Drive 2 (Run & Rate)','Position & Control','Degree of Difficulty','Eye Appeal','Courage'],
    scorePairs:[[-2,2,'--','++'],[-1,1,'-','+'],[-.5,.5,'√-','√+']], zeroLabel:'√',
    penValues:[1,3,5]
  },

  'NRCHA Herd Work':{
    maneuvers:['Herd Work','Control of Cow','Degree of Difficulty','Eye Appeal','Cow Score','Working Time'],
    scorePairs:[[-2,2,'--','++'],[-1,1,'-','+'],[-.5,.5,'√-','√+']], zeroLabel:'√',
    penValues:[1,3,5]
  },

  'NRCHA Steer Stopping':{
    maneuvers:['Box','Run & Rate','Stop','Position','Eye Appeal','Degree of Difficulty','Loop'],
    penValues:[2,5]
  }

};