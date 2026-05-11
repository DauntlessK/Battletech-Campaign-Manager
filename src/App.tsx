import reactLogo from './assets/react.svg'
import './App.css'
import { unitType } from './constants/enums'
//import { Mek } from './files/mek';

import React, { useEffect, useMemo, useState } from "react";
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
  SlidersHorizontal,
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

type UnitType = "BattleMech" | "Vehicle" | "Infantry" | "Aerospace" | string;
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
  unitType?: string;
  type: UnitType;
  techBase: "Inner Sphere" | "Clan" | "Mixed" | "Unknown" | string;
  era: string;
  year: number;
  tonnage: number;
  weightClass: "Light" | "Medium" | "Heavy" | "Assault" | string;
  costCBills: number;
  rulesLevel: "Introductory" | "Standard" | "Advanced" | "Experimental" | "Unknown" | string;
  walk: number;
  run: number;
  jump: number;
  heatSinks: number;
  heatSinkType?: string;
  armor?: number;
  structure?: number;
  offensiveBV?: number;
  defensiveBV?: number;
  totalBV: number;
  bv?: number;
  role: string;
  engine: string;
  gyro: string;
  cockpit?: string;
  sourceFile?: string;
  fileName?: string;
  relativePath?: string;
  mulId?: string | number;
  sourceBook?: string;
  overview?: string;
  capabilities?: string;
  deployment?: string;
  history?: string;
  quirks?: string[];
  manufacturer?: string;
  factory?: string;
  myomer?: string;
  armorType?: string;
  structureType?: string;
  weapons?: UnitWeapon[];
  locations?: UnitLocation[];
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

const ERA_OPTIONS = [
  "All",
  "Star League",
  "Succession Wars",
  "Clan Invasion",
  "Civil War",
  "Jihad",
  "Republic",
  "Dark Age",
  "IlClan",
];

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("units");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [unitsError, setUnitsError] = useState<string | null>(null);
  const [selectedUnitLoading, setSelectedUnitLoading] = useState(false);
  const [selectedUnitError, setSelectedUnitError] = useState<string | null>(null);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        setUnitsLoading(true);
        setUnitsError(null);

        const response = await fetch("/api/units");

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.message ?? errorBody?.error ?? `Failed to load units: ${response.status}`);
        }

        const data = (await response.json()) as Unit[];
        setUnits(data.map(normalizeCatalogUnit));
      } catch (error) {
        setUnitsError(error instanceof Error ? error.message : "Failed to load units");
      } finally {
        setUnitsLoading(false);
      }
    };

    loadUnits();
  }, []);

  useEffect(() => {
    if (!selectedUnitId) {
      setSelectedUnit(null);
      setSelectedUnitError(null);
      return;
    }

    const loadSelectedUnit = async () => {
      try {
        setSelectedUnitLoading(true);
        setSelectedUnitError(null);

        const response = await fetch(`/api/units/${selectedUnitId}`);

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.message ?? errorBody?.error ?? `Failed to load unit: ${response.status}`);
        }

        const data = (await response.json()) as Unit;
        setSelectedUnit(normalizeCatalogUnit(data));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load selected unit";
        console.error(error);
        setSelectedUnit(null);
        setSelectedUnitError(message);
      } finally {
        setSelectedUnitLoading(false);
      }
    };

    loadSelectedUnit();
  }, [selectedUnitId]);

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
          <>
            {unitsLoading && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">
                Loading units...
              </div>
            )}

            {unitsError && (
              <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-6 text-red-200">
                {unitsError}
              </div>
            )}

            {!unitsLoading && !unitsError && (
              <>
                {selectedUnitLoading && (
                  <div className="mb-4 rounded-3xl border border-lime-400/20 bg-lime-400/10 p-4 text-sm font-semibold text-lime-200">
                    Loading selected unit...
                  </div>
                )}

                {selectedUnitError && (
                  <div className="mb-4 rounded-3xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
                    {selectedUnitError}
                  </div>
                )}

                <UnitsPage
                  units={units}
                  selectedUnit={selectedUnit}
                  onSelectUnit={setSelectedUnitId}
                  onClearSelectedUnit={() => setSelectedUnitId(null)}
                />
              </>
            )}
          </>
        )}
        {activePage === "myForces" && <PlaceholderPage title="My Forces" eyebrow="Company roster" />}
        {activePage === "myCampaigns" && <PlaceholderPage title="My Campaigns" eyebrow="Active campaigns" />}
        {activePage === "myAccount" && <PlaceholderPage title="My Account" eyebrow="Commander profile" />}
      </main>

      {mobileMenuOpen && <MobileMenu activePage={activePage} onNavigate={navigate} onClose={() => setMobileMenuOpen(false)} />}
    </div>
  );
}

function normalizeCatalogUnit(unit: Unit): Unit {
  return {
    ...unit,
    name: unit.name || unit.chassis,
    type: unit.type || unit.unitType || "BattleMech",
    totalBV: Number(unit.totalBV ?? unit.bv ?? 0),
    costCBills: Number(unit.costCBills ?? 0),
    tonnage: Number(unit.tonnage ?? 0),
    year: Number(unit.year ?? 0),
    walk: Number(unit.walk ?? 0),
    run: Number(unit.run ?? 0),
    jump: Number(unit.jump ?? 0),
    heatSinks: Number(unit.heatSinks ?? 0),
    heatSinkType: unit.heatSinkType || "Single",
    role: unit.role || "Unknown",
    engine: unit.engine || "Unknown",
    gyro: unit.gyro || "Standard",
    cockpit: unit.cockpit || "Standard",
    era: normalizeEra(unit.era, Number(unit.year ?? 0)),
    techBase: unit.techBase || "Unknown",
    rulesLevel: normalizeRulesLevel(unit.rulesLevel),
    weightClass: unit.weightClass || weightClassFromTonnage(Number(unit.tonnage ?? 0)),
    weapons: unit.weapons ?? [],
    locations: unit.locations ?? [],
  };
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
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [weightFilter, setWeightFilter] = useState<string>("All");
  const [eraFilter, setEraFilter] = useState("All");
  const [rulesFilter, setRulesFilter] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [techBaseFilter, setTechBaseFilter] = useState<string>("All");
  const [minTonnage, setMinTonnage] = useState(0);
  const [maxTonnage, setMaxTonnage] = useState(100);
  const [minBV, setMinBV] = useState(0);
  const [maxBV, setMaxBV] = useState(10000);
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(100000000);
  const [sortBy, setSortBy] = useState<SortMode>("name");
  const [panelMode, setPanelMode] = useState<UnitPanelMode>("slots");
  const [topMode, setTopMode] = useState<"filters" | "browse">("filters");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filterOptions = useMemo(
    () => ({
      roles: ["All", ...Array.from(new Set(units.map((unit) => unit.role).filter(Boolean)))],
      unitTypes: ["All", ...Array.from(new Set(units.map((unit) => String(unit.type || unit.unitType || "BattleMech")).filter(Boolean)))],
      rules: ["All", ...Array.from(new Set(units.map((unit) => unit.rulesLevel).filter(Boolean)))],
      techBases: ["All", ...Array.from(new Set(units.map((unit) => unit.techBase).filter(Boolean)))],
    }),
    [units]
  );

  const filteredUnits = useMemo(() => {
    return units
      .filter((unit) => {
        const unitEra = unit.era || eraFromYear(unit.year);
        const totalBV = Number(unit.totalBV ?? unit.bv ?? 0);
        const cost = Number(unit.costCBills ?? 0);
        const text = `${unit.name} ${unit.model} ${unit.chassis} ${unit.role} ${unit.sourceFile ?? ""} ${unit.fileName ?? ""} ${unit.relativePath ?? ""}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());

        return (
          matchesQuery &&
          (typeFilter === "All" || String(unit.type || unit.unitType) === typeFilter) &&
          (weightFilter === "All" || unit.weightClass === weightFilter) &&
          (eraFilter === "All" || normalizeEra(unitEra, unit.year) === eraFilter) &&
          (rulesFilter === "All" || unit.rulesLevel === rulesFilter) &&
          (roleFilter === "All" || unit.role === roleFilter) &&
          (techBaseFilter === "All" || unit.techBase === techBaseFilter) &&
          unit.tonnage >= minTonnage &&
          unit.tonnage <= maxTonnage &&
          totalBV >= minBV &&
          totalBV <= maxBV &&
          cost >= minCost &&
          cost <= maxCost
        );
      })
      .sort((a, b) => {
        if (sortBy === "tonnage") return Number(b.tonnage) - Number(a.tonnage);
        if (sortBy === "bv") return Number(b.totalBV ?? b.bv ?? 0) - Number(a.totalBV ?? a.bv ?? 0);
        if (sortBy === "cost") return Number(b.costCBills ?? 0) - Number(a.costCBills ?? 0);
        return `${a.name} ${a.model}`.localeCompare(`${b.name} ${b.model}`);
      });
  }, [query, sortBy, typeFilter, weightFilter, eraFilter, rulesFilter, roleFilter, techBaseFilter, minTonnage, maxTonnage, minBV, maxBV, minCost, maxCost, units]);

  const clearFilters = () => {
    setQuery("");
    setTypeFilter("All");
    setWeightFilter("All");
    setEraFilter("All");
    setRulesFilter("All");
    setRoleFilter("All");
    setTechBaseFilter("All");
    setMinTonnage(0);
    setMaxTonnage(100);
    setMinBV(0);
    setMaxBV(10000);
    setMinCost(0);
    setMaxCost(100000000);
  };

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
          description="API-backed unit catalog loaded from generated MegaMek CSV indexes. Select a unit to parse the full MTF and load the MechLab view."
          actions={<button className="mt-4 w-full rounded-2xl bg-lime-400 px-4 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300">Add to Force</button>}
        />

        <div className="min-w-0 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Find / filter a chassis</div>
              <p className="text-xs text-zinc-500">{filteredUnits.length.toLocaleString("en-US")} matching unit{filteredUnits.length === 1 ? "" : "s"}</p>
            </div>
            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:border-lime-400 hover:text-lime-300 sm:px-4 sm:text-sm"
              >
                Clear Filters
              </button>
              <div className="grid min-w-[190px] grid-cols-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 sm:min-w-[220px]">
                <button onClick={() => setTopMode("filters")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${topMode === "filters" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}>Filters</button>
                <button onClick={() => setTopMode("browse")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${topMode === "browse" ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"}`}>Browse</button>
              </div>
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
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
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
  mobileFiltersOpen,
  setMobileFiltersOpen,
}: {
  units: Unit[];
  query: string;
  setQuery: (query: string) => void;
  onSelectByModel: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  weightFilter: string;
  setWeightFilter: (weight: string) => void;
  eraFilter: string;
  setEraFilter: (era: string) => void;
  rulesFilter: string;
  setRulesFilter: (rules: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  techBaseFilter: string;
  setTechBaseFilter: (techBase: string) => void;
  filterOptions: { roles: string[]; unitTypes: string[]; rules: string[]; techBases: string[] };
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
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
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
            {units.slice(0, 500).map((unit) => (
              <option key={unit.id} value={`${unit.model} - ${unit.name}`} />
            ))}
          </datalist>
        </label>
      </div>

      <div className="mt-3 md:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-black text-zinc-200 transition hover:border-lime-400 hover:text-lime-300"
        >
          <SlidersHorizontal size={16} />
          {mobileFiltersOpen ? "Hide Advanced Filters" : "Show Advanced Filters"}
        </button>
      </div>

      <div className={`${mobileFiltersOpen ? "grid" : "hidden"} mt-3 gap-3 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6`}>
        <CompactSelect label="Unit" value={typeFilter} onChange={setTypeFilter} options={filterOptions.unitTypes} />
        <CompactSelect label="Class" value={weightFilter} onChange={setWeightFilter} options={["All", "Light", "Medium", "Heavy", "Assault"]} />
        <CompactSelect label="Era" value={eraFilter} onChange={setEraFilter} options={ERA_OPTIONS} />
        <CompactSelect label="Rules" value={rulesFilter} onChange={setRulesFilter} options={["All", "Introductory", "Standard", "Advanced", "Experimental", "Unofficial"]} />
        <CompactSelect label="Tech" value={techBaseFilter} onChange={setTechBaseFilter} options={filterOptions.techBases} />
        <CompactSelect label="Role" value={roleFilter} onChange={setRoleFilter} options={filterOptions.roles} />
      </div>

      <div className={`${mobileFiltersOpen ? "grid" : "hidden"} mt-3 gap-3 md:grid md:grid-cols-3`}>
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
            {units.length.toLocaleString("en-US")} result{units.length === 1 ? "" : "s"}
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
                <td className="px-4 py-3 text-right font-bold text-lime-300">{Number(unit.totalBV ?? unit.bv ?? 0).toLocaleString("en-US")}</td>
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
          <div className="text-2xl font-black text-lime-200">{Number(unit.totalBV ?? unit.bv ?? 0).toLocaleString("en-US")}</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-300/70">BV</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <DetailStat label="Tons" value={unit.tonnage} icon={<Weight size={15} />} />
        <DetailStat label="Movement" value={`${unit.walk}/${unit.run}/${unit.jump}`} icon={<Gauge size={15} />} />
        <DetailStat label="Role" value={unit.role} icon={<Crosshair size={15} />} />
        <DetailStat label="Heat" value={`${unit.heatSinks} (${unit.heatSinkType || "Single"})`} icon={<Flame size={15} />} />
        <DetailStat label="Engine" value={unit.engine} icon={<Zap size={15} />} />
        <DetailStat label="Rules" value={unit.rulesLevel} icon={<BookOpen size={15} />} />
        <DetailStat label="Year" value={unit.year || "—"} icon={<Flag size={15} />} />
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
  const weapons = unit.weapons ?? [];

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Primary weapons</div>
          <h3 className="text-lg font-black text-zinc-50">Loadout Summary</h3>
        </div>
        <div className="rounded-2xl bg-zinc-950 px-3 py-2 text-sm font-black text-lime-300">{weapons.length}</div>
      </div>

      <div className="space-y-2">
        {weapons.length === 0 && <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/50 p-4 text-sm text-zinc-500">No weapon data loaded.</div>}
        {weapons.map((weapon) => (
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
            <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-zinc-700 bg-zinc-950 text-zinc-400 transition hover:border-lime-400 hover:text-lime-300" aria-label="Close selected BattleMech" title="Close selected BattleMech">
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
        <Badge>{unit.relativePath ?? unit.sourceFile ?? unit.fileName ?? "No source"}</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TextInfoSection title="Overview" value={unit.overview} />
        <TextInfoSection title="Capabilities" value={unit.capabilities} />
        <TextInfoSection title="Deployment" value={unit.deployment} />
        <TextInfoSection title="History" value={unit.history} />

        <InfoSection
          title="Manufacturing"
          items={["Manufacturer", "Primary Factory", "Known Production Lines", "Availability Notes"]}
          values={[unit.manufacturer ?? "—", unit.factory ?? "—", "—", "—"]}
        />

        <QuirksInfoSection quirks={unit.quirks ?? []} />

        <InfoSection
          title="Construction"
          items={["Engine", "Gyro", "Cockpit", "Myomer", "Internal Structure", "Armor Type"]}
          values={[unit.engine, unit.gyro, unit.cockpit ?? "Standard", unit.myomer ?? "—", unit.structureType ?? "—", unit.armorType ?? "—"]}
        />

        <InfoSection
          title="Rules / Source"
          items={["Rules Level", "Tech Base", "Year", "Era", "Source File", "Source Book", "MUL ID"]}
          values={[unit.rulesLevel, unit.techBase, `${unit.year || "—"}`, unit.era || eraFromYear(unit.year), unit.relativePath ?? unit.sourceFile ?? unit.fileName ?? "—", unit.sourceBook ?? "—", unit.mulId ? String(unit.mulId) : "—"]}
        />
      </div>
    </section>
  );
}

function TextInfoSection({ title, value }: { title: string; value?: string }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
      <h4 className="text-sm font-black uppercase tracking-[0.16em] text-lime-300">{title}</h4>
      <p className="mt-3 min-h-28 whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm leading-6 text-zinc-400">
        {value?.trim() || "—"}
      </p>
    </div>
  );
}

function QuirksInfoSection({ quirks }: { quirks: string[] }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
      <h4 className="text-sm font-black uppercase tracking-[0.16em] text-lime-300">Quirks</h4>
      <div className="mt-3 min-h-28 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
        {quirks.length > 0 ? (
          <ul className="space-y-2 text-sm text-zinc-400">
            {quirks.map((quirk, index) => (
              <li key={`${quirk}-${index}`} className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2">
                {quirk}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-zinc-500">—</div>
        )}
      </div>
    </div>
  );
}

function InfoSection({ title, items, values = [] }: { title: string; items: string[]; values?: React.ReactNode[] }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
      <h4 className="text-sm font-black uppercase tracking-[0.16em] text-lime-300">{title}</h4>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{item}</div>
            <div className="mt-1 min-h-5 truncate text-sm text-zinc-400">{values[index] || "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationGrid({ unit }: { unit: Unit }) {
  const locations = unit.locations ?? [];
  const byId = Object.fromEntries(locations.map((location) => [location.id, location])) as Record<string, UnitLocation>;
  const stackedLocations = [byId.head, byId.ct, byId.lt, byId.rt, byId.la, byId.ra, byId.ll, byId.rl].filter(Boolean) as UnitLocation[];

  if (stackedLocations.length === 0) {
    return <EmptyPanel message="No location/slot data loaded for this unit." />;
  }

  return (
    <>
      <div className="grid min-w-0 gap-3 lg:grid-cols-2 xl:hidden">
        {stackedLocations.map((location) => (
          <LocationCard key={location.id} location={location} mode="slots" />
        ))}
      </div>

      <div className="hidden min-w-0 w-full max-w-full xl:block">
        <div className="mx-auto mb-3 max-w-[260px]">
          {byId.head && <LocationCard location={byId.head} mode="slots" compact head />}
        </div>

        <div className="grid min-w-0 w-full max-w-full grid-cols-[minmax(150px,0.85fr)_minmax(190px,1fr)_minmax(210px,1.05fr)_minmax(190px,1fr)_minmax(150px,0.85fr)] gap-3 items-start">
          <div className="space-y-3 pt-20 2xl:pt-10">{byId.la && <LocationCard location={byId.la} mode="slots" compact />}</div>
          <div className="space-y-3">{byId.lt && <LocationCard location={byId.lt} mode="slots" compact />}{byId.ll && <LocationCard location={byId.ll} mode="slots" compact />}</div>
          <div className="space-y-3 pt-6">{byId.ct && <LocationCard location={byId.ct} mode="slots" compact tall />}</div>
          <div className="space-y-3">{byId.rt && <LocationCard location={byId.rt} mode="slots" compact />}{byId.rl && <LocationCard location={byId.rl} mode="slots" compact />}</div>
          <div className="space-y-3 pt-20 2xl:pt-10">{byId.ra && <LocationCard location={byId.ra} mode="slots" compact />}</div>
        </div>
      </div>
    </>
  );
}

function WeaponPlacementGrid({ unit }: { unit: Unit }) {
  const locations = unit.locations ?? [];
  const weapons = unit.weapons ?? [];
  const byId = Object.fromEntries(locations.map((location) => [location.id, location])) as Record<string, UnitLocation>;
  const stackedLocations = [byId.head, byId.ct, byId.lt, byId.rt, byId.la, byId.ra, byId.ll, byId.rl].filter(Boolean) as UnitLocation[];
  const weaponsFor = (location: UnitLocation) => weapons.filter((weapon) => weapon.location === location.name);

  if (stackedLocations.length === 0) {
    return <EmptyPanel message="No location/weapon placement data loaded for this unit." />;
  }

  return (
    <>
      <div className="grid min-w-0 gap-3 lg:grid-cols-2 xl:hidden">
        {stackedLocations.map((location) => (
          <LocationCard key={location.id} location={location} mode="weapons" weapons={weaponsFor(location)} />
        ))}
      </div>

      <div className="hidden min-w-0 w-full max-w-full xl:block">
        <div className="mx-auto mb-3 max-w-[260px]">
          {byId.head && <LocationCard location={byId.head} mode="weapons" weapons={weaponsFor(byId.head)} compact head />}
        </div>

        <div className="grid min-w-0 w-full max-w-full grid-cols-[minmax(150px,0.85fr)_minmax(190px,1fr)_minmax(210px,1.05fr)_minmax(190px,1fr)_minmax(150px,0.85fr)] gap-3 items-start">
          <div className="space-y-3 pt-20 2xl:pt-10">{byId.la && <LocationCard location={byId.la} mode="weapons" weapons={weaponsFor(byId.la)} compact />}</div>
          <div className="space-y-3">{byId.lt && <LocationCard location={byId.lt} mode="weapons" weapons={weaponsFor(byId.lt)} compact />}{byId.ll && <LocationCard location={byId.ll} mode="weapons" weapons={weaponsFor(byId.ll)} compact />}</div>
          <div className="space-y-3 pt-6">{byId.ct && <LocationCard location={byId.ct} mode="weapons" weapons={weaponsFor(byId.ct)} compact tall />}</div>
          <div className="space-y-3">{byId.rt && <LocationCard location={byId.rt} mode="weapons" weapons={weaponsFor(byId.rt)} compact />}{byId.rl && <LocationCard location={byId.rl} mode="weapons" weapons={weaponsFor(byId.rl)} compact />}</div>
          <div className="space-y-3 pt-20 2xl:pt-10">{byId.ra && <LocationCard location={byId.ra} mode="weapons" weapons={weaponsFor(byId.ra)} compact />}</div>
        </div>
      </div>
    </>
  );
}

function LocationCard({
  location,
  mode,
  weapons = [],
  compact = false,
  tall = false,
  head = false,
}: {
  location: UnitLocation;
  mode: UnitPanelMode;
  weapons?: UnitWeapon[];
  compact?: boolean;
  tall?: boolean;
  head?: boolean;
}) {
  const visibleSlots = head ? location.slots.slice(0, 6) : location.slots;
  const occupiedSlots = visibleSlots.filter((slot) => slot.type !== "empty").length;
  const armorPct = Math.min(100, Math.round((location.armor / Math.max(location.armor, location.structure || 1)) * 100));

  const cardClassName = [
    "min-w-0 rounded-3xl border border-zinc-800 bg-zinc-950/70",
    compact ? "p-3" : "p-4",
    tall ? "xl:min-h-[520px]" : "",
    head ? "xl:min-h-0" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <div className="mb-3 text-center">
        <div className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-xl bg-lime-400/10 text-lime-300">
          <MapPin size={15} />
        </div>
        <h3 className="text-base font-black text-zinc-50">{location.name}</h3>
        <p className="text-[11px] text-zinc-500">
          {occupiedSlots}/{visibleSlots.length} slots occupied
        </p>
      </div>

      <div className={`mb-4 grid gap-2 ${location.rearArmor !== undefined ? "grid-cols-3" : "grid-cols-2"}`}>
        <ArmorPip label="AR" value={location.armor} />
        {location.rearArmor !== undefined && <ArmorPip label="RR" value={location.rearArmor} />}
        <ArmorPip label="ST" value={location.structure} />
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-lime-400" style={{ width: `${armorPct}%` }} />
      </div>

      {mode === "slots" ? (
        <div className="grid grid-cols-1 gap-1.5">
          {visibleSlots.map((slot) => (
            <CriticalSlotRow key={`${location.id}-${slot.slot}`} slot={slot} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {weapons.length > 0 ? (
            weapons.map((weapon) => <WeaponPlacementRow key={weapon.id} weapon={weapon} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-4 text-center text-sm text-zinc-500">
              No weapons in this location.
            </div>
          )}
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

function EmptyPanel({ message }: { message: string }) {
  return <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-950/50 p-8 text-center text-zinc-500">{message}</div>;
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

function weightClassFromTonnage(tonnage: number) {
  if (!Number.isFinite(tonnage) || tonnage <= 0) return "";
  if (tonnage <= 35) return "Light";
  if (tonnage <= 55) return "Medium";
  if (tonnage <= 75) return "Heavy";
  return "Assault";
}

function normalizeRulesLevel(value: string | number | undefined) {
  const raw = String(value ?? "").trim();
  const lower = raw.toLowerCase();

  if (!raw) return "Unknown";
  if (["1", "intro", "introductory"].includes(lower)) return "Introductory";
  if (["2", "standard"].includes(lower)) return "Standard";
  if (["3", "advanced"].includes(lower)) return "Advanced";
  if (["4", "experimental"].includes(lower)) return "Experimental";
  if (["5", "unofficial"].includes(lower)) return "Unofficial";

  return raw;
}

function normalizeEra(value: string | undefined, year: number) {
  const raw = String(value ?? "").trim();
  const lower = raw.toLowerCase();

  if (lower === "star league") return "Star League";
  if (lower === "succession wars") return "Succession Wars";
  if (lower === "clan invasion") return "Clan Invasion";
  if (lower === "civil war") return "Civil War";
  if (lower === "jihad") return "Jihad";
  if (lower === "republic") return "Republic";
  if (lower === "dark age") return "Dark Age";
  if (lower === "ilclan" || lower === "ilclan era" || lower === "dark age / ilclan") return "IlClan";

  return eraFromYear(year);
}

function eraFromYear(year: number) {
  if (!Number.isFinite(year) || year <= 0) return "";
  if (year <= 2780) return "Star League";
  if (year <= 3049) return "Succession Wars";
  if (year <= 3061) return "Clan Invasion";
  if (year <= 3067) return "Civil War";
  if (year <= 3080) return "Jihad";
  if (year <= 3130) return "Republic";
  if (year <= 3150) return "Dark Age";
  return "IlClan";
}
