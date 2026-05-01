"use client";

import { useRouter } from "next/navigation";
import BulkImportMedicines from "@/components/admin/BulkImportMedicines";

export default function BulkImportPage() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bulk Import Medicines</h1>
        <p className="text-muted-foreground text-sm">
          Upload a CSV file to add multiple medicines at once
        </p>
      </div>

      <BulkImportMedicines
        inline
        onComplete={() => router.push("/pharmacy/medicines")}
      />
    </div>
  );
}
