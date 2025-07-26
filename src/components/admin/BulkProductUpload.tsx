import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

const CSV_COLUMNS = [
  "name",
  "description",
  "slug",
  "base_price",
  "material",
  "colors",
  "sizes",
  "badges",
  "type",
  "model",
  "priority",
  "seo_title",
  "seo_description",
  "seo_keywords"
];

const CSV_TEMPLATE =
  "name,description,slug,base_price,material,colors,sizes,badges,type,model,priority,seo_title,seo_description,seo_keywords\n" +
  "Cotton Bag,An eco-friendly cotton bag,cotton-bag,1.5,140g cotton,Royal sinine,Punane,eco|organic,cotton_bag,CB001,50,Cotton Bag,An eco-friendly cotton bag,cotton-bag,1.5,140g cotton,Royal sinine,Punane,eco|organic,cotton_bag,CB001\n";

function downloadCSVTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "product_upload_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function parseCSVValue(value: string) {
  if (!value) return [];
  // Accept both comma and pipe as separator for badges/colors/sizes
  return value.split(/[|,]/).map((v) => v.trim()).filter(Boolean);
}

const BulkProductUpload: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void; onUploadSuccess?: () => void }> = ({ open, onOpenChange, onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{ success: number; failed: number; errors: string[] }>({ success: 0, failed: 0, errors: [] });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParseErrors([]);
    setParsedRows([]);
    setUploadResults({ success: 0, failed: 0, errors: [] });
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: string[] = [];
        const rows = (results.data as any[]).map((row, idx) => {
          // Validate required fields
          for (const col of ["name", "slug", "base_price", "type"]) {
            if (!row[col]) errors.push(`Row ${idx + 2}: Missing required field '${col}'`);
          }
          return {
            name: row.name?.trim() || "",
            description: row.description?.trim() || "",
            slug: row.slug?.trim() || "",
            base_price: parseFloat(row.base_price),
            material: row.material?.trim() || "",
            colors: parseCSVValue(row.colors),
            sizes: parseCSVValue(row.sizes),
            badges: parseCSVValue(row.badges),
            type: row.type?.trim() || "",
            model: row.model?.trim() || "",
            priority: parseInt(row.priority) || 50,
            seo_title: row.seo_title?.trim() || "",
            seo_description: row.seo_description?.trim() || "",
            seo_keywords: row.seo_keywords?.trim() || "",
          };
        });
        setParsedRows(rows);
        setParseErrors(errors);
      },
      error: (err) => {
        setParseErrors([err.message]);
      },
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadResults({ success: 0, failed: 0, errors: [] });
    let success = 0;
    let failed = 0;
    let errors: string[] = [];
    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      if (parseErrors.length > 0) {
        failed++;
        errors.push(`Row ${i + 2}: Skipped due to validation errors.`);
        continue;
      }
      try {
        // Upsert by slug
        const { error } = await supabase.from("products").upsert(
          [{
            name: row.name,
            description: row.description,
            slug: row.slug,
            base_price: row.base_price,
            material: row.material,
            colors: row.colors,
            sizes: row.sizes,
            badges: row.badges,
            type: row.type,
            model: row.model,
            priority: row.priority,
            seo_title: row.seo_title,
            seo_description: row.seo_description,
            seo_keywords: row.seo_keywords,
            // Do not include is_eco
          }],
          { onConflict: "slug" }
        );
        if (error) {
          failed++;
          errors.push(`Row ${i + 2}: ${error.message}`);
        } else {
          success++;
        }
      } catch (err: any) {
        failed++;
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }
    setUploading(false);
    setUploadResults({ success, failed, errors });
    if (success > 0 && onUploadSuccess) onUploadSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Products</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add or update products in bulk. <br />
            <Button variant="link" type="button" onClick={downloadCSVTemplate} className="px-0">Download CSV Template</Button>
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mb-2"
            disabled={uploading}
          />
          {parseErrors.length > 0 && (
            <div className="text-red-600 text-sm mb-2">
              {parseErrors.map((err, i) => <div key={i}>{err}</div>)}
            </div>
          )}
          {parsedRows.length > 0 && (
            <div className="overflow-x-auto max-h-64 border rounded mb-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    {CSV_COLUMNS.map((col) => <TableHead key={col}>{col}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedRows.map((row, i) => (
                    <TableRow key={i}>
                      {CSV_COLUMNS.map((col) => <TableCell key={col}>{Array.isArray(row[col]) ? row[col].join(", ") : row[col]}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={uploading || parsedRows.length === 0 || parseErrors.length > 0}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
        {uploadResults.success + uploadResults.failed > 0 && (
          <div className="mt-4">
            <div className="text-green-700">Success: {uploadResults.success}</div>
            <div className="text-red-700">Failed: {uploadResults.failed}</div>
            {uploadResults.errors.length > 0 && (
              <div className="text-red-600 text-xs mt-2">
                {uploadResults.errors.map((err, i) => <div key={i}>{err}</div>)}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BulkProductUpload;

export function exportProductsToCSV(products: any[]) {
  const CSV_COLUMNS = [
    "name",
    "description",
    "slug",
    "base_price",
    "material",
    "colors",
    "sizes",
    "badges",
    "type",
    "model",
    "priority",
    "seo_title",
    "seo_description",
    "seo_keywords"
  ];
  const data = products.map((p) => ({
    name: p.name || "",
    description: p.description || "",
    slug: p.slug || "",
    base_price: p.base_price || "",
    material: p.material || "",
    colors: Array.isArray(p.colors) ? p.colors.join("|") : (p.colors || ""),
    sizes: Array.isArray(p.sizes) ? p.sizes.join("|") : (p.sizes || ""),
    badges: Array.isArray(p.badges) ? p.badges.join("|") : (p.badges || ""),
    type: p.type || "",
    model: p.model || "",
    priority: p.priority || 50,
    seo_title: p.seo_title || "",
    seo_description: p.seo_description || "",
    seo_keywords: p.seo_keywords || ""
  }));
  const csv = Papa.unparse({ fields: CSV_COLUMNS, data });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products_export.csv";
  a.click();
  URL.revokeObjectURL(url);
} 