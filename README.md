<div align="center">

# 🖋️ Handwritten

<img src="src/assets/logo.png" alt="Handwritten Logo" width="160" />

### Transform digital text into organic, human-like handwriting.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://handwritten-git.vercel.app)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Security Policy](https://img.shields.io/badge/Security-Policy-blue.svg)](SECURITY.md)
[![CI Status](https://img.shields.io/badge/CI-Passing-success.svg)](https://github.com/ArshVermaGit/Handwritten/actions)

---

**Handwritten** is a high-performance web application that leverages procedural rendering and AI to convert typed text into realistic handwriting. Designed to be privacy-focused, scalable, and easy to contribute to.

[**Launch Workshop**](https://handwritten-git.vercel.app) • [**Report Bug**](.github/ISSUE_TEMPLATE/bug_report.md) • [**Request Feature**](.github/ISSUE_TEMPLATE/feature_request.md)

</div>

---

## ⚡ Quick Navigation

| 📄 Community & Legal                        | ⚙️ Technical Assets                                | 🛠️ Issue Templates                                              |
| :------------------------------------------ | :------------------------------------------------- | :-------------------------------------------------------------- |
| 🤝 [Contribution Guide](CONTRIBUTING.md)    | 🧪 [.env.example](.env.example)                    | 🐞 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)           |
| 🛡️ [Security Policy](SECURITY.md)           | 🏗️ [CI Pipeline](.github/workflows/ci.yml)         | ✨ [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) |
| 💰 [Support & Funding](.github/FUNDING.yml) | 🛡️ [CodeQL Analysis](.github/workflows/codeql.yml) | ❓ [Ask a Question](.github/ISSUE_TEMPLATE/question.md)         |
| 📜 [Code of Conduct](CODE_OF_CONDUCT.md)    | 🤖 [Sitemap XML](public/sitemap.xml)               | 🔄 [PR Template](.github/PULL_REQUEST_TEMPLATE.md)              |
| ⚖️ [MIT License](LICENSE)                   | 🏷️ [ads.txt](public/ads.txt)                       | 🖋️ [Editor Config](.editorconfig)                               |

---

## 🚀 Technical Highlights

### 🎨 Intelligent Rendering Engine

Unlike a simple font-replacer, Handwritten uses a **procedural simulation** to make text look real:

- **Deterministic Randomness**: Uses a seed-based hash to ensure that jitter and pressure remain consistent for the same text across sessions.
- **Organic Jitter**: Dynamically offsets characters slightly to mimic the natural micro-movements of a human hand.
- **Variable Pressure**: Simulates ink flow changes based on writing speed and character complexity.
- **Surface Simulation**: Automatically handles pagination, margins, and paper types (Plain vs Lined) in real-time.

### 🤖 AI Humanization Engine

Integrated with **OpenRouter (GPT-4o-mini)**, the Humanizer doesn't just rewrite text; it injects natural phrasing, fillers, and "human-like" errors to make the converted output indistinguishable from a handwritten note.

### 🔒 Privacy-First Architecture

- **In-Browser Processing**: 100% of the document processing happens in your browser. No document data is ever stored on a external server.
- **State Management**: Built with **Zustand** for lightweight, high-speed state synchronization across the editor and previews.
- **Local History**: Uses `indexedDB` (via `lz-string` compression) to store a local history of your exports directly on your device.

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

3. **Development Mode**
    ```bash
    npm run dev
    ```

---

## 🤝 Community & Support

We welcome contributors! Check our [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

<div align="center">
  <p>
    <strong>Arsh Verma</strong><br/>
    Developer & Designer
  </p>
  <a href="https://github.com/ArshVermaGit"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
  <a href="https://www.linkedin.com/in/arshvermadev/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
  <a href="https://x.com/TheArshVerma"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>
  <a href="mailto:arshverma.dev@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
</div>

---

## 📜 Credits & License

Licensed under the **MIT License**. Created with ❤️ by Arsh Verma.
