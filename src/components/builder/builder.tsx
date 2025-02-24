import { useState } from "react";
import styled from "styled-components";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { motion } from "framer-motion";

const BuilderContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  padding: 16px;
`;

const Canvas = styled.div`
  flex: 1;
  background-color: #fafafa;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
`;

const DraggableItem = ({ id, label }: { id: string; label: string }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: "8px",
        marginBottom: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "grab",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      {label}
    </motion.div>
  );
};

const DroppableArea = ({ children }: { children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  return (
    <Canvas
      ref={setNodeRef}
      style={{
        border: isOver ? "2px dashed #4caf50" : "2px dashed transparent",
        transition: "border 0.3s ease",
      }}
    >
      {children}
    </Canvas>
  );
};

const DraggingItem = ({ label }: { label: string }) => (
  <motion.div
    initial={{ scale: 1, opacity: 0.5 }}
    animate={{ scale: 1.1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    transition={{ duration: 0.2 }}
    style={{
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#e0f7fa",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    }}
  >
    {label}
  </motion.div>
);

const Builder = () => {
  const [elements, setElements] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id === "canvas") {
      setElements((prev) => [...prev, active.id]);
    }
    setActiveItem(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <BuilderContainer>
        <Sidebar>
          <DraggableItem id="text" label="Texto" />
          <DraggableItem id="image" label="Imagen" />
        </Sidebar>
        <DroppableArea>
          {elements.map((el, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: "12px",
                marginBottom: "12px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {el === "text" ? "Texto de ejemplo" : "[Imagen]"}
            </motion.div>
          ))}
        </DroppableArea>
        <DragOverlay>
          {activeItem ? (
            <DraggingItem label={activeItem === "text" ? "Texto" : "Imagen"} />
          ) : null}
        </DragOverlay>
      </BuilderContainer>
    </DndContext>
  );
};

export default Builder;
