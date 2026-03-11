// ─── PRESET ROUTES ───────────────────────────────────────────────────────────
// 50 top Harare kombi routes collected from rank observation.
// New routes added by users are appended to state at runtime.

export const PRESET_ROUTES = [
  // Copacabana rank
  { id: "r1",  from: "Glen Norah A",       to: "CBD",       rank: "Copacabana"   },
  { id: "r2",  from: "Glen Norah B",       to: "CBD",       rank: "Copacabana"   },
  { id: "r3",  from: "Glen View 1",        to: "CBD",       rank: "Copacabana"   },
  { id: "r4",  from: "Glen View 4",        to: "CBD",       rank: "Copacabana"   },
  { id: "r5",  from: "Budiriro 1",         to: "CBD",       rank: "Copacabana"   },
  { id: "r6",  from: "Budiriro 5",         to: "CBD",       rank: "Copacabana"   },
  { id: "r7",  from: "Highfield",          to: "CBD",       rank: "Copacabana"   },
  { id: "r8",  from: "Southlands",         to: "CBD",       rank: "Copacabana"   },
  { id: "r9",  from: "Workington",         to: "CBD",       rank: "Copacabana"   },
  { id: "r10", from: "Rugare",             to: "CBD",       rank: "Copacabana"   },

  // Machipisa rank
  { id: "r11", from: "Madokero",           to: "CBD",       rank: "Machipisa"    },
  { id: "r12", from: "Kuwadzana 1",        to: "CBD",       rank: "Machipisa"    },
  { id: "r13", from: "Kuwadzana 3",        to: "CBD",       rank: "Machipisa"    },
  { id: "r14", from: "Warren Park D",      to: "CBD",       rank: "Machipisa"    },
  { id: "r15", from: "Mufakose",           to: "CBD",       rank: "Machipisa"    },
  { id: "r16", from: "Dzivarasekwa",       to: "CBD",       rank: "Machipisa"    },
  { id: "r17", from: "Kambuzuma",          to: "CBD",       rank: "Machipisa"    },
  { id: "r18", from: "Westwood",           to: "CBD",       rank: "Machipisa"    },

  // Fourth Street rank
  { id: "r19", from: "Hatfield",           to: "CBD",       rank: "Fourth St"    },
  { id: "r20", from: "Mabelreign",         to: "CBD",       rank: "Fourth St"    },
  { id: "r21", from: "Avondale",           to: "CBD",       rank: "Fourth St"    },
  { id: "r22", from: "Greendale",          to: "CBD",       rank: "Fourth St"    },
  { id: "r23", from: "Highlands",          to: "CBD",       rank: "Fourth St"    },
  { id: "r24", from: "Msasa",              to: "CBD",       rank: "Fourth St"    },
  { id: "r25", from: "Tafara",             to: "CBD",       rank: "Fourth St"    },
  { id: "r26", from: "Mabvuku",            to: "CBD",       rank: "Fourth St"    },
  { id: "r27", from: "Hopley",             to: "CBD",       rank: "Fourth St"    },

  // Mbare Musika rank
  { id: "r28", from: "Chitungwiza Unit A", to: "CBD",       rank: "Mbare Musika" },
  { id: "r29", from: "Chitungwiza Unit B", to: "CBD",       rank: "Mbare Musika" },
  { id: "r30", from: "Chitungwiza Unit C", to: "CBD",       rank: "Mbare Musika" },
  { id: "r31", from: "Epworth",            to: "CBD",       rank: "Mbare Musika" },
  { id: "r32", from: "Mbare",              to: "CBD",       rank: "Mbare Musika" },
  { id: "r33", from: "Matapi",             to: "CBD",       rank: "Mbare Musika" },

  // Cross-suburb routes
  { id: "r34", from: "Kuwadzana",          to: "Westgate",  rank: "Machipisa"    },
  { id: "r35", from: "Glen Norah",         to: "Highfield", rank: "Copacabana"   },
  { id: "r36", from: "Mbare",              to: "Highfield", rank: "Mbare Musika" },
  { id: "r37", from: "Hatfield",           to: "Eastlea",   rank: "Fourth St"    },
  { id: "r38", from: "Budiriro",           to: "Highfield", rank: "Copacabana"   },
  { id: "r39", from: "Southlands",         to: "Msasa",     rank: "Copacabana"   },
  { id: "r40", from: "Tafara",             to: "Mabvuku",   rank: "Fourth St"    },
  { id: "r41", from: "Glen View",          to: "Budiriro",  rank: "Copacabana"   },
  { id: "r42", from: "Mufakose",           to: "Kuwadzana", rank: "Machipisa"    },
  { id: "r43", from: "Epworth",            to: "Mbare",     rank: "Mbare Musika" },
  { id: "r44", from: "Greendale",          to: "Msasa",     rank: "Fourth St"    },
  { id: "r45", from: "Chitungwiza",        to: "Mbare",     rank: "Mbare Musika" },
  { id: "r46", from: "Warren Park",        to: "Westgate",  rank: "Machipisa"    },
  { id: "r47", from: "Kambuzuma",          to: "Highfield", rank: "Machipisa"    },
  { id: "r48", from: "Mabvuku",            to: "Tafara",    rank: "Fourth St"    },
  { id: "r49", from: "Dzivarasekwa",       to: "Kuwadzana", rank: "Machipisa"    },
  { id: "r50", from: "Highfield",          to: "Mbare",     rank: "Copacabana"   },
];

// ─── SIGNAL CONTEXT TAGS ─────────────────────────────────────────────────────
export const TAGS = [
  { id: "traffic", label: "Heavy traffic"  },
  { id: "council", label: "Council nearby" },
  { id: "rain",    label: "Raining"        },
];

// ─── TIMING CONSTANTS ────────────────────────────────────────────────────────
// How long a signal stays active without a bump (25 minutes)
export const SIGNAL_TTL    = 25 * 60 * 1000;
// Minimum time between "Still waiting" bumps (8 minutes)
export const BUMP_INTERVAL =  8 * 60 * 1000;