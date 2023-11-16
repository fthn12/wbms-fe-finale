import { useAxios } from "../hooks";

export const TransactionAPI = () => {
  const { axios } = useAxios();
  const endpoint = "transactions";

  const getById = async (id) => {
    const response = await axios.get(`${endpoint}/${id}`).then((res) => res.data);
    return response;
  };

  const updateById = async (id, data) => {
    const response = await axios.patch(`${endpoint}/${id}`, data).then((res) => res.data);
    return response;
  };

  const findMany = async (query) => {
    const response = await axios.post(`${endpoint}/find-many`, query).then((res) => res.data);

    return response;
  };

  const findFirst = async (query) => {
    const response = await axios.post(`${endpoint}/find-first`, query);
    return response.data;
  };

  const eDispatchFindOrCreateByQrcode = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-find-create-qrcode`, data).then((res) => res.data);

    return response;
  };

  const eDispatchPksNormalInAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-pks-normal-in-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchPksNormalOutAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-pks-normal-out-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchPksCancelInAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-pks-cancel-in-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchPksCancelOutAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-pks-cancel-out-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchPksRejectT300InAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-pks-reject-t300-in-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchPksRejectBulkingInAfter = async (data) => {
    const response = await axios
      .post(`${endpoint}/edispatch-pks-reject-bulking-in-after`, data)
      .then((res) => res.data);

    return response;
  };

  const eDispatchPksRejectOutAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-pks-reject-out-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchT30NormalInAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-t30-normal-in-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchT30NormalOutAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-t30-normal-out-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchT30CancelInAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-t30-cancel-in-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchT30CancelOutAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-t30-cancel-out-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchBulkingNormalInAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-bulking-normal-in-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchBulkingNormalOutAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-bulking-normal-out-after`, data).then((res) => res.data);

    return response;
  };

  const eDispatchBulkingRejectOutAfter = async (data) => {
    const response = await axios.post(`${endpoint}/edispatch-bulking-reject-out-after`, data).then((res) => res.data);

    return response;
  };

  const GetByPlateNo = async (query) => {
    const response = await axios.get(`${endpoint}/getByPlateNo`, {
      params: { ...query },
    });
    return response.data;
  };

  const create = async (data) => {
    const response = await axios.post(`${endpoint}`, data);

    return response.data;
  };

  return {
    create,
    getById,
    findMany,
    findFirst,
    updateById,
    eDispatchFindOrCreateByQrcode,
    eDispatchPksWbInNormalAfter: eDispatchPksNormalInAfter,
    eDispatchPksWbOutNormalAfter: eDispatchPksNormalOutAfter,
    eDispatchPksWbInCancelAfter: eDispatchPksCancelInAfter,
    eDispatchPksWbOutCancelAfter: eDispatchPksCancelOutAfter,
    eDispatchPksWbInRejectT300After: eDispatchPksRejectT300InAfter,
    eDispatchPksWbInRejectBulkingAfter: eDispatchPksRejectBulkingInAfter,
    eDispatchPksWbOutRejectAfter: eDispatchPksRejectOutAfter,
    eDispatchT30WbInNormalAfter: eDispatchT30NormalInAfter,
    eDispatchT30WbOutNormalAfter: eDispatchT30NormalOutAfter,
    eDispatchT30WbInCancelAfter: eDispatchT30CancelInAfter,
    eDispatchT30WbOutCancelAfter: eDispatchT30CancelOutAfter,
    eDispatchBulkingWbInNormalAfter: eDispatchBulkingNormalInAfter,
    eDispatchBulkingWbOutNormalAfter: eDispatchBulkingNormalOutAfter,
    eDispatchBulkingWbOutRejectAfter: eDispatchBulkingRejectOutAfter,
    GetByPlateNo,
  };
};

export const InitialData = {
  id: "",
  typeSite: 0,
  typeTransaction: 0,

  bonTripNo: "",
  bonTripRef: "",

  vehicleStatus: 0,
  deliveryStatus: 0,
  progressStatus: 0,

  deliveryOrderId: "",
  deliveryOrderNo: "",
  deliveryDate: null,

  productId: "",
  productCode: "",
  productName: "",

  rspoCertificateNumber: "",
  rspoSccModel: 0,
  rspoUniqueNumber: "",

  isccCertificateNumber: "",
  isccSccModel: 0,
  isccUniqueNumber: "",
  isccGhgValue: 0,
  isccEeeValue: 0,

  ispoCertificateNumber: "",
  ispoSccModel: 0,
  ispoUniqueNumber: "",

  transporterCompanyId: "",
  transporterCompanyCode: "",
  transporterCompanyName: "",
  transporterCompanyShortName: "",

  driverId: "",
  driverNik: "",
  driverName: "",
  driverLicenseNo: "",

  transportVehicleId: "",
  transportVehiclePlateNo: "",
  transportVehicleProductCode: "",
  transportVehicleProductName: "",
  transportVehicleSccModel: 0,

  originSiteId: "",
  originSiteCode: "",
  originSiteName: "",

  originSourceStorageTankId: "",
  originSourceStorageTankCode: "",
  originSourceStorageTankName: "",

  destinationSiteId: "",
  destinationSiteCode: "",
  destinationSiteName: "",

  destinationSinkStorageTankId: "",
  destinationSinkStorageTankCode: "",
  destinationSinkStorageTankName: "",

  originFfaPercentage: 0,
  originMoistPercentage: 0,
  originDirtPercentage: 0,

  originWeighInKg: 0,
  originWeighInRemark: "",
  originWeighInOperatorName: "",
  originWeighInTimestamp: undefined,

  originWeighOutKg: 0,
  originWeighOutRemark: "",
  originWeighOutOperatorName: "",
  originWeighOutTimestamp: undefined,

  potonganWajib: 0,
  potonganLain: 0,

  destinationWeighInKg: 0,
  destinationWeighInRemark: "",
  destinationWeighInOperatorName: "",
  destinationWeighInTimestamp: undefined,

  destinationWeighOutKg: 0,
  destinationWeighOutRemark: "",
  destinationWeighOutOperatorName: "",
  destinationWeighOutTimestamp: undefined,

  returnWeighInKg: 0,
  returnWeighInRemark: "",
  returnWeighInOperatorName: "",
  returnWeighInTimestamp: undefined,

  returnWeighOutKg: 0,
  returnWeighOutRemark: "",
  returnWeighOutOperatorName: "",
  returnWeighOutTimestamp: undefined,

  currentSeal1: "",
  currentSeal2: "",
  currentSeal3: "",
  currentSeal4: "",

  loadedSeal1: "",
  loadedSeal2: "",
  loadedSeal3: "",
  loadedSeal4: "",
  loadingRemark: "",
  loadingOperatorName: "",
  loadingTimestamp: null,

  unloadedSeal1: "",
  unloadedSeal2: "",
  unloadedSeal3: "",
  unloadedSeal4: "",
  unloadingRemark: "",
  unloadingOperatorName: "",
  unloadingTimestamp: null,

  returnUnloadedSeal1: "",
  returnUnloadedSeal2: "",
  returnUnloadedSeal3: "",
  returnUnloadedSeal4: "",
  returnUnloadingRemark: "",
  returnUnloadingOperatorName: "",
  returnUnloadingTimestamp: null,

  dtTransaction: null,
};
