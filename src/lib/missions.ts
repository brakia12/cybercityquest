export type CertKey = "Security+" | "CySA+" | "PenTest+" | "CEH";

export type TabKey = "alert" | "user" | "logs" | "device";

export type BuildingKey = "soc" | "cafe" | "hub" | "hq";

export interface Mission {
  id: string;
  title: string;
  brief: string;
  desc: string;
  building: BuildingKey;
  skill: string;
  boss?: boolean;
  tabs: Record<TabKey, string[]>;
  decision: string[];
  correct: number;
  feedback: string[];
  lesson: string;
}

export const buildings: {
  key: BuildingKey;
  label: string;
  sub: string;
  pos: string;
}[] = [
  { key: "soc", label: "🔎 SOC Tower", sub: "Detection & triage", pos: "left-[31%] top-[115px] w-[225px] h-[315px]" },
  { key: "cafe", label: "☕ Cyber Café", sub: "People & social engineering", pos: "left-[7%] top-[190px] w-[215px] h-[240px]" },
  { key: "hub", label: "🌐 Network Hub", sub: "Systems & exposure", pos: "right-[28%] top-[175px] w-[200px] h-[255px]" },
  { key: "hq", label: "🏢 Security HQ", sub: "Boss operations", pos: "right-[6%] top-[125px] w-[220px] h-[305px]" },
];

export const buildingFor = (key: BuildingKey) =>
  buildings.find((b) => b.key === key) ?? buildings[0]!;

export const questlines: {
  cert: CertKey;
  quest: string;
  icon: string;
  name: string;
  blurb: string;
}[] = [
  {
    cert: "Security+",
    quest: "FOUNDATION QUEST",
    icon: "🛡️",
    name: "CompTIA Security+",
    blurb:
      "Broad security foundations through threats, identity, architecture, operations, and risk.",
  },
  {
    cert: "CySA+",
    quest: "DEFENDER QUEST",
    icon: "🔎",
    name: "CompTIA CySA+",
    blurb:
      "Defensive investigation, alerts, logs, threat analysis, vulnerability prioritization, and incident response.",
  },
  {
    cert: "PenTest+",
    quest: "RED TEAM QUEST",
    icon: "🧪",
    name: "CompTIA PenTest+",
    blurb:
      "Authorized assessment thinking: scope, discovery, vulnerability analysis, validation, and reporting.",
  },
  {
    cert: "CEH",
    quest: "ETHICAL HACKER QUEST",
    icon: "◉",
    name: "CEH",
    blurb:
      "Ethical hacking concepts through controlled reconnaissance, analysis, and defensive countermeasures.",
  },
];

export const questFor = (cert: CertKey) =>
  questlines.find((q) => q.cert === cert) ?? questlines[1]!;

export const missionsByCert: Record<CertKey, Mission[]> = {
  "Security+": [
    {
      id: "sec-1",
      title: "The Poisoned Inbox",
      brief: "A staff member received a suspicious payroll email.",
      desc: "Inspect the message, identify the strongest signs of phishing, and choose the safest response.",
      building: "soc",
      skill: "Social engineering recognition",
      tabs: {
        alert: [
          "Email received from payroll@northstàr-pay.com",
          "The display name says “Northstar Payroll.”",
          "Subject: URGENT payroll discrepancy",
        ],
        user: [
          "Employee says they were not expecting a payroll correction",
          "The message pressures them to act before 5 PM",
        ],
        logs: [
          "Link destination: northstar-payroll-secure.example",
          "Attachment: Payroll_Adjustment.xlsm",
        ],
        device: ["No unusual device activity yet", "Email client marked the sender as external"],
      },
      decision: [
        "Report/quarantine the message and verify payroll through a trusted channel",
        "Open the attachment to see if it looks legitimate",
        "Reply asking whether the sender is real",
      ],
      correct: 0,
      feedback: [
        "Correct. Quarantining and verifying out-of-band stops the attack without interacting with the message.",
        "Risky. Opening a macro-enabled attachment from an unverified sender can execute the payload you were investigating.",
        "Risky. Replying confirms a live mailbox and trusts the attacker's own channel to prove the attacker is real.",
      ],
      lesson:
        "Strong phishing analysis combines sender identity, unexpected context, links/attachments, and pressure tactics. Verify through a trusted channel rather than interacting with a suspicious message.",
    },
    {
      id: "sec-2",
      title: "The Borrowed Badge",
      brief: "A contractor is asking the front desk for after-hours building access.",
      desc: "Weigh the identity, authorization, and urgency signals before letting anyone through the door.",
      building: "cafe",
      skill: "Physical security & authorization",
      tabs: {
        alert: [
          "Visitor claims to be an HVAC contractor with an emergency repair",
          "No work order exists in the facilities system",
        ],
        user: [
          "Visitor wears a lanyard from a different company",
          "They say “your manager already approved it, just badge me in”",
        ],
        logs: [
          "Front desk log shows no scheduled vendor for tonight",
          "Facilities lead is reachable by phone",
        ],
        device: [
          "Badge reader shows no provisioned credential for the visitor",
          "Security camera coverage is active at the side entrance",
        ],
      },
      decision: [
        "Refuse tailgating, keep the visitor at reception, and confirm with the facilities lead",
        "Badge them in yourself since a real emergency would be costly to delay",
        "Let them borrow a spare visitor badge and escort themselves",
      ],
      correct: 0,
      feedback: [
        "Correct. Verification through an independent, known contact defeats pretexting without being rude or reckless.",
        "Wrong call. Badging in an unverified person is tailgating — it defeats every access control behind that door.",
        "Wrong call. Unescorted access on a shared credential destroys accountability and audit trails.",
      ],
      lesson:
        "Physical access is a security control. Urgency, authority claims, and borrowed credentials are classic pretexting tools; verify with a known contact before granting access.",
    },
    {
      id: "sec-3",
      title: "The Weak Link",
      brief: "A quarterly review flags risky account and patch settings.",
      desc: "Pick the change that removes the most real-world risk first.",
      building: "hub",
      skill: "Risk prioritization & hardening",
      tabs: {
        alert: [
          "12 accounts still use password-only sign-in",
          "One of them is a shared admin account",
        ],
        user: [
          "The shared admin password is known by five people",
          "Two staff reuse that password elsewhere",
        ],
        logs: [
          "Public-facing server is missing a patch for an actively exploited flaw",
          "Internal print server is missing a low-severity patch",
        ],
        device: [
          "Laptops have disk encryption enabled",
          "Backups exist but have never been restore-tested",
        ],
      },
      decision: [
        "Patch the internet-facing exploited flaw and enforce MFA on the admin accounts",
        "Patch the internal print server first because it is quick",
        "Buy new laptops before changing anything else",
      ],
      correct: 0,
      feedback: [
        "Correct. Risk = likelihood × impact. An actively exploited, internet-facing flaw plus a shared admin login is the fastest path to compromise.",
        "Weak call. Low-severity internal patches do not reduce the exposure an attacker is currently exploiting.",
        "Weak call. Spending replaces nothing here — the exposure is configuration and patching, not hardware.",
      ],
      lesson:
        "Prioritize remediation by exposure and exploitability, not by ease. Internet-facing, actively exploited issues and shared privileged credentials come first.",
    },
    {
      id: "sec-4",
      title: "Blackout Friday",
      brief: "BOSS OPERATION — ransomware is spreading across Northstar on a holiday weekend.",
      desc: "Command the response: contain, preserve evidence, and recover without paying or destroying the investigation.",
      building: "hq",
      skill: "Incident response command",
      boss: true,
      tabs: {
        alert: [
          "Ransom note appears on 40 workstations",
          "File shares are encrypting in real time",
          "Attack started from a single finance workstation",
        ],
        user: [
          "Finance user opened an invoice attachment yesterday",
          "Staff are being told to “just reboot” by word of mouth",
        ],
        logs: [
          "Domain admin credential was used from that workstation at 03:40",
          "Backups completed successfully two days ago and are offline",
        ],
        device: [
          "Patient-zero workstation is still powered on and connected",
          "Encryption is spreading over SMB to the file server",
        ],
      },
      decision: [
        "Isolate affected hosts from the network, preserve patient zero, reset privileged credentials, and restore from offline backups",
        "Power everything off immediately to stop encryption",
        "Pay the ransom quickly so the weekend is not lost",
      ],
      correct: 0,
      feedback: [
        "Correct. Network isolation stops spread while preserving volatile evidence; credential resets cut the attacker's access; offline backups make recovery possible.",
        "Costly. Hard power-off destroys memory evidence and encryption keys that sometimes survive in RAM, and it still may not stop the spread.",
        "Wrong call. Paying funds the attacker, gives no guarantee of recovery, and leaves the original access path open.",
      ],
      lesson:
        "Incident response order matters: contain, preserve, eradicate, recover. Isolation beats power-off, credentials must be reset, and tested offline backups are what actually end a ransomware event.",
    },
  ],
  "CySA+": [
    {
      id: "cysa-1",
      title: "The Ghost Login",
      brief: "Northstar’s identity system flagged a suspicious login.",
      desc: "Correlate the login, user, device, and timing evidence before choosing a defensive response.",
      building: "soc",
      skill: "Alert triage & correlation",
      tabs: {
        alert: [
          "Successful login at 02:14 AM from Bucharest, RO",
          "Risk score: 82/100",
          "MFA push was approved",
        ],
        user: [
          "Alex says they were asleep at 02:14 AM",
          "Normal work location: New York",
          "User reports several MFA prompts before the alert",
        ],
        logs: [
          "Previous successful login: New York, 43 minutes earlier",
          "New device enrolled two minutes after login",
        ],
        device: ["Windows 11 device has never been seen on this account", "New browser fingerprint"],
      },
      decision: [
        "Revoke active sessions, require credential reset, and investigate the account",
        "Close the alert because MFA was approved",
        "Wait for another suspicious event before acting",
      ],
      correct: 0,
      feedback: [
        "Correct. Impossible travel, user denial, and new device enrollment together justify immediate containment.",
        "Wrong call. An approved MFA push can mean MFA fatigue — approval alone does not prove the user authenticated.",
        "Wrong call. Waiting gives the attacker time to persist through the device they just enrolled.",
      ],
      lesson:
        "Defensive analysis gets stronger when multiple signals agree: user denial, unusual location/timing, new device enrollment, and authentication anomalies support rapid containment.",
    },
    {
      id: "cysa-2",
      title: "Beacon in the Noise",
      brief: "A marketing laptop is making oddly regular outbound connections.",
      desc: "Separate normal traffic from command-and-control patterns and pick the right containment step.",
      building: "cafe",
      skill: "Network behaviour analysis",
      tabs: {
        alert: [
          "Outbound HTTPS to the same host every 60 seconds ±2s",
          "Destination domain registered 6 days ago",
        ],
        user: [
          "User installed a “free PDF converter” last week",
          "User reports the laptop feels slower than usual",
        ],
        logs: [
          "Requests carry tiny payloads with long random URI paths",
          "Traffic continues overnight while the user is offline",
        ],
        device: [
          "A scheduled task runs the converter binary at logon",
          "The binary is unsigned and lives in the user profile folder",
        ],
      },
      decision: [
        "Isolate the host, capture the binary and persistence for analysis, then block the domain fleet-wide",
        "Just uninstall the PDF converter and return the laptop",
        "Whitelist the domain since HTTPS traffic is encrypted anyway",
      ],
      correct: 0,
      feedback: [
        "Correct. Fixed-interval beaconing to a newly registered domain plus unsigned persistence is textbook C2 — isolate, collect evidence, then block everywhere.",
        "Incomplete. Removing the app may leave persistence and other implants, and you lose the indicators other hosts need.",
        "Wrong call. Encryption hides content, not behaviour; regular low-volume beaconing is the signal.",
      ],
      lesson:
        "Beaconing is identified by rhythm and metadata, not payload content: fixed intervals, young domains, small requests, and persistence that survives logoff. Collect indicators before you clean.",
    },
    {
      id: "cysa-3",
      title: "Patch Triage",
      brief: "The vulnerability scanner returned 900 findings and you have one maintenance window.",
      desc: "Choose what to fix first using exposure, exploitability, and business impact.",
      building: "hub",
      skill: "Vulnerability prioritization",
      tabs: {
        alert: [
          "CVSS 9.8 RCE on the public payments gateway",
          "CVSS 9.1 flaw on an isolated lab host with no network route",
        ],
        user: [
          "Payments gateway handles all customer transactions",
          "Lab host is used by one intern for testing",
        ],
        logs: [
          "Threat intel: the gateway CVE is on the known-exploited list",
          "Scanner flags 700 informational findings",
        ],
        device: [
          "Gateway has no compensating control or WAF rule",
          "Lab host sits behind an air-gapped switch",
        ],
      },
      decision: [
        "Patch the internet-facing, known-exploited gateway flaw in this window",
        "Patch the highest raw CVSS score you can find, wherever it is",
        "Close the informational findings first to reduce the ticket count",
      ],
      correct: 0,
      feedback: [
        "Correct. Known exploitation plus internet exposure plus business criticality outranks a slightly higher score on an unreachable host.",
        "Wrong call. Raw CVSS ignores reachability, exploit activity, and business impact.",
        "Wrong call. Ticket hygiene is not risk reduction; the exploited gateway stays open.",
      ],
      lesson:
        "Prioritize with context: is it reachable, is it being exploited in the wild, what does it protect, and is there a compensating control? Score alone is not a priority.",
    },
    {
      id: "cysa-4",
      title: "Data Exfil at Dawn",
      brief: "BOSS OPERATION — a large transfer left the network at 04:50 AM.",
      desc: "Run the full defensive playbook: scope the compromise, contain it, and report it correctly.",
      building: "hq",
      skill: "Incident response & reporting",
      boss: true,
      tabs: {
        alert: [
          "14 GB uploaded to an unknown cloud storage endpoint",
          "Source: a service account, not a person",
        ],
        user: [
          "Service account is used by the reporting job",
          "No human owner is listed for the account",
        ],
        logs: [
          "Account queried the customer table at 04:31 — it never has before",
          "Same account authenticated from a workstation subnet",
        ],
        device: [
          "Remote access tool installed on the reporting server two days ago",
          "The upload used a residential proxy IP",
        ],
      },
      decision: [
        "Disable the service account, block the endpoint, scope which records left, preserve logs, and notify legal/leadership on the breach path",
        "Rotate the service account password and carry on, since the job must keep running",
        "Delete the remote access tool and close the ticket quietly",
      ],
      correct: 0,
      feedback: [
        "Correct. Containment plus scoping plus evidence preservation plus notification is the complete response — data leaving the network triggers reporting obligations.",
        "Incomplete. A password rotation neither scopes the loss nor removes the attacker's remote access tool.",
        "Wrong call. Quietly deleting evidence destroys the investigation and can violate legal notification duties.",
      ],
      lesson:
        "Confirmed exfiltration is an incident with legal weight. Contain, determine exactly what data left, preserve evidence, and escalate through the reporting path — technical cleanup alone is not a response.",
    },
  ],
  "PenTest+": [
    {
      id: "pen-1",
      title: "Rules of Engagement",
      brief: "You are assigned an authorized assessment of a fictional training environment.",
      desc: "Review scope clues and decide how to handle a tempting system that is outside the authorized target list.",
      building: "soc",
      skill: "Scope & authorization",
      tabs: {
        alert: ["Authorized target: training-web.example", "Assessment window: 09:00–17:00"],
        user: ["Client contact: Jordan / Security Lead", "Production systems are excluded"],
        logs: [
          "Asset inventory lists training-web and training-api only",
          "A separate production host appears in passive discovery",
        ],
        device: [
          "Testing credentials were issued only for the training tenant",
          "Data destruction is explicitly prohibited",
        ],
      },
      decision: [
        "Do not test the out-of-scope host; document it and stay within authorization",
        "Test the production host quietly because it may be vulnerable",
        "Use destructive techniques on the training target to prove impact",
      ],
      correct: 0,
      feedback: [
        "Correct. Documenting an out-of-scope discovery keeps the engagement legal and still delivers value to the client.",
        "Wrong call. Testing outside written scope is unauthorized access, regardless of intent.",
        "Wrong call. Prohibited destructive actions breach the rules of engagement even on an in-scope target.",
      ],
      lesson:
        "Authorized security testing begins with scope. A good tester respects boundaries, avoids prohibited actions, documents unexpected findings, and communicates through the engagement process.",
    },
    {
      id: "pen-2",
      title: "Scoped and Loaded",
      brief: "Discovery starts today and the client is nervous about downtime.",
      desc: "Choose an enumeration approach that finds real attack surface without breaking the client.",
      building: "cafe",
      skill: "Discovery & enumeration",
      tabs: {
        alert: [
          "In-scope range: 10.40.7.0/24 during business hours",
          "Client asks to avoid impacting the order system",
        ],
        user: [
          "Client contact wants a daily status note",
          "A change freeze applies to the payment host",
        ],
        logs: [
          "Passive DNS shows 12 subdomains in the range",
          "An old admin portal responds on a non-standard port",
        ],
        device: [
          "Order system is a legacy appliance known to crash under heavy scanning",
          "A test replica of the order system exists",
        ],
      },
      decision: [
        "Throttle scanning, exclude the fragile appliance, test the replica instead, and note the constraint in the report",
        "Run a maximum-rate scan across the whole range to save time",
        "Skip the admin portal because it is on a strange port",
      ],
      correct: 0,
      feedback: [
        "Correct. Good testers tune intensity to the environment, use replicas for fragile systems, and document limitations honestly.",
        "Wrong call. Aggressive scanning against a known-fragile appliance causes the outage the client explicitly feared.",
        "Wrong call. Non-standard ports are exactly where forgotten admin interfaces hide — that is attack surface.",
      ],
      lesson:
        "Enumeration is planned, not brute-forced. Respect fragile systems and change freezes, use safe equivalents, and record anything you could not test so the report reflects reality.",
    },
    {
      id: "pen-3",
      title: "Proof, Not Damage",
      brief: "You found an authentication bypass on the in-scope app.",
      desc: "Decide how to prove impact without harming data or exceeding authorization.",
      building: "hub",
      skill: "Validation & evidence handling",
      tabs: {
        alert: [
          "Bypass grants access to another user's account view",
          "Scope permits exploitation, prohibits data exfiltration",
        ],
        user: [
          "Test accounts alpha and beta were provided",
          "Real customer records exist in the same database",
        ],
        logs: [
          "The bypass works via a manipulated account identifier",
          "The app logs every request with your test source IP",
        ],
        device: [
          "Screenshot tooling is approved for evidence",
          "Exporting records is explicitly prohibited",
        ],
      },
      decision: [
        "Prove it between your own two test accounts, screenshot minimal redacted evidence, and report immediately",
        "Dump the customer table to show how bad it really is",
        "Keep exploring silently and mention it at the end of the engagement",
      ],
      correct: 0,
      feedback: [
        "Correct. Minimal, redacted proof against provided test accounts demonstrates impact without touching real data — and critical findings get reported early.",
        "Wrong call. Exfiltrating real records breaches scope and turns your test into the breach.",
        "Wrong call. Sitting on a critical authentication bypass leaves the client exposed for the rest of the engagement.",
      ],
      lesson:
        "Evidence should be the minimum needed to prove impact, gathered against test data and handled carefully. Critical findings are escalated during the test, not saved for the final report.",
    },
    {
      id: "pen-4",
      title: "The Final Report",
      brief: "BOSS OPERATION — the assessment is done and the client needs the report.",
      desc: "Turn findings into something the client can actually act on.",
      building: "hq",
      skill: "Reporting & communication",
      boss: true,
      tabs: {
        alert: [
          "Findings: 1 critical, 3 high, 9 medium, 22 low",
          "The critical is the authentication bypass",
        ],
        user: [
          "Audience: an executive sponsor and an engineering team",
          "Client asks “what do we fix Monday morning?”",
        ],
        logs: [
          "Each finding has reproduction steps and timestamps",
          "Two mediums are duplicates of the same root cause",
        ],
        device: [
          "Raw evidence includes screenshots with test-account data",
          "The client requested a retest after remediation",
        ],
      },
      decision: [
        "Lead with business risk and a prioritized fix list, merge duplicates to root cause, include reproduction steps, and schedule the retest",
        "Paste the raw scanner output and let the client sort it out",
        "Report only the critical finding to keep the document short",
      ],
      correct: 0,
      feedback: [
        "Correct. A report is a decision tool: prioritized, root-cause oriented, reproducible, and followed by verification.",
        "Wrong call. Unfiltered tool output shifts the analysis burden back to the client and hides the real priorities.",
        "Wrong call. Dropping the highs and mediums hides systemic issues that will cause the next breach.",
      ],
      lesson:
        "The deliverable is the product. Communicate risk in business terms, prioritize remediation, collapse findings to root causes, keep reproduction steps, and verify fixes with a retest.",
    },
  ],
  CEH: [
    {
      id: "ceh-1",
      title: "The Open Door",
      brief: "A fictional organization asks you to assess publicly exposed information.",
      desc: "Explore the recon clues and choose the ethical next step without crossing the engagement boundary.",
      building: "soc",
      skill: "Authorized reconnaissance",
      tabs: {
        alert: [
          "Authorization covers public-facing information only",
          "No credential attacks are permitted",
        ],
        user: [
          "Company staff directory exposes roles and departments",
          "Public posts reveal a technology vendor",
        ],
        logs: [
          "Public DNS records reveal several subdomains",
          "One employee email format can be inferred from the website",
        ],
        device: ["No internal systems are authorized", "No social-engineering contact is authorized"],
      },
      decision: [
        "Document the exposure and report how it could increase social-engineering risk",
        "Contact employees pretending to be IT to test them anyway",
        "Attempt passwords against discovered accounts",
      ],
      correct: 0,
      feedback: [
        "Correct. Reporting the exposure with its risk impact is the value of recon inside authorization.",
        "Wrong call. Social engineering was explicitly out of scope, so this crosses the engagement boundary.",
        "Wrong call. Credential attacks were prohibited; discovery does not grant permission to authenticate.",
      ],
      lesson:
        "Reconnaissance can reveal valuable context, but ethical testing stays inside written authorization. Findings should explain risk and defensive countermeasures without crossing the engagement boundary.",
    },
    {
      id: "ceh-2",
      title: "Footprints in Public",
      brief: "The client's marketing team posts a lot. Maybe too much.",
      desc: "Judge which public artefacts actually raise risk, and how to report them responsibly.",
      building: "cafe",
      skill: "OSINT & metadata analysis",
      tabs: {
        alert: [
          "A blog photo shows a badge and a monitor with an internal URL",
          "A published PDF contains author and software metadata",
        ],
        user: [
          "A job ad lists exact firewall and EDR product versions",
          "An intern posted a screenshot of the VPN portal",
        ],
        logs: [
          "Code repository contains a commented-out test API key",
          "Public calendar shows the security team is at a conference next week",
        ],
        device: [
          "None of this required touching client systems",
          "Client authorization covers public sources only",
        ],
      },
      decision: [
        "Report the exposures with concrete cleanup steps and treat the leaked key as sensitive, without using it",
        "Test the leaked API key to see whether it still works",
        "Ignore the findings because nothing was hacked",
      ],
      correct: 0,
      feedback: [
        "Correct. Public data can be reported and remediated; using a leaked credential would be unauthorized access even though the key was public.",
        "Wrong call. Finding a credential is not permission to authenticate with it.",
        "Wrong call. Product versions, internal URLs, and leaked keys are exactly the raw material of a targeted attack.",
      ],
      lesson:
        "OSINT turns harmless-looking posts into an attack plan: versions, URLs, badges, metadata, and timing. Report it with cleanup guidance — and never use discovered credentials.",
    },
    {
      id: "ceh-3",
      title: "The Rogue Access Point",
      brief: "A second “Northstar-Guest” network appeared in the lobby.",
      desc: "Identify the attack and choose the countermeasure that protects users.",
      building: "hub",
      skill: "Wireless attacks & countermeasures",
      tabs: {
        alert: [
          "Two SSIDs named Northstar-Guest are broadcasting",
          "The stronger one is unencrypted",
        ],
        user: [
          "Visitors report a login page asking for corporate credentials",
          "The real guest network never asks for corporate credentials",
        ],
        logs: [
          "Deauthentication frames spike against the legitimate AP",
          "The rogue AP's MAC vendor is a consumer travel router",
        ],
        device: [
          "Signal strength peaks near the lobby seating",
          "Facilities found an unfamiliar device plugged in behind a planter",
        ],
      },
      decision: [
        "Remove the rogue device, preserve it as evidence, warn users, and force a reset of any credentials entered",
        "Connect to it and try the captive portal with a real admin login to confirm",
        "Rename the legitimate network so users can tell them apart",
      ],
      correct: 0,
      feedback: [
        "Correct. Evil-twin response is physical removal plus evidence handling plus user notification plus credential resets for anyone who fell for it.",
        "Wrong call. Feeding real admin credentials into an attacker's portal hands over exactly what they wanted.",
        "Weak call. Renaming does not remove the attacker's AP or protect users who already submitted credentials.",
      ],
      lesson:
        "An evil twin combines a spoofed SSID, deauthentication, and a credential-harvesting portal. Countermeasures are physical removal, user warning, credential resets, and wireless monitoring.",
    },
    {
      id: "ceh-4",
      title: "Capture the Flag: Northstar Range",
      brief: "BOSS OPERATION — a full authorized exercise on the training range.",
      desc: "Chain what you learned: recon, analysis, ethics, and a defensive handover.",
      building: "hq",
      skill: "Full ethical hacking cycle",
      boss: true,
      tabs: {
        alert: [
          "Range is fully authorized and isolated",
          "Goal: demonstrate a realistic attack path and how to break it",
        ],
        user: [
          "Range users are simulated accounts",
          "Blue team will read your handover notes",
        ],
        logs: [
          "Exposed subdomain runs an outdated CMS",
          "A default administrator account is still enabled",
        ],
        device: [
          "A mail server allows spoofed internal senders",
          "Range snapshots exist so changes can be reverted",
        ],
      },
      decision: [
        "Chain the findings into one documented attack path and hand over prioritized defensive countermeasures",
        "Grab the flag as fast as possible and skip the write-up",
        "Leave a persistent backdoor so retesting is easier next time",
      ],
      correct: 0,
      feedback: [
        "Correct. The value of ethical hacking is the story of the attack path plus the defences that break it at each step.",
        "Wrong call. A flag without documentation teaches the defenders nothing and cannot be remediated.",
        "Wrong call. Persistence left behind is an unauthorized access path — even on a range, it is unacceptable practice.",
      ],
      lesson:
        "Ethical hacking closes the loop: authorized recon, analysis, controlled exploitation, clean-up, and a defensive handover that tells the blue team where to break the chain.",
    },
  ],
};

export const missionCount = 4;

export function missionsFor(cert: CertKey) {
  return missionsByCert[cert];
}

export function getMission(cert: CertKey, id: string) {
  return missionsByCert[cert].find((m) => m.id === id);
}

export function firstMission(cert: CertKey) {
  return missionsByCert[cert][0]!;
}

/** Missions unlock in order; the boss unlocks once the first three are cleared. */
export function isMissionUnlocked(cert: CertKey, index: number, completedIds: string[]) {
  if (index === 0) return true;
  const list = missionsByCert[cert];
  const prior = list.slice(0, index);
  return prior.every((m) => completedIds.includes(m.id));
}

export const tabLabels: Record<TabKey, { nav: string; heading: string }> = {
  alert: { nav: "⚠ Alert", heading: "Primary evidence" },
  user: { nav: "👤 User", heading: "User context" },
  logs: { nav: "▤ Logs", heading: "Event data" },
  device: { nav: "💻 Device", heading: "Device context" },
};

export function scoreMission(correct: boolean, clues: number, boss = false) {
  const capped = Math.min(clues, 4);
  const score = Math.min((correct ? 70 : 35) + capped * 7, 98);
  const rank = score >= 92 ? "S" : score >= 82 ? "A" : score >= 70 ? "B" : "C";
  return { score, rank, xp: Math.round(score * (boss ? 8 : 5)), clues: capped };
}
