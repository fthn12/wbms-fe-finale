import { Typography, Box, useTheme, Paper } from "@mui/material";

import ProgressStatus from "../../ProgressStatus";
import GetWeightWB from "../../GetWeightWB";
import QRCodeScanner from "../../QRCodeScanner";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ display: "flex", p: 2, width: "100%" }}>
      <Box>
        <Typography variant="h2" color={theme.palette.neutral.dark} fontWeight="bold" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h5" color={theme.palette.neutral.dark}>
          {subtitle}
        </Typography>
      </Box>
      <Box flex={1} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <ProgressStatus />
        </Box>
        <Box sx={{ ml: 1 }}>
          <GetWeightWB />
        </Box>
        <Box sx={{ ml: 1 }}>
          <QRCodeScanner />
        </Box>
      </Box>
    </Paper>
  );
};

export default Header;
