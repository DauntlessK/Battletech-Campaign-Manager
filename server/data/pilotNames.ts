export const PILOT_FIRST_NAMES = [
  "Alex", "Morgan", "Jordan", "Casey", "Taylor", "Riley", "Avery", "Quinn", "Cameron", "Drew",
  "Kai", "Rowan", "Reese", "Hayden", "Parker", "Emerson", "Finley", "Sawyer", "Dakota", "Logan",
  "Marcus", "Elena", "Nadia", "Victor", "Tessa", "Malik", "Anika", "Jonas", "Mira", "Darius",
  "Sonia", "Anton", "Leah", "Kellan", "Ilya", "Rafael", "Mara", "Gideon", "Selene", "Tobin",
  "Astrid", "Brennan", "Cassia", "Devon", "Elias", "Freya", "Galen", "Helena", "Iris", "Jace",
  "Kira", "Lena", "Mason", "Nico", "Opal", "Petra", "Ronan", "Sable", "Theo", "Vera",
];

export const PILOT_LAST_NAMES = [
  "Adler", "Bannon", "Cross", "Daunt", "Eckhart", "Falk", "Graves", "Hale", "Irons", "Jensen",
  "Kincaid", "Locke", "Mason", "Novak", "Ortega", "Pierce", "Quade", "Rourke", "Stone", "Talon",
  "Ueda", "Voss", "Ward", "Xander", "Yates", "Zhao", "Breen", "Kovacs", "Mendoza", "Adebayo",
  "Sato", "Dumont", "Volkov", "Mercer", "Rhee", "Carver", "Bishop", "Vale", "Drake", "Harrow",
  "Carter", "Serrano", "Fenwick", "Ivers", "Ashford", "Tanner", "Blackwood", "Reyes", "Whitaker", "Mori",
  "Barrett", "Hughes", "Solace", "Keller", "Navarro", "Vega", "Wolfe", "Sinclair", "Archer", "Rhodes",
];

export function randomPilotName(): string {
  const first = PILOT_FIRST_NAMES[Math.floor(Math.random() * PILOT_FIRST_NAMES.length)];
  const last = PILOT_LAST_NAMES[Math.floor(Math.random() * PILOT_LAST_NAMES.length)];
  return `${first} ${last}`;
}
