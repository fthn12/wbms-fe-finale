import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, CircularProgress, IconButton } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { green } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { TransactionAPI } from "../apis";

import { useTransaction, useConfig, useWeighbridge } from "../hooks";

const QRCodeScanner = (props) => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();

  const inputElement = useRef(null);

  const { WBMS } = useConfig();
  const { wb } = useWeighbridge();
  const { wbTransaction, setWbTransaction } = useTransaction();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeContent, setCodeContent] = useState("");

  const qrcodeAutoFocus = () => {
    document.getElementById("qrcode")?.focus();
  };

  const onChangeQrcode = (event) => {
    setCodeContent(event.target.value);
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      if (codeContent?.trim().length > 10) {
        const data = { content: codeContent.trim(), typeSite: WBMS.SITE_TYPE };

        setIsLoading(true);

        transactionAPI
          .eDispatchFindOrCreateByQrcode(data)
          .then((response) => {
            console.log("Decode QR response:", response);

            if (!response?.status) {
              throw new Error(response?.message);
            }

            console.log("vStatus:", response.data.draftTransaction.vehicleStatus);
            console.log("dStatus:", response.data.draftTransaction.deliveryStatus);

            setWbTransaction(response.data.draftTransaction);
            setIsLoading(false);

            return navigate(response.data.urlPath);
          })
          .catch((error) => {
            setIsLoading(false);
            toast.error(`${error?.message}..!!`);
          });
      } else {
        toast.error("Tidak dapat membaca QR Code atau QR Code tidak valid..!!");
      }

      setCodeContent("");
    }
  };

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }

    qrcodeAutoFocus();
  }, [isLoading]);

  useEffect(() => {
    setCodeContent("");
  }, [isOpen]);

  return (
    <Box>
      <Button
        variant="contained"
        sx={{ height: "67.5px", width: "100px" }}
        fullWidth
        disabled={!wb?.canStartScalling || !!wbTransaction}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Scan QR
      </Button>
      <Dialog
        open={isOpen}
        fullWidth
        // fullScreen
        // maxWidth="10vw"
        // keepMounted
        // onClose={() => {
        //   setIsOpen(false);
        //   onCloseHandler("", false);
        // }}
      >
        <DialogTitle>
          <Typography variant="h3" fontWeight="900">
            Arahkan Kode Identitas ke Scanner
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setIsOpen(false)}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {isLoading && (
            <CircularProgress
              size={50}
              sx={{
                color: green[500],
                position: "absolute",
                top: "47%",
                left: "48%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
          <input
            type="text"
            autoFocus
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            id="qrcode"
            name="qrcode"
            disabled={isLoading}
            ref={inputElement}
            label="Arahkan Kode Identitas ke Scanner"
            value={codeContent}
            onChange={onChangeQrcode}
            onKeyDown={onKeyDown}
            onBlur={qrcodeAutoFocus}
            onFocus={(e) => e.currentTarget.select()}
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "auto",
              textAlign: "center",
              justifyContent: "center",
              fontSize: "x-large",
              fontWeight: "750",
              height: "10vh",
              width: "100%",
              fontVariantCaps: "all-small-caps",
              // border: "none",
              background: "transparent",
              outline: 0,
            }}
            // inputProps={{
            //   style: {
            //     display: "flex",
            //     flexDirection: "column",
            //     m: "auto",
            //     textAlign: "center",
            //     fontSize: "large",
            //     height: "50vh",
            //     justifyContent: "center",
            //   },
            // }}
          />
        </DialogContent>
        <DialogActions>
          {/* <Box flex={1} /> */}
          <Button fullWidth variant="contained" onClick={() => setIsOpen(false)}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRCodeScanner;
