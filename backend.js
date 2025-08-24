// BUZZ KILL JavaScript App
class BuzzKillApp {
    constructor() {
        this.currentScreen = 'home';
        this.batteryPercentage = 61;
        this.isCharging = false;
        this.isPlugged = false;

        // Settings
        this.settings = {
            alertsEnabled: true,
            funSounds: false,
            lowBatteryThreshold: 30,
            criticalBatteryThreshold: 10
        };

        // 🔊 Alarm audio -ALONA 
        this.alarmAudio = new Audio("alarm.mp3"); // put alarm.mp3 in your project folder
        this.alarmAudio.loop = true;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateBatteryDisplay();
        this.startBatterySimulation();
        this.updateSettingsDisplay();
    }

    setupEventListeners() {
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const screen = e.target.dataset.screen;
                this.navigateToScreen(screen);
            });
        });

        document.getElementById('settings-shortcut').addEventListener('click', () => {
            this.navigateToScreen('settings');
        });

        document.getElementById('plug-button').addEventListener('click', () => {
            this.togglePlugged();
        });

        document.getElementById('charge-button').addEventListener('click', () => {
            this.toggleCharging();
        });

        const toggles = document.querySelectorAll('.toggle-switch');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const setting = e.target.dataset.setting;
                if (setting) {
                    this.toggleSetting(setting);
                }
            });
        });

        document.getElementById('low-threshold').addEventListener('input', (e) => {
            this.updateThreshold('lowBatteryThreshold', parseInt(e.target.value));
        });

        document.getElementById('critical-threshold').addEventListener('input', (e) => {
            this.updateThreshold('criticalBatteryThreshold', parseInt(e.target.value));
        });
    }

    navigateToScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) targetScreen.classList.add('active');

        document.querySelectorAll('.nav-button').forEach(button => {
            button.classList.remove('active');
            if (button.dataset.screen === screenName) button.classList.add('active');
        });

        this.currentScreen = screenName;
    }
   // ROSE MARY
    togglePlugged() {
        this.isPlugged = !this.isPlugged;
        const plugButton = document.getElementById('plug-button');
        const chargeButton = document.getElementById('charge-button');

        plugButton.textContent = this.isPlugged ? 'Unplug' : 'Plug In';
        chargeButton.disabled = !this.isPlugged;

        if (!this.isPlugged) {
            this.isCharging = false;
            chargeButton.textContent = 'Start Charging';
            this.stopAlarm();
        } else {
            // 🚨 When plugged but not charging → show reminder & alarm
            this.showReminder("⚠️ Plugged in but switch is OFF. Please turn it ON!");
            this.startAlarm();
        }

        this.updateBatteryDisplay();
        this.updateQuickStatus();
    }

    toggleCharging() {
        if (!this.isPlugged) return;

        this.isCharging = !this.isCharging;
        const chargeButton = document.getElementById('charge-button');
        chargeButton.textContent = this.isCharging ? 'Stop Charging' : 'Start Charging';

        if (this.isCharging) {
            this.stopAlarm(); // ✅ stop alarm when charging starts
        } else {
            this.startAlarm(); // 🚨 restart alarm if charging stopped but still plugged
            this.showReminder("⚠️ Plugged in but not charging!");
        }

        this.updateBatteryDisplay();
        this.updateQuickStatus();
    }
  //ALONA
    startAlarm() {
        try {
            this.alarmAudio.play();
        } catch (e) {
            console.log("⚠️ User interaction required before playing audio");
        }
    }

    stopAlarm() {
        this.alarmAudio.pause();
        this.alarmAudio.currentTime = 0;
    }

    showReminder(message) {
        showNotification(message, "warning");
    }

    // ... (rest of your updateBatteryDisplay, updateQuickStatus, etc. stay the same)
    // (keep your existing updateBatteryDisplay, getBatteryColors, updateQuickStatus, updateSettingsDisplay, startBatterySimulation)
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new BuzzKillApp();
});
  //ANGELINA
// Existing notification popup system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid ${type === 'error' ? '#ff0040' : type === 'warning' ? '#ff8000' : '#00ffff'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        font-family: 'Iceberg', sans-serif;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);