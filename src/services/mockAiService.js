const GEMINI_KEY = process.env.REACT_APP_GEMINI_KEY;

// ── REAL GEMINI CALL ──────────────────────────────────────────────────────────
// This runs when REACT_APP_GEMINI_KEY is set in your .env file
export async function detectRecipeFromUrl(videoUrl) {
  const prompt = `
You are a recipe extraction assistant.
A user has shared this cooking video URL: ${videoUrl}

Based on the URL and any context you can infer, generate a realistic and complete recipe.

Respond with ONLY a valid JSON object in exactly this shape, no markdown, no backticks, no explanation:
{
  "n": "Full Recipe Name",
  "e": "one emoji representing the dish",
  "time": "30 min",
  "prep": "10 min",
  "diff": "Easy",
  "srv": 4,
  "tags": ["tag1", "tag2"],
  "ing": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
  "steps": ["Full step 1 description", "Full step 2 description"],
  "notes": "Helpful tip or storage info"
}

Rules:
- diff must be exactly one of: Easy, Medium, Hard
- Include at least 6 ingredients and 4 steps
- Return ONLY the raw JSON object, nothing else
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `Gemini API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  const clean = text.replace(/```json|```/g, '').trim();
  const recipe = JSON.parse(clean);

  return {
    ...recipe,
    id: 'ai_' + Date.now(),
    ts: Date.now(),
    fav: false,
    src: 'AI',
    c1: '#ddd0e8',
    c2: '#f0e4b8',
  };
}

// ── MOCK FALLBACK ─────────────────────────────────────────────────────────────
// Used when no API key is present
export async function mockDetect() {
  await new Promise(r => setTimeout(r, 2500));

  const MOCKS = [
    {
      n: 'Saffron Orzo with Crispy Capers',
      e: '🍋',
      c1: '#f0e4b8',
      c2: '#f0d5ce',
      time: '30 min',
      prep: '10 min',
      diff: 'Easy',
      srv: 4,
      src: 'AI',
      tags: ['pasta', 'vegetarian'],
      ing: [
        '300g orzo pasta',
        '3 tbsp capers, dried well',
        '2 shallots, finely sliced',
        '3 garlic cloves, minced',
        'Generous pinch of saffron threads',
        '700ml hot vegetable stock',
        'Zest & juice of 1 lemon',
        '50g parmesan, finely grated',
        'Flat-leaf parsley to serve',
      ],
      steps: [
        'Bloom saffron in 2 tbsp hot stock for 10 minutes.',
        'Fry capers in olive oil until crispy, 3–4 min. Remove and set aside.',
        'Soften shallots 4 min. Add garlic and cook 1 min more.',
        'Add orzo and toast 2 min. Add stock and saffron. Simmer 10 min, stirring often.',
        'Off heat: stir in parmesan and lemon. Rest 2 min. Top with crispy capers and parsley.',
      ],
      notes: 'Orzo thickens as it rests — add a splash of hot water to loosen before serving.',
    },
    {
      n: 'Charred Broccoli & White Bean Purée',
      e: '🥦',
      c1: '#c8dbc9',
      c2: '#f0e4b8',
      time: '25 min',
      prep: '8 min',
      diff: 'Easy',
      srv: 2,
      src: 'AI',
      tags: ['vegetarian', 'healthy'],
      ing: [
        '1 large broccoli head, cut into florets',
        '400g tinned cannellini beans, drained',
        '2 garlic cloves',
        '4 tbsp extra virgin olive oil',
        '1 unwaxed lemon',
        '1 tsp smoked paprika',
        'Dried chilli flakes',
        '30g pine nuts, lightly toasted',
      ],
      steps: [
        'Toss broccoli with 2 tbsp oil, salt, and chilli. Spread on a large tray.',
        'Roast at 230°C for 18–20 minutes until edges are deeply charred.',
        'Blend beans, garlic, lemon juice, remaining oil, and 3 tbsp water until silky smooth.',
        'Season purée generously with salt and white pepper.',
        'Spread purée on plates, top with charred broccoli, pine nuts, and a drizzle of paprika oil.',
      ],
      notes: 'High heat is essential — do not overcrowd the tray or it will steam instead of char.',
    },
  ];

  const r = { ...MOCKS[Math.floor(Math.random() * MOCKS.length)] };
  r.id = 'mock_' + Date.now();
  r.ts = Date.now();
  r.fav = false;
  return r;
}
