import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import getDocDefinition from "./docDefinition";

const printParams = {
  PDF_HEADER_COLOR: "#f8f8f8",
  PDF_INNER_BORDER_COLOR: "#dde2eb",
  PDF_OUTER_BORDER_COLOR: "#babfc7",
  PDF_LOGO: require("../../../../assets/images/logo.png"),
  PDF_PAGE_ORITENTATION: "landscape",
  PDF_WITH_HEADER_IMAGE: true,
  PDF_WITH_FOOTER_PAGE_COUNT: true,
  PDF_HEADER_HEIGHT: 25,
  PDF_ROW_HEIGHT: 15,
  PDF_ODD_BKG_COLOR: "#fcfcfc",
  PDF_EVEN_BKG_COLOR: "#fff",
  PDF_WITH_CELL_FORMATTING: true,
  PDF_WITH_COLUMNS_AS_LINKS: false,
  PDF_SELECTED_ROWS_ONLY: false,
};

pdfMake.vfs = pdfFonts.pdfMake.vfs;
function exportToPDF(gridApi, columnApi) {
  console.log("Exporting to PDF...");
  const docDefinition = getDocDefinition(printParams, gridApi, columnApi);
  pdfMake.createPdf(docDefinition).download("transaction.pdf");
}

export default exportToPDF;
