import { ReactNode } from "react";

// Componente estático (para el área de trabajo)
export const StaticComponent: React.FC<{
  component: ReactNode;
  children?: ReactNode;
}> = ({ component, children }) => {
  return (
    <div>
      {component}
      {/* Renderizar los hijos dentro del contenedor del StaticComponent */}
      {children}
    </div>
  );
};
