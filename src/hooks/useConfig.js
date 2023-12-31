import { useDispatch, useSelector } from "react-redux";

import * as configRedux from "../slices/config/configSlice";
import { getConfigs } from "../slices/config/configSliceApi";

const sccModel = {
  0: "None",
  1: "Mass Balance",
  2: "Segregated",
  3: "Identity Preserved",
};

const progressStatus = {
  0: "TIMBANG MASUK",
  1: "LOADING",
  2: "UNLOADING",

  5: "CANCEL TIMBANG MASUK",
  6: "CANCEL UNLOADING",

  10: "REJECT TIMBANG MASUK",
  11: "REJECT UNLOADING",

  20: "TIMBANG KELUAR",
  21: "DATA TIMBANG TERSIMPAN",

  25: "CANCEL TIMBANG KELUAR",
  26: "DATA CANCEL TERSIMPAN",

  30: "RETUR TIMBANG KELUAR",
  31: "DATA RETUR TERSIMPAN",
};

const pksProgressStatus = {
  0: "TIMBANG MASUK",
  1: "LOADING/UNLOADING",
  2: "TIMBANG KELUAR",
  3: "DATA DISPATCHED",
  4: "DATA DISPATCHED",
  5: "CANCEL TIMBANG MASUK",
  6: "CANCEL UNLOADING",
  7: "CANCEL TIMBANG KELUAR",
  8: "CANCEL SUBMITTED",
  9: "CANCEL SUBMITTED",
  10: "REJECT TIMBANG MASUK",
  11: "REJECT UNLOADING",
  12: "REJECT TIMBANG KELUAR",
  13: "REJECT SUBMITTED",
  14: "REJECT SUBMITTED",
  15: "SELESAI",
};

const t30ProgressStatus = {
  0: "TIMBANG MASUK",
  1: "LOADING/UNLOADING",
  2: "TIMBANG KELUAR",
  3: "DATA DISPATCHED",
  4: "DATA DISPATCHED",
  5: "CANCEL TIMBANG MASUK",
  6: "CANCEL UNLOADING",
  7: "CANCEL TIMBANG KELUAR",
  8: "CANCEL SUBMITTED",
  9: "CANCEL SUBMITTED",
  15: "SELESAI",
};

const bulkingProgressStatus = {
  0: "TIMBANG MASUK",
  1: "UNLOADING",
  2: "TIMBANG KELUAR",
  3: "DATA SUBMITED",
  4: "DATA SUBMITED",
  12: "REJECT TIMBANG KELUAR",
  13: "REJECT SUBMITTED",
  14: "REJECT SUBMITTED",
  15: "SELESAI",
};

const mdSource = {
  0: "WBMS",
  1: "eDispatch",
};

const roles = [
  { id: 0, value: "Not Assigned" },
  { id: 1, value: "Operator" },
  { id: 2, value: "Supervisor" },
  { id: 3, value: "Manager" },
  { id: 4, value: "Admin HC" },
  { id: 5, value: "Admin System" },
  { id: 6, value: "Admin IT" },
];

const eDispatchServer = [
  { id: 1, value: "API SERVER 1 (primary)" },
  { id: 2, value: "API SERVER 2 (secondary)" },
];

const siteTypes = [
  { id: 1, value: "PKS" },
  { id: 2, value: "T30" },
  { id: 3, value: "Bulking" },
];

const vaSccModel = [
  { id: 0, value: "None" },
  { id: 1, value: "Mass Balance" },
  { id: 2, value: "Segregated" },
  { id: 3, value: "Identity Preserved" },
];

const rspoSccModel = [
  { id: 0, value: "None" },
  { id: 1, value: "Mass Balance" },
  { id: 2, value: "Segregated" },
  { id: 3, value: "Identity Preserved" },
];

const isccSccModel = [
  { id: 0, value: "None" },
  { id: 1, value: "Mass Balance" },
  { id: 2, value: "Segregated" },
  { id: 3, value: "Identity Preserved" },
];

export const useConfig = () => {
  const dispatch = useDispatch();

  // get value of state
  const {
    ENV,
    WBMS,
    PROGRESS_STATUS,
    PKS_PROGRESS_STATUS,
    T30_PROGRESS_STATUS,
    BULKING_PROGRESS_STATUS,
    MD_SOURCE,
    ROLES,
    EDISPATCH_SERVER,
    SITE_TYPES,
    SCC_MODEL,
    VA_SCC_MODEL,
    RSPO_SCC_MODEL,
    ISCC_SCC_MODEL,
  } = useSelector((state) => state.configs);

  const initialData = {
    ENV: process.env,

    PROGRESS_STATUS: progressStatus,
    PKS_PROGRESS_STATUS: pksProgressStatus,
    T30_PROGRESS_STATUS: t30ProgressStatus,
    BULKING_PROGRESS_STATUS: bulkingProgressStatus,
    MD_SOURCE: mdSource,
    ROLES: roles,
    EDISPATCH_SERVER: eDispatchServer,
    SITE_TYPES: siteTypes,
    SCC_MODEL: sccModel,
    VA_SCC_MODEL: vaSccModel,
    RSPO_SCC_MODEL: rspoSccModel,
    ISCC_SCC_MODEL: isccSccModel,
  };

  const syncConfig = () => {
    dispatch(getConfigs());
    dispatch(configRedux.setConfigs(initialData));
  };

  return {
    ENV,
    WBMS,
    PROGRESS_STATUS,
    PKS_PROGRESS_STATUS,
    T30_PROGRESS_STATUS,
    BULKING_PROGRESS_STATUS,
    MD_SOURCE,
    ROLES,
    EDISPATCH_SERVER,
    SITE_TYPES,
    SCC_MODEL,
    VA_SCC_MODEL,
    RSPO_SCC_MODEL,
    ISCC_SCC_MODEL,
    syncConfig,
  };
};
