# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createDonor, updateDonor, incrementDonorDonationCount, createDonation, createProduct, allocateProductToBatch, unallocateProduct, markBatchProductsShipped, markProductExpired, markProductDiscarded } from '@bf-ims/dataconnect';


// Operation CreateDonor:  For variables, look at type CreateDonorVars in ../index.d.ts
const { data } = await CreateDonor(dataConnect, createDonorVars);

// Operation UpdateDonor:  For variables, look at type UpdateDonorVars in ../index.d.ts
const { data } = await UpdateDonor(dataConnect, updateDonorVars);

// Operation IncrementDonorDonationCount:  For variables, look at type IncrementDonorDonationCountVars in ../index.d.ts
const { data } = await IncrementDonorDonationCount(dataConnect, incrementDonorDonationCountVars);

// Operation CreateDonation:  For variables, look at type CreateDonationVars in ../index.d.ts
const { data } = await CreateDonation(dataConnect, createDonationVars);

// Operation CreateProduct:  For variables, look at type CreateProductVars in ../index.d.ts
const { data } = await CreateProduct(dataConnect, createProductVars);

// Operation AllocateProductToBatch:  For variables, look at type AllocateProductToBatchVars in ../index.d.ts
const { data } = await AllocateProductToBatch(dataConnect, allocateProductToBatchVars);

// Operation UnallocateProduct:  For variables, look at type UnallocateProductVars in ../index.d.ts
const { data } = await UnallocateProduct(dataConnect, unallocateProductVars);

// Operation MarkBatchProductsShipped:  For variables, look at type MarkBatchProductsShippedVars in ../index.d.ts
const { data } = await MarkBatchProductsShipped(dataConnect, markBatchProductsShippedVars);

// Operation MarkProductExpired:  For variables, look at type MarkProductExpiredVars in ../index.d.ts
const { data } = await MarkProductExpired(dataConnect, markProductExpiredVars);

// Operation MarkProductDiscarded:  For variables, look at type MarkProductDiscardedVars in ../index.d.ts
const { data } = await MarkProductDiscarded(dataConnect, markProductDiscardedVars);


```