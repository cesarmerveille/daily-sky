/* Daily Sky lore: names and short meanings. Interpretation, not calculation. */
const LORE = {
  gates: { 1: "Self-Expression", 2: "Direction", 3: "Ordering", 4: "Formulization", 5: "Fixed Rhythms", 6: "Friction", 7: "The Role of the Self", 8: "Contribution", 9: "Focus", 10: "Behavior of the Self", 11: "Ideas", 12: "Caution", 13: "The Listener", 14: "Power Skills", 15: "Extremes", 16: "Skills", 17: "Opinions", 18: "Correction", 19: "Wanting", 20: "The Now", 21: "The Hunter", 22: "Openness", 23: "Assimilation", 24: "Rationalization", 25: "Spirit of the Self", 26: "The Egoist", 27: "Caring", 28: "The Game Player", 29: "Perseverance", 30: "Feelings", 31: "Influence", 32: "Continuity", 33: "Privacy", 34: "Power", 35: "Change", 36: "Crisis", 37: "Friendship", 38: "The Fighter", 39: "Provocation", 40: "Aloneness", 41: "Contraction", 42: "Growth", 43: "Insight", 44: "Alertness", 45: "The Gatherer", 46: "Determination", 47: "Realization", 48: "Depth", 49: "Principles", 50: "Values", 51: "Shock", 52: "Stillness", 53: "Beginnings", 54: "Ambition", 55: "Spirit", 56: "Stimulation", 57: "Intuitive Clarity", 58: "Vitality", 59: "Intimacy", 60: "Acceptance", 61: "Mystery", 62: "Detail", 63: "Doubt", 64: "Confusion" },
  channels: { "1-8": "Inspiration", "2-14": "The Beat", "3-60": "Mutation", "4-63": "Logic", "5-15": "Rhythm", "6-59": "Intimacy", "7-31": "The Alpha", "9-52": "Concentration", "10-20": "Awakening", "10-34": "Exploration", "10-57": "Perfected Form", "11-56": "Curiosity", "12-22": "Openness", "13-33": "The Prodigal", "16-48": "The Wavelength", "17-62": "Acceptance", "18-58": "Judgment", "19-49": "Synthesis", "20-34": "Charisma", "20-57": "The Brainwave", "21-45": "Money", "23-43": "Structuring", "24-61": "Awareness", "25-51": "Initiation", "26-44": "Surrender", "27-50": "Preservation", "28-38": "Struggle", "29-46": "Discovery", "30-41": "Recognition", "32-54": "Transformation", "34-57": "Power", "35-36": "Transitoriness", "37-40": "Community", "39-55": "Emoting", "42-53": "Maturation", "47-64": "Abstraction" },
  hexNames: [null, "The Creative", "The Receptive", "Difficulty at the Beginning", "Youthful Folly", "Waiting", "Conflict", "The Army", "Holding Together", "Small Taming", "Treading", "Peace", "Standstill", "Fellowship", "Possession in Great Measure", "Modesty", "Enthusiasm", "Following", "Work on What Has Been Spoiled", "Approach", "Contemplation", "Biting Through", "Grace", "Splitting Apart", "Return", "Innocence", "The Taming Power of the Great", "Nourishment", "Preponderance of the Great", "The Abysmal", "The Clinging", "Influence", "Duration", "Retreat", "The Power of the Great", "Progress", "Darkening of the Light", "The Family", "Opposition", "Obstruction", "Deliverance", "Decrease", "Increase", "Breakthrough", "Coming to Meet", "Gathering Together", "Pushing Upward", "Oppression", "The Well", "Revolution", "The Cauldron", "The Arousing", "Keeping Still", "Development", "The Marrying Maiden", "Abundance", "The Wanderer", "The Gentle", "The Joyous", "Dispersion", "Limitation", "Inner Truth", "Small Preponderance", "After Completion", "Before Completion"],
  // upper, lower trigram per King Wen number. Q=Heaven K=Earth Z=Thunder C=Water G=Mountain X=Wind L=Fire D=Lake
  hexTri: "QQ KK CZ GC CQ QC KC CK XQ QD KQ QK QL LQ KG ZK DZ GX KD XK LZ GL GK KZ QZ GQ GZ DX CC LL DG ZX QG ZQ LK KL XL LD CG ZC GD XZ DQ QX DK KX DC CX DL LX ZZ GG XG ZD ZL LG XX DD XC CD XD ZG CL LC".split(" "),
  trigrams: { Q: [1, 1, 1], K: [0, 0, 0], Z: [1, 0, 0], C: [0, 1, 0], G: [0, 0, 1], X: [0, 1, 1], L: [1, 0, 1], D: [1, 1, 0] },
  trigramNames: { Q: "Heaven", K: "Earth", Z: "Thunder", C: "Water", G: "Mountain", X: "Wind", L: "Fire", D: "Lake" },
  hermetic: {
    weekdayRuler: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"],
    chaldean: ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"],
    sephirah: { Saturn: ["Binah", "Understanding"], Jupiter: ["Chesed", "Mercy"], Mars: ["Geburah", "Severity"], Sun: ["Tiphareth", "Beauty"], Venus: ["Netzach", "Victory"], Mercury: ["Hod", "Splendour"], Moon: ["Yesod", "Foundation"] },
    sephMeaning: { Binah: "form, limit and the great sea that gives shape", Chesed: "expansion, generosity, the ordering benevolence", Geburah: "strength, judgement, the cutting away", Tiphareth: "the harmonising heart of the Tree", Netzach: "desire, art and natural feeling", Hod: "intellect, language and ritual", Yesod: "the dream-foundation, imagination and the tides" },
    metal: { Saturn: "lead", Jupiter: "tin", Mars: "iron", Sun: "gold", Venus: "copper", Mercury: "quicksilver", Moon: "silver" },
    hourUse: { Saturn: "endings, boundaries, serious work", Jupiter: "generosity, asking, growth", Mars: "courage, effort, cutting away", Sun: "visibility and vitality", Venus: "love, art, pleasure, making peace", Mercury: "study, writing, trade, messages", Moon: "home, rest, dreams" },
    pythag: {
      1: ["Monad", "The source. The Pythagoreans called it the germ of all numbers and a symbol of wisdom."],
      2: ["Duad", "The first departure from unity, called audacity and opinion: the root of polarity and of relationship."],
      3: ["Triad", "The first complete number, with beginning, middle and end; tied to wisdom, friendship and harmony."],
      4: ["Tetrad", "The root of all things and the fountain of nature: the four elements, stability, the square."],
      5: ["Pentad", "The marriage of the first even and first odd numbers: union of opposites, nature, the quintessence."],
      6: ["Hexad", "The form of forms: the creation of the world, balance, the perfection of parts."],
      7: ["Heptad", "Worthy of veneration; the motherless virgin Minerva, and the right moment (opportunity)."],
      8: ["Ogdoad", "The first cube; associated with love, counsel, prudence and law."],
      9: ["Ennead", "The horizon or boundary. It falls just short of ten, so it closes the cycle and gathers all numbers before the return."]
    }
  },
  numerology: {
    1: "Begin. Initiative, independence, a fresh start.", 2: "Pair up. Patience, cooperation, listening.", 3: "Express. Words, creativity, social ease.", 4: "Build. Order, effort, foundations.",
    5: "Move. Change, freedom, the unexpected.", 6: "Care. Responsibility, home, the people you hold.", 7: "Withdraw. Study, analysis, solitude.", 8: "Lead. Money, authority, execution.", 9: "Complete. Release, generosity, endings.",
    11: "Intuition and inspiration, nervous energy.", 22: "The master builder: large-scale building.", 33: "Teaching through service."
  },
  tarot: { 1: "The Magician", 2: "The High Priestess", 3: "The Empress", 4: "The Emperor", 5: "The Hierophant", 6: "The Lovers", 7: "The Chariot", 8: "Justice / Strength", 9: "The Hermit" },
  tenGods: {
    "Friend": "Peers and allies. Good for teamwork. Watch for stubbornness.", "Rob Wealth": "Competition. Others reach for what's yours. Guard money and credit.",
    "Eating God": "Easy creativity, enjoyment, good food and talk.", "Hurting Officer": "Sharp expression and rebellion. Brilliant, but watch the tongue around authority.",
    "Direct Wealth": "Steady money, earned through effort. Good for practical finances.", "Indirect Wealth": "Windfalls and deals. Opportunity with some risk.",
    "Direct Officer": "Rules, status and responsibility. Play it straight.", "Seven Killings": "Pressure and challenge. Good for courage, bad for picking fights.",
    "Direct Resource": "Support, mentors, learning, being looked after.", "Indirect Resource": "Unusual insight, solitude, intuition. Can feel isolating."
  },
  types: {
    "Generator": ["Wait to respond", "Let life bring you something, then follow your gut's yes or no."],
    "Manifesting Generator": ["Wait to respond, then inform", "Respond with your gut, move fast, and tell people before you act."],
    "Projector": ["Wait for the invitation", "Offer guidance where you're recognized and invited. Rest more than you think."],
    "Manifestor": ["Inform before you act", "Tell the people affected, then initiate."],
    "Reflector": ["Wait a lunar cycle", "Big decisions take about 28 days of sampling."]
  },
  // transiting planet -> theme, keyword, caution when in hard aspect
  planets: {
    Sun: ["Action", "identity and vitality", "ego clashes"], Moon: ["Connection", "mood and needs", "moodiness"], Mercury: ["Expression", "thinking and talks", "misunderstandings"],
    Venus: ["Connection", "love, beauty and value", "overindulging or people-pleasing"], Mars: ["Action", "drive and courage", "haste and irritability"],
    Jupiter: ["Resources", "growth and opportunity", "overpromising and overdoing"], Saturn: ["Structure", "discipline and limits", "heaviness and self-criticism"],
    Uranus: ["Change", "breakthroughs and freedom", "impulsive breaks"], Neptune: ["Reflection", "imagination and faith", "confusion and wishful thinking"],
    Pluto: ["Resources", "power and transformation", "power struggles"], NNode: ["Connection", "direction and the collective", "drifting with the crowd"]
  },
  themes: {
    Action: { label: "Momentum", lean: "Spend your energy on something you've already said yes to.", guard: "Pushing things you never responded to." },
    Resources: { label: "Money & leverage", lean: "Run the numbers: prices, invoices, negotiations.", guard: "Promising more than you can deliver." },
    Connection: { label: "People & bonds", lean: "Reach out, repair, spend time with the people who matter.", guard: "Taking on other people's moods as yours." },
    Expression: { label: "Words & ideas", lean: "Write, pitch, explain, publish.", guard: "Talking a decision into being that your gut hasn't made." },
    Structure: { label: "Order & commitments", lean: "Plan, tidy, keep the promises you already made.", guard: "Rigidity and harsh self-judgement." },
    Change: { label: "Change & freedom", lean: "Try something new, break a stale routine.", guard: "Burning bridges on impulse." },
    Reflection: { label: "Insight & rest", lean: "Slow down, journal, study, recover.", guard: "Escaping into fog instead of deciding." }
  },
  numTheme: { 1: "Action", 2: "Connection", 3: "Expression", 4: "Structure", 5: "Change", 6: "Connection", 7: "Reflection", 8: "Resources", 9: "Reflection" },
  godTheme: { "Friend": "Connection", "Rob Wealth": "Connection", "Eating God": "Expression", "Hurting Officer": "Expression", "Direct Wealth": "Resources", "Indirect Wealth": "Resources", "Direct Officer": "Structure", "Seven Killings": "Structure", "Direct Resource": "Reflection", "Indirect Resource": "Reflection" },
  centerTheme: { Head: "Reflection", Ajna: "Reflection", Throat: "Expression", G: "Change", Heart: "Resources", Sacral: "Action", SolarPlexus: "Connection", Spleen: "Reflection", Root: "Action" },
  gateTheme: { 14: "Resources", 21: "Resources", 26: "Resources", 45: "Resources", 40: "Resources", 54: "Resources", 8: "Expression", 12: "Expression", 16: "Expression", 35: "Change", 3: "Change", 49: "Change", 37: "Connection", 59: "Connection", 6: "Connection", 52: "Reflection", 61: "Reflection", 64: "Reflection", 60: "Structure", 15: "Structure", 7: "Structure", 9: "Structure" },
  centerMeaning: { Head: "mental pressure and questions", Ajna: "thinking and certainty", Throat: "speaking and doing", G: "identity and direction", Heart: "willpower and self-worth", Sacral: "life-force and work energy", SolarPlexus: "emotions and moods", Spleen: "instinct, health and timing", Root: "pressure and adrenaline" }
};
if (typeof module === "object") module.exports = LORE;
