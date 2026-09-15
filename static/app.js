/**
 * Renault Megane Workshop Service Manual RAG Application Frontend
 * Features:
 * - Multi-turn Conversation Context (retains context across messages)
 * - Save & Load Chat Sessions (Local & Backend storage)
 * - Export Chat to Markdown (.md)
 * - Multimodal Diagrams & Interactive PDF Page Viewer
 * - BiDi Isolation & Arabic Query Understanding
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // State
  let isIndexed = false;
  let isGenerating = false;
  let searchOnlyMode = false;
  let currentCitations = [];
  let conversationHistory = [];
  let currentChatId = null;

  // Active Vehicle Profile State
  let vehicleProfile = {
    engine: "K4M",
    capacity: "1.6L (1598cc)",
    gearbox: "JB3",
    phase: "Phase 2 (1999-2002)",
    fuel: "Petrol Multipoint Injection (Sirius 32)",
    badge: "1.6 16V K4M • JB3 Manual"
  };

  // Factory Presets Map
  const factoryPresets = {
    k4m_16v: {
      engine: "K4M",
      capacity: "1.6L (1598cc)",
      gearbox: "JB3",
      phase: "Phase 2 (1999-2002)",
      fuel: "Petrol Multipoint Injection (Sirius 32)",
      badge: "1.6 16V K4M • JB3 Manual"
    },
    k7m_8v: {
      engine: "K7M",
      capacity: "1.6L (1598cc)",
      gearbox: "JB1",
      phase: "Phase 1 (1995-1999)",
      fuel: "Petrol Multipoint Injection",
      badge: "1.6 8V K7M • JB1 Manual"
    },
    e7j_14: {
      engine: "E7J",
      capacity: "1.4L (1390cc)",
      gearbox: "JB1",
      phase: "Phase 1 & 2 (1995-2002)",
      fuel: "Petrol Injection",
      badge: "1.4L E7J/K4J • JB1 Manual"
    },
    f3r_20: {
      engine: "F3R",
      capacity: "2.0L (1998cc)",
      gearbox: "JB3",
      phase: "Phase 1 (1995-1999)",
      fuel: "Petrol Multipoint Injection (Fenix 5)",
      badge: "2.0L F3R • JB3 Manual"
    },
    f9q_diesel: {
      engine: "F9Q",
      capacity: "1.9L (1870cc)",
      gearbox: "JC5",
      phase: "Phase 1 & 2 (1997-2002)",
      fuel: "Direct Injection Turbo Diesel (dTi / dCi)",
      badge: "1.9 dTi/dCi F9Q • JC5 Manual"
    },
    auto_dp0: {
      engine: "K4M",
      capacity: "1.6L (1598cc)",
      gearbox: "DP0",
      phase: "Phase 2 (1999-2002)",
      fuel: "Petrol Injection",
      badge: "1.6 16V • DP0 Automatic"
    }
  };

  // Viewer State
  let viewerCurrentPage = 1;
  let viewerTotalPages = 2492;
  let viewerZoom = 1.0;
  let viewerIsTextView = false;

  // DOM Elements
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const providerSelect = document.getElementById('provider-select');
  const sectionFilter = document.getElementById('section-filter');
  const searchOnlyToggle = document.getElementById('search-only-toggle');
  const quickTopicsContainer = document.getElementById('quick-topics-container');
  const statusPulse = document.getElementById('status-pulse');
  const statusText = document.getElementById('status-text');
  const reindexBtn = document.getElementById('reindex-btn');
  const ingestionBanner = document.getElementById('ingestion-banner');
  const ingestionMsg = document.getElementById('ingestion-msg');
  const ingestionPct = document.getElementById('ingestion-pct');
  const ingestionBar = document.getElementById('ingestion-bar');
  const manualSize = document.getElementById('manual-size');

  // Chat Management Buttons
  const newChatBtn = document.getElementById('new-chat-btn');
  const saveChatBtn = document.getElementById('save-chat-btn');
  const savedChatsBtn = document.getElementById('saved-chats-btn');
  const exportChatBtn = document.getElementById('export-chat-btn');
  const quickClearBtn = document.getElementById('quick-clear-btn');
  const savedChatsModal = document.getElementById('saved-chats-modal');
  const closeSavedChatsBtn = document.getElementById('close-saved-chats-btn');
  const savedChatsList = document.getElementById('saved-chats-list');
  const savedChatsSummary = document.getElementById('saved-chats-summary');
  const saveCurrentModalBtn = document.getElementById('save-current-modal-btn');
  const savedChatsCountBadge = document.getElementById('saved-chats-count-badge');

  // Vehicle Profile Elements
  const vehicleProfileBtn = document.getElementById('vehicle-profile-btn');
  const sidebarEditVehicleBtn = document.getElementById('sidebar-edit-vehicle-btn');
  const vehicleModal = document.getElementById('vehicle-modal');
  const closeVehicleModalBtn = document.getElementById('close-vehicle-modal-btn');
  const saveVehicleBtn = document.getElementById('save-vehicle-btn');
  const presetSelect = document.getElementById('preset-select');
  const vehicleEngineInput = document.getElementById('vehicle-engine-input');
  const vehicleCapacityInput = document.getElementById('vehicle-capacity-input');
  const vehicleGearboxInput = document.getElementById('vehicle-gearbox-input');
  const vehiclePhaseInput = document.getElementById('vehicle-phase-input');
  const vehicleFuelInput = document.getElementById('vehicle-fuel-input');
  const headerVehicleBadge = document.getElementById('header-vehicle-badge');
  const sidebarEngine = document.getElementById('sidebar-engine');
  const sidebarGearbox = document.getElementById('sidebar-gearbox');
  const sidebarPhase = document.getElementById('sidebar-phase');

  // Settings Modal Elements
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const geminiKeyInput = document.getElementById('gemini-key-input');
  const groqKeyInput = document.getElementById('groq-key-input');
  const openaiKeyInput = document.getElementById('openai-key-input');
  const alphaSlider = document.getElementById('alpha-slider');
  const alphaValue = document.getElementById('alpha-value');

  // Page Viewer Modal Elements
  const pageViewerModal = document.getElementById('page-viewer-modal');
  const closeViewerBtn = document.getElementById('close-viewer-btn');
  const viewerPageBadge = document.getElementById('viewer-page-badge');
  const viewerSectionTitle = document.getElementById('viewer-section-title');
  const viewerPrevBtn = document.getElementById('viewer-prev-btn');
  const viewerNextBtn = document.getElementById('viewer-next-btn');
  const viewerPageInput = document.getElementById('viewer-page-input');
  const viewerZoomIn = document.getElementById('viewer-zoom-in');
  const viewerZoomOut = document.getElementById('viewer-zoom-out');
  const viewerZoomReset = document.getElementById('viewer-zoom-reset');
  const viewerZoomLevel = document.getElementById('viewer-zoom-level');
  const viewerToggleMode = document.getElementById('viewer-toggle-mode');
  const viewerModeLabel = document.getElementById('viewer-mode-label');
  const viewerPageImg = document.getElementById('viewer-page-img');
  const viewerImgWrapper = document.getElementById('viewer-img-wrapper');
  const viewerTextWrapper = document.getElementById('viewer-text-wrapper');
  const viewerPageText = document.getElementById('viewer-page-text');
  const viewerLoading = document.getElementById('viewer-loading');
  const viewerOpenTab = document.getElementById('viewer-open-tab');
  const copyPageTextBtn = document.getElementById('copy-page-text-btn');

  // Workstation Tabs & Layout Elements
  const tabDashboard = document.getElementById('tab-dashboard');
  const tabManuals = document.getElementById('tab-manuals');
  const tabWiring = document.getElementById('tab-wiring');
  const tabTorque = document.getElementById('tab-torque');
  const tabDiag = document.getElementById('tab-diag');
  const workstationGrid = document.getElementById('workstation-grid');
  const panelWiring = document.getElementById('panel-wiring');
  const panelManual = document.getElementById('panel-manual');
  const panelTorque = document.getElementById('panel-torque');
  const panelChat = document.getElementById('panel-chat');
  const quickSearchInput = document.getElementById('quick-search-input');

  // Left Rail Buttons
  const railDashboard = document.getElementById('rail-dashboard');
  const railEngine = document.getElementById('rail-engine');
  const railGearbox = document.getElementById('rail-gearbox');
  const railElectrical = document.getElementById('rail-electrical');
  const railBody = document.getElementById('rail-body');

  // Card 1: Technical Wiring Elements
  const schematicImg = document.getElementById('schematic-img');
  const wiringCircuitLabel = document.getElementById('wiring-circuit-label');
  const wiringFullscreenBtn = document.getElementById('wiring-fullscreen-btn');
  const wiringSchematicBox = document.getElementById('wiring-schematic-box');
  const askAiCircuitBtn = document.getElementById('ask-ai-circuit-btn');
  const circuitPills = document.querySelectorAll('.circuit-pill');
  let currentWiringPage = 550;
  let currentWiringLabel = "Engine Management System (Sirius 32 - K4M 16V)";

  // Card 2: Mini Manual Viewer Elements
  const miniPageImg = document.getElementById('mini-page-img');
  const miniPageIndicator = document.getElementById('mini-page-indicator');
  const miniViewerSectionTitle = document.getElementById('mini-viewer-section-title');
  const miniPagePrev = document.getElementById('mini-page-prev');
  const miniPageNext = document.getElementById('mini-page-next');
  const miniOpenFullscreen = document.getElementById('mini-open-fullscreen');
  const miniViewerBox = document.getElementById('mini-viewer-box');
  let miniCurrentPage = 84;

  // Card 3: Dynamic Torque Table Elements
  const torqueEngineLabel = document.getElementById('torque-engine-label');
  const editTorqueVehicleBtn = document.getElementById('edit-torque-vehicle-btn');
  const torqueHeadBolts = document.getElementById('torque-head-bolts');
  const torqueWheelBolts = document.getElementById('torque-wheel-bolts');
  const torqueBrakeCalipers = document.getElementById('torque-brake-calipers');
  const torqueSparkPlugs = document.getElementById('torque-spark-plugs');
  const torqueSumpPlug = document.getElementById('torque-sump-plug');

  // Cache Welcome HTML for New Chat
  const welcomeHtml = chatMessages.innerHTML;

  // =========================================================
  // Web-Native Dialog System (replaces window.alert, confirm, prompt)
  // =========================================================

  function showAppDialog({
    type = 'alert',
    title = 'Workshop Notice',
    message = '',
    defaultValue = '',
    placeholder = '',
    confirmText = 'OK',
    cancelText = 'Cancel',
    isDestructive = false
  }) {
    return new Promise((resolve) => {
      const modal = document.getElementById('app-dialog-modal');
      const card = document.getElementById('app-dialog-card');
      const titleEl = document.getElementById('dialog-title');
      const messageEl = document.getElementById('dialog-message');
      const iconWrapper = document.getElementById('dialog-icon-wrapper');
      const iconEl = document.getElementById('dialog-icon');
      const promptContainer = document.getElementById('dialog-prompt-container');
      const promptInput = document.getElementById('dialog-prompt-input');
      const cancelBtn = document.getElementById('dialog-cancel-btn');
      const confirmBtn = document.getElementById('dialog-confirm-btn');

      if (!modal) {
        if (type === 'confirm') resolve(window.confirm(message));
        else if (type === 'prompt') resolve(window.prompt(message, defaultValue));
        else { window.alert(message); resolve(true); }
        return;
      }

      titleEl.textContent = title;
      messageEl.textContent = message;

      if (isDestructive) {
        iconWrapper.className = 'w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400';
        iconEl.setAttribute('data-lucide', 'alert-triangle');
        confirmBtn.className = 'px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-500/20';
      } else if (type === 'prompt') {
        iconWrapper.className = 'w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400';
        iconEl.setAttribute('data-lucide', 'edit-3');
        confirmBtn.className = 'px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-dark-950 text-xs font-bold transition shadow-md shadow-amber-500/20';
      } else {
        iconWrapper.className = 'w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400';
        iconEl.setAttribute('data-lucide', 'info');
        confirmBtn.className = 'px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-dark-950 text-xs font-bold transition shadow-md shadow-amber-500/20';
      }

      confirmBtn.textContent = confirmText || (type === 'alert' ? 'OK' : 'Confirm');
      cancelBtn.textContent = cancelText || 'Cancel';

      if (type === 'alert') {
        cancelBtn.classList.add('hidden');
        promptContainer.classList.add('hidden');
      } else if (type === 'confirm') {
        cancelBtn.classList.remove('hidden');
        promptContainer.classList.add('hidden');
      } else if (type === 'prompt') {
        cancelBtn.classList.remove('hidden');
        promptContainer.classList.remove('hidden');
        promptInput.value = defaultValue || '';
        promptInput.placeholder = placeholder || '';
      }

      modal.classList.remove('hidden');
      card.classList.remove('scale-95');
      card.classList.add('scale-100');
      lucide.createIcons();

      if (type === 'prompt') {
        setTimeout(() => {
          promptInput.focus();
          promptInput.select();
        }, 50);
      } else {
        confirmBtn.focus();
      }

      function cleanup() {
        confirmBtn.removeEventListener('click', onConfirm);
        cancelBtn.removeEventListener('click', onCancel);
        window.removeEventListener('keydown', onKey);
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
        modal.classList.add('hidden');
      }

      function onConfirm() {
        cleanup();
        if (type === 'prompt') {
          resolve(promptInput.value);
        } else {
          resolve(true);
        }
      }

      function onCancel() {
        cleanup();
        if (type === 'prompt') {
          resolve(null);
        } else {
          resolve(false);
        }
      }

      function onKey(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          onConfirm();
        }
      }

      confirmBtn.addEventListener('click', onConfirm);
      cancelBtn.addEventListener('click', onCancel);
      window.addEventListener('keydown', onKey);
    });
  }

  function appAlert(message, title = "Workshop Notice") {
    return showAppDialog({ type: 'alert', title, message, confirmText: 'OK' });
  }

  function appConfirm(message, { title = "Confirmation", confirmText = "Confirm", cancelText = "Cancel", isDestructive = false } = {}) {
    return showAppDialog({ type: 'confirm', title, message, confirmText, cancelText, isDestructive });
  }

  function appPrompt(message, defaultValue = "", { title = "Save Conversation", placeholder = "" } = {}) {
    return showAppDialog({ type: 'prompt', title, message, defaultValue, placeholder, confirmText: 'Save', cancelText: 'Cancel' });
  }

  // =========================================================
  // Context Window Usage & Token Meter (Dynamic per Model)
  // =========================================================

  const PROVIDER_CONTEXT_LIMITS = {
    gemini: {
      tokens: 1000000,
      label: "1M",
      name: "Google Gemini Flash"
    },
    groq: {
      tokens: 128000,
      label: "128K",
      name: "Groq Llama 3.3 70B"
    },
    openai: {
      tokens: 128000,
      label: "128K",
      name: "OpenAI GPT-4o-mini"
    },
    ollama: {
      tokens: 8192,
      label: "8K",
      name: "Local Ollama"
    }
  };

  function updateContextMeter() {
    const contextPctLabel = document.getElementById('context-pct-label');
    const contextProgressBar = document.getElementById('context-progress-bar');
    const contextTokensBadge = document.getElementById('context-tokens-badge');
    const contextTurnsBadge = document.getElementById('context-turns-badge');

    if (!contextPctLabel || !contextProgressBar) return;

    const currentProvider = (providerSelect && providerSelect.value) ? providerSelect.value : 'gemini';
    const providerConfig = PROVIDER_CONTEXT_LIMITS[currentProvider] || PROVIDER_CONTEXT_LIMITS.gemini;
    const maxBudget = providerConfig.tokens;

    const userTurns = conversationHistory.filter(m => m.role === 'user').length;
    if (conversationHistory.length === 0) {
      contextPctLabel.textContent = '0%';
      contextProgressBar.style.width = '0%';
      contextProgressBar.className = 'bg-emerald-500 h-1.5 rounded-full transition-all duration-300';
      contextPctLabel.className = 'font-bold font-mono text-emerald-400 text-xs';
      if (contextTokensBadge) {
        contextTokensBadge.textContent = `0 / ${maxBudget.toLocaleString()} tokens (${providerConfig.label})`;
        contextTokensBadge.title = `Model Context Window: ${providerConfig.name} (${maxBudget.toLocaleString()} tokens)`;
      }
      if (contextTurnsBadge) contextTurnsBadge.textContent = '0 turns';
      return;
    }

    // Calculation:
    // 1 token approx 3.5 characters for multilingual text
    let totalChars = 0;
    conversationHistory.forEach(m => {
      totalChars += (m.content || '').length;
    });

    const historyTokens = Math.ceil(totalChars / 3.5);
    const baseSystemPromptTokens = 1200; // system instructions & car profile
    const retrievedContextTokens = Math.min(2500, userTurns * 450); // workshop manual chunks
    const estimatedTokens = baseSystemPromptTokens + retrievedContextTokens + historyTokens;

    const rawPct = (estimatedTokens / maxBudget) * 100;

    let displayPct = "0%";
    if (rawPct < 0.1 && estimatedTokens > 0) {
      displayPct = "<0.1%";
    } else if (rawPct < 1 && estimatedTokens > 0) {
      displayPct = `${rawPct.toFixed(1)}%`;
    } else {
      displayPct = `${Math.min(100, Math.round(rawPct))}%`;
    }

    contextPctLabel.textContent = displayPct;

    // Minimum visible indicator width of 1.5% if tokens exist so user gets visual feedback
    const barWidth = Math.min(100, Math.max(estimatedTokens > 0 ? 1.5 : 0, rawPct));
    contextProgressBar.style.width = `${barWidth}%`;

    if (rawPct >= 85) {
      contextProgressBar.className = 'bg-rose-500 h-1.5 rounded-full transition-all duration-300';
      contextPctLabel.className = 'font-bold font-mono text-rose-400 text-xs';
    } else if (rawPct >= 55) {
      contextProgressBar.className = 'bg-amber-500 h-1.5 rounded-full transition-all duration-300';
      contextPctLabel.className = 'font-bold font-mono text-amber-400 text-xs';
    } else {
      contextProgressBar.className = 'bg-emerald-500 h-1.5 rounded-full transition-all duration-300';
      contextPctLabel.className = 'font-bold font-mono text-emerald-400 text-xs';
    }

    if (contextTokensBadge) {
      contextTokensBadge.textContent = `${estimatedTokens.toLocaleString()} / ${maxBudget.toLocaleString()} tokens (${providerConfig.label})`;
      contextTokensBadge.title = `Model Context Window: ${providerConfig.name} (${maxBudget.toLocaleString()} tokens)`;
    }
    if (contextTurnsBadge) {
      contextTurnsBadge.textContent = `${userTurns} ${userTurns === 1 ? 'turn' : 'turns'}`;
    }
  }

  // =========================================================
  // Chat History & Session Management
  // =========================================================

  async function startNewChat() {
    if (conversationHistory.length > 0) {
      const ok = await appConfirm(
        "Start a new chat session? The current conversation context will be cleared.",
        { title: "New Conversation", confirmText: "New Chat", cancelText: "Cancel" }
      );
      if (!ok) return;
    }
    conversationHistory = [];
    currentChatId = null;
    currentCitations = [];
    chatMessages.innerHTML = welcomeHtml;
    lucide.createIcons();
    userInput.value = '';
    userInput.focus();
    updateContextMeter();
  }

  async function saveActiveChat() {
    if (!conversationHistory || conversationHistory.length === 0) {
      await appAlert("There are no messages in the current conversation to save.", "Save Conversation");
      return;
    }

    // Determine default title from first question
    const firstUserMsg = conversationHistory.find(m => m.role === 'user');
    const defaultTitle = firstUserMsg ? firstUserMsg.content.slice(0, 45) + (firstUserMsg.content.length > 45 ? "..." : "") : "Repair Session";
    const title = await appPrompt("Enter a title for this saved conversation:", defaultTitle, {
      title: "Save Repair Conversation",
      placeholder: "e.g. Starter Motor Troubleshooting"
    });
    if (!title || !title.trim()) return;

    const chatData = {
      id: currentChatId || `chat_${Date.now()}`,
      title: title.trim(),
      messages: conversationHistory,
      vehicle_profile: vehicleProfile,
      created_at: new Date().toLocaleString()
    };
    currentChatId = chatData.id;

    // 1. Save to LocalStorage
    let localSaved = [];
    try {
      localSaved = JSON.parse(localStorage.getItem('megane_saved_chats') || '[]');
    } catch (e) {
      localSaved = [];
    }
    // Remove if updating existing
    localSaved = localSaved.filter(c => c.id !== chatData.id);
    localSaved.unshift(chatData);
    localStorage.setItem('megane_saved_chats', JSON.stringify(localSaved));

    // 2. Save to Backend API
    try {
      await fetch('/api/saved-chats', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(chatData)
      });
    } catch (e) {
      console.warn("Backend save failed, saved locally", e);
    }

    updateSavedChatsCount();
    showToast("Conversation saved successfully! 💾");
  }

  async function loadSavedChatsList() {
    savedChatsList.innerHTML = '<div class="text-center py-8 text-slate-400 text-xs"><i data-lucide="loader" class="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400"></i> Loading saved chats...</div>';
    lucide.createIcons();

    let chats = [];
    // Try fetch from backend
    try {
      const res = await fetch('/api/saved-chats');
      if (res.ok) {
        chats = await res.json();
      }
    } catch (e) {
      console.warn("Could not fetch backend saved chats", e);
    }

    // Fallback or merge with localStorage
    if (!chats || chats.length === 0) {
      try {
        chats = JSON.parse(localStorage.getItem('megane_saved_chats') || '[]');
      } catch (e) {
        chats = [];
      }
    }

    renderSavedChatsList(chats);
  }

  function renderSavedChatsList(chats) {
    savedChatsSummary.textContent = `${chats.length} saved session${chats.length === 1 ? '' : 's'}`;
    if (savedChatsCountBadge) savedChatsCountBadge.textContent = chats.length;

    if (!chats || chats.length === 0) {
      savedChatsList.innerHTML = `
        <div class="text-center py-12 text-slate-500 text-xs space-y-2">
          <i data-lucide="folder-x" class="w-8 h-8 mx-auto text-slate-600"></i>
          <p>No saved repair conversations yet.</p>
          <p class="text-[11px] text-slate-600">Click "Save" during any conversation to store it for future reference.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    savedChatsList.innerHTML = '';
    chats.forEach(c => {
      const card = document.createElement('div');
      card.className = 'p-3.5 bg-dark-850 hover:bg-dark-800 border border-slate-800 rounded-xl flex items-center justify-between gap-3 transition group';
      card.innerHTML = `
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-slate-200 text-xs truncate group-hover:text-amber-300 transition">${escapeHtml(c.title)}</span>
            ${c.vehicle_badge ? `<span class="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 font-mono">${escapeHtml(c.vehicle_badge)}</span>` : ''}
          </div>
          <div class="flex items-center gap-3 text-[11px] text-slate-500">
            <span><i data-lucide="clock" class="w-3 h-3 inline mr-1"></i>${c.created_at || 'Recently'}</span>
            <span><i data-lucide="message-square" class="w-3 h-3 inline mr-1"></i>${c.message_count || (c.messages ? c.messages.length : 0)} msgs</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button data-action="load" class="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-dark-950 font-bold text-xs flex items-center gap-1 transition shadow-sm" title="Load this chat">
            <i data-lucide="corner-up-left" class="w-3.5 h-3.5"></i> Load
          </button>
          <button data-action="export" class="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition" title="Export as Markdown">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
          </button>
          <button data-action="delete" class="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition" title="Delete saved chat">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;

      card.querySelector('[data-action="load"]').addEventListener('click', () => restoreChatSession(c.id));
      card.querySelector('[data-action="export"]').addEventListener('click', () => exportChatMarkdown(c));
      card.querySelector('[data-action="delete"]').addEventListener('click', () => deleteChatSession(c.id));

      savedChatsList.appendChild(card);
    });
    lucide.createIcons();
  }

  async function restoreChatSession(chatId) {
    let chat = null;
    try {
      const res = await fetch(`/api/saved-chats/${chatId}`);
      if (res.ok) chat = await res.json();
    } catch (e) {
      console.warn("Backend load failed, searching local storage", e);
    }

    if (!chat) {
      const localSaved = JSON.parse(localStorage.getItem('megane_saved_chats') || '[]');
      chat = localSaved.find(c => c.id === chatId);
    }

    if (!chat) {
      await appAlert("Could not load conversation data.", "Error Loading Chat");
      return;
    }

    currentChatId = chat.id;
    conversationHistory = chat.messages || [];
    chatMessages.innerHTML = '';

    // Restore vehicle profile if present
    if (chat.vehicle_profile) {
      vehicleProfile = chat.vehicle_profile;
      updateVehicleUI();
    }

    // Render all messages
    conversationHistory.forEach(m => {
      if (m.role === 'user') {
        appendUserMessage(m.content);
      } else {
        const { contentEl, citationsEl } = createAssistantMessageContainer();
        contentEl.innerHTML = renderMarkdownWithInteractivePages(m.content);
        hydrateRenderedContent(contentEl);
        if (m.citations && m.citations.length > 0) {
          renderCitationsPills(citationsEl, m.citations);
        }
      }
    });

    savedChatsModal.classList.add('hidden');
    showToast(`Loaded conversation: "${chat.title}" 📖`);
    lucide.createIcons();
    updateContextMeter();
  }

  async function deleteChatSession(chatId) {
    const ok = await appConfirm("Are you sure you want to delete this saved chat?", {
      title: "Delete Saved Chat",
      confirmText: "Delete",
      isDestructive: true
    });
    if (!ok) return;

    // Remove local
    let localSaved = JSON.parse(localStorage.getItem('megane_saved_chats') || '[]');
    localSaved = localSaved.filter(c => c.id !== chatId);
    localStorage.setItem('megane_saved_chats', JSON.stringify(localSaved));

    // Remove backend
    try {
      await fetch(`/api/saved-chats/${chatId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn("Backend delete error", e);
    }

    loadSavedChatsList();
    updateSavedChatsCount();
  }

  async function exportChatMarkdown(chatData = null) {
    const data = chatData || {
      title: "Renault Megane Repair Chat",
      created_at: new Date().toLocaleString(),
      vehicle_profile: vehicleProfile,
      messages: conversationHistory
    };

    if (!data.messages || data.messages.length === 0) {
      await appAlert("No messages in the conversation to export.", "Export Conversation");
      return;
    }

    let md = `# ${data.title || "Renault Mégane I Workshop Repair Chat"}\n\n`;
    md += `**Date:** ${data.created_at || new Date().toLocaleString()}\n`;
    if (data.vehicle_profile) {
      md += `**Vehicle:** Renault Mégane I (${data.vehicle_profile.engine || 'General'} | ${data.vehicle_profile.gearbox || 'Manual'} | ${data.vehicle_profile.phase || ''})\n`;
    }
    md += `\n---\n\n`;

    data.messages.forEach((m, idx) => {
      if (m.role === 'user') {
        md += `### 👤 User:\n${m.content}\n\n`;
      } else {
        md += `### 🤖 Renault Specialist:\n${m.content}\n\n`;
        if (m.citations && m.citations.length > 0) {
          md += `*Manual Page Citations:* ${m.citations.map(c => `[Page ${c.page_num} - ${c.section}](/api/pdf/render/${c.page_num})`).join(', ')}\n\n`;
        }
        md += `---\n\n`;
      }
    });

    // Trigger download
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanName = (data.title || "megane_repair_chat").replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
    link.download = `${cleanName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Chat exported to Markdown file! 📥");
  }

  async function updateSavedChatsCount() {
    let count = 0;
    try {
      const res = await fetch('/api/saved-chats');
      if (res.ok) {
        const list = await res.json();
        count = list.length;
      }
    } catch (e) {
      const localSaved = JSON.parse(localStorage.getItem('megane_saved_chats') || '[]');
      count = localSaved.length;
    }
    if (savedChatsCountBadge) savedChatsCountBadge.textContent = count;
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 bg-dark-900 border border-amber-500/40 text-amber-300 text-xs px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-bounce';
    toast.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> ${escapeHtml(message)}`;
    document.body.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => {
      toast.remove();
    }, 3500);
  }

  // Hook chat buttons
  if (newChatBtn) newChatBtn.addEventListener('click', startNewChat);
  if (saveChatBtn) saveChatBtn.addEventListener('click', saveActiveChat);
  if (saveCurrentModalBtn) saveCurrentModalBtn.addEventListener('click', saveActiveChat);
  if (savedChatsBtn) {
    savedChatsBtn.addEventListener('click', () => {
      savedChatsModal.classList.remove('hidden');
      loadSavedChatsList();
    });
  }
  if (closeSavedChatsBtn) {
    closeSavedChatsBtn.addEventListener('click', () => savedChatsModal.classList.add('hidden'));
  }
  if (exportChatBtn) {
    exportChatBtn.addEventListener('click', () => exportChatMarkdown());
  }
  if (quickClearBtn) {
    quickClearBtn.addEventListener('click', startNewChat);
  }

  // =========================================================
  // Vehicle Profile Management Logic
  // =========================================================

  function loadVehicleProfile() {
    const saved = localStorage.getItem('megane_vehicle_profile');
    if (saved) {
      try {
        vehicleProfile = JSON.parse(saved);
      } catch (e) {
        console.warn("Error parsing vehicle profile", e);
      }
    }
    updateVehicleUI();
  }

  function updateVehicleUI() {
    if (headerVehicleBadge) {
      headerVehicleBadge.textContent = vehicleProfile.badge || `${vehicleProfile.engine} • ${vehicleProfile.gearbox}`;
    }
    if (sidebarEngine) {
      sidebarEngine.textContent = `${vehicleProfile.engine} (${vehicleProfile.capacity})`;
    }
    if (sidebarGearbox) {
      sidebarGearbox.textContent = `${vehicleProfile.gearbox}`;
    }
    if (sidebarPhase) {
      sidebarPhase.textContent = vehicleProfile.phase || "Phase 2 (1999-2002)";
    }

    // Populate modal inputs
    if (vehicleEngineInput) vehicleEngineInput.value = vehicleProfile.engine || "K4M";
    if (vehicleCapacityInput) vehicleCapacityInput.value = vehicleProfile.capacity || "1.6L (1598cc)";
    if (vehicleGearboxInput) vehicleGearboxInput.value = vehicleProfile.gearbox || "JB3";
    if (vehiclePhaseInput) vehiclePhaseInput.value = vehicleProfile.phase || "Phase 2 (1999-2002)";
    if (vehicleFuelInput) vehicleFuelInput.value = vehicleProfile.fuel || "Petrol Multipoint Injection";

    // Update dynamic torque specs
    updateTorqueTable();
  }

  function saveVehicleProfile() {
    vehicleProfile = {
      engine: vehicleEngineInput.value,
      capacity: vehicleCapacityInput.value.trim(),
      gearbox: vehicleGearboxInput.value,
      phase: vehiclePhaseInput.value,
      fuel: vehicleFuelInput.value.trim(),
      badge: `${vehicleProfile.capacity || vehicleEngineInput.value} ${vehicleEngineInput.value} • ${vehicleGearboxInput.value}`
    };
    localStorage.setItem('megane_vehicle_profile', JSON.stringify(vehicleProfile));
    updateVehicleUI();
    vehicleModal.classList.add('hidden');
    showToast(`Vehicle configured: ${vehicleProfile.engine} (${vehicleProfile.gearbox}) 🚗`);
  }

  // Factory Torque Tolerances Map
  const TORQUE_SPECS = {
    K4M: {
      name: "1.6 16V K4M",
      headBolts: "20 Nm + 240° ± 6°",
      wheelBolts: "100 – 110 Nm",
      calipers: "35 – 40 Nm",
      plugs: "25 – 30 Nm",
      sump: "20 Nm"
    },
    K7M: {
      name: "1.6 8V K7M",
      headBolts: "20 Nm + 100° + 100°",
      wheelBolts: "100 – 110 Nm",
      calipers: "35 – 40 Nm",
      plugs: "25 – 30 Nm",
      sump: "20 Nm"
    },
    E7J: {
      name: "1.4 8V E7J / K4J",
      headBolts: "20 Nm + 100° + 100°",
      wheelBolts: "100 Nm",
      calipers: "35 Nm",
      plugs: "25 – 30 Nm",
      sump: "20 Nm"
    },
    K4J: {
      name: "1.4 16V K4J",
      headBolts: "20 Nm + 240° ± 6°",
      wheelBolts: "100 Nm",
      calipers: "35 Nm",
      plugs: "25 – 30 Nm",
      sump: "20 Nm"
    },
    F3R: {
      name: "2.0 8V F3R",
      headBolts: "30 Nm + 50° + 107°",
      wheelBolts: "110 Nm",
      calipers: "40 Nm",
      plugs: "25 – 30 Nm",
      sump: "20 Nm"
    },
    F7R: {
      name: "2.0 16V F7R (IDE)",
      headBolts: "30 Nm + 80° + 80°",
      wheelBolts: "110 Nm",
      calipers: "40 Nm",
      plugs: "25 – 30 Nm",
      sump: "20 Nm"
    },
    F9Q: {
      name: "1.9 dTi/dCi Diesel F9Q",
      headBolts: "30 Nm + 100° + 100°",
      wheelBolts: "110 Nm",
      calipers: "40 Nm",
      plugs: "Glow: 20 Nm",
      sump: "20 Nm"
    },
    F8Q: {
      name: "1.9 D/dT Diesel F8Q",
      headBolts: "30 Nm + 100° + 100°",
      wheelBolts: "110 Nm",
      calipers: "40 Nm",
      plugs: "Glow: 20 Nm",
      sump: "20 Nm"
    }
  };

  function updateTorqueTable() {
    const engKey = (vehicleProfile.engine || "K4M").toUpperCase().trim();
    const specs = TORQUE_SPECS[engKey] || TORQUE_SPECS["K4M"];
    if (torqueEngineLabel) torqueEngineLabel.textContent = `Critical values for Mégane I: ${specs.name}`;
    if (torqueHeadBolts) torqueHeadBolts.textContent = specs.headBolts;
    if (torqueWheelBolts) torqueWheelBolts.textContent = specs.wheelBolts;
    if (torqueBrakeCalipers) torqueBrakeCalipers.textContent = specs.calipers;
    if (torqueSparkPlugs) torqueSparkPlugs.textContent = specs.plugs;
    if (torqueSumpPlug) torqueSumpPlug.textContent = specs.sump;
  }

  // =========================================================
  // Workstation Dashboard Interactions
  // =========================================================

  // =========================================================
  // Workstation View Switching & Multi-View Layout Manager
  // =========================================================

  let currentInspectedPin = null;

  function switchView(viewName) {
    const views = {
      chat: document.getElementById('view-chat'),
      wiring: document.getElementById('view-wiring-studio'),
      manuals: document.getElementById('view-manual-reader'),
      torque: document.getElementById('view-torque-specs'),
      dashboard: document.getElementById('view-dashboard')
    };

    // 1. Toggle visibility of view sections
    Object.keys(views).forEach(k => {
      if (views[k]) {
        if (k === viewName) {
          views[k].classList.remove('hidden');
        } else {
          views[k].classList.add('hidden');
        }
      }
    });

    // 2. Sync Top Navigation Tabs
    const tabMap = {
      chat: tabDiag,
      wiring: tabWiring,
      manuals: tabManuals,
      torque: tabTorque,
      dashboard: tabDashboard
    };

    [tabDiag, tabWiring, tabManuals, tabTorque, tabDashboard].forEach(tab => {
      if (tab) {
        tab.classList.remove('active', 'bg-amber-500', 'text-dark-950', 'font-bold', 'shadow-sm');
        tab.classList.add('text-slate-400');
      }
    });

    if (tabMap[viewName]) {
      tabMap[viewName].classList.add('active', 'bg-amber-500', 'text-dark-950', 'font-bold', 'shadow-sm');
      tabMap[viewName].classList.remove('text-slate-400');
    }

    // 3. Sync Left Rail Buttons
    const railMap = {
      chat: railDashboard,
      wiring: railElectrical,
      manuals: railBody,
      torque: railEngine
    };

    [railDashboard, railElectrical, railEngine, railGearbox, railBody].forEach(rail => {
      if (rail) {
        rail.classList.remove('active', 'bg-amber-500/15', 'text-amber-300', 'border-amber-500/30');
        rail.classList.add('text-slate-400', 'border-transparent');
      }
    });

    if (railMap[viewName]) {
      railMap[viewName].classList.add('active', 'bg-amber-500/15', 'text-amber-300', 'border-amber-500/30');
      railMap[viewName].classList.remove('text-slate-400', 'border-transparent');
    }

    // 4. View-specific activations
    if (viewName === 'wiring') {
      const studioMount = document.getElementById('studio-schematic-mount');
      if (studioMount && (!studioMount.dataset.renderedCircuit || studioMount.children.length === 0)) {
        const activePill = document.querySelector('#studio-circuit-pills .studio-pill.active');
        const cId = activePill ? activePill.dataset.circuit : 'starter_circuit';
        if (window.SchematicsEngine) {
          window.SchematicsEngine.renderWidget(cId, studioMount);
          studioMount.dataset.renderedCircuit = cId;
        }
      }
    } else if (viewName === 'chat') {
      if (userInput) userInput.focus();
    } else if (viewName === 'manuals') {
      const readerImg = document.getElementById('manual-reader-img');
      if (readerImg) {
        readerImg.src = `/api/pdf/render/${miniCurrentPage || 84}`;
      }
    }

    lucide.createIcons();
  }

  window.switchView = switchView;

  window.openStudioWithCircuit = function(circuitId) {
    switchView('wiring');
    const targetPill = document.querySelector(`.studio-pill[data-circuit="${circuitId}"]`);
    if (targetPill) {
      targetPill.click();
    } else {
      const studioMount = document.getElementById('studio-schematic-mount');
      if (studioMount && window.SchematicsEngine) {
        window.SchematicsEngine.renderWidget(circuitId, studioMount);
        studioMount.dataset.renderedCircuit = circuitId;
      }
    }
  };

  // Pin Inspector Modal Handler
  window.showPinInspectorModal = function(pinData) {
    if (!pinData) return;
    currentInspectedPin = pinData;
    const modal = document.getElementById('pin-inspector-modal');
    if (!modal) return;

    const pinEl = document.getElementById('pin-modal-pin');
    const voltEl = document.getElementById('pin-modal-voltage');
    const wireEl = document.getElementById('pin-modal-wire');
    const noteEl = document.getElementById('pin-modal-note');
    const subEl = document.getElementById('pin-modal-subtitle');

    if (pinEl) pinEl.textContent = `${pinData.id} (${pinData.label || ''})`;
    if (voltEl) voltEl.textContent = pinData.voltage || '-';
    if (wireEl) wireEl.textContent = pinData.wire || '-';
    if (noteEl) noteEl.textContent = pinData.note || 'Renault OEM Factory Electrical Diagnostic Standard.';
    if (subEl) subEl.textContent = `Renault Mégane I Electrical Standard • ${pinData.id}`;

    modal.classList.remove('hidden');
    lucide.createIcons();
  };

  function initWorkstationInteractions() {
    // 1. Studio Circuit Pills (Dedicated Interactive Studio)
    const studioPills = document.querySelectorAll('#studio-circuit-pills .studio-pill');
    if (studioPills && studioPills.length > 0) {
      studioPills.forEach(pill => {
        pill.addEventListener('click', () => {
          studioPills.forEach(p => {
            p.classList.remove('active', 'bg-amber-500/20', 'text-amber-300', 'border-amber-500/40', 'font-bold');
            p.classList.add('bg-[#141c2e]', 'text-slate-300', 'border-slate-800', 'font-medium');
          });
          pill.classList.remove('bg-[#141c2e]', 'text-slate-300', 'border-slate-800', 'font-medium');
          pill.classList.add('active', 'bg-amber-500/20', 'text-amber-300', 'border-amber-500/40', 'font-bold');

          const circuitId = pill.dataset.circuit;
          const studioMount = document.getElementById('studio-schematic-mount');
          if (studioMount && window.SchematicsEngine) {
            window.SchematicsEngine.renderWidget(circuitId, studioMount);
            studioMount.dataset.renderedCircuit = circuitId;
          }
        });
      });
    }

    // 2. Pin Inspector Modal Close & Ask AI Buttons
    const closePinModalBtn = document.getElementById('close-pin-modal-btn');
    if (closePinModalBtn) {
      closePinModalBtn.addEventListener('click', () => {
        document.getElementById('pin-inspector-modal').classList.add('hidden');
      });
    }

    const pinAskAiBtn = document.getElementById('pin-ask-ai-btn');
    if (pinAskAiBtn) {
      pinAskAiBtn.addEventListener('click', () => {
        document.getElementById('pin-inspector-modal').classList.add('hidden');
        switchView('chat');
        if (currentInspectedPin) {
          userInput.value = `How do I diagnose and test ${currentInspectedPin.id} (${currentInspectedPin.label}) with expected voltage ${currentInspectedPin.voltage} and wire ${currentInspectedPin.wire}? What are the symptoms if this circuit fails?`;
          userInput.style.height = 'auto';
          userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
          userInput.focus();
        }
      });
    }

    // 3. Top Navigation Tabs
    if (tabDiag) tabDiag.addEventListener('click', () => switchView('chat'));
    if (tabWiring) tabWiring.addEventListener('click', () => switchView('wiring'));
    if (tabManuals) tabManuals.addEventListener('click', () => switchView('manuals'));
    if (tabTorque) tabTorque.addEventListener('click', () => switchView('torque'));
    if (tabDashboard) tabDashboard.addEventListener('click', () => switchView('dashboard'));

    // 4. Left Rail Navigation Buttons
    if (railDashboard) railDashboard.addEventListener('click', () => switchView('chat'));
    if (railElectrical) railElectrical.addEventListener('click', () => switchView('wiring'));
    if (railEngine) railEngine.addEventListener('click', () => switchView('torque'));
    if (railGearbox) {
      railGearbox.addEventListener('click', () => {
        switchView('chat');
        if (sectionFilter) sectionFilter.value = '21 - Manual Gearbox';
        userInput.value = `What is the gear oil specification and capacity for the ${vehicleProfile.gearbox} gearbox?`;
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
        userInput.focus();
      });
    }
    if (railBody) railBody.addEventListener('click', () => switchView('manuals'));

    // 5. Mini Manual Reader in Dashboard (Card 2)
    function updateMiniViewer(pageNum) {
      miniCurrentPage = Math.max(1, Math.min(pageNum, 2492));
      if (miniPageIndicator) miniPageIndicator.textContent = `p.${miniCurrentPage}`;
      if (miniPageImg) miniPageImg.src = `/api/pdf/render/${miniCurrentPage}`;
      fetch(`/api/pdf/page-info/${miniCurrentPage}`)
        .then(res => res.json())
        .then(info => {
          if (miniViewerSectionTitle && info.section) {
            miniViewerSectionTitle.textContent = `Page ${miniCurrentPage}: ${info.section}`;
          }
        })
        .catch(() => {});
    }

    if (miniPagePrev) {
      miniPagePrev.addEventListener('click', () => updateMiniViewer(miniCurrentPage - 1));
    }
    if (miniPageNext) {
      miniPageNext.addEventListener('click', () => updateMiniViewer(miniCurrentPage + 1));
    }
    if (miniOpenFullscreen) {
      miniOpenFullscreen.addEventListener('click', () => openPageViewer(miniCurrentPage));
    }
    if (miniViewerBox) {
      miniViewerBox.addEventListener('click', () => openPageViewer(miniCurrentPage));
    }

    // 6. Torque Spec edit vehicle button (Card 3)
    if (editTorqueVehicleBtn) {
      editTorqueVehicleBtn.addEventListener('click', () => {
        vehicleModal.classList.remove('hidden');
      });
    }

    // 7. Subheader Quick Search Input
    if (quickSearchInput) {
      quickSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = quickSearchInput.value.trim();
          if (query) {
            switchView('chat');
            userInput.value = query;
            quickSearchInput.value = '';
            chatForm.dispatchEvent(new Event('submit'));
          }
        }
      });
    }

    // Default view: Chat
    switchView('chat');
  }

  // Handle Preset dropdown change
  presetSelect.addEventListener('change', (e) => {
    const key = e.target.value;
    if (factoryPresets[key]) {
      const preset = factoryPresets[key];
      vehicleEngineInput.value = preset.engine;
      vehicleCapacityInput.value = preset.capacity;
      vehicleGearboxInput.value = preset.gearbox;
      vehiclePhaseInput.value = preset.phase;
      vehicleFuelInput.value = preset.fuel;
    }
  });

  vehicleProfileBtn.addEventListener('click', () => vehicleModal.classList.remove('hidden'));
  if (sidebarEditVehicleBtn) {
    sidebarEditVehicleBtn.addEventListener('click', () => vehicleModal.classList.remove('hidden'));
  }
  closeVehicleModalBtn.addEventListener('click', () => vehicleModal.classList.add('hidden'));
  saveVehicleBtn.addEventListener('click', saveVehicleProfile);

  // =========================================================
  // Settings & API Keys Management
  // =========================================================

  function loadLocalSettings() {
    if (localStorage.getItem('gemini_api_key')) geminiKeyInput.value = localStorage.getItem('gemini_api_key');
    if (localStorage.getItem('groq_api_key')) groqKeyInput.value = localStorage.getItem('groq_api_key');
    if (localStorage.getItem('openai_api_key')) openaiKeyInput.value = localStorage.getItem('openai_api_key');
    if (localStorage.getItem('hybrid_alpha')) {
      alphaSlider.value = localStorage.getItem('hybrid_alpha');
      alphaValue.textContent = alphaSlider.value;
    }
    if (localStorage.getItem('preferred_provider')) {
      providerSelect.value = localStorage.getItem('preferred_provider');
    }
  }

  function saveLocalSettings() {
    localStorage.setItem('gemini_api_key', geminiKeyInput.value.trim());
    localStorage.setItem('groq_api_key', groqKeyInput.value.trim());
    localStorage.setItem('openai_api_key', openaiKeyInput.value.trim());
    localStorage.setItem('hybrid_alpha', alphaSlider.value);
    localStorage.setItem('preferred_provider', providerSelect.value);
    settingsModal.classList.add('hidden');
    showToast("Settings saved! ⚙️");
  }

  alphaSlider.addEventListener('input', () => {
    alphaValue.textContent = alphaSlider.value;
  });

  settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
  closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
  saveSettingsBtn.addEventListener('click', saveLocalSettings);

  if (providerSelect) {
    providerSelect.addEventListener('change', () => {
      localStorage.setItem('preferred_provider', providerSelect.value);
      updateContextMeter();
      const provInfo = PROVIDER_CONTEXT_LIMITS[providerSelect.value];
      if (provInfo) {
        showToast(`Model: ${provInfo.name} (${provInfo.label} Context) 🧠`);
      }
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
    if (e.target === vehicleModal) vehicleModal.classList.add('hidden');
    if (e.target === savedChatsModal) savedChatsModal.classList.add('hidden');
    if (e.target === pageViewerModal) pageViewerModal.classList.add('hidden');
  });

  closeViewerBtn.addEventListener('click', () => pageViewerModal.classList.add('hidden'));

  // =========================================================
  // Interactive PDF Page Viewer Logic
  // =========================================================

  window.openPageViewer = async function(pageIdentifier, sectionName = '') {
    pageViewerModal.classList.remove('hidden');
    viewerLoading.classList.remove('hidden');

    viewerZoom = 1.0;
    applyZoom();

    // Fetch page info first to resolve section codes like '10-48' to absolute integer page
    try {
      const res = await fetch(`/api/pdf/page-info/${encodeURIComponent(pageIdentifier)}`);
      if (res.ok) {
        const info = await res.json();
        viewerCurrentPage = info.page_num;
        viewerTotalPages = info.total_pages || 2492;
        viewerPageBadge.textContent = `Page ${info.page_num} / ${viewerTotalPages}`;
        viewerPageInput.value = info.page_num;
        viewerSectionTitle.textContent = sectionName || info.section || `Manual Page ${info.page_num}`;
        viewerPageText.textContent = info.text || 'No extracted text on this page.';
        viewerPrevBtn.disabled = !info.has_prev;
        viewerNextBtn.disabled = !info.has_next;
        viewerOpenTab.href = `/api/pdf/render/${info.page_num}?dpi=200`;

        // Load image
        viewerPageImg.src = `/api/pdf/render/${info.page_num}?dpi=150`;
        viewerPageImg.onload = () => viewerLoading.classList.add('hidden');
        viewerPageImg.onerror = () => viewerLoading.classList.add('hidden');
        return;
      }
    } catch (e) {
      console.warn("Failed to fetch page info", e);
    }

    // Fallback if direct fetch
    viewerPageImg.src = `/api/pdf/render/${encodeURIComponent(pageIdentifier)}?dpi=150`;
    viewerPageImg.onload = () => viewerLoading.classList.add('hidden');
    viewerPageImg.onerror = () => viewerLoading.classList.add('hidden');
  };

  function applyZoom() {
    viewerPageImg.style.transform = `scale(${viewerZoom})`;
    viewerZoomLevel.textContent = `${Math.round(viewerZoom * 100)}%`;
  }

  viewerZoomIn.addEventListener('click', () => {
    if (viewerZoom < 2.5) {
      viewerZoom += 0.2;
      applyZoom();
    }
  });

  viewerZoomOut.addEventListener('click', () => {
    if (viewerZoom > 0.6) {
      viewerZoom -= 0.2;
      applyZoom();
    }
  });

  viewerZoomReset.addEventListener('click', () => {
    viewerZoom = 1.0;
    applyZoom();
  });

  viewerPrevBtn.addEventListener('click', () => {
    if (viewerCurrentPage > 1) openPageViewer(viewerCurrentPage - 1);
  });

  viewerNextBtn.addEventListener('click', () => {
    if (viewerCurrentPage < viewerTotalPages) openPageViewer(viewerCurrentPage + 1);
  });

  viewerPageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = parseInt(viewerPageInput.value);
      if (!isNaN(val)) openPageViewer(val);
    }
  });

  viewerToggleMode.addEventListener('click', () => {
    viewerIsTextView = !viewerIsTextView;
    if (viewerIsTextView) {
      viewerImgWrapper.classList.add('hidden');
      viewerTextWrapper.classList.remove('hidden');
      viewerModeLabel.textContent = 'Diagram View';
      viewerToggleMode.innerHTML = `<i data-lucide="image" class="w-3.5 h-3.5"></i> <span class="hidden sm:inline">Diagram View</span>`;
    } else {
      viewerTextWrapper.classList.add('hidden');
      viewerImgWrapper.classList.remove('hidden');
      viewerModeLabel.textContent = 'Text View';
      viewerToggleMode.innerHTML = `<i data-lucide="file-text" class="w-3.5 h-3.5"></i> <span class="hidden sm:inline">Text View</span>`;
    }
    lucide.createIcons();
  });

  copyPageTextBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(viewerPageText.textContent);
    copyPageTextBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> Copied!`;
    setTimeout(() => {
      copyPageTextBtn.innerHTML = `<i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy Text`;
      lucide.createIcons();
    }, 2000);
  });

  // Open Citation alias
  window.openCitation = function(chunkId) {
    const chunk = currentCitations.find(c => c.chunk_id === chunkId);
    if (chunk) {
      openPageViewer(chunk.page_num, chunk.section);
    }
  };

  // Delegate click on embedded chat images to open viewer
  chatMessages.addEventListener('click', (e) => {
    const img = e.target.closest('.prose-assistant img');
    if (img) {
      const src = img.getAttribute('src');
      const match = src && src.match(/\/api\/pdf\/render\/([^\/?#]+)/);
      if (match) {
        openPageViewer(match[1]);
      }
    }
  });

  function detectCircuitForPageOrText(pId, text) {
    const combined = `${pId || ''} ${text || ''}`.toLowerCase();

    // 1. Starter motor 163 & Neiman 104 & starter bypass switch
    if (['92', '93', '94', '95', '330', '331', '332'].includes(String(pId)) ||
        combined.includes('starter') || combined.includes('163') || combined.includes('neiman') ||
        combined.includes('مارش') || combined.includes('سويتش') || combined.includes('كونتاك') ||
        combined.includes('solenoid') || combined.includes('بادئ') || combined.includes('توصيلة مارش') ||
        combined.includes('زر تشغيل')) {
      return 'starter_circuit';
    }

    // 2. Sirius 32 / Injection ECU 120
    if (['550', '551', '552', '553', '554', '555', '370', '371'].includes(String(pId)) ||
        combined.includes('sirius') || combined.includes('fenix') || combined.includes('120') ||
        combined.includes('كنترول') || combined.includes('ecu') || combined.includes('بخاخات') ||
        combined.includes('رشاشات') || combined.includes('pmh') || combined.includes('حساس كرنك') ||
        combined.includes('relay 238') || combined.includes('relay 236')) {
      return 'sirius32_ecu';
    }

    // 3. GMV Cooling fan 188
    if (['244', '245', '246', '247', '248'].includes(String(pId)) ||
        combined.includes('cooling fan') || combined.includes('gmv') || combined.includes('188') ||
        combined.includes('مروحة') || combined.includes('تبريد') || combined.includes('relay 234') ||
        combined.includes('relay 235') || combined.includes('thermoswitch') || combined.includes('ترمستات')) {
      return 'cooling_fan';
    }

    // 4. Automatic Transmission AD4 / DP0
    if (['378', '379', '380', '410'].includes(String(pId)) ||
        combined.includes('ad4') || combined.includes('dp0') || combined.includes('فتيس') ||
        combined.includes('ناقل حركة') || combined.includes('automatic transmission') || combined.includes('multifunction')) {
      return 'transmission_ad4_dp0';
    }

    // 5. Alternator 103 Charging
    if (['90', '91', '103', '104'].includes(String(pId)) ||
        combined.includes('alternator') || combined.includes('103') || combined.includes('دينامو') ||
        combined.includes('شحن') || combined.includes('charging system')) {
      return 'alternator_charging';
    }

    return null;
  }

  let schematicCardCounter = 0;

  function createDiagramCard(pId, caption) {
    const safeCaption = (caption || `Renault Manual Diagram - Page ${pId}`).trim();
    const circuitId = detectCircuitForPageOrText(pId, caption);

    if (circuitId && window.SchematicsEngine) {
      schematicCardCounter++;
      const uid = `chat-circuit-${schematicCardCounter}-${Date.now()}`;
      const defaultPages = {
        starter_circuit: 92,
        sirius32_ecu: 550,
        cooling_fan: 245,
        transmission_ad4_dp0: 378,
        alternator_charging: 90
      };
      const displayPage = (pId && pId !== 'circuit') ? pId : (defaultPages[circuitId] || 92);

      const circuitNames = {
        starter_circuit: "⚡ Starter Motor 163 & Ignition 104 (Interactive Circuit & External Bypass Mod)",
        sirius32_ecu: "⚙️ Sirius 32 Engine ECU 120 & Sequential Injection",
        cooling_fan: "❄️ GMV Cooling Fan 188 (2-Speed Dual Relay System)",
        transmission_ad4_dp0: "🕹️ AD4 / DP0 Automatic Gearbox & Starter Interlock",
        alternator_charging: "🔋 Alternator 103 & 12V Battery Charging Circuit"
      };
      const title = circuitNames[circuitId] || "Renault Interactive Vector Schematic";

      return `
        <div class="my-4 rounded-2xl border border-amber-500/40 bg-[#0e1422] shadow-2xl overflow-hidden digital-schematic-card" data-circuit="${circuitId}">
          <div class="px-3.5 sm:px-4 py-2.5 bg-[#121929] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold tracking-wide">DIGITAL VECTOR 4K</span>
              <span class="font-bold text-white flex items-center gap-1.5">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-400"></i>
                <span>${escapeHtml(title)}</span>
              </span>
            </div>
            <div class="flex items-center gap-1.5">
              <button type="button" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition cursor-pointer toggle-scan-btn" data-target="scan-${uid}">
                <i data-lucide="file-text" class="w-3 h-3 text-slate-400"></i> Compare OEM Scan (p.${displayPage})
              </button>
              <button type="button" onclick="openStudioWithCircuit('${circuitId}')" class="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer">
                <i data-lucide="maximize-2" class="w-3 h-3"></i> Open Studio ↗
              </button>
            </div>
          </div>
          <div class="chat-schematic-mount p-2 sm:p-4 bg-slate-950" id="${uid}" data-circuit-id="${circuitId}">
            <!-- SchematicsEngine mounts here -->
          </div>
          <div id="scan-${uid}" class="hidden p-3 bg-[#0b0f19] border-t border-slate-800 text-center">
            <div class="text-[11px] text-slate-400 mb-2 font-mono flex items-center justify-center gap-2">
              <span>Original Factory Workshop Manual Scan (Page ${displayPage})</span>
              <button type="button" onclick="openPageViewer('${displayPage}')" class="text-amber-400 hover:underline text-[10px]">Open in Full Reader ↗</button>
            </div>
            <img src="/api/pdf/render/${displayPage}" alt="${escapeHtml(safeCaption)}" class="max-h-80 mx-auto rounded-lg object-contain cursor-pointer transition hover:scale-[1.01]" onclick="openPageViewer('${displayPage}')" loading="lazy">
          </div>
        </div>
      `;
    }

    return `
      <div class="my-4 rounded-xl border border-amber-500/40 bg-dark-900/90 overflow-hidden shadow-xl group">
        <div class="px-3.5 py-2.5 bg-dark-850 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span class="font-semibold text-amber-300 flex items-center gap-1.5 truncate max-w-sm">
            <i data-lucide="image" class="w-3.5 h-3.5 text-amber-400 shrink-0"></i>
            <span>${escapeHtml(safeCaption)}</span>
          </span>
          <button type="button" onclick="openPageViewer('${pId}')" class="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer">
            <i data-lucide="maximize-2" class="w-3 h-3"></i> Full Page ${pId} ↗
          </button>
        </div>
        <div class="p-2.5 bg-slate-950 flex justify-center cursor-pointer relative" onclick="openPageViewer('${pId}')" title="Click to view Page ${pId} in high resolution">
          <img src="/api/pdf/render/${pId}" alt="${escapeHtml(safeCaption)}" class="max-h-96 rounded-lg object-contain transition-transform duration-200 group-hover:scale-[1.01]" loading="lazy">
        </div>
      </div>
    `;
  }

  function hydrateRenderedContent(container) {
    if (!container) return;

    // 1. Mount any uninitialized interactive schematics
    container.querySelectorAll('.chat-schematic-mount').forEach(mount => {
      const cId = mount.dataset.circuitId;
      if (cId && window.SchematicsEngine && !mount.dataset.initialized) {
        window.SchematicsEngine.renderWidget(cId, mount, {
          showTitle: false,
          showPins: true,
          showControls: true
        });
        mount.dataset.initialized = 'true';
      }
    });

    // 2. Wire scan toggle buttons
    container.querySelectorAll('.toggle-scan-btn').forEach(btn => {
      if (!btn.dataset.bound) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetId = btn.dataset.target;
          const drawer = document.getElementById(targetId);
          if (drawer) {
            drawer.classList.toggle('hidden');
            btn.classList.toggle('bg-amber-500/20');
            btn.classList.toggle('text-amber-300');
          }
        });
        btn.dataset.bound = 'true';
      }
    });

    // 3. Initialize icons
    lucide.createIcons();
  }

  // Helper: Format Markdown with Interactive Clickable Page Citations & Diagram Cards
  function renderMarkdownWithInteractivePages(rawMarkdown) {
    if (!rawMarkdown) return "";

    // 1. Strip any backticks wrapping markdown image syntax (common LLM artifact)
    let cleaned = rawMarkdown.replace(/`+(!\[[^\]]*\]\((?:\/api\/pdf\/render\/|render\/)?[^)]+\))`+/g, '$1');

    // 2. Parse standard markdown
    let parsedHtml = marked.parse(cleaned);

    // 3. Convert any raw literal image markdown (or code-wrapped image markdown) into diagram cards
    parsedHtml = parsedHtml.replace(/(?:<code>)?!\[([^\]]*)\]\((?:\/api\/pdf\/render\/|render\/)?(\d{1,4}|\d{1,2}-\d{1,3})\)(?:<\/code>)?/gi, (match, caption, pId) => {
      return createDiagramCard(pId, caption);
    });

    // 4. Convert parsed <img> tags pointing to /api/pdf/render into diagram cards
    parsedHtml = parsedHtml.replace(/<p>\s*<img[^>]*src=["'](?:\/api\/pdf\/render\/|render\/)?(\d{1,4}|\d{1,2}-\d{1,3})["'][^>]*alt=["']?([^"'>]*)["']?[^>]*>\s*<\/p>/gi, (match, pId, caption) => {
      return createDiagramCard(pId, caption);
    });
    parsedHtml = parsedHtml.replace(/<img[^>]*src=["'](?:\/api\/pdf\/render\/|render\/)?(\d{1,4}|\d{1,2}-\d{1,3})["'][^>]*alt=["']?([^"'>]*)["']?[^>]*>/gi, (match, pId, caption) => {
      return createDiagramCard(pId, caption);
    });

    // 5. Convert [صفحة X] or [Page X] or [صفحة 10-48] or [p.92] into interactive buttons
    parsedHtml = parsedHtml.replace(/\[(?:صفحة|Page|p\.)\s*(\d{1,4}|\d{2}-\d{1,3})\]/gi, (match, pId) => {
      return `<button type="button" onclick="openPageViewer('${pId}')" class="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-xs hover:bg-amber-500/25 transition cursor-pointer" title="Click to view Page ${pId}"><i data-lucide="book-open" class="w-3 h-3 text-amber-400"></i> ${match.replace('[', '').replace(']', '')} ↗</button>`;
    });

    return parsedHtml;
  }

  // Toggle Search Only Mode
  searchOnlyToggle.addEventListener('click', () => {
    searchOnlyMode = !searchOnlyMode;
    if (searchOnlyMode) {
      searchOnlyToggle.classList.add('bg-amber-500/20', 'text-amber-300', 'border-amber-500/40');
      searchOnlyToggle.classList.remove('text-slate-400');
      userInput.placeholder = "Search manual directly for exact excerpts, torque tables, or part codes...";
    } else {
      searchOnlyToggle.classList.remove('bg-amber-500/20', 'text-amber-300', 'border-amber-500/40');
      searchOnlyToggle.classList.add('text-slate-400');
      userInput.placeholder = `Ask about torque specs, timing belt, fuses, oil for ${vehicleProfile.engine}...`;
    }
  });

  // Auto-resize textarea
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
  });

  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  // Fetch Quick Topics
  async function loadQuickTopics() {
    try {
      const res = await fetch('/api/quick-topics');
      const topics = await res.json();
      quickTopicsContainer.innerHTML = '';

      topics.forEach(t => {
        const item = document.createElement('div');
        item.className = 'p-2.5 rounded-lg bg-dark-850 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition text-xs group';
        item.innerHTML = `
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] text-amber-400/90 font-medium px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">${t.category}</span>
            <i data-lucide="arrow-up-right" class="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition"></i>
          </div>
          <p class="font-medium text-slate-300 group-hover:text-white line-clamp-1">${t.title}</p>
        `;
        item.addEventListener('click', () => {
          userInput.value = t.query;
          userInput.style.height = 'auto';
          userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
          chatForm.dispatchEvent(new Event('submit'));
        });
        quickTopicsContainer.appendChild(item);
      });
      lucide.createIcons();
    } catch (e) {
      console.error("Failed to load quick topics", e);
    }
  }

  // Poll Indexing & Status
  async function checkStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();

      isIndexed = data.is_indexed;

      if (data.indexing_progress.is_running) {
        ingestionBanner.classList.remove('hidden');
        ingestionMsg.textContent = data.indexing_progress.message;
        ingestionPct.textContent = `${data.indexing_progress.percent}%`;
        ingestionBar.style.width = `${data.indexing_progress.percent}%`;
        statusPulse.className = "w-2 h-2 rounded-full bg-amber-500 animate-spin";
        statusText.textContent = "Indexing manual...";
        setTimeout(checkStatus, 1500);
      } else {
        ingestionBanner.classList.add('hidden');
        if (isIndexed) {
          statusPulse.className = "w-2 h-2 rounded-full bg-emerald-500";
          const pages = data.stats.total_pages || 0;
          const chunks = data.stats.total_chunks || 0;
          statusText.textContent = `Ready: ${pages} Pages (${chunks} chunks)`;
          reindexBtn.classList.remove('hidden');
          if (data.stats.pdf_size_bytes) {
            manualSize.textContent = (data.stats.pdf_size_bytes / (1024 * 1024)).toFixed(1) + " MB";
          }
        } else {
          statusPulse.className = "w-2 h-2 rounded-full bg-red-500";
          statusText.textContent = "Manual not indexed (Click to index)";
          reindexBtn.classList.remove('hidden');
        }
      }
    } catch (e) {
      console.error("Status check error", e);
      statusText.textContent = "Server offline";
    }
  }

  // Reindex trigger
  reindexBtn.addEventListener('click', async () => {
    const ok = await appConfirm(
      "Do you want to re-process and build the vector and BM25 index for the Renault Megane manual?",
      { title: "Rebuild Manual Index", confirmText: "Rebuild Index" }
    );
    if (ok) {
      try {
        await fetch('/api/index', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({force: true})
        });
        checkStatus();
      } catch (err) {
        await appAlert("Failed to start indexing: " + err, "Indexing Error");
      }
    }
  });

  statusText.addEventListener('click', () => {
    if (!isIndexed) {
      reindexBtn.click();
    }
  });

  // Helper: Detect Arabic text for BiDi styling
  function isArabicText(text) {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(text);
  }

  // Render User Message
  function appendUserMessage(text) {
    const isRtl = isArabicText(text);
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex justify-end';
    msgDiv.innerHTML = `
      <div class="max-w-2xl bg-amber-500/15 border border-amber-500/30 rounded-2xl rounded-tr-sm px-5 py-3 text-slate-100 text-sm shadow-md ${isRtl ? 'text-right' : 'text-left'}" ${isRtl ? 'dir="rtl"' : 'dir="ltr"'}>
        <p class="whitespace-pre-wrap">${escapeHtml(text)}</p>
      </div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Render Assistant Message Skeleton
  function createAssistantMessageContainer() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'flex gap-3 max-w-3xl assistant-turn';
    msgDiv.innerHTML = `
      <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-1">
        <i data-lucide="bot" class="w-4 h-4"></i>
      </div>
      <div class="flex-1 space-y-3">
        <div class="bg-dark-900 border border-slate-800 rounded-2xl rounded-tl-sm px-5 py-4 text-slate-200 text-sm shadow-lg">
          <div class="message-content prose-assistant">
            <div class="flex items-center gap-2 text-slate-400 animate-pulse text-xs">
              <i data-lucide="loader" class="w-3.5 h-3.5 animate-spin text-amber-400"></i>
              <span>Analyzing query & consulting workshop manual...</span>
            </div>
          </div>
        </div>
        <div class="citations-container flex flex-wrap gap-1.5 hidden">
          <!-- Citations pills -->
        </div>
      </div>
    `;
    chatMessages.appendChild(msgDiv);
    lucide.createIcons();
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return {
      container: msgDiv,
      contentEl: msgDiv.querySelector('.message-content'),
      citationsEl: msgDiv.querySelector('.citations-container')
    };
  }

  // Form Submit Handler
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query || isGenerating) return;

    if (!isIndexed) {
      await appAlert("Please wait for the workshop manual index to be built or click the status button to start indexing.", "Manual Not Indexed");
      return;
    }

    // Append to UI
    appendUserMessage(query);
    userInput.value = '';
    userInput.style.height = 'auto';
    isGenerating = true;
    sendBtn.disabled = true;

    // Append to local multi-turn history
    conversationHistory.push({
      role: "user",
      content: query
    });
    updateContextMeter();

    const selectedProvider = providerSelect.value;
    const activeKey = getActiveApiKey(selectedProvider);
    const filter = sectionFilter.value;
    const alpha = parseFloat(alphaSlider.value) || 0.45;

    const { contentEl, citationsEl } = createAssistantMessageContainer();

    if (searchOnlyMode) {
      // Pure search retrieval mode
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            query: query,
            top_k: 5,
            section_filter: filter,
            alpha: alpha,
            vehicle_profile: vehicleProfile,
            messages: conversationHistory
          })
        });
        const data = await res.json();
        renderSearchOnlyResults(contentEl, data.results);
      } catch (err) {
        contentEl.innerHTML = `<span class="text-red-400">Search error: ${err.message}</span>`;
      } finally {
        isGenerating = false;
        sendBtn.disabled = false;
      }
      return;
    }

    // Streaming Chat RAG Mode with Conversation History
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          query: query,
          provider: selectedProvider,
          api_key: activeKey,
          section_filter: filter,
          top_k: 5,
          alpha: alpha,
          vehicle_profile: vehicleProfile,
          messages: conversationHistory // Send full multi-turn conversation context!
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Generation request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let rawMarkdown = "";
      let isFirstToken = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value);
        const lines = textChunk.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('event: citations')) {
            const dataLine = lines[i + 1]?.trim();
            if (dataLine?.startsWith('data: ')) {
              const payload = JSON.parse(dataLine.substring(6));
              currentCitations = payload.citations || [];
              renderCitationsPills(citationsEl, currentCitations);
            }
          } else if (line.startsWith('event: token')) {
            const dataLine = lines[i + 1]?.trim();
            if (dataLine?.startsWith('data: ')) {
              const payload = JSON.parse(dataLine.substring(6));
              if (isFirstToken) {
                contentEl.innerHTML = "";
                isFirstToken = false;
              }
              rawMarkdown += payload.token;

              // BiDi RTL detection
              if (isArabicText(rawMarkdown)) {
                contentEl.setAttribute('dir', 'rtl');
                contentEl.classList.add('is-rtl');
              } else {
                contentEl.setAttribute('dir', 'ltr');
                contentEl.classList.remove('is-rtl');
              }

              contentEl.innerHTML = renderMarkdownWithInteractivePages(rawMarkdown);
              lucide.createIcons();
              chatMessages.scrollTop = chatMessages.scrollHeight;
            }
          } else if (line.startsWith('event: error')) {
            const dataLine = lines[i + 1]?.trim();
            if (dataLine?.startsWith('data: ')) {
              const payload = JSON.parse(dataLine.substring(6));
              contentEl.innerHTML += `<div class="p-3 bg-red-950/50 border border-red-500/40 rounded-lg text-red-300 mt-2"><strong>Error:</strong> ${payload.error}</div>`;
            }
          }
        }
      }

      if (rawMarkdown) {
        contentEl.innerHTML = renderMarkdownWithInteractivePages(rawMarkdown);
        hydrateRenderedContent(contentEl);

        // Auto-embed schematic if circuit discussed but no diagram card was rendered
        const queryText = (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1]?.role === 'user') 
          ? conversationHistory[conversationHistory.length - 1].content 
          : '';
        const detectedCircuit = detectCircuitForPageOrText('', rawMarkdown + ' ' + queryText);
        if (detectedCircuit && contentEl.querySelectorAll('.chat-schematic-mount').length === 0) {
          const autoCardContainer = document.createElement('div');
          autoCardContainer.innerHTML = createDiagramCard('circuit', detectedCircuit);
          if (autoCardContainer.firstElementChild) {
            contentEl.appendChild(autoCardContainer.firstElementChild);
            hydrateRenderedContent(contentEl);
          }
        }

        // Record assistant response into conversation history
        conversationHistory.push({
          role: "assistant",
          content: rawMarkdown,
          citations: currentCitations
        });
        updateContextMeter();
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

    } catch (err) {
      contentEl.innerHTML = `
        <div class="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs space-y-3">
          <div class="font-bold text-amber-300 flex items-center gap-2">
            <i data-lucide="key" class="w-4 h-4 text-amber-400"></i> ${escapeHtml(err.message)}
          </div>
          <p class="text-slate-300">
            To generate AI answers with multimodal diagrams, please enter your API Key in <strong>Settings (⚙️)</strong>.
          </p>
          <div class="flex items-center gap-2 pt-1">
            <button onclick="document.getElementById('settings-btn').click()" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-md">
              <i data-lucide="sliders" class="w-3.5 h-3.5"></i> Open Settings & Add API Key
            </button>
            <button onclick="document.getElementById('search-only-toggle').click(); document.getElementById('chat-form').dispatchEvent(new Event('submit'))" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition">
              View Manual Excerpts Only (Offline)
            </button>
          </div>
        </div>
      `;
      lucide.createIcons();
    } finally {
      isGenerating = false;
      sendBtn.disabled = false;
    }
  });

  function renderSearchOnlyResults(container, results) {
    if (!results || results.length === 0) {
      container.innerHTML = `<p class="text-slate-400 italic">No matching sections found in the manual for ${escapeHtml(vehicleProfile.engine)}.</p>`;
      return;
    }

    currentCitations = results;
    let html = `<div class="space-y-3">
      <div class="text-xs font-semibold text-amber-400 flex items-center justify-between gap-1.5 mb-2">
        <span class="flex items-center gap-1.5">
          <i data-lucide="file-search" class="w-4 h-4"></i>
          Search Results (${results.length} Excerpts)
        </span>
        <span class="text-[11px] text-slate-400 font-mono">Tailored for: ${escapeHtml(vehicleProfile.engine || 'General')}</span>
      </div>`;

    results.forEach((r) => {
      html += `
        <div class="p-3 bg-dark-850 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition">
          <div class="flex items-center justify-between text-xs">
            <button onclick="openPageViewer(${r.page_num}, '${escapeHtml(r.section)}')" class="font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition">
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[11px] border border-amber-500/40">Page ${r.page_num} ↗</span>
              <span>${escapeHtml(r.section)}</span>
            </button>
            <span class="text-slate-400 font-mono text-[10px]">Score: ${r.score}</span>
          </div>
          <pre class="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">${escapeHtml(r.snippet)}</pre>
          <button onclick="openPageViewer(${r.page_num}, '${escapeHtml(r.section)}')" class="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i> Open Full Factory Manual Page ${r.page_num}
          </button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
    lucide.createIcons();
  }

  function renderCitationsPills(container, citations) {
    if (!citations || citations.length === 0) return;
    container.classList.remove('hidden');
    container.innerHTML = `<span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider self-center mr-1">Sources:</span>`;

    citations.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'px-2.5 py-1 rounded-lg bg-dark-850 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-[11px] text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition shadow-sm group';
      btn.title = `Click to view Page ${c.page_num} in manual`;
      btn.innerHTML = `
        <i data-lucide="book-open" class="w-3 h-3 text-amber-400 group-hover:scale-110 transition"></i>
        <span class="font-mono font-bold text-amber-400">p.${c.page_num}</span>
        <span class="truncate max-w-[140px] text-slate-400 group-hover:text-slate-200">${c.section}</span>
      `;
      btn.addEventListener('click', () => openPageViewer(c.page_num, c.section));
      container.appendChild(btn);
    });
    lucide.createIcons();
  }

  function getActiveApiKey(provider) {
    if (provider === 'gemini') return geminiKeyInput.value.trim() || undefined;
    if (provider === 'groq') return groqKeyInput.value.trim() || undefined;
    if (provider === 'openai') return openaiKeyInput.value.trim() || undefined;
    return undefined;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize
  loadVehicleProfile();
  loadLocalSettings();
  loadQuickTopics();
  checkStatus();
  updateSavedChatsCount();
  updateContextMeter();
  initWorkstationInteractions();
});
