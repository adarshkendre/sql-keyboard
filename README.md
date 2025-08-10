# 🗄️ SQL Assistant Pro

A professional Chrome extension that provides a floating SQL keyboard for coding platforms. Streamline your SQL query writing with quick access to keywords, functions, and operators.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange)

## ✨ Features

### 🎯 **Smart SQL Keyboard**
- **60+ SQL keywords** organized in logical categories
- **Instant insertion** into any text editor or input field
- **Smart editor detection** - works with CodeMirror, Monaco, ACE, and more
- **Visual feedback** with success/error notifications

### 🎨 **Modern Interface**
- **Beautiful gradient design** with glassmorphism effects
- **Fully draggable** floating panel
- **Minimize/maximize** functionality to save screen space
- **Responsive layout** with smooth scrolling
- **Hover animations** and professional typography

### 🔧 **Advanced Functionality**
- **Focus tracking** - remembers your last text input
- **Multiple insertion methods** with intelligent fallbacks
- **Framework compatibility** - works with React, Vue, and other frameworks
- **Viewport boundary detection** - panel stays within screen bounds

### 🌐 **Broad Compatibility**
Works seamlessly on popular coding platforms:
- **LeetCode** - SQL problem solving
- **HackerRank** - Coding challenges
- **W3Schools** - SQL tutorials and tryit editor
- **CodePen** - Web development
- **JSFiddle** - Code snippets
- **SQLFiddle** - SQL query testing
- **Replit** - Online coding environment
- And many more!

## 📦 Installation

### Method 1: Load Unpacked Extension (Recommended)

1. **Download or clone** this repository
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top right)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** for easy access

### Method 2: Manual Setup

1. **Create a folder** called `sql-assistant-pro`
2. **Copy the files** from this repository into the folder:
   ```
   sql-assistant-pro/
   ├── manifest.json
   ├── content.js
   ├── popup.html
   └── icons/ 
   ```
3. **Follow steps 2-5** from Method 1

## 🚀 Usage

### Getting Started
1. **Visit a supported website** (currently works on LeetCode only)
2. **Look for the floating panel** on the right side of your screen
3. **Click in any text area** where you want to write SQL
4. **Click keyword buttons** to insert SQL commands instantly!

### Panel Controls
- **🎯 Drag**: Click and hold the header to move the panel anywhere
- **➖ Minimize**: Click the "−" button to collapse the panel
- **❌ Close**: Click the "×" button to remove the panel
- **🔄 Restore**: Refresh the page to restore a closed panel

### Keyword Categories

#### **Basic Queries**
`SELECT` `FROM` `WHERE` `INSERT INTO` `UPDATE` `DELETE`

#### **Clauses & Modifiers**
`GROUP BY` `HAVING` `ORDER BY` `DISTINCT` `LIMIT` `OFFSET`

#### **Joins**
`INNER JOIN` `LEFT JOIN` `RIGHT JOIN` `FULL JOIN` `ON`

#### **Operators**
`AND` `OR` `NOT` `IN` `BETWEEN` `LIKE` `IS NULL` `IS NOT NULL`

#### **Functions**
`COUNT()` `SUM()` `AVG()` `MAX()` `MIN()` `UPPER()` `LOWER()`

#### **Symbols**
`=` `!=` `<` `>` `<=` `>=` `(` `)` `,` `;` `*` `AS`

## 🛠️ Technical Details

### Architecture
- **Manifest V3** compliant
- **Class-based architecture** for maintainability
- **Event-driven design** with proper cleanup
- **Memory efficient** with single instance pattern

### Smart Insertion Technology
The extension uses multiple insertion strategies:

1. **Focus Tracking** - Remembers your last clicked text input
2. **Active Element Detection** - Identifies currently focused elements
3. **Editor-Specific Methods** - Custom logic for CodeMirror, Monaco, ACE
4. **DOM Manipulation** - Direct value insertion with proper events
5. **Fallback Methods** - Multiple backup strategies ensure reliability

### Browser Compatibility
- **Chrome 88+** (Manifest V3 support)
- **Edge 88+** (Chromium-based)
- Other Chromium-based browsers

## 🎯 Supported Websites

### Coding Platforms
- [LeetCode](https://leetcode.com) - Algorithm and SQL problems (currently works on Leetcode only)
- [HackerRank](https://hackerrank.com) - Coding challenges and contests (in future)
- [CodePen](https://codepen.io) - Front-end code playground (in future)
- [JSFiddle](https://jsfiddle.net) - Code sharing and testing (in future)
- [Replit](https://replit.com) - Online IDE and collaboration (in future)

### SQL-Specific Platforms
- [W3Schools SQL Tryit](https://w3schools.com) - SQL tutorial editor
- [SQLFiddle](https://sqlfiddle.com) - SQL query testing
- [DB Fiddle](https://dbfiddle.uk) - Database playground
- [SQLite Viewer](https://sqliteviewer.app) - Online SQLite editor

### Development Tools
- [CodeSandbox](https://codesandbox.io) - Online development environment
- Various online SQL editors and databases

## 🐛 Troubleshooting

### Panel Not Appearing
- ✅ Check if you're on a supported website
- ✅ Look in browser console for JavaScript errors
- ✅ Try refreshing the page
- ✅ Ensure the extension is enabled in `chrome://extensions/`

### Keywords Not Inserting
- ✅ **Click in a text area first** before using keyword buttons
- ✅ Look for success/error notifications
- ✅ Check browser console for detailed logs
- ✅ Try different text areas on the page

### Extension Not Loading
- ✅ Verify all files are in the correct location
- ✅ Check `manifest.json` syntax validity
- ✅ Enable Developer Mode in Chrome extensions
- ✅ Check for Chrome extension permission warnings

### Debug Mode
Open Chrome DevTools (F12) and check the Console tab for detailed logging:
```
SQL Assistant Pro loaded successfully!
Tracked text input click: TEXTAREA undefined
Button clicked, keyword: SELECT
Success with Focus Tracking
```

## 🔧 Development

### File Structure
```
sql-assistant-pro/
├── manifest.json          # Extension configuration
├── content.js            # Main functionality (injected script)
├── popup.html           # Extension popup interface
├── icons/              # Extension icons (optional)
│   ├── icon16.png     # 16x16 toolbar icon
│   ├── icon48.png     # 48x48 management icon
│   └── icon128.png    # 128x128 store icon
└── README.md          # Documentation
```

### Key Classes and Methods

#### `SQLKeyboard` Class
- `constructor()` - Initialize extension
- `createPanel()` - Build floating UI
- `insertKeyword()` - Smart text insertion
- `setupFocusTracking()` - Track user interactions

#### Insertion Methods
- `insertIntoActiveElement()` - Standard input/textarea
- `insertIntoCodeMirror()` - CodeMirror editor support
- `insertIntoMonaco()` - Monaco editor (VS Code)
- `insertIntoAce()` - ACE editor support
- `forceInsertText()` - Fallback methods

### Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Adding New Websites

To add support for new websites, edit `manifest.json`:

```json
{
  "host_permissions": [
    "https://new-coding-site.com/*"
  ],
  "content_scripts": [
    {
      "matches": [
        "https://new-coding-site.com/*"
      ]
    }
  ]
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- **Inspiration**: Built to enhance the coding experience on SQL platforms
- **Design**: Modern glassmorphism and gradient trends
- **Technology**: Chrome Extension Manifest V3 best practices

## 📞 Support

### Issues & Bug Reports
- Open an issue on [GitHub Issues](../../issues)
- Include browser version, website URL, and console logs
- Describe steps to reproduce the problem

### Feature Requests
- Suggest new keywords or website support
- UI/UX improvements
- Performance optimizations

---

**Made with ❤️ for developers who love SQL**

*Streamline your SQL coding workflow with instant keyword access!*
