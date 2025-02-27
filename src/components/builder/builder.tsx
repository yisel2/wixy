import React, { ReactNode, useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  rectIntersection,
} from "@dnd-kit/core";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Section, StaticSection } from "../section/section";
import { ComponentType } from "./utils";

// Definición de tipos

type ComponentId = string;

export const Header = ({ children }: { children: ReactNode }): ReactNode => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    style={{
      backgroundColor: "#4caf50",
      color: "white",
      padding: "20px",
      borderRadius: "8px",
      cursor: "grab",
      margin: "10px",
    }}
  >
    {children}
  </motion.div>
);

const Footer = styled(motion.div)`
  background-color: #2ecc71;
  color: white;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  cursor: grab;
`;

const Banner = styled(motion.div)`
  background-color: #e74c3c;
  color: white;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  cursor: grab;
`;

// Componente arrastrable (para la lista de componentes disponibles)
const DraggableComponent: React.FC<{
  id: ComponentId;
  component: ReactNode;
}> = ({ id, component }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        // scale: 1.1, // Escala aumentada al arrastrar
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Sombra al arrastrar
      }
    : undefined;
  // TODO: Arreglar los estilos
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.05 }} // Animación al pasar el mouse
      whileTap={{ scale: 0.95 }} // Animación al hacer clic
    >
      {component}
    </motion.div>
  );
};

// Componente principal
const Builder: React.FC = () => {
  const [components, setComponents] = useState<{
    [key: string]: ComponentType[];
  }>({
    "work-area-1": [], // Lista de componentes para el área de trabajo 1
    "work-area-2": [], // Lista de componentes para el área de trabajo 2
  });
  const [activeId, setActiveId] = useState<ComponentId | null>(null);
  // Componentes disponibles para arrastrar
  const availableComponents: ComponentType[] = [
    { id: "header", component: <Header>Header</Header> },
    { id: "footer", component: <Footer>Footer</Footer> },
    { id: "banner", component: <Banner>Banner</Banner> },
    {
      id: "section", // ID genérico para el Section
      component: <StaticSection />, // Usamos StaticSection para la visualización
    },
  ];

  // Manejar el inicio del arrastre
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as ComponentId);
  };

  // Manejar el final del arrastre
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const activeId = String(active?.id);
    const overId = String(over?.id);

    if (overId) {
      const component = availableComponents.find(
        (comp) => comp.id === activeId
      );

      if (component) {
        setComponents((prevComponents) => {
          const newComponents = { ...prevComponents };

          // Función recursiva para actualizar el estado components
          const updateComponents = (
            components: { [key: string]: ComponentType[] },
            targetId: string
          ) => {
            if (components[targetId]) {
              // Verificar si el componente ya existe en el área de trabajo
              const componentExists = components[targetId].some(
                (comp) => comp.id === activeId
              );

              if (!componentExists) {
                if (component.id === "section") {
                  // Si es un Section, agregar un Section normal
                  components[targetId] = [
                    ...(components[targetId] || []),
                    {
                      id: `section-${Date.now()}`, // ID único para el Section
                      component: (
                        <Section
                          id={`section-${Date.now()}`}
                          components={components} // Pasar el estado components
                        />
                      ),
                      children: [], // Inicializar como un array vacío
                    },
                  ];
                } else {
                  // Para otros componentes (Header, Footer, Banner)
                  components[targetId] = [
                    ...(components[targetId] || []),
                    { ...component, children: [] }, // Inicializar como un array vacío
                  ];
                }
              }
            } else {
              // Si el targetId no existe, buscar en los componentes anidados
              Object.keys(components).forEach((key) => {
                components[key].forEach((comp) => {
                  if (comp.children) {
                    // Verificar si el targetId coincide con el ID del Section
                    if (comp.id === targetId) {
                      // Si es un Section, agregar el componente al children
                      const componentExists = comp.children.some(
                        (child) => child.id === activeId
                      );

                      if (!componentExists) {
                        comp.children.push({
                          id: activeId,
                          component: component.component,
                          children: [],
                        });
                      }
                    } else {
                      // Llamar recursivamente a updateComponents con comp.children
                      updateComponents({ [comp.id]: comp.children }, targetId);
                    }
                  }
                });
              });
            }
          };

          updateComponents(newComponents, overId);
          console.log("Estado actualizado:", newComponents); // Depuración
          return newComponents;
        });
      } else {
        console.log("No se encontró el componente");
      }
    } else {
      console.log("No se soltó en ninguna sección");
    }

    setActiveId(null);
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Panel de componentes disponibles */}
        <div>
          <h2>Componentes Disponibles</h2>
          {availableComponents.map((comp) => (
            <DraggableComponent
              key={comp.id}
              id={comp.id}
              component={comp.component}
            />
          ))}
        </div>
        <div>
          <Section
            id="work-area-1"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="stretch"
            components={components}
          >
            <h2>Área de Trabajo 1</h2>
          </Section>
        </div>
      </div>

      {/* Overlay para el componente que se está arrastrando */}
      <DragOverlay>
        {activeId ? (
          <motion.div
            style={{
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Sombra más pronunciada
            }}
          >
            {
              availableComponents.find((comp) => comp.id === activeId)
                ?.component
            }
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Builder;
