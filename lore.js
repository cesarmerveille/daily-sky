/* Daily Sky lore: names and short meanings. Interpretation, not calculation. */
const LORE = {
  gates: { 1: "Self-Expression", 2: "Direction", 3: "Ordering", 4: "Formulization", 5: "Fixed Rhythms", 6: "Friction", 7: "The Role of the Self", 8: "Contribution", 9: "Focus", 10: "Behavior of the Self", 11: "Ideas", 12: "Caution", 13: "The Listener", 14: "Power Skills", 15: "Extremes", 16: "Skills", 17: "Opinions", 18: "Correction", 19: "Wanting", 20: "The Now", 21: "The Hunter", 22: "Openness", 23: "Assimilation", 24: "Rationalization", 25: "Spirit of the Self", 26: "The Egoist", 27: "Caring", 28: "The Game Player", 29: "Perseverance", 30: "Feelings", 31: "Influence", 32: "Continuity", 33: "Privacy", 34: "Power", 35: "Change", 36: "Crisis", 37: "Friendship", 38: "The Fighter", 39: "Provocation", 40: "Aloneness", 41: "Contraction", 42: "Growth", 43: "Insight", 44: "Alertness", 45: "The Gatherer", 46: "Determination", 47: "Realization", 48: "Depth", 49: "Principles", 50: "Values", 51: "Shock", 52: "Stillness", 53: "Beginnings", 54: "Ambition", 55: "Spirit", 56: "Stimulation", 57: "Intuitive Clarity", 58: "Vitality", 59: "Intimacy", 60: "Acceptance", 61: "Mystery", 62: "Detail", 63: "Doubt", 64: "Confusion" },
  channels: { "1-8": "Inspiration", "2-14": "The Beat", "3-60": "Mutation", "4-63": "Logic", "5-15": "Rhythm", "6-59": "Intimacy", "7-31": "The Alpha", "9-52": "Concentration", "10-20": "Awakening", "10-34": "Exploration", "10-57": "Perfected Form", "11-56": "Curiosity", "12-22": "Openness", "13-33": "The Prodigal", "16-48": "The Wavelength", "17-62": "Acceptance", "18-58": "Judgment", "19-49": "Synthesis", "20-34": "Charisma", "20-57": "The Brainwave", "21-45": "Money", "23-43": "Structuring", "24-61": "Awareness", "25-51": "Initiation", "26-44": "Surrender", "27-50": "Preservation", "28-38": "Struggle", "29-46": "Discovery", "30-41": "Recognition", "32-54": "Transformation", "34-57": "Power", "35-36": "Transitoriness", "37-40": "Community", "39-55": "Emoting", "42-53": "Maturation", "47-64": "Abstraction" },
  hexNames: [null, "The Creative", "The Receptive", "Difficulty at the Beginning", "Youthful Folly", "Waiting", "Conflict", "The Army", "Holding Together", "Small Taming", "Treading", "Peace", "Standstill", "Fellowship", "Possession in Great Measure", "Modesty", "Enthusiasm", "Following", "Work on What Has Been Spoiled", "Approach", "Contemplation", "Biting Through", "Grace", "Splitting Apart", "Return", "Innocence", "The Taming Power of the Great", "Nourishment", "Preponderance of the Great", "The Abysmal", "The Clinging", "Influence", "Duration", "Retreat", "The Power of the Great", "Progress", "Darkening of the Light", "The Family", "Opposition", "Obstruction", "Deliverance", "Decrease", "Increase", "Breakthrough", "Coming to Meet", "Gathering Together", "Pushing Upward", "Oppression", "The Well", "Revolution", "The Cauldron", "The Arousing", "Keeping Still", "Development", "The Marrying Maiden", "Abundance", "The Wanderer", "The Gentle", "The Joyous", "Dispersion", "Limitation", "Inner Truth", "Small Preponderance", "After Completion", "Before Completion"],
  // upper, lower trigram per King Wen number. Q=Heaven K=Earth Z=Thunder C=Water G=Mountain X=Wind L=Fire D=Lake
  hexTri: "QQ KK CZ GC CQ QC KC CK XQ QD KQ QK QL LQ KG ZK DZ GX KD XK LZ GL GK KZ QZ GQ GZ DX CC LL DG ZX QG ZQ LK KL XL LD CG ZC GD XZ DQ QX DK KX DC CX DL LX ZZ GG XG ZD ZL LG XX DD XC CD XD ZG CL LC".split(" "),
  trigrams: { Q: [1, 1, 1], K: [0, 0, 0], Z: [1, 0, 0], C: [0, 1, 0], G: [0, 0, 1], X: [0, 1, 1], L: [1, 0, 1], D: [1, 1, 0] },
  trigramNames: { Q: "Heaven", K: "Earth", Z: "Thunder", C: "Water", G: "Mountain", X: "Wind", L: "Fire", D: "Lake" },
  lunar: {
    phases: { "New": ["Seed", "Instinct and a fresh start below the surface. Intend, don't announce."], "Crescent": ["Push", "Breaking from the past; momentum against resistance. Keep going."], "First Quarter": ["Build", "Crisis in action: decisions, effort, structure."], "Gibbous": ["Refine", "Analyse, adjust and perfect what you started before it peaks."], "Full": ["See", "Culmination and illumination: what you started becomes visible; relationships mirror you."], "Disseminating": ["Share", "Distribute what you learned; teach, give back."], "Last Quarter": ["Release", "Crisis in consciousness: drop structures that no longer fit."], "Balsamic": ["Rest", "Let go, dream, compost the cycle; seed the next."] },
    natal: { "New": "a starter who acts on instinct", "Crescent": "someone who pushes forward against the past", "First Quarter": "a builder who thrives on decisive action", "Gibbous": "a refiner and analyst, always asking how to make it better and what it means", "Full": "a relater who sees things in perspective and through other people", "Disseminating": "a natural teacher and populariser", "Last Quarter": "a reformer who outgrows old structures", "Balsamic": "a visionary who finishes cycles and seeds the future" },
    evidence: "A supermoon is real astronomy: a full Moon near perigee looks up to ~7% larger and ~15% brighter than an average one, and tides run slightly higher. The word was coined by an astrologer; it usually means within 90% of the closest approach. Studies of the Moon and behaviour (births, ER visits, crime) mostly find nothing. Sleep is the one area with mixed, small effects. Phase meanings follow Rudhyar's eight-phase cycle: symbolic, not causal."
  },
  simple: {
    points: { Sun: "who you are", Moon: "your feelings", Mercury: "your mind and how you talk", Venus: "love and what you enjoy", Mars: "your drive and energy", Jupiter: "your luck and growth", Saturn: "your sense of duty", Uranus: "your need for freedom", Neptune: "your dreams and intuition", Pluto: "your deep inner power", NNode: "your life direction", ASC: "how you come across", MC: "your work and reputation" },
    planets: { Sun: "the spotlight", Mercury: "busy thoughts and messages", Venus: "warmth and charm", Mars: "extra energy and impatience", Jupiter: "a big, generous push", Saturn: "seriousness and limits", Uranus: "surprises and restlessness", Neptune: "dreaminess and sensitivity", Pluto: "intensity and depth", NNode: "the pull of your life path", Moon: "your mood" },
    doing: { Sun: "being yourself", Moon: "self-care", Mercury: "conversations", Venus: "love and pleasure", Mars: "getting moving", Jupiter: "asking for something", Saturn: "serious tasks", Uranus: "trying something new", Neptune: "creativity and rest", Pluto: "deep talks", NNode: "your bigger goals", ASC: "meeting people", MC: "work matters" },
    toneNoun: { trine: "get a helpful boost from", sextile: "get a small opening from", square: "feel some pressure from", opposite: "feel a tug-of-war with", conjunct: "get a strong dose of" },
    tone: { trine: ["a helpful boost to", "easy"], sextile: ["a small opening for", "easy"], conjunct: ["a strong focus on", "strong"], square: ["some pressure on", "tense"], opposite: ["a tug-of-war around", "tense"] },
    signs: ["bold and quick", "calm, sensual and steady", "curious and chatty", "caring and home-loving", "warm, proud and playful", "careful, helpful and precise", "harmonious and social", "deep, private and intense", "adventurous and honest", "ambitious and patient", "independent and original", "gentle, dreamy and kind"],
    moonMood: ["quick, impatient feelings; act on the first impulse, then check", "slow, comfortable feelings; good food, touch and nature help", "restless, talkative feelings; chats and variety help", "tender, protective feelings; home and family matter most", "warm, expressive feelings; you want to be seen and appreciated", "practical feelings; tidying and small tasks calm you", "sociable feelings; you want harmony and company", "intense feelings; things feel personal, so give yourself privacy", "optimistic feelings; you want space, travel or a big idea", "serious, steady feelings; good for getting things done", "detached feelings; friends and ideas over drama", "soft, porous feelings; rest, music and water help"],
    phases: { "New": "A fresh start. Quiet, good for wishes and intentions.", "Crescent": "Momentum is building. Keep going with what you began.", "First Quarter": "Time to decide and act. Small hurdles appear.", "Gibbous": "Fine-tune and improve before things peak.", "Full": "Emotions and results are at their peak. Things become clear.", "Disseminating": "Share what you've learned; be generous.", "Last Quarter": "Let go of what isn't working. Clear out.", "Balsamic": "Rest and wind down before the next new beginning." },
    hours: { Venus: "love, beauty and making peace", Mercury: "messages, admin and learning", Jupiter: "asking for things and being generous", Sun: "being seen and confident", Moon: "home and rest", Mars: "effort and exercise", Saturn: "serious, focused work" },
    themes: { Action: "a day for doing", Resources: "a day for money and practical matters", Connection: "a day for people and closeness", Expression: "a day for talking, writing and creating", Structure: "a day for order and getting things done", Change: "a day for something new", Reflection: "a quiet, inward day" },
    gods: { "Friend": "friends and teamwork", "Rob Wealth": "keeping an eye on money around others", "Eating God": "enjoying food, fun and creativity", "Hurting Officer": "speaking your mind (gently)", "Direct Wealth": "earning and practical money", "Indirect Wealth": "lucky chances, with a little risk", "Direct Officer": "responsibility and doing things properly", "Seven Killings": "courage under pressure", "Direct Resource": "support and learning", "Indirect Resource": "intuition and time alone" },
    types: { "Generator": "Your best choices come from a gut feeling: a clear inner \"yes\" or \"no\". Wait for something to respond to rather than forcing things.", "Manifesting Generator": "Trust your gut, move fast, and tell people before you act.", "Projector": "You shine when you are invited and recognised. Rest more than you think you need.", "Manifestor": "You start things. Tell the people affected first, and life gets smoother.", "Reflector": "You mirror your surroundings. Give big decisions about a month." }
  },
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
/* Essential mode: concrete, plain-language advice (what to do, and why today). */
Object.assign(LORE.simple, {
  themeDo: {
    Action: "Put your energy into something you've already committed to: finish a task you started, train, or move a project one real step forward. It's a better day for doing than for planning.",
    Resources: "A good day for money matters: check your budget, send or chase an invoice, compare prices, or prepare a negotiation. Clear numbers today save stress later.",
    Connection: "Reach out to someone who matters: call a friend, fix a small misunderstanding, or plan time together. People are more open than usual.",
    Expression: "Say it or write it: send the email you've been putting off, pitch an idea, post something, or have the conversation you've been rehearsing.",
    Structure: "Get organised: make a plan for the week, tidy one area, and follow through on a promise you've already made. Steady, careful work pays off today.",
    Change: "Change something small: take a new route, try a new place or method, or drop a habit that has gone stale. A little novelty gives you energy today.",
    Reflection: "Give yourself quiet time: journal, read, take a walk alone, or simply rest. Answers come more easily when you stop pushing."
  },
  themeGuard: {
    Action: "Forcing things nobody asked for. If you have to push hard to make something happen today, it's probably not the right thing yet.",
    Resources: "Promising more than you can deliver. If someone asks for a favour, a discount or a deadline, give yourself a buffer before you say yes.",
    Connection: "Taking on other people's moods. If someone around you is upset, be kind, but remember their bad day isn't yours to carry.",
    Expression: "Talking yourself into a decision. Saying something out loud doesn't make it right; check whether your gut actually agrees.",
    Structure: "Being too hard on yourself or others. Aim for done and decent rather than perfect.",
    Change: "Burning bridges on impulse. Change the small things freely, but sleep on anything you can't undo, like quitting or ending something.",
    Reflection: "Hiding in the fog. Rest is good, but don't use it to avoid a decision that needs making."
  },
  hardPlanet: {
    Sun: ["Ego clashes.", "You may feel a need to prove yourself. Let a small thing go instead of winning the point."],
    Mercury: ["Misunderstandings.", "Messages can go sideways. Re-read before you send, and confirm times and details."],
    Venus: ["Overspending or people-pleasing.", "It's easy to say yes to treats or to others' wishes. Wait a day before buying or agreeing to anything big."],
    Mars: ["Rushing and irritability.", "You may be short-tempered or hurried. Slow down on the road and count to ten before replying."],
    Jupiter: ["Overdoing it.", "Everything looks possible, so you may take on too much. Pick one thing and do it well."],
    Saturn: ["Heaviness and self-criticism.", "Things can feel slow or blocked. Don't judge your whole life by one tired day."],
    Uranus: ["Sudden decisions.", "You may feel restless and want to shake everything up. Change something small instead of something big."],
    Neptune: ["Confusion and wishful thinking.", "Things may look rosier or vaguer than they are. Check the facts before you trust a promise."],
    Pluto: ["Power struggles.", "Someone may want control, or you might. Notice it and step out of the tug-of-war."],
    NNode: ["Following the crowd.", "Don't do something just because everyone else is. Ask whether it's really your direction."]
  },
  softPlanet: {
    Sun: "You come across well today, so it's a good moment to show your work or speak up.",
    Mercury: "Your thinking is clear, so it's a good time for paperwork, learning or an important conversation.",
    Venus: "Charm comes easily, so it's a good time for a date, a gift, or smoothing things over.",
    Mars: "You have extra energy, so use it for exercise or a task you've been putting off.",
    Jupiter: "Luck is on your side, so ask for what you want: a favour, a raise, or an opportunity.",
    Saturn: "Patience and focus come easily, so it's a good day for serious work that needs care.",
    Uranus: "Fresh ideas come easily, so try the unusual solution.",
    Neptune: "Your intuition and imagination are strong, so it's a good day for art, music or a quiet hunch.",
    Pluto: "You can see beneath the surface, so it's a good day for an honest, deep conversation.",
    NNode: "Small steps toward your bigger goals count double today."
  },
  sysPlain: { "Astrology": "the planets", "Human Design": "your energy map", "Numerology": "your number for the day", "BaZi": "the Chinese calendar", "I Ching": "the I Ching", "Moon": "the Moon" }
});
if (typeof module === "object") module.exports = LORE;
