import React, { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { StaticHeader } from "../header/header";
import { StaticFooter } from "../footer/footer";
import { StaticBanner } from "../banner/banner";

export type ComponentType = {
  id: string;
  component: ReactNode;
  children?: ComponentType[]; // Componentes anidados
};

interface ReactNodeProps {
  children: ReactNode;
}

const componentToHTML = (component: ReactNode, id: string): string => {
  if (!React.isValidElement<ReactNodeProps>(component)) {
    return String(component);
  }
  switch (id) {
    case "header":
      return renderToString(
        <StaticHeader>{component?.props.children}</StaticHeader>
      );
    case "footer":
      return renderToString(
        <StaticFooter>{component?.props.children}</StaticFooter>
      );
    case "banner":
      return renderToString(
        <StaticBanner>{component?.props.children}</StaticBanner>
      );
    default:
      // Para otros componentes, convertir normalmente
      return renderToString(component);
  }
};

export const generateHTML = (components: {
  [key: string]: ComponentType[];
}): string => {
  let html = "";

  const renderComponent = (component: ComponentType): string => {
    const content = componentToHTML(component.component, component.id); // Convertir el componente a HTML

    if (component.id.startsWith("section")) {
      // Si es un Section, generar un div con sus hijos
      return `
        <div id="${
          component.id
        }" style="display: flex; flex-direction: column; padding: 20px; border: 1px dashed #ccc;">
          ${
            component.children
              ?.map((child) => renderComponent(child))
              .join("") || ""
          }
        </div>
      `;
      // TODO: se puede simplemente generar el html con el componente ya creado, no es necesario crear una etiqueta
    } else if (component.id === "header") {
      // Si es un Header, generar un header sin estilos adicionales
      return `<header>${content}</header>`;
    } else if (component.id === "footer") {
      // Si es un Footer, generar un footer sin estilos adicionales
      return `<footer>${content}</footer>`;
    } else if (component.id === "banner") {
      // Si es un Banner, generar un div sin estilos adicionales
      return `<div>${content}</div>`;
    } else {
      // Para otros componentes, generar un div genérico
      return `<div>${content}</div>`;
    }
  };

  // Recorrer todas las áreas de trabajo y generar el HTML
  Object.keys(components).forEach((key) => {
    html += components[key].map((comp) => renderComponent(comp)).join("");
  });
  console.log(html);
  return html;
};

export const generateCSS = (): string => {
  return `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #4caf50;
      color: white;
      padding: 20px;
      border-radius: 8px;
    }
    footer {
      background-color: #2ecc71;
      color: white;
      padding: 20px;
      border-radius: 8px;
    }
    .banner {
      background-color: #e74c3c;
      color: white;
      padding: 20px;
      border-radius: 8px;
    }
  `;
};

export const generateJS = (): string => {
  return `
    // Aquí puedes agregar la lógica JavaScript necesaria
    console.log("Página cargada");
  `;
};

export const downloadFile = (
  filename: string,
  content: string,
  type: string
) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportPage = (components: { [key: string]: ComponentType[] }) => {
  const html = generateHTML(components);
  // const css = generateCSS();
  // const js = generateJS();

  // Descargar archivos
  downloadFile("index.html", html, "text/html");
  // downloadFile("styles.css", css, "text/css");
  // downloadFile("script.js", js, "text/javascript");
};
