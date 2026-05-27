import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const BatchStatus = {
  DRAFT: "DRAFT",
  FINALIZED: "FINALIZED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
}

export const ProductStatus = {
  IN_STOCK: "IN_STOCK",
  ALLOCATED: "ALLOCATED",
  SHIPPED: "SHIPPED",
  EXPIRED: "EXPIRED",
  DISCARDED: "DISCARDED",
}

export const connectorConfig = {
  connector: 'bf-ims',
  service: 'beauty-forward-service',
  location: 'us-central1'
};
export const createDonorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDonor', inputVars);
}
createDonorRef.operationName = 'CreateDonor';

export function createDonor(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDonorRef(dcInstance, inputVars));
}

export const updateDonorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDonor', inputVars);
}
updateDonorRef.operationName = 'UpdateDonor';

export function updateDonor(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateDonorRef(dcInstance, inputVars));
}

export const incrementDonorDonationCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'IncrementDonorDonationCount', inputVars);
}
incrementDonorDonationCountRef.operationName = 'IncrementDonorDonationCount';

export function incrementDonorDonationCount(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(incrementDonorDonationCountRef(dcInstance, inputVars));
}

export const createDonationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDonation', inputVars);
}
createDonationRef.operationName = 'CreateDonation';

export function createDonation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDonationRef(dcInstance, inputVars));
}

export const updateDonationLogisticsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDonationLogistics', inputVars);
}
updateDonationLogisticsRef.operationName = 'UpdateDonationLogistics';

export function updateDonationLogistics(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateDonationLogisticsRef(dcInstance, inputVars));
}

export const createProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProduct', inputVars);
}
createProductRef.operationName = 'CreateProduct';

export function createProduct(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProductRef(dcInstance, inputVars));
}

export const allocateProductToBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AllocateProductToBatch', inputVars);
}
allocateProductToBatchRef.operationName = 'AllocateProductToBatch';

export function allocateProductToBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(allocateProductToBatchRef(dcInstance, inputVars));
}

export const unallocateProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UnallocateProduct', inputVars);
}
unallocateProductRef.operationName = 'UnallocateProduct';

export function unallocateProduct(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(unallocateProductRef(dcInstance, inputVars));
}

export const markBatchProductsShippedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkBatchProductsShipped', inputVars);
}
markBatchProductsShippedRef.operationName = 'MarkBatchProductsShipped';

export function markBatchProductsShipped(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markBatchProductsShippedRef(dcInstance, inputVars));
}

export const markProductExpiredRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkProductExpired', inputVars);
}
markProductExpiredRef.operationName = 'MarkProductExpired';

export function markProductExpired(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markProductExpiredRef(dcInstance, inputVars));
}

export const markProductDiscardedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkProductDiscarded', inputVars);
}
markProductDiscardedRef.operationName = 'MarkProductDiscarded';

export function markProductDiscarded(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markProductDiscardedRef(dcInstance, inputVars));
}

export const createShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateShelter', inputVars);
}
createShelterRef.operationName = 'CreateShelter';

export function createShelter(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createShelterRef(dcInstance, inputVars));
}

export const updateShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateShelter', inputVars);
}
updateShelterRef.operationName = 'UpdateShelter';

export function updateShelter(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateShelterRef(dcInstance, inputVars));
}

export const deactivateShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeactivateShelter', inputVars);
}
deactivateShelterRef.operationName = 'DeactivateShelter';

export function deactivateShelter(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deactivateShelterRef(dcInstance, inputVars));
}

export const reactivateShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReactivateShelter', inputVars);
}
reactivateShelterRef.operationName = 'ReactivateShelter';

export function reactivateShelter(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reactivateShelterRef(dcInstance, inputVars));
}

export const createBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBatch', inputVars);
}
createBatchRef.operationName = 'CreateBatch';

export function createBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createBatchRef(dcInstance, inputVars));
}

export const finalizeBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'FinalizeBatch', inputVars);
}
finalizeBatchRef.operationName = 'FinalizeBatch';

export function finalizeBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(finalizeBatchRef(dcInstance, inputVars));
}

export const shipBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ShipBatch', inputVars);
}
shipBatchRef.operationName = 'ShipBatch';

export function shipBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(shipBatchRef(dcInstance, inputVars));
}

export const deliverBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeliverBatch', inputVars);
}
deliverBatchRef.operationName = 'DeliverBatch';

export function deliverBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deliverBatchRef(dcInstance, inputVars));
}

export const updateBatchNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBatchNotes', inputVars);
}
updateBatchNotesRef.operationName = 'UpdateBatchNotes';

export function updateBatchNotes(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateBatchNotesRef(dcInstance, inputVars));
}

export const upsertCatalogEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCatalogEntry', inputVars);
}
upsertCatalogEntryRef.operationName = 'UpsertCatalogEntry';

export function upsertCatalogEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCatalogEntryRef(dcInstance, inputVars));
}

export const incrementCatalogUsageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'IncrementCatalogUsage', inputVars);
}
incrementCatalogUsageRef.operationName = 'IncrementCatalogUsage';

export function incrementCatalogUsage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(incrementCatalogUsageRef(dcInstance, inputVars));
}

export const getDonorByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDonorByEmail', inputVars);
}
getDonorByEmailRef.operationName = 'GetDonorByEmail';

export function getDonorByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDonorByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getDonorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDonor', inputVars);
}
getDonorRef.operationName = 'GetDonor';

export function getDonor(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDonorRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listRecentDonationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListRecentDonations', inputVars);
}
listRecentDonationsRef.operationName = 'ListRecentDonations';

export function listRecentDonations(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listRecentDonationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getDonationByRequestIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDonationByRequestId', inputVars);
}
getDonationByRequestIdRef.operationName = 'GetDonationByRequestId';

export function getDonationByRequestId(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDonationByRequestIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getDonationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDonation', inputVars);
}
getDonationRef.operationName = 'GetDonation';

export function getDonation(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDonationRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listSheltersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListShelters', inputVars);
}
listSheltersRef.operationName = 'ListShelters';

export function listShelters(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listSheltersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listAllSheltersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllShelters');
}
listAllSheltersRef.operationName = 'ListAllShelters';

export function listAllShelters(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllSheltersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetShelter', inputVars);
}
getShelterRef.operationName = 'GetShelter';

export function getShelter(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getShelterRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listInventoryInStockRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInventoryInStock', inputVars);
}
listInventoryInStockRef.operationName = 'ListInventoryInStock';

export function listInventoryInStock(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listInventoryInStockRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProduct', inputVars);
}
getProductRef.operationName = 'GetProduct';

export function getProduct(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getProductRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listAvailableProductsForShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableProductsForShelter', inputVars);
}
listAvailableProductsForShelterRef.operationName = 'ListAvailableProductsForShelter';

export function listAvailableProductsForShelter(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listAvailableProductsForShelterRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listProductsInBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProductsInBatch', inputVars);
}
listProductsInBatchRef.operationName = 'ListProductsInBatch';

export function listProductsInBatch(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listProductsInBatchRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listExpiringSoonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListExpiringSoon', inputVars);
}
listExpiringSoonRef.operationName = 'ListExpiringSoon';

export function listExpiringSoon(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listExpiringSoonRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listBatchesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBatches', inputVars);
}
listBatchesRef.operationName = 'ListBatches';

export function listBatches(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listBatchesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listAllBatchesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllBatches');
}
listAllBatchesRef.operationName = 'ListAllBatches';

export function listAllBatches(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllBatchesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBatch', inputVars);
}
getBatchRef.operationName = 'GetBatch';

export function getBatch(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getBatchRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const dashboardInStockCountRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DashboardInStockCount');
}
dashboardInStockCountRef.operationName = 'DashboardInStockCount';

export function dashboardInStockCount(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(dashboardInStockCountRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const dashboardStatsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DashboardStats');
}
dashboardStatsRef.operationName = 'DashboardStats';

export function dashboardStats(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(dashboardStatsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getCatalogByBarcodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCatalogByBarcode', inputVars);
}
getCatalogByBarcodeRef.operationName = 'GetCatalogByBarcode';

export function getCatalogByBarcode(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCatalogByBarcodeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

