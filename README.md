# CSV Transaction Validator

A full-stack web application for validating and processing transaction CSV files.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Express 5 + TypeScript (Bun runtime)
- **CSV Processing:** csv-parser, csv-stringify (streaming)
- **File Upload:** multer

## Project Structure

```
server/                         # Express backend
  config/countries.json         # Phone validation rules by country
  src/
    types/index.ts              # Shared types
    services/validator.ts       # Validation engine
    services/csvProcessor.ts    # CSV processing pipeline
    controllers/uploadController.ts
    routes/uploadRoutes.ts
    utils/fileUtils.ts
  index.ts                      # Entry point
  .env                          # PORT=3001

client/                         # React frontend
  src/
    types/index.ts              # Shared types
    components/
      UploadPage.tsx            # File upload form
      ResultPage.tsx            # Processing results & downloads
    App.tsx
    App.css
```

## Setup

### Prerequisites

- [Bun](https://bun.sh) v1.2+

### Install dependencies

```bash
cd server && bun install
cd ../client && bun install
```

### Run the server

```bash
cd server
bun run index.ts
```

Server runs on `http://localhost:3001`.

### Run the client

In a separate terminal:

```bash
cd client
bun run dev
```

Client runs on `http://localhost:5173` and proxies API requests to the server.

## Usage

1. Open `http://localhost:5173` in your browser
2. Upload a CSV file with transaction data
3. View validation results (total/valid/invalid rows)
4. Download cleaned CSV and validation error reports

### How validation works

The validator is **fully data-driven** — it reads the actual CSV headers and infers errors purely from data inconsistencies. No column names are hardcoded.

| Check | Description |
|---|---|
| Missing values | Any empty cell in any column is flagged |
| Duplicate values | If the same value appears more than once in a column, subsequent occurrences are flagged |
| Type inconsistency | After seeing 10+ rows, if a column is 80%+ numeric, any non-numeric value is flagged |

This means any CSV can be uploaded — the validator adapts to whatever columns exist.

### Large CSV handling

CSVs with more than 10,000 valid rows are automatically split into multiple output files (`cleaned_part_1.csv`, `cleaned_part_2.csv`, etc.).

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload CSV file (multipart/form-data, field: `file`) |
| GET | `/output/:filename` | Download processed file (e.g., `cleaned_part_1.csv`, `validation_errors.csv`) |

## Configuration

### Adding country phone validation

Edit `server/config/countries.json`:

```json
{
  "DE": { "countryCode": "+49", "phoneLength": 11 }
}
```
