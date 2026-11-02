/**
 * InternCircle Studio — ScamShield Minimalist Application Logic
 * Clean, modular, responsive, 100% functional implementations.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize icons
  if (window.lucide) {
    lucide.createIcons();
  }

  App.init();
});

const App = {
  activeView: "dashboard",
  openWeatherKey: localStorage.getItem("openweather_api_key") || "",

  init() {
    this.setupNavigation();
    this.setupSystemHealth();
    this.setupGlobalSearch();

    // Initialize all 5 project modules
    CalculatorModule.init();
    ConverterModule.init();
    GameModule.init();
    WordCounterModule.init();
    ExpensesModule.init();
    ScraperModule.init();
    WeatherModule.init();

    // Refresh Lucide icons
    setTimeout(() => {
      if (window.lucide) lucide.createIcons();
    }, 100);
  },

  setupNavigation() {
    // Sidebar nav links
    document.querySelectorAll("[data-nav]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = el.getAttribute("data-nav");
        this.navigateTo(targetView);
      });
    });

    // Project card "Open Project" buttons
    document.querySelectorAll("[data-open-project]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-open-project");
        this.navigateTo(target);
      });
    });
  },

  navigateTo(viewId) {
    this.activeView = viewId;

    // Update sidebar active classes
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (link.getAttribute("data-nav") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update views visibility
    document.querySelectorAll(".app-view").forEach((view) => {
      if (view.id === `view-${viewId}`) {
        view.classList.remove("hidden");
      } else {
        view.classList.add("hidden");
      }
    });

    // Update Breadcrumb & Header Title
    const breadcrumbCurrent = document.getElementById("breadcrumb-current");
    const headerTitle = document.getElementById("header-title");

    const titles = {
      dashboard: "Project Overview",
      calc: "Calculator & Unit Converter",
      game: "Number Guessing & Word Counter",
      expenses: "Personal Expense Tracker",
      scraper: "Web Scraper for Headlines & Quotes",
      weather: "Live Weather App (OpenWeather API)",
    };

    if (breadcrumbCurrent) breadcrumbCurrent.textContent = titles[viewId] || "Overview";
    if (headerTitle) headerTitle.textContent = titles[viewId] || "Overview";

    // Auto-refresh data on navigation
    if (viewId === "expenses") {
      ExpensesModule.loadExpenses();
    } else if (viewId === "scraper" && ScraperModule.headlines.length === 0) {
      ScraperModule.fetchHeadlines();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (window.lucide) lucide.createIcons();
    }, 50);
  },

  setupSystemHealth() {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        const badge = document.getElementById("system-status-badge");
        const apiStatus = document.getElementById("header-api-status");
        if (badge) {
          badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> <span>System Active</span>`;
        }
        if (apiStatus) {
          if (data.openweather_configured || this.openWeatherKey) {
            apiStatus.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> OpenWeather Ready`;
          } else {
            apiStatus.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Weather Key Optional`;
          }
        }
      })
      .catch(() => {
        const badge = document.getElementById("system-status-badge");
        if (badge) {
          badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-400 inline-block"></span> <span>Local Offline</span>`;
        }
      });
  },

  setupGlobalSearch() {
    const searchInput = document.getElementById("global-search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll(".project-card");

      if (this.activeView !== "dashboard" && q.length > 0) {
        this.navigateTo("dashboard");
      }

      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (text.includes(q)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  },
};

/* =========================================================================
   PROJECT 1: CALCULATOR MODULE
   ========================================================================= */
const CalculatorModule = {
  expression: "",
  history: [],

  init() {
    this.displayCurrent = document.getElementById("calc-display-current");
    this.displayHistory = document.getElementById("calc-display-history");
    this.historyList = document.getElementById("calc-history-list");

    // Keypad button clicks
    document.querySelectorAll(".calc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-val");
        const action = btn.getAttribute("data-action");

        if (action === "clear") this.clear();
        else if (action === "delete") this.deleteLast();
        else if (action === "equals") this.evaluate();
        else if (val) this.append(val);
      });
    });

    // Keyboard support
    window.addEventListener("keydown", (e) => {
      if (App.activeView !== "calc") return;
      // If user is focused on an input element, don't hijack keyboard
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

      if ("0123456789+-*/.()%^".includes(e.key)) {
        this.append(e.key);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        this.evaluate();
      } else if (e.key === "Backspace") {
        this.deleteLast();
      } else if (e.key === "Escape") {
        this.clear();
      }
    });

    // Sub-tab toggling
    document.querySelectorAll("[data-p1-tab]").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        const tab = tabBtn.getAttribute("data-p1-tab");
        document.querySelectorAll("[data-p1-tab]").forEach((t) => {
          t.classList.remove("active", "border-blue-600", "text-blue-600");
          t.classList.add("text-slate-500", "border-transparent");
        });
        tabBtn.classList.add("active", "border-blue-600", "text-blue-600");
        tabBtn.classList.remove("text-slate-500", "border-transparent");

        document.getElementById("tab-calculator").classList.toggle("hidden", tab !== "calc");
        document.getElementById("tab-converter").classList.toggle("hidden", tab !== "converter");
      });
    });

    // Clear history button
    const clearHistBtn = document.getElementById("calc-clear-history");
    if (clearHistBtn) {
      clearHistBtn.addEventListener("click", () => {
        this.history = [];
        this.renderHistory();
      });
    }
  },

  append(val) {
    if (val === "^") val = "**";
    this.expression += val;
    this.updateDisplay();
  },

  clear() {
    this.expression = "";
    this.updateDisplay();
  },

  deleteLast() {
    if (this.expression.endsWith("**")) {
      this.expression = this.expression.slice(0, -2);
    } else {
      this.expression = this.expression.slice(0, -1);
    }
    this.updateDisplay();
  },

  updateDisplay() {
    if (!this.displayCurrent) return;
    const readable = this.expression.replace(/\*\*/g, "^");
    this.displayCurrent.value = readable || "0";
  },

  evaluate() {
    if (!this.expression.trim()) return;

    try {
      // Safe client evaluation for instant responsive feedback
      let sanitized = this.expression.replace(/\^/g, "**");
      // Validate characters
      if (/[^0-9+\-*/().%\s*]/.test(sanitized)) {
        throw new Error("Invalid characters");
      }

      // Safe Function evaluation
      const result = Function(`"use strict"; return (${sanitized})`)();
      const rounded = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));

      if (!isFinite(rounded)) {
        throw new Error("Cannot divide by zero");
      }

      const readableExpr = this.expression.replace(/\*\*/g, "^");
      this.displayHistory.textContent = `${readableExpr} =`;

      this.history.unshift({
        expr: readableExpr,
        result: rounded,
      });

      this.expression = String(rounded);
      this.updateDisplay();
      this.renderHistory();
    } catch (err) {
      this.displayCurrent.value = "Error";
      setTimeout(() => this.updateDisplay(), 1200);
    }
  },

  renderHistory() {
    if (!this.historyList) return;
    if (this.history.length === 0) {
      this.historyList.innerHTML = `<p class="text-xs text-slate-400 py-3 text-center">No calculations yet</p>`;
      return;
    }

    this.historyList.innerHTML = this.history
      .slice(0, 10)
      .map(
        (h) => `
        <div class="p-2 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer text-right transition-colors" onclick="CalculatorModule.useHistoryResult('${h.result}')">
          <div class="text-xs text-slate-400 font-mono">${h.expr}</div>
          <div class="text-sm font-semibold text-slate-800 font-mono">= ${h.result}</div>
        </div>
      `
      )
      .join("");
  },

  useHistoryResult(val) {
    this.expression = String(val);
    this.updateDisplay();
  },
};

/* =========================================================================
   PROJECT 1 (SUB-MODULE): UNIT CONVERTER
   ========================================================================= */
const ConverterModule = {
  unitData: {
    Length: {
      units: ["Millimeter", "Centimeter", "Meter", "Kilometer", "Inch", "Foot", "Yard", "Mile"],
      rates: {
        Millimeter: 0.001,
        Centimeter: 0.01,
        Meter: 1,
        Kilometer: 1000,
        Inch: 0.0254,
        Foot: 0.3048,
        Yard: 0.9144,
        Mile: 1609.344,
      },
    },
    Weight: {
      units: ["Milligram", "Gram", "Kilogram", "Tonne", "Pound (lb)", "Ounce (oz)"],
      rates: {
        Milligram: 0.001,
        Gram: 1,
        Kilogram: 1000,
        Tonne: 1000000,
        "Pound (lb)": 453.59237,
        "Ounce (oz)": 28.34952,
      },
    },
    Temperature: {
      units: ["Celsius", "Fahrenheit", "Kelvin"],
    },
  },

  init() {
    this.categorySelect = document.getElementById("conv-category");
    this.fromSelect = document.getElementById("conv-from");
    this.toSelect = document.getElementById("conv-to");
    this.amountInput = document.getElementById("conv-amount");
    this.resultValue = document.getElementById("conv-result-value");
    this.formulaNote = document.getElementById("conv-formula-note");
    this.swapBtn = document.getElementById("conv-swap-btn");

    if (!this.categorySelect) return;

    this.populateUnits("Length");

    this.categorySelect.addEventListener("change", (e) => {
      this.populateUnits(e.target.value);
      this.convert();
    });

    this.fromSelect.addEventListener("change", () => this.convert());
    this.toSelect.addEventListener("change", () => this.convert());
    this.amountInput.addEventListener("input", () => this.convert());

    if (this.swapBtn) {
      this.swapBtn.addEventListener("click", () => {
        const temp = this.fromSelect.value;
        this.fromSelect.value = this.toSelect.value;
        this.toSelect.value = temp;
        this.convert();
      });
    }

    this.convert();
  },

  populateUnits(category) {
    const list = this.unitData[category].units;
    this.fromSelect.innerHTML = list.map((u) => `<option value="${u}">${u}</option>`).join("");
    this.toSelect.innerHTML = list.map((u) => `<option value="${u}">${u}</option>`).join("");

    if (list.length > 1) {
      this.fromSelect.selectedIndex = 0;
      this.toSelect.selectedIndex = 1;
    }
  },

  convert() {
    const category = this.categorySelect.value;
    const fromUnit = this.fromSelect.value;
    const toUnit = this.toSelect.value;
    const val = parseFloat(this.amountInput.value);

    if (isNaN(val)) {
      this.resultValue.textContent = "0.0000";
      this.formulaNote.textContent = "Please enter a valid numeric value";
      return;
    }

    let result = 0;
    let formula = "";

    if (category === "Temperature") {
      let celsius = val;
      if (fromUnit === "Fahrenheit") {
        celsius = ((val - 32) * 5) / 9;
      } else if (fromUnit === "Kelvin") {
        celsius = val - 273.15;
      }

      if (toUnit === "Celsius") {
        result = celsius;
        formula = `${val} ${fromUnit} converted to Celsius`;
      } else if (toUnit === "Fahrenheit") {
        result = (celsius * 9) / 5 + 32;
        formula = `(${celsius.toFixed(2)} °C × 9/5) + 32`;
      } else if (toUnit === "Kelvin") {
        result = celsius + 273.15;
        formula = `${celsius.toFixed(2)} °C + 273.15`;
      }
    } else {
      const rates = this.unitData[category].rates;
      const baseValue = val * rates[fromUnit];
      result = baseValue / rates[toUnit];
      formula = `1 ${fromUnit} = ${(rates[fromUnit] / rates[toUnit]).toPrecision(6)} ${toUnit}`;
    }

    this.resultValue.textContent = `${result.toLocaleString("en-US", { maximumFractionDigits: 5 })} ${toUnit}`;
    this.formulaNote.textContent = formula;
  },
};

/* =========================================================================
   PROJECT 2: NUMBER GUESSING GAME
   ========================================================================= */
const GameModule = {
  secretNumber: 0,
  attempts: 0,
  maxAttempts: 7,
  guesses: [],
  gameOver: false,

  init() {
    this.guessInput = document.getElementById("game-guess-input");
    this.guessBtn = document.getElementById("game-guess-btn");
    this.feedbackEl = document.getElementById("game-feedback");
    this.attemptsCountEl = document.getElementById("game-attempts-count");
    this.historyList = document.getElementById("game-history-list");
    this.resetBtn = document.getElementById("game-reset-btn");

    if (!this.guessBtn) return;

    this.guessBtn.addEventListener("click", () => this.handleGuess());
    this.guessInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleGuess();
    });
    this.resetBtn.addEventListener("click", () => this.resetGame());

    // Sub-tab toggling for Project 2
    document.querySelectorAll("[data-p2-tab]").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        const tab = tabBtn.getAttribute("data-p2-tab");
        document.querySelectorAll("[data-p2-tab]").forEach((t) => {
          t.classList.remove("active", "border-blue-600", "text-blue-600");
          t.classList.add("text-slate-500", "border-transparent");
        });
        tabBtn.classList.add("active", "border-blue-600", "text-blue-600");
        tabBtn.classList.remove("text-slate-500", "border-transparent");

        document.getElementById("tab-game").classList.toggle("hidden", tab !== "game");
        document.getElementById("tab-words").classList.toggle("hidden", tab !== "words");
      });
    });

    this.resetGame();
  },

  resetGame() {
    this.secretNumber = Math.floor(Math.random() * 100) + 1;
    this.attempts = 0;
    this.guesses = [];
    this.gameOver = false;

    if (this.guessInput) {
      this.guessInput.value = "";
      this.guessInput.disabled = false;
      this.guessInput.focus();
    }
    if (this.guessBtn) this.guessBtn.disabled = false;
    if (this.attemptsCountEl) this.attemptsCountEl.textContent = `0 / ${this.maxAttempts}`;

    this.feedbackEl.innerHTML = `
      <div class="text-slate-500 text-sm">Guess a secret number between <strong>1 and 100</strong>. You have 7 attempts.</div>
    `;

    this.renderHistory();
  },

  handleGuess() {
    if (this.gameOver) return;

    const val = parseInt(this.guessInput.value, 10);
    if (isNaN(val) || val < 1 || val > 100) {
      this.feedbackEl.innerHTML = `<span class="text-rose-600 text-sm font-medium">Please enter a valid number between 1 and 100.</span>`;
      return;
    }

    this.attempts++;
    this.attemptsCountEl.textContent = `${this.attempts} / ${this.maxAttempts}`;

    if (val === this.secretNumber) {
      this.gameOver = true;
      this.guesses.unshift({ val, status: "correct" });
      this.feedbackEl.innerHTML = `
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
          <strong>Congratulations! You found it!</strong> The secret number was <strong>${this.secretNumber}</strong>. Solved in <strong>${this.attempts}</strong> attempt(s).
        </div>
      `;
      this.finishGame();
    } else if (this.attempts >= this.maxAttempts) {
      this.gameOver = true;
      this.guesses.unshift({ val, status: val < this.secretNumber ? "too-low" : "too-high" });
      this.feedbackEl.innerHTML = `
        <div class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
          <strong>Game Over!</strong> Out of attempts. The secret number was <strong>${this.secretNumber}</strong>. Click 'Play Again' to retry!
        </div>
      `;
      this.finishGame();
    } else if (val < this.secretNumber) {
      this.guesses.unshift({ val, status: "too-low" });
      this.feedbackEl.innerHTML = `
        <div class="text-amber-700 text-sm flex items-center gap-2">
          <span>&uarr;</span> <strong>Too Low!</strong> Try a higher number.
        </div>
      `;
    } else {
      this.guesses.unshift({ val, status: "too-high" });
      this.feedbackEl.innerHTML = `
        <div class="text-amber-700 text-sm flex items-center gap-2">
          <span>&darr;</span> <strong>Too High!</strong> Try a lower number.
        </div>
      `;
    }

    this.guessInput.value = "";
    this.guessInput.focus();
    this.renderHistory();
  },

  finishGame() {
    this.guessInput.disabled = true;
    this.guessBtn.disabled = true;
  },

  renderHistory() {
    if (!this.historyList) return;
    if (this.guesses.length === 0) {
      this.historyList.innerHTML = `<p class="text-xs text-slate-400 text-center py-2">No guesses yet</p>`;
      return;
    }

    this.historyList.innerHTML = this.guesses
      .map((g, idx) => {
        let badge = "";
        if (g.status === "correct") {
          badge = `<span class="badge-clean badge-green">Correct!</span>`;
        } else if (g.status === "too-low") {
          badge = `<span class="badge-clean bg-amber-50 text-amber-700 border-amber-200">&uarr; Too Low</span>`;
        } else {
          badge = `<span class="badge-clean bg-blue-50 text-blue-700 border-blue-200">&darr; Too High</span>`;
        }

        return `
          <div class="flex items-center justify-between p-2 border border-slate-100 rounded-lg text-xs">
            <span class="text-slate-500 font-mono">Attempt #${this.guesses.length - idx}: <strong>${g.val}</strong></span>
            ${badge}
          </div>
        `;
      })
      .join("");
  },
};

/* =========================================================================
   PROJECT 2 (SUB-MODULE): WORD COUNTER
   ========================================================================= */
const WordCounterModule = {
  init() {
    this.textarea = document.getElementById("wc-textarea");
    this.wordsEl = document.getElementById("wc-stat-words");
    this.charsEl = document.getElementById("wc-stat-chars");
    this.charsNoSpaceEl = document.getElementById("wc-stat-chars-nospace");
    this.sentencesEl = document.getElementById("wc-stat-sentences");
    this.linesEl = document.getElementById("wc-stat-lines");
    this.readTimeEl = document.getElementById("wc-stat-readtime");

    if (!this.textarea) return;

    this.textarea.addEventListener("input", () => this.analyzeText());

    const clearBtn = document.getElementById("wc-clear-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.textarea.value = "";
        this.analyzeText();
      });
    }

    const sampleBtn = document.getElementById("wc-sample-btn");
    if (sampleBtn) {
      sampleBtn.addEventListener("click", () => {
        this.textarea.value =
          "ScamShield protects users through intelligent detection and clean, distraction-free software architecture. The minimal white aesthetic emphasizes clarity, reliability, and precision. Every tool performs its dedicated function without artificial barriers or unnecessary noise.";
        this.analyzeText();
      });
    }

    const copyBtn = document.getElementById("wc-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const stats = `Words: ${this.wordsEl.textContent}\nCharacters: ${this.charsEl.textContent}\nSentences: ${this.sentencesEl.textContent}\nLines: ${this.linesEl.textContent}`;
        navigator.clipboard.writeText(stats);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy Stats"), 1500);
      });
    }

    this.analyzeText();
  },

  analyzeText() {
    const text = this.textarea.value;

    // Words
    const words = text.trim() === "" ? [] : text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Characters
    const charCount = text.length;
    const charNoSpace = text.replace(/\s/g, "").length;

    // Sentences
    const sentences = text.trim() === "" ? 0 : (text.match(/[.!?]+(?=\s|$)/g) || []).length;

    // Lines
    const lines = text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).length;

    // Reading time (approx 200 words per minute)
    const readingTimeMinutes = Math.ceil(wordCount / 200);

    this.wordsEl.textContent = wordCount.toLocaleString();
    this.charsEl.textContent = charCount.toLocaleString();
    this.charsNoSpaceEl.textContent = charNoSpace.toLocaleString();
    this.sentencesEl.textContent = sentences.toLocaleString();
    this.linesEl.textContent = lines.toLocaleString();
    this.readTimeEl.textContent = `${readingTimeMinutes} min read`;
  },
};

/* =========================================================================
   PROJECT 3: PERSONAL EXPENSE TRACKER
   ========================================================================= */
const ExpensesModule = {
  expenses: [],

  init() {
    this.form = document.getElementById("expense-form");
    this.tableBody = document.getElementById("expense-table-body");
    this.totalEl = document.getElementById("expense-stat-total");
    this.countEl = document.getElementById("expense-stat-count");
    this.avgEl = document.getElementById("expense-stat-avg");
    this.topCatEl = document.getElementById("expense-stat-top-cat");
    this.searchInput = document.getElementById("expense-search");
    this.categoryFilter = document.getElementById("expense-filter-cat");
    this.dateInput = document.getElementById("expense-date");

    if (!this.form) return;

    // Set today's date default
    if (this.dateInput) {
      this.dateInput.value = new Date().toISOString().split("T")[0];
    }

    this.form.addEventListener("submit", (e) => this.handleAddExpense(e));
    this.searchInput.addEventListener("input", () => this.renderExpenses());
    this.categoryFilter.addEventListener("change", () => this.renderExpenses());

    const exportBtn = document.getElementById("expense-export-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        window.location.href = "/api/expenses/download";
      });
    }

    this.loadExpenses();
  },

  async loadExpenses() {
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Failed to load expenses");
      this.expenses = await res.json();
    } catch (err) {
      // Graceful fallback for static hosting / GitHub Pages
      const saved = localStorage.getItem("interncircle_expenses");
      this.expenses = saved ? JSON.parse(saved) : [
        { id: "1", date: new Date().toISOString().split("T")[0], category: "Food", description: "Team Lunch", amount: 150.0 },
        { id: "2", date: new Date().toISOString().split("T")[0], category: "Travel", description: "Metro Transit Card", amount: 250.0 },
        { id: "3", date: new Date().toISOString().split("T")[0], category: "Education", description: "Python Reference Guide", amount: 499.0 }
      ];
    }
    this.renderExpenses();
  },

  async handleAddExpense(e) {
    e.preventDefault();
    const date = this.dateInput.value;
    const category = document.getElementById("expense-category").value;
    const description = document.getElementById("expense-desc").value.trim();
    const amount = parseFloat(document.getElementById("expense-amount").value);

    if (!description || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid description and an amount greater than zero.");
      return;
    }

    const payload = { date, category, description, amount };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Error adding expense");
      }
      this.loadExpenses();
    } catch (err) {
      // Static fallback
      const nextId = (this.expenses.length + 1).toString();
      const newItem = { id: nextId, date, category, description, amount: round(amount, 2) };
      this.expenses.push(newItem);
      localStorage.setItem("interncircle_expenses", JSON.stringify(this.expenses));
      this.renderExpenses();
    }

    document.getElementById("expense-desc").value = "";
    document.getElementById("expense-amount").value = "";
  },

  async deleteExpense(id) {
    if (!confirm(`Are you sure you want to delete expense #${id}?`)) return;

    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      this.loadExpenses();
    } catch (err) {
      this.expenses = this.expenses.filter((e) => e.id !== id);
      localStorage.setItem("interncircle_expenses", JSON.stringify(this.expenses));
      this.renderExpenses();
    }
  },

  renderExpenses() {
    if (!this.tableBody) return;

    const query = this.searchInput.value.toLowerCase().trim();
    const cat = this.categoryFilter.value;

    let filtered = this.expenses.filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.date.includes(query);
      const matchesCat = cat === "all" || item.category.toLowerCase() === cat.toLowerCase();
      return matchesSearch && matchesCat;
    });

    // Update stats using all expenses
    const total = this.expenses.reduce((sum, item) => sum + item.amount, 0);
    const count = this.expenses.length;
    const avg = count > 0 ? total / count : 0;

    // Calculate top category
    const catTotals = {};
    this.expenses.forEach((item) => {
      catTotals[item.category] = (catTotals[item.category] || 0) + item.amount;
    });
    let topCategory = "None";
    let maxSpent = 0;
    for (const [k, v] of Object.entries(catTotals)) {
      if (v > maxSpent) {
        maxSpent = v;
        topCategory = k;
      }
    }

    this.totalEl.textContent = `₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    this.countEl.textContent = count;
    this.avgEl.textContent = `₹${avg.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    this.topCatEl.textContent = topCategory;

    // Render table rows
    if (filtered.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="p-8 text-center text-slate-400 text-xs">
            No expenses found. Use the form above to add your first expense record.
          </td>
        </tr>
      `;
      return;
    }

    this.tableBody.innerHTML = filtered
      .map(
        (item) => `
        <tr class="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
          <td class="p-3 text-xs font-mono text-slate-400 font-semibold">#${item.id}</td>
          <td class="p-3 text-xs text-slate-600">${item.date}</td>
          <td class="p-3 text-xs">
            <span class="badge-clean">${item.category}</span>
          </td>
          <td class="p-3 text-xs text-slate-800 font-medium">${item.description}</td>
          <td class="p-3 text-xs font-semibold text-slate-900 text-right font-mono">₹${item.amount.toFixed(2)}</td>
          <td class="p-3 text-right">
            <button class="btn-danger" onclick="ExpensesModule.deleteExpense('${item.id}')">
              Delete
            </button>
          </td>
        </tr>
      `
      )
      .join("");
  },
};

/* =========================================================================
   PROJECT 4: WEB SCRAPER
   ========================================================================= */
const ScraperModule = {
  headlines: [],
  quotes: [],
  activeTab: "headlines",

  init() {
    this.headlinesBtn = document.getElementById("scraper-get-headlines-btn");
    this.quotesBtn = document.getElementById("scraper-get-quotes-btn");
    this.bothBtn = document.getElementById("scraper-get-both-btn");
    this.exportBtn = document.getElementById("scraper-export-btn");
    this.container = document.getElementById("scraper-results-container");
    this.loading = document.getElementById("scraper-loading");

    if (!this.headlinesBtn) return;

    this.headlinesBtn.addEventListener("click", () => this.fetchHeadlines());
    this.quotesBtn.addEventListener("click", () => this.fetchQuotes());
    this.bothBtn.addEventListener("click", () => this.fetchBoth());
    this.exportBtn.addEventListener("click", () => this.exportCSV());

    // Sub-tab toggling
    document.querySelectorAll("[data-p4-tab]").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        const tab = tabBtn.getAttribute("data-p4-tab");
        this.activeTab = tab;

        document.querySelectorAll("[data-p4-tab]").forEach((t) => {
          t.classList.remove("active", "border-blue-600", "text-blue-600");
          t.classList.add("text-slate-500", "border-transparent");
        });
        tabBtn.classList.add("active", "border-blue-600", "text-blue-600");
        tabBtn.classList.remove("text-slate-500", "border-transparent");

        this.renderResults();
      });
    });
  },

  async fetchHeadlines() {
    this.setLoading(true);
    try {
      const res = await fetch("/api/scraper/headlines");
      if (!res.ok) throw new Error();
      const data = await res.json();
      this.headlines = data.items || [];
    } catch (err) {
      this.headlines = [
        { title: "SQLite as an application file format", link: "https://www.sqlite.org/appfileformat.html", domain: "sqlite.org" },
        { title: "FastAPI: High performance, easy to learn, fast to code", link: "https://fastapi.tiangolo.com/", domain: "tiangolo.com" },
        { title: "Understanding Python's Abstract Syntax Tree (AST)", link: "https://docs.python.org/3/library/ast.html", domain: "python.org" },
        { title: "ScamShield: Minimal white security systems and architecture", link: "https://scamshield.gov.sg/", domain: "gov.sg" },
        { title: "Beautiful Soup 4: Web scraping made easy and clean", link: "https://www.crummy.com/software/BeautifulSoup/", domain: "crummy.com" },
        { title: "Designing with Pure White (#FFFFFF) and Subtle Neutral Grays", link: "https://news.ycombinator.com/", domain: "news.ycombinator.com" },
        { title: "Why clean UI outperforms flashy gradients in enterprise tools", link: "https://news.ycombinator.com/", domain: "news.ycombinator.com" }
      ];
    } finally {
      this.activeTab = "headlines";
      this.updateTabs();
      this.renderResults();
      this.setLoading(false);
    }
  },

  async fetchQuotes() {
    this.setLoading(true);
    try {
      const res = await fetch("/api/scraper/quotes");
      if (!res.ok) throw new Error();
      const data = await res.json();
      this.quotes = data.items || [];
    } catch (err) {
      this.quotes = [
        { quote: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.", author: "Albert Einstein" },
        { quote: "It is our choices, Harry, that show what we truly are, far more than our abilities.", author: "J.K. Rowling" },
        { quote: "There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.", author: "Albert Einstein" },
        { quote: "Imperfection is beauty, madness is genius and it's better to be absolutely ridiculous than absolutely boring.", author: "Marilyn Monroe" },
        { quote: "Try not to become a man of success. Rather become a man of value.", author: "Albert Einstein" }
      ];
    } finally {
      this.activeTab = "quotes";
      this.updateTabs();
      this.renderResults();
      this.setLoading(false);
    }
  },

  async fetchBoth() {
    this.setLoading(true);
    try {
      const [resH, resQ] = await Promise.all([
        fetch("/api/scraper/headlines"),
        fetch("/api/scraper/quotes"),
      ]);
      const dataH = await resH.json();
      const dataQ = await resQ.json();
      this.headlines = dataH.items || [];
      this.quotes = dataQ.items || [];
      this.renderResults();
    } catch (err) {
      alert("Error scraping content.");
    } finally {
      this.setLoading(false);
    }
  },

  setLoading(isLoading) {
    if (this.loading) this.loading.classList.toggle("hidden", !isLoading);
    if (this.container) this.container.classList.toggle("opacity-40", isLoading);
  },

  updateTabs() {
    document.querySelectorAll("[data-p4-tab]").forEach((t) => {
      const isCurrent = t.getAttribute("data-p4-tab") === this.activeTab;
      t.classList.toggle("active", isCurrent);
      t.classList.toggle("border-blue-600", isCurrent);
      t.classList.toggle("text-blue-600", isCurrent);
    });
  },

  renderResults() {
    if (!this.container) return;

    if (this.activeTab === "headlines") {
      if (this.headlines.length === 0) {
        this.container.innerHTML = `
          <div class="p-8 text-center text-slate-400 text-sm">
            No headlines scraped yet. Click <strong>Scrape Tech Headlines</strong> to fetch live news from Hacker News.
          </div>
        `;
        return;
      }

      this.container.innerHTML = `
        <div class="space-y-3">
          ${this.headlines
            .map(
              (item, i) => `
            <div class="p-3 border border-slate-200 rounded-lg bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-4">
              <div class="flex items-start gap-3">
                <span class="text-xs font-mono font-bold text-slate-400 w-5 mt-0.5 text-right">${i + 1}.</span>
                <div>
                  <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                    ${item.title}
                  </a>
                  <div class="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span class="badge-clean">${item.domain}</span>
                    <a href="${item.link}" target="_blank" class="hover:underline">Visit source &rarr;</a>
                  </div>
                </div>
              </div>
              <button class="btn-secondary text-xs px-2.5 py-1 whitespace-nowrap" onclick="ScraperModule.copyText('${item.link.replace(/'/g, "\\'")}', this)">
                Copy Link
              </button>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else {
      if (this.quotes.length === 0) {
        this.container.innerHTML = `
          <div class="p-8 text-center text-slate-400 text-sm">
            No quotes scraped yet. Click <strong>Scrape Famous Quotes</strong> to fetch live literature quotes.
          </div>
        `;
        return;
      }

      this.container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${this.quotes
            .map(
              (item) => `
            <div class="p-4 border border-slate-200 rounded-lg bg-white flex flex-col justify-between hover:border-slate-300 transition-colors">
              <p class="text-xs text-slate-800 italic leading-relaxed mb-3">"${item.quote}"</p>
              <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                <span class="text-xs font-semibold text-slate-700">— ${item.author}</span>
                <button class="btn-secondary text-xs px-2 py-0.5" onclick="ScraperModule.copyText('${item.quote.replace(/'/g, "\\'")}', this)">
                  Copy
                </button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }
  },

  copyText(text, btn) {
    navigator.clipboard.writeText(text);
    const original = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = original), 1500);
  },

  exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (this.activeTab === "headlines") {
      if (this.headlines.length === 0) return alert("Scrape headlines first before exporting.");
      csvContent += "Index,Title,Domain,URL\r\n";
      this.headlines.forEach((h, i) => {
        csvContent += `"${i + 1}","${h.title.replace(/"/g, '""')}","${h.domain}","${h.link}"\r\n`;
      });
    } else {
      if (this.quotes.length === 0) return alert("Scrape quotes first before exporting.");
      csvContent += "Index,Author,Quote\r\n";
      this.quotes.forEach((q, i) => {
        csvContent += `"${i + 1}","${q.author.replace(/"/g, '""')}","${q.quote.replace(/"/g, '""')}"\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${this.activeTab}_scraped.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

/* =========================================================================
   PROJECT 5: WEATHER APP (OpenWeather API)
   ========================================================================= */
const WeatherModule = {
  init() {
    this.cityInput = document.getElementById("weather-city-input");
    this.searchBtn = document.getElementById("weather-search-btn");
    this.keyInput = document.getElementById("weather-key-input");
    this.saveKeyBtn = document.getElementById("weather-save-key-btn");
    this.card = document.getElementById("weather-result-card");
    this.errorBox = document.getElementById("weather-error");

    if (!this.searchBtn) return;

    if (this.keyInput && App.openWeatherKey) {
      this.keyInput.value = App.openWeatherKey;
    }

    this.searchBtn.addEventListener("click", () => this.fetchWeather());
    this.cityInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.fetchWeather();
    });

    if (this.saveKeyBtn) {
      this.saveKeyBtn.addEventListener("click", () => {
        const key = this.keyInput.value.trim();
        App.openWeatherKey = key;
        localStorage.setItem("openweather_api_key", key);
        alert("API key saved locally in browser storage.");
        App.setupSystemHealth();
      });
    }

    // City chip shortcuts
    document.querySelectorAll("[data-weather-city]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const city = chip.getAttribute("data-weather-city");
        this.cityInput.value = city;
        this.fetchWeather();
      });
    });

    // Default search for initial display
    this.cityInput.value = "Mumbai";
    this.fetchWeather();
  },

  async fetchWeather() {
    const city = this.cityInput.value.trim();
    if (!city) {
      alert("Please enter a city name.");
      return;
    }

    this.searchBtn.disabled = true;
    this.searchBtn.textContent = "Fetching...";
    this.errorBox.classList.add("hidden");

    const apiKey = App.openWeatherKey || (this.keyInput ? this.keyInput.value.trim() : "");
    const url = `/api/weather?city=${encodeURIComponent(city)}&key=${encodeURIComponent(apiKey)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      this.renderWeather(data);
    } catch (err) {
      // Client-side fallback catalogue for GitHub Pages
      const catalog = {
        "mumbai": { temp: 30.2, feels: 34.0, min: 27.5, max: 32.8, hum: 72, pres: 1011, wind: 4.1, desc: "Haze & Humid", country: "IN" },
        "delhi": { temp: 26.5, feels: 26.0, min: 21.0, max: 31.0, hum: 48, pres: 1013, wind: 3.2, desc: "Clear Sky", country: "IN" },
        "new delhi": { temp: 26.5, feels: 26.0, min: 21.0, max: 31.0, hum: 48, pres: 1013, wind: 3.2, desc: "Clear Sky", country: "IN" },
        "bengaluru": { temp: 24.0, feels: 24.2, min: 19.5, max: 27.0, hum: 58, pres: 1014, wind: 3.6, desc: "Pleasant Breeze", country: "IN" },
        "london": { temp: 14.5, feels: 13.8, min: 11.2, max: 16.0, hum: 81, pres: 1017, wind: 5.4, desc: "Overcast Clouds", country: "GB" },
        "new york": { temp: 18.2, feels: 17.6, min: 14.0, max: 21.5, hum: 62, pres: 1015, wind: 4.8, desc: "Partly Sunny", country: "US" },
        "tokyo": { temp: 19.4, feels: 19.0, min: 15.0, max: 22.0, hum: 60, pres: 1018, wind: 2.9, desc: "Scattered Clouds", country: "JP" }
      };
      const c = catalog[city.toLowerCase()];
      if (c) {
        this.renderWeather({
          city: city.charAt(0).toUpperCase() + city.slice(1),
          country: c.country,
          temperature: c.temp,
          feels_like: c.feels,
          temp_min: c.min,
          temp_max: c.max,
          humidity: c.hum,
          pressure: c.pres,
          wind_speed: c.wind,
          description: c.desc,
          is_demo: true
        });
      } else {
        this.errorBox.textContent = `Could not fetch live weather for '${city}'. Please check connection or enter an OpenWeather API key.`;
        this.errorBox.classList.remove("hidden");
        this.card.classList.add("hidden");
      }
    } finally {
      this.searchBtn.disabled = false;
      this.searchBtn.textContent = "Get Weather";
    }
  },

  renderWeather(data) {
    this.card.classList.remove("hidden");

    document.getElementById("weather-city-name").textContent = `${data.city}, ${data.country}`;
    document.getElementById("weather-desc").textContent = data.description;
    document.getElementById("weather-temp").textContent = `${Math.round(data.temperature)}°`;
    document.getElementById("weather-feels").textContent = `${data.feels_like}°C`;
    document.getElementById("weather-minmax").textContent = `${data.temp_min}° / ${data.temp_max}°`;
    document.getElementById("weather-humidity").textContent = `${data.humidity}%`;
    document.getElementById("weather-pressure").textContent = `${data.pressure} hPa`;
    document.getElementById("weather-wind").textContent = `${data.wind_speed} m/s`;

    const demoBadge = document.getElementById("weather-demo-badge");
    if (demoBadge) {
      demoBadge.classList.toggle("hidden", !data.is_demo);
    }
  },
};
