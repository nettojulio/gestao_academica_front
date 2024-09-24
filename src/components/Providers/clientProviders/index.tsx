"use client";

import ProviderQuery from "@/components/Providers/ProviderQuery";
import ProviderRedux from "@/components/Providers/provideRedux";
import { checkIsPublicRoute } from "@/functions/checkIsPublicRoute";
import { usePathname } from "next/navigation";
import PrivateRoute from "../privateRoute";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const isPublicPage = checkIsPublicRoute(pathName);
  return (
    <ProviderQuery>
      <ProviderRedux>
        {isPublicPage && children}
        {/**<!isPublicPage && (
          <PrivateRoute>
          {children}
          </PrivateRoute>
          </ProviderQuery>)*/}
      </ProviderRedux>
    </ProviderQuery>
  );
}
