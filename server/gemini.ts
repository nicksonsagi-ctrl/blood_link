import { GoogleGenAI } from '@google/genai';
import { db } from './store.ts';

// Server-side initialization of Gemini client per AI Studio Build standards
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are LifeLink AI Assistant (லைஃப்லிங்க் AI உதவியாளர்), the official intelligent triage, donor matching, and medical information assistant for LifeLink Sri Lanka.
You specialize in emergency blood coordination across Sri Lanka (Northern Province, Jaffna, Kilinochchi, Vavuniya, Mannar, Mullaitivu, Western Province, Colombo, Kandy, Galle, etc.).

Key Medical & Protocol Guidelines:
1. Blood Compatibility:
   - Universal red cell donor: O- (can donate to any blood type).
   - Universal plasma donor: AB+.
   - Universal recipient: AB+ (can receive red blood cells from any type).
   - Rh positive can receive from Rh positive or Rh negative. Rh negative must receive Rh negative red cells.
2. NBTS Sri Lanka Donation Rules:
   - Age: 18 - 60 years (first-time donors up to 55).
   - Weight: At least 50 kg (110 lbs).
   - Minimum interval: Strictly 90 days (3 months) between whole blood donations.
   - Hemoglobin: Minimum 12.5 g/dL.
   - Rest 15-30 minutes after donating and drink plenty of fluids.
3. Privacy & "Already Donated" Status:
   - Explain that donors marked "Already Donated" have recently fulfilled a transfusion or have an active patient commitment, honoring their 90-day clinical recovery period.
   - Requesters can only send contact requests to verified, ready donors to avoid donor spam.
4. Emergency Hospital Hotlines in Sri Lanka:
   - National Blood Transfusion Service (NBTS) Sri Lanka 24/7 Hotline: 1923
   - Teaching Hospital Jaffna Blood Bank: +94 21 222 2261
   - Chavakachcheri Base Hospital: +94 21 227 2261
   - Point Pedro Base Hospital: +94 21 226 2261
   - National Hospital of Sri Lanka (NHSL), Colombo: +94 11 269 1111
   - Emergency Ambulance Service (Suwa Seriya): 1990
5. Language & Tone:
   - Respond empathetically, clearly, and concisely.
   - Support English, Tamil (தமிழ்), and Tanglish. If the user writes in Tamil or Tanglish, reply in natural, polite Tamil or Tanglish with clear English terms for blood types and phone numbers.
   - Always state clearly that for acute clinical emergencies, one should immediately call 1923, 1990, or the nearest hospital blood bank.`;

function getSmartFallbackReply(userMessage: string): string {
  const q = userMessage.toLowerCase();

  // Compatibility queries
  if (q.includes('compatibility') || q.includes('who can receive') || q.includes('who can donate') || q.includes('universal') || q.includes('blood group')) {
    return `🩸 **LifeLink Blood Compatibility Guide:**\n\n` +
      `• **O- (Universal Donor):** Can give red blood cells to ANY blood type (A+, A-, B+, B-, AB+, AB-, O+, O-). Highly needed in trauma surgeries.\n` +
      `• **AB+ (Universal Recipient):** Can safely receive red blood cells from any group.\n` +
      `• **Rh Protocol:** Rh-negative individuals should receive Rh-negative blood to avoid antibody reactions.\n\n` +
      `In Sri Lanka, Teaching Hospital Jaffna and NBTS verify cross-matching before every transfusion.`;
  }

  // Hospital / Contact queries
  if (q.includes('hospital') || q.includes('jaffna') || q.includes('contact') || q.includes('phone') || q.includes('hotline') || q.includes('number') || q.includes('emergency')) {
    return `🏥 **Emergency Blood Bank & Hospital Hotlines (Sri Lanka):**\n\n` +
      `• **NBTS National Blood Hotline:** **1923** (24/7 Toll-Free)\n` +
      `• **Teaching Hospital Jaffna Blood Bank:** **+94 21 222 2261**\n` +
      `• **Point Pedro Base Hospital:** **+94 21 226 2261**\n` +
      `• **Chavakachcheri Base Hospital:** **+94 21 227 2261**\n` +
      `• **Suwa Seriya Free Emergency Ambulance:** **1990**\n\n` +
      `For urgent transfusions in Jaffna, coordinate directly with the Teaching Hospital blood bank counter.`;
  }

  // Eligibility / 90 days queries
  if (q.includes('eligible') || q.includes('interval') || q.includes('90') || q.includes('can i donate') || q.includes('weight') || q.includes('age') || q.includes('fever') || q.includes('sick')) {
    return `✅ **Voluntary Donor Eligibility Criteria (NBTS Sri Lanka):**\n\n` +
      `1. **Age:** 18 - 60 years old.\n` +
      `2. **Weight:** Minimum 50 kg.\n` +
      `3. **Recovery Interval:** Minimum **90 days (3 months)** between whole blood donations to replenish iron & hemoglobin.\n` +
      `4. **General Health:** No recent fever, surgery, or active antibiotics within the last 14 days.\n` +
      `5. **Pregnancy & Lactation:** Excluded until 6 months post-delivery/weaning.\n\n` +
      `If you already donated recently, your profile status displays **Already Donated** until the 90-day window expires.`;
  }

  // Already donated queries
  if (q.includes('already donated') || q.includes('donated') || q.includes('commitment')) {
    return `ℹ️ **Regarding 'Already Donated' Status:**\n\n` +
      `When a registered donor accepts an urgent blood request or donates at a hospital, LifeLink automatically sets their status to **Already Donated** with the recorded Donation Date.\n\n` +
      `This safeguards the donor's health by ensuring the mandatory 90-day recovery interval under Sri Lanka medical standards. Requesters are gently guided to reach out to other active, verified donors.`;
  }

  // Tamil greeting / queries
  if (/[\u0B80-\u0BFF]/.test(userMessage) || q.includes('vanakkam') || q.includes('epdi') || q.includes('ratham')) {
    return `வணக்கம்! நான் **LifeLink AI உதவியாளர்**.\n\n` +
      `உங்களுக்கு எவ்வாறு உதவ முடியும்?\n` +
      `• அவசர ரத்தக் கொடையாளர்கள் விபரம்\n` +
      `• ரத்தப் பொருத்தங்கள் (Blood Compatibility: O-, A+, B+, AB+)\n` +
      `• யாழ்ப்பாணம் போதனா வைத்தியசாலை ரத்த வங்கி: **021-222-2261**\n` +
      `• தேசிய ரத்த மாற்று சேவை அவசர எண்: **1923**\n` +
      `• அவசர ஆம்புலன்ஸ் சேவை: **1990**\n\n` +
      `நீங்கள் எந்த இரத்த வகை அல்லது வைத்தியசாலை பற்றி அறிய விரும்புகிறீர்கள்?`;
  }

  // General helpful response
  return `👋 **Hello! I am your LifeLink AI Assistant.**\n\n` +
    `I can help you coordinate blood donations across Sri Lanka:\n` +
    `• **Find & Verify Donors:** Check availability and donation interval rules.\n` +
    `• **Blood Compatibility:** Check red cell & plasma match rules for any group.\n` +
    `• **Emergency Contacts:** Instant numbers for Jaffna Teaching Hospital (+94 21 222 2261) and NBTS hotline (1923).\n\n` +
    `How can I assist you with your blood request or donor question today?`;
}

export async function askGeminiAssistant(
  userMessage: string,
  history: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = []
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('[LifeLink AI] GEMINI_API_KEY not configured, using intelligent Sri Lanka fallback engine');
    return getSmartFallbackReply(userMessage);
  }

  try {
    // Collect brief live stats from current database store for contextual grounding
    const donorCount = db.donorProfiles.size;
    const requestCount = db.bloodRequests.size;
    const campaignCount = db.campaigns.size;

    const contextGrounding = `\nCurrent Platform Realtime Stats:\n- Verified Donors in Registry: ${donorCount}\n- Active/Historical Blood Requests: ${requestCount}\n- Upcoming Campaigns: ${campaignCount}\n`;

    const contents = [
      ...history.slice(-8), // Send last 8 turns for conversational context
      {
        role: 'user',
        parts: [{ text: `${contextGrounding}\nUser question: ${userMessage}` }],
      },
    ];

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out')), 5000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;

    const reply = response?.text;
    if (reply && reply.trim()) {
      return reply.trim();
    }
    return getSmartFallbackReply(userMessage);
  } catch (error: any) {
    console.warn('[LifeLink AI] Gemini API call error:', error?.message || error);
    return getSmartFallbackReply(userMessage);
  }
}
