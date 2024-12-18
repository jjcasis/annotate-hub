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
    { label: "Nivel -100", fileName: "MODULO A/NIVEL -100/A-niv-100-sotano.pdf" },
    { label: "Nivel 000", fileName: { POST: "MODULO A/NIVEL 000/A-niv000-post.pdf", FRONT: "MODULO A/NIVEL 000/A-niv000-front.pdf" }, hasToggle: true },
    { label: "Nivel 100", fileName: { POST: "MODULO A/NIVEL +100/A-niv100.pdf", FRONT: "MODULO A/NIVEL +100/A-niv100.pdf" }, hasToggle: true },
    { label: "Nivel 200", fileName: { POST: "MODULO A/NIVEL +200/A-niv200.pdf", FRONT: "MODULO A/NIVEL +200/A-niv200.pdf" }, hasToggle: true },
    { label: "Nivel 300", fileName: "MODULO A/NIVEL +300/A-niv300.pdf" },
  ],
  "Módulo B": [
    { label: "Nivel 000", fileName: { POST: "MODULO B/NIVEL 000/B-niv000-post.pdf", FRONT: "MODULO B/NIVEL 000/B-niv000-front.pdf" }, hasToggle: true },
    { label: "Nivel 100", fileName: { POST: "MODULO B/NIVEL +100/B-niv100-post.pdf", FRONT: "MODULO B/NIVEL +100/B-niv100-front.pdf" }, hasToggle: true },
    { label: "Nivel 200", fileName: { POST: "MODULO B/NIVEL +200/B-niv200-post.pdf", FRONT: "MODULO B/NIVEL +200/B-niv200-front.pdf" }, hasToggle: true },
    { label: "Nivel 300", fileName: { POST: "MODULO B/NIVEL +300/B-niv300-front.pdf", FRONT: "MODULO B/NIVEL +300/B-niv300-front.pdf" }, hasToggle: true },
  ],
  "Módulo C": [
    { label: "Nivel -100", fileName: "MODULO C/NIVEL -100/C-niv-100-sotano.pdf" },
    { label: "Nivel 000", fileName: { POST: "MODULO C/NIVEL 000/C-niv000-post.pdf", FRONT: "MODULO C/NIVEL 000/C-niv000-front.pdf" }, hasToggle: true },
    { label: "Nivel 100", fileName: "MODULO C/NIVEL +100/C-niv100.pdf" },
    { label: "Nivel 200", fileName: "MODULO C/NIVEL +200/C-niv200.pdf" },
    { label: "Nivel 300", fileName: "MODULO C/NIVEL +300/C-niv300.pdf" },
  ],
};