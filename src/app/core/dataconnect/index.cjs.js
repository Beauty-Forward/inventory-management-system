const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const BatchStatus = {
  DRAFT: "DRAFT",
  FINALIZED: "FINALIZED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
}
exports.BatchStatus = BatchStatus;

const ProductStatus = {
  IN_STOCK: "IN_STOCK",
  ALLOCATED: "ALLOCATED",
  SHIPPED: "SHIPPED",
  EXPIRED: "EXPIRED",
  DISCARDED: "DISCARDED",
}
exports.ProductStatus = ProductStatus;

const connectorConfig = {
  connector: 'bf-ims',
  service: 'beauty-forward-service',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createDonorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDonor', inputVars);
}
createDonorRef.operationName = 'CreateDonor';
exports.createDonorRef = createDonorRef;

exports.createDonor = function createDonor(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDonorRef(dcInstance, inputVars));
}
;

const updateDonorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDonor', inputVars);
}
updateDonorRef.operationName = 'UpdateDonor';
exports.updateDonorRef = updateDonorRef;

exports.updateDonor = function updateDonor(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateDonorRef(dcInstance, inputVars));
}
;

const incrementDonorDonationCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'IncrementDonorDonationCount', inputVars);
}
incrementDonorDonationCountRef.operationName = 'IncrementDonorDonationCount';
exports.incrementDonorDonationCountRef = incrementDonorDonationCountRef;

exports.incrementDonorDonationCount = function incrementDonorDonationCount(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(incrementDonorDonationCountRef(dcInstance, inputVars));
}
;

const createDonationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDonation', inputVars);
}
createDonationRef.operationName = 'CreateDonation';
exports.createDonationRef = createDonationRef;

exports.createDonation = function createDonation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDonationRef(dcInstance, inputVars));
}
;

const updateDonationLogisticsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDonationLogistics', inputVars);
}
updateDonationLogisticsRef.operationName = 'UpdateDonationLogistics';
exports.updateDonationLogisticsRef = updateDonationLogisticsRef;

exports.updateDonationLogistics = function updateDonationLogistics(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateDonationLogisticsRef(dcInstance, inputVars));
}
;

const createProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProduct', inputVars);
}
createProductRef.operationName = 'CreateProduct';
exports.createProductRef = createProductRef;

exports.createProduct = function createProduct(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProductRef(dcInstance, inputVars));
}
;

const allocateProductToBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AllocateProductToBatch', inputVars);
}
allocateProductToBatchRef.operationName = 'AllocateProductToBatch';
exports.allocateProductToBatchRef = allocateProductToBatchRef;

exports.allocateProductToBatch = function allocateProductToBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(allocateProductToBatchRef(dcInstance, inputVars));
}
;

const unallocateProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UnallocateProduct', inputVars);
}
unallocateProductRef.operationName = 'UnallocateProduct';
exports.unallocateProductRef = unallocateProductRef;

exports.unallocateProduct = function unallocateProduct(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(unallocateProductRef(dcInstance, inputVars));
}
;

const markBatchProductsShippedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkBatchProductsShipped', inputVars);
}
markBatchProductsShippedRef.operationName = 'MarkBatchProductsShipped';
exports.markBatchProductsShippedRef = markBatchProductsShippedRef;

exports.markBatchProductsShipped = function markBatchProductsShipped(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markBatchProductsShippedRef(dcInstance, inputVars));
}
;

const markProductExpiredRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkProductExpired', inputVars);
}
markProductExpiredRef.operationName = 'MarkProductExpired';
exports.markProductExpiredRef = markProductExpiredRef;

exports.markProductExpired = function markProductExpired(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markProductExpiredRef(dcInstance, inputVars));
}
;

const markProductDiscardedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkProductDiscarded', inputVars);
}
markProductDiscardedRef.operationName = 'MarkProductDiscarded';
exports.markProductDiscardedRef = markProductDiscardedRef;

exports.markProductDiscarded = function markProductDiscarded(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markProductDiscardedRef(dcInstance, inputVars));
}
;

const createShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateShelter', inputVars);
}
createShelterRef.operationName = 'CreateShelter';
exports.createShelterRef = createShelterRef;

exports.createShelter = function createShelter(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createShelterRef(dcInstance, inputVars));
}
;

const updateShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateShelter', inputVars);
}
updateShelterRef.operationName = 'UpdateShelter';
exports.updateShelterRef = updateShelterRef;

exports.updateShelter = function updateShelter(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateShelterRef(dcInstance, inputVars));
}
;

const deactivateShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeactivateShelter', inputVars);
}
deactivateShelterRef.operationName = 'DeactivateShelter';
exports.deactivateShelterRef = deactivateShelterRef;

exports.deactivateShelter = function deactivateShelter(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deactivateShelterRef(dcInstance, inputVars));
}
;

const reactivateShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ReactivateShelter', inputVars);
}
reactivateShelterRef.operationName = 'ReactivateShelter';
exports.reactivateShelterRef = reactivateShelterRef;

exports.reactivateShelter = function reactivateShelter(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(reactivateShelterRef(dcInstance, inputVars));
}
;

const createBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBatch', inputVars);
}
createBatchRef.operationName = 'CreateBatch';
exports.createBatchRef = createBatchRef;

exports.createBatch = function createBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createBatchRef(dcInstance, inputVars));
}
;

const finalizeBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'FinalizeBatch', inputVars);
}
finalizeBatchRef.operationName = 'FinalizeBatch';
exports.finalizeBatchRef = finalizeBatchRef;

exports.finalizeBatch = function finalizeBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(finalizeBatchRef(dcInstance, inputVars));
}
;

const shipBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ShipBatch', inputVars);
}
shipBatchRef.operationName = 'ShipBatch';
exports.shipBatchRef = shipBatchRef;

exports.shipBatch = function shipBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(shipBatchRef(dcInstance, inputVars));
}
;

const deliverBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeliverBatch', inputVars);
}
deliverBatchRef.operationName = 'DeliverBatch';
exports.deliverBatchRef = deliverBatchRef;

exports.deliverBatch = function deliverBatch(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deliverBatchRef(dcInstance, inputVars));
}
;

const updateBatchNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBatchNotes', inputVars);
}
updateBatchNotesRef.operationName = 'UpdateBatchNotes';
exports.updateBatchNotesRef = updateBatchNotesRef;

exports.updateBatchNotes = function updateBatchNotes(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateBatchNotesRef(dcInstance, inputVars));
}
;

const upsertCatalogEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCatalogEntry', inputVars);
}
upsertCatalogEntryRef.operationName = 'UpsertCatalogEntry';
exports.upsertCatalogEntryRef = upsertCatalogEntryRef;

exports.upsertCatalogEntry = function upsertCatalogEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCatalogEntryRef(dcInstance, inputVars));
}
;

const incrementCatalogUsageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'IncrementCatalogUsage', inputVars);
}
incrementCatalogUsageRef.operationName = 'IncrementCatalogUsage';
exports.incrementCatalogUsageRef = incrementCatalogUsageRef;

exports.incrementCatalogUsage = function incrementCatalogUsage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(incrementCatalogUsageRef(dcInstance, inputVars));
}
;

const getDonorByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDonorByEmail', inputVars);
}
getDonorByEmailRef.operationName = 'GetDonorByEmail';
exports.getDonorByEmailRef = getDonorByEmailRef;

exports.getDonorByEmail = function getDonorByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDonorByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getDonorRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDonor', inputVars);
}
getDonorRef.operationName = 'GetDonor';
exports.getDonorRef = getDonorRef;

exports.getDonor = function getDonor(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDonorRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listRecentDonationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListRecentDonations', inputVars);
}
listRecentDonationsRef.operationName = 'ListRecentDonations';
exports.listRecentDonationsRef = listRecentDonationsRef;

exports.listRecentDonations = function listRecentDonations(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listRecentDonationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getDonationByRequestIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDonationByRequestId', inputVars);
}
getDonationByRequestIdRef.operationName = 'GetDonationByRequestId';
exports.getDonationByRequestIdRef = getDonationByRequestIdRef;

exports.getDonationByRequestId = function getDonationByRequestId(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDonationByRequestIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getDonationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDonation', inputVars);
}
getDonationRef.operationName = 'GetDonation';
exports.getDonationRef = getDonationRef;

exports.getDonation = function getDonation(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDonationRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listSheltersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListShelters', inputVars);
}
listSheltersRef.operationName = 'ListShelters';
exports.listSheltersRef = listSheltersRef;

exports.listShelters = function listShelters(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listSheltersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listAllSheltersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllShelters');
}
listAllSheltersRef.operationName = 'ListAllShelters';
exports.listAllSheltersRef = listAllSheltersRef;

exports.listAllShelters = function listAllShelters(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllSheltersRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetShelter', inputVars);
}
getShelterRef.operationName = 'GetShelter';
exports.getShelterRef = getShelterRef;

exports.getShelter = function getShelter(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getShelterRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listInventoryInStockRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInventoryInStock', inputVars);
}
listInventoryInStockRef.operationName = 'ListInventoryInStock';
exports.listInventoryInStockRef = listInventoryInStockRef;

exports.listInventoryInStock = function listInventoryInStock(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listInventoryInStockRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getProductRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProduct', inputVars);
}
getProductRef.operationName = 'GetProduct';
exports.getProductRef = getProductRef;

exports.getProduct = function getProduct(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getProductRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listAvailableProductsForShelterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableProductsForShelter', inputVars);
}
listAvailableProductsForShelterRef.operationName = 'ListAvailableProductsForShelter';
exports.listAvailableProductsForShelterRef = listAvailableProductsForShelterRef;

exports.listAvailableProductsForShelter = function listAvailableProductsForShelter(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listAvailableProductsForShelterRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listProductsInBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProductsInBatch', inputVars);
}
listProductsInBatchRef.operationName = 'ListProductsInBatch';
exports.listProductsInBatchRef = listProductsInBatchRef;

exports.listProductsInBatch = function listProductsInBatch(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listProductsInBatchRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listExpiringSoonRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListExpiringSoon', inputVars);
}
listExpiringSoonRef.operationName = 'ListExpiringSoon';
exports.listExpiringSoonRef = listExpiringSoonRef;

exports.listExpiringSoon = function listExpiringSoon(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listExpiringSoonRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listBatchesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBatches', inputVars);
}
listBatchesRef.operationName = 'ListBatches';
exports.listBatchesRef = listBatchesRef;

exports.listBatches = function listBatches(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listBatchesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listAllBatchesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllBatches');
}
listAllBatchesRef.operationName = 'ListAllBatches';
exports.listAllBatchesRef = listAllBatchesRef;

exports.listAllBatches = function listAllBatches(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllBatchesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBatch', inputVars);
}
getBatchRef.operationName = 'GetBatch';
exports.getBatchRef = getBatchRef;

exports.getBatch = function getBatch(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getBatchRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const dashboardInStockCountRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DashboardInStockCount');
}
dashboardInStockCountRef.operationName = 'DashboardInStockCount';
exports.dashboardInStockCountRef = dashboardInStockCountRef;

exports.dashboardInStockCount = function dashboardInStockCount(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(dashboardInStockCountRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const dashboardStatsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'DashboardStats');
}
dashboardStatsRef.operationName = 'DashboardStats';
exports.dashboardStatsRef = dashboardStatsRef;

exports.dashboardStats = function dashboardStats(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(dashboardStatsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getCatalogByBarcodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCatalogByBarcode', inputVars);
}
getCatalogByBarcodeRef.operationName = 'GetCatalogByBarcode';
exports.getCatalogByBarcodeRef = getCatalogByBarcodeRef;

exports.getCatalogByBarcode = function getCatalogByBarcode(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCatalogByBarcodeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
