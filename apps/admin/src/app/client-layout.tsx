// components/client-layout.tsx
"use client";
import { Header } from "@components/header";
import { ThemedLayoutV2 } from "@refinedev/mui";
import { usePathname } from "next/navigation";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const publicRoutes = ["/login", "/register", "/forgot-password"];

  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <ThemedLayoutV2 Header={Header}>
      {children}
    </ThemedLayoutV2>
  );
};