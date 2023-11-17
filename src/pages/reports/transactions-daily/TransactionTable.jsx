import React, { useMemo, useState } from "react";
import { Box, Paper } from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import moment from "moment";
import { useConfig } from "../../../hooks";
import "ag-grid-enterprise";
const TransactionTable = ({
  dtTransaction,
  selectedProduct,
  selectedVendor,
  selectedPlateNo,
  selectedStatus,
  statusFilterMemoized,
  gridRef,
  setGridApi,
  setColumnApi,
  actionsRenderer,
}) => {
  const { WBMS, PROGRESS_STATUS } = useConfig();

  const statusFormatter = (params) => {
    return PROGRESS_STATUS[params.value];
    // if (WBMS.SITE_TYPE === 1) return PKS_PROGRESS_STATUS[params.value];
    // else if (WBMS.SITE_TYPE === 2) return T30_PROGRESS_STATUS[params.value];
    // else if (WBMS.SITE_TYPE === 3) return BULKING_PROGRESS_STATUS[params.value];
  };

  const dateFormatter = (params) => {
    if (params.data) {
      return moment(params.value).format("DD MMM YYYY").toUpperCase();
    }
    return "";
  };
  const dateGetter = (params) => {
    if (params.data) {
      return new Date(params.data.dtModified).toDateString();
    }
    return "";
  };
  const timeFormatter = (params) => {
    if (params.data) {
      return moment(params.value).format("HH:mm");
    }
    return "";
  };

  const NumberFormatter = (params) => {
    if (typeof params.value === "number") {
      const value = Math.ceil(params.value);
      return value ? value.toLocaleString("id-ID", { groupingSeparator: "." }) : 0;
    }
    return "";
  };
  const originNettoFormatter = (params) => {
    if (params?.data) {
      let netto = 0;

      netto = Math.abs(params.data.originWeighInKg - params.data.originWeighOutKg);

      return netto.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  const returnNettoFormatter = (params) => {
    if (params?.data) {
      let netto = 0;

      netto = Math.abs(params.data.returnWeighInKg - params.data.returnWeighOutKg);

      return netto.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  const [columnDefs] = useState([
    {
      headerName: "ACTIONS",
      field: "id",
      width: 100,
      cellRenderer: actionsRenderer,
      sortable: true,
      resizable: false,
      filter: false,
      // pinned: "left",
      lockPinned: true,
      pdfExportOptions: {
        skipColumn: true,
      },
    },
    // {
    //   headerName: "NO BONTRIP",
    //   field: "bonTripNo",
    //   hide: true,
    // },
    { headerName: "NOPOL", field: "transportVehiclePlateNo", maxWidth: 90 },
    {
      headerName: "Status",
      field: "progressStatus",
      valueFormatter: statusFormatter,
      rowGroup: true,
      hide: true,
      suppressCsvExport: true,
      skipFields: true,
    },
    {
      headerName: "Nama Vendor/Cust.",
      field: "transporterCompanyName",
      minWidth: 60,
      hide: true,
    },
    {
      headerName: "NO DO",
      field: "deliveryOrderNo",
      cellStyle: { textAlign: "center" },
      maxWidth: 140,
    },
    {
      headerName: "PRODUK",
      field: "productName",
      cellStyle: { textAlign: "center" },
      maxWidth: 110,
    },
    {
      headerName: "WB-IN",
      field: "originWeighInKg",
      maxWidth: 110,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "WB-OUT",
      field: "originWeighOutKg",
      maxWidth: 110,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "NETTO",
      field: "netto",
      maxWidth: 110,
      cellStyle: { textAlign: "center" },
      valueGetter: originNettoFormatter,

      aggFunc: "sum",
    },
    {
      headerName: "RETUR WB-IN",
      field: "returnWeighInKg",
      maxWidth: 120,
      cellStyle: { textAlign: "center" },
      valueParser: "Number(newValue)",
    },
    {
      headerName: "RETUR WB-OUT",
      field: "returnWeighOutKg",
      maxWidth: 130,
      cellStyle: { textAlign: "center" },
      valueParser: "Number(newValue)",
    },
    {
      headerName: "NETTO",
      field: "netto2",
      maxWidth: 120,
      cellStyle: { textAlign: "center" },
      valueGetter: returnNettoFormatter,

      aggFunc: "sum",
      columnKey: "Tanggal",
    },
    {
      headerName: "WAKTU",
      field: "dtModified",
      maxWidth: 90,
      cellStyle: { textAlign: "center" },
      valueFormatter: timeFormatter,
      columnKey: "Tanggal",
    },
    {
      headerName: "TANGGAL",
      field: "dtModified2",
      maxWidth: 110,
      cellStyle: { textAlign: "center" },
      valueGetter: dateGetter,
      valueFormatter: dateFormatter,
      columnKey: "Tanggal",
    },
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  const onFirstDataRendered = (params) => {
    params.columnApi.autoSizeAllColumns();
  };

  const onColumnEverythingChanged = (params) => {
    let selectionCol = params.columnApi.getColumn("selection-col");
    if (selectionCol) {
      params.columnApi.moveColumn(selectionCol, 0);
    }
  };

  const gridOptions = {
    groupIncludeHeader: false,
    groupIncludeFooter: true,
    groupIncludeTotalFooter: true,
    groupMaintainOrder: true,
    animateRows: true,
  };

  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: false,
    filter: true,
    rowGroup: false,
    enableRowGroup: true,
  };

  // never changes, so we can use useMemo
  const autoGroupColumnDef = useMemo(
    () => ({
      cellRendererParams: {
        suppressCount: false,
        checkbox: false,
        footerValueGetter: (params) => {
          const isRootLevel = params.node.level === -1;
          if (isRootLevel) {
            return "Grand Total";
          }
          return `Sub Total (${params.value})`;
        },
      },
      field: "bonTripNo",
      headerName: "STATUS",
      minWidth: "250",
      flex: 1,
    }),
    [],
  );

  const filtered = useMemo(() => {
    let filteredData = dtTransaction?.data?.transaction?.records || [];

    filteredData = filteredData.filter((transaction) => {
      const productName = transaction.productName.toLowerCase().includes(selectedProduct.toLowerCase());
      const vendor = transaction.transporterCompanyName.toLowerCase().includes(selectedVendor.toLowerCase());
      const plateNo = transaction.transportVehiclePlateNo.toLowerCase().includes(selectedPlateNo.toLowerCase());
      const status = selectedStatus
        ? statusFilterMemoized(selectedStatus).includes(String(transaction.progressStatus).toLowerCase())
        : true;
      return productName && vendor && plateNo && status;
    });
    return filteredData;
  }, [dtTransaction, selectedProduct, selectedVendor, selectedPlateNo, selectedStatus, statusFilterMemoized]);

  return (
    <Paper sx={{ mt: 1, p: 2, minHeight: "77vh" }}>
      <Box
        className="ag-theme-balham"
        sx={{
          "& .ag-header-cell-label": { justifyContent: "center" },
          width: "auto",
          height: "75.5vh",
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={filtered} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          enableRangeSelection="true"
          groupSelectsChildren="true"
          gridOptions={gridOptions}
          suppressRowClickSelection="true"
          autoGroupColumnDef={autoGroupColumnDef}
          pagination="true"
          paginationAutoPageSize="true"
          groupDefaultExpanded="1"
          onColumnEverythingChanged={onColumnEverythingChanged}
          onFirstDataRendered={onFirstDataRendered}
          onGridReady={onGridReady}
        />
      </Box>
    </Paper>
  );
};
export default TransactionTable;
