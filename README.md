# InkPad - Text to Handwriting Converter

Transform your typed text into beautiful, realistic handwriting with customizable styles and export to PDF or images.

![InkPad Demo](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.2-purple)

## ✨ Features

- **Real-time Preview**: See your handwriting as you type
- **Multiple Handwriting Styles**: Choose from Cursive, Script, or Print fonts
- **Customizable Settings**:
  - Font size (16px - 48px)
  - Line spacing (1.0x - 3.0x)
  - Paper types (Blank, Lined, Grid)
  - Ink colors (Black, Dark Gray, Gray, Medium Gray)
- **Export Options**:
  - PDF format
  - PNG format
  - JPG format
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Premium UI with Framer Motion animations
- **Word & Character Count**: Track your text metrics in real-time

## 🚀 Technology Stack

- **Frontend Framework**: React 19.2
- **Build Tool**: Vite 7.2
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **State Management**: Zustand 5.0
- **Animations**: Framer Motion 12.23
- **PDF Generation**: jsPDF 3.0
- **Image Export**: Canvas API (native)
- **Fonts**: Google Fonts (Caveat, Dancing Script, Patrick Hand)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd InkPad
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📁 Project Structure

```
InkPad/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # App header
│   │   ├── Footer.tsx       # App footer
│   │   ├── TextInput.tsx    # Text input area
│   │   ├── HandwritingCanvas.tsx  # Canvas preview
│   │   ├── ControlPanel.tsx # Customization controls
│   │   └── ExportButtons.tsx # Export functionality
│   ├── hooks/               # Custom React hooks (future)
│   ├── lib/                 # Third-party configs
│   │   └── store.ts         # Zustand state management
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Type definitions
│   ├── utils/               # Utility functions
│   │   ├── handwriting.ts   # Canvas rendering logic
│   │   └── export.ts        # Export utilities
│   ├── styles/              # Global styles
│   │   └── index.css        # Tailwind + custom CSS
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Public static files
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies
```

## 🎨 Design Philosophy

InkPad follows a **minimalist grayscale aesthetic** with a focus on:

- **Clarity**: Clean, uncluttered interface
- **Elegance**: Smooth animations and transitions
- **Usability**: Intuitive controls and instant feedback
- **Performance**: Optimized rendering and exports

## 🔧 Configuration

### Customizing Handwriting Fonts

To add new handwriting fonts:

1. Import the font in `src/styles/index.css`:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');
   ```

2. Add to Tailwind config in `tailwind.config.js`:
   ```javascript
   fontFamily: {
     yourfont: ['YourFont', 'cursive'],
   }
   ```

3. Update `src/utils/handwriting.ts` to include your font style.

### Customizing Colors

Edit the `ink` color palette in `tailwind.config.js` to change the grayscale theme.

## 📝 Usage

1. **Type or paste text** in the left text area
2. **Customize the appearance** using the control panel:
   - Select a handwriting style
   - Adjust font size with the slider
   - Set line spacing
   - Choose paper type (blank, lined, or grid)
   - Pick ink color
3. **Preview** your handwritten text in real-time on the right
4. **Export** your handwriting:
   - Click "Export PDF" for a PDF file
   - Click "Export PNG" or "Export JPG" for image files

## 🚀 Future Enhancements

- [ ] More handwriting font options
- [ ] Custom color picker (beyond grayscale)
- [ ] Margin and padding controls
- [ ] Multiple page support
- [ ] Signature feature
- [ ] Text alignment options
- [ ] Dark mode
- [ ] Save/load presets
- [ ] Batch text conversion
- [ ] Cloud storage integration

## 🐛 Known Issues

None at the moment! Report issues on GitHub.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

**Arsh Verma**
- GitHub: [@ArshVermaGit](https://github.com/ArshVermaGit)
- LinkedIn: [arshverma](https://linkedin.com/in/arshverma)
- X: [@arshverma](https://X.com/arshverma)

## 🙏 Acknowledgments

- Google Fonts for the handwriting fonts
- Vite team for the amazing build tool
- React team for the powerful framework
- All open-source contributors

---

Made with ❤️ by Arsh Verma
# InkPad
