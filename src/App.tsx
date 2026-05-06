import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { unitType } from './constants/enums'
//import { Mek } from './files/mek';

import React, { useMemo, useState } from "react";
import {
  Menu,
  X,
  Search,
  Shield,
  Swords,
  Gauge,
  Flame,
  Crosshair,
  ChevronRight,
  User,
  BookOpen,
  Boxes,
  Flag,
  Home,
  Cpu,
  Weight,
  Zap,
  MapPin,
} from "lucide-react";

type PageKey =
  | "landing"
  | "about"
  | "faq"
  | "campaignTypes"
  | "guide"
  | "units"
  | "myForces"
  | "myCampaigns"
  | "myAccount";

type UnitType = "BattleMech" | "Vehicle" | "Infantry" | "Aerospace";
type UnitPanelMode = "slots" | "weapons" | "details";
type SortMode = "name" | "tonnage" | "bv" | "cost";

type CriticalSlot = {
  slot: number;
  item: string;
  type?: "weapon" | "ammo" | "equipment" | "engine" | "structure" | "empty";
};

type UnitLocation = {
  id: string;
  name: string;
  armor: number;
  rearArmor?: number;
  structure: number;
  slots: CriticalSlot[];
};

type UnitWeapon = {
  id: string;
  name: string;
  location: string;
  damage: number | string;
  heat: number;
  range: string;
  slots: number;
  ammo?: string;
  shots: number | "∞";
};

type Unit = {
  id: string;
  name: string;
  model: string;
  chassis: string;
  type: UnitType;
  techBase: "Inner Sphere" | "Clan" | "Mixed";
  era: string;
  year: number;
  tonnage: number;
  weightClass: "Light" | "Medium" | "Heavy" | "Assault";
  costCBills: number;
  rulesLevel: "Introductory" | "Standard" | "Advanced" | "Experimental";
  walk: number;
  run: number;
  jump: number;
  heatSinks: number;
  armor: number;
  structure: number;
  offensiveBV: number;
  defensiveBV: number;
  totalBV: number;
  role: string;
  engine: string;
  gyro: string;
  cockpit: string;
  sourceFile?: string;
  weapons: UnitWeapon[];
  locations: UnitLocation[];
};

const navItems: Array<{ key: PageKey; label: string; icon: React.ReactNode }> = [
  { key: "landing", label: "Home", icon: <Home size={17} /> },
  { key: "about", label: "About", icon: <Shield size={17} /> },
  { key: "guide", label: "Guide", icon: <BookOpen size={17} /> },
  { key: "units", label: "Units", icon: <Boxes size={17} /> },
  { key: "myForces", label: "My Forces", icon: <Swords size={17} /> },
  { key: "myCampaigns", label: "Campaigns", icon: <Flag size={17} /> },
  { key: "myAccount", label: "Account", icon: <User size={17} /> },
];

const aboutChildren: Array<{ key: PageKey; label: string }> = [
  { key: "faq", label: "FAQ" },
  { key: "campaignTypes", label: "Campaign Types" },
];

function makeMekLocations(config: {
  head: [number, number, string[]];
  ct: [number, number, number, string[]];
  rt: [number, number, number, string[]];
  lt: [number, number, number, string[]];
  ra: [number, number, string[]];
  la: [number, number, string[]];
  rl: [number, number, string[]];
  ll: [number, number, string[]];
}): UnitLocation[] {
  const slotType = (item: string): CriticalSlot["type"] => {
    const lower = item.toLowerCase();
    if (lower === "empty") return "empty";
    if (lower.includes("ammo")) return "ammo";
    if (["engine", "gyro", "cockpit", "life support", "sensors"].some((part) => lower.includes(part))) return "engine";
    if (["shoulder", "upper", "lower", "hand", "hip", "foot"].some((part) => lower.includes(part))) return "structure";
    if (["laser", "ac/", "rifle", "lrm", "srm", "machine gun", "ppc"].some((part) => lower.includes(part))) return "weapon";
    return "equipment";
  };

  const slots = (items: string[]) =>
    items.map((item, index) => ({
      slot: index + 1,
      item,
      type: slotType(item),
    }));

  return [
    { id: "head", name: "Head", armor: config.head[0], structure: config.head[1], slots: slots(config.head[2]) },
    { id: "ct", name: "Center Torso", armor: config.ct[0], rearArmor: config.ct[1], structure: config.ct[2], slots: slots(config.ct[3]) },
    { id: "rt", name: "Right Torso", armor: config.rt[0], rearArmor: config.rt[1], structure: config.rt[2], slots: slots(config.rt[3]) },
    { id: "lt", name: "Left Torso", armor: config.lt[0], rearArmor: config.lt[1], structure: config.lt[2], slots: slots(config.lt[3]) },
    { id: "ra", name: "Right Arm", armor: config.ra[0], structure: config.ra[1], slots: slots(config.ra[2]) },
    { id: "la", name: "Left Arm", armor: config.la[0], structure: config.la[1], slots: slots(config.la[2]) },
    { id: "rl", name: "Right Leg", armor: config.rl[0], structure: config.rl[1], slots: slots(config.rl[2]) },
    { id: "ll", name: "Left Leg", armor: config.ll[0], structure: config.ll[1], slots: slots(config.ll[2]) },
  ];
}

const sampleUnits: Unit[] = [
  {
    id: "pxh-1",
    name: "Phoenix Hawk",
    model: "PXH-1",
    chassis: "Earthwerks PXH",
    type: "BattleMech",
    techBase: "Inner Sphere",
    era: "IntroTech / 3025",
    year: 3025,
    tonnage: 45,
    weightClass: "Medium",
    costCBills: 3834700,
    rulesLevel: "Introductory",
    walk: 6,
    run: 9,
    jump: 6,
    heatSinks: 10,
    armor: 120,
    structure: 75,
    offensiveBV: 469,
    defensiveBV: 572,
    totalBV: 1041,
    role: "Mobile striker",
    engine: "270 Fusion",
    gyro: "Standard",
    cockpit: "Standard",
    sourceFile: "Phoenix Hawk PXH-1.rtf",
    weapons: [
      { id: "pxh-ll", name: "Large Laser", location: "Right Arm", damage: 8, heat: 8, range: "5 / 10 / 15", slots: 2, shots: "∞" },
      { id: "pxh-ml-1", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "pxh-ml-2", name: "Medium Laser", location: "Center Torso", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "pxh-mg-1", name: "Machine Gun", location: "Left Arm", damage: 2, heat: 0, range: "1 / 2 / 3", slots: 1, ammo: "MG Ammo", shots: 200 },
      { id: "pxh-mg-2", name: "Machine Gun", location: "Right Arm", damage: 2, heat: 0, range: "1 / 2 / 3", slots: 1, ammo: "MG Ammo", shots: 200 },
    ],
    locations: makeMekLocations({
      head: [9, 3, ["Life Support", "Sensors", "Cockpit", "Sensors", "Life Support", "Empty"]],
      ct: [24, 15, 16, ["Engine", "Engine", "Engine", "Gyro", "Gyro", "Gyro", "Gyro", "Engine", "Engine", "Engine", "Medium Laser", "MG Ammo"]],
      rt: [18, 6, 12, ["Jump Jet", "Jump Jet", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      lt: [18, 6, 12, ["Jump Jet", "Jump Jet", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      ra: [14, 8, ["Large Laser", "Large Laser", "Machine Gun", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      la: [14, 8, ["Medium Laser", "Machine Gun", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      rl: [12, 8, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Jump Jet", "Empty"]],
      ll: [12, 8, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Jump Jet", "Empty"]],
    }),
  },
  {
    id: "hgn-733",
    name: "Highlander",
    model: "HGN-733",
    chassis: "Star League XT",
    type: "BattleMech",
    techBase: "Inner Sphere",
    era: "IntroTech / 3025",
    year: 3025,
    tonnage: 90,
    weightClass: "Assault",
    costCBills: 8950000,
    rulesLevel: "Introductory",
    walk: 3,
    run: 5,
    jump: 3,
    heatSinks: 13,
    armor: 272,
    structure: 138,
    offensiveBV: 787,
    defensiveBV: 1013,
    totalBV: 1801,
    role: "Assault anchor",
    engine: "270 Fusion",
    gyro: "Standard",
    cockpit: "Standard",
    sourceFile: "Highlander HGN-733.rtf",
    weapons: [
      { id: "hgn-gauss", name: "Gauss Rifle", location: "Right Arm", damage: 15, heat: 1, range: "7 / 15 / 22", slots: 7, ammo: "Gauss Ammo", shots: 16 },
      { id: "hgn-lrm", name: "LRM 20", location: "Left Torso", damage: "20/m", heat: 6, range: "7 / 14 / 21", slots: 5, ammo: "LRM 20 Ammo", shots: 12 },
      { id: "hgn-srm", name: "SRM 6", location: "Right Torso", damage: "2/m", heat: 4, range: "3 / 6 / 9", slots: 2, ammo: "SRM 6 Ammo", shots: 15 },
      { id: "hgn-ml-1", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "hgn-ml-2", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
    ],
    locations: makeMekLocations({
      head: [9, 3, ["Life Support", "Sensors", "Cockpit", "Sensors", "Life Support", "Empty"]],
      ct: [47, 15, 29, ["Engine", "Engine", "Engine", "Gyro", "Gyro", "Gyro", "Gyro", "Engine", "Engine", "Engine", "Jump Jet", "Empty"]],
      rt: [32, 10, 19, ["SRM 6", "SRM 6", "SRM Ammo", "Heat Sink", "Heat Sink", "Jump Jet", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      lt: [32, 10, 19, ["LRM 20", "LRM 20", "LRM 20", "LRM 20", "LRM 20", "LRM Ammo", "LRM Ammo", "Jump Jet", "Empty", "Empty", "Empty", "Empty"]],
      ra: [30, 15, ["Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Rifle", "Gauss Ammo", "Shoulder", "Upper Arm", "Lower Arm", "Hand"]],
      la: [30, 15, ["Medium Laser", "Medium Laser", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      rl: [30, 15, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
      ll: [30, 15, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
    }),
  },
  {
    id: "hbkd-4g",
    name: "Hunchback",
    model: "HBK-4G",
    chassis: "Komiyaba Type VIII",
    type: "BattleMech",
    techBase: "Inner Sphere",
    era: "IntroTech / 3025",
    year: 3025,
    tonnage: 50,
    weightClass: "Medium",
    costCBills: 3437500,
    rulesLevel: "Introductory",
    walk: 4,
    run: 6,
    jump: 0,
    heatSinks: 13,
    armor: 160,
    structure: 83,
    offensiveBV: 620,
    defensiveBV: 421,
    totalBV: 1041,
    role: "Urban brawler",
    engine: "200 Fusion",
    gyro: "Standard",
    cockpit: "Standard",
    sourceFile: "Hunchback HBK-4G.rtf",
    weapons: [
      { id: "hbk-ac20", name: "AC/20", location: "Right Torso", damage: 20, heat: 7, range: "3 / 6 / 9", slots: 10, ammo: "AC/20 Ammo", shots: 10 },
      { id: "hbk-ml-1", name: "Medium Laser", location: "Right Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "hbk-ml-2", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "hbk-sl", name: "Small Laser", location: "Head", damage: 3, heat: 1, range: "1 / 2 / 3", slots: 1, shots: "∞" },
    ],
    locations: makeMekLocations({
      head: [9, 3, ["Life Support", "Sensors", "Cockpit", "Sensors", "Life Support", "Small Laser"]],
      ct: [23, 8, 16, ["Engine", "Engine", "Engine", "Gyro", "Gyro", "Gyro", "Gyro", "Engine", "Engine", "Engine", "Empty", "Empty"]],
      rt: [22, 8, 12, ["AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20", "AC/20 Ammo", "AC/20 Ammo"]],
      lt: [18, 6, 12, ["Heat Sink", "Heat Sink", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      ra: [16, 8, ["Medium Laser", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      la: [16, 8, ["Medium Laser", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      rl: [19, 8, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
      ll: [19, 8, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
    }),
  },
  {
    id: "wvr-6r",
    name: "Wolverine",
    model: "WVR-6R",
    chassis: "Crucis-A",
    type: "BattleMech",
    techBase: "Inner Sphere",
    era: "IntroTech / 3025",
    year: 3025,
    tonnage: 55,
    weightClass: "Medium",
    costCBills: 4810000,
    rulesLevel: "Introductory",
    walk: 5,
    run: 8,
    jump: 5,
    heatSinks: 12,
    armor: 169,
    structure: 91,
    offensiveBV: 492,
    defensiveBV: 609,
    totalBV: 1101,
    role: "Skirmisher",
    engine: "275 Fusion",
    gyro: "Standard",
    cockpit: "Standard",
    sourceFile: "Wolverine WVR-6R.rtf",
    weapons: [
      { id: "wvr-ac5", name: "AC/5", location: "Right Arm", damage: 5, heat: 1, range: "6 / 12 / 18", slots: 4, ammo: "AC/5 Ammo", shots: 20 },
      { id: "wvr-ml", name: "Medium Laser", location: "Left Arm", damage: 5, heat: 3, range: "3 / 6 / 9", slots: 1, shots: "∞" },
      { id: "wvr-srm", name: "SRM 6", location: "Left Torso", damage: "2/m", heat: 4, range: "3 / 6 / 9", slots: 2, ammo: "SRM 6 Ammo", shots: 15 },
    ],
    locations: makeMekLocations({
      head: [9, 3, ["Life Support", "Sensors", "Cockpit", "Sensors", "Life Support", "Empty"]],
      ct: [26, 8, 18, ["Engine", "Engine", "Engine", "Gyro", "Gyro", "Gyro", "Gyro", "Engine", "Engine", "Engine", "Jump Jet", "Empty"]],
      rt: [20, 6, 13, ["AC/5 Ammo", "Jump Jet", "Jump Jet", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      lt: [20, 6, 13, ["SRM 6", "SRM 6", "SRM Ammo", "Jump Jet", "Jump Jet", "Heat Sink", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      ra: [18, 9, ["AC/5", "AC/5", "AC/5", "AC/5", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty"]],
      la: [18, 9, ["Medium Laser", "Shoulder", "Upper Arm", "Lower Arm", "Hand", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty", "Empty"]],
      rl: [20, 9, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
      ll: [20, 9, ["Hip", "Upper Leg", "Lower Leg", "Foot", "Empty", "Empty"]],
    }),
  },
];

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("units");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const selectedUnit = selectedUnitId ? sampleUnits.find((unit) => unit.id === selectedUnitId) ?? null : null;

  const navigate = (page: PageKey) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      <Header activePage={activePage} onNavigate={navigate} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="w-full max-w-none px-3 pb-10 pt-4 sm:px-5 2xl:px-8">
        {activePage === "landing" && <LandingPage onNavigate={navigate} />}
        {activePage === "about" && <AboutPage onNavigate={navigate} />}
        {activePage === "faq" && <FaqPage />}
        {activePage === "campaignTypes" && <CampaignTypesPage />}
        {activePage === "guide" && <PlaceholderPage title="Guide" eyebrow="How to play" />}
        {activePage === "units" && (
          <UnitsPage units={sampleUnits} selectedUnit={selectedUnit} onSelectUnit={setSelectedUnitId} onClearSelectedUnit={() => setSelectedUnitId(null)} />
        )}
        {activePage === "myForces" && <PlaceholderPage title="My Forces" eyebrow="Company roster" />}
        {activePage === "myCampaigns" && <PlaceholderPage title="My Campaigns" eyebrow="Active campaigns" />}
        {activePage === "myAccount" && <PlaceholderPage title="My Account" eyebrow="Commander profile" />}
      </main>

      {mobileMenuOpen && <MobileMenu activePage={activePage} onNavigate={navigate} onClose={() => setMobileMenuOpen(false)} />}
    </div>
  );
}

function Header({
  activePage,
  onNavigate,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-lime-400/10 bg-zinc-950/90 backdrop-blur">
      <div className="flex h-16 w-full max-w-none items-center justify-between gap-3 px-3 sm:px-5 2xl:px-8">
        <button onClick={() => onNavigate("landing")} className="flex min-w-0 items-center gap-3 text-left">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-lime-400/30 bg-lime-400/10 shadow-lg shadow-lime-950/40">
            <Shield className="text-lime-300" size={21} />
          </div>
          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">Daunt's</div>
            <div className="truncate text-base font-bold leading-none text-zinc-50">Battletech Campaign Manager</div>
          </div>
          <div className="min-w-0 sm:hidden">
            <div className="truncate text-base font-bold leading-none text-zinc-50">Daunt's BCM</div>
          </div>
        </button>

        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-1 xl:flex">
          {navItems.map((item) => (
            <NavButton key={item.key} active={activePage === item.key} onClick={() => onNavigate(item.key)} label={item.label} icon={item.icon} />
          ))}
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-800 bg-zinc-900 xl:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function NavButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 text-sm font-medium transition 2xl:px-4 ${
        active ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
      }`}
    >
      <span className="hidden 2xl:inline-flex">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function MobileMenu({ activePage, onNavigate, onClose }: { activePage: PageKey; onNavigate: (page: PageKey) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm xl:hidden">
      <div className="absolute right-3 top-3 w-[min(92vw,360px)] rounded-3xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl">
        <div className="mb-2 flex items-center justify-between px-2 py-2">
          <div className="font-semibold text-zinc-100">Menu</div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${activePage === item.key ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:bg-zinc-900"}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UnitsPage({
  units,
  selectedUnit,
  onSelectUnit,
  onClearSelectedUnit,
}: {
  units: Unit[];
  selectedUnit: Unit | null;
  onSelectUnit: (id: string) => void;
  onClearSelectedUnit: () => void;
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<UnitType | "All">("All");
  const [weightFilter, setWeightFilter] = useState<Unit["weightClass"] | "All">("All");
  const [eraFilter, setEraFilter] = useState("All");
  const [rulesFilter, setRulesFilter] = useState<Unit["rulesLevel"] | "All">("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [techBaseFilter, setTechBaseFilter] = useState<Unit["techBase"] | "All">("All");
  const [minTonnage, setMinTonnage] = useState(0);
  const [maxTonnage, setMaxTonnage] = useState(100);
  const [minBV, setMinBV] = useState(0);
  const [maxBV, setMaxBV] = useState(3000);
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(20000000);
  const [sortBy, setSortBy] = useState<SortMode>("name");
  const [panelMode, setPanelMode] = useState<UnitPanelMode>("slots");
  const [topMode, setTopMode] = useState<"filters" | "browse">("filters");

  const filterOptions = useMemo(
    () => ({
      eras: ["All", ...Array.from(new Set(units.map((unit) => unit.era)))],
      roles: ["All", ...Array.from(new Set(units.map((unit) => unit.role)))],
    }),
    [units]
  );

  const filteredUnits = useMemo(() => {
    return units
      .filter((unit) => {
        const matchesQuery = `${unit.name} ${unit.model} ${unit.chassis} ${unit.role} ${unit.sourceFile ?? ""}`.toLowerCase().includes(query.toLowerCase());
        return (
          matchesQuery &&
          (typeFilter === "All" || unit.type === typeFilter) &&
          (weightFilter === "All" || unit.weightClass === weightFilter) &&
          (eraFilter === "All" || unit.era === eraFilter) &&
          (rulesFilter === "All" || unit.rulesLevel === rulesFilter) &&
          (roleFilter === "All" || unit.role === roleFilter) &&
          (techBaseFilter === "All" || unit.techBase === techBaseFilter) &&
          unit.tonnage >= minTonnage &&
          unit.tonnage <= maxTonnage &&
          unit.totalBV >= minBV &&
          unit.totalBV <= maxBV &&
          unit.costCBills >= minCost &&
          unit.costCBills <= maxCost
        );
      })
      .sort((a, b) => {
        if (sortBy === "tonnage") return b.tonnage - a.tonnage;
        if (sortBy === "bv") return b.totalBV - a.totalBV;
        if (sortBy === "cost") return b.costCBills - a.costCBills;
        return `${a.name} ${a.model}`.localeCompare(`${b.name} ${b.model}`);
      });
  }, [query, sortBy, typeFilter, weightFilter, eraFilter, rulesFilter, roleFilter, techBaseFilter, minTonnage, maxTonnage, minBV, maxBV, minCost, maxCost, units]);

  const selectUnit = (id: string) => {
    onSelectUnit(id);
    setPanelMode("slots");
  };

  const selectByModel = (value: string) => {
    const match = filteredUnits.find((unit) => `${unit.model} - ${unit.name}` === value || unit.model.toLowerCase() === value.toLowerCase());
    if (match) selectUnit(match.id);
  };

  return (
    <section className="space-y-4 overflow-hidden">
      <div className="grid gap-4 xl:grid-cols-[minmax(330px,0.72fr)_minmax(0,2.28fr)] 2xl:grid-cols-[minmax(400px,0.68fr)_minmax(0,2.32fr)]">
        <PageTitle
          eyebrow="Unit database"
          title="Units"
          description="A MechLab-style testing surface for parsed RTF files, Mek object creation, location slots, armor, structure, weapons, and BV output."
          actions={<button className="mt-4 w-full rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300">Add to Force</button>}
        />

        <div className="min-w-0 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Find / filter a chassis</div>
              <p className="text-xs text-zinc-500">{filteredUnits.length} matching unit{filteredUnits.length === 1 ? "" : "s"}</p>
            </div>
            <div className="grid w-full grid-cols-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 sm:w-auto sm:min-w-[220px]">
              <button onClick={() => setTopMode("filters")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${topMode === "filters" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}>Filters</button>
              <button onClick={() => setTopMode("browse")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${topMode === "browse" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}>Browse</button>
            </div>
          </div>

          {topMode === "filters" ? (
            <UnitToolbar
              units={filteredUnits}
              query={query}
              setQuery={setQuery}
              onSelectByModel={selectByModel}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              weightFilter={weightFilter}
              setWeightFilter={setWeightFilter}
              eraFilter={eraFilter}
              setEraFilter={setEraFilter}
              rulesFilter={rulesFilter}
              setRulesFilter={setRulesFilter}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              techBaseFilter={techBaseFilter}
              setTechBaseFilter={setTechBaseFilter}
              filterOptions={filterOptions}
              minTonnage={minTonnage}
              setMinTonnage={setMinTonnage}
              maxTonnage={maxTonnage}
              setMaxTonnage={setMaxTonnage}
              minBV={minBV}
              setMinBV={setMinBV}
              maxBV={maxBV}
              setMaxBV={setMaxBV}
              minCost={minCost}
              setMinCost={setMinCost}
              maxCost={maxCost}
              setMaxCost={setMaxCost}
            />
          ) : (
            <BrowseUnitList units={filteredUnits} onSelectUnit={selectUnit} compact sortBy={sortBy} setSortBy={setSortBy} />
          )}
        </div>
      </div>

      {selectedUnit ? (
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(330px,0.72fr)_minmax(0,2.28fr)] 2xl:grid-cols-[minmax(400px,0.68fr)_minmax(0,2.32fr)]">
          <div className="min-w-0 space-y-4">
            <MechSummary unit={selectedUnit} panelMode={panelMode} setPanelMode={setPanelMode} />
            <WeaponSummary unit={selectedUnit} />
          </div>

          <div className="min-w-0 overflow-hidden">
            <MechLabPanel unit={selectedUnit} panelMode={panelMode} setPanelMode={setPanelMode} onClose={onClearSelectedUnit} />
          </div>
        </div>
      ) : (
        <BrowseUnitList units={filteredUnits} onSelectUnit={selectUnit} sortBy={sortBy} setSortBy={setSortBy} />
      )}
    </section>
  );
}

function UnitToolbar({
  units,
  query,
  setQuery,
  onSelectByModel,
  typeFilter,
  setTypeFilter,
  weightFilter,
  setWeightFilter,
  eraFilter,
  setEraFilter,
  rulesFilter,
  setRulesFilter,
  roleFilter,
  setRoleFilter,
  techBaseFilter,
  setTechBaseFilter,
  filterOptions,
  minTonnage,
  setMinTonnage,
  maxTonnage,
  setMaxTonnage,
  minBV,
  setMinBV,
  maxBV,
  setMaxBV,
  minCost,
  setMinCost,
  maxCost,
  setMaxCost,
}: {
  units: Unit[];
  query: string;
  setQuery: (query: string) => void;
  onSelectByModel: (value: string) => void;
  typeFilter: UnitType | "All";
  setTypeFilter: (type: UnitType | "All") => void;
  weightFilter: Unit["weightClass"] | "All";
  setWeightFilter: (weight: Unit["weightClass"] | "All") => void;
  eraFilter: string;
  setEraFilter: (era: string) => void;
  rulesFilter: Unit["rulesLevel"] | "All";
  setRulesFilter: (rules: Unit["rulesLevel"] | "All") => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  techBaseFilter: Unit["techBase"] | "All";
  setTechBaseFilter: (techBase: Unit["techBase"] | "All") => void;
  filterOptions: { eras: string[]; roles: string[] };
  minTonnage: number;
  setMinTonnage: (value: number) => void;
  maxTonnage: number;
  setMaxTonnage: (value: number) => void;
  minBV: number;
  setMinBV: (value: number) => void;
  maxBV: number;
  setMaxBV: (value: number) => void;
  minCost: number;
  setMinCost: (value: number) => void;
  maxCost: number;
  setMaxCost: (value: number) => void;
}) {
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-[minmax(220px,1.5fr)_minmax(220px,1fr)]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chassis, model, role, source file..."
            className="h-11 w-full rounded-2xl border border-zinc-700 bg-zinc-950 pl-10 pr-3 text-sm text-zinc-100 outline-none ring-lime-400/30 placeholder:text-zinc-600 focus:border-lime-400 focus:ring-4"
          />
        </label>

        <label className="relative block">
          <Boxes className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
          <input
            list="unit-models"
            onChange={(event) => onSelectByModel(event.target.value)}
            placeholder="Jump to model..."
            className="h-11 w-full rounded-2xl border border-zinc-700 bg-zinc-950 pl-10 pr-3 text-sm text-zinc-100 outline-none ring-lime-400/30 placeholder:text-zinc-600 focus:border-lime-400 focus:ring-4"
          />
          <datalist id="unit-models">
            {units.map((unit) => (
              <option key={unit.id} value={`${unit.model} - ${unit.name}`} />
            ))}
          </datalist>
        </label>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <CompactSelect label="Unit" value={typeFilter} onChange={(value) => setTypeFilter(value as UnitType | "All")} options={["All", "BattleMech", "Vehicle", "Infantry", "Aerospace"]} />
        <CompactSelect label="Class" value={weightFilter} onChange={(value) => setWeightFilter(value as Unit["weightClass"] | "All")} options={["All", "Light", "Medium", "Heavy", "Assault"]} />
        <CompactSelect label="Era" value={eraFilter} onChange={setEraFilter} options={filterOptions.eras} />
        <CompactSelect label="Rules" value={rulesFilter} onChange={(value) => setRulesFilter(value as Unit["rulesLevel"] | "All")} options={["All", "Introductory", "Standard", "Advanced", "Experimental"]} />
        <CompactSelect label="Tech" value={techBaseFilter} onChange={(value) => setTechBaseFilter(value as Unit["techBase"] | "All")} options={["All", "Inner Sphere", "Clan", "Mixed"]} />
        <CompactSelect label="Role" value={roleFilter} onChange={setRoleFilter} options={filterOptions.roles} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <RangePair label="Tonnage Range" min={minTonnage} max={maxTonnage} setMin={setMinTonnage} setMax={setMaxTonnage} step={5} />
        <RangePair label="BV Range" min={minBV} max={maxBV} setMin={setMinBV} setMax={setMaxBV} step={50} />
        <RangePair label="C-Bill Range" min={minCost} max={maxCost} setMin={setMinCost} setMax={setMaxCost} step={100000} />
      </div>
    </div>
  );
}

function BrowseUnitList({
  units,
  onSelectUnit,
  compact = false,
  sortBy = "name",
  setSortBy,
}: {
  units: Unit[];
  onSelectUnit: (id: string) => void;
  compact?: boolean;
  sortBy?: SortMode;
  setSortBy?: (sortBy: SortMode) => void;
}) {
  return (
    <section className={compact ? "" : "rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4"}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {!compact ? (
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Browse filtered units</div>
            <h2 className="mt-1 text-2xl font-black text-zinc-50">Select a BattleMech</h2>
          </div>
        ) : (
          <div className="text-xs text-zinc-500">
            {units.length} result{units.length === 1 ? "" : "s"}
          </div>
        )}

        {setSortBy && (
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortMode)} className="h-10 rounded-2xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none ring-lime-400/30 focus:border-lime-400 focus:ring-4">
            <option value="name">Sort: Name</option>
            <option value="tonnage">Sort: Tons</option>
            <option value="bv">Sort: BV</option>
            <option value="cost">Sort: C-Bills</option>
          </select>
        )}
      </div>

      <div className={compact ? "max-h-[360px] overflow-auto rounded-2xl border border-zinc-800" : "max-h-[520px] overflow-auto rounded-2xl border border-zinc-800"}>
        <table className="w-full min-w-[520px] border-collapse text-left text-sm xl:min-w-[760px] 2xl:min-w-[900px]">
          <thead className="sticky top-0 z-10 bg-zinc-950 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-black">Chassis</th>
              <th className="px-4 py-3 font-black">Model</th>
              <th className="hidden px-4 py-3 font-black xl:table-cell">Tech Base</th>
              <th className="hidden px-4 py-3 font-black 2xl:table-cell">Rules</th>
              <th className="px-4 py-3 text-right font-black">BV</th>
              <th className="px-4 py-3 text-right font-black">Mass</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-950/45">
            {units.map((unit) => (
              <tr key={unit.id} onClick={() => onSelectUnit(unit.id)} className="cursor-pointer transition hover:bg-lime-400/10">
                <td className="px-4 py-3 font-bold text-zinc-100">{unit.name}</td>
                <td className="px-4 py-3 text-zinc-300">{unit.model}</td>
                <td className="hidden px-4 py-3 text-zinc-400 xl:table-cell">{unit.techBase}</td>
                <td className="hidden px-4 py-3 text-zinc-400 2xl:table-cell">{unit.rulesLevel}</td>
                <td className="px-4 py-3 text-right font-bold text-lime-300">{unit.totalBV.toLocaleString("en-US")}</td>
                <td className="px-4 py-3 text-right text-zinc-300">{unit.tonnage}t</td>
              </tr>
            ))}
          </tbody>
        </table>

        {units.length === 0 && <div className="p-8 text-center text-zinc-500">No units match the current filters.</div>}
      </div>
    </section>
  );
}

function CompactSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none ring-lime-400/30 focus:border-lime-400 focus:ring-4">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function RangePair({ label, min, max, setMin, setMax, step }: { label: string; min: number; max: number; setMin: (value: number) => void; setMax: (value: number) => void; step: number }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        <input type="text" inputMode="numeric" value={formatNumberInput(min)} onChange={(event) => setMin(parseNumberInput(event.target.value))} className="h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-100 outline-none focus:border-lime-400" data-step={step} aria-label={`${label} minimum`} />
        <input type="text" inputMode="numeric" value={formatNumberInput(max)} onChange={(event) => setMax(parseNumberInput(event.target.value))} className="h-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-100 outline-none focus:border-lime-400" data-step={step} aria-label={`${label} maximum`} />
      </div>
    </div>
  );
}

function MechSummary({ unit, panelMode, setPanelMode }: { unit: Unit; panelMode: UnitPanelMode; setPanelMode: (mode: UnitPanelMode) => void }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">Selected BattleMech</div>
          <h2 className="mt-2 truncate text-4xl font-black text-zinc-50">{unit.model}</h2>
          <p className="truncate text-zinc-400">{unit.name}</p>
        </div>
        <div className="rounded-2xl border border-lime-400/20 bg-lime-400/10 px-4 py-3 text-center">
          <div className="text-2xl font-black text-lime-200">{unit.totalBV.toLocaleString("en-US")}</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-300/70">BV</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <DetailStat label="Tons" value={unit.tonnage} icon={<Weight size={15} />} />
        <DetailStat label="Movement" value={`${unit.walk}/${unit.run}/${unit.jump}`} icon={<Gauge size={15} />} />
        <DetailStat label="Role" value={unit.role} icon={<Crosshair size={15} />} />
        <DetailStat label="Heat" value={`${unit.heatSinks} single`} icon={<Flame size={15} />} />
        <DetailStat label="Engine" value={unit.engine} icon={<Zap size={15} />} />
        <DetailStat label="Rules" value={unit.rulesLevel} icon={<BookOpen size={15} />} />
        <DetailStat label="Year" value={unit.year} icon={<Flag size={15} />} />
        <DetailStat label="Tech Base" value={unit.techBase} icon={<Cpu size={15} />} />
      </div>

      <button
        onClick={() => setPanelMode(panelMode === "details" ? "slots" : "details")}
        className="mt-5 w-full rounded-2xl border border-lime-400/30 bg-lime-400/10 px-4 py-3 text-sm font-black text-lime-200 transition hover:bg-lime-400 hover:text-zinc-950"
      >
        {panelMode === "details" ? "View Slots" : "View All Information"}
      </button>
    </section>
  );
}

function WeaponSummary({ unit }: { unit: Unit }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Primary weapons</div>
          <h3 className="text-lg font-black text-zinc-50">Loadout Summary</h3>
        </div>
        <div className="rounded-2xl bg-zinc-950 px-3 py-2 text-sm font-black text-lime-300">{unit.weapons.length}</div>
      </div>

      <div className="space-y-2">
        {unit.weapons.map((weapon) => (
          <div key={weapon.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="font-bold text-zinc-100">{weapon.name}</div>
              <div className="text-xs text-zinc-500">{weapon.location}</div>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-zinc-400">
              <span>Dmg {weapon.damage}</span>
              <span>Heat {weapon.heat}</span>
              <span>Slots {weapon.slots}</span>
              <span className="truncate">Shots {weapon.shots}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MechLabPanel({ unit, panelMode, setPanelMode, onClose }: { unit: Unit; panelMode: UnitPanelMode; setPanelMode: (mode: UnitPanelMode) => void; onClose?: () => void }) {
  return (
    <section className="min-h-[700px] rounded-3xl border border-zinc-800 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.10),transparent_38%),rgba(24,24,27,0.82)] p-4 shadow-2xl shadow-black/30 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">MechLab View</div>
          <h2 className="text-2xl font-black text-zinc-50">{panelMode === "slots" ? "Location Slots" : panelMode === "weapons" ? "Weapon Placement" : "All Information"}</h2>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="grid min-w-0 flex-1 grid-cols-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 sm:w-[360px] sm:flex-none">
            <button onClick={() => setPanelMode("slots")} className={`min-w-0 whitespace-nowrap rounded-xl px-2 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${panelMode === "slots" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}>Slots</button>
            <button onClick={() => setPanelMode("weapons")} className={`min-w-0 whitespace-nowrap rounded-xl px-2 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${panelMode === "weapons" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}>Weapons</button>
            <button onClick={() => setPanelMode("details")} className={`min-w-0 whitespace-nowrap rounded-xl px-2 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${panelMode === "details" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}>Details</button>
          </div>
          {onClose && (
            <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-zinc-700 bg-zinc-950 text-zinc-400 transition hover:border-lime-400 hover:text-lime-300" aria-label="Close selected BattleMech" title="Close selected BattleMech">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {panelMode === "slots" ? <LocationGrid unit={unit} /> : panelMode === "weapons" ? <WeaponPlacementGrid unit={unit} /> : <FullInfoPanel unit={unit} />}
    </section>
  );
}

function FullInfoPanel({ unit }: { unit: Unit }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Complete record</div>
          <h3 className="mt-1 text-2xl font-black text-zinc-50">{unit.model} Full Information</h3>
        </div>
        <Badge>{unit.sourceFile ?? "No source"}</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <InfoSection title="Manufacturers" items={["Manufacturer", "Primary Factory", "Known Production Lines", "Availability Notes"]} />
        <InfoSection title="History" items={["Development History", "Service History", "Notable Deployments", "Variants / Lineage Notes"]} />
        <InfoSection title="Factories" items={["Factory World", "Faction Ownership", "Production Status", "Campaign Availability"]} />
        <InfoSection title="Capabilities" items={["Battlefield Role", "Strengths", "Limitations", "Doctrine Notes"]} />
        <InfoSection title="Quirks" items={["Positive Quirks", "Negative Quirks", "Campaign Rule Notes", "Maintenance Notes"]} />
        <InfoSection title="Construction" items={["Engine", "Gyro", "Cockpit", "Myomer", "Internal Structure", "Armor Type"]} />
        <InfoSection title="Heat System" items={["Heat Sink Count", "Heat Sink Type", "Engine Sinks", "External Sinks", "Heat Efficiency Notes"]} />
        <InfoSection title="Rules / Source" items={["Rules Level", "Tech Base", "Year", "Era", "Source File", "Validation Warnings"]} />
      </div>
    </section>
  );
}

function InfoSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
      <h4 className="text-sm font-black uppercase tracking-[0.16em] text-lime-300">{title}</h4>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{item}</div>
            <div className="mt-1 min-h-5 text-sm text-zinc-400">—</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationGrid({ unit }: { unit: Unit }) {
  const byId = Object.fromEntries(unit.locations.map((location) => [location.id, location])) as Record<string, UnitLocation>;
  const stackedLocations = [byId.head, byId.ct, byId.lt, byId.rt, byId.la, byId.ra, byId.ll, byId.rl].filter(Boolean) as UnitLocation[];

  return (
    <>
      <div className="grid min-w-0 gap-3 lg:grid-cols-2 xl:hidden">
        {stackedLocations.map((location) => (
          <LocationCard key={location.id} location={location} mode="details" />
        ))}
      </div>

      <div className="hidden min-w-0 w-full max-w-full grid-cols-[minmax(150px,0.85fr)_minmax(190px,1fr)_minmax(210px,1.05fr)_minmax(190px,1fr)_minmax(150px,0.85fr)] gap-3 xl:grid xl:items-start">
        <div className="space-y-3 pt-20 2xl:pt-10"><LocationCard location={byId.la} mode="details" compact /></div>
        <div className="space-y-3"><LocationCard location={byId.lt} mode="details" compact /><LocationCard location={byId.ll} mode="details" compact /></div>
        <div className="space-y-3"><LocationCard location={byId.head} mode="details" compact /><LocationCard location={byId.ct} mode="details" compact tall /></div>
        <div className="space-y-3"><LocationCard location={byId.rt} mode="details" compact /><LocationCard location={byId.rl} mode="details" compact /></div>
        <div className="space-y-3 pt-20 2xl:pt-10"><LocationCard location={byId.ra} mode="details" compact /></div>
      </div>
    </>
  );
}

function WeaponPlacementGrid({ unit }: { unit: Unit }) {
  const byId = Object.fromEntries(unit.locations.map((location) => [location.id, location])) as Record<string, UnitLocation>;
  const stackedLocations = [byId.head, byId.ct, byId.lt, byId.rt, byId.la, byId.ra, byId.ll, byId.rl].filter(Boolean) as UnitLocation[];
  const weaponsFor = (location: UnitLocation) => unit.weapons.filter((weapon) => weapon.location === location.name);

  return (
    <>
      <div className="grid min-w-0 gap-3 lg:grid-cols-2 xl:hidden">
        {stackedLocations.map((location) => (
          <LocationCard key={location.id} location={location} mode="weapons" weapons={weaponsFor(location)} />
        ))}
      </div>

      <div className="hidden min-w-0 w-full max-w-full grid-cols-[minmax(150px,0.85fr)_minmax(190px,1fr)_minmax(210px,1.05fr)_minmax(190px,1fr)_minmax(150px,0.85fr)] gap-3 xl:grid xl:items-start">
        <div className="space-y-3 pt-20 2xl:pt-10"><LocationCard location={byId.la} mode="weapons" weapons={weaponsFor(byId.la)} compact /></div>
        <div className="space-y-3"><LocationCard location={byId.lt} mode="weapons" weapons={weaponsFor(byId.lt)} compact /><LocationCard location={byId.ll} mode="weapons" weapons={weaponsFor(byId.ll)} compact /></div>
        <div className="space-y-3"><LocationCard location={byId.head} mode="weapons" weapons={weaponsFor(byId.head)} compact /><LocationCard location={byId.ct} mode="weapons" weapons={weaponsFor(byId.ct)} compact tall /></div>
        <div className="space-y-3"><LocationCard location={byId.rt} mode="weapons" weapons={weaponsFor(byId.rt)} compact /><LocationCard location={byId.rl} mode="weapons" weapons={weaponsFor(byId.rl)} compact /></div>
        <div className="space-y-3 pt-20 2xl:pt-10"><LocationCard location={byId.ra} mode="weapons" weapons={weaponsFor(byId.ra)} compact /></div>
      </div>
    </>
  );
}

function LocationCard({ location, mode, weapons = [], compact = false, tall = false }: { location: UnitLocation; mode: UnitPanelMode; weapons?: UnitWeapon[]; compact?: boolean; tall?: boolean }) {
  const occupiedSlots = location.slots.filter((slot) => slot.type !== "empty").length;
  const armorPct = Math.min(100, Math.round((location.armor / Math.max(location.armor, location.structure)) * 100));

  return (
    <article className={`min-w-0 rounded-3xl border border-zinc-800 bg-zinc-950/70 ${compact ? "p-3" : "p-4"} ${tall ? "xl:min-h-[520px]" : ""}`}>
      <div className="mb-3 text-center">
        <div className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-xl bg-lime-400/10 text-lime-300"><MapPin size={15} /></div>
        <h3 className="text-base font-black text-zinc-50">{location.name}</h3>
        <p className="text-[11px] text-zinc-500">{occupiedSlots}/{location.slots.length} slots occupied</p>
      </div>

      <div className={`mb-4 grid gap-2 ${location.rearArmor !== undefined ? "grid-cols-3" : "grid-cols-2"}`}>
        <ArmorPip label="AR" value={location.armor} />
        {location.rearArmor !== undefined && <ArmorPip label="RR" value={location.rearArmor} />}
        <ArmorPip label="ST" value={location.structure} />
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-lime-400" style={{ width: `${armorPct}%` }} /></div>

      {mode === "details" ? (
        <div className="grid grid-cols-1 gap-1.5">
          {location.slots.map((slot) => <CriticalSlotRow key={slot.slot} slot={slot} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {weapons.length > 0 ? weapons.map((weapon) => <WeaponPlacementRow key={weapon.id} weapon={weapon} />) : <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-4 text-center text-sm text-zinc-500">No weapons in this location.</div>}
        </div>
      )}
    </article>
  );
}

function CriticalSlotRow({ slot }: { slot: CriticalSlot }) {
  return (
    <div className={`grid grid-cols-[26px_minmax(0,1fr)_44px] items-center gap-2 rounded-xl border px-2 py-1.5 text-xs ${slotClass(slot.type)}`}>
      <span className="text-center font-mono text-zinc-500">{slot.slot.toString().padStart(2, "0")}</span>
      <span className="truncate text-left font-semibold">{slot.item}</span>
      <span className="rounded-lg bg-black/20 px-1.5 py-1 text-center text-[10px] font-black uppercase tracking-wider opacity-80">{slotTypeLabel(slot.type)}</span>
    </div>
  );
}

function WeaponPlacementRow({ weapon }: { weapon: UnitWeapon }) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateRows: `repeat(${Math.max(1, weapon.slots)}, minmax(34px, auto))` }}>
      <div
        className="flex items-center justify-center rounded-2xl border border-lime-400/30 bg-lime-400/10 px-3 text-center font-black text-lime-100"
        style={{ gridRow: `span ${Math.max(1, weapon.slots)}` }}
        title={`${weapon.name} - ${weapon.slots} slot${weapon.slots === 1 ? "" : "s"}`}
      >
        {weapon.name}
      </div>
    </div>
  );
}

function LandingPage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-lime-950/40 p-6 shadow-2xl sm:p-10">
      <div className="max-w-3xl">
        <div className="mb-4 inline-flex rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Campaign logistics, roster control, and unit validation</div>
        <h1 className="text-4xl font-black tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">Daunt's Battletech Campaign Manager</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">Build, test, track, and manage BattleTech campaigns from parsed unit files through playable forces.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => onNavigate("units")} className="rounded-2xl bg-lime-400 px-5 py-3 font-bold text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300">View units</button>
          <button onClick={() => onNavigate("about")} className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-bold text-zinc-100 transition hover:bg-zinc-800">Read about the project</button>
        </div>
      </div>
    </section>
  );
}

function AboutPage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <section className="space-y-5">
      <PageTitle eyebrow="Project overview" title="About" description="A barebones starting point for the concept pitch, creator info, and design goals." />
      <div className="grid gap-4 md:grid-cols-2">
        {aboutChildren.map((child) => (
          <button key={child.key} onClick={() => onNavigate(child.key)} className="group rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 text-left transition hover:border-lime-400/40 hover:bg-zinc-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-zinc-50">{child.label}</div>
                <p className="mt-1 text-sm leading-6 text-zinc-400">Placeholder content ready to expand.</p>
              </div>
              <ChevronRight className="text-zinc-500 transition group-hover:translate-x-1 group-hover:text-lime-300" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FaqPage() {
  return <PlaceholderPage title="FAQ" eyebrow="Common questions" />;
}

function CampaignTypesPage() {
  return <PlaceholderPage title="Campaign Types" eyebrow="Supported play styles" />;
}

function PlaceholderPage({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <section className="space-y-5">
      <PageTitle eyebrow={eyebrow} title={title} description="This page is intentionally minimal for now while Units becomes the first fully useful testing area." />
      <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-zinc-400">Content coming soon.</div>
    </section>
  );
}

function PageTitle({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900/55 p-5 sm:p-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">{eyebrow}</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-zinc-400 sm:text-base">{description}</p>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}

function DetailStat({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {icon && <span className="text-lime-300">{icon}</span>}
        {label}
      </div>
      <div className="mt-1 truncate font-black text-zinc-100" title={typeof value === "string" ? value : undefined}>{value}</div>
    </div>
  );
}

function ArmorPip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-2 text-center">
      <div className="text-base font-black text-zinc-50">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="max-w-full truncate rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-300">{children}</span>;
}

function formatNumberInput(value: number) {
  return Number.isFinite(value) ? value.toLocaleString("en-US") : "0";
}

function parseNumberInput(value: string) {
  const parsed = Number(value.replace(/,/g, "").replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function slotTypeLabel(type: CriticalSlot["type"]) {
  switch (type) {
    case "weapon":
      return "WPN";
    case "ammo":
      return "AMM";
    case "engine":
      return "ENG";
    case "structure":
      return "STR";
    case "equipment":
      return "EQP";
    default:
      return "—";
  }
}

function slotClass(type: CriticalSlot["type"]) {
  switch (type) {
    case "weapon":
      return "border-lime-400/30 bg-lime-400/10 text-lime-100";
    case "ammo":
      return "border-orange-300/25 bg-orange-300/10 text-orange-100";
    case "engine":
      return "border-sky-300/25 bg-sky-300/10 text-sky-100";
    case "structure":
      return "border-zinc-600 bg-zinc-900 text-zinc-300";
    case "equipment":
      return "border-violet-300/25 bg-violet-300/10 text-violet-100";
    default:
      return "border-zinc-800 bg-zinc-950/50 text-zinc-600";
  }
}
