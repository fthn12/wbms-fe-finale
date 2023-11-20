import { useState, useCallback, useEffect, useRef } from "react";
import { Box, Button, TextField, FormControl, Autocomplete } from "@mui/material";

// import dayjs from "dayjs";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.min.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-balham.min.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import moment from "moment";

import exportToPDF from "./export2PDF/exportToPDF";

import Header from "../../../components/layout/signed/Header";
import TransactionTable from "./TransactionTable";
import Export2Excel from "./Export2Excel";
// import ViewTransaction from "../../../components/viewTransaction";

import { useConfig, useTransaction, useApp, useProduct, useTransportVehicle, useCompany } from "../../../hooks";

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const ReportTransactionDaily = () => {
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);

  const { setSidebar } = useApp();
  const {
    WBMS,
    // PKS_PROGRESS_STATUS,
    // T30_PROGRESS_STATUS,
    // BULKING_PROGRESS_STATUS,
  } = useConfig();
  const { useFindManyTransactionQuery } = useTransaction();
  // const { useGetProductQuery } = useProduct();
  // const { useGetTransportVehiclesQuery } = useTransportVehicle();
  // const { useGetCompanyQuery } = useCompany();

  //filter date
  // const today = dayjs();
  // const startOfToday = today.startOf("day").hour(7);
  // const startDateTime = today.isAfter(startOfToday) ? startOfToday : startOfToday.subtract(1, "day");
  // const endDateTime = startOfToday;
  // const [selectedStartDate, setSelectedStartDate] = useState(startDateTime);
  // const [selectedEndDate, setSelectedEndDate] = useState(endDateTime);
  // const filterStart = moment(selectedStartDate).hour(7).startOf("hour");
  // const filterEnd = moment(selectedEndDate).add(1, "day").hour(6).endOf("hour");

  const data = {
    where: {
      typeSite: +WBMS.SITE_TYPE,
      progressStatus: { in: [21, 26, 31] },
    },
    orderBy: { bonTripNo: "desc" },
  };
 
  const { data: dtTransaction, refetch: refetchDtTransaction } = useFindManyTransactionQuery(data);
  // const { data: dtProduct } = useGetProductQuery();
  // const { data: dtTransportVehicle } = useGetTransportVehiclesQuery();
  // const { data: dtCompany } = useGetCompanyQuery();

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedPlateNo, setSelectedPlateNo] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  // const statusFilter = (inputValue) => {
  //   if (!inputValue || inputValue.trim() === "") {
  //     if (WBMS.SITE_TYPE === "1") {
  //       return Object.keys(PKS_PROGRESS_STATUS).map(
  //         (key) => PKS_PROGRESS_STATUS[key]
  //       );
  //     } else if (WBMS.SITE_TYPE === "2") {Sebagat
  //       return Object.keys(T30_PROGRESS_STATUS).map(
  //         (key) => T30_PROGRESS_STATUS[key]
  //       );
  //     } else if (WBMS.SITE_TYPE === "3") {
  //       return Object.keys(BULKING_PROGRESS_STATUS).map(
  //         (key) => BULKING_PROGRESS_STATUS[key]
  //       );
  //     }
  //   }

  //   // Gunakan metode filter() untuk mencocokkan nama status dengan nilai input
  //   let filteredStatus = [];
  //   if (WBMS.SITE_TYPE === "1") {
  //     filteredStatus = Object.keys(PKS_PROGRESS_STATUS).filter((key) =>
  //       PKS_PROGRESS_STATUS[key]
  //         .toLowerCase()
  //         .includes(inputValue.toLowerCase())
  //     );
  //   } else if (WBMS.SITE_TYPE === "2") {
  //     filteredStatus = Object.keys(T30_PROGRESS_STATUS).filter((key) =>
  //       T30_PROGRESS_STATUS[key]
  //         .toLowerCase()
  //         .includes(inputValue.toLowerCase())
  //     );
  //   } else if (WBMS.SITE_TYPE === "3") {
  //     filteredStatus = Object.keys(BULKING_PROGRESS_STATUS).filter((key) =>
  //       BULKING_PROGRESS_STATUS[key]
  //         .toLowerCase()
  //         .includes(inputValue.toLowerCase())
  //     );
  //   }

  //   return filteredStatus;
  // };

  // const statusFilterMemoized = useCallback(statusFilter, [
  //   PKS_PROGRESS_STATUS,
  //   BULKING_PROGRESS_STATUS,
  //   T30_PROGRESS_STATUS,
  //   WBMS.SITE_TYPE,
  // ]);

  const actionsRenderer = (params) => {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        {params.data && (
          <Button
            variant="contained"
            size="small"
            sx={{ m: "1px" }}
            onClick={() => {
              setSelectedTransaction(params.data);
              setIsViewOpen(true);
            }}
          >
            View
          </Button>
        )}
      </Box>
    );
  };

  useEffect(() => {
    setSidebar({ selected: "Transaksi Harian" });
  }, []);

  return (
    <Box>
      <Header title="LAPORAN TRANSAKSI" subtitle="Laporan Transaksi Harian" />

      <Box display="flex" sx={{ mt: 1 }}>
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Dari Tanggal"
            // maxDate={today}
            className="custom-datetimepicker"
            value={selectedStartDate}
            onChange={(date) => {
              const formattedDate = dayjs(date).startOf("day").hour(7).toDate();
              setSelectedStartDate(formattedDate);
            }}
          />
          <DatePicker
            label="Sampai Tanggal"
            className="custom-datetimepicker"
            // maxDate={today}
            value={selectedEndDate}
            onChange={(date) => {
              const formattedDate = dayjs(date).startOf("day").hour(7).toDate();
              setSelectedEndDate(formattedDate);
            }}
          />
        </LocalizationProvider>

        <FormControl sx={{ mt: "auto", minWidth: 190 }} size="small">
          <Autocomplete
            value={selectedProduct}
            onChange={(event, newValue) => {
              setSelectedProduct(newValue || "");
            }}
            options={
              dtProduct?.data?.product?.records?.map((item) => item.name) || []
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pilih Product"
                variant="outlined"
                size="small"
              />
            )}
            sx={{
              color: selectedProduct === "" ? "gray" : "black",
              fontSize: "15px",
              mt: "auto",
              mr: "10px",
              minWidth: 150,
            }}
          />
        </FormControl>

        <FormControl sx={{ mt: "auto", minWidth: 190 }} size="small">
          <Autocomplete
            value={selectedPlateNo}
            onChange={(event, newValue) => {
              setSelectedPlateNo(newValue || "");
            }}
            options={
              dtTransportVehicle?.data?.transportVehicle?.records?.map(
                (item) => item.plateNo
              ) || []
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pilih No Pol"
                variant="outlined"
                size="small"
              />
            )}
            sx={{
              color: selectedPlateNo === "" ? "gray" : "black",
              fontSize: "15px",
              mt: "auto",
              mr: "10px",
              minWidth: 150,
            }}
          />
        </FormControl>
        <FormControl sx={{ mt: "auto", minWidth: 190 }} size="small">
          <Autocomplete
            value={selectedVendor}
            onChange={(event, newValue) => {
              setSelectedVendor(newValue || "");
            }}
            options={
              dtCompany?.data?.company?.records?.map((item) => item.name) || []
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pilih Vendor"
                variant="outlined"
                size="small"
              />
            )}
            sx={{
              color: selectedVendor === "" ? "gray" : "black",
              fontSize: "15px",
              mt: "auto",
              mr: "10px",
              minWidth: 150,
            }}
          />
        </FormControl> */}

        {/* <FormControl sx={{ mt: "auto", minWidth: 190 }} size="small">
          <Autocomplete
            value={selectedStatus}
            onChange={(event, newValue) => {
              setSelectedStatus(newValue); // Memperbarui selectedStatus saat status dipilih
            }}
            options={statusFilter("")}
            getOptionLabel={(status) => status}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pilih Status"
                variant="outlined"
                size="small"
              />
            )}
            sx={{
              color: selectedStatus === "" ? "gray" : "black",
              fontSize: "15px",
              mt: "auto",
              mr: "10px",
              minWidth: 150,
            }}
          />
        </FormControl> */}

        <Box ml="auto" mt="auto">
          <Export2Excel columnApi={columnApi} gridRef={gridRef} />
          <Button variant="contained" onClick={() => exportToPDF(gridApi, columnApi)}>
            Export PDF
          </Button>

          <Button variant="contained" sx={{ ml: 0.5 }} onClick={() => refetchDtTransaction()}>
            Reload
          </Button>
        </Box>
      </Box>

      <TransactionTable
        dtTransaction={dtTransaction}
        selectedProduct={selectedProduct}
        selectedVendor={selectedVendor}
        selectedPlateNo={selectedPlateNo}
        // selectedStatus={selectedStatus}
        // statusFilter={statusFilter}
        // statusFilterMemoized={statusFilterMemoized}
        gridRef={gridRef}
        setGridApi={setGridApi}
        setColumnApi={setColumnApi}
        actionsRenderer={actionsRenderer}
      />
      {/* <ViewTransaction
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dtTransaction={selectedTransaction}
      /> */}
    </Box>
  );
};

export default ReportTransactionDaily;
