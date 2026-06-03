export type DemoChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type DemoChatPrompt = {
  id: "summarize" | "actions" | "questions";
  user: string;
  assistant: string;
};

export type DemoChatThread = {
  messages: DemoChatMessage[];
  prompts: DemoChatPrompt[];
  defaultReply: string;
};

type MeetingId = "municipality" | "user-research" | "board" | "retro";

type ThreadsByLocale = Record<MeetingId, DemoChatThread>;

const EN: ThreadsByLocale = {
  municipality: {
    messages: [
      {
        role: "user",
        content: "What did Marieke and Tom ask us to send before Friday?",
      },
      {
        role: "assistant",
        content:
          "Marieke needs written security guarantees for the DPIA — where models live, who updates them, and confirmation that no audio leaves the laptop during summarisation.\n\nTom asked for the installer SHA-256 hash, a sample Word export with speaker labels on the annex debate, and documentation on merging speakers after the meeting.",
      },
    ],
    prompts: [
      {
        id: "summarize",
        user: "Summarize this meeting in three bullets for my CRM.",
        assistant:
          "• Closed procurement review: on-device transcription survived a live Wi‑Fi disconnect — strong signal for clerks.\n• In principle yes to an eight-clerk planning committee pilot, pending legal sign-off before 15 June.\n• Deliver by Friday: security one-pager, installer hash, Word export with speaker labels, speaker-merge docs.",
      },
      {
        id: "actions",
        user: "List action items with owners.",
        assistant:
          "Vendor — Security one-pager + SHA-256 + sample DOCX (Friday)\nVendor — Speaker-merge documentation (Friday)\nMarieke — DPIA appendix update after receiving data-flow docs\nTom — Schedule pilot kickoff with planning clerks after legal OK",
      },
      {
        id: "questions",
        user: "What should I clarify on the next call?",
        assistant:
          "Confirm whether closed sessions need a separate DPIA clause. Ask how many concurrent committee rooms run during peak season. Clarify if clerks need SSO or if local-only accounts are acceptable for the pilot.",
      },
    ],
    defaultReply:
      "I can only answer from this meeting's memo and transcript in the preview. Install MeetingRoom to chat across your full library with local models.",
  },
  "user-research": {
    messages: [
      {
        role: "user",
        content: "What did participants say about exports to legal?",
      },
      {
        role: "assistant",
        content:
          "Five of six administrators said speaker-labelled Word exports matter more than UI polish — that's what they email to legal. Dr. Weiss rejected any workflow where patient names could reach an external GPU; Elena validated cross-interview questions without cloud upload.",
      },
    ],
    prompts: [
      {
        id: "summarize",
        user: "Summarize the research takeaway.",
        assistant:
          "Hospital admins want AI-assisted notes but compliance blocks cloud STT. On-device processing plus speaker labels in DOCX is the recurring win condition. Meeting chat that answers synthesis questions locally was a differentiator in the session.",
      },
      {
        id: "actions",
        user: "Product actions from this synthesis.",
        assistant:
          "Prioritise speaker labels in Word export templates\nAdd a one-click “export for legal” preset\nDocument zero-upload architecture for privacy officers\nRun ward pilot with Dr. Weiss's unit after written guarantees",
      },
      {
        id: "questions",
        user: "Contradictions across the three interviews?",
        assistant:
          "No contradiction on cloud — everyone refused upload-based tools. Tension between residents using phone voice memos (convenient) vs official charting (compliant). Speed vs label accuracy split junior vs senior admins.",
      },
    ],
    defaultReply:
      "Try a quick prompt above — this preview uses sample hospital interview notes only.",
  },
  board: {
    messages: [
      {
        role: "user",
        content: "What did the board decide about the Series A demo?",
      },
      {
        role: "assistant",
        content:
          "Lead with the municipality win, run a live demo only (no cloud backup narrative), and add a full GDPR-by-design slide — Marcus wants it off the footnotes. Cut the four-minute enterprise pricing ramble; tie pricing to seats and team metadata.",
      },
    ],
    prompts: [
      {
        id: "summarize",
        user: "Summarize investor objections and our answers.",
        assistant:
          "Horizon asked what stops Microsoft — answer: regulated buyers needing proof audio never left the device. Data custody and paying pilots were pressed; chair wants evidence over architecture diagrams.",
      },
      {
        id: "actions",
        user: "Deck changes before the roadshow.",
        assistant:
          "Add GDPR-by-design slide (Marcus)\nReplace pricing sprawl with seat-based narrative (Chair)\nOpen with municipality case study (Sarah)\nTime product moment to 90 seconds (All)",
      },
      {
        id: "questions",
        user: "Risks they might raise in diligence?",
        assistant:
          "Competitive bundling from platform vendors, proof of paid pilots vs design partners, and whether on-device STT quality holds for 90+ minute board meetings in noisy rooms.",
      },
    ],
    defaultReply:
      "This preview thread is based on the confidential dry-run memo — install the app for editable chat history.",
  },
  retro: {
    messages: [
      {
        role: "user",
        content: "What slowed us down most this sprint?",
      },
      {
        role: "assistant",
        content:
          "Model download failures on hospital Wi‑Fi blocked two pilots. Diarization edge cases on overlapping speakers ate review time. Docs lagged the maps feature — CS had to explain folder assignment manually in three calls.",
      },
    ],
    prompts: [
      {
        id: "summarize",
        user: "Summarize retro themes.",
        assistant:
          "Reliability before new features; offline-first story resonates when shown, not told; export quality beats UI tweaks for regulated buyers; need clearer installer troubleshooting for locked-down networks.",
      },
      {
        id: "actions",
        user: "Action items the team committed to.",
        assistant:
          "Engineering — Resume interrupted model downloads automatically\nDesign — Maps onboarding tooltip + docs screenshot\nCS — Template reply for DPIA appendix requests\nSales — Municipality case one-pager by next retro",
      },
      {
        id: "questions",
        user: "What should we stop doing?",
        assistant:
          "Stop leading enterprise demos with pricing depth before proving offline transcription. Stop promising cloud-adjacent features to hospital prospects. Stop shipping UI-only releases without export release notes.",
      },
    ],
    defaultReply:
      "Ask about action items or sprint themes — full chat needs the desktop app.",
  },
};

const NL: ThreadsByLocale = {
  municipality: {
    messages: [
      {
        role: "user",
        content: "Wat moeten we vóór vrijdag naar Marieke en Tom sturen?",
      },
      {
        role: "assistant",
        content:
          "Marieke wil schriftelijke security-garanties voor de DPIA — waar modellen staan, wie ze bijwerkt, en bevestiging dat geen audio de laptop verlaat tijdens samenvatten.\n\nTom vroeg om de SHA-256 van de installer, een Word-export met sprekerslabels op het annex-debat, en documentatie over sprekers samenvoegen na de vergadering.",
      },
    ],
    prompts: [
      {
        id: "summarize",
        user: "Vat deze vergadering samen in drie bullets voor mijn CRM.",
        assistant:
          "• Gesloten aanbestedingsreview: on-device transcriptie overleefde live Wi‑Fi uit — sterk signaal voor griffiers.\n• Principe ja voor pilot met acht griffiers planning, na juridische OK vóór 15 juni.\n• Lever vóór vrijdag: security-one-pager, installer-hash, Word-export met labels, docs speaker-merge.",
      },
      {
        id: "actions",
        user: "Lijst actiepunten met eigenaren.",
        assistant:
          "Leverancier — Security-one-pager + SHA-256 + voorbeeld-DOCX (vrijdag)\nLeverancier — Documentatie speaker-merge (vrijdag)\nMarieke — DPIA-bijlage na dataflow-docs\nTom — Pilot kickoff plannen na juridische OK",
      },
      {
        id: "questions",
        user: "Wat moet ik op het volgende gesprek verduidelijken?",
        assistant:
          "Of gesloten sessies een aparte DPIA-clausule nodig hebben. Hoeveel commissiezalen tegelijk draaien in het hoogseizoen. Of griffiers SSO nodig hebben of lokale accounts genoeg zijn voor de pilot.",
      },
    ],
    defaultReply:
      "In deze preview antwoord ik alleen op basis van memo en transcript van deze vergadering. Installeer MeetingRoom om lokaal over je volledige bibliotheek te chatten.",
  },
  "user-research": {
    messages: [
      {
        role: "user",
        content: "Wat zeiden deelnemers over exports naar legal?",
      },
      {
        role: "assistant",
        content:
          "Vijf van de zes administrators zeiden dat Word-exports met sprekerslabels belangrijker zijn dan UI — dat mailen ze naar legal. Dr. Weiss wees elke workflow af waar patiëntnamen naar een externe GPU kunnen; Elena bevestigde synthesevragen zonder cloud-upload.",
      },
    ],
    prompts: [
      {
        id: "summarize",
        user: "Vat de onderzoeksconclusie samen.",
        assistant:
          "Ziekenhuisadmins willen AI-notities maar compliance blokkeert cloud-STT. On-device verwerking plus labels in DOCX is het terugkerende winstcriterium. Vergaderchat die lokaal synthesevragen beantwoordt viel op in de sessie.",
      },
      {
        id: "actions",
        user: "Productacties uit deze synthese.",
        assistant:
          "Prioriteit: sprekerslabels in Word-templates\nPreset “export voor legal”\nDocumenteer zero-upload architectuur voor privacy officers\nStart ward-pilot na schriftelijke garanties",
      },
      {
        id: "questions",
        user: "Tegenstrijdigheden over de drie interviews?",
        assistant:
          "Geen tegenstrijd over cloud — iedereen wees upload-tools af. Spanning: telefoon-memo's (handig) vs officiële verslaglegging (compliant). Snelheid vs labelnauwkeurigheid verschilt junior/senior.",
      },
    ],
    defaultReply:
      "Probeer een suggestie hierboven — deze preview gebruikt voorbeeldnotities uit ziekenhuisinterviews.",
  },
  board: {
    messages: [
      {
        role: "user",
        content: "Wat besloot de board over de Series A-demo?",
      },
      {
        role: "assistant",
        content:
          "Open met de gemeente-win, alleen live demo (geen cloud-back-up verhaal), en een volledige GDPR-by-design slide — Marcus wil die niet in voetnoten. Snijd de vier minuten enterprise-pricing weg; koppel prijs aan seats en teammetadata.",
      },
    ],
    prompts: [
      {
        id: "summarize",
        user: "Vat investeerdersbezwaren en onze antwoorden samen.",
        assistant:
          "Horizon vroeg wat Microsoft tegenhoudt — antwoord: gereguleerde kopers die bewijs willen dat audio op het device bleef. Data-custody en betalende pilots werden scherp; chair wil bewijs boven architectuurdiagrammen.",
      },
      {
        id: "actions",
        user: "Deck-wijzigingen vóór de roadshow.",
        assistant:
          "GDPR-by-design slide toevoegen (Marcus)\nPricing versimpelen naar seats (Chair)\nOpenen met gemeente-case (Sarah)\nProductmoment op 90 seconden (Allen)",
      },
      {
        id: "questions",
        user: "Risico's bij due diligence?",
        assistant:
          "Platformbundeling door grote vendors, bewijs van betalende pilots vs design partners, en of on-device STT 90+ minuten in rumoerige zalen houdt.",
      },
    ],
    defaultReply:
      "Deze thread volgt de vertrouwelijke dry-run memo — installeer de app voor bewerkbare chatgeschiedenis.",
  },
  retro: {
    messages: [
      {
        role: "user",
        content: "Wat vertraagde ons deze sprint het meest?",
      },
      {
        role: "assistant",
        content:
          "Modeldownloads faalden op ziekenhuis-Wi‑Fi en blokkeerden twee pilots. Diarisatie bij overlappende sprekers kostte reviewtijd. Docs liepen achter op mappen — CS moest map-toewijzing drie keer mondeling uitleggen.",
      },
    ],
    prompts: [
      {
        id: "summarize",
        user: "Vat retro-thema's samen.",
        assistant:
          "Betrouwbaarheid vóór nieuwe features; offline-first overtuigt als je het toont; exportkwaliteit wint van UI voor gereguleerde kopers; betere installatie-troubleshooting voor locked-down netwerken.",
      },
      {
        id: "actions",
        user: "Actiepunten van het team.",
        assistant:
          "Engineering — Hervat onderbroken modeldownloads automatisch\nDesign — Maps-onboarding + doc-screenshot\nCS — Template voor DPIA-bijlagen\nSales — Gemeente-one-pager vóór volgende retro",
      },
      {
        id: "questions",
        user: "Wat moeten we stoppen?",
        assistant:
          "Stop met pricing-diepte vóór offline-transcriptie in enterprise-demo's. Beloof geen cloud-features aan ziekenhuizen. Geen UI-only releases zonder export release notes.",
      },
    ],
    defaultReply:
      "Vraag naar actiepunten of sprintthema's — volledige chat vereist de desktop-app.",
  },
};

export const HERO_DEMO_CHAT_THREADS: Record<string, ThreadsByLocale> = {
  en: EN,
  nl: NL,
};

export function getHeroDemoChatThread(
  meetingId: string,
  locale: string,
): DemoChatThread {
  const threads =
    HERO_DEMO_CHAT_THREADS[locale] ?? HERO_DEMO_CHAT_THREADS.en;
  const id = meetingId as MeetingId;
  return threads[id] ?? threads.municipality;
}
