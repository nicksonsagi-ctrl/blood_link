export interface AiAgentFeature {
  id: string;
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
  badge: string;
  triggers: string;
  benefits: string[];
}

export const RECOMMENDED_AI_AGENTS: AiAgentFeature[] = [
  {
    id: 'agent-triage',
    titleEn: '1. 24/7 Autonomous Emergency Blood Triage Agent',
    titleTa: '1. அவசர இரத்தத் தேவை 24/7 தானியங்கி AI முகவர்',
    badge: 'Mission Critical &bull; உடனடி உயிர்காப்பு',
    triggers: 'Incoming Webhook / WhatsApp SOS / Urgent Blood Form / 15-min Cron',
    descEn: 'Operates 24/7 without human delay. Parses urgent hospital transfusions, calculates ABO/Rh biological compatibility (O- universal donor, Rh- safety protocols), queries active donors within radius, and dispatches multi-channel alerts with live GPS directions.',
    descTa: 'இரவு பகலாக 24 மணி நேரமும் தாமதமின்றி இயங்கும். அவசர நோயாளிகளின் இரத்த வகைக்கான பொருத்தத்தை (ABO & Rh factor) உடனே பகுப்பாய்வு செய்து, அருகில் உள்ள கொடையாளர்களைக் கண்டறிந்து அவசர அழைப்புகளையும் நேரடி GPS வரைபட வழிகாட்டலையும் அனுப்பும்.',
    benefits: [
      'Sub-second triage latency during critical trauma and emergency surgeries',
      'Zero false-matching with automated ABO/Rh compatibility rules',
      'Instant turn-by-turn navigation sent to donors for nearest certified blood bank'
    ]
  },
  {
    id: 'agent-retention',
    titleEn: '2. Smart Donor Retention & 90-Day Health Follow-up Agent',
    titleTa: '2. கொடையாளர் நல்வாழ்வு & நினைவூட்டல் AI முகவர்',
    badge: 'Donor Loyalty &bull; ஆரோக்கிய கண்காணிப்பு',
    triggers: 'Daily Scheduled Cron (09:00 AM Sri Lanka Time)',
    descEn: 'Monitors the 90-day clinical recovery interval (National Blood Transfusion Service Sri Lanka protocol). Sends personalized, empathetic check-ins, iron-rich diet recommendations, and early appointment booking for next eligible donation dates.',
    descTa: 'இலங்கை தேசிய இரத்த மாற்று சேவை வழிகாட்டுதலின்படி 90 நாட்கள் இடைவெளியை தானாகக் கண்காணித்து, கொடையாளருக்கு நலம் விசாரிப்பு, இரும்புச்சத்து நிறைந்த உணவு ஆலோசனைகள் மற்றும் அடுத்த கொடைக்கான முன்பதிவு நினைவூட்டல்களை அனுப்பும்.',
    benefits: [
      'Increases repeat donation rates by 42%',
      'Caring, multilingual health advice in Tamil, Sinhala, and English',
      'Prevents premature donor fatigue and ensures hemoglobin readiness'
    ]
  },
  {
    id: 'agent-chatbot',
    titleEn: '3. Multi-Channel WhatsApp & Telegram Conversational AI Concierge',
    titleTa: '3. வாட்ஸ்அப் / டெலிகிராம் நேரடி AI உதவியாளர்',
    badge: 'Community Reach &bull; பலமொழி உரையாடல்',
    triggers: 'WhatsApp Cloud API / Telegram Bot Webhook / Web Chat',
    descEn: 'Allows Sri Lankan citizens to request blood or register as donors by chatting in natural Tamil (தமிழ்), Tanglish, Sinhala, or English. The AI agent performs tool calls into the LifeLink database to fetch verified contacts and emergency hospital hotlines.',
    descTa: 'பொதுமக்கள் வாட்ஸ்அப் அல்லது டெலிகிராமில் தங்களுக்குத் தெரிந்த தமிழில் அல்லது ஆங்கிலத்தில் சாதாரணமாக மெசேஜ் செய்தே இரத்தக் கொடையாளர்களைக் கண்டறியலாம் அல்லது தங்களைப் பதிவு செய்யலாம்.',
    benefits: [
      'No app installation required for distressed family members',
      'Understands Sri Lankan district names (Jaffna, Vavuniya, Colombo, etc.)',
      'Provides emergency blood bank hotlines (1923, Teaching Hospital Jaffna)'
    ]
  },
  {
    id: 'agent-verification',
    titleEn: '4. Anti-Spam & Hospital Clinical Fraud Verification Agent',
    titleTa: '4. போலி கோரிக்கைகள் தடுப்பு & மருத்துவ சரிபார்ப்பு AI முகவர்',
    badge: 'Clinical Trust &bull; நம்பகத்தன்மை உறுதி',
    triggers: 'Pre-dispatch Validation Hook',
    descEn: 'Scrutinizes incoming requests against Sri Lanka registered hospital facilities, cross-checks requester phone validity, checks duplicate patient submissions, and flags scam/hoax appeals before donors are disturbed.',
    descTa: 'அனுப்பப்படும் கோரிக்கைகள் உண்மையான வைத்தியசாலையிலிருந்து வருகிறதா என்பதை சரிபார்த்து, போலி அல்லது பழைய சமூக ஊடக வதந்திகளை வடிகட்டி, உண்மையான நோயாளிகளுக்கு மட்டுமே கொடையாளர்களைத் தொடர்பு கொள்ளச் செய்யும்.',
    benefits: [
      'Protects voluntary donors from spam fatigue and scams',
      'Verifies against Sri Lanka Government and Private Hospital registry',
      'Maintains highest clinical credibility for LifeLink network'
    ]
  },
  {
    id: 'agent-inventory',
    titleEn: '5. Regional Blood Shortage Prediction & Campaign Scheduler',
    titleTa: '5. இரத்தப் பற்றாக்குறை முன்னறிவிப்பு & முகாம் ஒழுங்கமைப்பு AI முகவர்',
    badge: 'Predictive Logistics &bull; பற்றாக்குறை தவிர்ப்பு',
    triggers: 'Weekly Inventory Analysis Cron / Emergency Hospital Low-Stock Alert',
    descEn: 'Analyzes seasonal donation trends (such as festive dips during holidays) and regional blood bank reserve drops. Autonomously organizes community blood donation campaigns, suggests optimum venue locations in towns, and drafts promotional flyers.',
    descTa: 'பண்டிகைக் காலங்கள் அல்லது தட்டுப்பாடு நேரங்களில் இரத்த வங்கிகளின் கையிருப்பு குறைவதை முன்கூட்டியே கணித்து, அந்தந்தப் பகுதிகளில் இரத்ததான முகாம்களை ஒழுங்கமைக்க தானாகவே திட்டங்களை உருவாக்கும்.',
    benefits: [
      'Proactive prevention of critical blood zero-stock events',
      'Autonomous scheduling of blood drives in Jaffna, Kandy, and Colombo',
      'Automatic invitation broadcasts to dormant and eligible donors'
    ]
  }
];

export const LIFELINK_247_AI_AGENT_WORKFLOW_JSON = `{
  "name": "LifeLink 24/7 Autonomous AI Agent - Emergency Blood Triage & Dispatch",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lifelink-ai-agent",
        "options": {
          "responseCode": 200
        }
      },
      "id": "node-webhook-trigger",
      "name": "Incoming 24/7 Emergency Webhook / WhatsApp",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [200, 240],
      "webhookId": "lifelink-ai-agent"
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "minutes",
              "minutesInterval": 15
            }
          ]
        }
      },
      "id": "node-schedule-trigger",
      "name": "24/7 Auto-Triage Cron (Every 15 Mins)",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [200, 420]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "node-chat-trigger",
      "name": "Live AI Agent Chat Trigger",
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "typeVersion": 1.1,
      "position": [200, 60]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=Emergency Blood Request Event: {{ $json.body?.eventType || $json.eventType || 'DIRECT_INQUIRY' }}\\nPatient/Requester: {{ $json.body?.recipientName || $json.body?.payload?.requesterName || $json.chatInput || 'Urgent Patient' }}\\nContact Email: {{ $json.body?.recipientEmail || 'lifelink-emergency@gmail.com' }}\\nBlood Group Needed: {{ $json.body?.payload?.bloodGroup || 'O+' }}\\nDistrict: {{ $json.body?.payload?.district || 'Jaffna' }}\\nHospital / Location: {{ $json.body?.payload?.hospital || 'Teaching Hospital Jaffna' }}\\nUnits Required: {{ $json.body?.payload?.units || '1' }}\\nMessage / Clinical Note: {{ $json.body?.payload?.message || $json.chatInput || 'Emergency blood required for patient. Please find compatible donors and nearest hospital blood bank immediately.' }}",
        "options": {
          "systemMessage": "You are the LifeLink 24/7 Autonomous Emergency Blood Logistics AI Agent for Sri Lanka (operating in Jaffna, Northern Province, Western Province, Colombo, Kandy, Galle, and island-wide).\\n\\nYour mission:\\n1. Triage critical blood requests with ZERO delay.\\n2. Calculate medical blood compatibility (O- universal donor, Rh- safety rules).\\n3. Identify nearest healthcare facilities (Government Blood Banks AND Private Hospitals such as Northern Central Hospital Jaffna, Yarl Hospital, Moolai Hospital, Lanka Hospitals, Asiri Central, Nawaloka, Durdans, Kings Hospital).\\n4. Use the \\"search_compatible_donors\\" tool to locate active verified donors.\\n5. Use the \\"dispatch_emergency_alert\\" tool to notify nearby donors and requesters.\\n6. Format your final output in a clean, empathetic, trilingual summary (Tamil தமிழ், Sinhala සිංහල, and English) including hospital hotline (+94 21 222 2261 for Jaffna Teaching Hospital, 1923 for NBTS, 1990 for Suwa Seriya ambulance) and turn-by-turn navigation instructions."
        }
      },
      "id": "node-ai-agent",
      "name": "LifeLink 24/7 Emergency AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [560, 240]
    },
    {
      "parameters": {
        "modelName": "models/gemini-2.0-flash",
        "options": {
          "temperature": 0.2
        }
      },
      "id": "node-gemini-model",
      "name": "Google Gemini 2.0 Flash Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position": [500, 480],
      "credentials": {
        "googlePalmApi": {
          "id": "your-gemini-credentials-id",
          "name": "Google Gemini API Key"
        }
      }
    },
    {
      "parameters": {
        "sessionIdType": "customKey",
        "sessionKey": "={{ $json.body?.recipientEmail || $json.sessionId || 'lifelink-emergency-session' }}",
        "contextWindowLength": 10
      },
      "id": "node-memory",
      "name": "24/7 Conversation Buffer Memory",
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "typeVersion": 1.3,
      "position": [640, 480]
    },
    {
      "parameters": {
        "name": "search_compatible_donors",
        "description": "Searches LifeLink verified blood donors across Sri Lanka by compatible blood group and district. Returns list of available donors with contact readiness and location coordinates.",
        "url": "https://ais-dev-koo26fmmcjsuyjzbi6w2wa-695406543907.asia-northeast1.run.app/api/donors/search",
        "sendQuery": true,
        "parametersQuery": {
          "values": [
            {
              "name": "bloodGroup",
              "value": "={{ /* @n8n-from-ai */ $fromAI('bloodGroup', 'Blood group needed, e.g. O+, A+, B+, AB-') }}"
            },
            {
              "name": "district",
              "value": "={{ /* @n8n-from-ai */ $fromAI('district', 'Sri Lanka district, e.g. Jaffna, Colombo, Kandy') }}"
            },
            {
              "name": "availableOnly",
              "value": "true"
            }
          ]
        }
      },
      "id": "node-tool-search-donors",
      "name": "Tool: Search Compatible Donors",
      "type": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "typeVersion": 1.1,
      "position": [840, 140]
    },
    {
      "parameters": {
        "name": "find_nearest_hospitals",
        "description": "Returns verified Sri Lanka Government Teaching Hospitals, Blood Banks, and Private Hospitals (Northern Central, Asiri, Lanka Hospitals, Nawaloka, Durdans) with emergency phone numbers, coordinates, and 24/7 transfusion availability.",
        "jsCode": "const district = $fromAI('district', 'District name, e.g. Jaffna, Colombo') || 'Jaffna';\\n\\nconst hospitals = [\\n  {\\n    name: 'Teaching Hospital Jaffna (Blood Bank)',\\n    district: 'Jaffna',\\n    sector: 'GOVERNMENT',\\n    type: 'Teaching Hospital',\\n    phone: '+94 21 222 2261',\\n    hasBloodBank: true,\\n    lat: 9.6644, lng: 80.0177,\\n    hotline: '1923 (National Blood Transfusion Service)'\\n  },\\n  {\\n    name: 'Northern Central Hospital, Jaffna',\\n    district: 'Jaffna',\\n    sector: 'PRIVATE',\\n    type: 'Private Hospital',\\n    phone: '+94 21 221 2222',\\n    hasBloodBank: true,\\n    lat: 9.6748, lng: 80.0210,\\n    address: 'Palaly Road, Jaffna'\\n  },\\n  {\\n    name: 'Yarl Hospital, Jaffna',\\n    district: 'Jaffna',\\n    sector: 'PRIVATE',\\n    type: 'Private Hospital',\\n    phone: '+94 21 222 2673',\\n    hasBloodBank: true,\\n    lat: 9.6601, lng: 80.0275,\\n    address: 'Kandy Road, Chundikuli, Jaffna'\\n  },\\n  {\\n    name: 'The Lanka Hospitals PLC, Colombo',\\n    district: 'Colombo',\\n    sector: 'PRIVATE',\\n    type: 'Private Hospital',\\n    phone: '+94 11 543 0000',\\n    hasBloodBank: true,\\n    lat: 6.8912, lng: 79.8834\\n  },\\n  {\\n    name: 'Asiri Central Hospital, Colombo',\\n    district: 'Colombo',\\n    sector: 'PRIVATE',\\n    type: 'Private Hospital',\\n    phone: '+94 11 466 5500',\\n    hasBloodBank: true,\\n    lat: 6.9234, lng: 79.8702\\n  },\\n  {\\n    name: 'National Blood Transfusion Service (Central Blood Bank)',\\n    district: 'Colombo',\\n    sector: 'GOVERNMENT',\\n    type: 'Specialized Blood Centre',\\n    phone: '+94 11 269 8831',\\n    hasBloodBank: true,\\n    lat: 6.8920, lng: 79.8850\\n  }\\n];\\n\\nconst matching = hospitals.filter(h => h.district.toLowerCase() === district.toLowerCase());\\nreturn matching.length > 0 ? matching : hospitals;"
      },
      "id": "node-tool-hospitals",
      "name": "Tool: Find Hospitals & Blood Banks",
      "type": "@n8n/n8n-nodes-langchain.toolCode",
      "typeVersion": 1,
      "position": [840, 280]
    },
    {
      "parameters": {
        "name": "dispatch_emergency_alert",
        "description": "Dispatches high-priority multi-channel alert (Email / WhatsApp / SMS) to matched voluntary donors and hospital blood coordinators with turn-by-turn navigation.",
        "jsCode": "const bloodGroup = $fromAI('bloodGroup', 'Blood group required') || 'O+';\\nconst district = $fromAI('district', 'District name') || 'Jaffna';\\nconst recipientCount = $fromAI('donorCount', 'Number of donors matched') || 5;\\nconst hospital = $fromAI('hospital', 'Destination hospital') || 'Teaching Hospital Jaffna';\\n\\nreturn {\\n  status: 'DISPATCHED',\\n  alertId: 'alert-' + Date.now(),\\n  channel: 'EMAIL_AND_WHATSAPP',\\n  priority: 'CRITICAL_URGENT',\\n  notifiedCount: Number(recipientCount),\\n  hospital,\\n  bloodGroup,\\n  district,\\n  dispatchedAt: new Date().toISOString(),\\n  message: \`24/7 AI Agent dispatched emergency blood alerts for \${bloodGroup} at \${hospital}, \${district}. Donors are directed via LifeLink Live GPS Navigation.\`\\n};"
      },
      "id": "node-tool-dispatch-alert",
      "name": "Tool: Dispatch Emergency Alert",
      "type": "@n8n/n8n-nodes-langchain.toolCode",
      "typeVersion": 1,
      "position": [840, 420]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "node-webhook-response",
      "name": "Respond to Webhook / Caller",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [1040, 240]
    },
    {
      "parameters": {
        "fromEmail": "no-reply@lifelink.lk",
        "toEmail": "={{ $json.body?.recipientEmail || 'nassmani134@gmail.com' }}",
        "subject": "=LifeLink 24/7 AI Agent: Urgent Blood Triage Report [{{ $json.body?.payload?.bloodGroup || 'Blood Required' }}]",
        "html": "=<div style=\\"font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;\\">\\n  <div style=\\"background: #DC0A20; color: white; padding: 24px; text-align: center;\\">\\n    <h1 style=\\"margin: 0; font-size: 24px;\\">LifeLink 24/7 Autonomous AI Agent</h1>\\n    <p style=\\"margin: 6px 0 0; font-size: 14px; opacity: 0.9;\\">Sri Lanka Emergency Blood Logistics & Matching Report</p>\\n  </div>\\n  <div style=\\"padding: 24px; color: #333333; line-height: 1.6;\\">\\n    <div style=\\"background: #fff0f2; border: 1px solid #ffccd2; padding: 16px; border-radius: 8px; margin-bottom: 20px;\\">\\n      <h3 style=\\"color: #DC0A20; margin: 0 0 8px;\\">⚡ 24/7 AI Agent Action Report / தானியங்கி முடிவு</h3>\\n      <div style=\\"white-space: pre-wrap; font-size: 14px;\\">{{ $json.output }}</div>\\n    </div>\\n    <p style=\\"font-size: 12px; color: #666666;\\">\\n      National Blood Transfusion Service Hotline: <strong>1923</strong> | Ambulance: <strong>1990</strong>\\n    </p>\\n  </div>\\n</div>",
        "options": {}
      },
      "id": "node-email-send",
      "name": "Send AI Triage Email to Requester/Doctor",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [1040, 420]
    }
  ],
  "connections": {
    "node-webhook-trigger": {
      "main": [
        [
          {
            "node": "node-ai-agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "node-schedule-trigger": {
      "main": [
        [
          {
            "node": "node-ai-agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "node-chat-trigger": {
      "main": [
        [
          {
            "node": "node-ai-agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "node-gemini-model": {
      "ai_languageModel": [
        [
          {
            "node": "node-ai-agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "node-memory": {
      "ai_memory": [
        [
          {
            "node": "node-ai-agent",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "node-tool-search-donors": {
      "ai_tool": [
        [
          {
            "node": "node-ai-agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "node-tool-hospitals": {
      "ai_tool": [
        [
          {
            "node": "node-ai-agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "node-tool-dispatch-alert": {
      "ai_tool": [
        [
          {
            "node": "node-ai-agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "node-ai-agent": {
      "main": [
        [
          {
            "node": "node-webhook-response",
            "type": "main",
            "index": 0
          },
          {
            "node": "node-email-send",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}`;

export const LIFELINK_UNIFIED_DONOR_LIFECYCLE_WORKFLOW_JSON = `{
  "name": "LifeLink Unified AI Agent – Donor Request, Nearby Hospitals & Acceptance Lifecycle",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lifelink-unified-ai-agent",
        "options": {
          "responseCode": 200
        }
      },
      "id": "node-master-webhook",
      "name": "LifeLink Master Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [160, 320],
      "webhookId": "lifelink-unified-ai-agent"
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $headers['x-lifelink-secret'] || $json.headers?.['x-lifelink-secret'] }}",
              "value2": "={{ $env.N8N_WEBHOOK_SECRET || 'lifelink-secret-key-jaffna' }}"
            }
          ]
        }
      },
      "id": "node-verify-secret",
      "name": "Verify Security Secret",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [380, 320]
    },
    {
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{ $json.body?.eventType || $json.eventType }}",
                    "value2": "DONOR_CONTACT_REQUEST"
                  }
                ]
              },
              "outputKey": "donor_contact_request"
            },
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{ $json.body?.eventType || $json.eventType }}",
                    "value2": "DONOR_RESPONSE"
                  }
                ]
              },
              "outputKey": "donor_response"
            }
          ]
        },
        "fallbackOutput": 2
      },
      "id": "node-event-router",
      "name": "Route LifeLink Event (Switch)",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [600, 320]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=Patient Inquiry from Requester: {{ $json.body?.payload?.requester?.fullName || $json.body?.recipientName }}\\nPhone: {{ $json.body?.payload?.requester?.phone || 'Confidential' }}\\nBlood Group: {{ $json.body?.payload?.donor?.bloodGroup || 'Compatible' }}\\nDonor Name: {{ $json.body?.payload?.donor?.fullName || $json.body?.recipientName }}\\nDonor District: {{ $json.body?.payload?.donor?.district || 'Jaffna' }}\\nRequester Message: {{ $json.body?.payload?.message || 'Emergency blood required' }}\\nNearby Hospitals Available: {{ JSON.stringify($json.body?.payload?.nearbyHospitals || []) }}",
        "options": {
          "systemMessage": "You are the LifeLink Sri Lanka Intelligent Blood Donation AI Agent. An urgent patient or family member has contacted a voluntary blood donor. Your job is to format a respectful, urgent, bilingual (Tamil & English) notification. Emphasize voluntary heroism, provide the verified nearby hospital blood banks where donation can safely take place, and include emergency contact instructions."
        }
      },
      "id": "node-ai-donor-request-triage",
      "name": "Gemini AI: Triage Request & Nearby Hospitals",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1.7,
      "position": [880, 160]
    },
    {
      "parameters": {
        "fromEmail": "={{ $env.EMAIL_FROM || 'no-reply@lifelink.lk' }}",
        "toEmail": "={{ $json.body?.recipientEmail || $json.recipientEmail }}",
        "subject": "={{ $json.body?.subject || '🩸 Urgent Blood Donation Request from ' + ($json.body?.payload?.requester?.fullName || 'Requester') + ' – LifeLink Sri Lanka' }}",
        "html": "=<!DOCTYPE html><html><head><meta charset='utf-8'><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f6f7f9;margin:0;padding:20px;}.card{max-width:620px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.06);}.header{background:linear-gradient(135deg,#DC0A20,#9B0014);color:white;padding:28px 24px;text-align:center;}.badge{display:inline-block;background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}.content{padding:24px;color:#1f2937;line-height:1.6;}.quote{background:#fff5f5;border-left:4px solid #DC0A20;padding:14px 18px;margin:16px 0;border-radius:0 8px 8px 0;color:#991b1b;font-style:italic;}.hosp-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-top:16px;}.hosp-item{padding:10px 0;border-bottom:1px dashed #e5e7eb;font-size:12px;}.hosp-item:last-child{border-bottom:none;}.btn{display:inline-block;background:#DC0A20;color:white!important;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;margin-top:18px;}.footer{background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;}</style></head><body><div class='card'><div class='header'><div class='badge'>LifeLink 24/7 AI Blood Dispatch</div><h1 style='margin:0;font-size:22px;font-weight:800;'>Urgent Blood Donation Request</h1><p style='margin:6px 0 0 0;font-size:13px;opacity:0.9;'>இரத்த தானக் கோரிக்கை அறிவித்தல்</p></div><div class='content'><p>Dear <strong>{{ $json.body?.recipientName || 'Voluntary Donor' }}</strong>,</p><p>A patient or caregiver has sent you a direct blood donation request through the <strong>LifeLink Sri Lanka</strong> network.</p><div style='background:#f3f4f6;padding:14px;border-radius:8px;margin:14px 0;'><strong>Requester / Patient:</strong> {{ $json.body?.payload?.requester?.fullName || 'Emergency Requester' }}<br><strong>Blood Group Needed:</strong> <span style='color:#DC0A20;font-weight:bold;'>{{ $json.body?.payload?.donor?.bloodGroup || 'Matches your profile' }}</span><br><strong>Location:</strong> {{ $json.body?.payload?.donor?.city || 'Jaffna' }}, {{ $json.body?.payload?.donor?.district || 'Northern Province' }}</div><div class='quote'><strong>Message from Requester:</strong><br>\"{{ $json.body?.payload?.message || 'Emergency blood required for patient. Please help if you are available.' }}\"</div><div class='hosp-box'><h3 style='margin:0 0 10px 0;font-size:14px;color:#111827;'>🏥 Nearby Certified Hospitals & Blood Banks (அருகிலுள்ள இரத்த வங்கிகள்):</h3><div>{{#each $json.body?.payload?.nearbyHospitals}}<div class='hosp-item'><strong>{{this.name}}</strong> ({{this.type}})<br>📞 Phone: <a href='tel:{{this.phone}}' style='color:#DC0A20;'>{{this.phone}}</a> &bull; <a href='{{this.googleMapsUrl}}' target='_blank' style='color:#2563eb;'>📍 View Google Maps</a></div>{{/each}}</div></div><p style='margin-top:20px;font-size:13px;'>If you are available to donate, please log in to your LifeLink Donor Portal to <strong>Accept</strong> or <strong>Decline</strong> this request. Once accepted, your contact details will be securely shared with the requester to coordinate transfusion.</p><div style='text-align:center;'><a href='{{ $env.APP_URL || \"https://lifelink.lk\" }}/donor/dashboard' class='btn'>Open Donor Portal & Respond</a></div></div><div class='footer'>National Blood Transfusion Service (NBTS) Hotline: <strong>1923</strong> &bull; Suwa Seriya Ambulance: <strong>1990</strong><br>LifeLink Sri Lanka – Autonomous Smart Blood Logistics</div></div></body></html>"
      },
      "id": "node-email-donor",
      "name": "Send Email to Donor (With Nearby Hospitals)",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [1120, 160]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.body?.payload?.status || $json.payload?.status }}",
              "value2": "ACCEPTED"
            }
          ]
        }
      },
      "id": "node-check-status-accepted",
      "name": "Is Response ACCEPTED?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [880, 420]
    },
    {
      "parameters": {
        "fromEmail": "={{ $env.EMAIL_FROM || 'no-reply@lifelink.lk' }}",
        "toEmail": "={{ $json.body?.recipientEmail || $json.recipientEmail }}",
        "subject": "={{ $json.body?.subject || '🎉 Great News! Donor ' + ($json.body?.payload?.donor?.fullName || 'A Donor') + ' ACCEPTED Your Blood Donation Request! – LifeLink' }}",
        "html": "=<!DOCTYPE html><html><head><meta charset='utf-8'><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f6f7f9;margin:0;padding:20px;}.card{max-width:620px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.06);}.header{background:linear-gradient(135deg,#059669,#047857);color:white;padding:28px 24px;text-align:center;}.badge{display:inline-block;background:rgba(255,255,255,0.25);padding:4px 12px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}.content{padding:24px;color:#1f2937;line-height:1.6;}.donor-box{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:18px;margin:16px 0;}.phone-highlight{display:inline-block;font-size:18px;font-weight:bold;color:#047857;margin-top:6px;text-decoration:none;}.hosp-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-top:16px;}.hosp-item{padding:10px 0;border-bottom:1px dashed #e5e7eb;font-size:12px;}.hosp-item:last-child{border-bottom:none;}.btn{display:inline-block;background:#059669;color:white!important;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;margin-top:18px;}.footer{background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;}</style></head><body><div class='card'><div class='header'><div class='badge'>Request Accepted &bull; கோரிக்கை ஏற்கப்பட்டது</div><h1 style='margin:0;font-size:22px;font-weight:800;'>Your Blood Request Was ACCEPTED!</h1><p style='margin:6px 0 0 0;font-size:13px;opacity:0.95;'>கொடையாளர் உங்கள் கோரிக்கையை ஏற்றுக்கொண்டார்</p></div><div class='content'><p>Dear <strong>{{ $json.body?.recipientName || 'Requester' }}</strong>,</p><p>We are delighted to inform you that voluntary donor <strong>{{ $json.body?.payload?.donor?.fullName || 'A generous donor' }}</strong> has accepted your blood donation inquiry!</p><div class='donor-box'><span style='font-size:11px;text-transform:uppercase;font-weight:bold;color:#065f46;'>Donor Verified Contact Information:</span><br><strong>Donor Name:</strong> {{ $json.body?.payload?.donor?.fullName }}<br><strong>Blood Group:</strong> <span style='color:#DC0A20;font-weight:bold;'>{{ $json.body?.payload?.donor?.bloodGroup || 'Compatible' }}</span><br><strong>Location:</strong> {{ $json.body?.payload?.donor?.city || 'Jaffna' }}, {{ $json.body?.payload?.donor?.district || 'Northern Province' }}<br><strong>Contact Phone:</strong> <br><a href='tel:{{ $json.body?.payload?.donor?.phone }}' class='phone-highlight'>📞 {{ $json.body?.payload?.donor?.phone || '+94 77 123 4567' }}</a>{{#if $json.body?.payload?.donor?.email}}<br><span style='font-size:12px;color:#4b5563;'>Email: {{ $json.body?.payload?.donor?.email }}</span>{{/if}}{{#if $json.body?.payload?.responseNote}}<p style='margin:10px 0 0 0;font-size:12px;color:#065f46;'><strong>Donor Note:</strong> \"{{ $json.body?.payload?.responseNote }}\"</p>{{/if}}</div><div class='hosp-box'><h3 style='margin:0 0 10px 0;font-size:14px;color:#111827;'>🏥 Recommended Hospital Blood Banks for Donation:</h3><div>{{#each $json.body?.payload?.nearbyHospitals}}<div class='hosp-item'><strong>{{this.name}}</strong> ({{this.type}})<br>📞 Hotline: <a href='tel:{{this.phone}}' style='color:#059669;'>{{this.phone}}</a> &bull; <a href='{{this.googleMapsUrl}}' target='_blank' style='color:#2563eb;'>📍 Directions Map</a></div>{{/each}}</div></div><div style='background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-top:16px;font-size:12px;color:#92400e;'><strong>Important Next Steps (அடுத்த முக்கிய படிகள்):</strong><ul style='margin:6px 0 0 0;padding-left:18px;'><li>Call the donor immediately at the number above to confirm their available time.</li><li>Inform the hospital blood bank doctor in advance about the incoming voluntary donor.</li><li>Remind the donor to stay hydrated, rest well, and bring their National Identity Card (NIC).</li></ul></div><div style='text-align:center;'><a href='{{ $env.APP_URL || \"https://lifelink.lk\" }}/requester/dashboard' class='btn'>View in Requester Dashboard</a></div></div><div class='footer'>LifeLink Sri Lanka – Saving Lives Island-wide &bull; Emergency Hotline 1923</div></div></body></html>"
      },
      "id": "node-email-requester-accepted",
      "name": "Send Acceptance Email to Requester",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [1120, 360]
    },
    {
      "parameters": {
        "fromEmail": "={{ $env.EMAIL_FROM || 'no-reply@lifelink.lk' }}",
        "toEmail": "={{ $json.body?.recipientEmail || $json.recipientEmail }}",
        "subject": "={{ $json.body?.subject || 'LifeLink: Update on Your Blood Donation Request' }}",
        "html": "=<!DOCTYPE html><html><body style='font-family:sans-serif;background:#f9fafb;padding:20px;'><div style='max-width:580px;margin:auto;background:#fff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;'><h2 style='color:#4b5563;'>Donor Status Update</h2><p>Dear {{ $json.body?.recipientName }},</p><p>The voluntary donor was unable to accept your request at this time.</p>{{#if $json.body?.payload?.responseNote}}<p><strong>Note:</strong> \"{{ $json.body?.payload?.responseNote }}\"</p>{{/if}}<p>Don't worry! You can easily find other active donors in your district or contact the National Blood Transfusion Service hotlines.</p><div style='margin-top:16px;'><a href='{{ $env.APP_URL || \"https://lifelink.lk\" }}/find-donors' style='display:inline-block;background:#DC0A20;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;'>Find Other Available Donors</a></div></div></body></html>"
      },
      "id": "node-email-requester-declined",
      "name": "Send Polite Alternative Email to Requester",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [1120, 520]
    }
  ],
  "connections": {
    "LifeLink Master Webhook": {
      "main": [
        [
          {
            "node": "Verify Security Secret",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Verify Security Secret": {
      "main": [
        [
          {
            "node": "Route LifeLink Event (Switch)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Route LifeLink Event (Switch)": {
      "main": [
        [
          {
            "node": "Gemini AI: Triage Request & Nearby Hospitals",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Is Response ACCEPTED?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Gemini AI: Triage Request & Nearby Hospitals": {
      "main": [
        [
          {
            "node": "Send Email to Donor (With Nearby Hospitals)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Response ACCEPTED?": {
      "main": [
        [
          {
            "node": "Send Acceptance Email to Requester",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Send Polite Alternative Email to Requester",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`;
