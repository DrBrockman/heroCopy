import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import {ToastProvider} from "@heroui/toast";
import { useHref, useNavigate } from "react-router-dom";
import { PatientProvider } from "./PatientContext";
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <PatientProvider>
      <ToastProvider maxVisibleToasts={1}
      />
      {children}
      </PatientProvider>
    </HeroUIProvider>
  );
}
