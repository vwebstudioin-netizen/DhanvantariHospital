"use client";

import { useRef, useState } from "react";
import { Upload, Download, X, CheckCircle, AlertCircle, Loader2, FileText } from "lucide-react";
import { MEDICINE_CATEGORIES, type Medicine, type MedicineUnit } from "@/types/medicine";
import { addMedicine } from "@/lib/medicines";
import toast from "react-hot-toast";

// ── CSV columns in order ──────────────────────────────────────────────────────
const CSV_HEADERS = [
  "name",
  "genericName",
  "category",
  "manufacturer",
  "unit",
  "unitsPerPack",
  "costPrice",
  "sellingPrice",
  "currentStock",
  "reorderLevel",
  "mfgDate",
  "expiryDate",
  "batchNumber",
  "isActive",
] as const;

const SAMPLE_ROWS = [
  [
    "Paracetamol 500mg", "Paracetamol", "Analgesics", "Sun Pharma",
    "tablet", "10", "5.00", "10.00", "200", "50", "2025-10", "2027-06", "PCM-2026-01", "true",
  ],
  [
    "Amoxicillin 250mg", "Amoxicillin", "Antibiotics", "Cipla",
    "capsule", "10", "18.00", "30.00", "100", "30", "2025-08", "2026-12", "AMX-2026-02", "true",
  ],
  [
    "Omeprazole 20mg", "Omeprazole", "Antacids", "Dr. Reddy's",
    "capsule", "14", "12.00", "22.00", "80", "20", "2025-11", "2027-03", "OMP-2026-03", "true",
  ],
];

const VALID_UNITS: MedicineUnit[] = [
  "tablet", "capsule", "ml", "mg", "vial", "strip", "sachet", "syrup", "cream", "drops",
];

// ── Simple CSV parser (handles quoted fields) ─────────────────────────────────
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const cells: string[] = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && !inQuote) { inQuote = true; continue; }
      if (ch === '"' && inQuote && line[i + 1] === '"') { cur += '"'; i++; continue; }
      if (ch === '"' && inQuote) { inQuote = false; continue; }
      if (ch === "," && !inQuote) { cells.push(cur.trim()); cur = ""; continue; }
      cur += ch;
    }
    cells.push(cur.trim());
    rows.push(cells);
  }
  return rows;
}

// ── Build a safe Medicine row from a CSV row ─────────────────────────────────
type ParsedRow = {
  data: Omit<Medicine, "id" | "createdAt">;
  errors: string[];
};

function parseRow(headers: string[], cells: string[]): ParsedRow {
  const get = (col: string) => cells[headers.indexOf(col)]?.trim() ?? "";
  const errors: string[] = [];

  const name = get("name");
  const genericName = get("genericName");
  if (!name) errors.push("name is required");
  if (!genericName) errors.push("genericName is required");

  const category = get("category");
  if (category && !(MEDICINE_CATEGORIES as readonly string[]).includes(category)) {
    errors.push(`Invalid category "${category}"`);
  }

  const unit = get("unit") as MedicineUnit;
  if (unit && !VALID_UNITS.includes(unit)) {
    errors.push(`Invalid unit "${unit}"`);
  }

  const unitsPerPack = Number(get("unitsPerPack")) || 1;
  const costPrice    = parseFloat(get("costPrice"))    || 0;
  const sellingPrice = parseFloat(get("sellingPrice")) || 0;
  const currentStock = parseInt(get("currentStock"))   || 0;
  const reorderLevel = parseInt(get("reorderLevel"))   || 10;
  const isActiveStr  = get("isActive").toLowerCase();
  const isActive     = isActiveStr !== "false" && isActiveStr !== "0";

  const data: Omit<Medicine, "id" | "createdAt"> = {
    name,
    genericName,
    category: (MEDICINE_CATEGORIES as readonly string[]).includes(category)
      ? category
      : "Other",
    manufacturer:  get("manufacturer"),
    unit:          VALID_UNITS.includes(unit) ? unit : "tablet",
    unitsPerPack,
    costPrice,
    sellingPrice,
    currentStock,
    reorderLevel,
    isActive,
    ...(get("mfgDate")     && { mfgDate:     get("mfgDate") }),
    ...(get("expiryDate")  && { expiryDate:  get("expiryDate") }),
    ...(get("batchNumber") && { batchNumber: get("batchNumber") }),
  };

  return { data, errors };
}

// ── Sample CSV download ───────────────────────────────────────────────────────
function downloadSampleCSV() {
  const rows = [CSV_HEADERS.join(","), ...SAMPLE_ROWS.map((r) => r.join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "medicines_sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Types ────────────────────────────────────────────────────────────────────
type RowStatus = "pending" | "importing" | "done" | "error";

interface PreviewRow {
  idx:    number;
  parsed: ParsedRow;
  status: RowStatus;
  error?: string;
}

interface Props {
  inline?:    boolean;   // render as page section instead of modal overlay
  onClose?:   () => void;
  onComplete: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function BulkImportMedicines({ inline = false, onClose, onComplete }: Props) {
  const fileRef            = useRef<HTMLInputElement>(null);
  const [rows, setRows]    = useState<PreviewRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [step, setStep]    = useState<"upload" | "preview" | "done">("upload");

  // ── File picked ─────────────────────────────────────────────────────────
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) { toast.error("Please upload a .csv file"); return; }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length < 2) { toast.error("CSV must have a header row and at least one data row"); return; }

      const headers = parsed[0].map((h) => h.trim());
      const missing = (["name", "genericName"] as const).filter((h) => !headers.includes(h));
      if (missing.length) { toast.error(`CSV is missing required columns: ${missing.join(", ")}`); return; }

      const preview: PreviewRow[] = parsed.slice(1).map((cells, i) => ({
        idx:    i,
        parsed: parseRow(headers, cells),
        status: "pending",
      }));

      setRows(preview);
      setStep("preview");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── Import ──────────────────────────────────────────────────────────────
  const handleImport = async () => {
    const valid = rows.filter((r) => r.parsed.errors.length === 0);
    if (!valid.length) { toast.error("No valid rows to import"); return; }
    setImporting(true);

    const updated = [...rows];
    let ok = 0;
    let fail = 0;

    for (const row of valid) {
      updated[row.idx] = { ...updated[row.idx], status: "importing" };
      setRows([...updated]);
      try {
        await addMedicine(row.parsed.data);
        updated[row.idx] = { ...updated[row.idx], status: "done" };
        ok++;
      } catch (err: any) {
        updated[row.idx] = { ...updated[row.idx], status: "error", error: err.message || "Failed" };
        fail++;
      }
      setRows([...updated]);
    }

    setImporting(false);
    setStep("done");
    if (ok > 0) toast.success(`${ok} medicine${ok > 1 ? "s" : ""} imported successfully`);
    if (fail > 0) toast.error(`${fail} row${fail > 1 ? "s" : ""} failed — check error details`);
    onComplete();
  };

  const validCount   = rows.filter((r) => r.parsed.errors.length === 0).length;
  const invalidCount = rows.filter((r) => r.parsed.errors.length  >  0).length;

  const inner = (
    <div className={inline ? "bg-background border border-border rounded-2xl shadow-sm w-full flex flex-col" : "bg-background border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Bulk Import Medicines</h2>
            <p className="text-xs text-muted-foreground">Upload a CSV file to add multiple medicines at once</p>
          </div>
        </div>
        {!inline && onClose && (
          <button onClick={onClose} disabled={importing}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Sample download */}
          <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-muted/30 px-5 py-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Download Sample CSV</p>
                <p className="text-xs text-muted-foreground">
                  Contains all columns: {CSV_HEADERS.join(", ")}
                </p>
              </div>
            </div>
            <button onClick={downloadSampleCSV}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors shrink-0">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          {/* Upload zone */}
          {step === "upload" && (
            <div
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/10 py-14 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Click to upload your CSV file</p>
                <p className="text-xs text-muted-foreground mt-1">Only .csv files are accepted</p>
              </div>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
            </div>
          )}

          {/* Re-upload button after file loaded */}
          {(step === "preview" || step === "done") && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setStep("upload"); setRows([]); }}
                disabled={importing}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" /> Upload different file
              </button>
              {step === "preview" && (
                <div className="flex items-center gap-3 ml-auto text-sm">
                  {validCount   > 0 && <span className="text-green-600 font-medium">✓ {validCount} valid</span>}
                  {invalidCount > 0 && <span className="text-red-500 font-medium">✗ {invalidCount} with errors</span>}
                </div>
              )}
            </div>
          )}

          {/* Preview table */}
          {rows.length > 0 && (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-muted-foreground font-semibold uppercase tracking-wide">#</th>
                      <th className="px-3 py-2.5 text-left text-muted-foreground font-semibold uppercase tracking-wide">Name</th>
                      <th className="px-3 py-2.5 text-left text-muted-foreground font-semibold uppercase tracking-wide">Generic</th>
                      <th className="px-3 py-2.5 text-left text-muted-foreground font-semibold uppercase tracking-wide">Category</th>
                      <th className="px-3 py-2.5 text-left text-muted-foreground font-semibold uppercase tracking-wide">Unit</th>
                      <th className="px-3 py-2.5 text-right text-muted-foreground font-semibold uppercase tracking-wide">Cost</th>
                      <th className="px-3 py-2.5 text-right text-muted-foreground font-semibold uppercase tracking-wide">Price</th>
                      <th className="px-3 py-2.5 text-right text-muted-foreground font-semibold uppercase tracking-wide">Stock</th>
                      <th className="px-3 py-2.5 text-center text-muted-foreground font-semibold uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const d       = row.parsed.data;
                      const hasErr  = row.parsed.errors.length > 0;
                      const rowBg   =
                        row.status === "done"      ? "bg-green-50 dark:bg-green-950/20" :
                        row.status === "error"     ? "bg-red-50 dark:bg-red-950/20" :
                        row.status === "importing" ? "bg-blue-50 dark:bg-blue-950/20" :
                        hasErr                     ? "bg-amber-50 dark:bg-amber-950/20" : "";

                      return (
                        <tr key={row.idx} className={`border-b border-border/50 ${rowBg}`}>
                          <td className="px-3 py-2.5 text-muted-foreground">{row.idx + 1}</td>
                          <td className="px-3 py-2.5 font-medium text-foreground">{d.name || <span className="text-red-500">—</span>}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{d.genericName || <span className="text-red-500">—</span>}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{d.category}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{d.unit}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">₹{d.costPrice}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">₹{d.sellingPrice}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">{d.currentStock}</td>
                          <td className="px-3 py-2.5 text-center">
                            {row.status === "importing" && <Loader2 className="w-4 h-4 text-blue-500 animate-spin mx-auto" />}
                            {row.status === "done"      && <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />}
                            {row.status === "error"     && (
                              <span title={row.error} className="flex items-center justify-center gap-1 text-red-500">
                                <AlertCircle className="w-4 h-4" />
                              </span>
                            )}
                            {row.status === "pending" && (
                              hasErr
                                ? <span title={row.parsed.errors.join("; ")} className="flex items-center justify-center gap-1 text-amber-500 cursor-help">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px]">Error</span>
                                  </span>
                                : <span className="text-green-600 text-[10px] font-medium">Ready</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Error details */}
              {rows.some((r) => r.parsed.errors.length > 0) && (
                <div className="border-t border-border bg-amber-50 dark:bg-amber-950/20 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Rows with errors will be skipped during import:</p>
                  {rows
                    .filter((r) => r.parsed.errors.length > 0)
                    .map((r) => (
                      <p key={r.idx} className="text-xs text-amber-600 dark:text-amber-500">
                        Row {r.idx + 1}: {r.parsed.errors.join("; ")}
                      </p>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0 gap-3">
          <div className="text-xs text-muted-foreground">
            {step === "preview" && rows.length > 0 && (
              <>
                <strong className="text-foreground">{rows.length}</strong> row{rows.length > 1 ? "s" : ""} detected
                {invalidCount > 0 && <> · <span className="text-amber-600">{invalidCount} will be skipped</span></>}
              </>
            )}
            {step === "done" && (
              <span className="text-green-600 font-medium">Import complete!</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => inline ? onComplete() : onClose?.()}
              disabled={importing}
              className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-muted transition-colors disabled:opacity-50"
            >
              {step === "done" ? "Close" : "Cancel"}
            </button>
            {step === "preview" && validCount > 0 && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#152d4a] disabled:opacity-50 transition-colors"
              >
                {importing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Importing...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Import {validCount} Medicine{validCount > 1 ? "s" : ""}</>
                )}
              </button>
            )}
          </div>
        </div>
    </div>
  );

  if (inline) return inner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {inner}
    </div>
  );
}
