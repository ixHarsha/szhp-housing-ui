# SZHP Housing Assistance — External Form (UI)

The applicant-facing housing assistance request: **list → form → view**.
Built on the same stack and design language as `SZHP-micro-ui`.

| | |
|---|---|
| React | 18 |
| Build | Vite 5 + TypeScript |
| Design system | `@aegov/design-system` v2 (UAE Government DLS) via Tailwind 3 |
| Forms | react-hook-form + zod (`@hookform/resolvers`) |
| HTTP | axios |
| Widgets | antd 5 (Select, DatePicker, Table, Timeline), `@phosphor-icons/react` |

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

`vite.config.ts` proxies `/api` to `http://localhost:8080`.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Set when the API is on another origin. Inlined at build time. |
| `VITE_DEV_API_TARGET` | `http://localhost:8080` | Dev-proxy target only |

## How this relates to SZHP-micro-ui

The real external form ships as a **Module Federation remote** inside
`moei-ui-shared`, importing its primitives from the host (`ui/InputText`,
`ui/Button`, `ui/AntSelect`, …) and its chrome, auth and labels from the shell.

This app is standalone, so those pieces are reproduced locally in
`src/components/ui/` with **the same class contract and the same props**
(`aegov-form-control`, `control-{size}`, `control-error`, `form-control-input`,
`error-message`, `aegov-btn`, `btn-{variant}`, `btn-{size}`, `aegov-check-item`,
`aegov-breadcrumb with-seperator`). What is deliberately left out is the
host-only coupling: `useLoginConfigurationQuery`, `useLanguage`, the
active-task modal, unauth events and the redux store.

To fold this back into the micro-frontend, swap the imports in
`src/components/ui/` for the `ui/*` remotes — the call sites do not change.

### The `hp-` prefix

`src/utils/cssPrefix.ts` is copied verbatim and every Tailwind utility goes
through `hp()`, with `postcss-prefixer` adding the matching `hp-` prefix at
build time, exactly as the micro-app does.

One deviation, and it is required: `postcss.config.js` also ignores the
design-system class names. In the real app that CSS comes from the host and is
never prefixed, but standalone the `@aegov` plugin emits it into this same
pipeline — without the ignores the stylesheet would say
`.hp-aegov-form-control` while the markup says `.aegov-form-control`, and every
control would render unstyled. Note the patterns are matched against the
stringified selector, so they need the leading `\.`.

## Scope

The **external form only** — the applicant journey. No reviewer queue, no
decision actions, no sign-in.

| Route | Screen |
|---|---|
| `/housing-requests` | My requests, with status filter and search |
| `/housing-requests/new` | The request form |
| `/housing-requests/:applicationId` | Read-only view with request history |
| `/housing-requests/:applicationId/edit` | Edit a draft or returned request |

Form sections follow `pages/external-form`: **Social Status**, **Housing
Data**, **Assistance Request Details**, **Residential Details**. Field names
follow `external-form/schema/HousingFormSchema.ts`.

## Contract

`src/types/housing.ts` mirrors `IHousingApplicationDetails`, `IApplicantDetails`,
`IEmployerDetail` and `IAttachment` field-for-field, including existing
spellings (`technicalConsition`, `receviedHousingAID`, `desigination`,
`constructionAreSqFeet`, `noOfChildrens`). **Do not rename these** — they are
the service contract.

`src/constants/housing.ts` carries the code vocabulary read from
`MOEI.dbo`, not invented: `ASSISTANCE_TYPE` `HA`/`FA`, `AID_TYPE`
`LOAN`/`GRANT`/`HF`, `HOUSING_OWNERSHIP` `WITH_RELATIVES`/`WITH_RENT`/…,
`FAMILY_BOOK_EMIRATE` as numeric codes `1`–`7`, and the `STATUS` spellings as
they really occur (`UNDERREVIEW`, `UNDER_REVIEW` and `APPLICATIONUNDERREVIEW`
all appear, so all three are mapped rather than normalised).

## Layout

```
src/
  components/ui/   local stand-ins for the federated ui/* primitives
  components/      FormFieldGenerator, JobDetails, SectionHeader, AppHeader
  pages/           HousingApplicationsList, HousingAssistanceForm, HousingApplicationDetails
  services/        szhpApiClient (axios), szhpService
  constants/       housing.ts
  types/           housing.ts
  utils/           cssPrefix.ts, format.ts
```
