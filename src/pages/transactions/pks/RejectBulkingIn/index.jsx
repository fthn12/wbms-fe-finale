import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, InputAdornment, Paper, TextField } from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";

import Header from "../../../../components/layout/signed/HeaderTransaction";
import QRCodeViewer from "../../../../components/QRCodeViewer";

import { useForm } from "../../../../utils/useForm";
import { TransactionAPI } from "../../../../apis";

import { useAuth, useConfig, useTransaction, useWeighbridge, useApp } from "../../../../hooks";

const TransactionPksRejectBulkingIn = (props) => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();

  const { user } = useAuth();
  const { setSidebar } = useApp();
  const { WBMS, SCC_MODEL } = useConfig();
  const { wbTransaction, clearWbTransaction } = useTransaction();
  const { wb } = useWeighbridge();

  const { values, setValues, handleInputChange } = useForm({
    ...transactionAPI.InitialData,
  });

  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [returnWeighNetto, setReturnWeighNetto] = useState(0);

  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    clearWbTransaction();

    navigate("/wb/transactions");
  };

  const handleSubmit = async () => {
    let tempTrans = { ...values };

    try {
      // tempTrans.returnWeighInTimestamp = SemaiUtils.GetDateStr();
      tempTrans.returnWeighInTimestamp = moment().toDate();
      tempTrans.returnWeighInOperatorName = user.name;
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const data = { wbTransaction: { ...tempTrans } };

      const response = await transactionAPI.eDispatchPksWbInRejectBulkingAfter(data);

      if (!response.status) throw new Error(response?.message);

      // setWbTransaction(response.data.transaction);
      clearWbTransaction();
      setValues({ ...response.data.transaction });
      setIsSubmitted(true);

      toast.success(`Transaksi WB-IN REJECT telah tersimpan.`);
      handleClose();
    } catch (error) {
      return toast.error(`Error: ${error.message}.`);
    }
  };

  useEffect(() => {
    if (!wbTransaction) return handleClose();

    setSidebar({ selected: "Transaksi WB PKS" });
    setValues(wbTransaction);

    return () => {
      // console.clear();
    };
  }, []);

  useEffect(() => {
    if (!isSubmitted) {
      setValues((prev) => ({
        ...prev,
        returnWeighInKg: wb.weight,
      }));
    }
  }, [wb.weight]);

  useEffect(() => {
    if (values.originWeighInKg < WBMS.WB_MIN_WEIGHT || values.originWeighOutKg < WBMS.WB_MIN_WEIGHT) {
      setOriginWeighNetto(0);
    } else {
      let total = Math.abs(values.originWeighInKg - values.originWeighOutKg);

      setOriginWeighNetto(total);
    }

    if (values.returnWeighInKg < WBMS.WB_MIN_WEIGHT || values.returnWeighOutKg < WBMS.WB_MIN_WEIGHT) {
      setReturnWeighNetto(0);
    } else {
      let total = Math.abs(values.returnWeighInKg - values.returnWeighOutKg);

      setReturnWeighNetto(total);
    }
  }, [values]);

  // Untuk validasi field
  useEffect(() => {
    let cSubmit = false;

    if (
      values.returnWeighInKg >= WBMS.WB_MIN_WEIGHT
      //  &&
      // values?.returnUnloadedSeal1?.trim().length > 0 &&
      // values?.returnUnloadedSeal2?.trim().length > 0
    ) {
      cSubmit = true;
    }

    setCanSubmit(cSubmit);
  }, [values]);

  return (
    <Box>
      <Header title="TRANSAKSI PKS" subtitle="WB-IN" />

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button variant="contained" disabled={!isSubmitted} onClick={handleClose}>
          TUTUP
        </Button>
      </Box>
      <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
        <Grid container spacing={1}>
          <Grid item xs={3} sm={6}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ backgroundColor: "whitesmoke" }}
              label="NO BONTRIP"
              name="bonTripNo"
              value={values?.bonTripNo || ""}
              inputProps={{ readOnly: true }}
            />

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="NOMOR POLISI"
              name="transportVehiclePlateNo"
              value={values?.transportVehiclePlateNo || ""}
              inputProps={{ readOnly: true }}
            />

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="NAMA SUPIR"
              name="driverName"
              value={values?.driverName || ""}
              inputProps={{ readOnly: true }}
            />

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="NAMA VENDOR/TRANSPORTER"
              name="transporterCompanyName"
              value={values?.transporterCompanyName || ""}
              inputProps={{ readOnly: true }}
            />

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="SERTIFIKASI TRUK"
              name="transportVehicleSccModel"
              value={SCC_MODEL[values?.transportVehicleSccModel || 0]}
              inputProps={{ readOnly: true }}
            />

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="SEGEL MAINHOLE 1 WB-IN"
              name="unloadedSeal1"
              value={values?.unloadedSeal1 || ""}
              inputProps={{ readOnly: true }}
            />

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="SEGEL VALVE 1 WB-IN"
              name="unloadedSeal2"
              value={values?.unloadedSeal2 || ""}
              inputProps={{ readOnly: true }}
            />
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="SEGEL MAINHOLE 2 WB-IN"
              name="unloadedSeal3"
              value={values?.unloadedSeal3 || ""}
              inputProps={{ readOnly: true }}
            />
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="SEGEL VALVE 2 WB-IN"
              name="unloadedSeal4"
              value={values?.unloadedSeal4 || ""}
              inputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={3} sm={6}>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="BERAT MASUK - IN"
              name="originWeighInKg"
              value={values?.originWeighInKg > 0 ? values.originWeighInKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />

            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="BERAT KELUAR - OUT"
              name="originWeighOutKg"
              value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />

            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="TOTAL"
              name="weightNetto"
              value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />

            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="RETUR BERAT MASUK - IN"
              name="returnWeighInKg"
              value={values?.returnWeighInKg > 0 ? values.returnWeighInKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />

            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="RETUR BERAT KELUAR - OUT"
              name="returnWeighOutKg"
              value={values?.returnWeighOutKg > 0 ? values.returnWeighOutKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />

            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="TOTAL RETUR"
              name="returnWeightNetto"
              value={returnWeighNetto > 0 ? returnWeighNetto.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: isSubmitted ? "whitesmoke" : "white" }}
              multiline
              rows={3}
              label="CATATAN REJECT"
              name="returnWeighInRemark"
              disabled={isSubmitted}
              value={values?.returnWeighInRemark || ""}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
            {/* <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: isSubmitted ? "whitesmoke" : "white" }}
              multiline
              rows={3}
              label="CATATAN REJECT"
              name="returnWeighOutRemark"
              disabled={isSubmitted}
              value={values?.returnWeighOutRemark || ""}
              onChange={(e) => {
                handleInputChange(e);
              }}
            /> */}

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              onClick={handleSubmit}
              disabled={!(canSubmit && !isSubmitted && wb?.isStable)}
            >
              Simpan
            </Button>

            <QRCodeViewer progressStatus={values.progressStatus} deliveryOrderId={values.deliveryOrderId} type="form" />
          </Grid>

          <Grid item xs={6}></Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TransactionPksRejectBulkingIn;
