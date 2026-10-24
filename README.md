# SPhOH — Saudi Physics Olympiad Hub

**A collaborative learning hub for physics Olympiad students in Saudi Arabia and beyond.**

SPhOH (Saudi Physics Olympiad Hub) is a student-led initiative dedicated to making physics Olympiad preparation more accessible through organized problem sets, learning resources, and collaborative academic development.

The website serves as a central hub for discovering, browsing in-site, and downloading physics resources across different topics and difficulty levels.

## Features

- **Organized resources:** Browse problem sets by physics topic and difficulty level, with live search and filtering.
- **In-Site Curriculum Reader (`preview.html`):** Browse problem sets and official solutions directly inside a themed, distraction-free reader with Focus Mode, quick curriculum switching, and live download tracking.
- **Hidden Admin Panel (`Admin.html`):** Easily add new problem sets or toggle Arabic/English solutions with one click. Accessible strictly by changing `index` to `Admin` in the URL (no public links on the site), protected by a configurable password in `assets/js/main.js` (default: `00000000`).
- **Bilingual interface:** Access resource titles, descriptions, and PDFs in both Arabic and English.
- **Downloadable PDFs & Live Counters:** Download problem sets and their corresponding solutions with automatic download counter tracking.

## Topics & Available Problem Sets

The website organizes resources into the following categories:

| Key | Topic (EN) | Topic (AR) | Available Problem Sets (`file` ID) |
| --- | --- | --- | --- |
| `kin` | Kinematics | الكينماتيكا (الحركة) | `Kinematics_I` (Level I), `Kinematics_II` (Level II) |
| `mech` | Mechanics | الميكانيكا | `Fluids_I` (Level II + Solutions) |
| `math` | Mathematics | الرياضيات | `Units_Conversion_and_Dimensional_Analysis` (Level I), `Trigonometry_I` (Level I), `Vectors` (Level II + EN Solutions), `Algebra_I` (Level II + Solutions) |
| `coll` | Collections | المجموعات | `NSMO_Collection_I` (Level I) |
| `elec` | Electricity and Magnetism | الكهرباء والمغناطيسية | *(Upcoming)* |
| `therm` | Thermodynamics | الديناميكا الحرارية | *(Upcoming)* |
| `opt` | Optics | البصريات | *(Upcoming)* |

### Detailed Resource Catalog

| ID | Topic (`t`) | Level (`l`) | Title (EN / AR) | English PDF (`PDFs/en/`) | Arabic PDF (`PDFs/ar/`) | Official Solutions |
| --- | --- | --- | --- | --- | --- | --- |
| `1` | `kin` | `1` | Kinematics I / الكينماتيكا I | `Kinematics_I_ENG.pdf` | `Kinematics_I_AR.pdf` | — |
| `8` | `kin` | `2` | Kinematics II / الكينماتيكا II | `Kinematics_II_ENG.pdf` | `Kinematics_II_AR.pdf` | — |
| `3` | `mech` | `2` | Fluids I / ميكانيكا الموائع I | `Fluids_I_ENG.pdf` | `Fluids_I_AR.pdf` | `Fluids_I_Solutions_ENG.pdf` / `Fluids_I_Solutions_AR.pdf` |
| `4` | `math` | `1` | Units Conversion & Dimensional Analysis / تحويل الوحدات والتحليل البعدي | `Units_Conversion_and_Dimensional_Analysis_ENG.pdf` | `Units_Conversion_and_Dimensional_Analysis_AR.pdf` | — |
| `5` | `math` | `1` | Trigonometry I / حساب المثلثات I | `Trigonometry_I_ENG.pdf` | `Trigonometry_I_AR.pdf` | — |
| `2` | `math` | `2` | Vectors / المتجهات | `Vectors_ENG.pdf` | `Vectors_AR.pdf` | `Vectors_Solutions_ENG.pdf` (EN) |
| `6` | `math` | `2` | Algebra I / الجبر I | `Algebra_I_ENG.pdf` | `Algebra_I_AR.pdf` | `Algebra_I_Solutions_ENG.pdf` / `Algebra_I_Solutions_AR.pdf` |
| `7` | `coll` | `1` | NSMO Collection I / مجموعة نسمو I | `NSMO_Collection_I_ENG.pdf` | `NSMO_Collection_I_AR.pdf` | — |

## Project Structure

```text
SPhOH-main/
├── index.html                  # Main home page (Hero, Stats, Methodology Pillars, Featured Sets, FAQ)
├── files.html                  # Dedicated Problem Sets & Solutions library with topic/level filters & search
├── preview.html                # Dedicated In-Site Curriculum & Solution Reader (themed PDF viewer & Focus Mode)
├── about.html                  # Dedicated About Us, Difficulty Levels Guide & Founders/Team page
├── contact.html                # Dedicated Contact & Community page (Feedback Form, Telegram, Email)
├── Admin.html                  # Hidden Admin panel (accessible ONLY via URL by changing index to Admin)
├── admin.html                  # Lowercase alias for Admin.html for case-sensitive servers
├── Admin/index.html            # Clean-URL directory support (/Admin)
├── README.md                   # Project documentation
├── data/
│   └── resources.json          # Resource metadata (titles, descriptions, topics, levels, PDF identifiers)
├── assets/
│   ├── css/
│   │   └── style.css           # Unified stylesheet (Light/Dark themes, RTL/LTR, cards, reader, admin panel)
│   ├── js/
│   │   └── main.js             # Unified application logic (ADMIN_PASSWORD, i18n, filters, reader, admin manager)
│   └── icons/
│       ├── apple-touch-icon.png
│       ├── favicon-96x96.png
│       ├── favicon.ico
│       ├── favicon.svg
│       ├── site.webmanifest
│       ├── web-app-manifest-192x192.png
│       └── web-app-manifest-512x512.png
└── PDFs/
    ├── ar/
    │   ├── Algebra_I_AR.pdf
    │   ├── Algebra_I_Solutions_AR.pdf
    │   ├── Fluids_I_AR.pdf
    │   ├── Fluids_I_Solutions_AR.pdf
    │   ├── Kinematics_I_AR.pdf
    │   ├── Kinematics_II_AR.pdf
    │   ├── NSMO_Collection_I_AR.pdf
    │   ├── Trigonometry_I_AR.pdf
    │   ├── Units_Conversion_and_Dimensional_Analysis_AR.pdf
    │   └── Vectors_AR.pdf
    └── en/
        ├── Algebra_I_ENG.pdf
        ├── Algebra_I_Solutions_ENG.pdf
        ├── Fluids_I_ENG.pdf
        ├── Fluids_I_Solutions_ENG.pdf
        ├── Kinematics_I_ENG.pdf
        ├── Kinematics_II_ENG.pdf
        ├── NSMO_Collection_I_ENG.pdf
        ├── Trigonometry_I_ENG.pdf
        ├── Units_Conversion_and_Dimensional_Analysis_ENG.pdf
        ├── Vectors_ENG.pdf
        └── Vectors_Solutions_ENG.pdf
```

## Using the Hidden Admin Page (`Admin.html`)

1. **Accessing Admin:** There are no public buttons or links to the Admin page anywhere on the site. To open it, change `index.html` (or `index`) in your browser URL bar to `Admin.html` (or `Admin` / `admin.html`).
2. **Changing the Password:** Open `assets/js/main.js` and edit the `ADMIN_PASSWORD` constant at the very top of the file:
   ```javascript
   var ADMIN_PASSWORD = '00000000'; // Default password (8 zeros)
   ```
3. **Adding Curricula & Toggling Solutions:**
   - Fill out the **Add / Edit Problem Set** form or click the **Arabic Solution (AR)** / **English Solution (EN)** toggle buttons on any existing curriculum row.
   - Changes take effect immediately in your browser (`localStorage`), and you can click **📥 Download `resources.json`** (or **📋 Copy JSON**) to save the updated `data/resources.json` file permanently to your repository alongside the PDFs in `PDFs/ar/` and `PDFs/en/`.

---

**SPhOH — Saudi Physics Olympiad Hub**

*Making physics Olympiad preparation more accessible, one resource at a time.*
