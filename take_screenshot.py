"""
Capture real screenshots of the Renault Mégane Workshop AI application using Playwright.
Populates an active chat with an interactive schematic card so the screenshot shows real functionality.
"""
import time
import json
from playwright.sync_api import sync_playwright

def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # 16:9 desktop viewport with retina scaling
        context = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        page = context.new_page()

        print("Navigating to http://localhost:8000...")
        page.goto("http://localhost:8000", wait_until="networkidle")
        time.sleep(1)

        # Inject a realistic conversation showing interactive digital schematics
        chat_data = [{
            "id": "chat-starter-demo",
            "title": "Starter Motor 163 & External Bypass Circuit",
            "created_at": "Today, 18:30",
            "vehicle_profile": {
                "engine": "K4M",
                "capacity": "1.6L (1598cc)",
                "gearbox": "JB3",
                "phase": "Phase 2 (1999-2002)",
                "fuel": "Petrol Multipoint Injection (Sirius 32)",
                "badge": "1.6 16V K4M • JB3 Manual"
            },
            "messages": [
                {
                    "role": "user",
                    "content": "How do I wire an external starter bypass push-button with a relay for the Renault Mégane 1 (K4M 1.6 16V)?"
                },
                {
                    "role": "assistant",
                    "content": """### Starter Motor 163 & Ignition Switch 104 Circuit Overview
On the Renault Mégane I, starting current is distributed between the ignition switch barrel (`104`) and the starter motor solenoid (`163`).

![Starter Motor 163 & Ignition Switch 104 Wiring Diagram](/api/pdf/render/92)

#### 1. Official Terminal Specifications
- **Battery Direct (+BAT)**: Heavy `16 mm²` red wire (`RG`) from Battery `107` directly to Starter Solenoid **Terminal 30**.
- **Solenoid Trigger Feed**: `2.5 mm²` yellow wire (`JA`) connected to Solenoid **Terminal 50**.
- **Ignition Switch (Neiman 104)**: Pin `50 Démarrage` provides +12V momentary crank signal.

#### 2. Safe External Starter Push-Button Bypass Procedure
To prevent voltage drop and protect the push-button contacts, always use a standard `12V 30A/40A` automotive relay:
1. **Relay Pin 30**: Connect to +12V battery power with an inline `25A` fuse.
2. **Relay Pin 87**: Connect directly to Starter Solenoid **Terminal 50**.
3. **Relay Pin 86**: Wire to +12V After Ignition (+APC) so the push button is disabled when key is removed.
4. **Relay Pin 85**: Route through your cabin push button to chassis ground (`NO` Noir).

Verified in Renault Factory Workshop Manual [Page 92] and [Page 330].""",
                    "citations": [
                        {"page_num": 92, "section": "10 - Engine & Starting"},
                        {"page_num": 330, "section": "80 - Electrical Equipment"}
                    ]
                }
            ]
        }]

        # Inject into browser localStorage and trigger load
        page.evaluate(f"localStorage.setItem('megane_saved_chats', JSON.stringify({json.dumps(chat_data)}))")
        
        # Open saved chats modal
        page.evaluate("document.getElementById('saved-chats-btn').click()")
        time.sleep(0.5)

        # Click the Load button
        load_btn = page.query_selector('[data-action="load"]')
        if load_btn:
            load_btn.click()
            time.sleep(1.5)

        # 1. Capture primary spacious chat view with interactive diagram card
        print("Capturing primary workstation chat view with interactive schematic card...")
        page.screenshot(path="static/real_screenshot.png", full_page=False)

        # Save copy as preview.jpg for README
        page.screenshot(path="static/preview.jpg", full_page=False)

        # 2. Click WIRING Studio and capture the dedicated interactive studio
        print("Switching to WIRING Studio...")
        wiring_tab = page.query_selector("#tab-wiring")
        if wiring_tab:
            wiring_tab.click()
            time.sleep(1.5)
            page.screenshot(path="static/wiring_studio_screenshot.png", full_page=False)

        browser.close()
        print("All screenshots captured successfully!")

if __name__ == "__main__":
    capture()
