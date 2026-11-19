# ⚡ Optium-EV — Smart IoT EV Charging App

A React Native (Expo) mobile application for managing smart multi-bay Electric Vehicle (EV) charging stations. Optium-EV integrates live IoT telemetry via **ThingsBoard**, automated payments via **Razorpay**, and a real-time **Dynamic Pricing Engine** based on Time-of-Day tariffs, AI congestion forecasts, battery SOC, and bay availability.

---

## ✨ Key Features

- **Live Multi-Bay Monitoring:** Switch between 3 charging terminals with real-time bay status (`AVAILABLE` / `OCCUPIED`), live power consumption (W), and predicted wait times.
- **Dynamic Pricing Engine:** Automatically calculates per-kWh tariffs using:
  - **Time-of-Day (ToD):** Peak surcharges, midday solar discounts, and night off-peak rates.
  - **AI Congestion Forecast:** Adjusts rates dynamically based on predicted station load.
  - **Battery SOC Protection:** Applies a **Tier 2 Rescue** discount and surge cap for critically low-battery EVs (≤15% SOC) while discouraging bay hogging above 80% SOC.
  - **Station Availability:** Factors in the number of free bays in real time.
- **Expandable Price Breakdown:** Clean, collapsible UI displaying the exact per-kWh rate and itemized cost before checkout.
- **Razorpay Payment & Verification:** Generates dynamic payment links through a Node.js backend and triggers charging automatically upon verification.
- **Instant PDF Receipts:** Generates and exports session receipts natively using `expo-print`.
- **Direct IoT Hardware Control:** Communicates with EV charging controllers via ThingsBoard Cloud Shared Attributes with JWT token caching for low-latency switching.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Mobile App** | React Native, Expo, TypeScript |
| **IoT & Hardware** | ThingsBoard Cloud, ESP32 |
| **Backend** | Node.js, Express (Hosted on Render) |
| **Database** | MongoDB |
| **Payments** | Razorpay Payment Links API |
| **Receipts & Builds** | `expo-print`, Expo Application Services (EAS) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI & Expo Go (for testing) or EAS CLI (for APK builds)

### Installation

```bash
# Clone the repository
git clone [https://github.com/](https://github.com/)<ayushsrivstava>/<optium-ev-project>.git
cd <your-repo-name>

# Install dependencies
npm install


# Start the development server
npx expo start
