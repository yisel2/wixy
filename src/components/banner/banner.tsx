import { motion } from "framer-motion";
export const Banner = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    style={{
      backgroundColor: "#2196f3",
      color: "white",
      padding: "48px",
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "20px",
    }}
  >
    Banner llamativo
  </motion.div>
);
