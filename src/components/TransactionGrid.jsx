import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-balham.min.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import { toast } from "react-toastify";
import * as moment from "moment";

import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";

import { TransactionAPI } from "../apis";

import { useConfig, useTransaction } from "../hooks";
import QRCodeViewer from "./QRCodeViewer";

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const TransactionGrid = (props) => {
  const navigate = useNavigate();

  const { WBMS, PROGRESS_STATUS } = useConfig();
  const { wbTransaction, setOpenedTransaction, useFindManyTransactionQuery } = useTransaction();

  const transactionAPI = TransactionAPI();

  const [isLoading, setIsLoading] = useState(false);

  // const [searchMany, results] = useSearchManyMutation();
  // Number.isNaN(+message.data) ? 0 : +message.data;
  // var now = new Date();
  // var WH = Number.isNaN(+WBMS.SITE_WORKING_HOUR) ? 0 : +WBMS.SITE_WORKING_HOUR;
  // var WM = Number.isNaN(+WBMS.SITE_WORKING_MINUTE) ? 0 : +WBMS.SITE_WORKING_MINUTE;

  // console.log("now:", now);
  // console.log("WH:", WH);
  // console.log("moment:", moment().format());
  // console.log("moment substract:", moment().subtract(1, "hours").format());
  // if (now.getHours() < WH) {
  //   console.log("less then");
  // } else if (now.getHours() === WH) {
  // } else {
  // }

  const transactionFilter = {
    where: {
      typeSite: WBMS.SITE_TYPE,
      OR: [{ dtModified: { gte: moment().subtract(3, "hours").format() } }, { progressStatus: { in: [1, 6, 11] } }],
    },
    orderBy: [{ progressStatus: "asc" }, { bonTripNo: "desc" }],
  };

  const { data: results, refetch } = useFindManyTransactionQuery(transactionFilter);

  const handleViewClick = async (id) => {
    try {
      setIsLoading(true);

      const response = await transactionAPI.getById(id);

      setOpenedTransaction(response.data.transaction);
      setIsLoading(false);

      return navigate(response.data.urlPath);
    } catch (error) {
      setIsLoading(false);
      return toast.error(`${error?.message}..!!`);
    }
  };

  const handleCellClick = async (id) => {
    try {
      setIsLoading(true);

      const response = await transactionAPI.getById(id);

      setOpenedTransaction(response.data.transaction);
      setIsLoading(false);

      navigate("/wb/pks/manualentry-Out");
    } catch (error) {
      setIsLoading(false);
      return toast.error(`${error?.message}..!!`);
    }
  };

  const actionsRenderer = (params) => {
    return (
      <>
        {params.data && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <QRCodeViewer
              progressStatus={params.data.progressStatus}
              deliveryOrderId={params.data.deliveryOrderId}
              type="grid"
            />
            <IconButton size="small" onClick={() => handleViewClick(params.data.id)}>
              <PlagiarismOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}
      </>
    );
  };

  const statusFormatter = (params) => {
    return PROGRESS_STATUS[params.value];
  };

  const dateFormatter = (params) => {
    if (params.data) return moment(params.value).format("DD MMM YYYY").toUpperCase();
  };

  const timeFormatter = (params) => {
    if (params.data) return moment(params.value).format("HH:mm:ss");
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
      sortable: false,
      resizable: false,
      filter: false,
      pinned: "left",
      lockPinned: true,
    },
    { headerName: "NO BONTRIP", field: "bonTripNo", hide: true },
    {
      headerName: "NOPOL",
      field: "transportVehiclePlateNo",
      maxWidth: 100,
      cellStyle: { textAlign: "center", cursor: "pointer" },
      onCellClicked: (params) => handleCellClick(params.data.id),
    },
    {
      headerName: "STATUS",
      field: "progressStatus",
      valueFormatter: statusFormatter,
      enableRowGroup: true,
      rowGroup: true,
      hide: true,
    },
    {
      headerName: "NO DO",
      field: "deliveryOrderNo",
      maxWidth: 100,
      onCellClicked: (params) => handleCellClick(params.data.id),
      cellStyle: { textAlign: "center", cursor: "pointer" },
    },
    {
      headerName: "PRODUK",
      field: "productName",
      maxWidth: 110,
      onCellClicked: (params) => handleCellClick(params.data.id),
      cellStyle: { textAlign: "center", cursor: "pointer" },
    },
    {
      headerName: "WB-IN",
      field: "originWeighInKg",
      maxWidth: 110,
      cellStyle: { textAlign: "center" },
    },
    { headerName: "WB-OUT", field: "originWeighOutKg", maxWidth: 110, cellStyle: { textAlign: "center" } },
    {
      headerName: "NETTO",
      field: "id",
      maxWidth: 110,
      cellStyle: { textAlign: "center" },
      valueFormatter: originNettoFormatter,
    },
    { headerName: "RETUR WB-IN", field: "returnWeighInKg", maxWidth: 150, cellStyle: { textAlign: "center" } },
    { headerName: "RETUR WB-OUT", field: "returnWeighOutKg", maxWidth: 150, cellStyle: { textAlign: "center" } },
    {
      headerName: "NETTO RETUR",
      field: "id",
      maxWidth: 110,
      cellStyle: { textAlign: "center" },
      valueFormatter: returnNettoFormatter,
    },
    {
      headerName: "WAKTU",
      field: "dtModified",
      maxWidth: 110,
      cellStyle: { textAlign: "center" },
      valueFormatter: timeFormatter,
    },
    {
      headerName: "TANGGAL",
      field: "dtModified",
      maxWidth: 120,
      cellStyle: { textAlign: "center" },
      valueFormatter: dateFormatter,
    },
  ]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: false,
    filter: true,
    enableRowGroup: false,
    rowGroup: false,
  };

  // never changes, so we can use useMemo
  const autoGroupColumnDef = useMemo(
    () => ({
      cellRendererParams: {
        suppressCount: false,
        checkbox: false,
      },
      field: "bonTripNo",
      headerName: "STATUS",
      minWidth: "200",
      onCellClicked: (params) => handleCellClick(params.data.id),
      cellStyle: { textAlign: "center", cursor: "pointer" },
      // flex: 1,
    }),
    [],
  );

  useEffect(() => {
    refetch();
  }, [wbTransaction]);

  return (
    <Box
      className="ag-theme-balham"
      sx={{ "& .ag-header-cell-label": { justifyContent: "center" }, width: "auto", height: "67.5vh" }}
    >
      <AgGridReact
        rowData={results?.records} // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection="multiple" // Options - allows click selection of rows
        rowGroupPanelShow="always"
        enableRangeSelection="true"
        groupSelectsChildren="true"
        suppressRowClickSelection="true"
        autoGroupColumnDef={autoGroupColumnDef}
        pagination="true"
        paginationAutoPageSize="true"
        groupDefaultExpanded="1"
        // rowHeight="33"
      />
    </Box>
  );
};

export default TransactionGrid;
