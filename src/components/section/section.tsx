import { useDraggable, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { ComponentType } from "../builder/utils";
import { StaticComponent } from "../static-component/static-component";

interface SectionContainerProps {
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
}

export const SectionContainer = styled(motion.div)<SectionContainerProps>`
  min-width: 400px;
  min-height: 200px;
  display: flex;
  flex-direction: ${(props) => props.flexDirection || "row"};
  justify-content: ${(props) => props.justifyContent || "flex-start"};
  align-items: ${(props) => props.alignItems || "stretch"};
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: border-color 0.2s, background-color 0.2s;
`;

// Props del componente Section
type SectionProps = {
  id: string;
  children?: React.ReactNode;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  components: { [key: string]: ComponentType[] };
};
const renderComponents = (
  componentList: ComponentType[],
  components: { [key: string]: ComponentType[] }
) => {
  return componentList.map((comp) => {
    if (comp.id.startsWith("section")) {
      // Si es un Section, crear un Section que renderice sus hijos
      return (
        <Section
          key={comp.id}
          id={comp.id}
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="stretch"
          components={components}
        >
          {/* Renderizar los hijos dentro del Section */}
          {comp.children && renderComponents(comp.children, components)}
        </Section>
      );
    } else {
      // Si no es un Section, usar StaticComponent
      return (
        <StaticComponent key={comp.id} component={comp.component}>
          {/* Renderizar los hijos dentro del StaticComponent */}
          {comp.children && renderComponents(comp.children, components)}
        </StaticComponent>
      );
    }
  });
};

// Componente Section
export const Section: React.FC<SectionProps> = ({
  id,
  flexDirection,
  justifyContent,
  alignItems,
  components, // Recibe el estado components
  children, // Acepta children
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({ id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <SectionContainer
      ref={(node) => {
        setNodeRef(node);
        setDragRef(node);
      }}
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      alignItems={alignItems}
      style={{
        ...style,
        borderColor: isOver ? "#3498db" : "#ccc",
        backgroundColor: isOver
          ? "rgba(52, 152, 219, 0.1)"
          : "rgba(255, 255, 255, 0.8)",
      }}
      {...listeners}
      {...attributes}
    >
      {/* Renderizar los children dentro del contenedor del Section */}
      {children}
      {/* Renderizar los componentes que se han soltado dentro de este Section */}
      {components[id] && renderComponents(components[id], components)}
    </SectionContainer>
  );
};

// Componente Section arrastrable
export const StaticSection: React.FC = () => {
  return (
    <motion.div
      style={{
        padding: "20px",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        cursor: "grab",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <h3>Sección</h3>
      <p>Arrastra y suelta componentes aquí.</p>
    </motion.div>
  );
};
