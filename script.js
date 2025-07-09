class GoremongersTracker {
    constructor() {
        this.defaultOperatives = [
            { name: 'BLOOD HERALD' },
            { name: 'ASPIRANT 1' },
            { name: 'ASPIRANT 2' },
            { name: 'ASPIRANT 3' },
            { name: 'BLOODTAKER' },
            { name: 'IMPALER' },
            { name: 'INCITER' },
            { name: 'SKULLCLAIMER' },
            { name: 'STALKER' },
        ];
        this.operatives = [];
        this.operativeCounter = 0;
        this.init();
    }

    init() {
        this.loadFromStorage();
        if (this.operatives.length === 0) {
            this.initializeDefaultOperatives();
        }
        this.setupEventListeners();
        this.render();
    }

    initializeDefaultOperatives() {
        this.operatives = this.defaultOperatives.map((op, idx) => ({
            id: idx + 1,
            name: op.name,
            tankLevel: 'half',
        }));
        this.operativeCounter = this.operatives.length;
        this.saveToStorage();
    }

    setupEventListeners() {
        document.getElementById('addOperative').addEventListener('click', () => {
            this.addOperative();
        });

        document.getElementById('resetAll').addEventListener('click', () => {
            this.resetAllToHalf();
        });

        document.getElementById('resetToDefault').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset to the default 9 Goremongers? This will remove all custom operatives.')) {
                this.resetToDefault();
            }
        });
    }

    addOperative() {
        const operative = {
            id: ++this.operativeCounter,
            name: `Operative ${this.operativeCounter}`,
            tankLevel: 'half',
        };
        
        this.operatives.push(operative);
        this.saveToStorage();
        this.render();
    }

    removeOperative(id) {
        this.operatives = this.operatives.filter(op => op.id !== id);
        this.saveToStorage();
        this.render();
    }

    updateTankLevel(id, direction) {
        const operative = this.operatives.find(op => op.id === id);
        if (!operative) return;

        const levels = ['empty', 'half', 'full'];
        const currentIndex = levels.indexOf(operative.tankLevel);
        let changed = false;
        if (direction === 'increase' && currentIndex < 2) {
            operative.tankLevel = levels[currentIndex + 1];
            changed = true;
        } else if (direction === 'decrease' && currentIndex > 0) {
            operative.tankLevel = levels[currentIndex - 1];
            changed = true;
        }

        this.saveToStorage();
        this.render();
        if (changed) {
            setTimeout(() => this.animateDrip(id, direction), 50);
        }
    }

    animateDrip(id, direction) {
        const card = document.querySelector(`.operative-card input[data-id="${id}"]`).closest('.operative-card');
        const tankVisual = card.querySelector('.tank-visual');
        if (!tankVisual) return;

        // Remove any existing drip
        const oldDrip = tankVisual.querySelector('.tank-drip');
        if (oldDrip) oldDrip.remove();

        // Create SVG drip
        const drip = document.createElement('div');
        drip.className = 'tank-drip active';
        drip.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="8" cy="6" rx="6" ry="6" fill="#b3001b"/>
                <path d="M8 12 Q7 14 8 16 Q9 14 8 12 Z" fill="#b3001b"/>
            </svg>
        `;
        drip.style.top = direction === 'increase' ? '-16px' : '0px';
        tankVisual.appendChild(drip);

        // Remove after animation
        setTimeout(() => {
            drip.remove();
        }, 700);
    }

    resetAllToHalf() {
        this.operatives.forEach(operative => {
            operative.tankLevel = 'half';
        });
        this.saveToStorage();
        this.render();
    }

    resetToDefault() {
        this.operatives = [];
        this.operativeCounter = 0;
        this.initializeDefaultOperatives();
        this.render();
    }

    updateOperativeName(id, newName) {
        const operative = this.operatives.find(op => op.id === id);
        if (operative) {
            operative.name = newName;
            this.saveToStorage();
        }
    }

    render() {
        const container = document.getElementById('operatives');
        container.innerHTML = '';

        if (this.operatives.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No operatives added yet. Click \"Add Operative\" to start tracking!</p>
                </div>
            `;
            return;
        }

        this.operatives.forEach(operative => {
            const card = this.createOperativeCard(operative);
            container.appendChild(card);
        });
    }

    createOperativeCard(operative) {
        const card = document.createElement('div');
        card.className = 'operative-card';
        
        const canIncrease = operative.tankLevel !== 'full';
        const canDecrease = operative.tankLevel !== 'empty';

        card.innerHTML = `
            <div class="operative-header">
                <input type="text" 
                       class="operative-name" 
                       value="${operative.name}" 
                       data-id="${operative.id}"
                       style="background: transparent; border: none; color: #ff4444; font-size: 1.1rem; font-weight: bold; width: 100%;">
                <button class="remove-operative" onclick="tracker.removeOperative(${operative.id})">×</button>
            </div>
            <div class="tank-display">
                <div class="tank-level ${operative.tankLevel}">${operative.tankLevel.toUpperCase()}</div>
                <div class="tank-visual">
                    <div class="tank-fill ${operative.tankLevel}"></div>
                </div>
            </div>
            <div class="tank-controls">
                <button class="tank-btn increase" 
                        onclick="tracker.updateTankLevel(${operative.id}, 'increase')"
                        ${!canIncrease ? 'disabled' : ''}>
                    Increase
                </button>
                <button class="tank-btn decrease" 
                        onclick="tracker.updateTankLevel(${operative.id}, 'decrease')"
                        ${!canDecrease ? 'disabled' : ''}>
                    Decrease
                </button>
            </div>
        `;

        // Add event listener for name editing
        const nameInput = card.querySelector('.operative-name');
        nameInput.addEventListener('blur', (e) => {
            this.updateOperativeName(operative.id, e.target.value);
        });

        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.target.blur();
            }
        });

        return card;
    }

    saveToStorage() {
        localStorage.setItem('goremongers-tracker', JSON.stringify({
            operatives: this.operatives,
            operativeCounter: this.operativeCounter
        }));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('goremongers-tracker');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.operatives = data.operatives || [];
                this.operativeCounter = data.operativeCounter || 0;
            } catch (e) {
                console.error('Error loading saved data:', e);
                this.operatives = [];
                this.operativeCounter = 0;
            }
        }
    }
}

// Initialize the tracker when the page loads
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new GoremongersTracker();
});

// Add some CSS for the empty state
const style = document.createElement('style');
style.textContent = `
    .empty-state {
        text-align: center;
        padding: 40px;
        background: rgba(40, 40, 40, 0.9);
        border: 2px dashed #8b0000;
        border-radius: 10px;
        color: #cccccc;
        font-size: 1.1rem;
    }
    .operative-name:focus {
        outline: 2px solid #ff4444;
        border-radius: 4px;
        padding: 2px 4px;
    }
`;
document.head.appendChild(style); 