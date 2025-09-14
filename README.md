# Frontend Test for CoverPin Company

A React + TypeScript + Vite frontend that showcases a Leads & Opportunities dashboard with an enhanced, composable data table, mock API via JSON Server, lead generation with Faker, optimistic UI updates, filtering, column visibility controls, and export to PDF/CSV.

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

Install dependencies:
```bash979Z"
}
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