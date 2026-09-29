import React, { useState } from 'react';
import {
  Waves,
  Flame,
  Radio,
  Wind,
  Biohazard,
  Sun,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Package,
  HeartPulse,
  Printer,
  Search,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

interface GuidelineCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  summary: string;
  dos: string[];
  donts: string[];
  steps: { title: string; desc: string }[];
}

const GUIDELINES: GuidelineCategory[] = [
  {
    id: 'flood',
    name: 'Monsoon Floods & River Breaches',
    icon: Waves,
    color: 'from-blue-600 to-cyan-600',
    summary: 'Rapid inundation from monsoon cloudbursts, river breaches (Yamuna, Ganga, Brahmaputra), or barrage outflows.',
    dos: [
      'Immediately move to higher ground or municipal flood shelter relief camps, avoiding basements.',
      'Turn off main electricity MCB, domestic LPG cylinder regulator, and water valves before water enters.',
      'Listen to official All India Radio (AIR), Doordarshan, and NDMA / DDMA SMS sirens for evacuation corridors.',
      'Boil all tap water or use chlorine/halogen tablets until municipal water testing clears.',
    ],
    donts: [
      'DO NOT walk, swim, or drive through moving floodwaters. Just 15 cm of moving water can topple an adult.',
      'DO NOT touch submerged electrical poles, transformers, or stay near dangling wires.',
      'DO NOT consume open food grains or cooked items that came in contact with sewage-mixed floodwaters.',
      'DO NOT park two-wheelers or cars near storm drains, nullahs, or riverbank embankments.',
    ],
    steps: [
      { title: 'Immediate Evacuation', desc: 'Evacuate promptly via designated high-elevation arterial roads as instructed by NDRF/SDRF.' },
      { title: 'Vertical Refuge', desc: 'If cut off by rapid current, ascend to pucca roof. Keep bright cloth or mirror ready for IAF / NDRF choppers.' },
      { title: 'Signaling Responders', desc: 'Use whistle, flashlight, or high-visibility cloth to signal boats; call NDRF Control: 011-24363260 or 112.' },
    ],
  },
  {
    id: 'earthquake',
    name: 'Earthquake (BIS Zone IV & V)',
    icon: Radio,
    color: 'from-amber-600 to-yellow-600',
    summary: 'Ground tremors and shaking across Indian seismic fault lines (Himalayan belt, Delhi-NCR, Kutch).',
    dos: [
      'DROP to your hands and knees. COVER your head and neck under a sturdy wooden table. HOLD ON until shaking ceases.',
      'If outdoors, move into an open maidan away from high-rises, flyovers, metro tracks, and overhead electric wires.',
      'If driving, pull over to a safe curb away from overpasses and remain seated with handbrake engaged.',
      'Check family for injuries and switch off main LPG cylinder valve immediately.',
    ],
    donts: [
      'DO NOT rush towards crowded stairwells or use elevators during tremor vibrations.',
      'DO NOT stand under balcony cantilevers, parapets, or under glass facades of commercial plazas.',
      'DO NOT light agarbattis, matchsticks, or operate wall switches if gas leakage is suspected.',
      'DO NOT spread unverified social media rumors regarding earthquake prediction times.',
    ],
    steps: [
      { title: 'Drop, Cover, Hold On', desc: 'Protect vital cranial organs beneath heavy furniture or curl against an interior load-bearing column.' },
      { title: 'Aftershock Readiness', desc: 'Expect secondary tremors within minutes or hours. Stay outside structurally compromised masonry.' },
      { title: 'Gas & Power Shutoff', desc: 'Isolate main electrical breaker and piped gas / cylinder valve before exiting to designated colony park.' },
    ],
  },
  {
    id: 'fire',
    name: 'Urban High-Rise & Electrical Fires',
    icon: Flame,
    color: 'from-red-600 to-rose-600',
    summary: 'Commercial complex, industrial warehouse, or residential high-rise fires and short-circuit blazes.',
    dos: [
      'Crawl low beneath toxic black smoke toward the illuminated emergency exit where cooler air remains.',
      'Check metal door handles with back of your hand before turning. If searing hot, seek alternate fire escape stairs.',
      'Close doors firmly behind you to starve oxygen and contain flame spread.',
      'If clothes catch fire: STOP, DROP to the ground, and ROLL over repeatedly to smother the flame.',
    ],
    donts: [
      'DO NOT use passenger lifts or glass elevators — electrical shafts act as natural chimneys for lethal smoke.',
      'DO NOT re-enter a burning building for cash, gold jewelry, or laptop bags under any circumstance.',
      'DO NOT throw water on electrical short circuits or burning oil pans; use dry chemical powder (ABC) extinguishers or sand.',
    ],
    steps: [
      { title: 'Trigger Alarm & Dial 101/112', desc: 'Break call point glass, alert floor wardens, and evacuate via designated fire escape stairway.' },
      { title: 'Low Crawl Protocol', desc: 'Keep nose and mouth 1 to 2 feet above the floor with a wet handkerchief or N95 mask.' },
      { title: 'Assembly Point Roll Call', desc: 'Assemble at the designated ground-level muster area; report any missing colleagues to Delhi Fire Service.' },
    ],
  },
  {
    id: 'cyclone',
    name: 'Coastal Super Cyclone & Storm Surge',
    icon: Wind,
    color: 'from-teal-600 to-emerald-600',
    summary: 'Gale-force cyclonic winds exceeding 120-180 km/h with tidal storm surges along coastal Indian states.',
    dos: [
      'Seek shelter in a pucca cyclone shelter, concrete interior room, or bathroom away from glass windows.',
      'Fasten storm shutters, board up window glass, and trim loose branches overhanging roofing.',
      'Fill drums and water tanks with drinking water before municipal pumping stations go offline.',
      'Keep mobile phones and emergency power banks charged; listen to IMD Cyclone Warning bulletins.',
    ],
    donts: [
      'DO NOT venture outdoors during the calm "eye" of the cyclone; the opposite winds will resume with lethal velocity.',
      'DO NOT cross swollen coastal causeways, fisherman jetties, or beach promenades.',
      'DO NOT ignore pre-cyclone evacuation alerts issued by District Magistrate / SDMA officials.',
    ],
    steps: [
      { title: 'Relocation to Pucca Shelter', desc: 'Kutcha houses and thatched roofs must be evacuated to multi-purpose cyclone shelters 24 hours prior to landfall.' },
      { title: 'Securing Survival Kit', desc: 'Pack dry sattu/chana, jaggery, matches, flashlight, battery radio, and Aadhaar/land papers in waterproof polybags.' },
      { title: 'Post-Landfall Safety', desc: 'Beware of displaced snakes, live downed cables, and contaminated wells after the cyclone passes.' },
    ],
  },
  {
    id: 'chemical',
    name: 'Chemical & Industrial HAZMAT Spills',
    icon: Biohazard,
    color: 'from-purple-600 to-indigo-600',
    summary: 'Toxic gas leakages (Ammonia, Chlorine, Methyl Isocyanate), industrial boiler explosions, or tanker collisions.',
    dos: [
      'Immediately shelter indoors: shut all windows, doors, and bathroom ventilation shafts tightly.',
      'Turn off split ACs, desert coolers, exhaust fans, and kitchen chimneys to prevent drawing fumes inside.',
      'Cover nose and mouth with a thick wet cloth or towel; water acts as an effective absorbent for many toxic gases.',
      'Move upwind and uphill perpendicular to the direction in which the chemical vapor cloud is drifting.',
    ],
    donts: [
      'DO NOT step outside into the street to take videos or investigate pungent odors or visible fog plumes.',
      'DO NOT take refuge in basements if dealing with heavier-than-air chemicals like Chlorine.',
      'DO NOT consume uncovered street foods, dairy products, or open well water near industrial zones.',
    ],
    steps: [
      { title: 'Seal Room Perimeter', desc: 'Tape damp bedsheets or duct tape along window crevices and door gaps in an upper floor room.' },
      { title: 'Eye & Skin Decontamination', desc: 'Flush burning eyes with generous volumes of clean water for 15 minutes; strip contaminated outer clothing.' },
      { title: 'Await Official All-Clear', desc: 'Do not open sealed rooms until NDMA or District Fire HAZMAT teams announce the sector is safe.' },
    ],
  },
  {
    id: 'heatwave',
    name: 'Extreme Heatwave (Loo) & Wet-Bulb Emergency',
    icon: Sun,
    color: 'from-orange-600 to-amber-600',
    summary: 'Scorching summer temperatures exceeding 45°C-48°C accompanied by dry north-westerly "Loo" winds.',
    dos: [
      'Remain indoors in cool shaded areas during peak hazard hours (11:30 AM to 04:30 PM).',
      'Drink plenty of water and traditional hydrating fluids (ORS, Chaas, Coconut water, Lemon water, Aam Panna).',
      'Wear loose-fitting, light-colored cotton clothing and cover head with gamcha, dupatta, or umbrella when stepping out.',
      'Keep water bowls outside for stray cows, birds, and community animals.',
    ],
    donts: [
      'NEVER leave infants, young children, or pets locked inside a parked vehicle, even for two minutes.',
      'DO NOT undertake strenuous construction labor or marathon running during peak afternoon heat.',
      'DO NOT consume stale roadside cut fruits, sugary carbonated beverages, or heavy oily snacks.',
    ],
    steps: [
      { title: 'Spot Heat Stroke Signs', desc: 'Body temp > 104°F, cessation of sweating with dry hot skin, rapid pounding pulse, dizziness, delirium.' },
      { title: 'Emergency Cooling', desc: 'Move patient to shade, apply ice packs or cold wet cloth to neck and armpits, fan vigorously, and dial 108 / 112.' },
    ],
  },
];

const INITIAL_GO_BAG = [
  { id: 'gb-1', text: 'Water: 3-4 liters per person per day (minimum 3-day supply)', category: 'Survival Essentials', checked: true },
  { id: 'gb-2', text: 'Dry high-energy food: Roasted chana, sattu, glucose biscuits, dry fruits + manual can opener', category: 'Survival Essentials', checked: true },
  { id: 'gb-3', text: 'Battery-powered AM/FM Radio for All India Radio (AIR) emergency broadcasts', category: 'Communications', checked: false },
  { id: 'gb-4', text: 'High-output LED torch with spare batteries / solar rechargeable lamp', category: 'Survival Essentials', checked: true },
  { id: 'gb-5', text: 'First Aid Kit: ORS packets, Paracetamol, Band-aids, Betadine, antiseptic wash, cotton', category: 'Medical', checked: true },
  { id: 'gb-6', text: 'Emergency whistle to alert NDRF / SDRF search teams from rooftops', category: 'Survival Essentials', checked: false },
  { id: 'gb-7', text: 'N95 dust masks to protect against smoke, dust, and debris particulate', category: 'Survival Essentials', checked: false },
  { id: 'gb-8', text: '7-day personal prescription medicines, BP/diabetes tablets + spare eyeglasses', category: 'Medical', checked: false },
  { id: 'gb-9', text: 'Multi-tool pocket knife with rope, thick cotton twine, and heavy work gloves', category: 'Tools', checked: false },
  { id: 'gb-10', text: 'Waterproof pouch with photocopies of Aadhaar Card, PAN, Ration card, property papers', category: 'Documents', checked: false },
  { id: 'gb-11', text: 'Thermal foil blanket and light cotton bedsheet / raincoat', category: 'Survival Essentials', checked: true },
  { id: 'gb-12', text: 'Cash in small Indian Rupee notes (₹50, ₹100, ₹500) as ATMs & UPI fail during power grid blackouts', category: 'Documents', checked: false },
];

export const EmergencyGuidelines: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('flood');
  const [goBagItems, setGoBagItems] = useState(INITIAL_GO_BAG);
  const [searchFilter, setSearchFilter] = useState('');

  const toggleItem = (id: string) => {
    setGoBagItems(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = goBagItems.filter(i => i.checked).length;
  const readinessPercent = Math.round((checkedCount / goBagItems.length) * 100);

  const selectedCategory = GUIDELINES.find(g => g.id === activeTab) || GUIDELINES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Civilian Readiness & Protocol Manual
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Disaster Survival Guidelines</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Official emergency protocols, life-saving do’s and don’ts, and an interactive 72-hour survival kit builder.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Printer className="w-4 h-4 text-slate-400" />
          <span>Print Survival Checklist</span>
        </button>
      </div>

      {/* 72-Hour Emergency Go-Bag Interactive Kit */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-750 border-slate-700 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                72-Hour Emergency Go-Bag Kit Builder
              </h2>
              <p className="text-xs text-slate-400">
                Check off items you currently have assembled in your home emergency kit.
              </p>
            </div>
          </div>

          {/* Readiness Score Progress */}
          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">Kit Readiness Score</span>
              <span className="font-bold text-amber-400">{readinessPercent}% Ready ({checkedCount}/{goBagItems.length})</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  readinessPercent >= 80
                    ? 'bg-emerald-500'
                    : readinessPercent >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checkbox Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {goBagItems.map(item => (
            <label
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                item.checked
                  ? 'bg-slate-800/90 border-emerald-500/50 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}}
                className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 h-4 w-4 bg-slate-800"
              />
              <div className="text-xs">
                <span className={`block font-medium ${item.checked ? 'text-slate-100 line-through opacity-85' : 'text-slate-300'}`}>
                  {item.text}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {item.category}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Disaster Categories Tab Navigation */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Select Disaster Classification Protocol
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {GUIDELINES.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-red-500 text-white shadow-lg ring-1 ring-red-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold leading-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Category Detail Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${selectedCategory.color} text-white shadow-lg`}
            >
              <selectedCategory.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Official Standard Operating Procedure
              </span>
              <h3 className="text-2xl font-black text-white">{selectedCategory.name}</h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-md">{selectedCategory.summary}</p>
        </div>

        {/* Do's and Don'ts side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DO's */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 shadow-inner">
            <h4 className="text-emerald-400 font-bold text-sm flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              MANDATORY DO'S (ACTION PROTOCOLS)
            </h4>
            <ul className="space-y-3">
              {selectedCategory.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-emerald-100/90 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DONT's */}
          <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5 shadow-inner">
            <h4 className="text-red-400 font-bold text-sm flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-400" />
              CRITICAL DON'TS (LETHAL MISTAKES)
            </h4>
            <ul className="space-y-3">
              {selectedCategory.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-red-100/90 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-red-500/30 text-red-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step-by-Step Response Phases */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Execution Phases
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedCategory.steps.map((step, idx) => (
              <div key={idx} className="bg-slate-800/70 border border-slate-750 border-slate-700/80 rounded-xl p-4">
                <span className="text-xs font-mono font-bold text-red-400 block mb-1">
                  PHASE 0{idx + 1}
                </span>
                <h5 className="font-bold text-white text-sm mb-1">{step.title}</h5>
                <p className="text-slate-300 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency First Aid Cheat Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
          <HeartPulse className="w-4 h-4 animate-pulse" />
          <span>Immediate Trauma & First Aid Triage</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-4">Life-Threatening Injury Interventions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-white mb-1">Severe Bleeding</div>
            <p className="text-slate-300 leading-relaxed">
              Apply continuous firm direct pressure with clean cloth. Do not remove saturated dressing; place additional layers over top. Apply tourniquet 2 inches above wound if limb arterial hemorrhage is observed.
            </p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-white mb-1">Adult CPR (Hands-Only)</div>
            <p className="text-slate-300 leading-relaxed">
              Call 112 / 108. Push hard and fast in the center of the chest to the beat of "Stayin' Alive" (100–120 compressions per minute). Allow full chest recoil.
            </p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-white mb-1">Burn Management</div>
            <p className="text-slate-300 leading-relaxed">
              Cool burn under cool running clean water for 10–20 minutes. Do NOT apply ice, butter, or ointments. Cover loosely with sterile, non-adherent dressing.
            </p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="font-bold text-white mb-1">Treating Shock</div>
            <p className="text-slate-300 leading-relaxed">
              Lay the person flat and elevate their legs 12 inches if no spinal injury is suspected. Keep them warm with foil blanket. Do not give fluids by mouth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
