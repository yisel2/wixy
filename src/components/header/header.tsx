import { motion } from "framer-motion";
import { ReactNode } from "react";
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

// Versión estática del Header
export const StaticHeader = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => (
  <div
    style={{
      backgroundColor: "#4caf50",
      color: "white",
      padding: "20px",
      borderRadius: "8px",
      margin: "10px",
    }}
  >
    {children}
  </div>
);
