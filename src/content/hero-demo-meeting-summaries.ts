export type DemoSummarySection = {
  heading: string;
  body?: string;
  bullets?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export type DemoSummary = {
  title: string;
  sections: DemoSummarySection[];
};

type DemoSummariesByMeeting = Record<
  "municipality" | "user-research" | "board" | "retro",
  DemoSummary
>;

const EN: DemoSummariesByMeeting = {
  municipality: {
    title: "Meeting summary",
    sections: [
      {
        heading: "Overview",
        body: "This closed procurement session brought together municipal IT, council clerks, and the data protection officer to evaluate MeetingRoom for committee recordings. The discussion centred on whether on-device speech processing could meet procurement and GDPR requirements without sending audio to external vendors. A pivotal moment came when the vendor disconnected Wi‑Fi during a live transcription demo — processing continued uninterrupted, which visibly shifted stakeholder confidence. The group also explored speaker renaming after long debates, Word exports for legal review, and a phased pilot for eight planning-committee clerks.",
      },
      {
        heading: "Key decisions",
        bullets: [
          "Proceed in principle with an eight-clerk pilot for planning committee recordings, contingent on legal sign-off before 15 June.",
          "Vendor must supply written security guarantees, installer SHA-256 hash, and a sample Word export with speaker labels by Friday.",
          "Closed sessions may use the tool only after the DPIA appendix is updated with the vendor's data-flow documentation.",
        ],
      },
      {
        heading: "Discussion points",
        bullets: [
          "On-device processing: procurement confirmed cloud STT is excluded even for summarisation. The only acceptable network use is optional account login for team invites — metadata only.",
          "Speaker diarization: live test in a four-person committee room was judged acceptable; Marieke stopped parallel note-taking once labels stabilised.",
          "Long monologues: Tom raised that Councillor De Vries routinely speaks for twenty minutes off-agenda; vendor confirmed file handling and post-pass diarization remain stable offline.",
          "Speaker renaming: clerks frequently mis-assign speakers to wrong agenda items; one rename must propagate to transcript and all exports.",
          "Competitive context: a previous vendor pilot ended when the UI showed audio upload — the offline demo directly addressed that failure mode.",
        ],
      },
      {
        heading: "Action items",
        table: {
          headers: ["Task", "Owner", "Deadline"],
          rows: [
            [
              "Deliver security one-pager and data-flow diagram for DPIA appendix",
              "Vendor",
              "Friday",
            ],
            [
              "Provide DOCX export sample with annex headings and speaker labels",
              "Vendor",
              "Before leaving site",
            ],
            [
              "Review written guarantees and schedule legal sign-off for pilot",
              "Marieke",
              "Before 15 June",
            ],
            [
              "Document speaker-merge workflow for clerk onboarding",
              "Tom / Vendor",
              "Pilot kickoff",
            ],
          ],
        },
      },
      {
        heading: "Open questions & follow-up",
        bullets: [
          "Whether model update notifications must go through municipal change-management before rollout to all eight clerks.",
          "If Word export styles can match the council's existing annex template (branding, heading levels).",
          "Pilot success criteria: accuracy threshold on bilingual Dutch–English segments not yet defined.",
        ],
      },
      {
        heading: "Risks & concerns",
        bullets: [
          "Legal timeline: pilot cannot start until DPIA appendix is approved — risk of slipping past 15 June if written materials are incomplete.",
          "User adoption: clerks may revert to manual notes if speaker renaming is not intuitive; Tom emphasised documentation quality.",
          "Vendor dependency: Marieke asked who maintains models locally and how security patches are delivered without cloud dependency.",
        ],
      },
    ],
  },
  "user-research": {
    title: "Meeting summary",
    sections: [
      {
        heading: "Overview",
        body: "The research team synthesised three field interviews with ICU administrators and a hospital privacy officer about adopting local AI meeting tools in clinical settings. Participants consistently reported a tension between staff demand for AI-assisted notes and compliance rules that prohibit cloud transcription. Dr. Weiss articulated the core constraint: patient identifiers must never reach third-party GPUs. Elena demonstrated meeting chat answering cross-lingual disagreement queries over a ninety-minute file without upstream data transfer, which resonated strongly with researchers and privacy stakeholders alike.",
      },
      {
        heading: "Key decisions",
        bullets: [
          "Prioritise Word exports with persistent speaker labels — five of six participants identified this as the artefact they send to legal.",
          "Proceed with export-preview prototype including pinned speaker colours; two hospital design partners confirmed for next sprint.",
          "Privacy review will accept a local-only data-flow diagram if it accurately reflects storage and inference boundaries.",
        ],
      },
      {
        heading: "Discussion points",
        bullets: [
          "Clinical blocker: official hospital tooling uploads to US regions; residents already record handoffs on personal phones — a compliance gap the organisation wants to close safely.",
          "Diarization edge case: one interviewee was split into two speakers until minute twelve; merge flow took ~30 seconds and was deemed acceptable after demonstration.",
          "Meeting chat value: Elena used chat to extract budget objections across Dutch and English without manual scrubbing — highlighted as a differentiator for qualitative research.",
          "Implementation safety: James reiterated that legal requires named speakers in exports, not screenshots; local DOCX generation satisfies this.",
          "Organisation-wide adoption: Dr. Weiss willing to champion a three-department-head pilot if audio custody is provably on-device.",
        ],
      },
      {
        heading: "Action items",
        table: {
          headers: ["Task", "Owner", "Deadline"],
          rows: [
            ["Send data-flow diagram to privacy office", "Vendor", "This week"],
            ["Test export preview with pinned speaker colours", "Design / Elena", "Next sprint"],
            ["Schedule pilot scoping with three department heads", "Dr. Weiss", "After privacy review"],
            ["Document speaker-merge steps for research onboarding", "Vendor", "Pilot materials"],
          ],
        },
      },
      {
        heading: "Open questions & follow-up",
        bullets: [
          "Whether ICU handoff recordings fall under the same retention policy as formal committee minutes.",
          "If multilingual diarization accuracy metrics should be part of the pilot acceptance criteria.",
          "How meeting chat citations appear in exports for legal audit trails.",
        ],
      },
      {
        heading: "Risks & concerns",
        bullets: [
          "Shadow IT: personal phone recordings will continue until an approved local alternative exists.",
          "Privacy review duration: without accurate documentation, approval remains a multi-month process.",
          "Mis-identified speakers in exports could attach quotes to wrong clinicians — merge UX must be discoverable.",
        ],
      },
    ],
  },
  board: {
    title: "Meeting summary — confidential",
    sections: [
      {
        heading: "Overview",
        body: "The leadership team conducted a confidential investor dry run ahead of Series A conversations. The session combined deck rehearsal, objection handling, and a timed ninety-second product moment. Recording the run-through surfaced four minutes of unfocused enterprise pricing narrative that the chair asked to cut. Sarah from Horizon Capital pressed on data custody, competitive moat versus Microsoft, and evidence of paying pilots. Marcus (CFO) requested a dedicated GDPR-by-design slide rather than a footnote. The group aligned on leading with the municipality win and demonstrating live transcription instead of architecture diagrams.",
      },
      {
        heading: "Key decisions",
        bullets: [
          "Series A timeline contingent on three paying pilots — municipality and hospital deals count if legal closes this quarter.",
          "Position MeetingRoom as notes infrastructure for regulated teams, not a generic AI notetaker.",
          "Board pack will contain locally exported summaries only — no cloud links (Notion, Google Docs) in investor materials.",
          "Product demo capped at ninety seconds live transcription during investor meetings.",
        ],
      },
      {
        heading: "Discussion points",
        bullets: [
          "Worst-case data flow: clerk records closed session → SQLite on laptop; vendor never receives audio; team features limited to metadata.",
          "Competitive moat: Sarah argued compliance over model quality; response emphasised air-gapped buyers (councils, hospitals, law firms) versus cloud-first incumbents.",
          "Enterprise pricing: recording revealed rambling — chair wants one price narrative tied to seat count and team metadata, not feature sprawl.",
          "Investor proof points: live municipality demo, hospital privacy review in progress, trade-show recovery story as resilience narrative.",
          "Cap table: Marcus to review dilution slide separately before sharing externally.",
        ],
      },
      {
        heading: "Action items",
        table: {
          headers: ["Task", "Owner", "Deadline"],
          rows: [
            ["Add GDPR-by-design slide (standalone, not footnote)", "You", "Before next dry run"],
            ["Tighten enterprise pricing to ≤2 minutes in deck", "You", "Tonight"],
            ["Export board memo action items locally from this recording", "You", "Tonight"],
            ["Review cap table slide", "Marcus", "Before investor send"],
            ["Confirm municipality pilot conversion timeline for Sarah", "Sales", "This week"],
          ],
        },
      },
      {
        heading: "Open questions & follow-up",
        bullets: [
          "Whether Horizon requires a third pilot in a non-public sector vertical before term sheet.",
          "How to demonstrate model updates without implying cloud inference.",
          "If team invite metadata counts as personal data under investor due diligence questionnaires.",
        ],
      },
      {
        heading: "Risks & concerns",
        bullets: [
          "Investor perception: without paying pilots, local-first story may read as niche rather than scalable.",
          "Big-tech response: Sarah's Microsoft question will recur — need crisp answer on business-model misalignment.",
          "Information leakage: board members reminded not to share cloud links containing rehearsal recordings or cap table drafts.",
        ],
      },
    ],
  },
  retro: {
    title: "Meeting summary",
    sections: [
      {
        heading: "Overview",
        body: "The team held a post-mortem on the Hannover trade show demo, where a stalled model download left forty attendees watching a twelve-percent progress bar for six minutes. Sales recovered by opening an existing council recording, running summary generation, and using meeting chat to surface objections — the audience engaged despite the failed live capture. The discussion balanced humour with concrete product fixes: offline demo bundles, a clear “models ready” gate, and surfacing regenerate-summary on dock tabs. Surprisingly, the procurement lead still booked a Tuesday follow-up, citing offline operation as the decisive requirement.",
      },
      {
        heading: "Key decisions",
        bullets: [
          "Ship a pre-loaded demo bundle in the installer for conference mode — no first-run download on venue Wi‑Fi.",
          "Block record until models are fully downloaded; show explicit “AI models ready” state.",
          "Surface “regenerate summary” on bottom dock tabs to match user mental model.",
          "Add installer size to changelog mirror JSON for support transparency.",
        ],
      },
      {
        heading: "Discussion points",
        bullets: [
          "Failure mode: hotel Wi‑Fi + large model download = public progress bar embarrassment; not a transcription bug but UX sequencing.",
          "Recovery narrative: summary + chat on pre-recorded meeting proved value even without live mic — worth replicating intentionally in demos.",
          "Marketing alignment: hero website preview should show real tabs (memo / transcript / summary), not placeholder play buttons.",
          "Post-recording diarization: dev confirmed hour-long stability — audience never saw it because download never finished.",
          "Sales insight: procurement lead quoted “if it works offline, we need it” — reinforces local-first positioning.",
        ],
      },
      {
        heading: "Action items",
        table: {
          headers: ["Task", "Owner", "Deadline"],
          rows: [
            ["Implement offline demo bundle + download-complete gate", "Dev", "Next release"],
            ["Move regenerate summary to dock tabs", "Design", "Next sprint"],
            ["Update hero demo with real workflow tabs", "You / Marketing", "This week"],
            ["Publish installer size in changelog mirror", "Dev", "Next release"],
            ["Draft conference demo checklist for sales", "Sales", "Before next event"],
          ],
        },
      },
      {
        heading: "Open questions & follow-up",
        bullets: [
          "Whether demo bundle should include municipality or hospital sample meeting by default.",
          "If pause/resume on model download is technically feasible for slow networks.",
          "How to rehearse recovery script so improvisation is not left to individual reps.",
        ],
      },
      {
        heading: "Risks & concerns",
        bullets: [
          "Repeat embarrassment at upcoming events if demo bundle slips release train.",
          "Prospects may conflate download stall with product immaturity — recovery story must be rehearsed, not accidental.",
          "Support burden: without installer size in changelog, reps guess storage requirements incorrectly.",
        ],
      },
    ],
  },
};

const NL: DemoSummariesByMeeting = {
  municipality: {
    title: "Samenvatting van de bijeenkomst",
    sections: [
      {
        heading: "Overzicht",
        body: "Deze besloten inkoopsessie bracht gemeentelijke IT, griffiers en de functionaris gegevensbescherming samen om MeetingRoom te beoordelen voor commissie-opnames. Centraal stond de vraag of spraakverwerking op het apparaat kan voldoen aan inkoop- en AVG-eisen zonder audio naar externe leveranciers te sturen. Een keerpunt was de live demo waarbij de leverancier de Wi‑Fi uitschakelde — transcriptie liep door, wat het vertrouwen merkbaar verhoogde. Ook besproken: sprekers hernoemen na lange debatten, Word-export voor juridische review en een gefaseerde pilot voor acht griffiers van de commissie planning.",
      },
      {
        heading: "Belangrijkste besluiten",
        bullets: [
          "In principe doorgaan met een pilot voor acht griffiers, onder voorbehoud van juridisch akkoord vóór 15 juni.",
          "Leverancier levert vóór vrijdag schriftelijke securitygaranties, SHA-256 van de installer en een Word-voorbeeldexport met sprekerlabels.",
          "Besloten sessies mogen pas na bijwerken van de DPIA-bijlage met het dataflow-diagram van de leverancier.",
        ],
      },
      {
        heading: "Discussiepunten",
        bullets: [
          "Verwerking op apparaat: inkoop bevestigde dat cloud-STT uitgesloten is, ook voor samenvatten. Enige netwerkgebruik is optioneel accountlogin voor teamuitnodigingen — alleen metadata.",
          "Sprekerdiarisatie: live test in commissiekamer met vier personen acceptabel; Marieke stopte met parallel notuleren zodra labels stabiel waren.",
          "Lange monologen: Tom noemde raadslid De Vries die twintig minuten off-topic spreekt; leverancier bevestigde stabiele verwerking en diarisatie na opname offline.",
          "Sprekers hernoemen: griffiers koppelen vaak verkeerde sprekers aan verkeerde agendapunten; één hernoemen moet doorwerken in transcript en exports.",
          "Concurrentie: vorige leverancierpiloot stopte bij ‘audio uploaden’ — offline demo adresseerde dat direct.",
        ],
      },
      {
        heading: "Actiepuntlijst",
        table: {
          headers: ["Taak", "Verantwoordelijke", "Deadline"],
          rows: [
            ["Security-one-pager en dataflow-diagram voor DPIA-bijlage", "Leverancier", "Vrijdag"],
            ["DOCX-voorbeeldexport met annexkoppen en sprekerlabels", "Leverancier", "Vóór vertrek"],
            ["Schriftelijke garanties beoordelen en juridisch akkoord plannen", "Marieke", "Vóór 15 juni"],
            ["Workflow sprekers samenvoegen documenteren voor onboarding griffiers", "Tom / Leverancier", "Start pilot"],
          ],
        },
      },
      {
        heading: "Open vragen & vervolg",
        bullets: [
          "Of modelupdates via gemeentelijk change-management moeten vóór uitrol naar alle acht griffiers.",
          "Of Word-export de bestaande annexsjabloon van de raad kan volgen (huisstijl, kopniveaus).",
          "Pilot-succescriteria: drempel voor nauwkeurigheid bij Nederlands–Engels nog niet vastgelegd.",
        ],
      },
      {
        heading: "Risico's & zorgen",
        bullets: [
          "Juridische timeline: pilot kan niet starten zonder DPIA-bijlage — kans op vertraging na 15 juni bij incomplete documentatie.",
          "Adoptie: griffiers vallen terug op handmatige notities als hernoemen niet intuïtief is; Tom benadrukte documentatiekwaliteit.",
          "Leveranciersafhankelijkheid: Marieke vroeg wie modellen lokaal onderhoudt en hoe beveiligingspatches zonder cloud komen.",
        ],
      },
    ],
  },
  "user-research": {
    title: "Samenvatting van de bijeenkomst",
    sections: [
      {
        heading: "Overzicht",
        body: "Het onderzoeksteam synthetiseerde drie veldinterviews met ICU-beheerders en een privacy officer over lokale AI-vergadertools in ziekenhuisomgevingen. Deelnemers meldden steeds dezelfde spanning: behoefte aan AI-notities versus compliance die cloud-transcriptie verbiedt. Dr. Weiss formuleerde de kern: patiëntidentificatie mag nooit op GPU's van derden. Elena toonde dat vergaderchat meningsverschillen over negentig minuten meertalig beantwoordt zonder upstream data — sterk ontvangen door onderzoek en privacy.",
      },
      {
        heading: "Belangrijkste besluiten",
        bullets: [
          "Prioriteit aan Word-export met vaste sprekerlabels — vijf van zes deelnemers mailen dat naar legal.",
          "Prototype exportvoorbeeld met vaste sprekerkleuren; twee ziekenhuispartners bevestigd voor volgende sprint.",
          "Privacyreview accepteert lokaal dataflow-diagram als het opslag- en inferentiegrenzen correct weergeeft.",
        ],
      },
      {
        heading: "Discussiepunten",
        bullets: [
          "Klinische blocker: officieel ziekenhuistool uploadt naar VS; aios nemen overdrachten op met telefoons — compliancegat dat veilig dicht moet.",
          "Diarisatie: interviewee tot minuut twaalf in twee sprekers; merge ~30 seconden, na demo acceptabel.",
          "Vergaderchat: Elena haalde budgetbezwaren uit NL/EN zonder handmatig schrubben — differentiator voor kwalitatief onderzoek.",
          "Implementatieveiligheid: James wil benoemde sprekers in Word, geen screenshots; lokale DOCX voldoet.",
          "Adoptie: Dr. Weiss champion voor pilot met drie afdelingshoofden als audio custody aantoonbaar lokaal blijft.",
        ],
      },
      {
        heading: "Actiepuntlijst",
        table: {
          headers: ["Taak", "Verantwoordelijke", "Deadline"],
          rows: [
            ["Dataflow-diagram naar privacy office", "Leverancier", "Deze week"],
            ["Exportvoorbeeld met vaste sprekerkleuren testen", "Design / Elena", "Volgende sprint"],
            ["Pilot scopen met drie afdelingshoofden", "Dr. Weiss", "Na privacyreview"],
            ["Stappen sprekers samenvoegen documenteren", "Leverancier", "Pilotmateriaal"],
          ],
        },
      },
      {
        heading: "Open vragen & vervolg",
        bullets: [
          "Of ICU-overdracht-opnames onder hetzelfde bewaarbeleid vallen als formele notulen.",
          "Of meertalige diarisatie-nauwkeurigheid onder pilot-acceptatiecriteria moet.",
          "Hoe chatcitaten in exports voor juridische audit verschijnen.",
        ],
      },
      {
        heading: "Risico's & zorgen",
        bullets: [
          "Schaduw-IT: telefoonopnames blijven tot er een goedgekeurd lokaal alternatief is.",
          "Privacyreview duurt maanden zonder accurate documentatie.",
          "Verkeerd toegeschreven sprekers in exports — merge-UX moet vindbaar zijn.",
        ],
      },
    ],
  },
  board: {
    title: "Samenvatting van de bijeenkomst — vertrouwelijk",
    sections: [
      {
        heading: "Overzicht",
        body: "Het leadership team hield een vertrouwelijke investeerders-probedraai voor Series A. Deck-repetitie, bezwaren en een negentig seconden productmoment. Opname legde vier minuten ongerichte enterprise-pricing bloot. Sarah (Horizon) drong aan op databewaring, moat vs Microsoft en betalende pilots. Marcus wil privacy by design als eigen slide. Afstemming: openen met gemeentewinst en live transcriptie i.p.v. architectuurdiagrammen.",
      },
      {
        heading: "Belangrijkste besluiten",
        bullets: [
          "Series A afhankelijk van drie betalende pilots — gemeente en ziekenhuis tellen mee als legal dit kwartaal sluit.",
          "Positioneer MeetingRoom als notitie-infrastructuur voor gereguleerde teams.",
          "Board pack alleen lokaal geëxporteerde samenvattingen — geen cloudlinks.",
          "Productdemo max negentig seconden live transcriptie bij investeerders.",
        ],
      },
      {
        heading: "Discussiepunten",
        bullets: [
          "Worst case: griffier neemt besloten sessie op → SQLite op laptop; leverancier krijgt nooit audio.",
          "Moat: compliance vs modelkwaliteit; air-gapped kopers vs cloud-first incumbents.",
          "Enterprise-pricing: minder verzinnen, koppel aan seats en team-metadata.",
          "Bewijs: live gemeente-demo, ziekenhuisreview loopt, beursherstel als veerkrachtverhaal.",
          "Cap table: Marcus bekijkt dilutie-slide apart.",
        ],
      },
      {
        heading: "Actiepuntlijst",
        table: {
          headers: ["Taak", "Verantwoordelijke", "Deadline"],
          rows: [
            ["Privacy-by-design slide toevoegen", "Jij", "Vóór volgende dry run"],
            ["Enterprise-pricing inkorten tot ≤2 min", "Jij", "Vanavond"],
            ["Actiepunten lokaal exporteren naar board memo", "Jij", "Vanavond"],
            ["Cap table-slide reviewen", "Marcus", "Vóór investeerdersmail"],
            ["Timeline gemeentepilot bevestigen voor Sarah", "Sales", "Deze week"],
          ],
        },
      },
      {
        heading: "Open vragen & vervolg",
        bullets: [
          "Of Horizon een derde pilot buiten publieke sector eist vóór term sheet.",
          "Hoe modelupdates tonen zonder cloud-inferentie te suggereren.",
          "Of team-uitnodigingsmetadata als persoonsgegevens geldt in due diligence.",
        ],
      },
      {
        heading: "Risico's & zorgen",
        bullets: [
          "Zonder betalende pilots lijkt local-first niche i.p.v. schaalbaar.",
          "Microsoft-vraag komt terug — antwoord op businessmodel-mismatch aanscherpen.",
          "Geen cloudlinks met repetitie-opnames of cap table delen.",
        ],
      },
    ],
  },
  retro: {
    title: "Samenvatting van de bijeenkomst",
    sections: [
      {
        heading: "Overzicht",
        body: "Post-mortem over de Hannover-beursdemo: modeldownload bleef steken op twaalf procent voor veertig bezoekers, zes minuten lang. Sales herstelde met bestaande raadsopname, samenvatting en chat — publiek reageerde alsnog. Besproken: offline demo-bundel, duidelijke ‘modellen gereed’-status, regenerate summary op dock-tabs. Inkoopleider boekte toch follow-up: ‘werkt het offline, dan hebben we het nodig.’",
      },
      {
        heading: "Belangrijkste besluiten",
        bullets: [
          "Vooraf geladen demo-bundel in installer voor congresmodus.",
          "Opnemen blokkeren tot modellen volledig gedownload zijn.",
          "‘Samenvatting opnieuw genereren’ op onderste dock-tabs tonen.",
          "Installergrootte in changelog mirror JSON voor support.",
        ],
      },
      {
        heading: "Discussiepunten",
        bullets: [
          "Hotel-wifi + grote download = publieke progress bar; UX-sequencing, geen transcriptiebug.",
          "Herstel met vooraf opgenomen meeting bewees waarde zonder live mic.",
          "Marketing: hero-preview moet echte tabs tonen, geen play-knop-placeholder.",
          "Diarisatie na opname stabiel op uurbestanden — publiek zag het niet door download.",
          "Sales: offline-eis bevestigt local-first-positionering.",
        ],
      },
      {
        heading: "Actiepuntlijst",
        table: {
          headers: ["Taak", "Verantwoordelijke", "Deadline"],
          rows: [
            ["Offline demo-bundel + download-gate implementeren", "Dev", "Volgende release"],
            ["Regenerate summary naar dock-tabs", "Design", "Volgende sprint"],
            ["Hero-demo bijwerken met echte workflow", "Jij / Marketing", "Deze week"],
            ["Installergrootte in changelog mirror", "Dev", "Volgende release"],
            ["Congres-demo checklist voor sales", "Sales", "Vóór volgend event"],
          ],
        },
      },
      {
        heading: "Open vragen & vervolg",
        bullets: [
          "Standaard gemeente- of ziekenhuismeeting in demo-bundel?",
          "Pauze/hervat bij modeldownload technisch haalbaar?",
          "Herstelscript repeteren zodat het niet aan improvisatie hangt.",
        ],
      },
      {
        heading: "Risico's & zorgen",
        bullets: [
          "Herhaling op komende events als demo-bundel release mist.",
          "Prospects kunnen download-stall verwarren met onrijp product.",
          "Support gokt opslagvereisten zonder installergrootte in changelog.",
        ],
      },
    ],
  },
};

const DE: DemoSummariesByMeeting = {
  municipality: {
    title: "Besprechungszusammenfassung",
    sections: [
      {
        heading: "Überblick",
        body: "In dieser geschlossenen Beschaffungssitzung bewerteten kommunale IT, Sachbearbeiter und der Datenschutzbeauftragte MeetingRoom für Ausschussaufnahmen. Kernfrage: Erfüllt Sprachverarbeitung auf dem Gerät Beschaffungs- und DSGVO-Anforderungen ohne Audio an externe Anbieter? Wendepunkt: Wi‑Fi wurde während der Live-Demo getrennt — Transkription lief weiter. Diskutiert wurden Sprecher umbenennen, Word-Export für die Rechtsprüfung und ein Pilot für acht Planungsausschuss-Sachbearbeiter.",
      },
      {
        heading: "Wichtigste Entscheidungen",
        bullets: [
          "Pilot für acht Sachbearbeiter grundsätzlich genehmigt, vorbehaltlich juristischer Freigabe bis 15. Juni.",
          "Anbieter liefert bis Freitag schriftliche Sicherheitsgarantien, Installer-SHA-256 und Word-Beispielexport mit Sprecherlabels.",
          "Geschlossene Sitzungen erst nach DPIA-Anhang mit Data-Flow-Dokumentation des Anbieters.",
        ],
      },
      {
        heading: "Diskussionspunkte",
        bullets: [
          "Verarbeitung auf dem Gerät: Cloud-STT ausgeschlossen, auch für Zusammenfassungen. Netzwerk nur optional für Team-Einladungen — Metadaten.",
          "Diarisierung im vierköpfigen Ausschusssaal akzeptabel; Marieke stellte paralleles Notieren ein.",
          "Lange Monologe von Ratsmitglied De Vries: stabile Offline-Verarbeitung bestätigt.",
          "Sprecher umbenennen: ein Mal reicht für Transkript und alle Exporte.",
          "Früherer Anbieter scheiterte an sichtbarem Audio-Upload — Offline-Demo adressierte das direkt.",
        ],
      },
      {
        heading: "Maßnahmen",
        table: {
          headers: ["Aufgabe", "Verantwortlich", "Frist"],
          rows: [
            ["Security-One-Pager und Data-Flow-Diagramm für DPIA", "Anbieter", "Freitag"],
            ["DOCX-Beispiel mit Anhangsüberschriften und Sprecherlabels", "Anbieter", "Vor Abreise"],
            ["Schriftliche Garantien prüfen und juristische Freigabe planen", "Marieke", "Vor 15. Juni"],
            ["Merge-Workflow für Sachbearbeiter dokumentieren", "Tom / Anbieter", "Pilotstart"],
          ],
        },
      },
      {
        heading: "Offene Fragen & Folge",
        bullets: [
          "Müssen Modell-Updates über kommunales Change-Management laufen?",
          "Kann Word-Export die bestehende Anhangsvorlage des Rates übernehmen?",
          "Pilot-Kriterien für zweisprachige NL/EN-Segmente noch nicht definiert.",
        ],
      },
      {
        heading: "Risiken & Bedenken",
        bullets: [
          "Juristische Timeline: Pilot verzögert sich ohne DPIA-Anhang.",
          "Adoption: Sachbearbeiter fallen auf manuelle Notizen zurück, wenn Umbenennen unklar ist.",
          "Wartung lokaler Modelle und Sicherheitspatches ohne Cloud-Abhängigkeit ungeklärt.",
        ],
      },
    ],
  },
  "user-research": {
    title: "Besprechungszusammenfassung",
    sections: [
      {
        heading: "Überblick",
        body: "Synthese aus drei Interviews mit ICU-Administratoren und Datenschutz: KI-Notizen gewünscht, Cloud-Transkription verboten. Dr. Weiss: Patientennamen gehören nicht auf fremde GPUs. Elena zeigte Meeting-Chat über 90 Minuten mehrsprachig ohne Datenabfluss.",
      },
      {
        heading: "Wichtigste Entscheidungen",
        bullets: [
          "Word-Export mit Sprecherlabels priorisieren — fünf von sechs senden das an Legal.",
          "Export-Vorschau mit festen Sprecherfarben; zwei Krankenhaus-Partner für nächsten Sprint.",
          "Privacy-Review akzeptiert lokales Data-Flow-Diagramm bei korrekter Darstellung.",
        ],
      },
      {
        heading: "Diskussionspunkte",
        bullets: [
          "Offizielles Tool uploadet in die USA; Assistenzärzte nutzen Handys — Compliance-Lücke.",
          "Diarisierung teilte Interviewten bis Minute zwölf; Merge in ~30 Sekunden akzeptabel.",
          "Chat extrahierte Budget-Widerstand NL/EN ohne manuelles Schwärzen.",
          "Legal will benannte Sprecher in Word, keine Screenshots.",
          "Dr. Weiss champion für Pilot mit drei Abteilungsleitern bei nachweislich lokalem Audio.",
        ],
      },
      {
        heading: "Maßnahmen",
        table: {
          headers: ["Aufgabe", "Verantwortlich", "Frist"],
          rows: [
            ["Data-Flow-Diagramm an Privacy Office", "Anbieter", "Diese Woche"],
            ["Export-Vorschau testen", "Design / Elena", "Nächster Sprint"],
            ["Pilot mit drei Abteilungsleitern scopen", "Dr. Weiss", "Nach Privacy-Review"],
          ],
        },
      },
      {
        heading: "Offene Fragen & Folge",
        bullets: [
          "Gleiche Aufbewahrungsregeln für ICU-Übergaben wie für formelle Protokolle?",
          "Mehrsprachige Diarisierungs-Metriken in Pilot-Kriterien?",
        ],
      },
      {
        heading: "Risiken & Bedenken",
        bullets: [
          "Schatten-IT mit Handy-Aufnahmen bis genehmigte Alternative existiert.",
          "Falsche Sprecher in Exporten — Merge-UX muss auffindbar sein.",
        ],
      },
    ],
  },
  board: {
    title: "Besprechungszusammenfassung — vertraulich",
    sections: [
      {
        heading: "Überblick",
        body: "Vertraulicher Investoren-Probedurchlauf vor Series A: Deck, Einwände, 90-Sekunden-Produktmoment. Sarah (Horizon) zu Datensouveränität und Microsoft-Moat. Marcus will Privacy-by-Design als eigene Folie. Fokus: Gemeindesieg und Live-Transkription.",
      },
      {
        heading: "Wichtigste Entscheidungen",
        bullets: [
          "Series A erst nach drei zahlenden Piloten — Gemeinde und Krankenhaus zählen.",
          "Positionierung: Notiz-Infrastruktur für regulierte Teams.",
          "Board-Pack nur lokal exportierte Zusammenfassungen — keine Cloud-Links.",
        ],
      },
      {
        heading: "Diskussionspunkte",
        bullets: [
          "Worst Case: Audio bleibt in SQLite auf Laptop; Anbieter sieht nie Audio.",
          "Moat ist Compliance vs. Cloud-First-Incumbents.",
          "Enterprise-Pricing kürzen; an Seats und Metadaten koppeln.",
        ],
      },
      {
        heading: "Maßnahmen",
        table: {
          headers: ["Aufgabe", "Verantwortlich", "Frist"],
          rows: [
            ["Privacy-by-Design-Folie ergänzen", "Sie", "Vor nächstem Dry Run"],
            ["Board-Memo-Aktionen lokal exportieren", "Sie", "Heute Abend"],
            ["Cap-Table prüfen", "Marcus", "Vor Investorenversand"],
          ],
        },
      },
      {
        heading: "Offene Fragen & Folge",
        bullets: ["Dritter Pilot außerhalb öffentlicher Sector nötig?", "Modell-Updates ohne Cloud-Inferenz erklären?"],
      },
      {
        heading: "Risiken & Bedenken",
        bullets: [
          "Ohne zahlende Piloten wirkt Local-First nischig.",
          "Microsoft-Frage wird wiederkehren.",
        ],
      },
    ],
  },
  retro: {
    title: "Besprechungszusammenfassung",
    sections: [
      {
        heading: "Überblick",
        body: "Post-Mortem Messe Hannover: Modell-Download blieb bei 12 % stehen — 40 Zuschauer, 6 Minuten. Sales rettete mit vorhandener Aufnahme, Zusammenfassung und Chat. Einkaufsleiter buchte trotzdem Follow-up wegen Offline-Betrieb.",
      },
      {
        heading: "Wichtigste Entscheidungen",
        bullets: [
          "Demo-Bundle im Installer für Messen.",
          "Aufnahme blockieren bis Modelle bereit.",
          "„Zusammenfassung neu generieren“ auf Dock-Tabs.",
        ],
      },
      {
        heading: "Diskussionspunkte",
        bullets: [
          "Hotel-WLAN + Download = peinliche Progressbar, kein Transkriptionsbug.",
          "Recovery mit Aufzeichnung bewies Nutzen ohne Live-Mikro.",
          "Hero-Preview soll echte Tabs zeigen.",
        ],
      },
      {
        heading: "Maßnahmen",
        table: {
          headers: ["Aufgabe", "Verantwortlich", "Frist"],
          rows: [
            ["Offline-Demo-Bundle implementieren", "Dev", "Nächstes Release"],
            ["Regenerate auf Dock-Tabs", "Design", "Nächster Sprint"],
            ["Hero-Demo aktualisieren", "Marketing", "Diese Woche"],
          ],
        },
      },
      {
        heading: "Offene Fragen & Folge",
        bullets: ["Pause/Fortsetzen beim Download?", "Recovery-Skript für Sales standardisieren?"],
      },
      {
        heading: "Risiken & Bedenken",
        bullets: [
          "Wiederholung auf kommenden Events ohne Demo-Bundle.",
          "Download-Stall wirkt wie Produktunreife.",
        ],
      },
    ],
  },
};

const FR: DemoSummariesByMeeting = {
  municipality: {
    title: "Résumé de la réunion",
    sections: [
      {
        heading: "Aperçu",
        body: "Séance d'achat à huis clos réunissant IT municipale, greffiers et DPO pour évaluer MeetingRoom sur les enregistrements de comité. Question centrale : le traitement vocal sur appareil satisfait-il achats et RGPD sans envoyer l'audio à des tiers ? Moment clé : coupure Wi‑Fi pendant la démo — transcription continue. Abordé : renommage des locuteurs, export Word, pilote pour huit greffiers.",
      },
      {
        heading: "Décisions clés",
        bullets: [
          "Pilote pour huit greffiers en principe, sous réserve accord juridique avant le 15 juin.",
          "Fournisseur : garanties écrites, hash SHA-256 et export Word exemple d'ici vendredi.",
          "Sessions fermées seulement après mise à jour de l'annexe AIPD.",
        ],
      },
      {
        heading: "Points de discussion",
        bullets: [
          "Traitement sur appareil : STT cloud exclu, y compris pour résumer.",
          "Diarisation acceptable en salle à quatre ; Marieke a arrêté la prise de notes parallèle.",
          "Monologues longs du conseiller De Vries : traitement offline stable confirmé.",
          "Renommage des locuteurs propagé au transcript et aux exports.",
          "Échec précédent d'un fournisseur montrant un upload audio.",
        ],
      },
      {
        heading: "Actions",
        table: {
          headers: ["Tâche", "Responsable", "Échéance"],
          rows: [
            ["Fiche sécurité et diagramme de flux pour AIPD", "Fournisseur", "Vendredi"],
            ["Export DOCX avec titres d'annexe", "Fournisseur", "Avant départ"],
            ["Revue juridique du pilote", "Marieke", "Avant 15 juin"],
          ],
        },
      },
      {
        heading: "Questions ouvertes",
        bullets: [
          "Mises à jour de modèles via change management municipal ?",
          "Export Word aligné sur le modèle d'annexe du conseil ?",
        ],
      },
      {
        heading: "Risques",
        bullets: [
          "Retard juridique si documentation incomplète.",
          "Adoption faible si renommage peu intuitif.",
        ],
      },
    ],
  },
  "user-research": {
    title: "Résumé de la réunion",
    sections: [
      {
        heading: "Aperçu",
        body: "Synthèse de trois entretiens avec administrateurs de soins intensifs et DPO : notes IA oui, cloud non. Dr Weiss : pas de noms de patients sur GPU tiers. Elena a démontré le chat réunion sur 90 minutes multilingues sans envoi de données.",
      },
      {
        heading: "Décisions clés",
        bullets: [
          "Prioriser export Word avec étiquettes locuteurs.",
          "Prototype aperçu export ; deux hôpitaux partenaires confirmés.",
        ],
      },
      {
        heading: "Points de discussion",
        bullets: [
          "Outil officiel envoie aux USA ; résidents enregistrent sur téléphone.",
          "Diarisation : fusion en ~30 s jugée acceptable.",
          "Chat cite désaccords budget NL/EN sans nettoyage manuel.",
        ],
      },
      {
        heading: "Actions",
        table: {
          headers: ["Tâche", "Responsable", "Échéance"],
          rows: [
            ["Diagramme de flux au privacy office", "Fournisseur", "Cette semaine"],
            ["Tester aperçu export", "Design", "Prochain sprint"],
          ],
        },
      },
      {
        heading: "Questions ouvertes",
        bullets: ["Critères pilote pour segments bilingues ?"],
      },
      {
        heading: "Risques",
        bullets: ["Shadow IT avec enregistrements téléphone.", "Locuteurs mal identifiés dans exports."],
      },
    ],
  },
  board: {
    title: "Résumé — confidentiel",
    sections: [
      {
        heading: "Aperçu",
        body: "Répétition investisseurs Series A : deck, objections, démo 90 secondes. Sarah (Horizon) sur garde des données et moat vs Microsoft. Marcus veut privacy by design en slide dédiée.",
      },
      {
        heading: "Décisions clés",
        bullets: [
          "Series A après trois pilotes payants.",
          "Positionner MeetingRoom comme infrastructure de notes régulée.",
          "Pack conseil : exports locaux uniquement.",
        ],
      },
      {
        heading: "Points de discussion",
        bullets: [
          "Audio en SQLite local ; jamais reçu par le fournisseur.",
          "Moat = conformité vs cloud-first.",
        ],
      },
      {
        heading: "Actions",
        table: {
          headers: ["Tâche", "Responsable", "Échéance"],
          rows: [
            ["Slide privacy by design", "Vous", "Avant prochain dry run"],
            ["Exporter actions localement", "Vous", "Ce soir"],
          ],
        },
      },
      {
        heading: "Questions ouvertes",
        bullets: ["Troisième pilote hors secteur public requis ?"],
      },
      {
        heading: "Risques",
        bullets: ["Sans pilotes payants, risque de perception niche.", "Question Microsoft récurrente."],
      },
    ],
  },
  retro: {
    title: "Résumé de la réunion",
    sections: [
      {
        heading: "Aperçu",
        body: "Post-mortem salon Hannover : téléchargement modèle bloqué à 12 % devant 40 personnes. Ventes a repris avec enregistrement existant, résumé et chat. Client a quand même réservé un suivi.",
      },
      {
        heading: "Décisions clés",
        bullets: [
          "Bundle démo préchargé dans l'installateur.",
          "Bloquer enregistrement tant que modèles pas prêts.",
          "Afficher « régénérer résumé » sur onglets dock.",
        ],
      },
      {
        heading: "Points de discussion",
        bullets: [
          "Wi‑Fi hôtel + gros téléchargement = barre de progression embarrassante.",
          "Reprise avec réunion pré-enregistrée a prouvé la valeur.",
        ],
      },
      {
        heading: "Actions",
        table: {
          headers: ["Tâche", "Responsable", "Échéance"],
          rows: [
            ["Bundle démo offline", "Dev", "Prochaine version"],
            ["Mettre regenerate sur dock", "Design", "Prochain sprint"],
          ],
        },
      },
      {
        heading: "Questions ouvertes",
        bullets: ["Pause/reprise du téléchargement ?"],
      },
      {
        heading: "Risques",
        bullets: ["Répétition au prochain salon sans bundle.", "Stall perçu comme immaturité produit."],
      },
    ],
  },
};

const ES: DemoSummariesByMeeting = {
  municipality: {
    title: "Resumen de la reunión",
    sections: [
      {
        heading: "Resumen general",
        body: "Sesión de compras a puerta cerrada con TI municipal, secretarios y DPD para evaluar MeetingRoom en grabaciones de comité. Pregunta central: ¿el procesamiento en dispositivo cumple compras y RGPD sin enviar audio a terceros? Momento clave: desconexión Wi‑Fi en demo en vivo — la transcripción continuó. Temas: renombrar hablantes, export Word, piloto para ocho secretarios.",
      },
      {
        heading: "Decisiones clave",
        bullets: [
          "Piloto para ocho secretarios en principio, sujeto a legal antes del 15 de junio.",
          "Proveedor entrega garantías escritas, SHA-256 e export Word ejemplo antes del viernes.",
          "Sesiones cerradas solo tras actualizar anexo EIPD.",
        ],
      },
      {
        heading: "Puntos de debate",
        bullets: [
          "Procesamiento en dispositivo: STT en nube excluido incluso para resumir.",
          "Diarización aceptable en comité de cuatro; Marieke dejó notas paralelas.",
          "Monólogos largos del concejal De Vries: procesamiento offline estable.",
          "Renombrar hablantes se propaga a transcripción y exports.",
          "Piloto anterior falló al mostrar subida de audio.",
        ],
      },
      {
        heading: "Acciones",
        table: {
          headers: ["Tarea", "Responsable", "Plazo"],
          rows: [
            ["Ficha seguridad y diagrama de flujo para EIPD", "Proveedor", "Viernes"],
            ["DOCX ejemplo con anexos", "Proveedor", "Antes de salir"],
            ["Revisión legal del piloto", "Marieke", "Antes 15 jun"],
          ],
        },
      },
      {
        heading: "Preguntas abiertas",
        bullets: [
          "¿Actualizaciones de modelo vía change management municipal?",
          "¿Export Word alineado con plantilla del ayuntamiento?",
        ],
      },
      {
        heading: "Riesgos",
        bullets: [
          "Retraso legal si documentación incompleta.",
          "Adopción baja si renombrar no es intuitivo.",
        ],
      },
    ],
  },
  "user-research": {
    title: "Resumen de la reunión",
    sections: [
      {
        heading: "Resumen general",
        body: "Síntesis de tres entrevistas con administradores UCI y DPD: quieren notas IA, cloud prohibido. Dr. Weiss: nombres de pacientes no en GPU ajena. Elena demostró chat de reunión 90 min multilingüe sin enviar datos.",
      },
      {
        heading: "Decisiones clave",
        bullets: [
          "Priorizar export Word con etiquetas de hablante.",
          "Prototipo vista previa export; dos hospitales socios confirmados.",
        ],
      },
      {
        heading: "Puntos de debate",
        bullets: [
          "Herramienta oficial sube a EE.UU.; residentes graban con móvil.",
          "Diarización: fusión en ~30 s aceptable.",
          "Chat cita objeciones presupuesto NL/EN sin limpieza manual.",
        ],
      },
      {
        heading: "Acciones",
        table: {
          headers: ["Tarea", "Responsable", "Plazo"],
          rows: [
            ["Diagrama de flujo a privacidad", "Proveedor", "Esta semana"],
            ["Probar vista previa export", "Design", "Próximo sprint"],
          ],
        },
      },
      {
        heading: "Preguntas abiertas",
        bullets: ["¿Criterios piloto para segmentos bilingües?"],
      },
      {
        heading: "Riesgos",
        bullets: ["Shadow IT con móviles.", "Hablantes mal asignados en exports."],
      },
    ],
  },
  board: {
    title: "Resumen — confidencial",
    sections: [
      {
        heading: "Resumen general",
        body: "Ensayo con inversores Series A: deck, objeciones, demo 90 segundos. Sarah (Horizon) sobre custodia de datos y moat vs Microsoft. Marcus quiere privacy by design en diapositiva propia.",
      },
      {
        heading: "Decisiones clave",
        bullets: [
          "Series A tras tres pilotos de pago.",
          "Posicionar MeetingRoom como infraestructura de notas regulada.",
          "Pack consejo: solo exports locales.",
        ],
      },
      {
        heading: "Puntos de debate",
        bullets: [
          "Audio en SQLite local; proveedor nunca lo recibe.",
          "Moat = cumplimiento vs cloud-first.",
        ],
      },
      {
        heading: "Acciones",
        table: {
          headers: ["Tarea", "Responsable", "Plazo"],
          rows: [
            ["Diapositiva privacy by design", "Tú", "Antes próximo ensayo"],
            ["Exportar acciones localmente", "Tú", "Esta noche"],
          ],
        },
      },
      {
        heading: "Preguntas abiertas",
        bullets: ["¿Tercer piloto fuera sector público?"],
      },
      {
        heading: "Riesgos",
        bullets: ["Sin pilotos pagados, percepción de nicho.", "Pregunta Microsoft recurrente."],
      },
    ],
  },
  retro: {
    title: "Resumen de la reunión",
    sections: [
      {
        heading: "Resumen general",
        body: "Post-mortem feria Hannover: descarga del modelo atascada al 12 % ante 40 personas. Ventas recuperó con grabación existente, resumen y chat. Cliente reservó seguimiento igualmente.",
      },
      {
        heading: "Decisiones clave",
        bullets: [
          "Bundle demo precargado en instalador.",
          "Bloquear grabación hasta modelos listos.",
          "Mostrar «regenerar resumen» en pestañas dock.",
        ],
      },
      {
        heading: "Puntos de debate",
        bullets: [
          "Wi‑Fi hotel + descarga grande = barra de progreso vergonzosa.",
          "Recuperación con reunión pregrabada demostró valor.",
        ],
      },
      {
        heading: "Acciones",
        table: {
          headers: ["Tarea", "Responsable", "Plazo"],
          rows: [
            ["Bundle demo offline", "Dev", "Próxima versión"],
            ["Regenerate en dock", "Design", "Próximo sprint"],
          ],
        },
      },
      {
        heading: "Preguntas abiertas",
        bullets: ["¿Pausa/reanudar descarga?"],
      },
      {
        heading: "Riesgos",
        bullets: ["Repetición en próxima feria sin bundle.", "Stall percibido como inmadurez."],
      },
    ],
  },
};

export const HERO_DEMO_SUMMARIES = {
  en: EN,
  nl: NL,
  de: DE,
  fr: FR,
  es: ES,
} as const satisfies Record<string, DemoSummariesByMeeting>;
