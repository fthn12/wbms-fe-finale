import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Grid, InputAdornment } from "@mui/material";
import { MenuItem, Paper, Box } from "@mui/material";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-mui";
import * as yup from "yup";
import moment from "moment";
import numeral from "numeral";

import Header from "../../../../components/layout/signed/HeaderTransaction";

import { TransactionAPI } from "../../../../apis";
import * as eDispatchApi from "../../../../apis/eDispatchApi";

import { useConfig, useTransaction } from "../../../../hooks";
import { useStorageTank } from "../../../../hooks";

const validationSchema = yup.object().shape({
  // username: yup.string().required("Wajib diisi."),
  // password: yup
  //   .string()
  //   .min(8, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
  //   .max(20, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
  //   .required("Wajib diisi."),
  // passwordConfirm: yup.string().oneOf([yup.ref("password"), null], "Password harus sama."),
  // email: yup.string().email("Email tidak valid.").required("Wajib diisi."),
  // npk: yup.string().required("Wajib diisi."),
  // nik: yup.string().required("Wajib diisi."),
  // name: yup.string().required("Wajib diisi."),
  // division: yup.string().required("Wajib diisi."),
  // position: yup.string().required("Wajib diisi."),
  // role: yup.number().required("Wajib diisi."),
});

const TransactionT30WbInNormal = (props) => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();

  const { WBMS, SCC_MODEL } = useConfig();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } = useTransaction();
  const { useFindManyStorageTanksQuery } = useStorageTank();

  const T30Site = eDispatchApi.getT30Site();

  const storageTankFilter = {
    where: { siteRefId: T30Site.id, refType: 1 },
  };

  const { data: dtStorageTanks } = useFindManyStorageTanksQuery(storageTankFilter);

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);

    const tempTrans = { ...values };

    try {
      const selected = dtStorageTanks.records.find((item) => item.id === values.originSourceStorageTankId);

      if (selected) {
        tempTrans.originSourceStorageTankCode = selected.code || "";
        tempTrans.originSourceStorageTankName = selected.name || "";
      }

      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.updateById(tempTrans.id, { ...tempTrans });

      if (!response.status) throw new Error(response?.message);

      setOpenedTransaction(response.data.transaction);
      setIsLoading(false);

      toast.success(`Transaksi WB-IN telah tersimpan.`);
    } catch (error) {
      setIsLoading(false);
      return toast.error(`${error.message}..!!`);
    }
  };

  useEffect(() => {
    if (!openedTransaction) return handleClose();

    return () => {
      // console.clear();
    };
  }, []);

  // Untuk validasi field
  // useEffect(() => {
  //   let cSubmit = false;

  // if (
  //   values.originWeighInKg >= WBMS.WB_MIN_WEIGHT &&
  //   values?.originSourceStorageTankId?.trim().length > 0 &&
  //   values?.loadedSeal1?.trim().length > 0 &&
  //   values?.loadedSeal2?.trim().length > 0
  // ) {
  //   cSubmit = true;
  // }

  //   setCanSubmit(cSubmit);
  // }, [WBMS.WB_MIN_WEIGHT, values]);

  return (
    <Box>
      <Header title="TRANSAKSI T30" subtitle="WB-IN" />

      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={openedTransaction || undefined}
        validationSchema={validationSchema}
      >
        {(props) => {
          const { values, dirty } = props;
          // console.log("Formik props:", props);
          return (
            <Form>
              <Box display="flex" sx={{ mt: 3 }}>
                <Box flex={1}></Box>
                <Button variant="contained" disabled={dirty} onClick={handleClose}>
                  TUTUP
                </Button>
              </Box>

              <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
                <Grid container spacing={1}>
                  <Grid item xs={6} sm={3}>
                    <Grid container columnSpacing={1}>
                      <Grid item xs={12}>
                        <Field
                          name="bonTripNo"
                          label="NO BONTRIP"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="driverName"
                          label="Nama Supir"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="transportVehiclePlateNo"
                          label="Nomor Polisi"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Field
                          name="driverNik"
                          label="NIK"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="driverLicenseNo"
                          label="SIM"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="transporterCompanyName"
                          label="Nama Vendor"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                          value={`${values.transporterCompanyName} - ${values.transporterCompanyCode}`}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="transportVehicleProductCode"
                          label="Kode Produk Kendaraan"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="transportVehicleProductName"
                          label="Nama Produk Kendaraan"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="productCode"
                          label="Kode Produk"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="productName"
                          label="Nama Produk"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          name="transportVehicleSccModel"
                          label="Sertifikasi Kendaraan"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                          value={SCC_MODEL[values.transportVehicleSccModel]}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Grid container columnSpacing={1}>
                      <Grid item xs={6}>
                        <Field
                          name="currentSeal1"
                          label="Segel 1 Saat Ini"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="currentSeal2"
                          label="Segel 2 Saat Ini"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Field
                          name="loadedSeal1"
                          label="Segel Mainhole 1"
                          type="text"
                          required
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="loadedSeal2"
                          label="Segel Valve 1"
                          type="text"
                          required
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Field
                          name="loadedSeal3"
                          label="Segel Mainhole 2"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Field
                          name="loadedSeal4"
                          label="Segel Valve 2"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          id="originSourceStorageTankId"
                          labelId="originSourceStorageTankIdLbl"
                          name="originSourceStorageTankId"
                          label="Tangki Asal"
                          component={Select}
                          // disabled
                          size="small"
                          formControl={{
                            fullWidth: true,
                            required: true,
                            sx: {
                              mt: 2,
                            },
                          }}
                        >
                          {dtStorageTanks?.records &&
                            dtStorageTanks.records?.map((data, index) => (
                              <MenuItem key={index} value={data.id}>
                                {`[${data.siteName}] ${data.name} ${data.productName}`}
                              </MenuItem>
                            ))}
                        </Field>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Grid container columnSpacing={1}>
                      <Grid item xs={5}>
                        <Field
                          name="originWeighInKg"
                          label="Berat Timbang Masuk"
                          type="number"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          InputProps={{
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                          }}
                          value={numeral(values.originWeighInKg).format("0,0.00")}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <Field
                          name="originWeighInTimestamp"
                          label="Waktu Timbang Masuk"
                          type="datetime"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                          value={moment(values.originWeighInTimestamp).format("LLL")}
                        />
                      </Grid>

                      <Grid item xs={5}>
                        <Field
                          name="originWeighOutKg"
                          label="Berat Timbang Keluar"
                          type="number"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          InputProps={{
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                          }}
                          value={numeral(values.originWeighOutKg).format("0,0.00")}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <Field
                          name="originWeighOutTimestamp"
                          label="Waktu Timbang Keluar"
                          type="datetime"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                          value={moment(values.originWeighOutTimestamp).format("LLL") || "-"}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          name="weightNetto"
                          label="TOTAL"
                          type="number"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          InputProps={{
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                          }}
                          value={numeral(Math.abs(values.originWeighInKg - values.originWeighOutKg)).format("0,0.00")}
                        />
                      </Grid>
                    </Grid>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, mb: 1, height: 50 }}
                      disabled={!dirty}
                    >
                      Simpan
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              {isLoading && (
                <CircularProgress
                  size={50}
                  sx={{
                    color: "goldenrod",
                    position: "absolute",
                    top: "50%",
                    left: "48.5%",
                  }}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default TransactionT30WbInNormal;
