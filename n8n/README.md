# LifeLink n8n Automation Workflows

This directory contains importable JSON workflow definitions for n8n to handle transactional emails, reminders, and alerts for **LifeLink – Smart Blood Donation Management System (Sri Lanka)**.

## Architecture

```
React Frontend
   │
   ▼
Express Backend (/api/*)
   │
   ▼
MySQL / In-Memory Store
   │
   ▼
Notification Outbox (Idempotency Key & Retry Count)
   │
   ▼
Backend Automation Worker (Triggered via Admin Console or Cron)
   │
   ▼ (POST with X-LifeLink-Secret & X-Idempotency-Key)
n8n Webhook Endpoint
   │
   ▼
SMTP Email Provider (e.g. Mailtrap, SendGrid, Amazon SES)
   │
   ▼
Delivery Status Recorded in AutomationDeliveryLog
```

## Security Requirements

1. **Server-Side Only**: The frontend never communicates directly with n8n. All webhook calls originate from the Express backend.
2. **Secret Header Validation**: Every incoming webhook verifies the `X-LifeLink-Secret` header against the server environment variable `N8N_WEBHOOK_SECRET`.
3. **Idempotency**: Every outbox event includes an `idempotencyKey` preventing duplicate email deliveries.

## Environment Variables

Configure these in `backend/.env` or in the LifeLink Admin Console -> System Settings:

```env
N8N_WEBHOOK_URL="http://localhost:5678/webhook/lifelink-events"
N8N_WEBHOOK_SECRET="lifelink-secret-key-jaffna"
AUTOMATION_ENABLED="true"
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="2525"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
EMAIL_FROM="no-reply@lifelink.lk"
```

## ⭐ Master Workflow: All-in-One Unified Donor Lifecycle AI Agent (ஒரே ஒரு பணிப்பாய்வு)

### `lifelink_unified_donor_lifecycle_ai_agent.json`
A single, complete, unified n8n AI Agent workflow that manages both sides of the blood donation inquiry in ONE workflow:
1. **Branch A (Requester &rarr; Donor)**: When a requester sends a contact request to a donor:
   - The workflow receives the `DONOR_CONTACT_REQUEST` webhook event.
   - The AI Agent extracts the donor's district (e.g. Jaffna, Colombo, Kandy) and attaches a curated list of **Nearby Certified Hospitals & Blood Banks** (Teaching Hospital Jaffna, Tellippalai, Point Pedro, Chavakachcheri, Northern Central Hospital, etc.) with phone numbers and 1-click **Google Maps GPS Navigation links**.
   - Sends a rich, urgent bilingual (Tamil + English) email to the voluntary donor inviting them to review and respond in their LifeLink Donor Portal.
2. **Branch B (Donor &rarr; Requester Acceptance)**: When the donor accepts the request in their portal:
   - The same master workflow receives the `DONOR_RESPONSE` event (`status: ACCEPTED`).
   - The AI Agent automatically verifies the acceptance and unlocks the **Donor's verified Sri Lankan phone number** (`+94 7X XXX XXXX`).
   - Dispatches a celebratory confirmation email to the Requester: *"உங்களுடைய இரத்தக் கோரிக்கை ஏற்றுக்கொள்ளப்பட்டது! / Great News! Your Blood Donation Request Has Been Accepted!"*
   - Includes recommended hospital blood bank facilities, direct click-to-call donor link, and essential pre-donation clinical guidelines.
3. **Branch B (Fallback / Declined)**:
   - If the donor is temporarily unavailable, sends a polite update to the requester with emergency blood bank hotlines (1923 NBTS) and an instant link to find alternative active donors in that district.

---

## Additional Workflows

### `lifelink_247_ai_agent_emergency_triage.json`
A 24/7 autonomous emergency blood triage agent powered by **Google Gemini 2.0 Flash / LangChain Tools Agent**:
- **24/7 Multi-Trigger**: Runs autonomously via Webhook (`/webhook/lifelink-ai-agent`), 15-minute Cron scheduler, and Live Interactive Chat.
- **Medical Blood Matching Tool**: Evaluates ABO and Rh compatibility in real-time (e.g. O- universal donor, Rh- safety protocols).
- **Live Donor Search Tool**: Queries the LifeLink database via HTTP tool calling to locate active, verified voluntary donors in Jaffna and island-wide districts.
- **Sri Lanka Healthcare Directory Tool**: Locates Government Teaching Hospitals (Teaching Hospital Jaffna, Tellippalai, Karapitiya, Colombo National) AND Private Hospitals (Northern Central Hospital Jaffna, Yarl Hospital, Moolai Hospital, Lanka Hospitals, Asiri, Nawaloka, Durdans, Kings Hospital).
- **Autonomous Dispatch Tool**: Sends trilingual alerts (Tamil, Sinhala, English) with 1-click GPS navigation directions to donors and requesters.


---

## Top 5 Recommended LifeLink AI Agent Automations (பரிந்துரைக்கப்பட்ட AI முகவர் ஆட்டோமேஷன்கள்)

1. **24/7 Autonomous Emergency Blood Triage Agent (அவசர இரத்தத் தேவை AI முகவர்)**:
   - Evaluates emergency blood requests instantly 24/7 with zero human latency.
   - Cross-checks hospital validation, blood group compatibility, and donor availability.
   - Automatically alerts the closest verified donors with Google Maps navigation links.

2. **Smart Donor Retention & 90-Day Health Follow-up Agent (கொடையாளர் நல்வாழ்வு & நினைவூட்டல் AI முகவர்)**:
   - Tracks 90-day intervals (Sri Lanka NBTS protocol) since last donation.
   - Sends personalized, friendly WhatsApp/Email check-ins and iron-rich nutrition tips.
   - Pre-books upcoming donation appointments.

3. **Multi-Channel WhatsApp & Telegram Conversational AI (வாட்ஸ்அப் / டெலிகிராம் AI உதவியாளர்)**:
   - Allows users to text in natural Tamil, Tanglish, Sinhala, or English (e.g. *"யாழ்ப்பாணத்தில் O+ இரத்தம் தேவை"* or *"When can I donate next?"*).
   - Agent invokes LifeLink API tools and returns verified donor contacts and nearest blood bank numbers within seconds.

4. **Anti-Spam & Fraud Verification Agent (போலி கோரிக்கைகளை தடுக்கும் AI முகவர்)**:
   - Validates patient urgency score, verifies doctor/hospital details against certified Sri Lanka medical registry, and filters duplicates before alerting donors.

5. **Blood Inventory Shortage Prediction & Campaign Scheduler (இரத்தப் பற்றாக்குறை முன்னறிவிப்பு முகவர்)**:
   - Monitors regional blood bank reserves (Teaching Hospital Jaffna, NBTS, etc.).
   - Triggers automated blood drive campaigns on social media and sends invitations to dormant donors when critical reserves drop below safe thresholds.

---

## Included Workflows

1. `lifelink_247_ai_agent_emergency_triage.json` – **⭐ NEW**: 24/7 Autonomous LangChain AI Agent for emergency blood triage & donor dispatch.
2. `workflow_1_welcome_email.json` – Sends welcome email upon new user registration.
3. `workflow_2_new_blood_request.json` – Acknowledges blood request submission and alerts the medical admin.
4. `workflow_3_donor_contact_request.json` – Alerts a consenting verified donor of an inquiry.
5. `workflow_4_donor_response.json` – Notifies the requester when a donor accepts/declines.
6. `workflow_5_appointment_updates.json` – Notifies participants of scheduled, rescheduled, or cancelled donation appointments.
7. `workflow_6_campaign_registration.json` – Sends ticket/confirmation for community blood drives.
8. `workflow_7_appointment_reminder.json` – 24-hour appointment reminder scheduler.
9. `workflow_8_automation_failure.json` – Incident notification when webhooks exhaust retries.

## How to Import into n8n

1. Start n8n locally: `npx n8n` (runs on `http://localhost:5678`).
2. Go to **Workflows** -> **Import from File**.
3. Select `lifelink_247_ai_agent_emergency_triage.json`.
4. Add your **Google Gemini API Key** (or OpenAI API Key) in the Chat Model node credentials.
5. Activate the workflow!

*Note: In environments where an active n8n instance is not running, all events are safely preserved in the database Notification Outbox table.*
