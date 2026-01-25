# 🖋️ Handwritten

**Transform digital text into organic, human-like handwriting.**

Handwritten is a high-performance web application that leverages procedural rendering and AI to convert typed text into realistic handwriting. It is designed to be privacy-focused, scalable, and easy to contribute to.

---

## ⚡ Quick Navigation (Project Assets)

| Category      | Files                                                                                                                                                                        |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Community** | 🤝 [Contributing Guide](CONTRIBUTING.md) • 📜 [Code of Conduct](CODE_OF_CONDUCT.md) • 🛡️ [Security Policy](SECURITY.md)                                                      |
| **Dev Ops**   | 🏗️ [CI Pipeline](.github/workflows/ci.yml) • 🧪 [.env.example](.env.example) • 🖋️ [.editorconfig](.editorconfig)                                                             |
| **Templates** | 🐞 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) • ✨ [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) • 🔄 [PR Template](.github/PULL_REQUEST_TEMPLATE.md) |
| **Legal**     | ⚖️ [MIT License](LICENSE) • 🤖 [Sitemap](public/sitemap.xml) • 🏷️ [ads.txt](public/ads.txt)                                                                                  |

---

## 🚀 Technical Overview

### 🎨 Rendering Engine

Unlike a simple font-replacer, Handwritten uses a **procedural simulation** to make text look real:

- **Deterministic Randomness**: Uses a seed-based hash to ensure that jitter and pressure remain consistent for the same text across sessions.
- **Organic Jitter**: Dynamically offsets characters slightly to mimic the natural micro-movements of a human hand.
- **Variable Pressure**: Simulates ink flow changes based on writing speed and character complexity.
- **Multipage Flow**: Automatically handles pagination, margins, and paper types (Plain vs Lined) in real-time.

### 🤖 AI Humanizer

Integrated with **OpenRouter (GPT-4o-mini)**, the Humanizer doesn't just rewrite text; it injects natural phrasing, fillers, and "human" errors to make the converted output indistinguishable from a handwritten note.

### 🔒 Privacy & Architecture

- **Client-Side Rendering**: 100% of the document processing happens in your browser. No document data is ever stored on a server.
- **State Management**: Built with **Zustand** for lightweight, high-speed state synchronization across the editor and previews.
- **Storage**: Uses `indexedDB` (via `lz-string` compression) to store a local history of your exports directly on your device.

---

## 🏗️ Getting Started

1. **Clone & Install**

    ```bash
    git clone https://github.com/ArshVermaGit/Handwritten.git
    cd Handwritten
    npm install
    ```

2. **Environment Setup**
   Copy `.env.example` to `.env` and add your [OpenRouter](https://openrouter.ai/) API key.

3. **Develop**
    ```bash
    npm run dev
    ```

---

## 📄 Project Structure

- `src/components`: UI components (Glassmorphism design, Modals, Forms).
- `src/lib/store.ts`: The central nervous system (Zustand state).
- `src/pages/EditorPage.tsx`: The core rendering pipeline and simulation logic.
- `src/pages/legal/`: AdSense-compliant mandatory pages.
- `src/utils/`: Helper functions for PDF export, sharing, and formatting.

---

## 🤝 Community & Support

We welcome contributors! Check our [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

- **Developer**: [Arsh Verma](https://www.linkedin.com/in/arshvermadev/)
- **GitHub**: [ArshVermaGit](https://github.com/ArshVermaGit)
- **LinkedIn**: [Arsh Verma](https://www.linkedin.com/in/arshvermadev/)
- **Twitter / X**: [@TheArshVerma](https://x.com/TheArshVerma)
- **Website**: [handwritten-git.vercel.app](https://handwritten-git.vercel.app)
- **Email**: [arshverma.dev@gmail.com](mailto:arshverma.dev@gmail.com)

---

## 📜 License

Licensed under the **MIT License**. Created with ❤️ by Arsh Verma.
