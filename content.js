class SQLKeyboard {
    constructor() {
        this.panel = null;
        this.isDragging = false;
        this.isVisible = false;
        this.dragOffset = { x: 0, y: 0 };
        this.lastFocusedElement = null; // Track last focused text element
        this.init();
    }

    init() {
        // Prevent multiple instances
        if (document.getElementById('sql-keyboard-panel')) return;
        
        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createPanel());
        } else {
            this.createPanel();
        }
    }

    createPanel() {
        // Create main panel container
        this.panel = document.createElement('div');
        this.panel.id = 'sql-keyboard-panel';
        this.panel.innerHTML = this.getPanelHTML();
        this.panel.style.cssText = this.getPanelCSS();
        
        // Add to page
        document.body.appendChild(this.panel);
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('SQL Assistant Pro loaded successfully!');
    }

    getPanelHTML() {
        return `
            <div class="sql-header" id="sql-drag-handle">
                <span class="sql-title">🗄️ SQL Assistant</span>
                <div class="sql-controls">
                    <button class="sql-minimize" title="Minimize">−</button>
                    <button class="sql-close" title="Close">×</button>
                </div>
            </div>
            
            <div class="sql-content" id="sql-content">
                <div class="sql-section">
                    <div class="sql-section-title">Basic Queries</div>
                    <div class="sql-buttons">
                        <button data-keyword="SELECT">SELECT</button>
                        <button data-keyword="FROM">FROM</button>
                        <button data-keyword="WHERE">WHERE</button>
                        <button data-keyword="INSERT INTO">INSERT INTO</button>
                        <button data-keyword="UPDATE">UPDATE</button>
                        <button data-keyword="DELETE">DELETE</button>
                    </div>
                </div>

                <div class="sql-section">
                    <div class="sql-section-title">Clauses & Modifiers</div>
                    <div class="sql-buttons">
                        <button data-keyword="GROUP BY">GROUP BY</button>
                        <button data-keyword="HAVING">HAVING</button>
                        <button data-keyword="ORDER BY">ORDER BY</button>
                        <button data-keyword="DISTINCT">DISTINCT</button>
                        <button data-keyword="LIMIT">LIMIT</button>
                        <button data-keyword="OFFSET">OFFSET</button>
                    </div>
                </div>

                <div class="sql-section">
                    <div class="sql-section-title">Joins</div>
                    <div class="sql-buttons">
                        <button data-keyword="INNER JOIN">INNER JOIN</button>
                        <button data-keyword="LEFT JOIN">LEFT JOIN</button>
                        <button data-keyword="RIGHT JOIN">RIGHT JOIN</button>
                        <button data-keyword="FULL JOIN">FULL JOIN</button>
                        <button data-keyword="ON">ON</button>
                    </div>
                </div>

                <div class="sql-section">
                    <div class="sql-section-title">Operators</div>
                    <div class="sql-buttons">
                        <button data-keyword="AND">AND</button>
                        <button data-keyword="OR">OR</button>
                        <button data-keyword="NOT">NOT</button>
                        <button data-keyword="IN">IN</button>
                        <button data-keyword="BETWEEN">BETWEEN</button>
                        <button data-keyword="LIKE">LIKE</button>
                        <button data-keyword="IS NULL">IS NULL</button>
                        <button data-keyword="IS NOT NULL">IS NOT NULL</button>
                    </div>
                </div>

                <div class="sql-section">
                    <div class="sql-section-title">Functions</div>
                    <div class="sql-buttons">
                        <button data-keyword="COUNT()">COUNT()</button>
                        <button data-keyword="SUM()">SUM()</button>
                        <button data-keyword="AVG()">AVG()</button>
                        <button data-keyword="MAX()">MAX()</button>
                        <button data-keyword="MIN()">MIN()</button>
                        <button data-keyword="UPPER()">UPPER()</button>
                        <button data-keyword="LOWER()">LOWER()</button>
                    </div>
                </div>

                <div class="sql-section">
                    <div class="sql-section-title">Symbols</div>
                    <div class="sql-buttons">
                        <button data-keyword="=">=</button>
                        <button data-keyword="!=">!=</button>
                        <button data-keyword="<"><</button>
                        <button data-keyword=">">></button>
                        <button data-keyword="<="><=</button>
                        <button data-keyword=">=">=</button>
                        <button data-keyword="(">(</button>
                        <button data-keyword=")">)</button>
                        <button data-keyword=",">,</button>
                        <button data-keyword=";">;</button>
                        <button data-keyword="*">*</button>
                        <button data-keyword="AS">AS</button>
                    </div>
                </div>
            </div>
        `;
    }

    getPanelCSS() {
        return `
            position: fixed !important;
            top: 50px !important;
            right: 20px !important;
            width: 320px !important;
            max-height: 600px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            border-radius: 12px !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) !important;
            z-index: 2147483647 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            overflow: hidden !important;
            backdrop-filter: blur(10px) !important;
            transform: translateZ(0) !important;
        `;
    }

    setupEventListeners() {
        // Drag functionality
        const dragHandle = this.panel.querySelector('#sql-drag-handle');
        dragHandle.addEventListener('mousedown', this.startDrag.bind(this));
        
        // Button clicks
        this.panel.addEventListener('click', this.handleClick.bind(this));
        
        // Close and minimize
        this.panel.querySelector('.sql-close').addEventListener('click', this.close.bind(this));
        this.panel.querySelector('.sql-minimize').addEventListener('click', this.toggleMinimize.bind(this));
        
        // Prevent panel from losing focus
        this.panel.addEventListener('mousedown', (e) => e.stopPropagation());
        
        // Global mouse events for dragging
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        
        // Track focus changes to remember last text input
        this.setupFocusTracking();
        
        // Add CSS styles to page
        this.addStyles();
    }

    setupFocusTracking() {
        // Track when user focuses on text inputs
        document.addEventListener('focusin', (e) => {
            const target = e.target;
            if (this.isTextInput(target)) {
                this.lastFocusedElement = target;
                console.log('Tracked text input focus:', target.tagName, target.type);
            }
        });

        // Also track clicks on text inputs
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (this.isTextInput(target)) {
                this.lastFocusedElement = target;
                console.log('Tracked text input click:', target.tagName, target.type);
            }
        });
    }

    isTextInput(element) {
        if (!element) return false;
        
        // Check for textarea
        if (element.tagName === 'TEXTAREA') return true;
        
        // Check for text inputs
        if (element.tagName === 'INPUT') {
            const type = element.type?.toLowerCase();
            return ['text', 'search', 'url', 'email', 'password'].includes(type);
        }
        
        // Check for contenteditable
        if (element.isContentEditable) return true;
        
        // Check for CodeMirror
        if (element.classList?.contains('CodeMirror-code')) return true;
        
        // Check if inside CodeMirror
        if (element.closest?.('.CodeMirror')) return true;
        
        return false;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #sql-keyboard-panel .sql-header {
                background: rgba(255,255,255,0.1);
                padding: 12px 16px;
                cursor: move;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            #sql-keyboard-panel .sql-title {
                color: white;
                font-weight: 600;
                font-size: 14px;
            }
            
            #sql-keyboard-panel .sql-controls {
                display: flex;
                gap: 4px;
            }
            
            #sql-keyboard-panel .sql-controls button {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            #sql-keyboard-panel .sql-controls button:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.1);
            }
            
            #sql-keyboard-panel .sql-content {
                padding: 16px;
                max-height: 500px;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: rgba(255,255,255,0.3) transparent;
            }
            
            #sql-keyboard-panel .sql-content::-webkit-scrollbar {
                width: 6px;
            }
            
            #sql-keyboard-panel .sql-content::-webkit-scrollbar-track {
                background: transparent;
            }
            
            #sql-keyboard-panel .sql-content::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.3);
                border-radius: 3px;
            }
            
            #sql-keyboard-panel .sql-section {
                margin-bottom: 16px;
            }
            
            #sql-keyboard-panel .sql-section-title {
                color: rgba(255,255,255,0.9);
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            #sql-keyboard-panel .sql-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            
            #sql-keyboard-panel .sql-buttons button {
                background: rgba(255,255,255,0.15);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 500;
                transition: all 0.2s ease;
                white-space: nowrap;
                backdrop-filter: blur(10px);
            }
            
            #sql-keyboard-panel .sql-buttons button:hover {
                background: rgba(255,255,255,0.25);
                border-color: rgba(255,255,255,0.4);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            
            #sql-keyboard-panel .sql-buttons button:active {
                transform: translateY(0px);
                background: rgba(255,255,255,0.3);
            }
            
            #sql-keyboard-panel.minimized .sql-content {
                display: none;
            }
            
            #sql-keyboard-panel.minimized {
                height: auto !important;
            }
            
            .sql-notification {
                position: fixed !important;
                top: 20px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                background: #4CAF50 !important;
                color: white !important;
                padding: 12px 24px !important;
                border-radius: 8px !important;
                z-index: 2147483648 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                font-size: 14px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                animation: slideDown 0.3s ease !important;
            }
            
            .sql-notification.error {
                background: #f44336 !important;
            }
            
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    startDrag(e) {
        this.isDragging = true;
        const rect = this.panel.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - this.panel.offsetWidth;
        const maxY = window.innerHeight - this.panel.offsetHeight;
        
        this.panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        this.panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        this.panel.style.right = 'auto';
    }

    endDrag() {
        this.isDragging = false;
    }

    handleClick(e) {
        const button = e.target.closest('[data-keyword]');
        if (!button) return;
        
        const keyword = button.getAttribute('data-keyword');
        console.log('Button clicked, keyword:', keyword);
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
        
        const success = this.insertKeyword(keyword);
        
        if (success) {
            this.showNotification(`✓ Inserted: ${keyword}`, 'success');
        } else {
            // Show debug info
            const active = document.activeElement;
            const debugInfo = `Active: ${active?.tagName || 'none'} (${active?.type || 'N/A'})`;
            console.log('Insert failed. Debug:', debugInfo);
            
            this.showNotification(`❌ Click in text area first\n${debugInfo}`, 'error');
        }
    }

    insertKeyword(keyword) {
        console.log('Attempting to insert keyword:', keyword);
        console.log('Last focused element:', this.lastFocusedElement);
        
        // If we have a tracked text input, try to use it
        if (this.lastFocusedElement && this.isTextInput(this.lastFocusedElement)) {
            console.log('Using last focused element for insertion');
            if (this.insertIntoElement(this.lastFocusedElement, keyword)) {
                return true;
            }
        }
        
        // Try all insertion methods
        const methods = [
            { name: 'Active Element', fn: () => this.insertIntoActiveElement(keyword) },
            { name: 'CodeMirror', fn: () => this.insertIntoCodeMirror(keyword) },
            { name: 'Monaco', fn: () => this.insertIntoMonaco(keyword) },
            { name: 'ACE', fn: () => this.insertIntoAce(keyword) },
            { name: 'ContentEditable', fn: () => this.insertIntoContentEditable(keyword) },
            { name: 'ExecCommand', fn: () => this.insertWithExecCommand(keyword) },
            { name: 'Force Insert', fn: () => this.forceInsertText(keyword) },
            { name: 'Find Text Input', fn: () => this.findAndInsertIntoTextInput(keyword) }
        ];

        for (const method of methods) {
            try {
                console.log(`Trying ${method.name}...`);
                if (method.fn()) {
                    console.log(`Success with ${method.name}`);
                    return true;
                }
            } catch (e) {
                console.log(`${method.name} failed:`, e);
            }
        }

        this.showNotification('Please click in a text area first', 'error');
        console.log('All insertion methods failed');
        return false;
    }

    // New method to insert into a specific element
    insertIntoElement(element, keyword) {
        console.log('Inserting into specific element:', element.tagName, element.type);
        
        // Focus the element first
        element.focus();
        
        if (element.tagName === 'TEXTAREA' || 
            (element.tagName === 'INPUT' && ['text', 'search', 'url', 'email'].includes(element.type))) {
            
            const start = element.selectionStart ?? element.value.length;
            const end = element.selectionEnd ?? element.value.length;
            const value = element.value || '';
            
            const newValue = value.slice(0, start) + keyword + ' ' + value.slice(end);
            element.value = newValue;
            
            const newPos = start + keyword.length + 1;
            element.selectionStart = newPos;
            element.selectionEnd = newPos;
            
            // Trigger events
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            
            return true;
        }
        
        return false;
    }

    // New method to find any text input on the page
    findAndInsertIntoTextInput(keyword) {
        console.log('Searching for text inputs on page...');
        
        // Look for common text input selectors
        const selectors = [
            'textarea',
            'input[type="text"]',
            '[contenteditable="true"]',
            '.CodeMirror textarea',
            '.ace_text-input',
            '.monaco-editor textarea'
        ];
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            console.log(`Found ${elements.length} elements for selector: ${selector}`);
            
            for (const element of elements) {
                // Skip hidden elements
                if (element.offsetParent === null) continue;
                
                // Try to insert into this element
                if (this.insertIntoElement(element, keyword)) {
                    console.log('Successfully inserted into found element:', selector);
                    return true;
                }
            }
        }
        
        return false;
    }

    insertIntoActiveElement(keyword) {
        const active = document.activeElement;
        console.log('Active element:', active, active?.tagName, active?.type);
        
        if (!active) return false;
        
        // Handle textarea and text inputs
        if (active.tagName === 'TEXTAREA' || 
            (active.tagName === 'INPUT' && ['text', 'search', 'url', 'email'].includes(active.type))) {
            
            const start = active.selectionStart ?? active.value.length;
            const end = active.selectionEnd ?? active.value.length;
            const value = active.value || '';
            
            console.log('Inserting into input/textarea:', { start, end, value: value.substring(0, 50) });
            
            const newValue = value.slice(0, start) + keyword + ' ' + value.slice(end);
            active.value = newValue;
            
            const newPos = start + keyword.length + 1;
            active.selectionStart = newPos;
            active.selectionEnd = newPos;
            
            // Trigger events
            active.dispatchEvent(new Event('input', { bubbles: true }));
            active.dispatchEvent(new Event('change', { bubbles: true }));
            active.focus();
            
            return true;
        }
        
        return false;
    }

    insertIntoCodeMirror(keyword) {
        // Method 1: Find CodeMirror instances
        const cms = document.querySelectorAll('.CodeMirror');
        console.log('Found CodeMirror elements:', cms.length);
        
        for (const cm of cms) {
            if (cm.CodeMirror) {
                console.log('Inserting into CodeMirror');
                cm.CodeMirror.replaceSelection(keyword + ' ');
                cm.CodeMirror.focus();
                return true;
            }
        }
        
        // Method 2: Check if there's a global CodeMirror
        if (window.CodeMirror && window.CodeMirror.instances) {
            for (const instance of window.CodeMirror.instances) {
                if (instance) {
                    console.log('Inserting into global CodeMirror instance');
                    instance.replaceSelection(keyword + ' ');
                    instance.focus();
                    return true;
                }
            }
        }
        
        return false;
    }

    insertIntoMonaco(keyword) {
        if (window.monaco && window.monaco.editor) {
            const editors = window.monaco.editor.getEditors();
            if (editors.length > 0) {
                const editor = editors[0];
                const selection = editor.getSelection();
                const range = new window.monaco.Range(
                    selection.startLineNumber,
                    selection.startColumn,
                    selection.endLineNumber,
                    selection.endColumn
                );
                editor.executeEdits('sql-keyboard', [{
                    range: range,
                    text: keyword + ' '
                }]);
                editor.focus();
                return true;
            }
        }
        return false;
    }

    insertIntoAce(keyword) {
        if (window.ace) {
            const aces = document.querySelectorAll('.ace_editor');
            for (const aceEl of aces) {
                try {
                    const editor = window.ace.edit(aceEl);
                    if (editor) {
                        editor.insert(keyword + ' ');
                        editor.focus();
                        return true;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        return false;
    }

    insertIntoContentEditable(keyword) {
        const active = document.activeElement;
        if (!active || !active.isContentEditable) return false;

        try {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const textNode = document.createTextNode(keyword + ' ');
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    }

    insertWithExecCommand(keyword) {
        try {
            console.log('Trying execCommand');
            // Focus on the active element first
            const active = document.activeElement;
            if (active) {
                active.focus();
            }
            
            // Try modern clipboard API first
            if (navigator.clipboard) {
                navigator.clipboard.writeText(keyword + ' ').then(() => {
                    document.execCommand('paste');
                });
                return true;
            }
            
            // Fallback to execCommand
            const result = document.execCommand('insertText', false, keyword + ' ');
            console.log('execCommand result:', result);
            return result;
        } catch (e) {
            console.log('execCommand failed:', e);
            return false;
        }
    }

    // New method: Force insert using various techniques
    forceInsertText(keyword) {
        console.log('Trying force insert methods');
        
        const active = document.activeElement;
        if (!active) return false;
        
        // Method 1: Try setting value directly
        if (active.value !== undefined) {
            const cursorPos = active.selectionStart || active.value.length;
            const value = active.value;
            active.value = value.slice(0, cursorPos) + keyword + ' ' + value.slice(cursorPos);
            
            // Set cursor position
            const newPos = cursorPos + keyword.length + 1;
            active.setSelectionRange(newPos, newPos);
            
            // Trigger all possible events
            ['input', 'change', 'keyup', 'paste'].forEach(eventType => {
                active.dispatchEvent(new Event(eventType, { bubbles: true }));
            });
            
            return true;
        }
        
        // Method 2: Try for contenteditable
        if (active.contentEditable === 'true' || active.isContentEditable) {
            try {
                active.focus();
                
                // Create text node
                const textNode = document.createTextNode(keyword + ' ');
                
                // Insert using Range API
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(textNode);
                    range.setStartAfter(textNode);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    return true;
                } else {
                    // No selection, append to end
                    active.appendChild(textNode);
                    return true;
                }
            } catch (e) {
                console.log('ContentEditable insert failed:', e);
            }
        }
        
        // Method 3: Dispatch keyboard events
        try {
            active.focus();
            
            for (const char of keyword + ' ') {
                const keyEvent = new KeyboardEvent('keydown', {
                    key: char,
                    char: char,
                    bubbles: true
                });
                active.dispatchEvent(keyEvent);
                
                const inputEvent = new InputEvent('input', {
                    data: char,
                    bubbles: true
                });
                active.dispatchEvent(inputEvent);
            }
            return true;
        } catch (e) {
            console.log('Keyboard event simulation failed:', e);
        }
        
        return false;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `sql-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }

    toggleMinimize() {
        this.panel.classList.toggle('minimized');
        const isMinimized = this.panel.classList.contains('minimized');
        this.panel.querySelector('.sql-minimize').textContent = isMinimized ? '+' : '−';
    }

    close() {
        this.panel.remove();
    }
}

// Initialize the extension
new SQLKeyboard();