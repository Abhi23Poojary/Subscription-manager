<<<<<<< HEAD
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/home");
=======
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, []);

  return null;
>>>>>>> 36a897d4c084dd9b8fa6f8b63d371a9133886098
}