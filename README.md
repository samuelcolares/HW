# Frontend Test for CoverPin Company

A React + TypeScript + Vite frontend that showcases a Leads & Opportunities dashboard with an enhanced, composable data table, mock API via JSON Server, lead generation with Faker, optimistic UI updates, filtering, column visibility controls, and export to PDF/CSV.

### This heavily uses optimistic updates with a rollback on simulated failure.

### Table stores the filter/sort states in the localstorage.
### Screenshots at the end.

## Features

- Leads & Opportunities views with tabbed navigation
- Enhanced table (TanStack Table) with:
  - Global search, sheet-based advanced filters, and quick clear
  - Column visibility and header variants (toggle vs dropdown)
  - Row selection with sidebar details (for leads)
  - Pagination
- Export
  - Export visible or all rows to PDF or CSV (jsPDF + jspdf-autotable)
  - Per-column export metadata for header customization
- Leads generator
  - Generate N leads using Faker
  - Optimistic UI with simulated latency/failures
  - Status filter persisted via URL params and localStorage
- Opportunities form
  - Convert lead to opportunity via dialog form
  - Validate with Zod + React Hook Form
  - Optional combobox for selecting existing account names

## Tech Stack

- React 19, TypeScript, Vite 7
- Tailwind CSS 4, Radix UI primitives
- TanStack Table, React Hook Form, Zod
- Framer Motion
- Axios, JSON Server (mock API)

## Quick Start

Prerequisites:
- Node.js 18+ (recommend LTS)
- git

Clone:
```bash979Z"
git clone https://github.com/samuelcolares/HW.git
```

Install dependencies:
```bash979Z"
cd HW && npm install
```

1/2 Run project:
```bash979Z"
npm run dev
```

2/2 Open another terminal in the same location and run:
```bash979Z"
npm run db
```

## How to Use

- Toggle views: Use the Smooth Tabs at the top of the card to switch between Leads and Opportunities.
- Generate leads: In the Leads view, set a number and click the button to generate/refresh leads.
  - This triggers optimistic UI and a simulated async save; failures roll back the UI.
- Filter leads:
  - Use the status multi-select; selections are reflected in URL params and saved to localStorage.
  - Use the search input and the filter sheet for finer controls.
- Table options:
  - Toggle column visibility and header variant (default toggle vs dropdown).
  - Export:
    - Export visible rows or all rows to PDF/CSV from the toolbar menu.
    - Column export headers can be customized via column `meta.export` settings.
- Convert lead to opportunity:
  - Open the “Convert Lead” dialog, fill fields, and submit.
  - Validation is handled with Zod; successful creation writes to the mock API.

## Project Structure (key parts)

```text
src/
  components/
    enhanced-table/
      composition-pattern/
        filters/            # input, sheet, clear, variants, advanced filter hook
        header/             # header variants (toggle, dropdown)
        toolbar/            # export to PDF/CSV, view options
        body/               # table body + row editor
        enhanced-table.tsx
        root.tsx
        pagination.tsx
        utils.ts
      table-context.tsx
    leads/
      index.tsx             # main leads screen & tabs
      columns.tsx           # leads column definitions
      sidebar.tsx           # lead details sidebar
    opportunities/
      index.tsx
      columns.tsx
      form.tsx              # convert lead dialog form
    ui/ ...                 # button, dialog, input, select, etc.
  hooks/
    use-fake-promises.ts    # simulated success/failure + latency
  lib/
    faker.ts                # generate leads with @faker-js/faker
    types/                  # Lead & Opportunity types
    utils.ts
  providers/
    leads.provider.tsx
    opportunities.provider.tsx
```

## Implementation Details

- Leads provider:
  - Generates N leads (`lib/faker.ts`), sets them optimistically, then persists to `/leads`.
  - On generate/refresh: deletes existing leads and inserts the new ones.
  - Status filter is synced to URL (`leads-filters-status`) and `localStorage`.
- Opportunities provider:
  - Loads from `/opportunities` on startup.
- Export:
  - PDF via jsPDF + `jspdf-autotable`, CSV via Blob download.
  - Export applies a per-column `meta.export` policy (can disable per format or customize headers).

## Troubleshooting

- Blank data or errors:
  - Ensure the mock API is running (`npm run db`) on port 5000.
  - Verify ports 3000 (app) and 5000 (API) are free.
- Network errors:
  - Check CORS or firewall rules; JSON Server should be reachable at `http://localhost:5000`.
- Build issues:
  - Use Node 18+; delete `node_modules` and reinstall if needed.

## License

MIT

# Screenshots
#### First ever load, Empty Leads and Opportunities Table
<img width="1914" height="704" alt="image" src="https://github.com/user-attachments/assets/a4e1c038-bab3-4beb-a269-52290016815a" />
<img width="1916" height="638" alt="image" src="https://github.com/user-attachments/assets/69b7a4a9-7abb-4d19-9f2f-a309ea26c649" />


### 100 Leads Table
<img width="1920" height="5174" alt="image" src="https://github.com/user-attachments/assets/3e9bc358-8b75-4e97-b8e1-9182c07db787" />

### Empty Table Search
<img width="1907" height="551" alt="image" src="https://github.com/user-attachments/assets/6a324354-7a2c-4539-a082-1814643e0ce2" />

### Filters
<img width="498" height="399" alt="image" src="https://github.com/user-attachments/assets/f2fb1f98-9479-4c01-bdb8-07cdd5037791" />
<img width="179" height="269" alt="image" src="https://github.com/user-attachments/assets/bd958401-018c-45ef-a4dd-b2861b39b473" />
<img width="406" height="539" alt="image" src="https://github.com/user-attachments/assets/56e62c10-a064-4a5f-9ebe-03c1c2a65d5c" />
<img width="391" height="217" alt="image" src="https://github.com/user-attachments/assets/15b41d0e-37eb-452d-af97-d778e65e58c4" />
<img width="246" height="282" alt="image" src="https://github.com/user-attachments/assets/7808d40a-6737-4d8e-9c9a-d0c74055b368" />
<img width="515" height="208" alt="image" src="https://github.com/user-attachments/assets/6b2f584d-f427-423c-bb48-af585c74ef18" />

### Leads Sidebar
<img width="1888" height="479" alt="image" src="https://github.com/user-attachments/assets/ac3a87ce-830f-467a-ae71-4497ce985bca" />

### Inline Sidebar edit
<img width="541" height="405" alt="image" src="https://github.com/user-attachments/assets/7b55e260-71fa-482d-bbb9-8c4cb3601cc4" />
<img width="543" height="221" alt="image" src="https://github.com/user-attachments/assets/07cadcb2-20fc-491f-86ef-9a40c203ec2e" />

### Opportunity Form
<img width="540" height="602" alt="image" src="https://github.com/user-attachments/assets/961f1b27-a163-4b5c-95ea-b6daa79d2d6e" />

### Selecting Account Name from a existing company in Leads Table
<img width="487" height="97" alt="image" src="https://github.com/user-attachments/assets/32eff417-34ca-4ab7-8163-b775d0543ec2" />
<img width="474" height="350" alt="image" src="https://github.com/user-attachments/assets/521941af-9e4a-4e53-a860-602dd69099d4" />






