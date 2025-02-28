import { motion } from "framer-motion";
import { ReactNode } from "react";
import styled from "styled-components";

export const Footer = styled(motion.div)`
  background-color: #2ecc71;
  color: white;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  cursor: grab;
`;

// Versión estática del Footer
export const StaticFooter = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => (
  <div
    style={{
      backgroundColor: "#2ecc71",
      color: "white",
      padding: "20px",
      borderRadius: "8px",
      margin: "10px",
    }}
  >
    {children}
  </div>
);
