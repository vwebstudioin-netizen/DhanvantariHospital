"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DoctorRoot() {
  const router = useRouter();
  useEffect(() => { router.replace("/doctor/queue"); }, [router]);
  return null;
}
