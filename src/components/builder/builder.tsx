import React, { JSX, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
  rectIntersection,
} from "@dnd-kit/core";
import styled from "styled-components";
import { motion } from "framer-motion";

// Definición de tipos
type ComponentType = {
  id: string;
  component: JSX.Element;
};

type ComponentId = string;

// Componentes arrastrables
const Header = styled(motion.div)`
  background-color: #3498db;
  color: white;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  cursor: grab;
`;

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

// Área de trabajo (Canvas)
const Canvas = styled(motion.div)<{ isDraggingOver: boolean }>`
  width: 1200px; // Ancho fijo para simular una página web
  min-height: 800px; // Altura mínima para simular una página web
  padding: 20px;
  border: 2px dashed ${(props) => (props.isDraggingOver ? "#3498db" : "#ccc")};
  border-radius: 8px;
  background-color: ${(props) =>
    props.isDraggingOver ? "rgba(52, 152, 219, 0.1)" : "transparent"};
  transition: border-color 0.2s, background-color 0.2s;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); // Sombra para simular una página web
  position: relative; // Asegurar que el área de trabajo esté delimitada
`;

// Componente arrastrable (para la lista de componentes disponibles)
const DraggableComponent: React.FC<{
  id: ComponentId;
  component: JSX.Element;
}> = ({ id, component }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        scale: 1.1, // Escala aumentada al arrastrar
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Sombra al arrastrar
      }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.05 }} // Animación al pasar el mouse
      whileTap={{ scale: 0.95 }} // Animación al hacer clic
      onClick={(e) => e.preventDefault()} // Evitar que el clic agregue el componente
    >
      {component}
    </motion.div>
  );
};

const WorkArea = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: id });
  return (
    <Canvas
      ref={setNodeRef}
      isDraggingOver={isOver}
      style={{ position: "relative" }} // Asegurar que el área de trabajo esté delimitada
    >
      {children}
    </Canvas>
  );
};

// Componente estático (para el área de trabajo)
const StaticComponent: React.FC<{ component: JSX.Element }> = ({
  component,
}) => {
  return <div>{component}</div>;
};

// Componente principal
const Builder: React.FC = () => {
  // const [components, setComponents] = useState<ComponentType[]>([]);
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
  ];

  // Manejar el inicio del arrastre
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as ComponentId);
  };

  // Manejar el final del arrastre
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log({ over });
    // Verificar si el componente se soltó sobre el área de trabajo
    if (over?.id === "work-area") {
      const component = availableComponents.find(
        (comp) => comp.id === active.id
      );
      if (component) {
        setComponents([...components, component]);
      }
    }

    setActiveId(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
        <WorkArea id="work-area">
          <h2>Área de Trabajo</h2>
          {components.map((comp) => (
            <StaticComponent key={comp.id} component={comp.component} />
          ))}
        </WorkArea>
      </div>

      {/* Overlay para el componente que se está arrastrando */}
      <DragOverlay>
        {activeId ? (
          <motion.div
            style={{
              scale: 1.1, // Escala aumentada
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
