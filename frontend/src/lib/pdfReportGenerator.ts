import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type FilterTag = { label: string; value: string };

export type PDFColumn = {
  header: string;
  dataKey: string;
  width?: number;
};

export type PDFReportConfig = {
  title: string;
  orientation?: "portrait" | "landscape";
  logoUrl?: string;
  filterTags?: FilterTag[];
  columns: PDFColumn[];
  data: any[];
  fileName: string;
  showMetadata?: boolean;
};

// Draw filters in a SINGLE horizontal row
const drawFilterRow = (
  doc: jsPDF,
  filters: FilterTag[],
  startX: number,
  startY: number
) => {
  let x = startX;
  const paddingX = 3;
  const gap = 4;

  doc.setFontSize(9);

  filters.forEach(f => {
    const text = `${f.label}: ${f.value}`;
    const textWidth = doc.getTextWidth(text);
    const boxWidth = textWidth + paddingX * 2;

    // Draw pill-shaped tag
    doc.setFillColor(245, 245, 250);
    doc.setDrawColor(200);
    doc.roundedRect(x, startY - 5, boxWidth, 7, 2, 2, "FD");

    doc.setTextColor(60);
    doc.text(text, x + paddingX, startY);

    x += boxWidth + gap;
  });

  return startY + 10; // Return next Y position
};

const getBase64ImageFromURL = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });

export class PDFReportGenerator {
  private doc: jsPDF;
  private config: PDFReportConfig;

  constructor(config: PDFReportConfig) {
    this.config = config;
    this.doc = new jsPDF({
      orientation: config.orientation || "landscape",
    });
  }

  private async addHeader() {
    const { logoUrl, title, showMetadata = true } = this.config;

    // Logo
    if (logoUrl) {
      try {
        const logoData = await getBase64ImageFromURL(logoUrl);
        this.doc.addImage(logoData, "PNG", 14, 10, 20, 20);
      } catch (error) {
        console.warn("Logo failed to load:", error);
      }
    }

    // Title
    this.doc.setFontSize(20);
    this.doc.setTextColor(99, 48, 184);
    this.doc.text(title, 40, 20);

    // Metadata
    if (showMetadata) {
      this.doc.setFontSize(10);
      this.doc.setTextColor(100);
      this.doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 26);
    }

    // Separator line
    this.doc.line(14, 32, this.doc.internal.pageSize.width - 14, 32);

    return 38; // Return Y position after header
  }

  private addFilters(startY: number): number {
    if (!this.config.filterTags || this.config.filterTags.length === 0) {
      return startY;
    }

    return drawFilterRow(this.doc, this.config.filterTags, 14, startY);
  }

  private addTable(startY: number) {
    const { columns, data } = this.config;

    const headers = columns.map(col => col.header);
    const body = data.map(row =>
      columns.map(col => row[col.dataKey] ?? "")
    );

    autoTable(this.doc, {
      head: [headers],
      body,
      startY,
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
      columnStyles: columns.reduce((acc, col, idx) => {
        if (col.width) acc[idx] = { cellWidth: col.width };
        return acc;
      }, {} as any),
    });
  }

  async generate(action: "save" | "print" | "blob") {
    let currentY = await this.addHeader();
    currentY = this.addFilters(currentY);
    this.addTable(currentY);

    switch (action) {
      case "save":
        this.doc.save(this.config.fileName);
        break;
      case "print":
        this.doc.autoPrint();
        window.open(this.doc.output("bloburl"), "_blank");
        break;
      case "blob":
        return this.doc.output("blob");
    }
  }
}