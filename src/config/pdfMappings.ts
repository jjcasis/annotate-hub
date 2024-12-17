export interface PDFMapping {
  label: string;
  hasToggle?: boolean;
  fileName: string | {
    POST: string;
    FRONT: string;
  };
}

export const levelMappings: Record<string, PDFMapping[]> = {
  "Módulo A": [
    { label: "Nivel -100", fileName: "nivel-100.pdf" },
    { label: "Nivel 000", fileName: { POST: "nivel-000-post.pdf", FRONT: "nivel-000-front.pdf" }, hasToggle: true },
    { label: "Nivel 100", fileName: { POST: "nivel-100-post.pdf", FRONT: "nivel-100-front.pdf" }, hasToggle: true },
    { label: "Nivel 200", fileName: { POST: "nivel-200-post.pdf", FRONT: "nivel-200-front.pdf" }, hasToggle: true },
    { label: "Nivel 300", fileName: "nivel-300.pdf" },
  ],
};