# Birthdays# Birthdays — vCard to iCalendar Converter

Birthdays is a minimalist, high-end web application designed to transform your exported contact files (VCF) into organized calendar events (ICS). Built with a focus on privacy and "Apple-esque" design elegance, it allows you to sync birthdays across all your devices with smart features like automated age calculation.

## 🌟 Features

- **Privacy-First Architecture**: Your contact data never leaves your browser. All parsing and conversion happen locally on your device.
- **Smart Age Calculation**: Automatically calculate and include ages in event titles (e.g., "John's 30th Birthday").
- **Recurring Events**: Generate native `FREQ=YEARLY` events that work perfectly in Apple Calendar, Google Calendar, and Outlook.
- **Minimalist Aesthetic**: A polished UI inspired by modern design leaders like Linear and Apple, featuring "Natural Tones," glassmorphism accents, and fluid motion.
- **Responsive Design**: Seamlessly usable on desktop and mobile browsers.

## 🛠️ How it Works

1. **Export**: Export your contacts in `.vcf` format from your iPhone, Android, or Google Contacts.
2. **Upload**: Drag and drop the file into the Birthdays dashboard.
3. **Customize**: Choose between "Recurring" (standard yearly events) or "With Age" (calculates the milestone for a target year).
4. **Generate**: Download the resulting `.ics` file and open it—your calendar app handles the rest.


## ⚙️ Installation

Run locally.
```bash
npm install       # first time only
npm run dev
```

## 🧱 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 (using the "Natural Tones" theme)
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Libraries**:
  - `vcf`: For robust contact parsing and fallback regex handling.
  - `ics`: For standards-compliant iCalendar generation.

## 🔒 Privacy

We believe your contact list is one of your most private datasets. This website is a **client-side only tool**. There is no backend storage, no analytics tracking your personal details, and no data transmitted over the network.
