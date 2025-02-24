import Builder from "./components/builder/builder";
import { GlobalStyle } from "./styles/global-styles";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Builder />
    </>
  );
};

export default App;

// Diseño basado en columnas y filas: Usar un sistema de grid para que los elementos se alineen automáticamente.
// 🏗️ Orden secuencial: Cuando el usuario arrastre un elemento, se colocará en el orden en que lo suelte, como si estuviera construyendo una página de arriba hacia abajo.
// ✨ Previsualización en tiempo real: Mientras el usuario arrastra, mostrar dónde se colocará el elemento con una animación o resaltado.
// 🧩 Redimensionado y reordenamiento: Más adelante, podríamos permitir que los usuarios reorganicen o cambien el tamaño de los elementos.
