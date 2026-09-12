export const PROFILE_DATA = {
  name: "Ayush Srivastava",
  education: "B.Tech Electronics and Communication, MMMUT Gorakhpur",
  tagline: "FROM ELECTRON TO INTELLIGENCE",
  description: "I build intelligent connected embedded systems. My focus spans hardware design, microcontroller firmware, edge AI, and IoT telemetry.",
  email: "ayushsrivastavaind@email.com",
  phone: "+91-9166947949",
  github: "https://github.com/ayushsrivasatava",
  linkedin: "https://linkedin.com/in/ayush-srivastava-382030269"
};

export const SECTIONS = [
  { id: "resume", title: "RESUME", icon: "file-text", description: "View and extract academic and professional background." },
  { id: "personal", title: "PERSONAL DETAILS", icon: "user", description: "Contact info, roll number, and university profile." },
  { id: "internship", title: "INTERNSHIPS", icon: "briefcase", description: "Emertxe & North Eastern Railways experience." },
  { id: "projects", title: "PROJECTS", icon: "cpu", description: "ESP32 EV Charging, ML Adulteration, and PCB design." },
  { id: "certificates", title: "CERTIFICATES", icon: "award", description: "Simulink, Altium PCB, VLSI, and Drone Technologies." },
  { id: "achievements", title: "ACHIEVEMENTS", icon: "star", description: "GATE 2026, ISRO BAH 2026, and Techsrijan." }
];

export const PROJECTS_DATA = [
  {
    id: "esp32-ev",
    title: "Smart EV Charging Station & ADAS Dashboard",
    domain: "IoT / Edge AI / Embedded",
    techStack: ["STM32", "ESP32", "Embedded C", "MQTT"],
    description: "Intelligent charging control and EV monitoring dashboard featuring Edge AI optimization.",
    renderUrl: "https://github.com/ayushsrivasatava/ADAS-and-EV-based-Dashboard-using-STM32", // Deployed/Repo link
    isFlagship: true
  },
  {
    id: "milk-ml",
    title: "Milk Adulteration Detection using Microwave Antenna",
    domain: "RF Sensing / Machine Learning",
    techStack: ["ANSYS", "Python", "Scikit-learn", "Pandas"],
    description: "Microwave microstrip antenna assisted by machine learning for adulterant detection.",
    renderUrl: "https://github.com/ayushsrivasatava/Machine-Learning-assisted-Antenna-for-adulterant-detection-in-milk",
    isFlagship: false
  },
  {
    id: "power-pmu",
    title: "Transformerless Power Supply PCB Design",
    domain: "Hardware / PCB Design",
    techStack: ["KiCad", "LTSpice"],
    description: "Circuit design and simulation for transformerless power delivery.",
    renderUrl: "https://github.com/ayushsrivasatava/Transformerless Power Supply",
    isFlagship: false
  }
];

export const INTERNSHIPS_DATA = [
  {
    company: "Emertxe Information Technologies, Bangalore",
    role: "Trainee",
    period: "June 2026 (Remote)",
    details: "Developed ADAS and Electric Vehicle (EV) application prototypes using STM32 Blue Pill (ARM Cortex-M). Implemented Embedded C programs involving UART communication and peripheral interfacing."
  },
  {
    company: "SIGNAL AND TELECOM, NORTH EASTERN RAILWAYS",
    role: "Trainee",
    period: "Gorakhpur",
    details: "Observed railway signaling and telecommunication systems including interlocking, track circuits, and relay systems."
  }
];

export const ACHIEVEMENTS_DATA = [
  "GATE 2026 Qualified in 3rd Year (Electronics & Communication Engineering) with score 460.",
  "Bharatiya Antariksh Hackathon 2026 (ISRO) - Proposed AI-driven satellite image interpolation using Optical Flow and Deep Learning.",
  "Techsrijan 2nd Rank - Annual technical festival of MMMUT for RoboCar."
];

export const CERTIFICATES_DATA = [
  "Simulink",
  "PCB Design (Altium)",
  "VLSI",
  "Drone Technologies"
];