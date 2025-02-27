import { motion } from "framer-motion";
export const Header = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    style={{
      backgroundColor: "#4caf50",
      color: "white",
      padding: "24px",
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "24px",
    }}
  >
    Header de ejemplo
  </motion.div>
);

// Componentes arrastrables
const Header = styled(motion.div)`
  background-color: #3498db;
  color: white;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  cursor: grab;
`;
