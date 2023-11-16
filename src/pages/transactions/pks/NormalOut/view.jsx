import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, InputAdornment, Paper, TextField } from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";

import Header from "../../../../components/layout/signed/HeaderTransaction";
import QRCodeViewer from "../../../../components/QRCodeViewer";
import BonTripPrint from "../../../../components/BonTripPrint";

import { useForm } from "../../../../utils/useForm";
import { TransactionAPI } from "../../../../apis";

import { useConfig, useTransaction } from "../../../../hooks";

const TransactionPksNormalOut = (props) => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();

  const { SCC_MODEL } = useConfig();
  const { openedTransaction, clearOpenedTransaction } = useTransaction();

  const { values, setValues } = useForm({ ...transactionAPI.InitialData });

  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    clearOpenedTransaction();

    navigate(-1);
  };

  const handleSubmit = async () => {
    let tempTrans = { ...values };

    try {
      const data = { openedTransaction: { ...tempTrans } };

      // const response = await transactionAPI.eDispatchPksWbOutNormalAfter(data);
      // Hanya save ke DB, tidak ke eDispatch

      // if (!response.status) throw new Error(response?.message);

      // setValues({ ...response.data.transaction });
      setIsSubmitted(true);

      toast.success(`Transaksi WB-OUT telah tersimpan.`);
    } catch (error) {
      return toast.error(`${error.message}..!!`);
    }
  };

  useEffect(() => {
    if (!openedTransaction) return handleClose();

    setValues({ ...openedTransaction });
    setOriginWeighNetto(Math.abs(openedTransaction.originWeighInKg - openedTransaction.originWeighOutKg));

    setIsSubmitted(true);
    clearOpenedTransaction();

    return () => {
      // console.clear();
    };
  }, []);

  return (
    <Box>
      <Header title="TRANSAKSI PKS" subtitle="WB-OUT" />

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button variant="contained" onClick={handleClose}>
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
              label="BERAT MASUK -IN"
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

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              onClick={handleSubmit}
              disabled={!(canSubmit && !isSubmitted)}
            >
              Simpan
            </Button>

            <QRCodeViewer progressStatus={values.progressStatus} deliveryOrderId={values.deliveryOrderId} type="form" />

            <BonTripPrint dtTrans={{ ...values }} isDisable={!isSubmitted} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TransactionPksNormalOut;
