/**
 * Renault Mégane I (1995–2002) - Digital Interactive Schematics Engine
 * High-definition Vector Circuit Modeling with Live Simulation & Pinout Diagnostics
 *
 * Modeled OEM Circuits:
 * 1. Starter Motor 163 & Ignition 104 (with External Push-Button Bypass Simulator)
 * 2. Engine Management - Sirius 32 ECU 120 (with Injection 238 & Fuel Pump 236 Relays)
 * 3. Cooling Fan GMV 188 (with Low Speed 234 & High Speed 235 Relays + Temp Slider)
 * 4. Automatic Transmission AD4 / DP0 (TCU 119, Multifunction Switch 779, Solenoids)
 * 5. Charging Circuit - Alternator 103 & Battery 107
 */

(function(window) {
  'use strict';

  const CIRCUITS = {
    // -------------------------------------------------------------
    // CIRCUIT 1: STARTER MOTOR 163 & IGNITION SWITCH 104
    // -------------------------------------------------------------
    starter_circuit: {
      id: 'starter_circuit',
      title: 'Starter Motor 163 & Ignition Switch 104',
      titleAr: 'دائرة المارش 163 ومفتاح الكونتاك 104 (مع محاكي الزرار الخارجي)',
      manualPage: 92,
      category: 'Starting & Ignition',
      description: 'Official Renault circuit for Starter Motor 163, Ignition Switch (Neiman) 104, Solenoid Terminal 30 (B+) and Terminal 50 (Crank Trigger), with Interactive External Push-Button Modification.',
      state: {
        keyPosition: 'OFF', // 'OFF', 'ACC', 'ON', 'START'
        bypassConnected: false, // External push-button bypass mod
        bypassPressed: false,
        gearboxInNeutral: true // Inhibitor switch
      },
      pins: [
        { id: 'bat_pos', component: 'Battery 107', pin: '+12V', voltage: '12.6V DC', wire: '16 mm² Rouge (Red)', note: 'Permanent Battery Positive supply' },
        { id: 'bat_neg', component: 'Battery 107', pin: 'GND', voltage: '0V Earth', wire: '16 mm² Noir (Black)', note: 'Chassis & Gearbox ground braid' },
        { id: 'ign_bat', component: 'Ignition 104', pin: '+BAT', voltage: '12.6V DC', wire: '4 mm² Rouge (Red)', note: 'Direct feed from Maxi-fuse 60A' },
        { id: 'ign_apc', component: 'Ignition 104', pin: '+APC', voltage: '12.4V (Key ON)', wire: '2.5 mm² Jaune (Yellow)', note: 'After-contact switched +12V' },
        { id: 'ign_start', component: 'Ignition 104', pin: '+START', voltage: '12.2V (Cranking)', wire: '2.5 mm² Blanc/Jaune', note: 'Start trigger to starter solenoid' },
        { id: 'term_30', component: 'Starter 163', pin: 'Terminal 30', voltage: '12.6V Direct', wire: '16 mm² Rouge (Red)', note: 'Heavy copper stud directly from battery B+' },
        { id: 'term_50', component: 'Starter 163', pin: 'Terminal 50', voltage: '12V on crank / 0V off', wire: '2.5 mm² Jaune (Yellow)', note: 'Solenoid pull-in / hold-in coil trigger' },
        { id: 'starter_earth', component: 'Starter 163', pin: 'Casing Earth', voltage: '0V Ground', wire: 'Engine Block Bolt', note: 'Essential: clean contact with bellhousing' }
      ]
    },

    // -------------------------------------------------------------
    // CIRCUIT 2: ENGINE MANAGEMENT - SIRIUS 32 ECU 120 (K4M 16V)
    // -------------------------------------------------------------
    sirius32_ecu: {
      id: 'sirius32_ecu',
      title: 'Engine Management: Sirius 32 ECU (K4M 16V)',
      titleAr: 'كنترول المحرك Sirius 32 وحقن البنزين K4M (ريليهات 238 و 236)',
      manualPage: 550,
      category: 'Engine Management',
      description: 'Sirius 32 multipoint injection system with Main Locking Relay 238, Fuel Pump Relay 236, Injectors 1-4, TDC Sensor 149, and Ignition Coils.',
      state: {
        keyOn: false,
        engineRunning: false,
        relayMainClosed: false,
        relayFuelClosed: false
      },
      pins: [
        { id: 'ecu_gnd_3', component: 'ECU 120', pin: 'Pin 3 & 28', voltage: '0V Earth', wire: '1.0 mm² Noir (Black)', note: 'Power ground & electronic ground' },
        { id: 'ecu_bat_30', component: 'ECU 120', pin: 'Pin 29', voltage: '12.6V Direct', wire: '1.0 mm² Rouge (Red)', note: 'Memory backup permanent power feed' },
        { id: 'ecu_apc_66', component: 'ECU 120', pin: 'Pin 66', voltage: '12.4V (Key ON)', wire: '1.0 mm² Jaune (Yellow)', note: 'Switched ignition key input' },
        { id: 'ecu_relay_238', component: 'ECU 120', pin: 'Pin 33', voltage: '0V Ground trigger', wire: '0.6 mm² Blanc', note: 'Controls Main Relay 238 coil' },
        { id: 'ecu_fuel_236', component: 'ECU 120', pin: 'Pin 68', voltage: '0V Ground trigger', wire: '0.6 mm² Orange', note: 'Controls Fuel Pump Relay 236' },
        { id: 'tdc_pos', component: 'TDC Sensor 149', pin: 'Pins 24 & 54', voltage: 'AC Sine ~1.5V RMS', wire: 'Shielded Pair', note: 'Flywheel crank teeth sensor (200-250Ω)' },
        { id: 'inj_1', component: 'Injector 1', pin: 'Pin 59', voltage: 'Pulsed Ground', wire: '1.0 mm² Saumon', note: 'Sequential earth command Cyl 1' },
        { id: 'inj_2', component: 'Injector 2', pin: 'Pin 89', voltage: 'Pulsed Ground', wire: '1.0 mm² Gris', note: 'Sequential earth command Cyl 2' },
        { id: 'inj_3', component: 'Injector 3', pin: 'Pin 90', voltage: 'Pulsed Ground', wire: '1.0 mm² Vert', note: 'Sequential earth command Cyl 3' },
        { id: 'inj_4', component: 'Injector 4', pin: 'Pin 60', voltage: 'Pulsed Ground', wire: '1.0 mm² Blanc', note: 'Sequential earth command Cyl 4' }
      ]
    },

    // -------------------------------------------------------------
    // CIRCUIT 3: COOLING FAN SYSTEM (GMV 188 & RELAYS 234 / 235)
    // -------------------------------------------------------------
    cooling_fan: {
      id: 'cooling_fan',
      title: 'Cooling Fan Circuit (GMV 188 & Relays 234/235)',
      titleAr: 'دائرة مراوح التبريد GMV (كتاوت السرعة الأولى 234 والسرعة الثانية 235)',
      manualPage: 245,
      category: 'Cooling & HVAC',
      description: 'Dual-speed radiator cooling fan with Low-Speed Relay 234 through dropping resistor 700 (92°C) and High-Speed Relay 235 direct feed (98°C).',
      state: {
        coolantTemp: 85, // Celsius
        lowSpeedActive: false,
        highSpeedActive: false,
        acRequest: false,
        manualOverride: false // User modification toggle
      },
      pins: [
        { id: 'fan_low_relay', component: 'Relay 234 (Low)', pin: 'Pin 87', voltage: '8.5V (through resistor)', wire: '2.5 mm² Jaune/Bleu', note: 'Feeds dropping resistor 700 to fan motor' },
        { id: 'fan_high_relay', component: 'Relay 235 (High)', pin: 'Pin 87', voltage: '12.4V Full Direct', wire: '4.0 mm² Rouge/Blanc', note: 'Direct 12V high speed feed to fan motor' },
        { id: 'resistor_700', component: 'Resistor 700', pin: 'In/Out', voltage: 'Voltage Drop ~4V', wire: 'Ceramic Wirewound', note: '0.8 Ohm series dropping resistor' },
        { id: 'fan_motor_188', component: 'Fan Motor 188', pin: 'Power In', voltage: '8.5V / 12.4V', wire: 'Heavy terminal', note: 'Permanent magnet DC radiator fan motor' },
        { id: 'temp_switch_248', component: 'Switch 248 / Sensor', pin: 'Thermo Contacts', voltage: '0V Ground Trigger', wire: '1.0 mm² Blanc/Noir', note: 'Triggers relays at 92°C (low) & 98°C (high)' }
      ]
    },

    // -------------------------------------------------------------
    // CIRCUIT 4: AUTOMATIC TRANSMISSION (AD4 & DP0)
    // -------------------------------------------------------------
    transmission_ad4_dp0: {
      id: 'transmission_ad4_dp0',
      title: 'AD4 / DP0 Automatic Gearbox & Starter Lockout',
      titleAr: 'دائرة الفتيس الأوتوماتيك AD4/DP0 وقفل المارش في الـ P و N',
      manualPage: 378,
      category: 'Transmission Electronics',
      description: 'Transmission Control Unit (119), Multifunction switch (779), Shift Solenoids, and Starter Motor 163 inhibitor safety contact.',
      state: {
        gearPosition: 'P', // 'P', 'R', 'N', 'D', '3', '2', '1'
        starterAllowed: true
      },
      pins: [
        { id: 'tcu_119_feed', component: 'TCU 119', pin: 'Pin 1 & 2', voltage: '12.4V +APC', wire: '1.5 mm² Jaune (Yellow)', note: 'Main ECU power feed via fuse' },
        { id: 'multifunc_p_n', component: 'Switch 779', pin: 'Pins 3 & 4', voltage: '12V crank through', wire: '2.5 mm² Jaune/Blanc', note: 'Inhibitor switch: closed in P & N ONLY' },
        { id: 'sol_evm', component: 'Modulation Solenoid', pin: 'EVM', voltage: 'PWM 0-100%', wire: '1.0 mm² Bleu/Noir', note: 'Line pressure regulation solenoid valve' },
        { id: 'sol_e1', component: 'Shift Solenoid 1', pin: 'E1', voltage: '12V / 0V', wire: '1.0 mm² Vert', note: 'Gear selection sequence solenoid' }
      ]
    },

    // -------------------------------------------------------------
    // CIRCUIT 5: ALTERNATOR 103 & BATTERY CHARGING
    // -------------------------------------------------------------
    alternator_charging: {
      id: 'alternator_charging',
      title: 'Alternator 103 & Charging System',
      titleAr: 'دائرة شحن الدينامو 103 والبطارية 107 ولمبة التابلوه 247',
      manualPage: 176,
      category: 'Charging & Power',
      description: 'Alternator 103 charging circuit with Terminal B+ heavy battery lead and Terminal D+ exciter lamp on instrument cluster 247.',
      state: {
        engineSpinning: false,
        batteryVoltage: 12.6, // 12.6V off, 14.2V running
        warningLampOn: true
      },
      pins: [
        { id: 'alt_b_plus', component: 'Alternator 103', pin: 'Terminal B+', voltage: '14.2V (Running)', wire: '16 mm² Rouge (Red)', note: 'Heavy output charging terminal to Battery' },
        { id: 'alt_d_plus', component: 'Alternator 103', pin: 'Terminal D+ (L)', voltage: '14.0V / 1.5V', wire: '1.0 mm² Blanc (White)', note: 'Exciter field & instrument cluster warning lamp' },
        { id: 'cluster_lamp', component: 'Cluster 247', pin: 'Battery Warning', voltage: '12V key on / 0V running', wire: '1.0 mm² Jaune to D+', note: 'Extinguishes once alternator produces voltage' }
      ]
    }
  };

  // =============================================================
  // SVG SCHEMATIC BUILDERS
  // =============================================================

  /**
   * Generates SVG markup for the Starter Motor & Ignition Circuit
   */
  function generateStarterCircuitSVG(state) {
    const isCranking = state.keyPosition === 'START' || (state.bypassConnected && state.bypassPressed);
    const keyPos = state.keyPosition;
    const isBypass = state.bypassConnected;
    const isBypassPressed = state.bypassPressed;

    // Conductor status
    const bPlusColor = '#ef4444'; // Red permanent +12V
    const apcColor = (keyPos === 'ON' || keyPos === 'START') ? '#eab308' : '#475569'; // Yellow +APC
    const startColor = isCranking ? '#22c55e' : '#475569'; // Green active trigger to Terminal 50
    const starterSpinning = isCranking;
    const groundColor = '#3b82f6'; // Blue / earth

    return `
      <svg viewBox="0 0 880 440" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="starterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>

        <!-- Background grid styling -->
        <rect width="880" height="440" fill="#0b0f19" rx="16"/>
        <path d="M 0 50 L 880 50 M 0 100 L 880 100 M 0 150 L 880 150 M 0 200 L 880 200 M 0 250 L 880 250 M 0 300 L 880 300 M 0 350 L 880 350 M 0 400 L 880 400" stroke="#172033" stroke-width="0.8" stroke-dasharray="2 4"/>
        <path d="M 100 0 L 100 440 M 200 0 L 200 440 M 300 0 L 300 440 M 400 0 L 400 440 M 500 0 L 500 440 M 600 0 L 600 440 M 700 0 L 700 440 M 800 0 L 800 440" stroke="#172033" stroke-width="0.8" stroke-dasharray="2 4"/>

        <!-- TITLE BAR INSIDE SVG -->
        <text x="30" y="32" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" letter-spacing="1">
          CIRCUIT 163 & 104 // STARTER MOTOR & IGNITION SCHEMATIC
        </text>
        <text x="700" y="32" fill="#94a3b8" font-family="ui-monospace, monospace" font-size="11">
          OEM PAGE 92 / SECTION 10-48
        </text>

        <!-- ================= COMPONENT 1: BATTERY 107 ================= -->
        <g id="comp-battery" class="cursor-pointer" onclick="window.inspectSchematicPin('bat_pos')">
          <rect x="40" y="110" width="100" height="150" rx="10" fill="url(#starterGrad)" stroke="#334155" stroke-width="2"/>
          <text x="90" y="135" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">BATTERY [107]</text>
          <text x="90" y="152" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">12V 55Ah / 60Ah</text>
          
          <!-- Positive Post -->
          <rect x="110" y="95" width="20" height="15" fill="#ef4444" rx="3"/>
          <text x="120" y="90" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">+</text>
          
          <!-- Negative Post -->
          <rect x="50" y="95" width="20" height="15" fill="#3b82f6" rx="3"/>
          <text x="60" y="90" fill="#3b82f6" font-size="14" font-weight="bold" text-anchor="middle">-</text>

          <text x="90" y="240" fill="#e2e8f0" font-size="11" font-weight="bold" text-anchor="middle">12.60 V</text>
        </g>

        <!-- Earth / Ground from Battery -->
        <path d="M 60 95 L 60 70 L 25 70" stroke="${groundColor}" stroke-width="3" fill="none"/>
        <g transform="translate(15, 70)">
          <line x1="0" y1="-10" x2="0" y2="10" stroke="${groundColor}" stroke-width="2"/>
          <line x1="-5" y1="-7" x2="-5" y2="7" stroke="${groundColor}" stroke-width="2"/>
          <line x1="-10" y1="-4" x2="-10" y2="4" stroke="${groundColor}" stroke-width="2"/>
          <text x="-15" y="-14" fill="#64748b" font-size="9" text-anchor="end">Masse Carrosserie</text>
        </g>

        <!-- ================= COMPONENT 2: ENGINE BAY MAXI-FUSE 597 ================= -->
        <g id="comp-fuse" class="cursor-pointer">
          <rect x="190" y="120" width="70" height="50" rx="8" fill="#141c2e" stroke="#475569" stroke-width="1.5"/>
          <text x="225" y="142" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">FUSE 597</text>
          <text x="225" y="157" fill="#f59e0b" font-size="9" font-family="monospace" text-anchor="middle">Maxi 60A</text>
        </g>

        <!-- Wire from Battery + to Maxi Fuse -->
        <path d="M 120 95 L 120 60 L 225 60 L 225 120" stroke="${bPlusColor}" stroke-width="3.5" fill="none" filter="url(#glow-red)"/>
        <text x="175" y="52" fill="#fca5a5" font-size="9" font-family="monospace">16 mm² Rouge (+BAT)</text>

        <!-- ================= COMPONENT 3: IGNITION SWITCH 104 (NEIMAN) ================= -->
        <g id="comp-ignition" transform="translate(320, 90)">
          <rect x="0" y="0" width="160" height="150" rx="12" fill="url(#starterGrad)" stroke="${keyPos !== 'OFF' ? '#f59e0b' : '#334155'}" stroke-width="2"/>
          <text x="80" y="24" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle">IGNITION LOCK [104]</text>
          <text x="80" y="38" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">Contacteur Neiman</text>

          <!-- Key Positions Dial -->
          <circle cx="80" cy="85" r="34" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
          
          <!-- Key Positions Marks -->
          <text x="60" y="68" fill="${keyPos === 'OFF' ? '#f59e0b' : '#64748b'}" font-size="9" font-weight="bold">STOP</text>
          <text x="96" y="68" fill="${keyPos === 'ACC' ? '#f59e0b' : '#64748b'}" font-size="9" font-weight="bold">ACC</text>
          <text x="104" y="98" fill="${keyPos === 'ON' ? '#f59e0b' : '#64748b'}" font-size="9" font-weight="bold">ON</text>
          <text x="62" y="114" fill="${keyPos === 'START' ? '#22c55e' : '#64748b'}" font-size="9" font-weight="bold">START</text>

          <!-- Switch Contact Arm -->
          <line x1="80" y1="85" 
            x2="${keyPos === 'START' ? 66 : (keyPos === 'ON' ? 98 : (keyPos === 'ACC' ? 92 : 68))}" 
            y2="${keyPos === 'START' ? 104 : (keyPos === 'ON' ? 92 : (keyPos === 'ACC' ? 72 : 72))}" 
            stroke="${isCranking ? '#22c55e' : '#f59e0b'}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="80" cy="85" r="4" fill="#fbbf24"/>

          <!-- Terminals Inside Ignition -->
          <circle cx="15" cy="85" r="4" fill="#ef4444"/>
          <text x="24" y="89" fill="#fca5a5" font-size="9">+BAT</text>

          <circle cx="145" cy="85" r="4" fill="${apcColor}"/>
          <text x="118" y="89" fill="#fef08a" font-size="9">+APC</text>

          <circle cx="80" cy="138" r="4" fill="${startColor}"/>
          <text x="80" y="132" fill="#86efac" font-size="9" text-anchor="middle">50 Démarrage</text>
        </g>

        <!-- Wire from Maxi Fuse to Ignition +BAT -->
        <path d="M 260 145 L 320 175" stroke="${bPlusColor}" stroke-width="3" fill="none"/>

        <!-- ================= COMPONENT 4: STARTER MOTOR & SOLENOID 163 ================= -->
        <g id="comp-starter" transform="translate(600, 100)">
          <!-- Solenoid Assembly (Top) -->
          <rect x="20" y="20" width="130" height="75" rx="8" fill="#141c2e" stroke="${isCranking ? '#22c55e' : '#475569'}" stroke-width="2"/>
          <text x="85" y="40" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">SOLENOID (Relais)</text>
          
          <!-- Terminal 30 Stud -->
          <circle cx="40" cy="65" r="7" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"/>
          <text x="40" y="88" fill="#fca5a5" font-size="9" font-family="monospace" text-anchor="middle">Term. 30</text>
          
          <!-- Terminal 50 Spade -->
          <circle cx="120" cy="65" r="6" fill="${startColor}" stroke="#14532d" stroke-width="1.5"/>
          <text x="120" y="88" fill="#86efac" font-size="9" font-family="monospace" text-anchor="middle">Term. 50</text>

          <!-- Solenoid Plunger Contact Disk inside -->
          <line x1="70" y1="65" x2="90" y2="65" stroke="${isCranking ? '#22c55e' : '#64748b'}" stroke-width="3" stroke-dasharray="${isCranking ? 'none' : '2 2'}"/>

          <!-- Starter Motor Body (Bottom) -->
          <rect x="10" y="125" width="150" height="120" rx="16" fill="url(#starterGrad)" stroke="${starterSpinning ? '#22c55e' : '#334155'}" stroke-width="2.5"/>
          <text x="85" y="155" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">STARTER [163]</text>
          <text x="85" y="172" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Démarreur D6RA (1.1 kW)</text>

          <!-- Internal Motor Armature / Rotation Graphic -->
          <circle cx="85" cy="205" r="24" fill="#0b0f19" stroke="${starterSpinning ? '#22c55e' : '#475569'}" stroke-width="2"/>
          ${starterSpinning ? `
            <!-- Animated Spin Lines -->
            <path d="M 85 185 A 20 20 0 0 1 105 205" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M 85 225 A 20 20 0 0 1 65 205" stroke="#22c55e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <text x="85" y="209" fill="#22c55e" font-size="11" font-weight="bold" text-anchor="middle">SPINNING</text>
          ` : `
            <text x="85" y="209" fill="#64748b" font-size="10" text-anchor="middle">STOPPED</text>
          `}

          <!-- Internal Heavy Bridge wire from Solenoid to Motor -->
          <path d="M 85 95 L 85 125" stroke="${isCranking ? '#ef4444' : '#64748b'}" stroke-width="5" stroke-linecap="round"/>

          <!-- Engine Block Ground Contact -->
          <path d="M 160 210 L 195 210" stroke="${groundColor}" stroke-width="3.5" fill="none"/>
          <g transform="translate(200, 210)">
            <line x1="0" y1="-8" x2="0" y2="8" stroke="${groundColor}" stroke-width="2"/>
            <line x1="4" y1="-5" x2="4" y2="5" stroke="${groundColor}" stroke-width="2"/>
            <line x1="8" y1="-2" x2="8" y2="2" stroke="${groundColor}" stroke-width="2"/>
            <text x="14" y="4" fill="#64748b" font-size="9">Engine Earth</text>
          </g>
        </g>

        <!-- ================= HEAVY RED FEED TO TERMINAL 30 ================= -->
        <!-- Direct battery heavy lead to Starter Stud 30 -->
        <path d="M 120 60 L 640 60 L 640 165" stroke="${bPlusColor}" stroke-width="4.5" fill="none" filter="url(#glow-red)"/>
        <text x="430" y="52" fill="#f87171" font-size="10" font-family="monospace">Direct B+ Battery Lead (16 mm² Rouge)</text>

        <!-- ================= FACTORY START SIGNAL: WIRE TO TERMINAL 50 ================= -->
        <path d="M 400 240 L 400 300 L 720 300 L 720 180" stroke="${startColor}" stroke-width="3" fill="none" ${isCranking ? 'filter="url(#glow-green)"' : ''}/>
        <text x="530" y="292" fill="${isCranking ? '#86efac' : '#94a3b8'}" font-size="10" font-family="monospace">
          Factory Trigger: 2.5 mm² Jaune (Pin 50) ${isCranking ? '[12.2V]' : '[0V]'}
        </text>

        <!-- ================= CUSTOM EXTERNAL STARTER PUSH-BUTTON BYPASS MOD ================= -->
        ${isBypass ? `
          <!-- Custom Modification Layer -->
          <g id="custom-bypass-circuit">
            <!-- Spliced Wire from Battery +12V -->
            <path d="M 225 60 L 225 360 L 370 360" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4 3" fill="none"/>
            <circle cx="225" cy="60" r="4" fill="#f59e0b"/>
            
            <!-- In-Line Fuse 20A -->
            <rect x="300" y="348" width="45" height="24" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
            <text x="322" y="364" fill="#fde047" font-size="9" font-weight="bold" text-anchor="middle">20A</text>

            <!-- External Momentary Push Button Switch -->
            <rect x="370" y="335" width="120" height="50" rx="8" fill="#1e293b" stroke="${isBypassPressed ? '#22c55e' : '#f59e0b'}" stroke-width="2"/>
            <text x="430" y="354" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">EXTERNAL PUSH-BUTTON</text>
            <text x="430" y="372" fill="${isBypassPressed ? '#86efac' : '#f59e0b'}" font-size="9" font-family="monospace" text-anchor="middle">
              ${isBypassPressed ? 'PRESSED [CLOSED]' : 'RELEASED [OPEN]'}
            </text>

            <!-- Lead from Push Button to Terminal 50 -->
            <path d="M 490 360 L 720 360 L 720 300" stroke="${isBypassPressed ? '#22c55e' : '#f59e0b'}" stroke-width="2.5" stroke-dasharray="4 3" fill="none" ${isBypassPressed ? 'filter="url(#glow-green)"' : ''}/>
            <circle cx="720" cy="300" r="4" fill="${isBypassPressed ? '#22c55e' : '#f59e0b'}"/>
            
            <text x="540" y="378" fill="#fef08a" font-size="9" font-family="monospace">
              External Bypass Lead (Direct to Terminal 50)
            </text>
          </g>
        ` : ''}

        <!-- LIVE STATUS BADGE BOTTOM LEFT -->
        <g transform="translate(40, 390)">
          <rect x="0" y="0" width="360" height="36" rx="8" fill="#141c2e" stroke="#334155"/>
          <circle cx="20" cy="18" r="6" fill="${starterSpinning ? '#22c55e' : '#64748b'}"/>
          <text x="36" y="22" fill="#f8fafc" font-size="10" font-weight="bold">
            STATUS: ${starterSpinning ? 'CRANKING (Solenoid Pulled In & Motor Spinning)' : (keyPos === 'ON' ? 'IGNITION ON (+APC Active)' : 'ENGINE AT REST')}
          </text>
        </g>
      </svg>
    `;
  }

  /**
   * Generates SVG markup for the Sirius 32 Injection & Relays Circuit
   */
  function generateSirius32SVG(state) {
    const isKeyOn = state.keyOn;
    const isRunning = state.engineRunning;
    const mainRelay = state.relayMainClosed || isKeyOn;
    const fuelRelay = state.relayFuelClosed || (isKeyOn && isRunning);

    const mainFeedColor = mainRelay ? '#eab308' : '#475569';
    const fuelFeedColor = fuelRelay ? '#22c55e' : '#475569';
    const pulseColor = isRunning ? '#38bdf8' : '#475569';

    return `
      <svg viewBox="0 0 880 440" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="880" height="440" fill="#0b0f19" rx="16"/>
        <path d="M 0 50 L 880 50 M 0 100 L 880 100 M 0 150 L 880 150 M 0 200 L 880 200 M 0 250 L 880 250 M 0 300 L 880 300 M 0 350 L 880 350 M 0 400 L 880 400" stroke="#172033" stroke-width="0.8" stroke-dasharray="2 4"/>

        <!-- Header -->
        <text x="30" y="32" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" letter-spacing="1">
          CIRCUIT 120 // SIRIUS 32 INJECTION & RELAY MANAGEMENT (K4M 16V)
        </text>
        <text x="700" y="32" fill="#94a3b8" font-family="monospace" font-size="11">
          OEM PAGE 550 / TRACK 17
        </text>

        <!-- MAIN LOCKING RELAY 238 -->
        <g transform="translate(50, 70)">
          <rect x="0" y="0" width="150" height="110" rx="10" fill="#141c2e" stroke="${mainRelay ? '#eab308' : '#334155'}" stroke-width="2"/>
          <text x="75" y="24" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">RELAY 238 [MAIN]</text>
          <text x="75" y="38" fill="#94a3b8" font-size="9" text-anchor="middle">Verrouillage Injection</text>

          <circle cx="30" cy="65" r="5" fill="#ef4444"/>
          <text x="30" y="85" fill="#fca5a5" font-size="9" text-anchor="middle">30 (+BAT)</text>

          <circle cx="120" cy="65" r="5" fill="${mainFeedColor}"/>
          <text x="120" y="85" fill="#fde047" font-size="9" text-anchor="middle">87 (Load)</text>

          <line x1="35" y1="65" x2="${mainRelay ? 115 : 100}" y2="${mainRelay ? 65 : 55}" stroke="${mainRelay ? '#eab308' : '#64748b'}" stroke-width="2.5"/>
        </g>

        <!-- FUEL PUMP RELAY 236 -->
        <g transform="translate(50, 220)">
          <rect x="0" y="0" width="150" height="110" rx="10" fill="#141c2e" stroke="${fuelRelay ? '#22c55e' : '#334155'}" stroke-width="2"/>
          <text x="75" y="24" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">RELAY 236 [FUEL PUMP]</text>
          <text x="75" y="38" fill="#94a3b8" font-size="9" text-anchor="middle">Relais Pompe Essence</text>

          <circle cx="30" cy="65" r="5" fill="#ef4444"/>
          <text x="30" y="85" fill="#fca5a5" font-size="9" text-anchor="middle">30 (+BAT)</text>

          <circle cx="120" cy="65" r="5" fill="${fuelFeedColor}"/>
          <text x="120" y="85" fill="#86efac" font-size="9" text-anchor="middle">87 (Pump)</text>

          <line x1="35" y1="65" x2="${fuelRelay ? 115 : 100}" y2="${fuelRelay ? 65 : 55}" stroke="${fuelRelay ? '#22c55e' : '#64748b'}" stroke-width="2.5"/>
        </g>

        <!-- SIRIUS 32 ECU 120 (CENTER) -->
        <g transform="translate(290, 80)">
          <rect x="0" y="0" width="220" height="260" rx="14" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="110" y="30" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">SIRIUS 32 ECU [120]</text>
          <text x="110" y="46" fill="#94a3b8" font-size="10" text-anchor="middle">Siemens 90-Way Connector</text>

          <g font-family="monospace" font-size="9" fill="#cbd5e1">
            <text x="15" y="80">Pin 29: +12V Direct</text>
            <text x="15" y="105">Pin 66: +12V Key ON</text>
            <text x="15" y="130">Pin 33: Main Relay Out</text>
            <text x="15" y="155">Pin 68: Fuel Relay Out</text>
            <text x="15" y="185">Pin 24/54: TDC Sensor</text>
            <text x="15" y="215">Pins 59,89,90,60: Inj</text>
            <text x="15" y="240">Pins 3 & 28: Ground</text>
          </g>

          <circle cx="195" cy="25" r="5" fill="${isKeyOn ? '#22c55e' : '#ef4444'}"/>
        </g>

        <!-- INJECTORS (RIGHT) -->
        <g transform="translate(590, 70)">
          <text x="110" y="0" fill="#e2e8f0" font-size="11" font-weight="bold">INJECTORS 1 - 4 (K4M 16V)</text>
          
          <path d="M -220 65 L 120 65" stroke="${mainFeedColor}" stroke-width="3" fill="none"/>
          <text x="-50" y="56" fill="#fde047" font-size="9" font-family="monospace">+12V Rail from Relay 238</text>

          ${[1, 2, 3, 4].map((cyl, idx) => `
            <g transform="translate(${idx * 60}, 80)">
              <rect x="0" y="0" width="45" height="90" rx="6" fill="#141c2e" stroke="${isRunning ? '#38bdf8' : '#475569'}" stroke-width="1.5"/>
              <text x="22" y="20" fill="#f8fafc" font-size="9" font-weight="bold" text-anchor="middle">INJ ${cyl}</text>
              <circle cx="22" cy="70" r="6" fill="${isRunning ? '#38bdf8' : '#334155'}"/>
              <text x="22" y="105" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">Pin ${[59, 89, 90, 60][idx]}</text>
            </g>
          `).join('')}
        </g>

        <!-- FLYWHEEL TDC SENSOR 149 (BOTTOM RIGHT) -->
        <g transform="translate(590, 230)">
          <rect x="0" y="0" width="240" height="90" rx="10" fill="#141c2e" stroke="${isRunning ? '#38bdf8' : '#334155'}" stroke-width="1.5"/>
          <text x="120" y="24" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">TDC / FLYWHEEL SENSOR [149]</text>
          <text x="120" y="40" fill="#94a3b8" font-size="9" text-anchor="middle">Capteur PMH (200 - 250 Ohms)</text>
          
          <path d="M 30 65 Q 45 50 60 65 T 90 65 T 120 65" stroke="${pulseColor}" stroke-width="2" fill="none"/>
          <text x="180" y="68" fill="${pulseColor}" font-size="10" font-family="monospace">
            ${isRunning ? '850 RPM Pulse' : '0 RPM (Static)'}
          </text>
        </g>
      </svg>
    `;
  }

  /**
   * Generates SVG markup for the Cooling Fan Circuit (GMV)
   */
  function generateCoolingFanSVG(state) {
    const temp = state.coolantTemp || 85;
    const isLow = temp >= 92 || state.lowSpeedActive || state.acRequest;
    const isHigh = temp >= 98 || state.highSpeedActive || state.manualOverride;

    const fanSpeedLabel = isHigh ? 'MAX HIGH SPEED (Direct 12V)' : (isLow ? 'LOW SPEED (Through 0.8Ω Resistor)' : 'FAN STOPPED');
    const fanSpeedColor = isHigh ? '#ef4444' : (isLow ? '#eab308' : '#64748b');

    return `
      <svg viewBox="0 0 880 440" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="880" height="440" fill="#0b0f19" rx="16"/>
        <path d="M 0 50 L 880 50 M 0 100 L 880 100 M 0 150 L 880 150 M 0 200 L 880 200 M 0 250 L 880 250 M 0 300 L 880 300 M 0 350 L 880 350 M 0 400 L 880 400" stroke="#172033" stroke-width="0.8" stroke-dasharray="2 4"/>

        <text x="30" y="32" fill="#fbbf24" font-size="13" font-weight="bold" letter-spacing="1">
          CIRCUIT 188 // COOLING FAN GMV & DUAL STAGE RELAYS (234 & 235)
        </text>
        <text x="700" y="32" fill="#94a3b8" font-family="monospace" font-size="11">
          OEM PAGE 245 / SECTION 19
        </text>

        <!-- THERMOSTAT / TEMP SENSOR (LEFT) -->
        <g transform="translate(50, 90)">
          <rect x="0" y="0" width="160" height="170" rx="12" fill="#141c2e" stroke="#334155" stroke-width="2"/>
          <text x="80" y="28" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">TEMP SWITCH / SENSOR</text>
          <text x="80" y="44" fill="#94a3b8" font-size="9" text-anchor="middle">Radiator Thermo-contact 248</text>

          <circle cx="80" cy="105" r="40" fill="#0f172a" stroke="${temp > 95 ? '#ef4444' : '#38bdf8'}" stroke-width="2.5"/>
          <text x="80" y="105" fill="#f8fafc" font-size="18" font-weight="bold" font-family="monospace" text-anchor="middle">${temp}°C</text>
          <text x="80" y="125" fill="#94a3b8" font-size="9" text-anchor="middle">Coolant Temp</text>

          <text x="80" y="160" fill="${temp >= 92 ? '#f59e0b' : '#64748b'}" font-size="9" font-weight="bold" text-anchor="middle">
            Stage 1: 92°C | Stage 2: 98°C
          </text>
        </g>

        <!-- RELAY 234: LOW SPEED -->
        <g transform="translate(280, 80)">
          <rect x="0" y="0" width="150" height="100" rx="10" fill="#141c2e" stroke="${isLow ? '#eab308' : '#334155'}" stroke-width="2"/>
          <text x="75" y="24" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">RELAY 234 [LOW SPEED]</text>
          <text x="75" y="38" fill="#94a3b8" font-size="9" text-anchor="middle">Low Stage Relay (92°C)</text>

          <circle cx="125" cy="65" r="5" fill="${isLow ? '#eab308' : '#475569'}"/>
          <text x="125" y="85" fill="#fef08a" font-size="9" text-anchor="middle">87 Out</text>
        </g>

        <!-- RELAY 235: HIGH SPEED -->
        <g transform="translate(280, 210)">
          <rect x="0" y="0" width="150" height="100" rx="10" fill="#141c2e" stroke="${isHigh ? '#ef4444' : '#334155'}" stroke-width="2"/>
          <text x="75" y="24" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">RELAY 235 [HIGH SPEED]</text>
          <text x="75" y="38" fill="#94a3b8" font-size="9" text-anchor="middle">Direct 12V Stage (98°C)</text>

          <circle cx="125" cy="65" r="5" fill="${isHigh ? '#ef4444' : '#475569'}"/>
          <text x="125" y="85" fill="#fca5a5" font-size="9" text-anchor="middle">87 Out</text>
        </g>

        <!-- DROPPING RESISTOR 700 -->
        <g transform="translate(490, 110)">
          <rect x="0" y="0" width="80" height="45" rx="6" fill="#1e293b" stroke="#eab308" stroke-width="1.5"/>
          <text x="40" y="22" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">RESISTOR 700</text>
          <text x="40" y="37" fill="#fde047" font-size="9" font-family="monospace" text-anchor="middle">0.8 Ω (Drop 4V)</text>
        </g>

        <!-- FAN MOTOR 188 -->
        <g transform="translate(630, 110)">
          <circle cx="90" cy="90" r="75" fill="#0f172a" stroke="${fanSpeedColor}" stroke-width="3"/>
          <text x="90" y="75" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">FAN MOTOR [188]</text>
          <text x="90" y="95" fill="#94a3b8" font-size="10" text-anchor="middle">GMV Radiateur</text>
          
          <text x="90" y="125" fill="${fanSpeedColor}" font-size="10" font-weight="bold" text-anchor="middle">
            ${isHigh ? '🌀 2,800 RPM' : (isLow ? '💨 1,400 RPM' : '0 RPM')}
          </text>
        </g>

        <!-- LIVE BANNER -->
        <g transform="translate(40, 380)">
          <rect x="0" y="0" width="380" height="38" rx="8" fill="#141c2e" stroke="#334155"/>
          <text x="20" y="24" fill="${fanSpeedColor}" font-size="11" font-weight="bold">
            GMV FAN STATUS: ${fanSpeedLabel}
          </text>
        </g>
      </svg>
    `;
  }

  /**
   * Generates SVG markup for the Automatic Transmission (AD4 & DP0) Circuit
   */
  function generateTransmissionSVG(state) {
    const gear = state.gearPosition || 'P';
    const isAllowed = ['P', 'N'].includes(gear);
    const starterColor = isAllowed ? '#10b981' : '#ef4444';
    const statusText = isAllowed ? 'STARTER PERMITTED (Inhibitor Circuit Closed)' : 'STARTER INHIBITED (Circuit Open in Gear - Safety Lockout)';

    return `
      <svg viewBox="0 0 880 440" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="880" height="440" fill="#0b0f19" rx="16"/>
        <path d="M 0 50 L 880 50 M 0 100 L 880 100 M 0 150 L 880 150 M 0 200 L 880 200 M 0 250 L 880 250 M 0 300 L 880 300 M 0 350 L 880 350 M 0 400 L 880 400" stroke="#172033" stroke-width="0.8" stroke-dasharray="2 4"/>

        <text x="30" y="32" fill="#fbbf24" font-size="13" font-weight="bold" letter-spacing="1">
          CIRCUIT AD4/DP0 // AUTOMATIC TRANSMISSION ECU 119 &amp; MULTIFUNCTION SWITCH 779
        </text>
        <text x="700" y="32" fill="#94a3b8" font-family="monospace" font-size="11">
          OEM PAGE 378 / SECTION 23
        </text>

        <!-- MULTIFUNCTION SWITCH 779 (LEFT) -->
        <g transform="translate(50, 75)">
          <rect x="0" y="0" width="220" height="230" rx="12" fill="#141c2e" stroke="#334155" stroke-width="2"/>
          <text x="110" y="26" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">MULTIFUNCTION SWITCH 779</text>
          <text x="110" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">Gearbox Position Switch (CMF)</text>

          <!-- Current Gear Badge -->
          <circle cx="110" cy="100" r="36" fill="#0f172a" stroke="${isAllowed ? '#10b981' : '#f59e0b'}" stroke-width="2.5"/>
          <text x="110" y="108" fill="#f8fafc" font-size="28" font-weight="bold" font-family="monospace" text-anchor="middle">${gear}</text>
          <text x="110" y="150" fill="#94a3b8" font-size="10" text-anchor="middle">Selected Selector Lever</text>

          <!-- Inhibitor Switch Contacts -->
          <rect x="25" y="170" width="170" height="42" rx="8" fill="#0f172a" stroke="${starterColor}" stroke-width="1.5"/>
          <text x="110" y="188" fill="${starterColor}" font-size="10" font-weight="bold" text-anchor="middle">
            Pins 3 &amp; 4: ${isAllowed ? 'CLOSED (12V PASS)' : 'OPEN (BLOCKED)'}
          </text>
          <text x="110" y="202" fill="#94a3b8" font-size="8" text-anchor="middle">Starter Inhibitor Contact</text>
        </g>

        <!-- TRANSMISSION ECU 119 (CENTER) -->
        <g transform="translate(330, 75)">
          <rect x="0" y="0" width="230" height="230" rx="12" fill="#141c2e" stroke="#38bdf8" stroke-width="2"/>
          <text x="115" y="26" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">TRANSMISSION ECU 119</text>
          <text x="115" y="42" fill="#38bdf8" font-size="9" font-family="monospace" text-anchor="middle">Siemens TA2000 / DP0 Auto</text>

          <g transform="translate(20, 60)">
            <rect x="0" y="0" width="190" height="30" rx="6" fill="#1e293b"/>
            <text x="10" y="18" fill="#f8fafc" font-size="9">Pin 1: +12V After Ignition</text>
            <circle cx="175" cy="15" r="4" fill="#fbbf24"/>
          </g>

          <g transform="translate(20, 100)">
            <rect x="0" y="0" width="190" height="30" rx="6" fill="#1e293b"/>
            <text x="10" y="18" fill="#f8fafc" font-size="9">EVM Solenoid Pressure PWM</text>
            <circle cx="175" cy="15" r="4" fill="#38bdf8"/>
          </g>

          <g transform="translate(20, 140)">
            <rect x="0" y="0" width="190" height="30" rx="6" fill="#1e293b"/>
            <text x="10" y="18" fill="#f8fafc" font-size="9">E1 / E2 Shift Valves</text>
            <circle cx="175" cy="15" r="4" fill="#10b981"/>
          </g>

          <g transform="translate(20, 180)">
            <rect x="0" y="0" width="190" height="30" rx="6" fill="#1e293b"/>
            <text x="10" y="18" fill="#f8fafc" font-size="9">CAN-Bus Link to Sirius 32</text>
            <circle cx="175" cy="15" r="4" fill="#c084fc"/>
          </g>
        </g>

        <!-- STARTER MOTOR 163 & SOLENOID (RIGHT) -->
        <g transform="translate(620, 85)">
          <rect x="0" y="0" width="210" height="210" rx="12" fill="#141c2e" stroke="${starterColor}" stroke-width="2"/>
          <text x="105" y="28" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">STARTER MOTOR 163</text>
          <text x="105" y="44" fill="#94a3b8" font-size="9" text-anchor="middle">Terminal 50 Crank Solenoid</text>

          <circle cx="105" cy="110" r="42" fill="#0f172a" stroke="${starterColor}" stroke-width="2.5"/>
          <text x="105" y="108" fill="${starterColor}" font-size="12" font-weight="bold" text-anchor="middle">
            ${isAllowed ? 'CRANK PERMITTED' : 'LOCKED OUT'}
          </text>
          <text x="105" y="126" fill="#94a3b8" font-size="9" text-anchor="middle">
            ${isAllowed ? 'Power allowed' : 'No 12V to Solenoid'}
          </text>

          <text x="105" y="185" fill="${starterColor}" font-size="10" font-weight="bold" text-anchor="middle">
            Terminal 50: ${isAllowed ? '12V Ready' : '0V Inhibited'}
          </text>
        </g>

        <!-- WIRE FROM SWITCH 779 TO STARTER 163 -->
        <path d="M 270 191 L 620 191" stroke="${starterColor}" stroke-width="3" stroke-dasharray="${isAllowed ? 'none' : '4 4'}"/>

        <!-- STATUS BANNER (BOTTOM) -->
        <g transform="translate(40, 360)">
          <rect x="0" y="0" width="800" height="45" rx="10" fill="#141c2e" stroke="#334155"/>
          <circle cx="25" cy="22" r="7" fill="${starterColor}"/>
          <text x="45" y="26" fill="${starterColor}" font-size="12" font-weight="bold">
            ${statusText} (Current: Position ${gear})
          </text>
        </g>
      </svg>
    `;
  }

  /**
   * Generates SVG markup for the Alternator 103 & Battery Charging Circuit
   */
  function generateAlternatorSVG(state) {
    const isSpinning = state.engineSpinning || false;
    const voltage = isSpinning ? (state.batteryVoltage || 14.4) : 12.6;
    const lampColor = isSpinning ? '#475569' : '#ef4444';
    const statusText = isSpinning 
      ? `ALTERNATOR CHARGING // Output: ${voltage}V (Healthy Battery Charging Current Flowing)`
      : 'ENGINE STOPPED // Alternator at Rest (Battery Output: 12.6V, Warning Lamp Illuminated)';

    return `
      <svg viewBox="0 0 880 440" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="880" height="440" fill="#0b0f19" rx="16"/>
        <path d="M 0 50 L 880 50 M 0 100 L 880 100 M 0 150 L 880 150 M 0 200 L 880 200 M 0 250 L 880 250 M 0 300 L 880 300 M 0 350 L 880 350 M 0 400 L 880 400" stroke="#172033" stroke-width="0.8" stroke-dasharray="2 4"/>

        <text x="30" y="32" fill="#fbbf24" font-size="13" font-weight="bold" letter-spacing="1">
          CIRCUIT 103 // ALTERNATOR &amp; 12V BATTERY CHARGING SYSTEM
        </text>
        <text x="700" y="32" fill="#94a3b8" font-family="monospace" font-size="11">
          OEM PAGE 90 / SECTION 16
        </text>

        <!-- ALTERNATOR 103 (LEFT) -->
        <g transform="translate(60, 80)">
          <rect x="0" y="0" width="220" height="230" rx="14" fill="#141c2e" stroke="${isSpinning ? '#10b981' : '#334155'}" stroke-width="2"/>
          <text x="110" y="28" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">ALTERNATOR [103]</text>
          <text x="110" y="44" fill="#94a3b8" font-size="9" text-anchor="middle">Valeo / Bosch 14V 80A / 110A</text>

          <!-- Stator / Pulley visualization -->
          <circle cx="110" cy="115" r="48" fill="#0f172a" stroke="${isSpinning ? '#10b981' : '#475569'}" stroke-width="3"/>
          <text x="110" y="112" fill="${isSpinning ? '#10b981' : '#94a3b8'}" font-size="11" font-weight="bold" text-anchor="middle">
            ${isSpinning ? 'SPINNING' : 'STOPPED'}
          </text>
          <text x="110" y="128" fill="#94a3b8" font-size="9" text-anchor="middle">
            ${isSpinning ? '~2,500 RPM' : '0 RPM'}
          </text>

          <text x="110" y="195" fill="${isSpinning ? '#38bdf8' : '#64748b'}" font-size="10" font-weight="bold" text-anchor="middle">
            Internal Regulator: ${isSpinning ? 'ACTIVE (14.4V)' : 'STANDBY'}
          </text>
        </g>

        <!-- CHARGING CABLE B+ (HEAVY 16mm² RED) -->
        <path d="M 280 150 L 400 150 L 400 190 L 520 190" stroke="${isSpinning ? '#ef4444' : '#7f1d1d'}" stroke-width="5" class="${isSpinning ? 'wire-live' : ''}"/>
        <text x="400" y="138" fill="#fca5a5" font-size="9" font-family="monospace" text-anchor="middle">Terminal B+ (16 mm² Rouge RG)</text>

        <!-- BATTERY 107 (CENTER-RIGHT) -->
        <g transform="translate(520, 100)">
          <rect x="0" y="0" width="180" height="180" rx="12" fill="#141c2e" stroke="#334155" stroke-width="2"/>
          <text x="90" y="26" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">12V BATTERY [107]</text>
          <text x="90" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">Lead Acid 12V 55Ah</text>

          <rect x="25" y="65" width="130" height="60" rx="8" fill="#0f172a" stroke="${isSpinning ? '#10b981' : '#f59e0b'}" stroke-width="2"/>
          <text x="90" y="98" fill="${isSpinning ? '#10b981' : '#fbbf24'}" font-size="20" font-weight="bold" font-family="monospace" text-anchor="middle">
            ${voltage}V
          </text>
          <text x="90" y="115" fill="#94a3b8" font-size="8" text-anchor="middle">Terminal Voltage</text>

          <text x="90" y="155" fill="${isSpinning ? '#10b981' : '#94a3b8'}" font-size="9" font-weight="bold" text-anchor="middle">
            State: ${isSpinning ? 'CHARGING (+18A)' : 'DISCHARGE'}
          </text>
        </g>

        <!-- INSTRUMENT CLUSTER BATTERY WARNING LIGHT (TOP-RIGHT) -->
        <g transform="translate(730, 80)">
          <rect x="0" y="0" width="110" height="100" rx="10" fill="#141c2e" stroke="#334155"/>
          <text x="55" y="24" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">CLUSTER [247]</text>
          <text x="55" y="38" fill="#94a3b8" font-size="8" text-anchor="middle">Battery Light 111</text>

          <!-- Battery Symbol -->
          <rect x="35" y="50" width="40" height="28" rx="4" fill="${lampColor}" stroke="#f8fafc" stroke-width="1.5"/>
          <rect x="42" y="45" width="6" height="5" fill="#f8fafc"/>
          <rect x="62" y="45" width="6" height="5" fill="#f8fafc"/>
          <text x="55" y="70" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">+-</text>

          <text x="55" y="92" fill="${isSpinning ? '#64748b' : '#fca5a5'}" font-size="8" font-weight="bold" text-anchor="middle">
            ${isSpinning ? 'EXTINGUISHED' : 'GLOWING RED'}
          </text>
        </g>

        <!-- D+ EXCITER WIRE FROM ALT TO CLUSTER -->
        <path d="M 280 230 L 785 230 L 785 180" stroke="${isSpinning ? '#eab308' : '#713f12'}" stroke-width="2" stroke-dasharray="3 3"/>
        <text x="500" y="245" fill="#fde047" font-size="8" font-family="monospace">Terminal D+ / L Exciter Wire (1.0 mm² Blanc/Jaune)</text>

        <!-- STATUS BANNER (BOTTOM) -->
        <g transform="translate(40, 360)">
          <rect x="0" y="0" width="800" height="45" rx="10" fill="#141c2e" stroke="#334155"/>
          <circle cx="25" cy="22" r="7" fill="${isSpinning ? '#10b981' : '#ef4444'}"/>
          <text x="45" y="26" fill="${isSpinning ? '#10b981' : '#fca5a5'}" font-size="12" font-weight="bold">
            ${statusText}
          </text>
        </g>
      </svg>
    `;
  }

  // =============================================================
  // INTERACTIVE WIDGET COMPONENT
  // =============================================================

  /**
   * Mounts a complete interactive digital schematic widget into a DOM container
   * @param {string} circuitId
   * @param {HTMLElement|string} container
   * @param {Object} options
   */
  function renderInteractiveWidget(circuitId, container, options = {}) {
    const targetEl = typeof container === 'string' ? document.getElementById(container) : container;
    if (!targetEl) return;

    const circuit = CIRCUITS[circuitId] || CIRCUITS['starter_circuit'];
    let state = Object.assign({}, circuit.state, options.initialState || {});
    let viewMode = 'digital'; // 'digital' or 'oem_scan'

    const widgetId = 'schematic_widget_' + Math.random().toString(36).substring(2, 9);

    function updateView() {
      const svgContainer = targetEl.querySelector('.schematic-svg-mount');
      const scanContainer = targetEl.querySelector('.schematic-scan-mount');
      if (viewMode === 'digital') {
        if (svgContainer) {
          svgContainer.innerHTML = window.SchematicsEngine.renderSVG(circuit.id, state);
          svgContainer.classList.remove('hidden');
        }
        if (scanContainer) scanContainer.classList.add('hidden');
      } else {
        if (svgContainer) svgContainer.classList.add('hidden');
        if (scanContainer) {
          scanContainer.classList.remove('hidden');
          scanContainer.innerHTML = `
            <div class="relative bg-slate-950 p-2 flex flex-col items-center justify-center min-h-[350px]">
              <img src="/api/pdf/render/${circuit.manualPage}" alt="OEM Manual Page ${circuit.manualPage}" class="max-h-[420px] object-contain rounded-lg border border-slate-800">
              <span class="mt-2 text-xs text-slate-400 font-mono">Original Factory Manual Scanned Page ${circuit.manualPage}</span>
            </div>
          `;
        }
      }
    }

    // Build markup
    targetEl.innerHTML = `
      <div id="${widgetId}" class="rounded-2xl border border-amber-500/40 bg-[#0e1422] shadow-2xl overflow-hidden my-3">
        <!-- Top Control Bar -->
        <div class="px-4 py-3 bg-[#121929] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <div>
              <h3 class="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
                <span>${circuit.title}</span>
              </h3>
              <p class="text-[11px] text-slate-400">${circuit.titleAr}</p>
            </div>
          </div>

          <div class="flex items-center gap-1.5 text-xs">
            <!-- View Mode Switcher -->
            <div class="flex items-center bg-dark-850 p-0.5 rounded-lg border border-slate-800">
              <button type="button" class="btn-view-digital px-2.5 py-1 rounded-md font-semibold text-[11px] transition ${viewMode === 'digital' ? 'bg-amber-500 text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}">
                ⚡ Interactive Vector
              </button>
              <button type="button" class="btn-view-scan px-2.5 py-1 rounded-md font-semibold text-[11px] transition ${viewMode === 'oem_scan' ? 'bg-amber-500 text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}">
                📄 OEM Page ${circuit.manualPage}
              </button>
            </div>

            <button type="button" class="btn-open-fullscreen p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-300 transition" title="Open Fullscreen Studio">
              <i data-lucide="maximize-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- SVG Canvas Viewport -->
        <div class="schematic-svg-mount relative bg-[#0b0f19] min-h-[300px] sm:min-h-[380px] p-2 flex items-center justify-center"></div>
        <div class="schematic-scan-mount hidden"></div>

        <!-- Interactive Simulation Toolbar -->
        <div class="p-3 bg-[#121a2c] border-t border-slate-800 space-y-3">
          
          ${circuit.id === 'starter_circuit' ? `
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              
              <!-- Ignition Key Position Selector -->
              <div class="flex items-center gap-2">
                <span class="text-slate-400 font-medium">Ignition Key:</span>
                <div class="flex items-center bg-dark-850 border border-slate-700/80 rounded-lg p-0.5">
                  <button type="button" class="key-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition ${state.keyPosition === 'OFF' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}" data-pos="OFF">STOP</button>
                  <button type="button" class="key-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition ${state.keyPosition === 'ACC' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'}" data-pos="ACC">ACC</button>
                  <button type="button" class="key-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition ${state.keyPosition === 'ON' ? 'bg-amber-500 text-dark-950 font-bold' : 'text-slate-400'}" data-pos="ON">ON (+APC)</button>
                  <button type="button" class="key-crank-btn px-3 py-1 rounded font-bold text-[11px] transition bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95">CRANK 🔑</button>
                </div>
              </div>

              <!-- Custom Modification: Push Button Bypass Toggle -->
              <div class="flex items-center gap-3">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" class="bypass-toggle rounded bg-dark-850 border-slate-700 text-amber-500 focus:ring-0" ${state.bypassConnected ? 'checked' : ''}>
                  <span class="text-amber-300 font-semibold">Enable External Starter Button Mod</span>
                </label>

                ${state.bypassConnected ? `
                  <button type="button" class="push-btn-crank px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5 transition cursor-pointer">
                    ⚡ Push-Button Crank
                  </button>
                ` : ''}
              </div>

            </div>
          ` : ''}

          ${circuit.id === 'cooling_fan' ? `
            <div class="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-3 flex-1 max-w-md">
                <span class="text-slate-300 font-medium shrink-0 flex items-center gap-1">
                  <i data-lucide="thermometer" class="w-4 h-4 text-amber-400"></i> Coolant Temp:
                </span>
                <input type="range" class="temp-slider w-full accent-amber-500" min="70" max="110" value="${state.coolantTemp || 85}">
                <span class="temp-readout font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-dark-850 border border-slate-800">${state.coolantTemp || 85}°C</span>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" class="toggle-ac-btn px-3 py-1 rounded-lg border border-slate-700 font-medium ${state.acRequest ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-dark-850 text-slate-300'} transition">
                  ❄️ A/C Request (${state.acRequest ? 'ON' : 'OFF'})
                </button>
              </div>
            </div>
          ` : ''}

          ${circuit.id === 'sirius32_ecu' ? `
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <button type="button" class="toggle-sirius-key px-3 py-1 rounded-lg font-semibold ${state.keyOn ? 'bg-amber-500 text-dark-950 font-bold' : 'bg-dark-850 text-slate-300 border border-slate-700'} transition">
                  Ignition Contact (Pin 66): ${state.keyOn ? '12.4V' : '0V'}
                </button>
                <button type="button" class="toggle-sirius-run px-3 py-1 rounded-lg font-semibold ${state.engineRunning ? 'bg-emerald-600 text-white font-bold' : 'bg-dark-850 text-slate-300 border border-slate-700'} transition">
                  Engine Running (850 RPM): ${state.engineRunning ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
              <span class="text-[11px] text-slate-400 font-mono">Relay 238 (Main) & 236 (Fuel) State</span>
            </div>
          ` : ''}

          ${circuit.id === 'transmission_ad4_dp0' ? `
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <span class="text-slate-400 font-medium">Selector Position:</span>
                <div class="flex items-center bg-dark-850 border border-slate-700/80 rounded-lg p-0.5">
                  ${['P', 'R', 'N', 'D', '2', '1'].map(g => `
                    <button type="button" class="gear-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition ${state.gearPosition === g ? 'bg-amber-500 text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}" data-gear="${g}">
                      ${g}
                    </button>
                  `).join('')}
                </div>
              </div>
              <span class="text-[11px] font-mono ${['P', 'N'].includes(state.gearPosition) ? 'text-emerald-400' : 'text-rose-400'} font-bold">
                Starter Interlock: ${['P', 'N'].includes(state.gearPosition) ? 'PERMITTED (P/N)' : 'LOCKED OUT'}
              </span>
            </div>
          ` : ''}

          ${circuit.id === 'alternator_charging' ? `
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <button type="button" class="toggle-alt-engine px-3 py-1.5 rounded-lg font-bold transition ${state.engineSpinning ? 'bg-emerald-600 text-white shadow-sm' : 'bg-dark-850 text-slate-300 border border-slate-700 hover:text-white'}">
                  ${state.engineSpinning ? '🟢 Engine Running (Belt Drives Alt 103)' : '⚪ Engine Stopped (Ignition ON)'}
                </button>
              </div>
              <span class="text-[11px] font-mono ${state.engineSpinning ? 'text-emerald-400 font-bold' : 'text-amber-400'}">
                System Voltage: ${state.engineSpinning ? '14.4V (Charging)' : '12.6V (Battery Only)'}
              </span>
            </div>
          ` : ''}

          <!-- Pinout Quick Inspector Pills -->
          <div class="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
            <span class="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mr-1">Pinout Inspector:</span>
            ${circuit.pins.map(p => `
              <button type="button" class="pin-pill px-2 py-0.5 rounded bg-dark-850 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-300 hover:text-amber-300 transition" data-pin="${p.id}">
                ${p.component}: <strong>${p.pin}</strong>
              </button>
            `).join('')}
          </div>

        </div>
      </div>
    `;

    // Render initial SVG
    updateView();
    if (window.lucide) window.lucide.createIcons();

    // Event listeners
    const el = targetEl.querySelector(`#${widgetId}`);
    if (!el) return;

    // View toggles
    el.querySelector('.btn-view-digital')?.addEventListener('click', () => {
      viewMode = 'digital';
      el.querySelector('.btn-view-digital').className = 'btn-view-digital px-2.5 py-1 rounded-md font-semibold text-[11px] transition bg-amber-500 text-dark-950 font-bold';
      el.querySelector('.btn-view-scan').className = 'btn-view-scan px-2.5 py-1 rounded-md font-semibold text-[11px] transition text-slate-400 hover:text-white';
      updateView();
    });

    el.querySelector('.btn-view-scan')?.addEventListener('click', () => {
      viewMode = 'oem_scan';
      el.querySelector('.btn-view-scan').className = 'btn-view-scan px-2.5 py-1 rounded-md font-semibold text-[11px] transition bg-amber-500 text-dark-950 font-bold';
      el.querySelector('.btn-view-digital').className = 'btn-view-digital px-2.5 py-1 rounded-md font-semibold text-[11px] transition text-slate-400 hover:text-white';
      updateView();
    });

    el.querySelector('.btn-open-fullscreen')?.addEventListener('click', () => {
      if (window.openPageViewer) window.openPageViewer(circuit.manualPage, circuit.title);
    });

    // Starter Circuit controls
    if (circuit.id === 'starter_circuit') {
      el.querySelectorAll('.key-pos-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.keyPosition = btn.dataset.pos;
          el.querySelectorAll('.key-pos-btn').forEach(b => b.className = 'key-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition text-slate-400');
          btn.className = 'key-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition bg-amber-500 text-dark-950 font-bold';
          updateView();
        });
      });

      const crankBtn = el.querySelector('.key-crank-btn');
      if (crankBtn) {
        const startCrank = () => { state.keyPosition = 'START'; updateView(); };
        const endCrank = () => { state.keyPosition = 'ON'; updateView(); };
        crankBtn.addEventListener('mousedown', startCrank);
        crankBtn.addEventListener('mouseup', endCrank);
        crankBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startCrank(); });
        crankBtn.addEventListener('touchend', endCrank);
      }

      el.querySelector('.bypass-toggle')?.addEventListener('change', (e) => {
        state.bypassConnected = e.target.checked;
        renderInteractiveWidget(circuitId, container, { initialState: state });
      });

      const pushCrankBtn = el.querySelector('.push-btn-crank');
      if (pushCrankBtn) {
        const startPush = () => { state.bypassPressed = true; updateView(); };
        const endPush = () => { state.bypassPressed = false; updateView(); };
        pushCrankBtn.addEventListener('mousedown', startPush);
        pushCrankBtn.addEventListener('mouseup', endPush);
        pushCrankBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startPush(); });
        pushCrankBtn.addEventListener('touchend', endPush);
      }
    }

    // Cooling Fan controls
    if (circuit.id === 'cooling_fan') {
      const slider = el.querySelector('.temp-slider');
      const readout = el.querySelector('.temp-readout');
      if (slider) {
        slider.addEventListener('input', (e) => {
          state.coolantTemp = parseInt(e.target.value);
          if (readout) readout.textContent = `${state.coolantTemp}°C`;
          updateView();
        });
      }

      el.querySelector('.toggle-ac-btn')?.addEventListener('click', () => {
        state.acRequest = !state.acRequest;
        renderInteractiveWidget(circuitId, container, { initialState: state });
      });
    }

    // Sirius 32 controls
    if (circuit.id === 'sirius32_ecu') {
      el.querySelector('.toggle-sirius-key')?.addEventListener('click', () => {
        state.keyOn = !state.keyOn;
        if (!state.keyOn) state.engineRunning = false;
        renderInteractiveWidget(circuitId, container, { initialState: state });
      });

      el.querySelector('.toggle-sirius-run')?.addEventListener('click', () => {
        if (!state.keyOn) state.keyOn = true;
        state.engineRunning = !state.engineRunning;
        renderInteractiveWidget(circuitId, container, { initialState: state });
      });
    }

    // Transmission AD4/DP0 controls
    if (circuit.id === 'transmission_ad4_dp0') {
      el.querySelectorAll('.gear-pos-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.gearPosition = btn.dataset.gear;
          state.starterAllowed = ['P', 'N'].includes(state.gearPosition);
          renderInteractiveWidget(circuitId, container, { initialState: state });
        });
      });
    }

    // Alternator controls
    if (circuit.id === 'alternator_charging') {
      el.querySelector('.toggle-alt-engine')?.addEventListener('click', () => {
        state.engineSpinning = !state.engineSpinning;
        state.batteryVoltage = state.engineSpinning ? 14.4 : 12.6;
        state.warningLampOn = !state.engineSpinning;
        renderInteractiveWidget(circuitId, container, { initialState: state });
      });
    }

    // Pin pills click
    el.querySelectorAll('.pin-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const pinData = circuit.pins.find(p => p.id === pill.dataset.pin);
        if (pinData && window.showPinInspectorModal) {
          window.showPinInspectorModal(pinData);
        } else if (pinData) {
          alert(`${pinData.component} - ${pinData.pin}\nVoltage: ${pinData.voltage}\nWire: ${pinData.wire}\nNote: ${pinData.note}`);
        }
      });
    });
  }

  // =============================================================
  // PUBLIC CONTROLLER API
  // =============================================================

  window.SchematicsEngine = {
    getCircuit: function(circuitId) {
      return CIRCUITS[circuitId] || null;
    },

    getAllCircuits: function() {
      return Object.values(CIRCUITS);
    },

    renderSVG: function(circuitId, stateOverrides = {}) {
      const circuit = CIRCUITS[circuitId];
      if (!circuit) return `<div class="p-4 text-red-400">Unknown circuit ID: ${circuitId}</div>`;

      const mergedState = Object.assign({}, circuit.state, stateOverrides);

      if (circuitId === 'starter_circuit') return generateStarterCircuitSVG(mergedState);
      if (circuitId === 'sirius32_ecu') return generateSirius32SVG(mergedState);
      if (circuitId === 'cooling_fan') return generateCoolingFanSVG(mergedState);
      if (circuitId === 'transmission_ad4_dp0') return generateTransmissionSVG(mergedState);
      if (circuitId === 'alternator_charging') return generateAlternatorSVG(mergedState);
      return generateStarterCircuitSVG(mergedState);
    },

    inspectPin: function(pinId) {
      for (const cKey in CIRCUITS) {
        const pin = CIRCUITS[cKey].pins.find(p => p.id === pinId);
        if (pin) return pin;
      }
      return null;
    },

    renderWidget: renderInteractiveWidget
  };

  // Helper alias
  window.renderDigitalSchematicWidget = renderInteractiveWidget;

})(window);
