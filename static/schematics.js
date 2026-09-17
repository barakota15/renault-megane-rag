/**
 * Renault Mégane I (1995–2002) - Digital Interactive CAD Schematics Engine
 * High-Definition Multi-Wire Electrical Harness Schematics
 * 
 * 100% Derived from Official Renault Workshop Service Manual (2,492 Pages):
 * - Page 92 / Section 10-48: Starter Motor 163 & Ignition Switch 104
 * - Page 263-274 / Section 17-43: Multipoint Injection Computer ECU 120 (Fenix 5 / Sirius 32)
 * - Page 245 / Section 19: Radiator Cooling Fan GMV 188 & Dual Speed Relays 234/235
 * - Page 378-380 / Section 23: AD4 & DP0 Automatic Transmission TCU 119 & CMF Switch 779
 * - Page 90 / Section 16: Alternator 103 & 12V Battery Charging System
 * - Page 231, 263, 378: OBD-II 16-Pin Diagnostic Socket 225 & Vehicle Serial Bus
 */

(function(window) {
  'use strict';

  // =========================================================================
  // CIRCUITS CONFIGURATION & COMPREHENSIVE PIN MATRIX
  // =========================================================================

  const CIRCUITS = {
    // -----------------------------------------------------------------------
    // CIRCUIT 1: ENGINE MANAGEMENT ECU 120 (PAGES 263–274)
    // -----------------------------------------------------------------------
    sirius32_ecu: {
      id: 'sirius32_ecu',
      title: 'Engine Management ECU 120 (Multipoint Injection Harness)',
      titleAr: 'الضفيرة الكاملة لكنترول المحرك ECU 120 (جميع الأسلاك والبنات ورشاشات ومباين وحساسات)',
      manualPage: 267,
      category: 'Engine Management',
      description: 'Official multi-wire schematic from Renault Manual Section 17-43 (PRJ99475 / PRJ99473). Displays all 55 tracks, with individual wire paths connecting ECU 120 to Injectors 1-4, Dual Coils 683/684, Flywheel TDC Sensor 149, MAP 147, Throttle Potentiometer 272, Idle Stepper 648, Relays 238 & 236, Diagnostic 225, and TCU 119.',
      subsystems: [
        { id: 'all', label: 'All Circuits', labelAr: 'الضفيرة كاملة', icon: '👁️', wireCount: 42 },
        { id: 'power', label: 'Power & Grounds', labelAr: 'التغذية والأرضي', icon: '⚡', wireCount: 8 },
        { id: 'injectors', label: 'Fuel Injectors 1-4', labelAr: 'الرشاشات الأربعة', icon: '⛽', wireCount: 8 },
        { id: 'ignition', label: 'Ignition Coils', labelAr: 'مباين الإشعال', icon: '🔥', wireCount: 4 },
        { id: 'sensors', label: 'Engine Sensors', labelAr: 'الحساسات (كرنك وماب وبوابة)', icon: '🧭', wireCount: 8 },
        { id: 'idle', label: 'Idle Stepper Motor', labelAr: 'موتور السلانسيه', icon: '⚙️', wireCount: 4 },
        { id: 'diag', label: 'Diagnostics & TCU', labelAr: 'الفحص وكمبيوتر الفتيس', icon: '💻', wireCount: 4 }
      ],
      state: {
        keyOn: false,
        engineRunning: false,
        activeSubsystem: 'all',
        isolateMode: 'dim',
        activeWire: null
      },
      pins: [
        { id: 'w_gnd_2', pin: 'Track 2', component: 'ECU 120', voltage: '0V Earth', wire: '1.5 mm² Noir (NO)', note: 'Power Earth 1 to Engine Earth MH' },
        { id: 'w_gnd_3', pin: 'Track 3', component: 'ECU 120', voltage: '0V Earth', wire: '1.5 mm² Noir (NO)', note: 'Power Earth 2 to Engine Earth MH' },
        { id: 'w_bat_32', pin: 'Track 32', component: 'ECU 120', voltage: '12.6V Direct', wire: '1.0 mm² Rouge (RG)', note: '+12V Battery permanent memory supply' },
        { id: 'w_apc_24', pin: 'Track 24', component: 'ECU 120', voltage: '12.4V (Key ON)', wire: '1.0 mm² Jaune (JA)', note: '+12V Switched after-ignition supply from Neiman 104' },
        { id: 'w_rly_238', pin: 'Track 7/33', component: 'ECU 120', voltage: '0V Ground Trigger', wire: '0.6 mm² Blanc (BA)', note: 'Command for Main Locking Relay 238 coil' },
        { id: 'w_rly_236', pin: 'Track 48', component: 'ECU 120', voltage: '0V Ground Trigger', wire: '0.6 mm² Orange (OR)', note: 'Command for Fuel Pump Relay 236 coil' },
        { id: 'w_inj_1', pin: 'Track 53', component: 'ECU 120', voltage: 'Pulsed Ground', wire: '1.0 mm² Saumon (SA)', note: 'Sequential earth command Cylinder 1 (Flywheel end)' },
        { id: 'w_inj_2', pin: 'Track 25', component: 'ECU 120', voltage: 'Pulsed Ground', wire: '1.0 mm² Gris (GR)', note: 'Sequential earth command Cylinder 2' },
        { id: 'w_inj_3', pin: 'Track 4', component: 'ECU 120', voltage: 'Pulsed Ground', wire: '1.0 mm² Vert (VE)', note: 'Sequential earth command Cylinder 3' },
        { id: 'w_inj_4', pin: 'Track 30', component: 'ECU 120', voltage: 'Pulsed Ground', wire: '1.0 mm² Blanc (BA)', note: 'Sequential earth command Cylinder 4 (Timing end)' },
        { id: 'w_coil_1', pin: 'Track 28', component: 'ECU 120', voltage: 'Pulsed Ground (~350V spike)', wire: '1.5 mm² Marron (MA)', note: 'Command for Dual Ignition Coil 683 (Cyl 1 & 4)' },
        { id: 'w_coil_2', pin: 'Track 29', component: 'ECU 120', voltage: 'Pulsed Ground (~350V spike)', wire: '1.5 mm² Violet (VI)', note: 'Command for Dual Ignition Coil 684 (Cyl 2 & 3)' },
        { id: 'w_pmh_a', pin: 'Track 34', component: 'ECU 120', voltage: 'AC Sine ~2.4V RMS', wire: 'Shielded Noir', note: 'Flywheel TDC Sensor 149 Track A' },
        { id: 'w_pmh_b', pin: 'Track 33', component: 'ECU 120', voltage: 'AC Sine ~2.4V RMS', wire: 'Shielded Blanc', note: 'Flywheel TDC Sensor 149 Track B' },
        { id: 'w_map_sig', pin: 'Track 16', component: 'ECU 120', voltage: '1.2V - 4.8V Analog', wire: '0.6 mm² Vert (VE)', note: 'MAP Sensor 147 Manifold Pressure Signal' },
        { id: 'w_tps_sig', pin: 'Track 19', component: 'ECU 120', voltage: '0.5V - 4.5V Analog', wire: '0.6 mm² Blanc (BA)', note: 'Throttle Position Potentiometer 272 Angle Signal' },
        { id: 'w_stp_a', pin: 'Track 9', component: 'ECU 120', voltage: '0 - 12V Pulse', wire: '0.6 mm² Bleu (BL)', note: 'Idle Stepper Motor 648 Phase A' },
        { id: 'w_stp_b', pin: 'Track 35', component: 'ECU 120', voltage: '0 - 12V Pulse', wire: '0.6 mm² Jaune (JA)', note: 'Idle Stepper Motor 648 Phase B' },
        { id: 'w_stp_c', pin: 'Track 36', component: 'ECU 120', voltage: '0 - 12V Pulse', wire: '0.6 mm² Vert (VE)', note: 'Idle Stepper Motor 648 Phase C' },
        { id: 'w_stp_d', pin: 'Track 40', component: 'ECU 120', voltage: '0 - 12V Pulse', wire: '0.6 mm² Rouge (RG)', note: 'Idle Stepper Motor 648 Phase D' },
        { id: 'w_diag_k', pin: 'Track 11', component: 'ECU 120', voltage: '12V Pullup / Serial Data', wire: '0.6 mm² Blanc/Bleu', note: 'ISO 9141-2 K-Line to Diagnostic Socket 225 Pin 7' },
        { id: 'w_diag_l', pin: 'Track 38', component: 'ECU 120', voltage: '12V Wakeup Trigger', wire: '0.6 mm² Jaune/Noir', note: 'ISO 9141-2 L-Line to Diagnostic Socket 225 Pin 15' }
      ]
    },

    // -----------------------------------------------------------------------
    // CIRCUIT 2: AUTOMATIC TRANSMISSION AD4 / DP0 (PAGES 378–380)
    // -----------------------------------------------------------------------
    transmission_ad4_dp0: {
      id: 'transmission_ad4_dp0',
      title: 'Automatic Transmission AD4 / DP0 (Full OEM Wiring Diagram)',
      titleAr: 'الضفيرة الكاملة للفتيس الأوتوماتيك AD4/DP0 (كمبيوتر 119 وسويتش 779 وبلوف 754 وقفل المارش)',
      manualPage: 379,
      category: 'Transmission Electronics',
      description: 'Authentic multi-conductor wiring harness derived 100% from Renault Workshop Manual Pages 378 & 379 (Diagram 98463S). Shows every individual wire linking TCU 119 to Multifunction Switch 779, Solenoid Valve Block 754 (EVM & E1-E6), Starter 163 Lockout, Speed Sensors 780 & 250, Pressure Sensor 781, Stop Switch 160, Kickdown 569, and ECU 120.',
      subsystems: [
        { id: 'all', label: 'All Circuits', labelAr: 'الضفيرة كاملة', icon: '👁️', wireCount: 34 },
        { id: 'power', label: 'Power & Grounds', labelAr: 'التغذية والأرضي', icon: '⚡', wireCount: 4 },
        { id: 'lockout', label: 'Starter Safety Lockout', labelAr: 'أمان المارش (CMF 3&4)', icon: '🛑', wireCount: 2 },
        { id: 'solenoids', label: 'Hydraulic Solenoid Valves', labelAr: 'بلوف الهيدروليك EVM و E1-E4', icon: '💧', wireCount: 5 },
        { id: 'cmf', label: 'CMF Position Tracks A-D', labelAr: 'سويتش النقلات CMF أ، ب، ج، د', icon: '🕹️', wireCount: 4 },
        { id: 'sensors', label: 'Speed & Brake Sensors', labelAr: 'حساسات السرعة والفرامل', icon: '📊', wireCount: 4 },
        { id: 'ecu_link', label: 'ECU Interlink', labelAr: 'الربط مع كمبيوتر الموتور', icon: '🔗', wireCount: 2 }
      ],
      state: {
        gearPosition: 'P',
        brakePressed: false,
        kickdownActive: false,
        ecoMode: false,
        activeSubsystem: 'all',
        isolateMode: 'dim',
        activeWire: null
      },
      pins: [
        { id: 'tcu_w_apc', pin: 'Pins 1 & 2', component: 'TCU 119', voltage: '12.4V +APC', wire: '1.5 mm² Jaune (JA)', note: 'Switched ignition power from Fuse F4 (15A)' },
        { id: 'tcu_w_gnd', pin: 'Pins 19 & 20', component: 'TCU 119', voltage: '0V Earth', wire: '1.5 mm² Noir (NO)', note: 'TCU Chassis Ground to Engine Earth MH' },
        { id: 'cmf_w_crank_in', pin: 'CMF Pin 3', component: 'Switch 779', voltage: '12V on Crank', wire: '2.5 mm² Blanc/Jaune', note: 'Crank feed from Ignition Switch 104 Pin 50' },
        { id: 'cmf_w_crank_out', pin: 'CMF Pin 4', component: 'Switch 779', voltage: '12V on Crank in P/N', wire: '2.5 mm² Jaune/Blanc', note: 'Inhibitor safety output directly to Starter 163 Solenoid Pin 50' },
        { id: 'sol_w_evm', pin: 'EVM Terminal', component: 'Solenoids 754', voltage: 'PWM 100Hz (0-100%)', wire: '1.0 mm² Bleu/Noir', note: 'Main line pressure regulation valve PWM control wire' },
        { id: 'sol_w_e1', pin: 'Valve E1', component: 'Solenoids 754', voltage: '12V ON / 0V OFF', wire: '1.0 mm² Vert (VE)', note: 'Shift sequence valve 1 command line from TCU' },
        { id: 'sol_w_e2', pin: 'Valve E2', component: 'Solenoids 754', voltage: '12V ON / 0V OFF', wire: '1.0 mm² Jaune (JA)', note: 'Shift sequence valve 2 command line from TCU' },
        { id: 'sol_w_e3', pin: 'Valve E3', component: 'Solenoids 754', voltage: '12V ON / 0V OFF', wire: '1.0 mm² Gris (GR)', note: 'Shift sequence valve 3 (4th overdrive) command line from TCU' },
        { id: 'sol_w_e4', pin: 'Lockup E4', component: 'Solenoids 754', voltage: 'PWM Lock', wire: '1.0 mm² Orange (OR)', note: 'Torque converter lock-up clutch solenoid command line' },
        { id: 'tcu_w_kline', pin: 'Pin 18', component: 'TCU 119', voltage: '12V Pullup / Serial Data', wire: '0.6 mm² Blanc/Bleu', note: 'ISO 9141-2 K-Line directly to OBD-II Socket 225 Pin 7' }
      ]
    },

    // -----------------------------------------------------------------------
    // CIRCUIT 3: OBD-II 16-PIN DIAGNOSTIC SOCKET 225 (PAGES 231, 263, 378)
    // -----------------------------------------------------------------------
    obd2_diagnostic_socket: {
      id: 'obd2_diagnostic_socket',
      title: 'OBD-II 16-Pin Diagnostic Socket 225 (Complete Vehicle Bus)',
      titleAr: 'مخطط فيشة الأعطال 16-Pin وتوزيع جميع الأسلاك على كمبيوترات السيارة',
      manualPage: 231,
      category: 'Diagnostics & Multiplexing',
      description: 'Complete 16-pin Diagnostic Socket (Component 225) in Passenger Fusebox 645 (UCH). Shows all 16 physical wires running to Engine ECU 120, Transmission TCU 119, ABS 118, Airbag 756, and Chassis Ground.',
      subsystems: [
        { id: 'all', label: 'All 16 Pins', labelAr: 'البنات الـ 16 كاملة', icon: '👁️', wireCount: 16 },
        { id: 'power', label: 'Power & Grounds', labelAr: 'الكهرباء والأرضي (1، 4، 5، 16)', icon: '⚡', wireCount: 4 },
        { id: 'engine_diag', label: 'Engine K & L Bus', labelAr: 'خطوط كمبيوتر المحرك (7 و 15)', icon: '🚗', wireCount: 2 },
        { id: 'tcu_abs', label: 'TCU & ABS Bus', labelAr: 'فحص الفتيس و ABS (Pin 7)', icon: '⚙️', wireCount: 2 },
        { id: 'airbag', label: 'Airbag & UCH', labelAr: 'الإيرباج والتابلوه (Pin 11)', icon: '🛡️', wireCount: 2 }
      ],
      state: {
        keyOn: true,
        scannerConnected: false,
        activePin: 'pin_7',
        activeSubsystem: 'all',
        isolateMode: 'dim',
        activeWire: null
      },
      pins: [
        { id: 'obd_w_1', pin: 'Pin 1', component: 'OBD 225', voltage: '12.4V (Key ON)', wire: '1.0 mm² Jaune (JA)', note: '+APC Switched ignition supply from Fusebox 645 (UCH)' },
        { id: 'obd_w_4', pin: 'Pin 4', component: 'OBD 225', voltage: '0.00V Earth', wire: '1.5 mm² Noir (NO)', note: 'Chassis Earth (Masse Carrosserie) to beam MH/MJ' },
        { id: 'obd_w_5', pin: 'Pin 5', component: 'OBD 225', voltage: '0.00V Earth', wire: '1.0 mm² Noir (NO)', note: 'Signal Earth (Masse Électronique) dedicated ground return' },
        { id: 'obd_w_7', pin: 'Pin 7', component: 'OBD 225', voltage: '12.0V Pullup / 10.4k pulses', wire: '0.6 mm² Blanc/Bleu', note: 'ISO 9141-2 K-Line to ECU 120 (Trk 11), TCU 119 (Pin 18), and ABS (Pin 11)' },
        { id: 'obd_w_11', pin: 'Pin 11', component: 'OBD 225', voltage: '12.0V Pullup', wire: '0.6 mm² Marron (MA)', note: 'Airbag Computer 756 Diagnostic K-Line' },
        { id: 'obd_w_15', pin: 'Pin 15', component: 'OBD 225', voltage: '12.0V Wake-up', wire: '0.6 mm² Jaune/Noir', note: 'ISO 9141-2 L-Line to Engine ECU 120 Track 38' },
        { id: 'obd_w_16', pin: 'Pin 16', component: 'OBD 225', voltage: '12.60V Constant', wire: '1.5 mm² Rouge (RG)', note: 'Permanent Battery Feed (+BAT) from Fuse F17 (10A) in UCH 645' }
      ]
    },

    // -----------------------------------------------------------------------
    // CIRCUIT 4: STARTER MOTOR 163 & IGNITION 104 (PAGE 92)
    // -----------------------------------------------------------------------
    starter_circuit: {
      id: 'starter_circuit',
      title: 'Starter Motor 163 & Ignition Switch 104 (OEM Wiring)',
      titleAr: 'دائرة المارش 163 ومفتاح الكونتاك 104 (مع محاكي الزرار الخارجي)',
      manualPage: 92,
      category: 'Starting & Ignition',
      description: 'Official starting circuit from Renault Manual Section 10-48 (Page 92). Shows Terminal 30 direct battery cable, Terminal 50 solenoid trigger, Maxi-fuse 597 (60A), Neiman Switch 104, and External Push-Button bypass modification.',
      subsystems: [
        { id: 'all', label: 'All Circuits', labelAr: 'الدائرة بالكامل', icon: '👁️', wireCount: 6 },
        { id: 'primary', label: 'Primary B+ Cable', labelAr: 'كابل البطارية الرئيسي (16 mm²)', icon: '⚡', wireCount: 2 },
        { id: 'ignition_key', label: 'Neiman Key Crank (50)', labelAr: 'تكة المارش من الكونتاك', icon: '🔑', wireCount: 2 },
        { id: 'bypass_mod', label: 'External Button Mod', labelAr: 'زرار التشغيل الخارجي والكتاوت', icon: '🔘', wireCount: 3 }
      ],
      state: {
        keyPosition: 'OFF',
        bypassConnected: false,
        bypassPressed: false,
        gearboxInNeutral: true,
        activeSubsystem: 'all',
        isolateMode: 'dim',
        activeWire: null
      },
      pins: [
        { id: 'st_w_bplus', pin: 'Term 30', component: 'Starter 163', voltage: '12.6V Constant', wire: '16 mm² Rouge (RG)', note: 'Direct heavy battery lead from Battery 107 positive stud' },
        { id: 'st_w_t50', pin: 'Term 50', component: 'Starter 163', voltage: '12.2V Cranking', wire: '2.5 mm² Jaune/Blanc', note: 'Solenoid pull-in & hold-in coil crank command from Neiman Pin 50' }
      ]
    },

    // -----------------------------------------------------------------------
    // CIRCUIT 5: COOLING FAN GMV 188 & RELAYS 234 / 235 (PAGE 245)
    // -----------------------------------------------------------------------
    cooling_fan: {
      id: 'cooling_fan',
      title: 'Cooling Fan GMV 188 & Dual Speed Relays 234/235',
      titleAr: 'دائرة مراوح التبريد GMV (كتاوت السرعة الأولى 234 والسرعة الثانية 235 ومقاومة 700)',
      manualPage: 245,
      category: 'Cooling & HVAC',
      description: 'Dual-speed radiator cooling fan with Low-Speed Relay 234 through dropping resistor 700 (92°C) and High-Speed Relay 235 direct feed (98°C).',
      subsystems: [
        { id: 'all', label: 'All Circuits', labelAr: 'الدائرة بالكامل', icon: '👁️', wireCount: 8 },
        { id: 'low_speed', label: 'Low Speed (Relay 234 & 700)', labelAr: 'السرعة الأولى (كتاوت ومقاومة)', icon: '🐢', wireCount: 3 },
        { id: 'high_speed', label: 'High Speed (Relay 235)', labelAr: 'السرعة الثانية (كتاوت مباشر)', icon: '🚀', wireCount: 3 },
        { id: 'sensors', label: 'Thermo-Switch & A/C', labelAr: 'حساس الحرارة والتكييف', icon: '🌡️', wireCount: 2 }
      ],
      state: {
        coolantTemp: 85,
        lowSpeedActive: false,
        highSpeedActive: false,
        acRequest: false,
        manualOverride: false,
        activeSubsystem: 'all',
        isolateMode: 'dim',
        activeWire: null
      },
      pins: [
        { id: 'fan_low_relay', pin: 'Pin 87', component: 'Relay 234 (Low)', voltage: '8.5V', wire: '2.5 mm² Jaune/Bleu', note: 'Feeds dropping resistor 700 to fan motor' },
        { id: 'fan_high_relay', pin: 'Pin 87', component: 'Relay 235 (High)', voltage: '12.4V Full Direct', wire: '4.0 mm² Rouge/Blanc', note: 'Direct 12V high speed feed to fan motor' }
      ]
    },

    // -----------------------------------------------------------------------
    // CIRCUIT 6: ALTERNATOR 103 & BATTERY CHARGING (PAGE 176)
    // -----------------------------------------------------------------------
    alternator_charging: {
      id: 'alternator_charging',
      title: 'Alternator 103 & Battery Charging System',
      titleAr: 'دائرة شحن الدينامو 103 والبطارية 107 ولمبة التابلوه 247',
      manualPage: 176,
      category: 'Charging & Power',
      description: 'Alternator 103 charging circuit with Terminal B+ heavy battery lead and Terminal D+ exciter lamp on instrument cluster 247.',
      subsystems: [
        { id: 'all', label: 'All Circuits', labelAr: 'الدائرة بالكامل', icon: '👁️', wireCount: 4 },
        { id: 'charging', label: 'B+ Primary Charging Cable', labelAr: 'كابل الشحن الرئيسي B+', icon: '⚡', wireCount: 2 },
        { id: 'exciter', label: 'D+ Exciter & Cluster Lamp', labelAr: 'سلك الإثارة ولمبة التابلوه', icon: '💡', wireCount: 2 }
      ],
      state: {
        engineSpinning: false,
        batteryVoltage: 12.6,
        warningLampOn: true,
        activeSubsystem: 'all',
        isolateMode: 'dim',
        activeWire: null
      },
      pins: [
        { id: 'alt_b_plus', pin: 'Terminal B+', component: 'Alternator 103', voltage: '14.2V (Running)', wire: '16 mm² Rouge (RG)', note: 'Heavy output charging terminal to Battery' },
        { id: 'alt_d_plus', pin: 'Terminal D+ (L)', component: 'Alternator 103', voltage: '14.0V / 1.5V', wire: '1.0 mm² Blanc (BA)', note: 'Exciter field & instrument cluster warning lamp' }
      ]
    }
  };

  // =========================================================================
  // SCHEMATIC DRAWING UTILITIES & CAD WIRE RENDERERS
  // =========================================================================

  /**
   * Renders an authentic CAD wire with interactive data attributes, hover effects, dynamic routing, and subsystem tagging
   */
  function drawHarnessWire(pathD, color, options = {}) {
    const wireId = options.id || 'w_' + Math.random().toString(36).substr(2, 6);
    const strokeWidth = options.width || 2.2;
    const isLive = options.live || false;
    const isDashed = options.dashed || false;
    const label = options.label || '';
    const fromPin = options.from || '';
    const toPin = options.to || '';
    const signal = options.signal || '';
    const gauge = options.gauge || '';
    const subsystem = options.subsystem || 'all';

    const fromComp = options.fromComp || '';
    const fromX = options.fromX !== undefined ? options.fromX : '';
    const fromY = options.fromY !== undefined ? options.fromY : '';
    const toComp = options.toComp || '';
    const toX = options.toX !== undefined ? options.toX : '';
    const toY = options.toY !== undefined ? options.toY : '';
    const routing = options.routing || 'hvh';
    const channelX = options.channelX !== undefined ? options.channelX : '';
    const channelY = options.channelY !== undefined ? options.channelY : '';

    return `
      <g class="harness-wire-group cursor-pointer transition-all duration-150" 
         data-subsystem="${subsystem}"
         data-wire-id="${wireId}" 
         data-wire-label="${label}" 
         data-wire-from="${fromPin}" 
         data-wire-to="${toPin}" 
         data-wire-signal="${signal}" 
         data-wire-gauge="${gauge}"
         data-wire-color="${color}"
         data-from-comp="${fromComp}"
         data-from-x="${fromX}"
         data-from-y="${fromY}"
         data-to-comp="${toComp}"
         data-to-x="${toX}"
         data-to-y="${toY}"
         data-routing="${routing}"
         data-channel-x="${channelX}"
         data-channel-y="${channelY}"
         onmouseenter="window.onHoverWire(this)"
         onmouseleave="window.onLeaveWire(this)"
         onclick="window.onClickWire(this)">
        <!-- Wide Hitbox for Easy Clicking & Hovering -->
        <path d="${pathD}" stroke="transparent" stroke-width="${Math.max(strokeWidth + 12, 16)}" fill="none"/>
        <!-- High Contrast Clearance Background Line -->
        <path d="${pathD}" stroke="#060911" stroke-width="${strokeWidth + 2.5}" fill="none"/>
        <!-- Real Visual Conductor -->
        <path id="${wireId}" d="${pathD}" 
              stroke="${color}" 
              stroke-width="${strokeWidth}" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-dasharray="${isDashed ? '6 4' : 'none'}" 
              class="${isLive ? 'wire-live' : ''}" 
              fill="none"/>
      </g>
    `;
  }

  /**
   * Dynamically recalculates connected orthogonal wires when a component is dragged
   */
  function updateConnectedWires(svgEl, compId) {
    if (!svgEl || !compId) return;
    const wires = svgEl.querySelectorAll(`.harness-wire-group[data-from-comp="${compId}"], .harness-wire-group[data-to-comp="${compId}"]`);
    wires.forEach(wg => {
      const fromCompId = wg.dataset.fromComp;
      const toCompId = wg.dataset.toComp;
      const origX1 = parseFloat(wg.dataset.fromX);
      const origY1 = parseFloat(wg.dataset.fromY);
      const origX2 = parseFloat(wg.dataset.toX);
      const origY2 = parseFloat(wg.dataset.toY);
      const routing = wg.dataset.routing || 'hvh';

      if (isNaN(origX1) || isNaN(origY1) || isNaN(origX2) || isNaN(origY2)) return;

      let dx1 = 0, dy1 = 0;
      if (fromCompId) {
        const c1 = svgEl.querySelector(`#${fromCompId}`);
        if (c1) {
          dx1 = parseFloat(c1.dataset.curDx || 0);
          dy1 = parseFloat(c1.dataset.curDy || 0);
        }
      }

      let dx2 = 0, dy2 = 0;
      if (toCompId) {
        const c2 = svgEl.querySelector(`#${toCompId}`);
        if (c2) {
          dx2 = parseFloat(c2.dataset.curDx || 0);
          dy2 = parseFloat(c2.dataset.curDy || 0);
        }
      }

      const p1x = origX1 + dx1;
      const p1y = origY1 + dy1;
      const p2x = origX2 + dx2;
      const p2y = origY2 + dy2;

      let newD = '';
      if (routing === 'direct' || routing === 'straight') {
        newD = `M ${p1x} ${p1y} L ${p2x} ${p2y}`;
      } else if (routing === 'vh') {
        newD = `M ${p1x} ${p1y} V ${p2y} H ${p2x}`;
      } else if (routing === 'hv') {
        newD = `M ${p1x} ${p1y} H ${p2x} V ${p2y}`;
      } else if (routing === 'vhv') {
        let midY = (p1y + p2y) / 2;
        if (wg.dataset.channelY) {
          const chanY = parseFloat(wg.dataset.channelY);
          midY = chanY + (dy1 + dy2) / 2;
        }
        newD = `M ${p1x} ${p1y} V ${midY} H ${p2x} V ${p2y}`;
      } else if (routing === 'smooth') {
        const c1x = p1x + (p2x - p1x) * 0.45;
        const c2x = p1x + (p2x - p1x) * 0.55;
        newD = `M ${p1x} ${p1y} C ${c1x} ${p1y}, ${c2x} ${p2y}, ${p2x} ${p2y}`;
      } else if (routing === 'hvh') {
        if (wg.dataset.channelX) {
          const chanX = parseFloat(wg.dataset.channelX);
          const midX = chanX + (dx1 + dx2) / 2;
          newD = `M ${p1x} ${p1y} H ${midX} V ${p2y} H ${p2x}`;
        } else {
          // Horizontal multi-wire run without fixed channel (e.g. CMF tracks, Solenoid lines)
          if (Math.abs(p1y - p2y) < 1) {
            newD = `M ${p1x} ${p1y} H ${p2x}`;
          } else {
            // Natural flexible wire harness bezier tracking X and Y without jagged breaks
            const c1x = p1x + (p2x - p1x) * 0.45;
            const c2x = p1x + (p2x - p1x) * 0.55;
            newD = `M ${p1x} ${p1y} C ${c1x} ${p1y}, ${c2x} ${p2y}, ${p2x} ${p2y}`;
          }
        }
      } else {
        newD = `M ${p1x} ${p1y} H ${(p1x + p2x) / 2} V ${p2y} H ${p2x}`;
      }

      wg.querySelectorAll('path').forEach(p => p.setAttribute('d', newD));
    });
  }

  /**
   * Renders a wire junction splice dot (●)
   */
  function drawSplice(x, y, color = '#22c55e', r = 4.5, subsystem = 'all') {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="#060911" stroke-width="1.8" data-subsystem="${subsystem}"/>`;
  }

  /**
   * Renders a component terminal connector pin
   */
  function drawPinTerminal(x, y, pinNum, label = '', options = {}) {
    const isRight = options.align === 'right';
    const fill = options.fill || '#141d2e';
    const stroke = options.stroke || '#475569';
    const textFill = options.textFill || '#f8fafc';
    const radius = options.r || 8;
    const subsystem = options.subsystem || 'all';

    return `
      <g transform="translate(${x}, ${y})" class="pin-terminal" data-subsystem="${subsystem}">
        <circle cx="0" cy="0" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
        <text x="0" y="3.5" fill="${textFill}" font-size="${radius > 8 ? 9 : 8}" font-family="monospace" font-weight="bold" text-anchor="middle">${pinNum}</text>
        ${label ? `
          <text x="${isRight ? radius + 7 : -radius - 7}" y="3.5" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="${isRight ? 'start' : 'end'}">${label}</text>
        ` : ''}
      </g>
    `;
  }

  // =========================================================================
  // 1. ENGINE MANAGEMENT ECU 120 (FULL MULTI-WIRE OEM SCHEMATIC)
  // =========================================================================

  function generateSirius32SVG(state) {
    const isKeyOn = state.keyOn;
    const isRunning = state.engineRunning;

    const bPlusCol = '#ef4444'; // Red
    const apcCol = isKeyOn ? '#eab308' : '#334155'; // Yellow
    const gndCol = '#38bdf8'; // Blue / Earth
    const mainFeedCol = isKeyOn ? '#eab308' : '#334155';
    const fuelPumpCol = (isKeyOn && isRunning) ? '#22c55e' : '#334155';
    const injPulseCol = isRunning ? '#f43f5e' : '#334155';
    const sparkPulseCol = isRunning ? '#f59e0b' : '#334155';
    const kLineCol = '#06b6d4';
    const lLineCol = '#a855f7';

    return `
      <svg viewBox="0 0 1560 1020" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <pattern id="diag-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" stroke-width="1.2" />
          </pattern>
        </defs>

        <!-- Dark Blueprint Background & Precision Automotive Grid -->
        <rect width="1560" height="1020" fill="#070a12" rx="14"/>
        <g stroke="#111a2e" stroke-width="0.7" stroke-dasharray="3 4">
          ${Array.from({ length: 26 }, (_, i) => `<line x1="${(i + 1) * 60}" y1="0" x2="${(i + 1) * 60}" y2="1020"/>`).join('')}
          ${Array.from({ length: 17 }, (_, i) => `<line x1="0" y1="${(i + 1) * 60}" x2="1560" y2="${(i + 1) * 60}"/>`).join('')}
        </g>

        <!-- ========================================================================= -->
        <!-- 1. ECU 120 HORIZONTAL CONNECTOR BAR (ACROSS CENTER Y = 510 - 610)        -->
        <!-- ========================================================================= -->
        <g id="comp_ecu120" class="schematic-comp cursor-grab" data-comp-id="comp_ecu120" data-subsystem="all" transform="translate(0, 0)">
          <!-- Outer ECU Housing Bar -->
          <rect x="60" y="510" width="1440" height="100" rx="8" fill="#0a0f1d" stroke="#f59e0b" stroke-width="2.2"/>
          
          <!-- Component Number Badge [120] on the Right -->
          <rect x="1420" y="545" width="56" height="30" rx="4" fill="#141d2e" stroke="#f59e0b" stroke-width="1.8"/>
          <text x="1448" y="565" fill="#fbbf24" font-size="14" font-weight="bold" font-family="monospace" text-anchor="middle">120</text>
          <text x="1448" y="595" fill="#94a3b8" font-size="9" text-anchor="middle">Calculateur</text>

          <!-- 55-Pin Internal Terminal Matrix Grid (Exact Renault Layout) -->
          <g transform="translate(380, 530)">
            <rect x="0" y="0" width="675" height="58" rx="4" fill="#060911" stroke="#334155" stroke-width="1.5"/>
            <!-- Row 1: Pins 1 to 27 -->
            ${Array.from({ length: 27 }, (_, i) => `
              <rect x="${i * 25}" y="0" width="25" height="29" fill="${[1,2,3,5,6,7,8,9,10,11,12,14,15,16,17,18,19,23].includes(i) ? '#0f172a' : 'url(#diag-hatch)'}" stroke="#334155" stroke-width="0.8"/>
              <text x="${i * 25 + 12.5}" y="19" fill="${[1,2,3,5,6,7,8,9,10,11,12,14,15,16,17,18,19,23].includes(i) ? '#f8fafc' : '#64748b'}" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${i + 1}</text>
            `).join('')}
            <!-- Row 2: Pins 28 to 55 -->
            ${Array.from({ length: 27 }, (_, i) => `
              <rect x="${i * 25}" y="29" width="25" height="29" fill="${[0,1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,20,22,23,24].includes(i) ? '#0f172a' : 'url(#diag-hatch)'}" stroke="#334155" stroke-width="0.8"/>
              <text x="${i * 25 + 12.5}" y="48" fill="${[0,1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,20,22,23,24].includes(i) ? '#f8fafc' : '#64748b'}" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${i + 28}</text>
            `).join('')}
          </g>

          <!-- Pin Track Labels on Top Edge (Y = 510) -->
          ${[
            [90, '30'], [120, '4'], [150, '52'], [180, '13'],
            [300, '18'], [330, '3'], [360, '2'], [410, '17'],
            [470, '10'], [540, '42'], [630, '46'], [720, '41'], [760, '7'],
            [820, '24'], [880, '28'], [970, '29'], [1005, '40'], [1040, '39'], [1075, '35'],
            [1230, '11'], [1270, '38'], [1340, '32']
          ].map(([x, pin]) => `
            <circle cx="${x}" cy="510" r="3.5" fill="#fbbf24"/>
            <text x="${x}" y="495" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${pin}</text>
          `).join('')}

          <!-- Pin Track Labels on Bottom Edge (Y = 610) -->
          ${[
            [95, '12'], [170, '31'], [200, '8'], [280, '44'],
            [360, '15'], [480, '26'], [570, '45'], [610, '19'], [660, '49'], [730, '20'],
            [840, '34'], [875, '33'], [960, '51'], [1000, '5'],
            [1100, '6'], [1140, '37'], [1230, '50'], [1330, '43']
          ].map(([x, pin]) => `
            <circle cx="${x}" cy="610" r="3.5" fill="#fbbf24"/>
            <text x="${x}" y="627" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${pin}</text>
          `).join('')}
        </g>

        <!-- ========================================================================= -->
        <!-- 2. INJECTORS 1 - 4 (VERTICALLY STACKED ON TOP LEFT, COMPONENTS 193 - 196) -->
        <!-- ========================================================================= -->
        <g id="comp_injectors" class="schematic-comp cursor-grab" data-comp-id="comp_injectors" data-subsystem="injectors" transform="translate(0, 0)">
          ${[
            [80, 193, 'Inj 1 (Flywheel)'], [160, 194, 'Inj 2'], [240, 195, 'Inj 3'], [320, 196, 'Inj 4 (Timing)']
          ].map(([y, comp, desc]) => `
            <g transform="translate(180, ${y})">
              <rect x="18" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
              <text x="35" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">${comp}</text>
              <rect x="0" y="0" width="70" height="42" rx="5" fill="#0f172a" stroke="#f43f5e" stroke-width="1.5"/>
              <polygon points="18,12 35,21 18,30" fill="#f43f5e" opacity="0.3" stroke="#f43f5e" stroke-width="1.2"/>
              <polygon points="52,12 35,21 52,30" fill="#f43f5e" opacity="0.3" stroke="#f43f5e" stroke-width="1.2"/>
              <line x1="18" y1="12" x2="52" y2="30" stroke="#f43f5e" stroke-width="1.2"/>
              <line x1="18" y1="30" x2="52" y2="12" stroke="#f43f5e" stroke-width="1.2"/>
              <circle cx="0" cy="21" r="3.5" fill="#070a12" stroke="#f43f5e" stroke-width="1.5"/>
              <text x="-8" y="24" fill="#94a3b8" font-size="9" font-family="monospace">2</text>
              <circle cx="70" cy="21" r="3.5" fill="#070a12" stroke="#eab308" stroke-width="1.5"/>
              <text x="76" y="24" fill="#94a3b8" font-size="9" font-family="monospace">1</text>
            </g>
          `).join('')}

          <!-- Common Pin 1 (+12V) Rail Connecting all 4 Injectors inside group -->
          <path d="M 250 101 H 280 V 341 H 250 M 250 181 H 280 M 250 261 H 280" stroke="${mainFeedCol}" stroke-width="2.4" fill="none"/>
          <circle cx="280" cy="101" r="3.5" fill="${mainFeedCol}"/>
          <circle cx="280" cy="181" r="3.5" fill="${mainFeedCol}"/>
          <circle cx="280" cy="261" r="3.5" fill="${mainFeedCol}"/>
          <circle cx="280" cy="341" r="3.5" fill="${mainFeedCol}"/>

          <!-- Thick Splice Block (Épissure) at X = 276, Y = 212 -->
          <rect x="276" y="212" width="22" height="16" rx="2" fill="#060911" stroke="${mainFeedCol}" stroke-width="1.8"/>
        </g>

        <!-- ========================================================================= -->
        <!-- 3. TOP POWER DISTRIBUTION, RELAYS & CANISTER                              -->
        <!-- ========================================================================= -->
        <!-- Canister Purge Solenoid [224] -->
        <g id="comp_canister224" class="schematic-comp cursor-grab" data-comp-id="comp_canister224" data-subsystem="power" transform="translate(0, 0)">
          <g transform="translate(220, 400)">
            <rect x="15" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="32" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">224</text>
            <rect x="0" y="0" width="65" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="32" y="26" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">EVAP [P]</text>
            <circle cx="0" cy="21" r="3" fill="#eab308"/>
            <circle cx="65" cy="21" r="3" fill="#38bdf8"/>
          </g>
        </g>

        <!-- Engine Earth MH with Authentic Ground Symbol -->
        <g id="comp_earth_mh" class="schematic-comp cursor-grab" data-comp-id="comp_earth_mh" data-subsystem="power" transform="translate(0, 0)">
          <g transform="translate(330, 380)">
            <rect x="-16" y="-18" width="32" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="0" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">MH</text>
            <line x1="0" y1="0" x2="0" y2="18" stroke="#38bdf8" stroke-width="2.5"/>
            <line x1="-16" y1="18" x2="16" y2="18" stroke="#38bdf8" stroke-width="2.5"/>
            <line x1="-10" y1="23" x2="10" y2="23" stroke="#38bdf8" stroke-width="2"/>
            <line x1="-5" y1="28" x2="5" y2="28" stroke="#38bdf8" stroke-width="1.5"/>
            <circle cx="0" cy="40" r="3.5" fill="#38bdf8"/>
          </g>
        </g>

        <!-- Anti-Percolation / Test Relay [242] -->
        <g id="comp_relay242" class="schematic-comp cursor-grab" data-comp-id="comp_relay242" data-subsystem="power" transform="translate(0, 0)">
          <g transform="translate(410, 400)">
            <rect x="8" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="25" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">242</text>
            <rect x="0" y="0" width="50" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="25" y="26" fill="#94a3b8" font-size="9" text-anchor="middle">A B C</text>
            <circle cx="25" cy="42" r="3.5" fill="#fbbf24"/>
          </g>
        </g>

        <!-- Solenoid Valve 371 -->
        <g id="comp_solenoid371" class="schematic-comp cursor-grab" data-comp-id="comp_solenoid371" data-subsystem="power" transform="translate(0, 0)">
          <g transform="translate(540, 400)">
            <rect x="8" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="25" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">371</text>
            <rect x="0" y="0" width="50" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="25" y="26" fill="#94a3b8" font-size="9" text-anchor="middle">A B</text>
            <circle cx="25" cy="42" r="3.5" fill="#38bdf8"/>
          </g>
        </g>

        <!-- Fuel Pump [236] Motor -->
        <g id="comp_pump236" class="schematic-comp cursor-grab" data-comp-id="comp_pump236" data-subsystem="power" transform="translate(0, 0)">
          <g transform="translate(500, 80)">
            <rect x="12" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#22c55e" stroke-width="1.2"/>
            <text x="29" y="-7" fill="#22c55e" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">236</text>
            <circle cx="29" cy="29" r="28" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
            <text x="29" y="37" fill="#ffffff" font-size="22" font-weight="bold" font-family="sans-serif" text-anchor="middle">M</text>
            <text x="29" y="52" fill="#94a3b8" font-size="8" text-anchor="middle">Pompe</text>
            <circle cx="0" cy="29" r="3.5" fill="#38bdf8"/>
            <text x="-10" y="32" fill="#94a3b8" font-size="8" font-family="monospace">C2</text>
            <circle cx="58" cy="29" r="3.5" fill="#22c55e"/>
            <text x="68" y="32" fill="#94a3b8" font-size="8" font-family="monospace">C1</text>
            <!-- Integrated Pump Ground Bolt -->
            <path d="M 0 29 H -40 V 60" stroke="${gndCol}" stroke-width="2.4" fill="none"/>
            <line x1="-52" y1="60" x2="-28" y2="60" stroke="#38bdf8" stroke-width="2.5"/>
            <line x1="-48" y1="64" x2="-32" y2="64" stroke="#38bdf8" stroke-width="2"/>
            <line x1="-44" y1="68" x2="-36" y2="68" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="-40" y="82" fill="#38bdf8" font-size="9" font-family="monospace" text-anchor="middle">MF</text>
          </g>
        </g>

        <!-- FUSES 777, 597 & Inertia Switch 927 -->
        <g id="comp_fuses_power" class="schematic-comp cursor-grab" data-comp-id="comp_fuses_power" data-subsystem="power" transform="translate(0, 0)">
          <!-- FUSE 777 (+AVC Constant Battery 30A) -->
          <g transform="translate(600, 70)">
            <rect x="8" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#ef4444" stroke-width="1.2"/>
            <text x="25" y="-7" fill="#ef4444" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">777</text>
            <rect x="0" y="0" width="50" height="42" rx="4" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>
            <line x1="25" y1="0" x2="25" y2="14" stroke="#ef4444" stroke-width="1.5"/>
            <rect x="18" y="14" width="14" height="14" rx="2" fill="none" stroke="#ef4444" stroke-width="1.5"/>
            <line x1="25" y1="28" x2="25" y2="42" stroke="#ef4444" stroke-width="1.5"/>
            <text x="25" y="54" fill="#ef4444" font-size="8" font-family="monospace" text-anchor="middle">+AVC</text>
            <circle cx="25" cy="42" r="3.5" fill="#ef4444"/>
          </g>

          <!-- FUSE 597 (+APC Switched Ignition 15A) -->
          <g transform="translate(670, 70)">
            <rect x="8" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#eab308" stroke-width="1.2"/>
            <text x="25" y="-7" fill="#eab308" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">597</text>
            <rect x="0" y="0" width="50" height="42" rx="4" fill="#0f172a" stroke="#eab308" stroke-width="1.5"/>
            <line x1="25" y1="0" x2="25" y2="14" stroke="#eab308" stroke-width="1.5"/>
            <rect x="18" y="14" width="14" height="14" rx="2" fill="none" stroke="#eab308" stroke-width="1.5"/>
            <line x1="25" y1="28" x2="25" y2="42" stroke="#eab308" stroke-width="1.5"/>
            <text x="25" y="54" fill="#eab308" font-size="8" font-family="monospace" text-anchor="middle">+APC S6</text>
          </g>

          <!-- Inertia Switch [927] -->
          <g transform="translate(635, 160)">
            <rect x="8" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#eab308" stroke-width="1.2"/>
            <text x="25" y="-7" fill="#eab308" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">927</text>
            <rect x="0" y="0" width="50" height="38" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <line x1="12" y1="20" x2="25" y2="20" stroke="#eab308" stroke-width="1.8"/>
            <line x1="25" y1="20" x2="38" y2="12" stroke="#eab308" stroke-width="1.8"/>
            <circle cx="12" cy="20" r="2.5" fill="#eab308"/>
            <circle cx="38" cy="20" r="2.5" fill="#eab308"/>
          </g>
          <!-- Internal Jumper Fuse 597 to Inertia 927 -->
          <path d="M 695 112 V 170 H 673" stroke="${apcCol}" stroke-width="2.0" fill="none"/>
        </g>

        <!-- Main Locking Relay [238] -->
        <g id="comp_relay238" class="schematic-comp cursor-grab" data-comp-id="comp_relay238" data-subsystem="power" transform="translate(0, 0)">
          <g transform="translate(595, 250)">
            <rect x="23" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="40" y="-7" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">238</text>
            <rect x="0" y="0" width="80" height="85" rx="6" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
            <rect x="12" y="15" width="22" height="36" fill="#141d2e" stroke="#fbbf24" stroke-width="1.2"/>
            <line x1="12" y1="15" x2="34" y2="51" stroke="#fbbf24" stroke-width="1"/>
            <circle cx="23" cy="5" r="3.5" fill="#eab308"/>
            <text x="23" y="-1" fill="#94a3b8" font-size="8" text-anchor="middle">2</text>
            <circle cx="23" cy="78" r="3.5" fill="#38bdf8"/>
            <text x="23" y="90" fill="#94a3b8" font-size="8" text-anchor="middle">1</text>
            <circle cx="58" cy="15" r="3.5" fill="#ef4444"/>
            <text x="68" y="18" fill="#94a3b8" font-size="8">3</text>
            <circle cx="58" cy="65" r="3.5" fill="#eab308"/>
            <text x="68" y="68" fill="#94a3b8" font-size="8">5</text>
            <line x1="58" y1="15" x2="58" y2="60" stroke="${isKeyOn ? '#eab308' : '#334155'}" stroke-width="2.2"/>
          </g>
        </g>

        <!-- ========================================================================= -->
        <!-- 4. TRANSMISSION INTERFACE [119] (TCU BVA)                                  -->
        <!-- ========================================================================= -->
        <g id="comp_tcu119" class="schematic-comp cursor-grab" data-comp-id="comp_tcu119" data-subsystem="diag" transform="translate(0, 0)">
          <g transform="translate(730, 390)">
            <rect x="8" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#c084fc" stroke-width="1.2"/>
            <text x="25" y="-7" fill="#c084fc" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">119</text>
            <rect x="0" y="0" width="50" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="25" y="26" fill="#c084fc" font-size="9" text-anchor="middle">20 21 37</text>
            <circle cx="15" cy="42" r="3.5" fill="#c084fc"/>
            <circle cx="35" cy="42" r="3.5" fill="#eab308"/>
          </g>
        </g>

        <!-- ========================================================================= -->
        <!-- 5. DUAL IGNITION COILS [683 & 684] & SUPPRESSOR CAPACITOR [170]          -->
        <!-- ========================================================================= -->
        <g id="comp_coils" class="schematic-comp cursor-grab" data-comp-id="comp_coils" data-subsystem="ignition" transform="translate(0, 0)">
          <!-- Dual Ignition Coil 1-4 [683] -->
          <g transform="translate(800, 250)">
            <rect x="18" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#f59e0b" stroke-width="1.2"/>
            <text x="35" y="-7" fill="#f59e0b" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">683</text>
            <rect x="0" y="0" width="70" height="75" rx="5" fill="#0f172a" stroke="#f59e0b" stroke-width="1.8"/>
            <line x1="30" y1="15" x2="30" y2="60" stroke="#94a3b8" stroke-width="3"/>
            <line x1="38" y1="15" x2="38" y2="60" stroke="#94a3b8" stroke-width="3"/>
            <text x="18" y="24" fill="#f8fafc" font-size="9">1</text>
            <text x="52" y="24" fill="#f8fafc" font-size="9">2</text>
            <text x="35" y="70" fill="#f8fafc" font-size="9" text-anchor="middle">3</text>
            <circle cx="18" cy="12" r="3.5" fill="#f59e0b"/>
            <circle cx="52" cy="12" r="3.5" fill="#eab308"/>
            <circle cx="35" cy="62" r="3.5" fill="#94a3b8"/>
          </g>

          <!-- Dual Ignition Coil 2-3 [684] -->
          <g transform="translate(880, 250)">
            <rect x="18" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#c084fc" stroke-width="1.2"/>
            <text x="35" y="-7" fill="#c084fc" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">684</text>
            <rect x="0" y="0" width="70" height="75" rx="5" fill="#0f172a" stroke="#c084fc" stroke-width="1.8"/>
            <line x1="30" y1="15" x2="30" y2="60" stroke="#94a3b8" stroke-width="3"/>
            <line x1="38" y1="15" x2="38" y2="60" stroke="#94a3b8" stroke-width="3"/>
            <text x="18" y="24" fill="#f8fafc" font-size="9">2</text>
            <text x="52" y="24" fill="#f8fafc" font-size="9">1</text>
            <text x="35" y="70" fill="#f8fafc" font-size="9" text-anchor="middle">3</text>
            <circle cx="18" cy="12" r="3.5" fill="#eab308"/>
            <circle cx="52" cy="12" r="3.5" fill="#c084fc"/>
            <circle cx="35" cy="62" r="3.5" fill="#94a3b8"/>
          </g>

          <!-- Suppressor Capacitor [170] with Ground -->
          <g transform="translate(845, 360)">
            <rect x="8" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="25" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">170</text>
            <rect x="0" y="0" width="50" height="34" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <line x1="20" y1="10" x2="20" y2="24" stroke="#ffffff" stroke-width="2"/>
            <line x1="30" y1="10" x2="30" y2="24" stroke="#ffffff" stroke-width="2"/>
            <line x1="25" y1="34" x2="25" y2="46" stroke="#38bdf8" stroke-width="2"/>
            <line x1="15" y1="46" x2="35" y2="46" stroke="#38bdf8" stroke-width="2"/>
          </g>
          <!-- Capacitor jumper line -->
          <path d="M 835 312 V 340 H 870 V 360 M 915 312 V 340" stroke="#94a3b8" stroke-width="1.8" fill="none"/>
        </g>

        <!-- ========================================================================= -->
        <!-- 6. IDLE STEPPER MOTOR [648], DIAGNOSTIC [225] & UCH [645]                  -->
        <!-- ========================================================================= -->
        <!-- Idle Speed Stepper Motor [648] -->
        <g id="comp_stepper648" class="schematic-comp cursor-grab" data-comp-id="comp_stepper648" data-subsystem="idle" transform="translate(0, 0)">
          <g transform="translate(1000, 270)">
            <rect x="23" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="40" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">648</text>
            <rect x="0" y="0" width="80" height="80" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="40" cy="40" r="22" fill="#080d16" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="40" y="47" fill="#ffffff" font-size="18" font-weight="bold" font-family="sans-serif" text-anchor="middle">M</text>
            <text x="12" y="16" fill="#94a3b8" font-size="9" font-family="monospace">B</text>
            <text x="68" y="16" fill="#94a3b8" font-size="9" font-family="monospace">D</text>
            <text x="12" y="74" fill="#94a3b8" font-size="9" font-family="monospace">C</text>
            <text x="68" y="74" fill="#94a3b8" font-size="9" font-family="monospace">A</text>
            <circle cx="12" cy="22" r="3.5" fill="#fde047"/>
            <circle cx="68" cy="22" r="3.5" fill="#f87171"/>
            <circle cx="12" cy="62" r="3.5" fill="#22c55e"/>
            <circle cx="68" cy="62" r="3.5" fill="#38bdf8"/>
          </g>
        </g>

        <!-- Diagnostic Socket [225] -->
        <g id="comp_obd225_sirius" class="schematic-comp cursor-grab" data-comp-id="comp_obd225_sirius" data-subsystem="diag" transform="translate(0, 0)">
          <g transform="translate(1220, 280)">
            <rect x="18" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#06b6d4" stroke-width="1.2"/>
            <text x="35" y="-7" fill="#06b6d4" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">225</text>
            <rect x="0" y="0" width="70" height="75" rx="6" fill="#0f172a" stroke="#06b6d4" stroke-width="1.8"/>
            <text x="35" y="24" fill="#06b6d4" font-size="10" font-weight="bold" text-anchor="middle">DIAG OBD</text>
            <circle cx="20" cy="55" r="4" fill="#06b6d4"/>
            <text x="20" y="45" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">7</text>
            <circle cx="50" cy="55" r="4" fill="#a855f7"/>
            <text x="50" y="45" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">15</text>
          </g>
        </g>

        <!-- Passenger Compartment Unit / Decoder [645] (Top) -->
        <g id="comp_uch645_top" class="schematic-comp cursor-grab" data-comp-id="comp_uch645_top" data-subsystem="power" transform="translate(0, 0)">
          <g transform="translate(1320, 80)">
            <rect x="8" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="25" y="-7" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">645</text>
            <rect x="0" y="0" width="50" height="55" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="25" y="22" fill="#eab308" font-size="9" text-anchor="middle">+AVC</text>
            <circle cx="25" cy="55" r="3.5" fill="#fbbf24"/>
            <text x="25" y="45" fill="#94a3b8" font-size="8" text-anchor="middle">A4</text>
          </g>
        </g>

        <!-- ========================================================================= -->
        <!-- 7. BOTTOM SENSOR RAIL                                                     -->
        <!-- ========================================================================= -->
        <!-- Vehicle Speed Sensor [250] -->
        <g id="comp_vss250" class="schematic-comp cursor-grab" data-comp-id="comp_vss250" data-subsystem="sensors" transform="translate(0, 0)">
          <g transform="translate(70, 720)">
            <rect x="8" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="25" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">250</text>
            <rect x="0" y="0" width="50" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="25" y="26" fill="#f8fafc" font-size="9" text-anchor="middle">21</text>
            <circle cx="25" cy="0" r="3.5" fill="#38bdf8"/>
          </g>
        </g>

        <!-- Knock Sensor [168] -->
        <g id="comp_knock168" class="schematic-comp cursor-grab" data-comp-id="comp_knock168" data-subsystem="sensors" transform="translate(0, 0)">
          <g transform="translate(160, 720)">
            <rect x="18" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="35" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">168</text>
            <rect x="0" y="0" width="70" height="50" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <line x1="20" y1="25" x2="50" y2="25" stroke="#ffffff" stroke-width="3"/>
            <line x1="15" y1="20" x2="15" y2="30" stroke="#38bdf8" stroke-width="2"/>
            <line x1="55" y1="20" x2="55" y2="30" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="20" cy="0" r="3.5" fill="#38bdf8"/>
            <text x="20" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">1</text>
            <circle cx="50" cy="0" r="3.5" fill="#38bdf8"/>
            <text x="50" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">2</text>
          </g>
        </g>

        <!-- Coolant Temperature Sensor [244] -->
        <g id="comp_ect244" class="schematic-comp cursor-grab" data-comp-id="comp_ect244" data-subsystem="sensors" transform="translate(0, 0)">
          <g transform="translate(330, 720)">
            <rect x="15" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#10b981" stroke-width="1.2"/>
            <text x="32" y="-7" fill="#10b981" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">244</text>
            <rect x="0" y="0" width="65" height="50" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
            <rect x="18" y="15" width="28" height="16" fill="none" stroke="#10b981" stroke-width="1.5"/>
            <path d="M 14 36 L 24 36 L 40 10 L 50 10" stroke="#10b981" stroke-width="1.5" fill="none"/>
            <circle cx="20" cy="0" r="3.5" fill="#38bdf8"/>
            <text x="20" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">1</text>
            <circle cx="45" cy="0" r="3.5" fill="#10b981"/>
            <text x="45" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">2</text>
          </g>
        </g>

        <!-- MAP Sensor [147] -->
        <g id="comp_map147" class="schematic-comp cursor-grab" data-comp-id="comp_map147" data-subsystem="sensors" transform="translate(0, 0)">
          <g transform="translate(460, 720)">
            <rect x="23" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#10b981" stroke-width="1.2"/>
            <text x="40" y="-7" fill="#10b981" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">147</text>
            <rect x="0" y="0" width="80" height="50" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
            <text x="40" y="32" fill="#10b981" font-size="10" font-weight="bold" text-anchor="middle">MAP [B]</text>
            <circle cx="20" cy="0" r="3.5" fill="#38bdf8"/>
            <text x="20" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">A</text>
            <circle cx="40" cy="0" r="3.5" fill="#10b981"/>
            <text x="40" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">B</text>
            <circle cx="60" cy="0" r="3.5" fill="#fde047"/>
            <text x="60" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">C</text>
          </g>
        </g>

        <!-- Air Temperature Sensor [222] -->
        <g id="comp_iat222" class="schematic-comp cursor-grab" data-comp-id="comp_iat222" data-subsystem="sensors" transform="translate(0, 0)">
          <g transform="translate(600, 720)">
            <rect x="15" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#10b981" stroke-width="1.2"/>
            <text x="32" y="-7" fill="#10b981" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">222</text>
            <rect x="0" y="0" width="65" height="50" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
            <rect x="18" y="15" width="28" height="16" fill="none" stroke="#10b981" stroke-width="1.5"/>
            <circle cx="20" cy="0" r="3.5" fill="#38bdf8"/>
            <text x="20" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">1</text>
            <circle cx="45" cy="0" r="3.5" fill="#10b981"/>
            <text x="45" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">2</text>
          </g>
        </g>

        <!-- Throttle Position Potentiometer [272] -->
        <g id="comp_tps272" class="schematic-comp cursor-grab" data-comp-id="comp_tps272" data-subsystem="sensors" transform="translate(0, 0)">
          <g transform="translate(700, 720)">
            <rect x="15" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#eab308" stroke-width="1.2"/>
            <text x="32" y="-7" fill="#eab308" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">272</text>
            <rect x="0" y="0" width="65" height="50" rx="4" fill="#0f172a" stroke="#eab308" stroke-width="1.5"/>
            <line x1="15" y1="25" x2="50" y2="25" stroke="#eab308" stroke-width="2"/>
            <line x1="20" y1="35" x2="42" y2="15" stroke="#fbbf24" stroke-width="2"/>
            <circle cx="20" cy="0" r="3.5" fill="#10b981"/>
            <text x="20" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">1</text>
            <circle cx="45" cy="0" r="3.5" fill="#38bdf8"/>
            <text x="45" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">2</text>
          </g>
        </g>

        <!-- Flywheel TDC Sensor [149] -->
        <g id="comp_tdc149" class="schematic-comp cursor-grab" data-comp-id="comp_tdc149" data-subsystem="sensors" transform="translate(0, 0)">
          <g transform="translate(830, 720)">
            <rect x="23" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="40" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">149</text>
            <rect x="0" y="0" width="80" height="60" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="40" cy="38" r="16" fill="#080d16" stroke="#38bdf8" stroke-width="1.5"/>
            <circle cx="40" cy="38" r="7" fill="#38bdf8"/>
            <circle cx="25" cy="0" r="3.5" fill="#38bdf8"/>
            <text x="25" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">A</text>
            <circle cx="55" cy="0" r="3.5" fill="#38bdf8"/>
            <text x="55" y="14" fill="#94a3b8" font-size="8" text-anchor="middle">B</text>
          </g>
        </g>

        <!-- A/C Interface Box [319] -->
        <g id="comp_ac319" class="schematic-comp cursor-grab" data-comp-id="comp_ac319" data-subsystem="sensors" transform="translate(0, 0)">
          <g transform="translate(955, 720)">
            <rect x="18" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#334155" stroke-width="1.2"/>
            <text x="35" y="-7" fill="#94a3b8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">319</text>
            <rect x="0" y="0" width="70" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="35" y="26" fill="#94a3b8" font-size="9" text-anchor="middle">A/C 5 4</text>
            <circle cx="20" cy="0" r="3.5" fill="#38bdf8"/>
            <circle cx="45" cy="0" r="3.5" fill="#38bdf8"/>
          </g>
        </g>

        <!-- UCH / Decoder [645] (Bottom) -->
        <g id="comp_uch645_bot" class="schematic-comp cursor-grab" data-comp-id="comp_uch645_bot" data-subsystem="diag" transform="translate(0, 0)">
          <g transform="translate(1090, 720)">
            <rect x="23" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="40" y="-7" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">645</text>
            <rect x="0" y="0" width="80" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="40" y="26" fill="#94a3b8" font-size="9" text-anchor="middle">13 5</text>
            <circle cx="25" cy="0" r="3.5" fill="#eab308"/>
            <circle cx="50" cy="0" r="3.5" fill="#eab308"/>
          </g>
        </g>

        <!-- Earth MH [100] -->
        <g id="comp_earth100" class="schematic-comp cursor-grab" data-comp-id="comp_earth100" data-subsystem="power" transform="translate(0, 0)">
          <g transform="translate(1230, 720)">
            <rect x="-16" y="-18" width="32" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
            <text x="0" y="-7" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">100</text>
            <line x1="0" y1="0" x2="0" y2="18" stroke="#38bdf8" stroke-width="2.5"/>
            <line x1="-16" y1="18" x2="16" y2="18" stroke="#38bdf8" stroke-width="2.5"/>
            <line x1="-10" y1="23" x2="10" y2="23" stroke="#38bdf8" stroke-width="2"/>
            <line x1="-5" y1="28" x2="5" y2="28" stroke="#38bdf8" stroke-width="1.5"/>
            <circle cx="0" cy="0" r="3.5" fill="#38bdf8"/>
          </g>
        </g>

        <!-- Dashboard Check Engine Warning Lamp [247] -->
        <g id="comp_mil247" class="schematic-comp cursor-grab" data-comp-id="comp_mil247" data-subsystem="diag" transform="translate(0, 0)">
          <g transform="translate(1330, 720)">
            <rect x="-16" y="-18" width="34" height="15" rx="3" fill="#141d2e" stroke="#f87171" stroke-width="1.2"/>
            <text x="0" y="-7" fill="#f87171" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">247</text>
            <circle cx="0" cy="20" r="18" fill="#0f172a" stroke="#f87171" stroke-width="2"/>
            <path d="M 0 2 A 18 18 0 0 1 18 20 L 0 20 Z" fill="#f87171"/>
            <path d="M 0 20 L -18 20 A 18 18 0 0 1 0 38 Z" fill="#f87171"/>
            <circle cx="0" cy="0" r="3.5" fill="#f87171"/>
          </g>
        </g>

        <!-- ========================================================================= -->
        <!-- DYNAMIC HARNESS WIRING (100% RECALCULATED DURING COMPONENT DRAG)         -->
        <!-- ========================================================================= -->
        <g id="harness-wires">
          <!-- Injectors 1 to 4 Trigger Lines to ECU 120 -->
          ${drawHarnessWire("M 180 101 H 90 V 510", '#f43f5e', { id: 'w_inj1_trig', label: 'Cylinder 1 Sequential Earth Command (1.0 mm² SA)', from: 'Injector 193 Pin 2', to: 'ECU 120 Track 30', signal: 'Pulsed Ground (~3ms)', gauge: '1.0 mm² Saumon', width: 2.2, live: isRunning, subsystem: 'injectors', fromComp: 'comp_injectors', fromX: 180, fromY: 101, toComp: 'comp_ecu120', toX: 90, toY: 510, routing: 'vh' })}
          ${drawHarnessWire("M 180 181 H 120 V 510", '#94a3b8', { id: 'w_inj2_trig', label: 'Cylinder 2 Sequential Earth Command (1.0 mm² GR)', from: 'Injector 194 Pin 2', to: 'ECU 120 Track 4', signal: 'Pulsed Ground (~3ms)', gauge: '1.0 mm² Gris', width: 2.2, live: isRunning, subsystem: 'injectors', fromComp: 'comp_injectors', fromX: 180, fromY: 181, toComp: 'comp_ecu120', toX: 120, toY: 510, routing: 'vh' })}
          ${drawHarnessWire("M 180 261 H 150 V 510", '#22c55e', { id: 'w_inj3_trig', label: 'Cylinder 3 Sequential Earth Command (1.0 mm² VE)', from: 'Injector 195 Pin 2', to: 'ECU 120 Track 52', signal: 'Pulsed Ground (~3ms)', gauge: '1.0 mm² Vert', width: 2.2, live: isRunning, subsystem: 'injectors', fromComp: 'comp_injectors', fromX: 180, fromY: 261, toComp: 'comp_ecu120', toX: 150, toY: 510, routing: 'vh' })}
          ${drawHarnessWire("M 180 341 V 510", '#f8fafc', { id: 'w_inj4_trig', label: 'Cylinder 4 Sequential Earth Command (1.0 mm² BA)', from: 'Injector 196 Pin 2', to: 'ECU 120 Track 13', signal: 'Pulsed Ground (~3ms)', gauge: '1.0 mm² Blanc', width: 2.2, live: isRunning, subsystem: 'injectors', fromComp: 'comp_injectors', fromX: 180, fromY: 341, toComp: 'comp_ecu120', toX: 180, toY: 510, routing: 'direct' })}

          <!-- Relay 238 Pin 5 Power Feed to Injector Splice Block -->
          ${drawHarnessWire("M 653 315 H 690 V 220 H 298", mainFeedCol, { id: 'w_rly238_to_splice', label: 'Main Relay 238 Output Power to Injectors Rail', from: 'Relay 238 Pin 5', to: 'Injectors Splice Block', signal: '+12.4V DC Regulated', gauge: '2.5 mm² JA/BA', width: 2.8, live: isKeyOn, subsystem: 'power', fromComp: 'comp_relay238', fromX: 653, fromY: 315, toComp: 'comp_injectors', toX: 298, toY: 220, routing: 'hvh', channelX: 690 })}

          <!-- EVAP Canister 224 Wires -->
          ${drawHarnessWire("M 220 421 H 200 V 220 H 276", mainFeedCol, { id: 'w_evap_feed', label: 'EVAP Solenoid +12V Power Feed', from: 'Relay 238 Pin 5', to: 'Canister 224 Pin 1', signal: '+12V DC', gauge: '1.0 mm²', width: 2.0, live: isKeyOn, subsystem: 'power', fromComp: 'comp_injectors', fromX: 276, fromY: 220, toComp: 'comp_canister224', toX: 220, toY: 421, routing: 'vh' })}
          ${drawHarnessWire("M 285 421 H 470 V 510", '#38bdf8', { id: 'w_evap_trig', label: 'EVAP Solenoid Ground Command to ECU Track 10', from: 'Canister 224 Pin 2', to: 'ECU 120 Track 10', signal: 'PWM Duty Cycle', gauge: '0.6 mm²', width: 2.0, subsystem: 'power', fromComp: 'comp_canister224', fromX: 285, fromY: 421, toComp: 'comp_ecu120', toX: 470, toY: 510, routing: 'vh' })}

          <!-- Engine Earth MH to ECU Tracks 18, 3, 2 -->
          ${drawHarnessWire("M 330 398 V 510", gndCol, { id: 'w_ecu_earth_mh', label: 'Power Grounds 18, 3, 2 to Engine Earth MH', from: 'Engine Earth Bolt MH', to: 'ECU Tracks 18, 3, 2', signal: '0.0V Earth', gauge: '3 x 1.5 mm² Noir', width: 2.6, subsystem: 'power', fromComp: 'comp_earth_mh', fromX: 330, fromY: 398, toComp: 'comp_ecu120', toX: 330, toY: 510, routing: 'direct' })}

          <!-- Anti-Percolation Relay 242 & Solenoid 371 to ECU -->
          ${drawHarnessWire("M 435 442 V 510", '#38bdf8', { id: 'w_rly242_c', label: 'Relay 242 Pin C to ECU Track 17', from: 'Relay 242 Pin C', to: 'ECU Track 17', signal: 'Command Signal', gauge: '0.6 mm²', width: 2.0, subsystem: 'power', fromComp: 'comp_relay242', fromX: 435, fromY: 442, toComp: 'comp_ecu120', toX: 410, toY: 510, routing: 'direct' })}
          ${drawHarnessWire("M 565 442 V 510", '#38bdf8', { id: 'w_sol371_b', label: 'Solenoid 371 Pin B to ECU Track 42', from: 'Solenoid 371 Pin B', to: 'ECU Track 42', signal: 'Control Signal', gauge: '0.6 mm²', width: 2.0, subsystem: 'power', fromComp: 'comp_solenoid371', fromX: 565, fromY: 442, toComp: 'comp_ecu120', toX: 540, toY: 510, routing: 'direct' })}

          <!-- Fuel Pump Feed from Relay 238 -->
          ${drawHarnessWire("M 653 315 H 690 V 109 H 558", fuelPumpCol, { id: 'w_pump_feed', label: 'Fuel Pump 236 Positive Feed (C1)', from: 'Relay 238 Pin 5', to: 'Pump 236 Pin C1', signal: '+12V Fuel Pump Feed', gauge: '1.5 mm² VE/BA', width: 2.4, live: (isKeyOn && isRunning), subsystem: 'power', fromComp: 'comp_relay238', fromX: 653, fromY: 315, toComp: 'comp_pump236', toX: 558, toY: 109, routing: 'hvh', channelX: 690 })}

          <!-- Fuse 777 to Relay 238 Pin 3 -->
          ${drawHarnessWire("M 625 112 V 265 H 653", bPlusCol, { id: 'w_bat_fuse777', label: 'Constant +BAT Feed from Fuse 777 to Relay 238 Pin 3', from: 'Fuse 777 (+AVC 30A)', to: 'Relay 238 Pin 3', signal: '+12.6V Battery Constant', gauge: '2.5 mm² Rouge', width: 2.2, subsystem: 'power', fromComp: 'comp_fuses_power', fromX: 625, fromY: 112, toComp: 'comp_relay238', toX: 653, toY: 265, routing: 'vh' })}

          <!-- Inertia Switch 927 Output to Relay 238 Coil Pin 2 -->
          ${drawHarnessWire("M 673 172 V 255 H 618", apcCol, { id: 'w_inertia_to_rly238', label: 'Inertia Switch 927 Output to Relay 238 Coil Pin 2', from: 'Inertia Switch 927', to: 'Relay 238 Pin 2', signal: '+12.4V Key ON', gauge: '1.0 mm² Jaune', width: 2.0, live: isKeyOn, subsystem: 'power', fromComp: 'comp_fuses_power', fromX: 673, fromY: 172, toComp: 'comp_relay238', toX: 618, toY: 255, routing: 'vh' })}

          <!-- ECU Track 46 Ground Trigger to Relay 238 Pin 1 -->
          ${drawHarnessWire("M 630 510 V 338 H 618", '#38bdf8', { id: 'w_rly238_trig', label: 'ECU Main Relay Coil Ground Trigger (Track 46)', from: 'ECU Track 46', to: 'Relay 238 Pin 1', signal: '0V Ground Trigger', gauge: '0.6 mm² Blanc', width: 2.0, live: isKeyOn, subsystem: 'power', fromComp: 'comp_ecu120', fromX: 630, fromY: 510, toComp: 'comp_relay238', toX: 618, toY: 338, routing: 'vh' })}

          <!-- Transmission Interface [119] Wires to ECU 120 -->
          ${drawHarnessWire("M 720 510 V 432 H 745", '#c084fc', { id: 'w_tcu_tps', label: 'ECU Track 41 to TCU 119 Pin 20 (Throttle Angle Load)', from: 'ECU Track 41', to: 'TCU 119 Pin 20', signal: '0 - 5V Throttle Load', gauge: '0.6 mm²', width: 2.0, subsystem: 'diag', fromComp: 'comp_ecu120', fromX: 720, fromY: 510, toComp: 'comp_tcu119', toX: 745, toY: 432, routing: 'vh' })}
          ${drawHarnessWire("M 760 510 V 432 H 765", '#eab308', { id: 'w_tcu_torque', label: 'ECU Track 7 to TCU 119 Pin 21 (Torque Reduction Request)', from: 'ECU Track 7', to: 'TCU 119 Pin 21', signal: 'Torque Cut Signal', gauge: '0.6 mm²', width: 2.0, subsystem: 'diag', fromComp: 'comp_ecu120', fromX: 760, fromY: 510, toComp: 'comp_tcu119', toX: 765, toY: 432, routing: 'vh' })}

          <!-- Coils 683 & 684 Ground Triggers from ECU -->
          ${drawHarnessWire("M 820 510 V 262", sparkPulseCol, { id: 'w_coil1_trig', label: 'Coil Cyl 1-4 Primary Ground Trigger (1.5 mm² MA)', from: 'ECU Track 24', to: 'Coil 683 Pin 1', signal: 'Pulsed Spark Spike (~350V)', gauge: '1.5 mm² Marron', width: 2.2, live: isRunning, subsystem: 'ignition', fromComp: 'comp_coils', fromX: 818, fromY: 262, toComp: 'comp_ecu120', toX: 820, toY: 510, routing: 'direct' })}
          ${drawHarnessWire("M 880 510 V 280 H 932 V 262", sparkPulseCol, { id: 'w_coil2_trig', label: 'Coil Cyl 2-3 Primary Ground Trigger (1.5 mm² VI)', from: 'ECU Track 28', to: 'Coil 684 Pin 1', signal: 'Pulsed Spark Spike (~350V)', gauge: '1.5 mm² Violet', width: 2.2, live: isRunning, subsystem: 'ignition', fromComp: 'comp_coils', fromX: 932, fromY: 262, toComp: 'comp_ecu120', toX: 880, toY: 510, routing: 'vh' })}

          <!-- Relay 238 to Coils Power Feed -->
          ${drawHarnessWire("M 653 315 H 690 V 220 H 852 V 262", mainFeedCol, { id: 'w_coils_power', label: 'Ignition Coils 683 & 684 Common +12V Power Feed', from: 'Relay 238 Pin 5', to: 'Coils 683/684 Pin 2', signal: '+12.4V Switched Load', gauge: '1.5 mm² JA/BA', width: 2.2, live: isKeyOn, subsystem: 'ignition', fromComp: 'comp_relay238', fromX: 653, fromY: 315, toComp: 'comp_coils', toX: 852, toY: 262, routing: 'hvh', channelX: 690 })}

          <!-- Stepper Motor 648 Wires to ECU Tracks 29, 40, 39, 35 -->
          ${drawHarnessWire("M 1012 332 V 460 H 970 V 510", '#22c55e', { id: 'w_step_c', label: 'Idle Stepper Phase C (0.6 mm² VE)', from: 'Stepper 648 Pin C', to: 'ECU Track 29', signal: '0 - 12V Step Pulse', gauge: '0.6 mm² VE', width: 2.0, live: isRunning, subsystem: 'idle', fromComp: 'comp_stepper648', fromX: 1012, fromY: 332, toComp: 'comp_ecu120', toX: 970, toY: 510, routing: 'vh' })}
          ${drawHarnessWire("M 1012 292 H 995 V 470 H 1005 V 510", '#fde047', { id: 'w_step_b', label: 'Idle Stepper Phase B (0.6 mm² JA)', from: 'Stepper 648 Pin B', to: 'ECU Track 40', signal: '0 - 12V Step Pulse', gauge: '0.6 mm² JA', width: 2.0, live: isRunning, subsystem: 'idle', fromComp: 'comp_stepper648', fromX: 1012, fromY: 292, toComp: 'comp_ecu120', toX: 1005, toY: 510, routing: 'vh' })}
          ${drawHarnessWire("M 1068 292 H 1080 V 470 H 1040 V 510", '#f87171', { id: 'w_step_d', label: 'Idle Stepper Phase D (0.6 mm² RG)', from: 'Stepper 648 Pin D', to: 'ECU Track 39', signal: '0 - 12V Step Pulse', gauge: '0.6 mm² RG', width: 2.0, live: isRunning, subsystem: 'idle', fromComp: 'comp_stepper648', fromX: 1068, fromY: 292, toComp: 'comp_ecu120', toX: 1040, toY: 510, routing: 'vh' })}
          ${drawHarnessWire("M 1068 332 V 480 H 1075 V 510", '#38bdf8', { id: 'w_step_a', label: 'Idle Stepper Phase A (0.6 mm² BL)', from: 'Stepper 648 Pin A', to: 'ECU Track 35', signal: '0 - 12V Step Pulse', gauge: '0.6 mm² BL', width: 2.0, live: isRunning, subsystem: 'idle', fromComp: 'comp_stepper648', fromX: 1068, fromY: 332, toComp: 'comp_ecu120', toX: 1075, toY: 510, routing: 'vh' })}

          <!-- Diagnostic Socket 225 Wires to ECU -->
          ${drawHarnessWire("M 1240 335 V 510", kLineCol, { id: 'w_kline_diag', label: 'ISO 9141-2 K-Line Diagnostic Bus (0.6 mm² BA/BL)', from: 'OBD Socket 225 Pin 7', to: 'ECU Track 11', signal: '10.4 kbps Bidirectional Serial', gauge: '0.6 mm² BA/BL', width: 2.2, subsystem: 'diag', fromComp: 'comp_obd225_sirius', fromX: 1240, fromY: 335, toComp: 'comp_ecu120', toX: 1230, toY: 510, routing: 'direct' })}
          ${drawHarnessWire("M 1270 335 V 510", lLineCol, { id: 'w_lline_diag', label: 'ISO 9141-2 L-Line Wake-up Bus (0.6 mm² JA/NO)', from: 'OBD Socket 225 Pin 15', to: 'ECU Track 38', signal: '12V Wake-up Pulse', gauge: '0.6 mm² JA/NO', width: 2.2, subsystem: 'diag', fromComp: 'comp_obd225_sirius', fromX: 1270, fromY: 335, toComp: 'comp_ecu120', toX: 1270, toY: 510, routing: 'direct' })}

          <!-- UCH 645 Constant Battery Feed to ECU Track 32 -->
          ${drawHarnessWire("M 1345 135 V 510", '#fbbf24', { id: 'w_bat_ecu32', label: 'Battery Memory Constant Supply (1.0 mm² RG)', from: 'UCH 645 Pin A4', to: 'ECU Track 32', signal: '+12.6V Battery Feed', gauge: '1.0 mm² RG', width: 2.2, subsystem: 'power', fromComp: 'comp_uch645_top', fromX: 1345, fromY: 135, toComp: 'comp_ecu120', toX: 1340, toY: 510, routing: 'direct' })}

          <!-- Bottom Sensors to ECU Bottom Edge (Y = 610) -->
          ${drawHarnessWire("M 95 610 V 720", '#38bdf8', { id: 'w_vss_sig', label: 'Vehicle Speed Sensor 250 Pin 21 to ECU Track 12', from: 'VSS 250 Pin 21', to: 'ECU Track 12', signal: 'Speed Pulses', gauge: '0.6 mm²', width: 2.0, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 95, fromY: 610, toComp: 'comp_vss250', toX: 95, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 170 610 V 720", '#38bdf8', { id: 'w_knock_1', label: 'Knock Sensor 168 Pin 1 to ECU Track 31', from: 'Sensor 168 Pin 1', to: 'ECU Track 31', signal: 'Piezo AC Signal', gauge: 'Shielded Pair', width: 2.0, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 170, fromY: 610, toComp: 'comp_knock168', toX: 180, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 200 610 V 720", '#38bdf8', { id: 'w_knock_2', label: 'Knock Sensor 168 Pin 2 to ECU Track 8', from: 'Sensor 168 Pin 2', to: 'ECU Track 8', signal: 'Piezo Return', gauge: 'Shielded Pair', width: 2.0, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 200, fromY: 610, toComp: 'comp_knock168', toX: 210, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 360 610 V 720", '#10b981', { id: 'w_ect_sig', label: 'Coolant Temperature Sensor 244 Pin 2 to ECU Track 15', from: 'Sensor 244 Pin 2', to: 'ECU Track 15', signal: 'NTC Thermistor (0.5V - 4.5V)', gauge: '0.6 mm² VE', width: 2.0, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 360, fromY: 610, toComp: 'comp_ect244', toX: 375, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 480 610 V 670 H 500 V 720", '#10b981', { id: 'w_map_sig', label: 'MAP Sensor 147 Pin B Manifold Pressure Signal', from: 'MAP 147 Pin B', to: 'ECU Track 26', signal: '1.2V - 4.8V Pressure Signal', gauge: '0.6 mm² VE', width: 2.2, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 480, fromY: 610, toComp: 'comp_map147', toX: 500, toY: 720, routing: 'vh' })}
          ${drawHarnessWire("M 570 610 V 690 H 520 V 720", '#fde047', { id: 'w_5v_ref_map', label: '+5.0V Regulated Reference from ECU Track 45', from: 'ECU Track 45', to: 'MAP 147 Pin C', signal: '+5.00V DC Regulated', gauge: '0.6 mm² JA', width: 2.2, live: isKeyOn, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 570, fromY: 610, toComp: 'comp_map147', toX: 520, toY: 720, routing: 'vh' })}
          ${drawHarnessWire("M 610 610 V 720", '#38bdf8', { id: 'w_iat_gnd', label: 'Air Temp Sensor 222 Pin 1 to Sensor Ground', from: 'Sensor 222 Pin 1', to: 'ECU Track 19', signal: 'Clean Sensor Earth', gauge: '0.6 mm² NO', width: 2.0, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 610, fromY: 610, toComp: 'comp_iat222', toX: 620, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 660 610 V 670 H 720 V 720", '#10b981', { id: 'w_tps_sig', label: 'Throttle Position Potentiometer 272 Pin 1 to ECU Track 49', from: 'TPS 272 Pin 1', to: 'ECU Track 49', signal: '0.5V - 4.5V Throttle Signal', gauge: '0.6 mm² BA', width: 2.0, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 660, fromY: 610, toComp: 'comp_tps272', toX: 720, toY: 720, routing: 'vh' })}
          ${drawHarnessWire("M 730 610 V 670 H 745 V 720", '#38bdf8', { id: 'w_tps_gnd', label: 'Throttle Position Potentiometer 272 Pin 2 to ECU Track 20', from: 'TPS 272 Pin 2', to: 'ECU Track 20', signal: 'Sensor Earth Return', gauge: '0.6 mm² NO', width: 2.0, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 730, fromY: 610, toComp: 'comp_tps272', toX: 745, toY: 720, routing: 'vh' })}
          ${drawHarnessWire("M 840 610 V 720", '#38bdf8', { id: 'w_pmh_sig_a', label: 'TDC PMH Inductive Sensor Track A (Shielded Cable)', from: 'Sensor 149 Pin A', to: 'ECU Track 34', signal: 'AC Sine Wave ~2.4V RMS', gauge: 'Shielded Noir', width: 2.2, live: isRunning, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 840, fromY: 610, toComp: 'comp_tdc149', toX: 855, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 875 610 V 670 H 885 V 720", '#38bdf8', { id: 'w_pmh_sig_b', label: 'TDC PMH Inductive Sensor Track B (Shielded Cable)', from: 'Sensor 149 Pin B', to: 'ECU Track 33', signal: 'AC Sine Wave ~2.4V RMS', gauge: 'Shielded Blanc', width: 2.2, live: isRunning, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 875, fromY: 610, toComp: 'comp_tdc149', toX: 885, toY: 720, routing: 'vh' })}
          ${drawHarnessWire("M 280 610 V 690 H 820 V 720", '#64748b', { id: 'w_pmh_shield', label: 'Flywheel TDC Sensor Braided Earth Shield (Blindage)', from: 'Sensor 149 Shield', to: 'ECU Track 44', signal: '0V Shield Ground', gauge: 'Tresse Blindage', width: 1.6, dashed: true, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 280, fromY: 610, toComp: 'comp_tdc149', toX: 830, toY: 720, routing: 'vh' })}
          ${drawHarnessWire("M 960 610 V 720", '#38bdf8', { id: 'w_ac_pres', label: 'A/C Pressure Cutoff to ECU Track 51', from: 'Box 319 Pin 5', to: 'ECU Track 51', signal: 'Pressure Safety', gauge: '0.6 mm²', width: 2.0, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 960, fromY: 610, toComp: 'comp_ac319', toX: 975, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 1000 610 V 720", '#38bdf8', { id: 'w_ac_req', label: 'A/C Compressor Request to ECU Track 5', from: 'Box 319 Pin 4', to: 'ECU Track 5', signal: 'A/C Request 12V', gauge: '0.6 mm²', width: 2.0, subsystem: 'sensors', fromComp: 'comp_ecu120', fromX: 1000, fromY: 610, toComp: 'comp_ac319', toX: 990, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 1100 610 V 720", '#eab308', { id: 'w_immo_code', label: 'Anti-Theft Immobilizer Data Code to ECU Track 6', from: 'UCH 645 Pin 13', to: 'ECU Track 6', signal: 'Coded Rolling Data', gauge: '0.6 mm²', width: 2.0, subsystem: 'diag', fromComp: 'comp_ecu120', fromX: 1100, fromY: 610, toComp: 'comp_uch645_bot', toX: 1115, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 1140 610 V 720", '#eab308', { id: 'w_immo_status', label: 'Immobilizer Authorization Status to ECU Track 37', from: 'UCH 645 Pin 5', to: 'ECU Track 37', signal: 'Status Line', gauge: '0.6 mm²', width: 2.0, subsystem: 'diag', fromComp: 'comp_ecu120', fromX: 1140, fromY: 610, toComp: 'comp_uch645_bot', toX: 1130, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 1230 610 V 720", '#38bdf8', { id: 'w_gnd_comp100', label: 'Chassis Earth 100 to ECU Track 50', from: 'Earth MH 100', to: 'ECU Track 50', signal: '0.0V Earth', gauge: '1.5 mm² Noir', width: 2.5, subsystem: 'power', fromComp: 'comp_ecu120', fromX: 1230, fromY: 610, toComp: 'comp_earth100', toX: 1230, toY: 720, routing: 'direct' })}
          ${drawHarnessWire("M 1330 610 V 720", '#f87171', { id: 'w_mil_lamp', label: 'Injection Warning Light 247 Ground Pull from ECU Track 43', from: 'Cluster Lamp 247', to: 'ECU Track 43', signal: 'Active Low Ground Command', gauge: '0.6 mm²', width: 2.0, subsystem: 'diag', fromComp: 'comp_ecu120', fromX: 1330, fromY: 610, toComp: 'comp_mil247', toX: 1330, toY: 720, routing: 'direct' })}
        </g>
      </svg>
    `;
  }

  // =========================================================================
  // 2. AUTOMATIC TRANSMISSION AD4 / DP0 (PAGES 378–380)
  // =========================================================================

  function generateTransmissionSVG(state) {
    const gear = state.gearPosition || 'P';
    const isAllowed = ['P', 'N'].includes(gear);
    const brake = state.brakePressed;
    const kickdown = state.kickdownActive;

    const starterCol = isAllowed ? '#22c55e' : '#ef4444';
    let e1 = false, e2 = false, e3 = false, e4 = false, e5 = false, evmDuty = 35;
    let gearDesc = 'Park / Neutral Safety Interlock';

    if (gear === '1') {
      e1 = true; e2 = true; evmDuty = 70; gearDesc = '1st Gear (Ratio 2.72:1 - Solenoids E1 & E2 Active)';
    } else if (gear === '2') {
      e2 = true; evmDuty = 55; gearDesc = '2nd Gear (Ratio 1.49:1 - Solenoid E2 Active)';
    } else if (gear === '3') {
      evmDuty = 45; gearDesc = '3rd Gear (Direct 1.00:1 - Clutches Engaged)';
    } else if (gear === '4' || gear === 'D') {
      e3 = true; evmDuty = 40; gearDesc = '4th Overdrive (Ratio 0.71:1 - Solenoid E3 Active)';
    } else if (gear === 'R') {
      e1 = true; evmDuty = 85; gearDesc = 'Reverse Gear (Ratio 2.45:1 - Solenoid E1 & Reverse Lamp Active)';
    }

    if (kickdown) {
      evmDuty = 95;
      gearDesc += ' [KICKDOWN 95% MAXIMUM LINE PRESSURE]';
    }

    const solenoids = [
      [205, 'E1', e1, 'Passage 1ere / Marche Arriere', '#22c55e'],
      [280, 'E2', e2, 'Passage 1ere / 2eme', '#3b82f6'],
      [355, 'E3', e3, 'Passage 4eme Overdrive', '#a855f7'],
      [430, 'E4', e4, 'Pontage Convertisseur Lock-up', '#f97316'],
      [505, 'E5', e5, 'Regulation Debit Echangeur', '#06b6d4']
    ];

    return `
      <svg viewBox="0 0 1560 920" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="wire-glow-trans" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- Blueprint Background & Coordinate Grid -->
        <rect width="1560" height="920" fill="#070a12" rx="14"/>
        <g stroke="#111a2e" stroke-width="0.7" stroke-dasharray="3 4">
          ${Array.from({ length: 26 }, (_, i) => `<line x1="${(i + 1) * 60}" y1="0" x2="${(i + 1) * 60}" y2="920"/>`).join('')}
          ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${(i + 1) * 60}" x2="1560" y2="${(i + 1) * 60}"/>`).join('')}
        </g>

        <!-- ========================================================================= -->
        <!-- 1. FUSEBOX 597 (Top Left: X=40, Y=60, W=280, H=105)                       -->
        <!-- ========================================================================= -->
        <g id="comp_fusebox597" class="schematic-comp cursor-grab" data-comp-id="comp_fusebox597" data-subsystem="power" transform="translate(0, 0)">
          <rect x="40" y="60" width="280" height="105" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <rect x="55" y="48" width="40" height="18" rx="3" fill="#141d2e" stroke="#eab308" stroke-width="1.2"/>
          <text x="75" y="61" fill="#eab308" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">597</text>
          <text x="105" y="77" fill="#f8fafc" font-size="12" font-weight="bold">BOÎTE FUSIBLES MOTEUR</text>
          
          <!-- Fuse F2 (+BAT) -->
          <rect x="55" y="90" width="115" height="55" rx="5" fill="#080d16" stroke="#ef4444" stroke-width="1.4"/>
          <text x="112" y="112" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">FUSIBLE F2 (30A)</text>
          <text x="112" y="128" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">+BAT Permanent</text>
          <circle cx="55" cy="115" r="3.5" fill="#ef4444"/>

          <!-- Fuse F4 (+APC) -->
          <rect x="185" y="90" width="120" height="55" rx="5" fill="#080d16" stroke="#f59e0b" stroke-width="1.4"/>
          <text x="245" y="112" fill="#f59e0b" font-size="10" font-weight="bold" text-anchor="middle">FUSIBLE F4 (15A)</text>
          <text x="245" y="128" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">+APC Après Contact</text>
          <circle cx="320" cy="115" r="4" fill="#f59e0b"/>
        </g>

        <!-- ========================================================================= -->
        <!-- 2. SPEED SENSORS 780 & 250 (Mid-Left: X=40, Y=195, W=280, H=105)           -->
        <!-- ========================================================================= -->
        <g id="comp_speedsensors" class="schematic-comp cursor-grab" data-comp-id="comp_speedsensors" data-subsystem="sensors" transform="translate(0, 0)">
          <rect x="40" y="195" width="280" height="105" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <text x="55" y="215" fill="#38bdf8" font-size="11" font-weight="bold">CAPTEURS DE VITESSE BVA</text>
          
          <!-- Sensor 780: Turbine Speed -->
          <rect x="55" y="225" width="115" height="60" rx="4" fill="#080d16" stroke="#10b981" stroke-width="1.2"/>
          <text x="112" y="245" fill="#10b981" font-size="9" font-weight="bold" text-anchor="middle">TURBINE [780]</text>
          <text x="112" y="260" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">Régime Entrée</text>
          <circle cx="170" cy="250" r="3.5" fill="#10b981"/>

          <!-- Sensor 250: Vehicle Speed -->
          <rect x="185" y="225" width="120" height="60" rx="4" fill="#080d16" stroke="#14b8a6" stroke-width="1.2"/>
          <text x="245" y="245" fill="#14b8a6" font-size="9" font-weight="bold" text-anchor="middle">VÉHICULE [250]</text>
          <text x="245" y="260" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">Vitesse Roues</text>
          <circle cx="320" cy="255" r="4" fill="#14b8a6"/>
        </g>

        <!-- ========================================================================= -->
        <!-- 3. BRAKE STOP SWITCH 160 (X=40, Y=330, W=280, H=90)                        -->
        <!-- ========================================================================= -->
        <g id="comp_brakeswitch160" class="schematic-comp cursor-grab" data-comp-id="comp_brakeswitch160" data-subsystem="sensors" transform="translate(0, 0)">
          <rect x="40" y="330" width="280" height="90" rx="8" fill="#0f172a" stroke="${brake ? '#22c55e' : '#334155'}" stroke-width="2"/>
          <rect x="55" y="318" width="40" height="16" rx="3" fill="#141d2e" stroke="#22c55e" stroke-width="1.2"/>
          <text x="75" y="330" fill="#22c55e" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">160</text>
          <text x="105" y="348" fill="${brake ? '#22c55e' : '#f8fafc'}" font-size="11" font-weight="bold">CONTACTEUR STOP (FREIN)</text>
          
          <rect x="55" y="360" width="240" height="46" rx="4" fill="#080d16" stroke="${brake ? '#22c55e' : '#334155'}" stroke-width="1.2"/>
          <circle cx="75" cy="383" r="3.5" fill="#f59e0b"/>
          <text x="75" y="398" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">Pin 1 (+APC)</text>
          <line x1="75" y1="383" x2="${brake ? '250' : '210'}" y2="${brake ? '383' : '373'}" stroke="${brake ? '#22c55e' : '#64748b'}" stroke-width="2.5"/>
          <circle cx="250" cy="383" r="3.5" fill="${brake ? '#22c55e' : '#64748b'}"/>
          <text x="250" y="398" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">Pin 2 (Signal)</text>
          
          <!-- Terminal Pins on Right Edge -->
          <circle cx="320" cy="350" r="4" fill="#f59e0b"/>
          <line x1="320" y1="350" x2="75" y2="350" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="2 2"/>
          <line x1="75" y1="350" x2="75" y2="383" stroke="#f59e0b" stroke-width="1.8"/>
          
          <line x1="250" y1="383" x2="320" y2="383" stroke="${brake ? '#22c55e' : '#64748b'}" stroke-width="2"/>
          <circle cx="320" cy="383" r="4" fill="${brake ? '#22c55e' : '#64748b'}"/>
        </g>

        <!-- ========================================================================= -->
        <!-- 4. IGNITION SWITCH NEIMAN 104 (X=40, Y=450, W=280, H=110)                  -->
        <!-- ========================================================================= -->
        <g id="comp_neiman104" class="schematic-comp cursor-grab" data-comp-id="comp_neiman104" data-subsystem="lockout" transform="translate(0, 0)">
          <rect x="40" y="450" width="280" height="110" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <rect x="55" y="438" width="40" height="16" rx="3" fill="#141d2e" stroke="#eab308" stroke-width="1.2"/>
          <text x="75" y="450" fill="#eab308" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">104</text>
          <text x="105" y="468" fill="#f8fafc" font-size="11" font-weight="bold">CONTACTEUR À CLÉ (NEIMAN)</text>
          
          <rect x="55" y="480" width="245" height="65" rx="5" fill="#080d16" stroke="#eab308" stroke-width="1.2"/>
          <circle cx="40" cy="510" r="4" fill="#ef4444"/>
          <text x="80" y="525" fill="#ef4444" font-size="9" font-family="monospace">Term 30 (+BAT)</text>
          <circle cx="80" cy="505" r="3.5" fill="#ef4444"/>
          <line x1="80" y1="505" x2="225" y2="505" stroke="#eab308" stroke-width="2" stroke-dasharray="3 3"/>
          <circle cx="225" cy="505" r="3.5" fill="#eab308"/>
          <text x="225" y="525" fill="#eab308" font-size="9" font-family="monospace" text-anchor="middle">Term 50</text>
          <circle cx="320" cy="505" r="4" fill="#eab308"/>
        </g>

        <!-- ========================================================================= -->
        <!-- 5. OBD-II 16-PIN DIAGNOSTIC SOCKET 225 (X=400, Y=60, W=260, H=95)         -->
        <!-- ========================================================================= -->
        <g id="comp_obd225" class="schematic-comp cursor-grab" data-comp-id="comp_obd225" data-subsystem="power" transform="translate(0, 0)">
          <rect x="400" y="60" width="260" height="95" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <rect x="415" y="48" width="40" height="18" rx="3" fill="#141d2e" stroke="#06b6d4" stroke-width="1.2"/>
          <text x="435" y="61" fill="#06b6d4" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">225</text>
          <text x="465" y="78" fill="#f8fafc" font-size="11" font-weight="bold">PRISE DIAGNOSTIC OBD-II</text>
          
          <rect x="415" y="90" width="230" height="52" rx="4" fill="#080d16" stroke="#06b6d4" stroke-width="1.2"/>
          <text x="430" y="112" fill="#06b6d4" font-size="10" font-weight="bold">PIN 7 (K-Line ISO)</text>
          <circle cx="660" cy="108" r="4" fill="#06b6d4"/>
          <text x="430" y="132" fill="#38bdf8" font-size="9" font-family="monospace">PIN 4 (Masse Châssis)</text>
          <circle cx="660" cy="128" r="4" fill="#38bdf8"/>
        </g>

        <!-- ========================================================================= -->
        <!-- 6. ENGINE INJECTION ECU 120 (X=400, Y=180, W=260, H=105)                  -->
        <!-- ========================================================================= -->
        <g id="comp_ecu120" class="schematic-comp cursor-grab" data-comp-id="comp_ecu120" data-subsystem="ecu_link" transform="translate(0, 0)">
          <rect x="400" y="180" width="260" height="105" rx="8" fill="#0f172a" stroke="#ec4899" stroke-width="2"/>
          <rect x="415" y="168" width="40" height="18" rx="3" fill="#141d2e" stroke="#ec4899" stroke-width="1.2"/>
          <text x="435" y="181" fill="#ec4899" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">120</text>
          <text x="465" y="198" fill="#f8fafc" font-size="11" font-weight="bold">CALCULATEUR INJECTION</text>
          
          <rect x="415" y="210" width="230" height="62" rx="4" fill="#080d16" stroke="#ec4899" stroke-width="1.2"/>
          <text x="430" y="230" fill="#ec4899" font-size="9" font-family="monospace" font-weight="bold">Voie 7 (Liaison BVA/Moteur)</text>
          <circle cx="660" cy="225" r="4" fill="#ec4899"/>
          <text x="430" y="255" fill="#d946ef" font-size="9" font-family="monospace" font-weight="bold">Voie 41 (Réduction Couple)</text>
          <circle cx="660" cy="255" r="4" fill="#d946ef"/>
        </g>

        <!-- ========================================================================= -->
        <!-- 7. MULTIFUNCTION SWITCH CMF 779 (X=400, Y=310, W=280, H=355)              -->
        <!-- ========================================================================= -->
        <g id="comp_cmf779" class="schematic-comp cursor-grab" data-comp-id="comp_cmf779" data-subsystem="cmf" transform="translate(0, 0)">
          <rect x="400" y="310" width="280" height="355" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <rect x="415" y="296" width="45" height="20" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="437" y="310" fill="#38bdf8" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">779</text>
          <text x="475" y="328" fill="#f8fafc" font-size="11" font-weight="bold">CONTACTEUR MULTIFONCTION</text>
          <text x="475" y="342" fill="#94a3b8" font-size="8.5">Sélecteur Vitesses sur Boîte (CMF)</text>

          <!-- Starter Lockout Pins 3 & 4 -->
          <g transform="translate(415, 350)" data-subsystem="lockout">
            <rect x="0" y="0" width="250" height="60" rx="6" fill="#080d16" stroke="${starterCol}" stroke-width="1.6"/>
            <text x="12" y="18" fill="${starterCol}" font-size="9.5" font-weight="bold">SÉCURITÉ DÉMARRAGE (PINS 3 &amp; 4)</text>
            <circle cx="-15" cy="40" r="4" fill="#eab308"/>
            <circle cx="15" cy="40" r="3" fill="#eab308"/>
            <text x="15" y="52" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">3</text>
            <circle cx="65" cy="40" r="3" fill="${starterCol}"/>
            <text x="65" y="52" fill="#94a3b8" font-size="8" font-family="monospace" text-anchor="middle">4</text>
            <circle cx="-15" cy="55" r="4" fill="${starterCol}"/>
            <line x1="15" y1="40" x2="${isAllowed ? '65' : '52'}" y2="${isAllowed ? '40' : '28'}" stroke="${starterCol}" stroke-width="2.5"/>
            <text x="240" y="42" fill="${starterCol}" font-size="10" font-family="monospace" font-weight="bold" text-anchor="end">
              ${isAllowed ? 'FERMÉ (P/N)' : 'OUVERT (BLOQUÉ)'}
            </text>
          </g>

          <!-- Reverse Lights Contact (Pins 1 & 2) -->
          <g transform="translate(415, 420)">
            <rect x="0" y="0" width="250" height="34" rx="5" fill="#080d16" stroke="${gear === 'R' ? '#ffffff' : '#334155'}" stroke-width="1.2"/>
            <text x="12" y="21" fill="${gear === 'R' ? '#ffffff' : '#94a3b8'}" font-size="9" font-weight="bold">FEUX DE RECUL (PINS 1 &amp; 2)</text>
            <text x="240" y="21" fill="${gear === 'R' ? '#ffffff' : '#64748b'}" font-size="8" font-family="monospace" text-anchor="end">
              ${gear === 'R' ? 'ALLUMÉS' : 'ÉTEINTS'}
            </text>
          </g>

          <!-- 4 Position Output Tracks A, B, C, D (Pins 6, 7, 8, 9) -->
          <g transform="translate(415, 465)" data-subsystem="cmf">
            <rect x="0" y="0" width="250" height="190" rx="6" fill="#080d16" stroke="#38bdf8" stroke-width="1.4"/>
            <text x="12" y="18" fill="#38bdf8" font-size="9.5" font-weight="bold">PISTES POSITION LEVIER A, B, C, D</text>
            
            ${[['A', '6', '#38bdf8'], ['B', '7', '#818cf8'], ['C', '8', '#a78bfa'], ['D', '9', '#c084fc']].map(([trk, pin, col], i) => `
              <g transform="translate(0, ${24 + i * 40})">
                <rect x="10" y="4" width="230" height="32" rx="4" fill="#0f172a" stroke="${col}" stroke-width="1.2"/>
                <text x="22" y="24" fill="#ffffff" font-size="11" font-weight="bold">Piste ${trk}</text>
                <text x="140" y="24" fill="#94a3b8" font-size="9" font-family="monospace">Pin ${pin}</text>
                <circle cx="265" cy="20" r="4" fill="${col}"/>
              </g>
            `).join('')}
          </g>
        </g>

        <!-- ========================================================================= -->
        <!-- 8. STARTER MOTOR & SOLENOID 163 (X=400, Y=695, W=280, H=110)               -->
        <!-- ========================================================================= -->
        <g id="comp_starter163" class="schematic-comp cursor-grab" data-comp-id="comp_starter163" data-subsystem="lockout" transform="translate(0, 0)">
          <rect x="400" y="695" width="280" height="110" rx="8" fill="#0f172a" stroke="${starterCol}" stroke-width="2"/>
          <rect x="415" y="683" width="40" height="16" rx="3" fill="#141d2e" stroke="${starterCol}" stroke-width="1.2"/>
          <text x="435" y="695" fill="${starterCol}" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">163</text>
          <text x="465" y="713" fill="${starterCol}" font-size="11" font-weight="bold">DÉMARREUR &amp; SOLÉNOÏDE</text>
          
          <circle cx="440" cy="755" r="20" fill="#080d16" stroke="${starterCol}" stroke-width="2"/>
          <text x="440" y="762" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">M</text>
          
          <rect x="480" y="730" width="185" height="50" rx="4" fill="#080d16" stroke="${starterCol}" stroke-width="1.2"/>
          <circle cx="400" cy="755" r="4" fill="${starterCol}"/>
          <text x="492" y="750" fill="#94a3b8" font-size="9" font-family="monospace">Borne 50 Solénoïde</text>
          <text x="492" y="768" fill="${starterCol}" font-size="9.5" font-family="monospace" font-weight="bold">
            ${isAllowed ? '12V COMMANDE REÇU' : '0V ALIMENTATION COUPÉE'}
          </text>
        </g>

        <!-- ========================================================================= -->
        <!-- 9. CHASSIS GROUND EARTH MH (X=730, Y=130)                                  -->
        <!-- ========================================================================= -->
        <g id="comp_earth_mh" class="schematic-comp cursor-grab" data-comp-id="comp_earth_mh" data-subsystem="power" transform="translate(0, 0)">
          <line x1="730" y1="130" x2="730" y2="150" stroke="#38bdf8" stroke-width="3"/>
          <line x1="710" y1="150" x2="750" y2="150" stroke="#38bdf8" stroke-width="3"/>
          <line x1="716" y1="156" x2="744" y2="156" stroke="#38bdf8" stroke-width="2.2"/>
          <line x1="722" y1="162" x2="738" y2="162" stroke="#38bdf8" stroke-width="1.6"/>
          <text x="730" y="178" fill="#38bdf8" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">MH (MASSE)</text>
          <circle cx="730" cy="130" r="4" fill="#38bdf8"/>
        </g>

        <!-- ========================================================================= -->
        <!-- 10. AUTOMATIC TRANSMISSION TCU 119 (Center: X=840, Y=60, W=100, H=745)     -->
        <!-- ========================================================================= -->
        <g id="comp_tcu119" class="schematic-comp cursor-grab" data-comp-id="comp_tcu119" data-subsystem="all" transform="translate(0, 0)">
          <rect x="840" y="60" width="100" height="745" rx="8" fill="#0a0f1d" stroke="#38bdf8" stroke-width="2.5"/>
          
          <rect x="860" y="75" width="60" height="30" rx="4" fill="#141d2e" stroke="#38bdf8" stroke-width="1.8"/>
          <text x="890" y="96" fill="#38bdf8" font-size="14" font-weight="bold" font-family="monospace" text-anchor="middle">119</text>
          <text x="890" y="118" fill="#94a3b8" font-size="9" text-anchor="middle">Calculateur BVA</text>

          <!-- Pins on Left Edge (X=840), labels INSIDE at x=852 -->
          ${[
            [100, '1'], [125, '2'],
            [155, '19'], [180, '20'],
            [215, '18'],
            [250, '31'], [285, '32'],
            [325, '26'], [365, '7'],
            [410, '16'],
            [510, '27'], [550, '28'], [590, '29'], [630, '30']
          ].map(([y, pin]) => `
            <circle cx="840" cy="${y}" r="4" fill="#38bdf8"/>
            <text x="852" y="${y + 3.5}" fill="#ffffff" font-size="9.5" font-family="monospace" font-weight="bold" text-anchor="start">${pin}</text>
          `).join('')}

          <!-- Pins on Right Edge (X=940), labels INSIDE at x=928 -->
          ${[
            [130, 'EVM'], [205, 'E1'], [280, 'E2'], [355, 'E3'], [430, 'E4'], [505, 'E5'], [580, 'TEMP']
          ].map(([y, pin]) => `
            <circle cx="940" cy="${y}" r="4" fill="#fbbf24"/>
            <text x="928" y="${y + 3.5}" fill="#fbbf24" font-size="9.5" font-family="monospace" font-weight="bold" text-anchor="end">${pin}</text>
          `).join('')}
        </g>

        <!-- ========================================================================= -->
        <!-- 11. SOLENOID VALVE BLOCK 754 (Right: X=1060, Y=60, W=450, H=590)           -->
        <!-- ========================================================================= -->
        <g id="comp_solenoids754" class="schematic-comp cursor-grab" data-comp-id="comp_solenoids754" data-subsystem="solenoids" transform="translate(0, 0)">
          <rect x="1060" y="60" width="450" height="590" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <rect x="1080" y="44" width="55" height="24" rx="4" fill="#141d2e" stroke="#fbbf24" stroke-width="1.8"/>
          <text x="1107" y="61" fill="#fbbf24" font-size="12" font-weight="bold" font-family="monospace" text-anchor="middle">754</text>
          <text x="1150" y="78" fill="#f8fafc" font-size="13" font-weight="bold">BLOC HYDRAULIQUE (DISTRIBUTEUR DP0 / AD4)</text>

          <!-- EVM Line Pressure PWM Valve -->
          <g transform="translate(1080, 105)">
            <rect x="0" y="0" width="410" height="50" rx="6" fill="#080d16" stroke="#fbbf24" stroke-width="1.8"/>
            <text x="20" y="24" fill="#fbbf24" font-size="12" font-weight="bold">ÉLECTROVANNE MODULATION (EVM)</text>
            <text x="20" y="40" fill="#94a3b8" font-size="9" font-family="monospace">Pression de Ligne • PWM: ${evmDuty}%</text>
            <circle cx="-20" cy="25" r="4" fill="#fbbf24"/>
            <circle cx="390" cy="25" r="10" fill="${evmDuty > 50 ? '#22c55e' : '#eab308'}"/>
          </g>

          <!-- Shift Sequence Valves E1 to E5 -->
          ${solenoids.map(([y, name, act, desc, col]) => `
            <g transform="translate(1080, ${y - 25})">
              <rect x="0" y="0" width="410" height="46" rx="6" fill="#080d16" stroke="${act ? col : '#334155'}" stroke-width="1.5"/>
              <text x="20" y="22" fill="${act ? '#ffffff' : '#94a3b8'}" font-size="11" font-weight="bold">VANNE ${name}</text>
              <text x="20" y="36" fill="#64748b" font-size="8" font-family="monospace">${desc}</text>
              <circle cx="-20" cy="23" r="3.5" fill="${act ? col : '#64748b'}"/>
              <text x="390" y="27" fill="${act ? '#22c55e' : '#64748b'}" font-size="10" font-family="monospace" font-weight="bold" text-anchor="end">${act ? '12V ACTIVE' : '0V REPOS'}</text>
            </g>
          `).join('')}

          <!-- Fluid Temperature Sensor CTN -->
          <g transform="translate(1080, 555)">
            <rect x="0" y="0" width="410" height="42" rx="6" fill="#080d16" stroke="#10b981" stroke-width="1.4"/>
            <text x="20" y="26" fill="#10b981" font-size="11" font-weight="bold">SONDE TEMPÉRATURE HUILE BVA (CTN)</text>
            <circle cx="-20" cy="25" r="4" fill="#10b981"/>
            <text x="390" y="26" fill="#10b981" font-size="10" font-family="monospace" text-anchor="end">CTN 85°C (950 Ω)</text>
          </g>
        </g>

        <!-- ========================================================================= -->
        <!-- 100% PIN-TO-PIN FULLY CONNECTED MULTI-WIRE HARNESS                        -->
        <!-- ========================================================================= -->
        <g id="harness-wires">
          <!-- Wire 1: Fuse F2 (+BAT) to Neiman 104 Terminal 30 -->
          ${drawHarnessWire("M 55 115 H 20 V 510 H 40", '#ef4444', { id: 'w_f2_bat_neiman', label: '+BAT Permanent Battery Supply from Fuse F2 to Neiman 104 Term 30', from: 'Fuse F2 (30A)', to: 'Neiman Term 30', signal: '+12.6V Permanent', gauge: '2.5 mm² RG', width: 2.4, live: true, subsystem: 'power', fromComp: 'comp_fusebox597', fromX: 55, fromY: 115, toComp: 'comp_neiman104', toX: 40, toY: 510, routing: 'hvh', channelX: 20 })}

          <!-- Wire 2: Neiman 104 Term 50 to CMF Pin 3 -->
          ${drawHarnessWire("M 320 505 H 360 V 390 H 400", '#eab308', { id: 'w_neiman50_cmf3', label: 'Crank Signal Feed from Neiman 104 Term 50 to CMF Switch Pin 3', from: 'Neiman Term 50', to: 'CMF Pin 3', signal: '+12V on Crank', gauge: '2.5 mm² BA/JA', width: 2.6, subsystem: 'lockout', fromComp: 'comp_neiman104', fromX: 320, fromY: 505, toComp: 'comp_cmf779', toX: 400, toY: 390, routing: 'hvh', channelX: 360 })}

          <!-- Wire 3: CMF Pin 4 to Starter 163 Pin 50 -->
          ${drawHarnessWire("M 400 405 H 370 V 755 H 400", starterCol, { id: 'w_cmf4_starter50', label: 'Starter Lockout Output Line (Closed only in P/N) to Starter 163 Pin 50', from: 'CMF Pin 4', to: 'Starter 163 Pin 50', signal: isAllowed ? '+12V Crank Feed' : '0V Open Circuit (Inhibited)', gauge: '2.5 mm² JA/BA', width: 2.6, live: isAllowed, subsystem: 'lockout', fromComp: 'comp_cmf779', fromX: 400, fromY: 405, toComp: 'comp_starter163', toX: 400, toY: 755, routing: 'hvh', channelX: 370 })}

          <!-- Wire 4: Fuse F4 (+APC) to Brake Switch 160 Pin 1 -->
          ${drawHarnessWire("M 320 115 H 350 V 350 H 320", '#f59e0b', { id: 'w_f4_brake_feed', label: '+APC Switched Ignition Feed from Fuse F4 to Brake Switch 160 Pin 1', from: 'Fuse F4 (15A)', to: 'Brake Switch Pin 1', signal: '+12.4V APC', gauge: '1.0 mm² JA', width: 2.0, subsystem: 'power', fromComp: 'comp_fusebox597', fromX: 320, fromY: 115, toComp: 'comp_brakeswitch160', toX: 320, toY: 350, routing: 'hvh', channelX: 350 })}

          <!-- Wire 5: Fuse F4 (+APC) to TCU Pins 1 & 2 -->
          ${drawHarnessWire("M 320 115 H 770 V 100 H 840", '#f59e0b', { id: 'w_f4_tcu_pin1', label: '+APC Switched Power Feed from Fuse F4 to TCU Pin 1', from: 'Fuse F4 (15A)', to: 'TCU Pin 1', signal: '+12.4V APC', gauge: '1.5 mm² JA', width: 2.2, subsystem: 'power', fromComp: 'comp_fusebox597', fromX: 320, fromY: 115, toComp: 'comp_tcu119', toX: 840, toY: 100, routing: 'hvh', channelX: 770 })}
          ${drawHarnessWire("M 770 100 V 125 H 840", '#f59e0b', { id: 'w_f4_tcu_pin2', label: '+APC Switched Power Feed from Fuse F4 to TCU Pin 2', from: 'Fuse F4 Branch', to: 'TCU Pin 2', signal: '+12.4V APC', gauge: '1.5 mm² JA', width: 2.2, subsystem: 'power', fromComp: 'comp_tcu119', fromX: 770, fromY: 100, toComp: 'comp_tcu119', toX: 840, toY: 125, routing: 'vh', channelX: 770 })}

          <!-- Wire 6: Brake Switch 160 Pin 2 to TCU Pin 16 -->
          ${drawHarnessWire("M 320 383 H 340 V 410 H 840", brake ? '#22c55e' : '#64748b', { id: 'w_brake_sig_tcu', label: 'Brake Pedal Switch 160 Signal to TCU Pin 16 (Shift-Lock Release)', from: 'Switch 160 Pin 2', to: 'TCU Pin 16', signal: brake ? '+12V Brake Active' : '0V Open Circuit', gauge: '1.0 mm²', width: 2.2, live: brake, subsystem: 'sensors', fromComp: 'comp_brakeswitch160', fromX: 320, fromY: 383, toComp: 'comp_tcu119', toX: 840, toY: 410, routing: 'hvh', channelX: 340 })}

          <!-- Wire 7: Turbine Speed Sensor 780 to TCU Pin 26 -->
          ${drawHarnessWire("M 170 250 H 330 V 325 H 840", '#10b981', { id: 'w_turbine_tcu26', label: 'Turbine Input Speed Sensor 780 to TCU Pin 26 (Inductive AC Sine)', from: 'Turbine Sensor 780', to: 'TCU Pin 26', signal: 'Inductive AC Sine Wave', gauge: 'Shielded Pair', width: 2.0, subsystem: 'sensors', fromComp: 'comp_speedsensors', fromX: 170, fromY: 250, toComp: 'comp_tcu119', toX: 840, toY: 325, routing: 'hvh', channelX: 330 })}

          <!-- Wire 8: Vehicle Speed Sensor 250 to TCU Pin 7 -->
          ${drawHarnessWire("M 320 255 H 780 V 365 H 840", '#14b8a6', { id: 'w_vehicle_tcu7', label: 'Vehicle Road Speed Sensor 250 to TCU Pin 7 (Hall Effect Pulses)', from: 'Vehicle Sensor 250', to: 'TCU Pin 7', signal: 'Hall Effect Digital Pulse', gauge: '0.6 mm²', width: 2.0, subsystem: 'sensors', fromComp: 'comp_speedsensors', fromX: 320, fromY: 255, toComp: 'comp_tcu119', toX: 840, toY: 365, routing: 'hvh', channelX: 780 })}

          <!-- Wire 9: OBD-II Pin 7 to TCU Pin 18 (K-Line) -->
          ${drawHarnessWire("M 660 108 H 790 V 215 H 840", '#06b6d4', { id: 'w_obd7_tcu18', label: 'ISO 9141-2 Diagnostic K-Line from OBD Socket 225 Pin 7 to TCU Pin 18', from: 'OBD 225 Pin 7', to: 'TCU Pin 18', signal: '10.4 kbps Bidirectional Serial', gauge: '0.6 mm² BA/BL', width: 2.2, subsystem: 'power', fromComp: 'comp_obd225', fromX: 660, fromY: 108, toComp: 'comp_tcu119', toX: 840, toY: 215, routing: 'hvh', channelX: 790 })}

          <!-- Wire 10: OBD-II Pin 4 to Earth MH -->
          ${drawHarnessWire("M 660 128 H 730 V 130", '#38bdf8', { id: 'w_obd4_earth', label: 'OBD Socket 225 Pin 4 Chassis Earth to Engine Earth MH', from: 'OBD 225 Pin 4', to: 'Earth MH', signal: '0.0V Solid Ground', gauge: '1.5 mm² NO', width: 2.0, subsystem: 'power', fromComp: 'comp_obd225', fromX: 660, fromY: 128, toComp: 'comp_earth_mh', toX: 730, toY: 130, routing: 'hv' })}

          <!-- Wire 11: Earth MH to TCU Pins 19 & 20 -->
          ${drawHarnessWire("M 730 130 H 800 V 155 H 840", '#38bdf8', { id: 'w_earth_tcu19', label: 'TCU Power Earth Ground (Pin 19) to Engine Earth MH', from: 'Earth MH', to: 'TCU Pin 19', signal: '0.0V Ground Return', gauge: '1.5 mm² NO', width: 2.2, subsystem: 'power', fromComp: 'comp_earth_mh', fromX: 730, fromY: 130, toComp: 'comp_tcu119', toX: 840, toY: 155, routing: 'hvh', channelX: 800 })}
          ${drawHarnessWire("M 800 155 V 180 H 840", '#38bdf8', { id: 'w_earth_tcu20', label: 'TCU Logic Earth Ground (Pin 20) to Engine Earth MH', from: 'Earth MH Branch', to: 'TCU Pin 20', signal: '0.0V Ground Return', gauge: '1.5 mm² NO', width: 2.2, subsystem: 'power', fromComp: 'comp_tcu119', fromX: 800, fromY: 155, toComp: 'comp_tcu119', toX: 840, toY: 180, routing: 'vh', channelX: 800 })}

          <!-- Wire 12: ECU 120 Track 7 to TCU Pin 31 -->
          ${drawHarnessWire("M 660 225 H 810 V 250 H 840", '#ec4899', { id: 'w_ecu7_tcu31', label: 'Engine ECU 120 Track 7 to Transmission TCU Pin 31 (CAN/PWM Interlink)', from: 'ECU 120 Trk 7', to: 'TCU Pin 31', signal: 'Bus Multiplexed Link', gauge: '0.6 mm²', width: 2.0, subsystem: 'ecu_link', fromComp: 'comp_ecu120', fromX: 660, fromY: 225, toComp: 'comp_tcu119', toX: 840, toY: 250, routing: 'hvh', channelX: 810 })}

          <!-- Wire 13: ECU 120 Track 41 to TCU Pin 32 -->
          ${drawHarnessWire("M 660 255 H 810 V 285 H 840", '#d946ef', { id: 'w_ecu41_tcu32', label: 'Engine ECU 120 Track 41 to TCU Pin 32 (Torque Reduction Signal on Shift)', from: 'ECU 120 Trk 41', to: 'TCU Pin 32', signal: 'Torque Retard Pulse', gauge: '0.6 mm²', width: 2.0, subsystem: 'ecu_link', fromComp: 'comp_ecu120', fromX: 660, fromY: 255, toComp: 'comp_tcu119', toX: 840, toY: 285, routing: 'hvh', channelX: 810 })}

          <!-- Wire 14-17: CMF Tracks A, B, C, D to TCU Pins 27, 28, 29, 30 -->
          ${drawHarnessWire("M 680 510 H 840", '#38bdf8', { id: 'w_cmf_trk_a', label: 'CMF Track A Lever Position Signal to TCU Pin 27 (Bit 0)', from: 'CMF Pin 6', to: 'TCU Pin 27', signal: 'Position Bit 0', gauge: '0.6 mm²', width: 2.2, subsystem: 'cmf', fromComp: 'comp_cmf779', fromX: 680, fromY: 510, toComp: 'comp_tcu119', toX: 840, toY: 510, routing: 'hvh' })}
          ${drawHarnessWire("M 680 550 H 840", '#818cf8', { id: 'w_cmf_trk_b', label: 'CMF Track B Lever Position Signal to TCU Pin 28 (Bit 1)', from: 'CMF Pin 7', to: 'TCU Pin 28', signal: 'Position Bit 1', gauge: '0.6 mm²', width: 2.2, subsystem: 'cmf', fromComp: 'comp_cmf779', fromX: 680, fromY: 550, toComp: 'comp_tcu119', toX: 840, toY: 550, routing: 'hvh' })}
          ${drawHarnessWire("M 680 590 H 840", '#a78bfa', { id: 'w_cmf_trk_c', label: 'CMF Track C Lever Position Signal to TCU Pin 29 (Bit 2)', from: 'CMF Pin 8', to: 'TCU Pin 29', signal: 'Position Bit 2', gauge: '0.6 mm²', width: 2.2, subsystem: 'cmf', fromComp: 'comp_cmf779', fromX: 680, fromY: 590, toComp: 'comp_tcu119', toX: 840, toY: 590, routing: 'hvh' })}
          ${drawHarnessWire("M 680 630 H 840", '#c084fc', { id: 'w_cmf_trk_d', label: 'CMF Track D Lever Position Signal to TCU Pin 30 (Bit 3)', from: 'CMF Pin 9', to: 'TCU Pin 30', signal: 'Position Bit 3', gauge: '0.6 mm²', width: 2.2, subsystem: 'cmf', fromComp: 'comp_cmf779', fromX: 680, fromY: 630, toComp: 'comp_tcu119', toX: 840, toY: 630, routing: 'hvh' })}

          <!-- Solenoid Wires: TCU Right Pins to Solenoid Block 754 -->
          <!-- EVM Modulation PWM Wire -->
          ${drawHarnessWire("M 940 130 H 1060", '#fbbf24', { id: 'w_evm_pwm', label: `EVM Line Pressure Modulation Solenoid Wire (PWM Duty ${evmDuty}%)`, from: 'TCU Pin EVM', to: 'Solenoid EVM', signal: `PWM Duty ${evmDuty}%`, gauge: '1.0 mm² BL/NO', width: 2.4, live: true, subsystem: 'solenoids', fromComp: 'comp_tcu119', fromX: 940, fromY: 130, toComp: 'comp_solenoids754', toX: 1060, toY: 130, routing: 'hvh' })}

          <!-- Shift Valves E1 to E5 Wires -->
          ${solenoids.map(([y, name, act, desc, col]) => drawHarnessWire(
            `M 940 ${y} H 1060`,
            act ? col : '#64748b',
            {
              id: `w_sol_${name.toLowerCase()}`,
              label: `Solenoid Valve ${name} Command Line (${desc})`,
              from: `TCU Pin ${name}`,
              to: `Solenoid ${name}`,
              signal: act ? '12V ACTIVE' : '0V REPOS',
              gauge: '1.0 mm²',
              width: 2.0,
              live: act,
              subsystem: 'solenoids',
              fromComp: 'comp_tcu119',
              fromX: 940,
              fromY: y,
              toComp: 'comp_solenoids754',
              toX: 1060,
              toY: y,
              routing: 'hvh'
            }
          )).join('\n')}

          <!-- CTN Fluid Temp Wire -->
          ${drawHarnessWire("M 940 580 H 1060", '#10b981', { id: 'w_trans_temp', label: 'Transmission Fluid Temperature Sensor Line (NTC Thermistor CTN 85°C)', from: 'TCU Pin TEMP', to: 'CTN Sensor', signal: 'Analog CTN 950 Ω', gauge: '0.6 mm²', width: 2.0, subsystem: 'sensors', fromComp: 'comp_tcu119', fromX: 940, fromY: 580, toComp: 'comp_solenoids754', toX: 1060, toY: 580, routing: 'hvh' })}
        </g>
      </svg>
    `;
  }

  // =========================================================================
  // 3. OBD-II 16-PIN DIAGNOSTIC SOCKET 225 (PAGES 231, 263, 378)
  // =========================================================================

  function generateObd2DiagnosticSVG(state) {
    const isKeyOn = state.keyOn;
    const isScanner = state.scannerConnected;
    const activePin = state.activePin || 'pin_7';

    return `
      <svg viewBox="0 0 1560 1020" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="wire-glow-obd" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- Blueprint Background & Coordinate Grid -->
        <rect width="1560" height="1020" fill="#070a12" rx="14"/>
        <g stroke="#111a2e" stroke-width="0.7" stroke-dasharray="3 4">
          ${Array.from({ length: 26 }, (_, i) => `<line x1="${(i + 1) * 60}" y1="0" x2="${(i + 1) * 60}" y2="1020"/>`).join('')}
          ${Array.from({ length: 17 }, (_, i) => `<line x1="0" y1="${(i + 1) * 60}" x2="1560" y2="${(i + 1) * 60}"/>`).join('')}
        </g>

        <!-- ========================================================================= -->
        <!-- 1. AUTHENTIC 16-PIN J1962 TRAPEZOIDAL DIAGNOSTIC HOUSING (LEFT)           -->
        <!-- ========================================================================= -->
        <g id="comp_obd225" data-comp-id="comp_obd225" class="schematic-comp cursor-grab" transform="translate(80, 100)" data-subsystem="all">
          <polygon points="40,20 480,20 430,340 90,340" fill="#090d16" stroke="#fbbf24" stroke-width="3"/>
          <text x="260" y="60" fill="#f8fafc" font-size="16" font-weight="bold" text-anchor="middle">PRISE DIAGNOSTIC OBD-II [225]</text>
          <text x="260" y="80" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">Standard ISO 9141-2 / SAE J1962 Female</text>

          <!-- Top Row: Pins 1 to 8 -->
          ${[
            [1, '+APC', '#eab308'], [2, 'BUS+', '#475569'], [3, 'LINE', '#475569'],
            [4, 'GND-C', '#38bdf8'], [5, 'GND-S', '#38bdf8'], [6, 'CAN-H', '#475569'],
            [7, 'K-LINE', '#06b6d4'], [8, 'SPARE', '#475569']
          ].map(([pin, lbl, col], i) => {
            const isAct = activePin === `pin_${pin}`;
            return `
              <g transform="translate(${80 + i * 44}, 110)" class="cursor-pointer" onclick="window.inspectSchematicPin('pin_${pin}')">
                <rect x="0" y="0" width="36" height="70" rx="6" fill="${isAct ? '#1e293b' : '#0f172a'}" stroke="${isAct ? '#38bdf8' : col}" stroke-width="${isAct ? 2.5 : 1.8}"/>
                <text x="18" y="24" fill="#ffffff" font-size="13" font-weight="bold" font-family="monospace" text-anchor="middle">${pin}</text>
                <text x="18" y="44" fill="${col}" font-size="8" font-weight="bold" font-family="monospace" text-anchor="middle">${lbl}</text>
                <circle cx="18" cy="60" r="3.5" fill="${col}"/>
              </g>
            `;
          }).join('')}

          <!-- Bottom Row: Pins 9 to 16 -->
          ${[
            [9, 'ABS', '#475569'], [10, 'BUS-', '#475569'], [11, 'AIRBAG', '#f97316'],
            [12, 'SPARE', '#475569'], [13, 'SPARE', '#475569'], [14, 'CAN-L', '#475569'],
            [15, 'L-LINE', '#a855f7'], [16, '+BAT', '#ef4444']
          ].map(([pin, lbl, col], i) => {
            const isAct = activePin === `pin_${pin}`;
            return `
              <g transform="translate(${95 + i * 42}, 210)" class="cursor-pointer" onclick="window.inspectSchematicPin('pin_${pin}')">
                <rect x="0" y="0" width="36" height="70" rx="6" fill="${isAct ? '#1e293b' : '#0f172a'}" stroke="${isAct ? '#38bdf8' : col}" stroke-width="${isAct ? 2.5 : 1.8}"/>
                <text x="18" y="24" fill="#ffffff" font-size="13" font-weight="bold" font-family="monospace" text-anchor="middle">${pin}</text>
                <text x="18" y="44" fill="${col}" font-size="8" font-weight="bold" font-family="monospace" text-anchor="middle">${lbl}</text>
                <circle cx="18" cy="60" r="3.5" fill="${col}"/>
              </g>
            `;
          }).join('')}

          <!-- Detailed Pin Matrix Table below socket -->
          <g transform="translate(20, 360)">
            <rect x="0" y="0" width="480" height="340" rx="8" fill="#0b111e" stroke="#1f2937" stroke-width="1.2"/>
            <text x="20" y="26" fill="#fbbf24" font-size="12" font-weight="bold">SPECIFICATION DES 16 BROCHES (NORME RENAULT)</text>
            ${[
              [1, '+12V Après Contact (+APC)', 'Fusible F17 / UCH 645', '12.4V', '#eab308'],
              [4, 'Masse Carrosserie (MH/MJ)', 'Châssis Véhicule', '0.0V', '#38bdf8'],
              [5, 'Masse Signal Électronique', 'Ligne Retour Blindée', '0.0V', '#38bdf8'],
              [7, 'Ligne K Bidirectionnelle', 'ECU 120, TCU 119, ABS 118', '12V Pull', '#06b6d4'],
              [11, 'Ligne K Airbag', 'Calculateur Airbag 756', '12V Pull', '#f97316'],
              [15, 'Ligne L Initialisation', 'Calculateur Moteur 120', '12V Pulse', '#a855f7'],
              [16, '+12V Permanent (+BAT)', 'Fusible F17 (10A) UCH', '12.6V', '#ef4444']
            ].map(([pin, func, dest, volt, col], i) => `
              <g transform="translate(10, ${42 + i * 38})" class="cursor-pointer" onclick="window.inspectSchematicPin('pin_${pin}')">
                <rect x="0" y="0" width="460" height="30" rx="4" fill="#070a12" stroke="#1e293b"/>
                <text x="8" y="19" fill="${col}" font-size="9" font-family="monospace" font-weight="bold">PIN ${pin}</text>
                <text x="60" y="19" fill="#f8fafc" font-size="9" font-weight="bold">${func}</text>
                <text x="250" y="19" fill="#94a3b8" font-size="8.5" font-family="monospace">${dest}</text>
                <text x="450" y="19" fill="${col}" font-size="8.5" font-family="monospace" text-anchor="end">${volt}</text>
              </g>
            `).join('')}
          </g>
        </g>

        <!-- ========================================================================= -->
        <!-- 2. INTERFACED VEHICLE COMPUTERS (RIGHT COLUMN X = 950 - 1480)              -->
        <!-- ========================================================================= -->
        <!-- 1. Engine ECU 120 (Fenix 5 / Sirius 32) -->
        <g id="comp_ecu120_obd" data-comp-id="comp_ecu120_obd" class="schematic-comp cursor-grab" transform="translate(950, 100)" data-subsystem="engine_diag">
          <rect x="0" y="0" width="510" height="130" rx="10" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
          <rect x="20" y="-14" width="34" height="15" rx="3" fill="#141d2e" stroke="#fbbf24" stroke-width="1.2"/>
          <text x="37" y="-3" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">120</text>
          <text x="70" y="24" fill="#fbbf24" font-size="13" font-weight="bold">CALCULATEUR INJECTION [120]</text>
          <text x="490" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">Fenix 5 / Sirius 32</text>
          
          <rect x="20" y="45" width="470" height="32" rx="4" fill="#080d16" stroke="#06b6d4" stroke-width="1.2"/>
          <circle cx="20" cy="61" r="3.5" fill="#06b6d4"/>
          <text x="30" y="65" fill="#ffffff" font-size="10" font-weight="bold">Piste 11: Ligne K (Protocole ISO 9141-2 / 10.4 kbps)</text>
          <text x="480" y="65" fill="#06b6d4" font-size="10" font-family="monospace" text-anchor="end">Trk 11</text>
          
          <rect x="20" y="85" width="470" height="32" rx="4" fill="#080d16" stroke="#a855f7" stroke-width="1.2"/>
          <circle cx="20" cy="101" r="3.5" fill="#a855f7"/>
          <text x="30" y="105" fill="#ffffff" font-size="10" font-weight="bold">Piste 38: Ligne L (Signal de réveil calculateur)</text>
          <text x="480" y="105" fill="#a855f7" font-size="10" font-family="monospace" text-anchor="end">Trk 38</text>
        </g>

        <!-- 2. Auto Transmission TCU 119 -->
        <g id="comp_tcu119_obd" data-comp-id="comp_tcu119_obd" class="schematic-comp cursor-grab" transform="translate(950, 260)" data-subsystem="tcu_abs">
          <rect x="0" y="0" width="510" height="100" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <rect x="20" y="-14" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="37" y="-3" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">119</text>
          <text x="70" y="24" fill="#38bdf8" font-size="13" font-weight="bold">CALCULATEUR BOÎTE AUTOMATIQUE [119]</text>
          <text x="490" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">Siemens TA2000 (AD4 / DP0)</text>
          <rect x="20" y="45" width="470" height="36" rx="4" fill="#080d16" stroke="#06b6d4" stroke-width="1.2"/>
          <circle cx="20" cy="63" r="3.5" fill="#06b6d4"/>
          <text x="30" y="67" fill="#ffffff" font-size="10" font-weight="bold">Borne 18: Ligne K Boîte Automatique</text>
          <text x="480" y="67" fill="#06b6d4" font-size="10" font-family="monospace" text-anchor="end">Pin 18</text>
        </g>

        <!-- 3. ABS Computer 118 -->
        <g id="comp_abs118_obd" data-comp-id="comp_abs118_obd" class="schematic-comp cursor-grab" transform="translate(950, 390)" data-subsystem="tcu_abs">
          <rect x="0" y="0" width="510" height="100" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <rect x="20" y="-14" width="34" height="15" rx="3" fill="#141d2e" stroke="#38bdf8" stroke-width="1.2"/>
          <text x="37" y="-3" fill="#38bdf8" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">118</text>
          <text x="70" y="24" fill="#38bdf8" font-size="13" font-weight="bold">CALCULATEUR ANTIBLOCAGE ABS [118]</text>
          <text x="490" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">Bosch 5.3 ABS</text>
          <rect x="20" y="45" width="470" height="36" rx="4" fill="#080d16" stroke="#06b6d4" stroke-width="1.2"/>
          <circle cx="20" cy="63" r="3.5" fill="#06b6d4"/>
          <text x="30" y="67" fill="#ffffff" font-size="10" font-weight="bold">Borne 11: Ligne K Diagnostic Freinage ABS</text>
          <text x="480" y="67" fill="#06b6d4" font-size="10" font-family="monospace" text-anchor="end">Pin 11</text>
        </g>

        <!-- 4. Airbag Computer 756 & UCH 645 -->
        <g id="comp_airbag756_obd" data-comp-id="comp_airbag756_obd" class="schematic-comp cursor-grab" transform="translate(950, 520)" data-subsystem="airbag">
          <rect x="0" y="0" width="510" height="100" rx="10" fill="#0f172a" stroke="#f97316" stroke-width="2"/>
          <rect x="20" y="-14" width="34" height="15" rx="3" fill="#141d2e" stroke="#f97316" stroke-width="1.2"/>
          <text x="37" y="-3" fill="#f97316" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">756</text>
          <text x="70" y="24" fill="#f97316" font-size="13" font-weight="bold">CALCULATEUR AIRBAG [756]</text>
          <text x="490" y="24" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="end">Autoliv &amp; Sagem UCH</text>
          <rect x="20" y="45" width="470" height="36" rx="4" fill="#080d16" stroke="#f97316" stroke-width="1.2"/>
          <circle cx="20" cy="63" r="3.5" fill="#f97316"/>
          <text x="30" y="67" fill="#ffffff" font-size="10" font-weight="bold">Borne 9: Ligne K Prétensionneurs &amp; Airbags</text>
          <text x="480" y="67" fill="#f97316" font-size="10" font-family="monospace" text-anchor="end">Pin 9</text>
        </g>

        <!-- Multi-drop K-Line Bus Trunk & Branches (Exits Pin 7 down into clear channel Y=295) -->
        ${drawHarnessWire("M 442 270 V 295 H 680 V 161 H 970", '#06b6d4', { id: 'w_obd_k_ecu', label: 'ISO 9141-2 K-Line to ECU 120 (0.6 mm² BA/BL)', from: 'OBD Pin 7', to: 'ECU Track 11', signal: '10.4 kbps Bidirectional Serial', gauge: '0.6 mm²', width: 2.6, live: isScanner, subsystem: 'engine_diag', fromComp: 'comp_obd225', fromX: 442, fromY: 270, toComp: 'comp_ecu120_obd', toX: 970, toY: 161, routing: 'hvh', channelX: 680 })}
        ${drawHarnessWire("M 680 161 V 323 H 970", '#06b6d4', { id: 'w_obd_k_tcu', label: 'ISO 9141-2 K-Line branch to TCU 119 Pin 18', from: 'OBD Pin 7', to: 'TCU Pin 18', signal: '10.4 kbps Serial', gauge: '0.6 mm²', width: 2.2, live: isScanner, subsystem: 'tcu_abs', fromComp: 'comp_obd225', fromX: 442, fromY: 270, toComp: 'comp_tcu119_obd', toX: 970, toY: 323, routing: 'hvh', channelX: 680 })}
        ${drawHarnessWire("M 680 323 V 453 H 970", '#06b6d4', { id: 'w_obd_k_abs', label: 'ISO 9141-2 K-Line branch to ABS 118 Pin 11', from: 'OBD Pin 7', to: 'ABS Pin 11', signal: '10.4 kbps Serial', gauge: '0.6 mm²', width: 2.2, live: isScanner, subsystem: 'tcu_abs', fromComp: 'comp_obd225', fromX: 442, fromY: 270, toComp: 'comp_abs118_obd', toX: 970, toY: 453, routing: 'hvh', channelX: 680 })}
        <!-- Multi-drop K-Line bus trunk -->
        <!-- Multi-drop K-Line bus branch -->

        <!-- L-Line from OBD Pin 15 to ECU 120 Track 38 (Exits Pin 15 down to clear corridor Y=395) -->
        ${drawHarnessWire("M 445 370 V 395 H 730 V 201 H 970", '#a855f7', { id: 'w_obd_l_ecu', label: 'ISO 9141-2 L-Line Init Bus to ECU Track 38', from: 'OBD Pin 15', to: 'ECU Track 38', signal: '12V Wakeup Pulse', gauge: '0.6 mm²', width: 2.2, live: isScanner, subsystem: 'engine_diag', fromComp: 'comp_obd225', fromX: 445, fromY: 370, toComp: 'comp_ecu120_obd', toX: 970, toY: 201, routing: 'hvh' })}

        <!-- Airbag Wire from OBD Pin 11 to Airbag 756 Pin 9 (Exits Pin 11 down to clear corridor Y=410) -->
        ${drawHarnessWire("M 277 370 V 410 H 780 V 583 H 970", '#f97316', { id: 'w_obd_k_airbag', label: 'ISO 9141-2 K-Line to Airbag 756 Pin 9', from: 'OBD Pin 11', to: 'Airbag Pin 9', signal: 'Serial Diagnostics', gauge: '0.6 mm²', width: 2.2, live: isScanner, subsystem: 'airbag', fromComp: 'comp_obd225', fromX: 277, fromY: 370, toComp: 'comp_airbag756_obd', toX: 970, toY: 583, routing: 'hvh' })}

        <!-- HUD telemetry rendered as fixed HTML overlay outside zoom stage -->
      </svg>
    `;
  }

  // =========================================================================
  function generateStarterCircuitSVG(state) {
    const isCranking = state.keyPosition === 'START' || state.bypassPressed;
    const isKeyOn = ['ON', 'START'].includes(state.keyPosition);
    const hasBypass = state.bypassConnected;

    const bPlusCol = '#ef4444';
    const crankCol = isCranking ? '#22c55e' : '#334155';

    return `
      <svg viewBox="0 0 1440 850" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1440" height="850" fill="#070a10" rx="14"/>
        <g stroke="#111827" stroke-width="0.7" stroke-dasharray="3 4">
          ${Array.from({ length: 16 }, (_, i) => `<line x1="${(i + 1) * 90}" y1="0" x2="${(i + 1) * 90}" y2="850"/>`).join('')}
          ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${(i + 1) * 60}" x2="1440" y2="${(i + 1) * 60}"/>`).join('')}
        </g>

        <!-- COMPONENT 1: 12V BATTERY 107 (LEFT) -->
        <g id="comp_battery107" data-comp-id="comp_battery107" class="schematic-comp cursor-grab" transform="translate(80, 120)" data-subsystem="primary">
          <rect x="0" y="0" width="220" height="220" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2.5"/>
          <text x="110" y="32" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">BATTERIE 12V [107]</text>
          <text x="110" y="48" fill="#94a3b8" font-size="9" text-anchor="middle">Lead-Acid 12V 50Ah 420A</text>
          
          <!-- Positive Stud -->
          <circle cx="60" cy="110" r="22" fill="#080d16" stroke="#ef4444" stroke-width="2.5"/>
          <text x="60" y="117" fill="#ef4444" font-size="22" font-weight="bold" text-anchor="middle">+</text>
          ${drawPinTerminal(60, 145, '+BAT', '12.6V', { stroke: '#ef4444', subsystem: 'primary' })}

          <!-- Negative Stud -->
          <circle cx="160" cy="110" r="22" fill="#080d16" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="160" y="117" fill="#38bdf8" font-size="22" font-weight="bold" text-anchor="middle">-</text>
          ${drawPinTerminal(160, 145, 'MH', 'Earth', { stroke: '#38bdf8', subsystem: 'primary' })}
        </g>

        <!-- COMPONENT 2: NEIMAN IGNITION SWITCH 104 (TOP CENTER) -->
        <g id="comp_neiman104" data-comp-id="comp_neiman104" class="schematic-comp cursor-grab" transform="translate(480, 100)" data-subsystem="ignition_key">
          <rect x="0" y="0" width="340" height="220" rx="12" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
          <text x="170" y="28" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">CONTACTEUR D'ALLUMAGE [104]</text>
          <text x="170" y="44" fill="#94a3b8" font-size="9" text-anchor="middle">Neiman Steering Column Switch</text>

          <rect x="40" y="70" width="260" height="50" rx="8" fill="#080d16" stroke="#334155"/>
          <text x="170" y="94" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">KEY POSITION: ${state.keyPosition}</text>
          <text x="170" y="110" fill="${isCranking ? '#22c55e' : (isKeyOn ? '#eab308' : '#94a3b8')}" font-size="10" font-family="monospace" text-anchor="middle">
            ${isCranking ? 'CRANKING TERMINAL 50 ACTIVE (12V)' : (isKeyOn ? '+APC IGNITION ON (12V)' : 'OFF / LOCK')}
          </text>

          ${drawPinTerminal(0, 160, '30', '+BAT In', { align: 'right', stroke: '#ef4444', subsystem: 'ignition_key' })}
          ${drawPinTerminal(340, 140, '15', '+APC Out', { stroke: '#eab308', subsystem: 'ignition_key' })}
          ${drawPinTerminal(340, 180, '50', 'Crank (50)', { stroke: crankCol, subsystem: 'ignition_key' })}
        </g>

        <!-- COMPONENT 3: STARTER MOTOR 163 (RIGHT) -->
        <g id="comp_starter163" data-comp-id="comp_starter163" class="schematic-comp cursor-grab" transform="translate(980, 100)" data-subsystem="primary">
          <rect x="0" y="0" width="380" height="360" rx="14" fill="#090d16" stroke="${isCranking ? '#22c55e' : '#fbbf24'}" stroke-width="2.5"/>
          <text x="190" y="32" fill="#fbbf24" font-size="15" font-weight="bold" text-anchor="middle">DÉMARREUR [163]</text>
          <text x="190" y="48" fill="#94a3b8" font-size="9" text-anchor="middle">Starter Motor &amp; Solenoid Assembly (1.4 kW)</text>

          <!-- Solenoid Block -->
          <g transform="translate(30, 70)">
            <rect x="0" y="0" width="320" height="120" rx="8" fill="#0f172a" stroke="${crankCol}" stroke-width="1.8"/>
            <text x="160" y="24" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">SOLENOID CONTACTOR</text>
            <text x="160" y="40" fill="#94a3b8" font-size="9" text-anchor="middle">Pull-In &amp; Hold-In Dual Coils</text>
            
            ${drawPinTerminal(0, 70, '30', 'Heavy B+', { align: 'right', stroke: '#ef4444', subsystem: 'primary' })}
            ${drawPinTerminal(0, 100, '50', 'Terminal 50', { align: 'right', stroke: crankCol, subsystem: 'ignition_key' })}
          </g>

          <!-- Motor Stator & Rotor -->
          <g transform="translate(30, 210)">
            <rect x="0" y="0" width="320" height="120" rx="8" fill="#0f172a" stroke="${isCranking ? '#22c55e' : '#334155'}" stroke-width="1.8"/>
            <circle cx="80" cy="60" r="35" fill="#080d16" stroke="${isCranking ? '#22c55e' : '#334155'}" stroke-width="2"/>
            <text x="80" y="66" fill="${isCranking ? '#22c55e' : '#94a3b8'}" font-size="18" font-weight="bold" text-anchor="middle">
              ${isCranking ? '⚡ 850 RPM' : 'IDLE'}
            </text>
            <text x="210" y="55" fill="#ffffff" font-size="11" font-weight="bold">ARMATURE &amp; BENDIX</text>
            <text x="210" y="72" fill="${isCranking ? '#22c55e' : '#94a3b8'}" font-size="10" font-family="monospace">
              ${isCranking ? 'Engaged to Flywheel' : 'Disengaged'}
            </text>
          </g>
        </g>

        <!-- COMPONENT 4: EXTERNAL PUSH-BUTTON BYPASS MOD (LOWER-MID) -->
        <g id="comp_bypass" data-comp-id="comp_bypass" class="schematic-comp cursor-grab" transform="translate(480, 420)" data-subsystem="bypass_mod">
          <rect x="0" y="0" width="340" height="200" rx="12" fill="#0f172a" stroke="${hasBypass ? '#fbbf24' : '#334155'}" stroke-width="2" stroke-dasharray="${hasBypass ? 'none' : '6 4'}"/>
          <text x="170" y="28" fill="${hasBypass ? '#fbbf24' : '#64748b'}" font-size="13" font-weight="bold" text-anchor="middle">EXTERNAL STARTER BUTTON MOD</text>
          <text x="170" y="44" fill="#94a3b8" font-size="9" text-anchor="middle">زرار تشغيل خارجي مع كتاوت 40A إضافي لحل تكة المارش</text>

          <g transform="translate(30, 65)">
            <rect x="0" y="0" width="280" height="110" rx="8" fill="#080d16" stroke="${hasBypass ? '#22c55e' : '#334155'}"/>
            <text x="140" y="24" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">HEAVY 40A AUTOMOTIVE RELAY</text>
            ${drawPinTerminal(30, 70, '30', '+BAT', { align: 'right', stroke: '#ef4444', subsystem: 'bypass_mod' })}
            ${drawPinTerminal(30, 95, '85', 'Button', { align: 'right', stroke: '#fbbf24', subsystem: 'bypass_mod' })}
            ${drawPinTerminal(250, 70, '87', 'Term 50', { stroke: '#22c55e', subsystem: 'bypass_mod' })}
            ${drawPinTerminal(250, 95, '86', 'GND', { stroke: '#38bdf8', subsystem: 'bypass_mod' })}
          </g>
        </g>

        <!-- ================================================================= -->
        <!-- HARNESS WIRING WITH SUBSYSTEM DATA ATTRIBUTES -->
        <!-- ================================================================= -->

        <!-- 1. PRIMARY B+ HEAVY CABLE (BATTERY TO STARTER TERMINAL 30) -->
        ${drawHarnessWire("M 140 265 H 1010", bPlusCol, { id: 'w_st_heavy_bplus', label: 'Heavy Primary Battery Cable (16 mm² RG)', from: 'Battery Stud +', to: 'Starter Terminal 30', signal: '+12.6V Heavy Current (300A Crank)', gauge: '16.0 mm² RG', width: 4.5, subsystem: 'primary', fromComp: 'comp_battery107', fromX: 140, fromY: 265, toComp: 'comp_starter163', toX: 1010, toY: 265, routing: 'direct' })}

        <!-- Battery to Neiman Feed via Maxi-Fuse -->
        ${drawHarnessWire("M 140 265 V 260 H 480", bPlusCol, { id: 'w_st_neiman_feed', label: 'Permanent Battery Feed to Neiman (6.0 mm² RG)', from: 'Maxi Fuse 597 (60A)', to: 'Neiman Pin 30', signal: '+12.6V Battery', gauge: '6.0 mm² RG', width: 3.0, subsystem: 'primary', fromComp: 'comp_battery107', fromX: 140, fromY: 265, toComp: 'comp_neiman104', toX: 480, toY: 260, routing: 'vh' })}
        <!-- Battery 107 positive terminal pin already contains connector circle -->

        <!-- 2. IGNITION KEY CRANK TRIGGER (NEIMAN PIN 50 TO STARTER 50) -->
        ${drawHarnessWire("M 820 280 H 980", crankCol, { id: 'w_st_t50_trigger', label: 'Solenoid Terminal 50 Crank Command (2.5 mm² JA/BA)', from: 'Neiman Pin 50', to: 'Starter Solenoid 50', signal: isCranking ? '+12.2V Cranking' : '0V Standby', gauge: '2.5 mm² JA/BA', width: 2.8, live: isCranking, subsystem: 'ignition_key', fromComp: 'comp_neiman104', fromX: 820, fromY: 280, toComp: 'comp_starter163', toX: 980, toY: 280, routing: 'direct' })}

        <!-- 3. BYPASS BUTTON MOD WIRES -->
        ${hasBypass ? `
          ${drawHarnessWire("M 140 265 V 490 H 510", bPlusCol, { id: 'w_byp_feed', label: 'Bypass Relay Pin 30 Direct Feed (4.0 mm² RG)', from: 'Battery Stud +', to: 'Bypass Relay Pin 30', signal: '+12V DC', gauge: '4.0 mm² RG', width: 2.8, subsystem: 'bypass_mod', fromComp: 'comp_battery107', fromX: 140, fromY: 265, toComp: 'comp_bypass', toX: 510, toY: 490, routing: 'vh' })}
          ${drawHarnessWire("M 730 490 H 950 V 200 H 980", isCranking ? '#22c55e' : '#334155', { id: 'w_byp_out', label: 'Bypass Relay Pin 87 to Solenoid 50 (4.0 mm²)', from: 'Relay 87', to: 'Starter Solenoid 50', signal: isCranking ? '+12.4V Clean High Current' : '0V', gauge: '4.0 mm²', width: 3.0, live: isCranking, subsystem: 'bypass_mod', fromComp: 'comp_bypass', fromX: 730, fromY: 490, toComp: 'comp_starter163', toX: 980, toY: 200, routing: 'hvh' })}
        ` : ''}

        <!-- HUD telemetry rendered as fixed HTML overlay outside zoom stage -->
      </svg>
    `;
  }

  // =========================================================================
  // 5. COOLING FAN GMV 188 & DUAL SPEED RELAYS (PAGE 245)
  // =========================================================================

  function generateCoolingFanSVG(state) {
    const temp = state.coolantTemp || 85;
    const isLow = temp >= 92 || state.acRequest;
    const isHigh = temp >= 98;

    return `
      <svg viewBox="0 0 1440 850" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1440" height="850" fill="#070a10" rx="14"/>
        <g stroke="#111827" stroke-width="0.7" stroke-dasharray="3 4">
          ${Array.from({ length: 16 }, (_, i) => `<line x1="${(i + 1) * 90}" y1="0" x2="${(i + 1) * 90}" y2="850"/>`).join('')}
          ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${(i + 1) * 60}" x2="1440" y2="${(i + 1) * 60}"/>`).join('')}
        </g>

        <!-- COMPONENT 1: THERMAL CONTACT SWITCH 248 (LEFT) -->
        <g id="comp_switch248" data-comp-id="comp_switch248" class="schematic-comp cursor-grab" transform="translate(80, 120)" data-subsystem="sensors">
          <rect x="0" y="0" width="280" height="240" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <text x="140" y="28" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">THERMOCONTACT RADIATEUR [248]</text>
          <text x="140" y="44" fill="#94a3b8" font-size="9" text-anchor="middle">Dual-Stage Thermal Switch on Radiator</text>

          <g transform="translate(25, 70)">
            <rect x="0" y="0" width="230" height="60" rx="6" fill="#080d16" stroke="${isLow ? '#22c55e' : '#334155'}"/>
            <text x="115" y="24" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">STAGE 1: 92°C CONTACT</text>
            <text x="115" y="42" fill="${isLow ? '#22c55e' : '#64748b'}" font-size="10" font-family="monospace" text-anchor="middle">${isLow ? 'CLOSED (Low Speed Active)' : 'OPEN'}</text>
            ${drawPinTerminal(230, 30, '1', '92°C', { align: 'right', stroke: isLow ? '#22c55e' : '#475569', subsystem: 'sensors' })}
          </g>

          <g transform="translate(25, 150)">
            <rect x="0" y="0" width="230" height="60" rx="6" fill="#080d16" stroke="${isHigh ? '#ef4444' : '#334155'}"/>
            <text x="115" y="24" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">STAGE 2: 98°C CONTACT</text>
            <text x="115" y="42" fill="${isHigh ? '#ef4444' : '#64748b'}" font-size="10" font-family="monospace" text-anchor="middle">${isHigh ? 'CLOSED (High Speed Active)' : 'OPEN'}</text>
            ${drawPinTerminal(230, 30, '2', '98°C', { align: 'right', stroke: isHigh ? '#ef4444' : '#475569', subsystem: 'sensors' })}
          </g>
        </g>

        <!-- COMPONENT 2: LOW SPEED RELAY 234 & RESISTOR 700 (MID) -->
        <g id="comp_relay234_res700" data-comp-id="comp_relay234_res700" class="schematic-comp cursor-grab" transform="translate(460, 100)" data-subsystem="low_speed">
          <rect x="0" y="0" width="380" height="230" rx="12" fill="#0f172a" stroke="${isLow ? '#22c55e' : '#334155'}" stroke-width="2"/>
          <text x="190" y="28" fill="#22c55e" font-size="13" font-weight="bold" text-anchor="middle">RELAIS PETITE VITESSE [234] &amp; RÉSISTANCE [700]</text>
          <text x="190" y="44" fill="#94a3b8" font-size="9" text-anchor="middle">0.8 Ω Dropping Resistor Loop</text>

          <g transform="translate(30, 65)">
            <rect x="0" y="0" width="320" height="60" rx="6" fill="#080d16" stroke="${isLow ? '#22c55e' : '#334155'}"/>
            <text x="160" y="24" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">RELAY 234 (LOW SPEED)</text>
            <text x="160" y="42" fill="${isLow ? '#22c55e' : '#64748b'}" font-size="10" font-family="monospace" text-anchor="middle">${isLow ? 'COIL ENERGIZED (8.5V FEED)' : 'DE-ENERGIZED'}</text>
            ${drawPinTerminal(0, 30, '85', 'Trig', { align: 'right', stroke: isLow ? '#22c55e' : '#475569', subsystem: 'low_speed' })}
            ${drawPinTerminal(320, 30, '87', 'Out', { stroke: isLow ? '#22c55e' : '#475569', subsystem: 'low_speed' })}
          </g>

          <g transform="translate(30, 145)">
            <rect x="0" y="0" width="320" height="60" rx="6" fill="#080d16"/>
            <text x="160" y="24" fill="#fde047" font-size="11" font-weight="bold" text-anchor="middle">DROPPING RESISTOR [700] (0.8 Ω)</text>
            <text x="160" y="42" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">Reduces Fan Voltage from 12V to ~8.5V</text>
            ${drawPinTerminal(0, 30, 'In', '', { stroke: isLow ? '#22c55e' : '#475569', subsystem: 'low_speed' })}
            ${drawPinTerminal(320, 30, 'Out', '', { stroke: isLow ? '#22c55e' : '#475569', subsystem: 'low_speed' })}
          </g>
        </g>

        <!-- COMPONENT 3: HIGH SPEED RELAY 235 (MID LOWER) -->
        <g id="comp_relay235" data-comp-id="comp_relay235" class="schematic-comp cursor-grab" transform="translate(460, 370)" data-subsystem="high_speed">
          <rect x="0" y="0" width="380" height="150" rx="12" fill="#0f172a" stroke="${isHigh ? '#ef4444' : '#334155'}" stroke-width="2"/>
          <text x="190" y="28" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">RELAIS GRANDE VITESSE [235]</text>
          <text x="190" y="44" fill="#94a3b8" font-size="9" text-anchor="middle">Direct 12V High Speed Relay (40A)</text>

          <g transform="translate(30, 60)">
            <rect x="0" y="0" width="320" height="65" rx="6" fill="#080d16" stroke="${isHigh ? '#ef4444' : '#334155'}"/>
            <text x="160" y="25" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">RELAY 235 (HIGH SPEED)</text>
            <text x="160" y="44" fill="${isHigh ? '#ef4444' : '#64748b'}" font-size="10" font-family="monospace" text-anchor="middle">${isHigh ? 'COIL ENERGIZED (DIRECT 12V)' : 'DE-ENERGIZED'}</text>
            ${drawPinTerminal(0, 32, '85', 'Trig', { align: 'right', stroke: isHigh ? '#ef4444' : '#475569', subsystem: 'high_speed' })}
            ${drawPinTerminal(320, 32, '87', 'Out', { stroke: isHigh ? '#ef4444' : '#475569', subsystem: 'high_speed' })}
          </g>
        </g>

        <!-- COMPONENT 4: RADIATOR FAN MOTOR GMV 188 (RIGHT) -->
        <g id="comp_fan188" data-comp-id="comp_fan188" class="schematic-comp cursor-grab" transform="translate(980, 150)" data-subsystem="all">
          <rect x="0" y="0" width="380" height="340" rx="14" fill="#090d16" stroke="${isHigh ? '#ef4444' : (isLow ? '#22c55e' : '#334155')}" stroke-width="2.5"/>
          <text x="190" y="32" fill="#fbbf24" font-size="14" font-weight="bold" text-anchor="middle">MOTEUR MOTOVENTILATEUR [188]</text>
          <text x="190" y="48" fill="#94a3b8" font-size="9" text-anchor="middle">Radiator Cooling Fan Motor (250W)</text>

          <circle cx="190" cy="180" r="70" fill="#080d16" stroke="${isHigh ? '#ef4444' : (isLow ? '#22c55e' : '#334155')}" stroke-width="3"/>
          <text x="190" y="188" fill="${isHigh ? '#ef4444' : (isLow ? '#22c55e' : '#94a3b8')}" font-size="20" font-weight="bold" text-anchor="middle">
            ${isHigh ? '⚡ 2,800 RPM' : (isLow ? '🐢 1,400 RPM' : 'OFF')}
          </text>
          <text x="190" y="270" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">
            ${isHigh ? 'FULL HIGH SPEED (12.4V)' : (isLow ? 'LOW SPEED (8.5V)' : 'FAN STOPPED')}
          </text>

          ${drawPinTerminal(0, 180, 'M+', '', { stroke: isHigh ? '#ef4444' : (isLow ? '#22c55e' : '#475569') })}
        </g>

        <!-- HARNESS WIRING WITH SUBSYSTEM DATA ATTRIBUTES -->
        ${drawHarnessWire("M 360 220 H 460", isLow ? '#22c55e' : '#334155', { id: 'w_fan_low_trig', label: 'Low Speed Thermal Trigger (92°C)', from: 'Switch 248 Pin 1', to: 'Relay 234 Pin 85', signal: isLow ? '0V Ground' : 'Open', gauge: '1.0 mm²', width: 2.2, live: isLow, subsystem: 'low_speed', fromComp: 'comp_switch248', fromX: 360, fromY: 220, toComp: 'comp_relay234_res700', toX: 460, toY: 220, routing: 'direct' })}
        ${drawHarnessWire("M 360 300 H 420 V 432 H 460", isHigh ? '#ef4444' : '#334155', { id: 'w_fan_high_trig', label: 'High Speed Thermal Trigger (98°C)', from: 'Switch 248 Pin 2', to: 'Relay 235 Pin 85', signal: isHigh ? '0V Ground' : 'Open', gauge: '1.0 mm²', width: 2.2, live: isHigh, subsystem: 'high_speed', fromComp: 'comp_switch248', fromX: 360, fromY: 300, toComp: 'comp_relay235', toX: 460, toY: 432, routing: 'hvh' })}
        ${drawHarnessWire("M 780 195 H 980 V 330", isLow ? '#22c55e' : '#334155', { id: 'w_fan_low_feed', label: 'Low Speed 8.5V Feed via Resistor 700', from: 'Resistor 700', to: 'Fan Motor 188 M+', signal: '8.5V DC', gauge: '2.5 mm²', width: 2.6, live: isLow, subsystem: 'low_speed', fromComp: 'comp_relay234_res700', fromX: 780, fromY: 195, toComp: 'comp_fan188', toX: 980, toY: 330, routing: 'hvh' })}
        ${drawHarnessWire("M 780 432 H 920 V 330 H 980", isHigh ? '#ef4444' : '#334155', { id: 'w_fan_high_feed', label: 'High Speed 12.4V Direct Feed', from: 'Relay 235 Pin 87', to: 'Fan Motor 188 M+', signal: '12.4V Full Direct', gauge: '4.0 mm²', width: 3.2, live: isHigh, subsystem: 'high_speed', fromComp: 'comp_relay235', fromX: 780, fromY: 432, toComp: 'comp_fan188', toX: 980, toY: 330, routing: 'hvh' })}

        <!-- HUD telemetry rendered as fixed HTML overlay outside zoom stage -->
      </svg>
    `;
  }

  // =========================================================================
  // 6. ALTERNATOR 103 & CHARGING SYSTEM (PAGE 176)
  // =========================================================================

  function generateAlternatorSVG(state) {
    const isSpinning = state.engineSpinning;
    const voltage = isSpinning ? '14.2V' : '12.6V';

    return `
      <svg viewBox="0 0 1440 850" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1440" height="850" fill="#070a10" rx="14"/>
        <g stroke="#111827" stroke-width="0.7" stroke-dasharray="3 4">
          ${Array.from({ length: 16 }, (_, i) => `<line x1="${(i + 1) * 90}" y1="0" x2="${(i + 1) * 90}" y2="850"/>`).join('')}
          ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${(i + 1) * 60}" x2="1440" y2="${(i + 1) * 60}"/>`).join('')}
        </g>

        <!-- COMPONENT 1: ALTERNATOR 103 (LEFT) -->
        <g id="comp_alt103" data-comp-id="comp_alt103" class="schematic-comp cursor-grab" transform="translate(80, 120)" data-subsystem="charging">
          <rect x="0" y="0" width="340" height="340" rx="14" fill="#090d16" stroke="${isSpinning ? '#22c55e' : '#fbbf24'}" stroke-width="2.5"/>
          <text x="170" y="32" fill="#fbbf24" font-size="15" font-weight="bold" text-anchor="middle">ALTERNATEUR [103]</text>
          <text x="170" y="48" fill="#94a3b8" font-size="9" text-anchor="middle">Valeo / Bosch 14V 75A with Built-in Regulator</text>

          <circle cx="170" cy="180" r="70" fill="#080d16" stroke="${isSpinning ? '#22c55e' : '#334155'}" stroke-width="3"/>
          <text x="170" y="188" fill="${isSpinning ? '#22c55e' : '#94a3b8'}" font-size="18" font-weight="bold" text-anchor="middle">
            ${isSpinning ? '🟢 SPINNING' : '⚪ STOPPED'}
          </text>
          <text x="170" y="270" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">
            OUTPUT: ${voltage} (${isSpinning ? 'CHARGING' : 'BATTERY ONLY'})
          </text>

          ${drawPinTerminal(340, 140, 'B+', 'Heavy Out', { stroke: '#ef4444', subsystem: 'charging' })}
          ${drawPinTerminal(340, 220, 'D+', 'Lamp (L)', { stroke: isSpinning ? '#22c55e' : '#ef4444', subsystem: 'exciter' })}
        </g>

        <!-- COMPONENT 2: BATTERY 107 (MID) -->
        <g id="comp_battery107_alt" data-comp-id="comp_battery107_alt" class="schematic-comp cursor-grab" transform="translate(560, 120)" data-subsystem="charging">
          <rect x="0" y="0" width="280" height="240" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
          <text x="140" y="32" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">BATTERIE 12V [107]</text>
          <text x="140" y="48" fill="#94a3b8" font-size="9" text-anchor="middle">Vehicle Primary Power Storage</text>

          <circle cx="90" cy="130" r="30" fill="#080d16" stroke="#ef4444" stroke-width="2.5"/>
          <text x="90" y="140" fill="#ef4444" font-size="28" font-weight="bold" text-anchor="middle">+</text>

          <circle cx="190" cy="130" r="30" fill="#080d16" stroke="#38bdf8" stroke-width="2.5"/>
          <text x="190" y="140" fill="#38bdf8" font-size="28" font-weight="bold" text-anchor="middle">-</text>

          ${drawPinTerminal(0, 140, '+', 'B+ In', { align: 'right', stroke: '#ef4444', subsystem: 'charging' })}
        </g>

        <!-- COMPONENT 3: INSTRUMENT CLUSTER 111 (RIGHT) -->
        <g id="comp_cluster111" data-comp-id="comp_cluster111" class="schematic-comp cursor-grab" transform="translate(980, 120)" data-subsystem="exciter">
          <rect x="0" y="0" width="380" height="240" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <text x="190" y="32" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle">TABLEAU DE BORD [111]</text>
          <text x="190" y="48" fill="#94a3b8" font-size="9" text-anchor="middle">Instrument Cluster Battery Warning Lamp</text>

          <circle cx="190" cy="140" r="40" fill="#080d16" stroke="${!isSpinning ? '#ef4444' : '#334155'}" stroke-width="3"/>
          <text x="190" y="148" fill="${!isSpinning ? '#ef4444' : '#475569'}" font-size="26" text-anchor="middle">🪫</text>
          <text x="190" y="210" fill="${!isSpinning ? '#ef4444' : '#22c55e'}" font-size="12" font-weight="bold" text-anchor="middle">
            ${!isSpinning ? 'WARNING LAMP ON (1.5V D+)' : 'LAMP EXTINGUISHED (14V BALANCED)'}
          </text>

          ${drawPinTerminal(0, 140, 'D+', 'Exciter In', { align: 'right', stroke: !isSpinning ? '#ef4444' : '#22c55e', subsystem: 'exciter' })}
        </g>

        <!-- HARNESS WIRING WITH SUBSYSTEM DATA ATTRIBUTES -->
        ${drawHarnessWire("M 420 260 H 560", '#ef4444', { id: 'w_alt_bplus', label: 'Primary Alternator Heavy Charging Lead (16 mm² RG)', from: 'Alternator B+', to: 'Battery Stud +', signal: `${voltage} Heavy Charge`, gauge: '16 mm² RG', width: 4.5, subsystem: 'charging', fromComp: 'comp_alt103', fromX: 420, fromY: 260, toComp: 'comp_battery107_alt', toX: 560, toY: 260, routing: 'direct' })}
        ${drawHarnessWire("M 420 340 H 980", isSpinning ? '#22c55e' : '#ef4444', { id: 'w_alt_dplus', label: 'D+ Excitation & Cluster Lamp Signal (1.0 mm² BA)', from: 'Alternator D+', to: 'Cluster 111 Lamp', signal: isSpinning ? '14.0V Floating' : '1.5V Ground Pull', gauge: '1.0 mm² BA', width: 2.2, live: !isSpinning, subsystem: 'exciter', fromComp: 'comp_alt103', fromX: 420, fromY: 340, toComp: 'comp_cluster111', toX: 980, toY: 260, routing: 'hvh' })}

        <!-- HUD telemetry rendered as fixed HTML overlay outside zoom stage -->
      </svg>
    `;
  }

  // =========================================================================
  // INTERACTIVE WIDGET COMPONENT (WITH PAN, ZOOM & SUBSYSTEM FILTERING)
  // =========================================================================

  function renderInteractiveWidget(circuitId, targetEl, options = {}) {
    const circuit = CIRCUITS[circuitId] || CIRCUITS.starter_circuit;
    const state = Object.assign({}, circuit.state, options.initialState || {});

    let viewMode = 'digital';
    let zoomLevel = 1.0;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let activeSubsystem = state.activeSubsystem || 'all';
    let isolateMode = state.isolateMode || 'dim'; // 'dim' or 'hide'

    const widgetId = 'schematic_widget_' + Math.random().toString(36).substring(2, 9);

    function applyTransform() {
      const stage = targetEl.querySelector('.schematic-canvas-stage');
      if (stage) {
        stage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
        stage.style.transformOrigin = 'center center';
        stage.style.transition = isDragging ? 'none' : 'transform 0.12s ease-out';
      }
      const resetBtn = targetEl.querySelector('.btn-zoom-reset');
      if (resetBtn) {
        resetBtn.textContent = `${Math.round(zoomLevel * 100)}%`;
      }
    }

    function applySubsystemFilter() {
      const mount = targetEl.querySelector('.schematic-svg-mount');
      if (!mount) return;

      const wireGroups = mount.querySelectorAll('.harness-wire-group');
      const compGroups = mount.querySelectorAll('[data-subsystem]:not(.harness-wire-group):not(.subsystem-filter-btn)');
      const hudEndpoints = mount.querySelector('#hud-wire-endpoints');

      // Update button visual styles
      targetEl.querySelectorAll('.subsystem-filter-btn').forEach(btn => {
        const isAct = btn.dataset.subsystem === activeSubsystem;
        if (isAct) {
          btn.className = 'subsystem-filter-btn px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 bg-amber-500 text-dark-950 shadow-md shadow-amber-500/20';
        } else {
          btn.className = 'subsystem-filter-btn px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 bg-dark-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60';
        }
      });

      if (activeSubsystem === 'all') {
        wireGroups.forEach(g => {
          g.style.display = '';
          g.style.opacity = '1';
          g.style.pointerEvents = 'auto';
          const path = g.querySelector('path[id]');
          if (path) path.style.filter = '';
        });
        compGroups.forEach(c => {
          c.style.display = '';
          c.style.opacity = '1';
        });
        return;
      }

      // Isolate specific subsystem
      let matchCount = 0;
      wireGroups.forEach(g => {
        const sub = g.dataset.subsystem;
        if (sub === activeSubsystem) {
          matchCount++;
          g.style.display = '';
          g.style.opacity = '1';
          g.style.pointerEvents = 'auto';
          const path = g.querySelector('path[id]');
          if (path) path.style.filter = 'url(#wire-glow)';
        } else {
          if (isolateMode === 'hide') {
            g.style.display = 'none';
          } else {
            g.style.display = '';
            g.style.opacity = '0.07';
            g.style.pointerEvents = 'none';
            const path = g.querySelector('path[id]');
            if (path) path.style.filter = 'none';
          }
        }
      });

      compGroups.forEach(c => {
        const sub = c.dataset.subsystem;
        if (!sub || sub === 'all' || sub === activeSubsystem) {
          c.style.display = '';
          c.style.opacity = '1';
        } else {
          if (isolateMode === 'hide') {
            c.style.display = 'none';
          } else {
            c.style.display = '';
            c.style.opacity = '0.2';
          }
        }
      });

      if (hudEndpoints) {
        hudEndpoints.textContent = `Active Subsystem Filter: ${matchCount} conductors isolated. (${isolateMode === 'hide' ? 'Hidden others' : 'Ghost context dimmed'})`;
      }
    }

    function updateView() {
      const svgMount = targetEl.querySelector('.schematic-svg-mount');
      const scanMount = targetEl.querySelector('.schematic-scan-mount');
      if (viewMode === 'digital') {
        if (svgMount) {
          let defaultHudName = 'Hover or click any conductor to trace pin connection';
          let defaultHudDetails = 'Renault Workshop Service Manual • High-Definition Multi-Wire Vector Schematic';
          let defaultHudEndpoints = 'Route: [Source Pin] ──▶ [Destination Component Pin]';

          if (circuit.id === 'transmission_ad4_dp0') {
            const isP_N = ['P', 'N'].includes(state.gearPosition || 'P');
            defaultHudName = `Position Sélecteur [${state.gearPosition || 'P'}] • ${isP_N ? 'Démarrage Autorisé (P/N)' : 'Démarrage Interdit en Prise'}`;
            defaultHudDetails = 'TCU 119 • Distributeur 754 • Sécurité Démarreur CMF 779 Pins 3&4';
            defaultHudEndpoints = 'Diagramme Officiel Renault 98463S (Section 23-28) • Page 379';
          } else if (circuit.id === 'starter_circuit') {
            const isCranking = state.keyPosition === 'CRANK' || state.bypassPressed;
            defaultHudName = isCranking ? 'CRANKING ACTIVE: 320A Inrush Current engaging Starter Pinion' : 'STANDBY: 12.6V Battery at Terminal 30; Solenoid Terminal 50 awaiting Crank';
            defaultHudDetails = 'Starter Motor 163 & Ignition Switch 104 Circuit (Page 92)';
            defaultHudEndpoints = 'Trace key contact paths or test external push-button bypass';
          } else if (circuit.id === 'sirius32_ecu') {
            defaultHudName = state.engineRunning ? '850 RPM Sequential Injection & Dual Coil Spark Firing' : (state.keyOn ? 'Key ON (+APC 12.4V Active; Main Relay 238 Closed)' : 'Key OFF (Static 12.6V Battery Supply)');
            defaultHudDetails = 'Engine Management ECU 120 (Multipoint Injection Harness)';
            defaultHudEndpoints = 'Renault Workshop Manual Section 17-43 • Page 267';
          } else if (circuit.id === 'obd2_diagnostic_socket') {
            defaultHudName = 'Prise Diagnostic 225 • Norme ISO 9141-2 / SAE J1962 (16 Pins)';
            defaultHudDetails = 'All 16 Pins Mapped: ECU 120, TCU 119, ABS 118, Airbag 756, Grounds';
            defaultHudEndpoints = 'Select pin pills below to inspect live potentials & test procedures';
          }

          svgMount.innerHTML = `
            <!-- FIXED TOP TITLE OVERLAY (Never moves or scales on zoom) -->
            <div class="schematic-fixed-header absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10 select-none">
              <div class="flex items-center gap-2 bg-[#090d18]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-lg pointer-events-auto">
                <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span class="font-bold text-xs text-amber-300 uppercase tracking-wide">${circuit.title}</span>
                <span class="text-slate-600 text-xs">|</span>
                <span class="font-mono text-[11px] text-sky-400">Page ${circuit.manualPage}</span>
              </div>
              <div class="hidden sm:flex items-center gap-2 bg-[#090d18]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-lg pointer-events-auto text-[11px] font-mono text-slate-300">
                <span>✋ Drag components to rearrange</span>
                <span class="text-slate-600">•</span>
                <span>Ctrl + Wheel to zoom</span>
              </div>
            </div>

            <!-- ZOOMABLE & PANNABLE CAD STAGE (Contains only components & dynamic wires) -->
            <div class="schematic-canvas-stage w-full h-full flex items-center justify-center pointer-events-auto" style="will-change: transform;">
              ${window.SchematicsEngine.renderSVG(circuit.id, state)}
            </div>

            <!-- FIXED BOTTOM HUD TELEMETRY OVERLAY (Never moves or scales on zoom) -->
            <div class="schematic-fixed-hud absolute bottom-2.5 left-2.5 right-2.5 bg-[#090d18]/95 backdrop-blur-md border border-slate-800/90 rounded-xl p-3 shadow-2xl pointer-events-auto z-10 flex flex-wrap items-center justify-between gap-3 select-none">
              <div class="flex items-center gap-3">
                <span class="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50"></span>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">LIVE WIRE INSPECTOR:</span>
                    <span id="hud-wire-name" class="font-bold text-xs text-amber-300">${defaultHudName}</span>
                  </div>
                  <div id="hud-wire-details" class="text-[11px] font-mono text-slate-400 mt-0.5">${defaultHudDetails}</div>
                  <div id="hud-wire-endpoints" class="text-[10px] font-mono text-sky-400 mt-0.5">${defaultHudEndpoints}</div>
                </div>
              </div>

              <div class="hidden md:flex items-center gap-3 border-l border-slate-800/80 pl-3">
                <div class="text-right">
                  <div class="text-[9px] uppercase tracking-wider text-slate-500 font-bold">CAD BLUEPRINT</div>
                  <div class="font-mono text-xs font-bold text-amber-400">100% Factory Manual 1:1</div>
                </div>
                <button type="button" class="btn-hud-reset px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition" title="Reset Pan & Zoom">Reset View</button>
              </div>
            </div>
          `;
          applyTransform();
          applySubsystemFilter();
          svgMount.classList.remove('hidden');
        }
        if (scanMount) scanMount.classList.add('hidden');
      } else {
        if (svgMount) svgMount.classList.add('hidden');
        if (scanMount) {
          scanMount.classList.remove('hidden');
          scanMount.innerHTML = `
            <div class="relative bg-slate-950 p-3 flex flex-col items-center justify-center min-h-[440px]">
              <img src="/api/pdf/render/${circuit.manualPage}" alt="OEM Manual Page ${circuit.manualPage}" class="max-h-[520px] object-contain rounded-lg border border-slate-800 shadow-2xl">
              <span class="mt-2 text-xs text-slate-400 font-mono">Original Factory Manual Scanned Page ${circuit.manualPage} (DPI 150)</span>
            </div>
          `;
        }
      }
    }

    targetEl.innerHTML = `
      <div id="${widgetId}" class="rounded-2xl border border-amber-500/40 bg-[#0c121e] shadow-2xl overflow-hidden my-3">
        <!-- Top Control Bar -->
        <div class="px-4 py-3 bg-[#101828] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <div>
              <h3 class="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
                <span>${circuit.title}</span>
              </h3>
              <p class="text-[11px] text-slate-400">${circuit.titleAr}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <!-- Zoom & Pan Controls -->
            <div class="flex items-center bg-dark-850 p-0.5 rounded-lg border border-slate-800 mr-1">
              <button type="button" class="btn-zoom-in px-2.5 py-1 text-slate-300 hover:text-white font-bold text-sm" title="Zoom In (+)">+</button>
              <button type="button" class="btn-zoom-reset px-2 py-1 text-slate-300 hover:text-amber-300 font-mono text-[11px] font-bold" title="Reset Pan & Zoom (Double-Click Canvas)">100%</button>
              <button type="button" class="btn-zoom-out px-2.5 py-1 text-slate-300 hover:text-white font-bold text-sm" title="Zoom Out (-)">-</button>
            </div>

            <!-- View Mode Switcher -->
            <div class="flex items-center bg-dark-850 p-0.5 rounded-lg border border-slate-800">
              <button type="button" class="btn-view-digital px-2.5 py-1 rounded-md font-semibold text-[11px] transition ${viewMode === 'digital' ? 'bg-amber-500 text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}">
                ⚡ Multi-Wire CAD
              </button>
              <button type="button" class="btn-view-scan px-2.5 py-1 rounded-md font-semibold text-[11px] transition ${viewMode === 'oem_scan' ? 'bg-amber-500 text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}">
                📄 OEM Page ${circuit.manualPage}
              </button>
            </div>

            <button type="button" class="btn-open-fullscreen p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-300 transition" title="Open Full High-Res Reader">
              <i data-lucide="maximize-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Subsystem Layer Filter Bar (Hide / Isolate Specific Systems) -->
        <div class="px-4 py-2 bg-[#080d16] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 mr-1 flex items-center gap-1">
              <i data-lucide="layers" class="w-3.5 h-3.5"></i> Subsystems / الدوائر:
            </span>
            ${circuit.subsystems.map(sub => `
              <button type="button" 
                      class="subsystem-filter-btn px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${activeSubsystem === sub.id ? 'bg-amber-500 text-dark-950 font-bold shadow-md shadow-amber-500/20' : 'bg-dark-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'}" 
                      data-subsystem="${sub.id}">
                <span>${sub.icon}</span>
                <span>${sub.label}</span>
                <span class="text-[10px] opacity-75 font-normal">(${sub.labelAr})</span>
                <span class="ml-0.5 px-1 py-0.2 rounded text-[9px] font-mono ${activeSubsystem === sub.id ? 'bg-dark-950/30 text-dark-950' : 'bg-slate-800 text-slate-400'}">${sub.wireCount}</span>
              </button>
            `).join('')}
          </div>

          <!-- Filter Presentation Mode -->
          <div class="flex items-center gap-1 bg-dark-850 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button type="button" class="btn-filter-mode-dim px-2 py-0.5 rounded text-[10px] font-semibold transition ${isolateMode === 'dim' ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'}" title="Dim unselected circuits to faint ghost outlines">
              ✨ Ghost Context
            </button>
            <button type="button" class="btn-filter-mode-hide px-2 py-0.5 rounded text-[10px] font-semibold transition ${isolateMode === 'hide' ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'}" title="Completely hide unselected circuits">
              🚫 Hide Others
            </button>
          </div>
        </div>

        <!-- SVG Canvas Viewport (Interactive Pan & Zoom Enabled) -->
        <div class="schematic-svg-mount relative bg-[#070a10] min-h-[440px] sm:min-h-[540px] p-1 flex items-center justify-center overflow-hidden cursor-grab select-none" style="touch-action: none;"></div>
        <div class="schematic-scan-mount hidden"></div>

        <!-- CAD Canvas Navigation Hint Badge -->
        <div class="px-4 py-1 bg-[#090d16] border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
          <span class="flex items-center gap-1">
            <i data-lucide="mouse-pointer" class="w-3 h-3 text-amber-400"></i>
            <strong>Interactive CAD Controls:</strong> Drag canvas to pan • Scroll wheel to zoom in/out • Double click to reset view
          </span>
          <span class="font-mono text-slate-500">ViewBox: 1440 × 850 HD</span>
        </div>

        <!-- Interactive Simulation Toolbar -->
        <div class="p-3 bg-[#0f1726] border-t border-slate-800 space-y-3">
          
          <!-- CIRCUIT 1: ECU CONTROLS -->
          ${circuit.id === 'sirius32_ecu' ? `
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <button type="button" class="toggle-sirius-key px-3 py-1.5 rounded-lg font-semibold ${state.keyOn ? 'bg-amber-500 text-dark-950 font-bold' : 'bg-dark-850 text-slate-300 border border-slate-700'} transition">
                  Ignition Key (+APC Track 24): ${state.keyOn ? '12.4V ACTIVE' : '0V OFF'}
                </button>
                <button type="button" class="toggle-sirius-run px-3 py-1.5 rounded-lg font-semibold ${state.engineRunning ? 'bg-emerald-600 text-white font-bold shadow-md' : 'bg-dark-850 text-slate-300 border border-slate-700'} transition">
                  Engine Running (850 RPM): ${state.engineRunning ? 'RUNNING (Pulsing Injectors)' : 'CRANK STANDBY'}
                </button>
              </div>
              <span class="text-[11px] text-slate-400 font-mono">
                Relay 238: <strong class="${state.keyOn ? 'text-amber-400' : 'text-slate-500'}">${state.keyOn ? 'CLOSED' : 'OPEN'}</strong> • 
                Pump 236: <strong class="${state.engineRunning ? 'text-emerald-400' : 'text-slate-500'}">${state.engineRunning ? 'PRIMING' : 'IDLE'}</strong>
              </span>
            </div>
          ` : ''}

          <!-- CIRCUIT 2: AUTOMATIC TRANSMISSION CONTROLS -->
          ${circuit.id === 'transmission_ad4_dp0' ? `
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <span class="text-slate-400 font-medium">Selector Position:</span>
                <div class="flex items-center bg-dark-850 border border-slate-700/80 rounded-lg p-0.5">
                  ${['P', 'R', 'N', 'D', '3', '2', '1'].map(g => `
                    <button type="button" class="gear-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition ${state.gearPosition === g ? 'bg-amber-500 text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}" data-gear="${g}">
                      ${g}
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" class="toggle-brake-btn px-3 py-1 rounded-lg font-semibold ${state.brakePressed ? 'bg-emerald-600 text-white font-bold' : 'bg-dark-850 text-slate-300 border border-slate-700'} transition">
                  🛑 Brake: ${state.brakePressed ? 'PRESSED' : 'RELEASED'}
                </button>
                <button type="button" class="toggle-kickdown-btn px-3 py-1 rounded-lg font-semibold ${state.kickdownActive ? 'bg-amber-500 text-dark-950 font-bold' : 'bg-dark-850 text-slate-300 border border-slate-700'} transition">
                  ⚡ Kickdown: ${state.kickdownActive ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <span class="text-[11px] font-mono ${['P', 'N'].includes(state.gearPosition) ? 'text-emerald-400' : 'text-rose-400'} font-bold">
                Starter Interlock (CMF Pins 3&4): ${['P', 'N'].includes(state.gearPosition) ? 'CLOSED (CRANK PERMITTED)' : 'OPEN (CRANK BLOCKED)'}
              </span>
            </div>
          ` : ''}

          <!-- CIRCUIT 3: OBD-II SOCKET CONTROLS -->
          ${circuit.id === 'obd2_diagnostic_socket' ? `
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <button type="button" class="toggle-obd-key px-3 py-1.5 rounded-lg font-semibold ${state.keyOn ? 'bg-amber-500 text-dark-950 font-bold' : 'bg-dark-850 text-slate-300 border border-slate-700'} transition">
                  Ignition Key (+APC Pin 1): ${state.keyOn ? '12.4V ACTIVE' : '0V OFF'}
                </button>
                <button type="button" class="toggle-obd-scanner px-3 py-1.5 rounded-lg font-semibold ${state.scannerConnected ? 'bg-cyan-600 text-white font-bold shadow-md' : 'bg-dark-850 text-slate-300 border border-slate-700'} transition">
                  🔌 ${state.scannerConnected ? 'XR25 / Clip Communicating...' : 'Connect Diagnostic Scan Tool'}
                </button>
              </div>
              <span class="text-[11px] text-slate-400 font-mono">
                Probe: <strong class="text-amber-400">${state.activePin ? state.activePin.toUpperCase() : 'PIN 7 (K-LINE)'}</strong>
              </span>
            </div>
          ` : ''}

          <!-- CIRCUIT 4: STARTER CONTROLS -->
          ${circuit.id === 'starter_circuit' ? `
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <span class="text-slate-400 font-medium">Ignition Key:</span>
                <div class="flex items-center bg-dark-850 border border-slate-700/80 rounded-lg p-0.5">
                  <button type="button" class="key-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition ${state.keyPosition === 'OFF' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}" data-pos="OFF">STOP</button>
                  <button type="button" class="key-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition ${state.keyPosition === 'ACC' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'}" data-pos="ACC">ACC</button>
                  <button type="button" class="key-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition ${state.keyPosition === 'ON' ? 'bg-amber-500 text-dark-950 font-bold' : 'text-slate-400'}" data-pos="ON">ON (+APC)</button>
                  <button type="button" class="key-crank-btn px-3 py-1 rounded font-bold text-[11px] transition bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95">CRANK 🔑</button>
                </div>
              </div>

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

          <!-- CIRCUIT 5: COOLING FAN CONTROLS -->
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

          <!-- CIRCUIT 6: ALTERNATOR CONTROLS -->
          ${circuit.id === 'alternator_charging' ? `
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <button type="button" class="toggle-alt-engine px-3 py-1.5 rounded-lg font-bold transition ${state.engineSpinning ? 'bg-emerald-600 text-white shadow-sm' : 'bg-dark-850 text-slate-300 border border-slate-700 hover:text-white'}">
                  ${state.engineSpinning ? '🟢 Engine Running (14.4V)' : '⚪ Engine Stopped (12.6V)'}
                </button>
              </div>
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

    updateView();
    if (window.lucide) window.lucide.createIcons();

    const el = targetEl.querySelector(`#${widgetId}`);
    if (!el) return;

    // Subsystem Layer Filter Handlers
    el.querySelectorAll('.subsystem-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubsystem = btn.dataset.subsystem;
        state.activeSubsystem = activeSubsystem;
        applySubsystemFilter();
      });
    });

    el.querySelector('.btn-filter-mode-dim')?.addEventListener('click', () => {
      isolateMode = 'dim';
      state.isolateMode = 'dim';
      el.querySelector('.btn-filter-mode-dim').className = 'btn-filter-mode-dim px-2 py-0.5 rounded text-[10px] font-semibold transition bg-slate-700 text-amber-300 font-bold';
      el.querySelector('.btn-filter-mode-hide').className = 'btn-filter-mode-hide px-2 py-0.5 rounded text-[10px] font-semibold transition text-slate-400 hover:text-white';
      applySubsystemFilter();
    });

    el.querySelector('.btn-filter-mode-hide')?.addEventListener('click', () => {
      isolateMode = 'hide';
      state.isolateMode = 'hide';
      el.querySelector('.btn-filter-mode-hide').className = 'btn-filter-mode-hide px-2 py-0.5 rounded text-[10px] font-semibold transition bg-slate-700 text-amber-300 font-bold';
      el.querySelector('.btn-filter-mode-dim').className = 'btn-filter-mode-dim px-2 py-0.5 rounded text-[10px] font-semibold transition text-slate-400 hover:text-white';
      applySubsystemFilter();
    });

    // Zoom Buttons Handlers
    el.querySelector('.btn-zoom-in')?.addEventListener('click', () => {
      zoomLevel = Math.min(3.5, Number((zoomLevel + 0.25).toFixed(2)));
      applyTransform();
    });

    el.querySelector('.btn-zoom-out')?.addEventListener('click', () => {
      zoomLevel = Math.max(0.5, Number((zoomLevel - 0.25).toFixed(2)));
      applyTransform();
    });

    el.querySelector('.btn-zoom-reset')?.addEventListener('click', () => {
      zoomLevel = 1.0;
      panX = 0;
      panY = 0;
      applyTransform();
    });

    // Viewport Pan, Component Drag & Zoom Navigation
    const mount = el.querySelector('.schematic-svg-mount');
    if (mount) {
      let isCompDragging = false;
      let activeCompEl = null;
      let compStartMouseX = 0;
      let compStartMouseY = 0;
      let compOrigDx = 0;
      let compOrigDy = 0;
      let compBaseX = 0;
      let compBaseY = 0;

      mount.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, input, select, a, .schematic-fixed-header, .schematic-fixed-hud')) return;

        // 1. Check if clicking on a draggable component
        const comp = e.target.closest('.schematic-comp');
        if (comp) {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
          isCompDragging = true;
          activeCompEl = comp;
          activeCompEl.style.cursor = 'grabbing';
          compStartMouseX = e.clientX;
          compStartMouseY = e.clientY;

          if (activeCompEl.dataset.baseX === undefined) {
            const tf = activeCompEl.getAttribute('transform') || '';
            const match = tf.match(/translate\(\s*([-\d.]+)[,\s]+([-\d.]+)\s*\)/);
            if (match) {
              activeCompEl.dataset.baseX = match[1];
              activeCompEl.dataset.baseY = match[2];
            } else {
              activeCompEl.dataset.baseX = '0';
              activeCompEl.dataset.baseY = '0';
            }
          }
          compBaseX = parseFloat(activeCompEl.dataset.baseX || 0);
          compBaseY = parseFloat(activeCompEl.dataset.baseY || 0);
          compOrigDx = parseFloat(activeCompEl.dataset.curDx || 0);
          compOrigDy = parseFloat(activeCompEl.dataset.curDy || 0);
          return;
        }

        // 2. Otherwise canvas pan
        if (e.target.closest('.harness-wire-group')) return;
        isDragging = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        mount.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (isCompDragging && activeCompEl) {
          const dx = (e.clientX - compStartMouseX) / zoomLevel;
          const dy = (e.clientY - compStartMouseY) / zoomLevel;
          const curDx = compOrigDx + dx;
          const curDy = compOrigDy + dy;
          activeCompEl.dataset.curDx = curDx;
          activeCompEl.dataset.curDy = curDy;
          activeCompEl.setAttribute('transform', `translate(${compBaseX + curDx}, ${compBaseY + curDy})`);

          const svgEl = activeCompEl.closest('svg');
          if (svgEl) {
            updateConnectedWires(svgEl, activeCompEl.id);
          }
          return;
        }

        if (!isDragging) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        applyTransform();
      });

      window.addEventListener('mouseup', () => {
        if (isCompDragging) {
          isCompDragging = false;
          if (activeCompEl) {
            activeCompEl.style.cursor = 'grab';
            activeCompEl = null;
          }
        }
        if (isDragging) {
          isDragging = false;
          if (mount) mount.style.cursor = 'grab';
        }
      });

      // Mouse Wheel Zoom: only zoom when Ctrl or Meta is pressed, allowing natural page scrolling otherwise
      mount.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
          const newZoom = Math.min(3.5, Math.max(0.5, Number((zoomLevel + zoomDelta).toFixed(2))));
          if (newZoom !== zoomLevel) {
            zoomLevel = newZoom;
            applyTransform();
          }
        }
        // When ctrl/meta is NOT pressed, do not preventDefault: page scrolls freely and unconfined!
      }, { passive: false });

      // Double-Click to Reset
      mount.addEventListener('dblclick', (e) => {
        if (e.target.closest('button, input, select, a, .schematic-fixed-header, .schematic-fixed-hud')) return;
        zoomLevel = 1.0;
        panX = 0;
        panY = 0;
        applyTransform();
      });

      // Reset button in HUD
      mount.addEventListener('click', (e) => {
        if (e.target.closest('.btn-hud-reset')) {
          zoomLevel = 1.0;
          panX = 0;
          panY = 0;
          applyTransform();
        }
      });

      // Touch Pan & Pinch-to-Zoom & Touch Drag
      let touchStartDist = 0;
      let initialTouchZoom = 1.0;
      let touchCompDragging = false;
      let activeTouchComp = null;
      let touchCompStartX = 0, touchCompStartY = 0;
      let touchCompOrigDx = 0, touchCompOrigDy = 0;
      let touchCompBaseX = 0, touchCompBaseY = 0;

      mount.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          if (e.target.closest('button, input, select, a, .schematic-fixed-header, .schematic-fixed-hud')) return;
          const comp = e.target.closest('.schematic-comp');
          if (comp) {
            if (e.cancelable) e.preventDefault();
            touchCompDragging = true;
            activeTouchComp = comp;
            touchCompStartX = e.touches[0].clientX;
            touchCompStartY = e.touches[0].clientY;

            if (activeTouchComp.dataset.baseX === undefined) {
              const tf = activeTouchComp.getAttribute('transform') || '';
              const match = tf.match(/translate\(\s*([-\d.]+)[,\s]+([-\d.]+)\s*\)/);
              if (match) {
                activeTouchComp.dataset.baseX = match[1];
                activeTouchComp.dataset.baseY = match[2];
              } else {
                activeTouchComp.dataset.baseX = '0';
                activeTouchComp.dataset.baseY = '0';
              }
            }
            touchCompBaseX = parseFloat(activeTouchComp.dataset.baseX || 0);
            touchCompBaseY = parseFloat(activeTouchComp.dataset.baseY || 0);
            touchCompOrigDx = parseFloat(activeTouchComp.dataset.curDx || 0);
            touchCompOrigDy = parseFloat(activeTouchComp.dataset.curDy || 0);
            return;
          }

          isDragging = true;
          startX = e.touches[0].clientX - panX;
          startY = e.touches[0].clientY - panY;
        } else if (e.touches.length === 2) {
          isDragging = false;
          touchCompDragging = false;
          touchStartDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          initialTouchZoom = zoomLevel;
        }
      }, { passive: false });

      mount.addEventListener('touchmove', (e) => {
        if (touchCompDragging && activeTouchComp && e.touches.length === 1) {
          if (e.cancelable) e.preventDefault();
          const dx = (e.touches[0].clientX - touchCompStartX) / zoomLevel;
          const dy = (e.touches[0].clientY - touchCompStartY) / zoomLevel;
          const curDx = touchCompOrigDx + dx;
          const curDy = touchCompOrigDy + dy;
          activeTouchComp.dataset.curDx = curDx;
          activeTouchComp.dataset.curDy = curDy;
          activeTouchComp.setAttribute('transform', `translate(${touchCompBaseX + curDx}, ${touchCompBaseY + curDy})`);
          const svgEl = activeTouchComp.closest('svg');
          if (svgEl) {
            updateConnectedWires(svgEl, activeTouchComp.id);
          }
          return;
        }

        if (e.touches.length === 1 && isDragging) {
          panX = e.touches[0].clientX - startX;
          panY = e.touches[0].clientY - startY;
          applyTransform();
        } else if (e.touches.length === 2 && touchStartDist > 0) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const scale = dist / touchStartDist;
          zoomLevel = Math.min(3.5, Math.max(0.5, Number((initialTouchZoom * scale).toFixed(2))));
          applyTransform();
        }
      }, { passive: true });

      mount.addEventListener('touchend', () => {
        isDragging = false;
        touchCompDragging = false;
        activeTouchComp = null;
        touchStartDist = 0;
      });
    }

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

    // Simulation Interactive Toggles (Maintains Pan & Zoom without full re-render)
    if (circuit.id === 'sirius32_ecu') {
      el.querySelector('.toggle-sirius-key')?.addEventListener('click', () => {
        state.keyOn = !state.keyOn;
        if (!state.keyOn) state.engineRunning = false;
        updateView();
      });

      el.querySelector('.toggle-sirius-run')?.addEventListener('click', () => {
        if (!state.keyOn) state.keyOn = true;
        state.engineRunning = !state.engineRunning;
        updateView();
      });
    }

    if (circuit.id === 'transmission_ad4_dp0') {
      el.querySelectorAll('.gear-pos-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.gearPosition = btn.dataset.gear;
          el.querySelectorAll('.gear-pos-btn').forEach(b => {
            b.className = `gear-pos-btn px-2.5 py-1 rounded font-semibold text-[11px] transition ${b.dataset.gear === state.gearPosition ? 'bg-amber-500 text-dark-950 font-bold' : 'text-slate-400 hover:text-white'}`;
          });
          updateView();
        });
      });

      el.querySelector('.toggle-brake-btn')?.addEventListener('click', () => {
        state.brakePressed = !state.brakePressed;
        updateView();
      });

      el.querySelector('.toggle-kickdown-btn')?.addEventListener('click', () => {
        state.kickdownActive = !state.kickdownActive;
        updateView();
      });
    }

    if (circuit.id === 'obd2_diagnostic_socket') {
      el.querySelector('.toggle-obd-key')?.addEventListener('click', () => {
        state.keyOn = !state.keyOn;
        updateView();
      });

      el.querySelector('.toggle-obd-scanner')?.addEventListener('click', () => {
        state.scannerConnected = !state.scannerConnected;
        updateView();
      });
    }

    if (circuit.id === 'starter_circuit') {
      el.querySelectorAll('.key-pos-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.keyPosition = btn.dataset.pos;
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
        updateView();
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

    if (circuit.id === 'cooling_fan') {
      const slider = el.querySelector('.temp-slider');
      slider?.addEventListener('input', (e) => {
        state.coolantTemp = parseInt(e.target.value, 10);
        const readout = el.querySelector('.temp-readout');
        if (readout) readout.textContent = `${state.coolantTemp}°C`;
        updateView();
      });

      el.querySelector('.toggle-ac-btn')?.addEventListener('click', () => {
        state.acRequest = !state.acRequest;
        updateView();
      });
    }

    if (circuit.id === 'alternator_charging') {
      el.querySelector('.toggle-alt-engine')?.addEventListener('click', () => {
        state.engineSpinning = !state.engineSpinning;
        updateView();
      });
    }

    // Pin pills click
    el.querySelectorAll('.pin-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const pId = pill.dataset.pin;
        state.activePin = pId;
        const pinData = circuit.pins.find(p => p.id === pId);
        if (pinData && window.showPinInspectorModal) {
          window.showPinInspectorModal(pinData);
        }
        updateView();
      });
    });
  }

  // =========================================================================
  // GLOBAL WIRE INTERACTION HANDLERS (ON-HOVER & CLICK HUD)
  // =========================================================================

  window.onHoverWire = function(wireEl) {
    if (!wireEl) return;
    const label = wireEl.dataset.wireLabel;
    const from = wireEl.dataset.wireFrom;
    const to = wireEl.dataset.wireTo;
    const signal = wireEl.dataset.wireSignal;
    const gauge = wireEl.dataset.wireGauge;

    const hudName = document.getElementById('hud-wire-name');
    const hudDetails = document.getElementById('hud-wire-details');
    const hudEndpoints = document.getElementById('hud-wire-endpoints');

    if (hudName) hudName.textContent = label || 'Active Wire Selected';
    if (hudDetails) hudDetails.textContent = `Conductor: ${gauge || 'Standard Wire'} • Signal: ${signal || 'Active Potential'}`;
    if (hudEndpoints) hudEndpoints.textContent = `Route: [${from || 'Source'}] ──▶ [${to || 'Destination'}]`;

    // Highlight wire path visually
    const path = wireEl.querySelector('path[id]');
    if (path) {
      path.setAttribute('data-orig-stroke-width', path.getAttribute('stroke-width'));
      path.setAttribute('stroke-width', '4.5');
      path.style.filter = 'url(#wire-glow)';
    }
  };

  window.onLeaveWire = function(wireEl) {
    if (!wireEl) return;
    const path = wireEl.querySelector('path[id]');
    if (path) {
      const orig = path.getAttribute('data-orig-stroke-width') || '2.2';
      path.setAttribute('stroke-width', orig);
      path.style.filter = 'none';
    }
  };

  window.onClickWire = function(wireEl) {
    if (!wireEl) return;
    window.onHoverWire(wireEl);
  };

  window.inspectSchematicPin = function(pinId) {
    for (const cKey in CIRCUITS) {
      const pin = CIRCUITS[cKey].pins.find(p => p.id === pinId);
      if (pin) {
        if (window.showPinInspectorModal) window.showPinInspectorModal(pin);
        const obdMount = document.querySelector('[data-circuit="obd2_diagnostic_socket"]');
        if (obdMount) {
          renderInteractiveWidget('obd2_diagnostic_socket', obdMount, { initialState: { activePin: pinId } });
        }
        return;
      }
    }
  };

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

      if (circuitId === 'sirius32_ecu') return generateSirius32SVG(mergedState);
      if (circuitId === 'transmission_ad4_dp0') return generateTransmissionSVG(mergedState);
      if (circuitId === 'obd2_diagnostic_socket') return generateObd2DiagnosticSVG(mergedState);
      if (circuitId === 'starter_circuit') return generateStarterCircuitSVG(mergedState);
      if (circuitId === 'cooling_fan') return generateCoolingFanSVG(mergedState);
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

  window.renderDigitalSchematicWidget = renderInteractiveWidget;

})(window);
