import React, { JSX, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
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

const WorkArea = styled(motion.div)<{ isDraggingOver: boolean }>`
  flex: 1;
  padding: 20px;
  border: 2px dashed ${(props) => (props.isDraggingOver ? "#3498db" : "#ccc")};
  border-radius: 8px;
  background-color: ${(props) =>
    props.isDraggingOver ? "rgba(52, 152, 219, 0.1)" : "transparent"};
  transition: border-color 0.2s, background-color 0.2s;
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
      // id={id}
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

// Componente Sortable (para elementos en el área de trabajo)
const StaticComponent: React.FC<{ component: JSX.Element }> = ({
  component,
}) => {
  return <div>{component}</div>;
};

// Componente principal
const Builder: React.FC = () => {
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [activeId, setActiveId] = useState<ComponentId | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  // Configurar el área de trabajo como un droppable
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: "work-area",
  });
  console.log({ isOver });
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

    console.log("Evento onDragEnd:", { active, over }); // Depuración
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
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // onDragOver={handleDragOver}
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

        {/* Área de trabajo */}
        <WorkArea
          id="work-area"
          isDraggingOver={isOver} // Usar isOver para manejar el estado
          ref={setDroppableRef} // Asignar la referencia del droppable
        >
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
