import { ReactNode } from "react";

export type ComponentType = {
  id: string;
  component: ReactNode;
  children?: ComponentType[]; // Componentes anidados
};
