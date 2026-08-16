export type CertKey = "Security+" | "CySA+" | "PenTest+" | "CEH";

export type TabKey = "alert" | "user" | "logs" | "device";

export interface Mission {
  title: string;
  brief: string;
  desc: string;
  building: string;
  tabs: Record<TabKey, string[]>;
  decision: string[];
  correct: number;
  feedback: string[];
  lesson: string;
}

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

export const missions: Record<CertKey, Mission> = {
  "Security+": {
    title: "The Poisoned Inbox",
    brief: "A staff member received a suspicious payroll email.",
    desc: "Inspect the message, identify the strongest signs of phishing, and choose the safest response.",
    building: "🛡️ Security HQ",
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
  "CySA+": {
    title: "The Ghost Login",
    brief: "Northstar’s identity system flagged a suspicious login.",
    desc: "Correlate the login, user, device, and timing evidence before choosing a defensive response.",
    building: "🔎 SOC Tower",
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
      device: [
        "Windows 11 device has never been seen on this account",
        "New browser fingerprint",
      ],
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
  "PenTest+": {
    title: "Rules of Engagement",
    brief: "You are assigned an authorized assessment of a fictional training environment.",
    desc: "Review scope clues and decide how to handle a tempting system that is outside the authorized target list.",
    building: "🧪 Research Lab",
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
  CEH: {
    title: "The Open Door",
    brief: "A fictional organization asks you to assess publicly exposed information.",
    desc: "Explore the recon clues and choose the ethical next step without crossing the engagement boundary.",
    building: "◉ Red Team Garage",
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
};

export const tabLabels: Record<TabKey, { nav: string; heading: string }> = {
  alert: { nav: "⚠ Alert", heading: "Primary evidence" },
  user: { nav: "👤 User", heading: "User context" },
  logs: { nav: "▤ Logs", heading: "Event data" },
  device: { nav: "💻 Device", heading: "Device context" },
};

export function scoreMission(correct: boolean, clues: number) {
  const capped = Math.min(clues, 4);
  const score = Math.min((correct ? 70 : 35) + capped * 7, 98);
  const rank = score >= 92 ? "S" : score >= 82 ? "A" : score >= 70 ? "B" : "C";
  return { score, rank, xp: Math.round(score * 5), clues: capped };
}
