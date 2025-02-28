import { motion } from "framer-motion";
import { ReactNode } from "react";
import styled from "styled-components";

export const Banner = styled(motion.div)`
  background-color: #e74c3c;
  color: white;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  cursor: grab;
`;

export const StaticBanner = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => (
  <div
    style={{
      backgroundColor: "#e74c3c",
      color: "white",
      padding: "20px",
      borderRadius: "8px",
      margin: "10px",
    }}
  >
    {children}
  </div>
);
