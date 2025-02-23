let credits = 1000;
let currentBet = 10;
let autoSpinInterval = null;

const symbols = [
    { icon: "🍒", weight: 30, payout: 5 },
    { icon: "🍋", weight: 25, payout: 10 },
    { icon: "🔔", weight: 15, payout: 20 },
    { icon: "⭐", weight: 10, payout: 40 },
    { icon: "🍉", weight: 10, payout: 75 },
    { icon: "7️⃣", weight: 5, payout: 150 } // Jackpot
];

// Create a weighted symbol array for randomness
function getRandomSymbol() {
    let weightedPool = [];
    symbols.forEach((symbol) => {
        for (let i = 0; i < symbol.weight; i++) {
            weightedPool.push(symbol);
        }
    });
    return weightedPool[Math.floor(Math.random() * weightedPool.length)];
}

function setBet(amount) {
    currentBet = amount;
    console.log("Bet set to:", currentBet);
    highlightBetButton(amount);
}

function highlightBetButton(amount) {
    document.querySelectorAll('.bet-options button').forEach(button => {
        button.classList.remove('active-bet');
    });
    document.getElementById(`bet${amount}`).classList.add('active-bet');
}

function spin() {
    if (credits < currentBet) {
        document.getElementById("result").textContent = "Not enough credits!";
        return;
    }

    credits -= currentBet;
    document.getElementById("credits").textContent = credits;

    let reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];
    
    // Disable the spin button
    document.getElementById("spinButton").disabled = true;

    // Spin animation: reels cycle random symbols before stopping
    let spins = [10 + Math.floor(Math.random() * 10), 12 + Math.floor(Math.random() * 10), 14 + Math.floor(Math.random() * 10)];
    let finalSymbols = [];

    let spinInterval = setInterval(() => {
        reels.forEach((reel, index) => {
            if (spins[index] > 0) {
                reel.textContent = getRandomSymbol().icon;
                spins[index]--;
            } else if (spins[index] === 0) {
                finalSymbols[index] = getRandomSymbol();
                reel.textContent = finalSymbols[index].icon;
                spins[index] = -1;
            }
        });

        if (spins.every(spin => spin === -1)) {
            clearInterval(spinInterval);
            checkWin(finalSymbols);
            // Enable the spin button
            document.getElementById("spinButton").disabled = false;
        }
    }, 100);
}

function checkWin(finalSymbols) {
    let resultText = "Try again!";
    let payout = 0;

    if (finalSymbols[0].icon === finalSymbols[1].icon && finalSymbols[1].icon === finalSymbols[2].icon) {
        payout = finalSymbols[0].payout * (currentBet / 10);
        resultText = `🎉 You won ${payout} credits! 🎉`;
    }

    credits += payout;
    document.getElementById("credits").textContent = credits;
    document.getElementById("result").textContent = resultText;
}

function toggleAutoSpin() {
    if (autoSpinInterval) {
        clearInterval(autoSpinInterval);
        autoSpinInterval = null;
        document.getElementById("autoSpinButton").textContent = "🔄 Auto-Spin";
    } else {
        autoSpinInterval = setInterval(spin, 2000);
        document.getElementById("autoSpinButton").textContent = "⏹ Stop Auto-Spin";
    }
}

// Highlight the default bet button on page load
document.addEventListener('DOMContentLoaded', () => {
    highlightBetButton(currentBet);
});
