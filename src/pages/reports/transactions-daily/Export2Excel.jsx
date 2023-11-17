import React from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx-js-style";
import { useConfig } from "../../../hooks";

const Export2Excel = ({ gridRef, columnApi }) => {
  const { WBMS, PROGRESS_STATUS } = useConfig();

  const statusFormatter = (params) => {
    return PROGRESS_STATUS[params.value];
    // if (WBMS.SITE_TYPE === 1) return PKS_PROGRESS_STATUS[params.value];
    // else if (WBMS.SITE_TYPE === 2) return T30_PROGRESS_STATUS[params.value];
    // else if (WBMS.SITE_TYPE === 3) return BULKING_PROGRESS_STATUS[params.value];
  };
  const exportToExcel = async (gridApi) => {
    // Menyiapkan data untuk diekspor
    const allColumns = columnApi.getAllColumns();
    const filteredColumns = allColumns
      .filter((column) => !["id", "progressStatus"].includes(column.colId))
      .map((column) => column.getColId());
    filteredColumns.unshift("ag-Grid-AutoColumn");
    const exportData = gridApi.current.api.getDataAsCsv({
      columnKeys: filteredColumns,
      processCellCallback: (params) => {
        if (params.node.footer || params.node.data) {
          const colDef = params.column.getColDef();
          if (colDef.valueGetter || colDef.valueFormatter) {
            const valueGetterParams = {
              ...params,
              data: params.node.data,
              node: params.node,
              colDef: colDef,
            };

            return colDef.valueFormatter
              ? colDef.valueFormatter(valueGetterParams)
              : colDef.valueGetter(valueGetterParams);
          }
          return params.value;
        }
        params.node.aggData = "";
        return params.value;
      },
      processHeaderCallback(params) {
        return `${params.columnApi.getDisplayNameForColumn(params.column, null)}`;
      },
      processRowGroupCallback(params) {
        const { node } = params;
        if (!node.footer) {
          const formattedKey = statusFormatter(node.key); // Apply a statusFormatter to node.key
          return `row group: ${formattedKey}`;
        }
        const isRootLevel = node.level === -1;
        if (isRootLevel) {
          return "Grand Total";
        }
        return `Sub Total (${node.key})`;
      },
    });

    // Membuat workbook
    const wb = XLSX.read(exportData, {
      type: "binary",
      cellStyles: true,
      sheetStubs: true,
    });
    const ws = wb.Sheets["Sheet1"];

    const range = XLSX.utils.decode_range(ws["!ref"]);
    const rowLength = range.e.r - range.s.r + 1;

    ws["!cols"] = [
      { wch: 18 },
      { wch: 12 },
      { wch: 18 },
      { wch: 20 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 10 },
    ];
    const borderStyle = {
      top: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
    };
    const colName = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

    for (const itm of colName) {
      ws[itm + 1].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { patternType: "solid", fgColor: { rgb: "FFFF0000" } },
        border: borderStyle,
        alignment: {
          wrapText: true,
        },
      };
      ws[itm + 1].hpx = 20;
    }
    let mergedRows = [];
    for (let j = "A".charCodeAt(0); j <= "M".charCodeAt(0); j++) {
      for (let i = 2; i <= rowLength; i++) {
        const a = `${String.fromCharCode(j)}${i}`;
        if (j === "A".charCodeAt(0) && ws["A" + i].v.includes("row group")) mergedRows.push(i - 1);
        if (ws[a] === undefined) ws[a] = { t: "s", v: " " };

        // if (j >= "F".charCodeAt(0) && j <= "K".charCodeAt(0) && ws[a]?.v !== 0)
        //   ws[a].z = "#.###,##";
        if (i === rowLength) {
          ws[a].s = {
            border: borderStyle,
          };
        } else {
          ws[a].s = {
            border: {
              right: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
            },
          };
        }
      }
    }

    ws["!merges"] = mergedRows.map((row) => ({
      s: { r: row, c: 0 },
      e: { r: row, c: 12 },
    }));

    ws[`A${rowLength}`].v = "SUBTOTAL";
    // Mengekspor workbook ke file Excel
    ws["!ref"] = `A1:N${rowLength + 2}`;
    await XLSX.writeFile(wb, "data.xlsx");
  };
  return (
    <Button variant="contained" onClick={() => exportToExcel(gridRef)}>
      Export Excel
    </Button>
  );
};

export default Export2Excel;
