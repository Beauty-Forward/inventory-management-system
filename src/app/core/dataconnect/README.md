# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `bf-ims`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetDonorByEmail*](#getdonorbyemail)
  - [*GetDonor*](#getdonor)
  - [*ListRecentDonations*](#listrecentdonations)
  - [*GetDonation*](#getdonation)
  - [*ListShelters*](#listshelters)
  - [*ListAllShelters*](#listallshelters)
  - [*GetShelter*](#getshelter)
  - [*ListInventoryInStock*](#listinventoryinstock)
  - [*GetProduct*](#getproduct)
  - [*ListAvailableProductsForShelter*](#listavailableproductsforshelter)
  - [*ListProductsInBatch*](#listproductsinbatch)
  - [*ListExpiringSoon*](#listexpiringsoon)
  - [*ListBatches*](#listbatches)
  - [*ListAllBatches*](#listallbatches)
  - [*GetBatch*](#getbatch)
  - [*DashboardInStockCount*](#dashboardinstockcount)
  - [*DashboardStats*](#dashboardstats)
  - [*GetCatalogByBarcode*](#getcatalogbybarcode)
- [**Mutations**](#mutations)
  - [*CreateDonor*](#createdonor)
  - [*UpdateDonor*](#updatedonor)
  - [*IncrementDonorDonationCount*](#incrementdonordonationcount)
  - [*CreateDonation*](#createdonation)
  - [*CreateProduct*](#createproduct)
  - [*AllocateProductToBatch*](#allocateproducttobatch)
  - [*UnallocateProduct*](#unallocateproduct)
  - [*MarkBatchProductsShipped*](#markbatchproductsshipped)
  - [*MarkProductExpired*](#markproductexpired)
  - [*MarkProductDiscarded*](#markproductdiscarded)
  - [*CreateShelter*](#createshelter)
  - [*UpdateShelter*](#updateshelter)
  - [*DeactivateShelter*](#deactivateshelter)
  - [*ReactivateShelter*](#reactivateshelter)
  - [*CreateBatch*](#createbatch)
  - [*FinalizeBatch*](#finalizebatch)
  - [*ShipBatch*](#shipbatch)
  - [*DeliverBatch*](#deliverbatch)
  - [*UpdateBatchNotes*](#updatebatchnotes)
  - [*UpsertCatalogEntry*](#upsertcatalogentry)
  - [*IncrementCatalogUsage*](#incrementcatalogusage)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `bf-ims`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@bf-ims/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@bf-ims/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@bf-ims/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `bf-ims` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetDonorByEmail
You can execute the `GetDonorByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getDonorByEmail(vars: GetDonorByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonorByEmailData, GetDonorByEmailVariables>;

interface GetDonorByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDonorByEmailVariables): QueryRef<GetDonorByEmailData, GetDonorByEmailVariables>;
}
export const getDonorByEmailRef: GetDonorByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDonorByEmail(dc: DataConnect, vars: GetDonorByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonorByEmailData, GetDonorByEmailVariables>;

interface GetDonorByEmailRef {
  ...
  (dc: DataConnect, vars: GetDonorByEmailVariables): QueryRef<GetDonorByEmailData, GetDonorByEmailVariables>;
}
export const getDonorByEmailRef: GetDonorByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDonorByEmailRef:
```typescript
const name = getDonorByEmailRef.operationName;
console.log(name);
```

### Variables
The `GetDonorByEmail` query requires an argument of type `GetDonorByEmailVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDonorByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetDonorByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDonorByEmailData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDonorByEmailData {
  donors: ({
    id: UUIDString;
    fullName: string;
    email: string;
    phone: string;
    smsOptIn: boolean;
    city: string;
    state: string;
    instagramHandle?: string | null;
    donationCount: number;
  } & Donor_Key)[];
}
```
### Using `GetDonorByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDonorByEmail, GetDonorByEmailVariables } from '@bf-ims/dataconnect';

// The `GetDonorByEmail` query requires an argument of type `GetDonorByEmailVariables`:
const getDonorByEmailVars: GetDonorByEmailVariables = {
  email: ..., 
};

// Call the `getDonorByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDonorByEmail(getDonorByEmailVars);
// Variables can be defined inline as well.
const { data } = await getDonorByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDonorByEmail(dataConnect, getDonorByEmailVars);

console.log(data.donors);

// Or, you can use the `Promise` API.
getDonorByEmail(getDonorByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.donors);
});
```

### Using `GetDonorByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDonorByEmailRef, GetDonorByEmailVariables } from '@bf-ims/dataconnect';

// The `GetDonorByEmail` query requires an argument of type `GetDonorByEmailVariables`:
const getDonorByEmailVars: GetDonorByEmailVariables = {
  email: ..., 
};

// Call the `getDonorByEmailRef()` function to get a reference to the query.
const ref = getDonorByEmailRef(getDonorByEmailVars);
// Variables can be defined inline as well.
const ref = getDonorByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDonorByEmailRef(dataConnect, getDonorByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.donors);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.donors);
});
```

## GetDonor
You can execute the `GetDonor` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getDonor(vars: GetDonorVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonorData, GetDonorVariables>;

interface GetDonorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDonorVariables): QueryRef<GetDonorData, GetDonorVariables>;
}
export const getDonorRef: GetDonorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDonor(dc: DataConnect, vars: GetDonorVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonorData, GetDonorVariables>;

interface GetDonorRef {
  ...
  (dc: DataConnect, vars: GetDonorVariables): QueryRef<GetDonorData, GetDonorVariables>;
}
export const getDonorRef: GetDonorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDonorRef:
```typescript
const name = getDonorRef.operationName;
console.log(name);
```

### Variables
The `GetDonor` query requires an argument of type `GetDonorVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDonorVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetDonor` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDonorData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDonorData {
  donor?: {
    id: UUIDString;
    fullName: string;
    email: string;
    phone: string;
    smsOptIn: boolean;
    city: string;
    state: string;
    instagramHandle?: string | null;
    linkedRequestId?: string | null;
    donationCount: number;
    createdAt: TimestampString;
  } & Donor_Key;
}
```
### Using `GetDonor`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDonor, GetDonorVariables } from '@bf-ims/dataconnect';

// The `GetDonor` query requires an argument of type `GetDonorVariables`:
const getDonorVars: GetDonorVariables = {
  id: ..., 
};

// Call the `getDonor()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDonor(getDonorVars);
// Variables can be defined inline as well.
const { data } = await getDonor({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDonor(dataConnect, getDonorVars);

console.log(data.donor);

// Or, you can use the `Promise` API.
getDonor(getDonorVars).then((response) => {
  const data = response.data;
  console.log(data.donor);
});
```

### Using `GetDonor`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDonorRef, GetDonorVariables } from '@bf-ims/dataconnect';

// The `GetDonor` query requires an argument of type `GetDonorVariables`:
const getDonorVars: GetDonorVariables = {
  id: ..., 
};

// Call the `getDonorRef()` function to get a reference to the query.
const ref = getDonorRef(getDonorVars);
// Variables can be defined inline as well.
const ref = getDonorRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDonorRef(dataConnect, getDonorVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.donor);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.donor);
});
```

## ListRecentDonations
You can execute the `ListRecentDonations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listRecentDonations(vars?: ListRecentDonationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListRecentDonationsData, ListRecentDonationsVariables>;

interface ListRecentDonationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListRecentDonationsVariables): QueryRef<ListRecentDonationsData, ListRecentDonationsVariables>;
}
export const listRecentDonationsRef: ListRecentDonationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listRecentDonations(dc: DataConnect, vars?: ListRecentDonationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListRecentDonationsData, ListRecentDonationsVariables>;

interface ListRecentDonationsRef {
  ...
  (dc: DataConnect, vars?: ListRecentDonationsVariables): QueryRef<ListRecentDonationsData, ListRecentDonationsVariables>;
}
export const listRecentDonationsRef: ListRecentDonationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listRecentDonationsRef:
```typescript
const name = listRecentDonationsRef.operationName;
console.log(name);
```

### Variables
The `ListRecentDonations` query has an optional argument of type `ListRecentDonationsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListRecentDonationsVariables {
  limit?: number | null;
}
```
### Return Type
Recall that executing the `ListRecentDonations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListRecentDonationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListRecentDonationsData {
  donations: ({
    id: UUIDString;
    date: DateString;
    method: string;
    notes?: string | null;
    createdAt: TimestampString;
    donor: {
      id: UUIDString;
      fullName: string;
      email: string;
    } & Donor_Key;
  } & Donation_Key)[];
}
```
### Using `ListRecentDonations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listRecentDonations, ListRecentDonationsVariables } from '@bf-ims/dataconnect';

// The `ListRecentDonations` query has an optional argument of type `ListRecentDonationsVariables`:
const listRecentDonationsVars: ListRecentDonationsVariables = {
  limit: ..., // optional
};

// Call the `listRecentDonations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listRecentDonations(listRecentDonationsVars);
// Variables can be defined inline as well.
const { data } = await listRecentDonations({ limit: ..., });
// Since all variables are optional for this query, you can omit the `ListRecentDonationsVariables` argument.
const { data } = await listRecentDonations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listRecentDonations(dataConnect, listRecentDonationsVars);

console.log(data.donations);

// Or, you can use the `Promise` API.
listRecentDonations(listRecentDonationsVars).then((response) => {
  const data = response.data;
  console.log(data.donations);
});
```

### Using `ListRecentDonations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listRecentDonationsRef, ListRecentDonationsVariables } from '@bf-ims/dataconnect';

// The `ListRecentDonations` query has an optional argument of type `ListRecentDonationsVariables`:
const listRecentDonationsVars: ListRecentDonationsVariables = {
  limit: ..., // optional
};

// Call the `listRecentDonationsRef()` function to get a reference to the query.
const ref = listRecentDonationsRef(listRecentDonationsVars);
// Variables can be defined inline as well.
const ref = listRecentDonationsRef({ limit: ..., });
// Since all variables are optional for this query, you can omit the `ListRecentDonationsVariables` argument.
const ref = listRecentDonationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listRecentDonationsRef(dataConnect, listRecentDonationsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.donations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.donations);
});
```

## GetDonation
You can execute the `GetDonation` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getDonation(vars: GetDonationVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonationData, GetDonationVariables>;

interface GetDonationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDonationVariables): QueryRef<GetDonationData, GetDonationVariables>;
}
export const getDonationRef: GetDonationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDonation(dc: DataConnect, vars: GetDonationVariables, options?: ExecuteQueryOptions): QueryPromise<GetDonationData, GetDonationVariables>;

interface GetDonationRef {
  ...
  (dc: DataConnect, vars: GetDonationVariables): QueryRef<GetDonationData, GetDonationVariables>;
}
export const getDonationRef: GetDonationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDonationRef:
```typescript
const name = getDonationRef.operationName;
console.log(name);
```

### Variables
The `GetDonation` query requires an argument of type `GetDonationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDonationVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetDonation` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDonationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDonationData {
  donation?: {
    id: UUIDString;
    donationRequestId?: string | null;
    warehouseReference: string;
    date: DateString;
    method: string;
    notes?: string | null;
    processedBy: string;
    createdAt: TimestampString;
    donor: {
      id: UUIDString;
      fullName: string;
      email: string;
      phone: string;
      city: string;
      state: string;
    } & Donor_Key;
      products: ({
        id: UUIDString;
        name: string;
        brand: string;
        type: string;
        quantity: number;
        status: ProductStatus;
        expirationDate?: DateString | null;
      } & Product_Key)[];
  } & Donation_Key;
}
```
### Using `GetDonation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDonation, GetDonationVariables } from '@bf-ims/dataconnect';

// The `GetDonation` query requires an argument of type `GetDonationVariables`:
const getDonationVars: GetDonationVariables = {
  id: ..., 
};

// Call the `getDonation()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDonation(getDonationVars);
// Variables can be defined inline as well.
const { data } = await getDonation({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDonation(dataConnect, getDonationVars);

console.log(data.donation);

// Or, you can use the `Promise` API.
getDonation(getDonationVars).then((response) => {
  const data = response.data;
  console.log(data.donation);
});
```

### Using `GetDonation`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDonationRef, GetDonationVariables } from '@bf-ims/dataconnect';

// The `GetDonation` query requires an argument of type `GetDonationVariables`:
const getDonationVars: GetDonationVariables = {
  id: ..., 
};

// Call the `getDonationRef()` function to get a reference to the query.
const ref = getDonationRef(getDonationVars);
// Variables can be defined inline as well.
const ref = getDonationRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDonationRef(dataConnect, getDonationVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.donation);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.donation);
});
```

## ListShelters
You can execute the `ListShelters` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listShelters(vars?: ListSheltersVariables, options?: ExecuteQueryOptions): QueryPromise<ListSheltersData, ListSheltersVariables>;

interface ListSheltersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListSheltersVariables): QueryRef<ListSheltersData, ListSheltersVariables>;
}
export const listSheltersRef: ListSheltersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listShelters(dc: DataConnect, vars?: ListSheltersVariables, options?: ExecuteQueryOptions): QueryPromise<ListSheltersData, ListSheltersVariables>;

interface ListSheltersRef {
  ...
  (dc: DataConnect, vars?: ListSheltersVariables): QueryRef<ListSheltersData, ListSheltersVariables>;
}
export const listSheltersRef: ListSheltersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSheltersRef:
```typescript
const name = listSheltersRef.operationName;
console.log(name);
```

### Variables
The `ListShelters` query has an optional argument of type `ListSheltersVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListSheltersVariables {
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `ListShelters` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSheltersData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListSheltersData {
  shelters: ({
    id: UUIDString;
    name: string;
    city: string;
    state: string;
    contactName: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    acceptedTypes?: string[] | null;
    rejectedTypes?: string[] | null;
    isActive: boolean;
  } & Shelter_Key)[];
}
```
### Using `ListShelters`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listShelters, ListSheltersVariables } from '@bf-ims/dataconnect';

// The `ListShelters` query has an optional argument of type `ListSheltersVariables`:
const listSheltersVars: ListSheltersVariables = {
  isActive: ..., // optional
};

// Call the `listShelters()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listShelters(listSheltersVars);
// Variables can be defined inline as well.
const { data } = await listShelters({ isActive: ..., });
// Since all variables are optional for this query, you can omit the `ListSheltersVariables` argument.
const { data } = await listShelters();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listShelters(dataConnect, listSheltersVars);

console.log(data.shelters);

// Or, you can use the `Promise` API.
listShelters(listSheltersVars).then((response) => {
  const data = response.data;
  console.log(data.shelters);
});
```

### Using `ListShelters`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSheltersRef, ListSheltersVariables } from '@bf-ims/dataconnect';

// The `ListShelters` query has an optional argument of type `ListSheltersVariables`:
const listSheltersVars: ListSheltersVariables = {
  isActive: ..., // optional
};

// Call the `listSheltersRef()` function to get a reference to the query.
const ref = listSheltersRef(listSheltersVars);
// Variables can be defined inline as well.
const ref = listSheltersRef({ isActive: ..., });
// Since all variables are optional for this query, you can omit the `ListSheltersVariables` argument.
const ref = listSheltersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSheltersRef(dataConnect, listSheltersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.shelters);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.shelters);
});
```

## ListAllShelters
You can execute the `ListAllShelters` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listAllShelters(options?: ExecuteQueryOptions): QueryPromise<ListAllSheltersData, undefined>;

interface ListAllSheltersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllSheltersData, undefined>;
}
export const listAllSheltersRef: ListAllSheltersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllShelters(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllSheltersData, undefined>;

interface ListAllSheltersRef {
  ...
  (dc: DataConnect): QueryRef<ListAllSheltersData, undefined>;
}
export const listAllSheltersRef: ListAllSheltersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllSheltersRef:
```typescript
const name = listAllSheltersRef.operationName;
console.log(name);
```

### Variables
The `ListAllShelters` query has no variables.
### Return Type
Recall that executing the `ListAllShelters` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllSheltersData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllSheltersData {
  shelters: ({
    id: UUIDString;
    name: string;
    city: string;
    state: string;
    contactName: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    acceptedTypes?: string[] | null;
    rejectedTypes?: string[] | null;
    isActive: boolean;
  } & Shelter_Key)[];
}
```
### Using `ListAllShelters`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllShelters } from '@bf-ims/dataconnect';


// Call the `listAllShelters()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllShelters();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllShelters(dataConnect);

console.log(data.shelters);

// Or, you can use the `Promise` API.
listAllShelters().then((response) => {
  const data = response.data;
  console.log(data.shelters);
});
```

### Using `ListAllShelters`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllSheltersRef } from '@bf-ims/dataconnect';


// Call the `listAllSheltersRef()` function to get a reference to the query.
const ref = listAllSheltersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllSheltersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.shelters);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.shelters);
});
```

## GetShelter
You can execute the `GetShelter` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getShelter(vars: GetShelterVariables, options?: ExecuteQueryOptions): QueryPromise<GetShelterData, GetShelterVariables>;

interface GetShelterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetShelterVariables): QueryRef<GetShelterData, GetShelterVariables>;
}
export const getShelterRef: GetShelterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getShelter(dc: DataConnect, vars: GetShelterVariables, options?: ExecuteQueryOptions): QueryPromise<GetShelterData, GetShelterVariables>;

interface GetShelterRef {
  ...
  (dc: DataConnect, vars: GetShelterVariables): QueryRef<GetShelterData, GetShelterVariables>;
}
export const getShelterRef: GetShelterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getShelterRef:
```typescript
const name = getShelterRef.operationName;
console.log(name);
```

### Variables
The `GetShelter` query requires an argument of type `GetShelterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetShelterVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetShelter` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetShelterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetShelterData {
  shelter?: {
    id: UUIDString;
    name: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    contactName: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    acceptedTypes?: string[] | null;
    rejectedTypes?: string[] | null;
    preferredBrands?: string[] | null;
    notes?: string | null;
    capacityPerBatch?: number | null;
    isActive: boolean;
    createdAt: TimestampString;
    batches: ({
      id: UUIDString;
      status: BatchStatus;
      createdAt: TimestampString;
      finalizedAt?: TimestampString | null;
      shippedAt?: TimestampString | null;
    } & Batch_Key)[];
  } & Shelter_Key;
}
```
### Using `GetShelter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getShelter, GetShelterVariables } from '@bf-ims/dataconnect';

// The `GetShelter` query requires an argument of type `GetShelterVariables`:
const getShelterVars: GetShelterVariables = {
  id: ..., 
};

// Call the `getShelter()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getShelter(getShelterVars);
// Variables can be defined inline as well.
const { data } = await getShelter({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getShelter(dataConnect, getShelterVars);

console.log(data.shelter);

// Or, you can use the `Promise` API.
getShelter(getShelterVars).then((response) => {
  const data = response.data;
  console.log(data.shelter);
});
```

### Using `GetShelter`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getShelterRef, GetShelterVariables } from '@bf-ims/dataconnect';

// The `GetShelter` query requires an argument of type `GetShelterVariables`:
const getShelterVars: GetShelterVariables = {
  id: ..., 
};

// Call the `getShelterRef()` function to get a reference to the query.
const ref = getShelterRef(getShelterVars);
// Variables can be defined inline as well.
const ref = getShelterRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getShelterRef(dataConnect, getShelterVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.shelter);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.shelter);
});
```

## ListInventoryInStock
You can execute the `ListInventoryInStock` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listInventoryInStock(vars?: ListInventoryInStockVariables, options?: ExecuteQueryOptions): QueryPromise<ListInventoryInStockData, ListInventoryInStockVariables>;

interface ListInventoryInStockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListInventoryInStockVariables): QueryRef<ListInventoryInStockData, ListInventoryInStockVariables>;
}
export const listInventoryInStockRef: ListInventoryInStockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listInventoryInStock(dc: DataConnect, vars?: ListInventoryInStockVariables, options?: ExecuteQueryOptions): QueryPromise<ListInventoryInStockData, ListInventoryInStockVariables>;

interface ListInventoryInStockRef {
  ...
  (dc: DataConnect, vars?: ListInventoryInStockVariables): QueryRef<ListInventoryInStockData, ListInventoryInStockVariables>;
}
export const listInventoryInStockRef: ListInventoryInStockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listInventoryInStockRef:
```typescript
const name = listInventoryInStockRef.operationName;
console.log(name);
```

### Variables
The `ListInventoryInStock` query has an optional argument of type `ListInventoryInStockVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListInventoryInStockVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `ListInventoryInStock` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListInventoryInStockData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListInventoryInStockData {
  products: ({
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    quantity: number;
    color?: string | null;
    colorCategory?: string | null;
    expirationDate?: DateString | null;
    barcode?: string | null;
    status: ProductStatus;
    createdAt: TimestampString;
    donation: {
      id: UUIDString;
      date: DateString;
      donor: {
        fullName: string;
      };
    } & Donation_Key;
  } & Product_Key)[];
}
```
### Using `ListInventoryInStock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listInventoryInStock, ListInventoryInStockVariables } from '@bf-ims/dataconnect';

// The `ListInventoryInStock` query has an optional argument of type `ListInventoryInStockVariables`:
const listInventoryInStockVars: ListInventoryInStockVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listInventoryInStock()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listInventoryInStock(listInventoryInStockVars);
// Variables can be defined inline as well.
const { data } = await listInventoryInStock({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `ListInventoryInStockVariables` argument.
const { data } = await listInventoryInStock();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listInventoryInStock(dataConnect, listInventoryInStockVars);

console.log(data.products);

// Or, you can use the `Promise` API.
listInventoryInStock(listInventoryInStockVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListInventoryInStock`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listInventoryInStockRef, ListInventoryInStockVariables } from '@bf-ims/dataconnect';

// The `ListInventoryInStock` query has an optional argument of type `ListInventoryInStockVariables`:
const listInventoryInStockVars: ListInventoryInStockVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listInventoryInStockRef()` function to get a reference to the query.
const ref = listInventoryInStockRef(listInventoryInStockVars);
// Variables can be defined inline as well.
const ref = listInventoryInStockRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `ListInventoryInStockVariables` argument.
const ref = listInventoryInStockRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listInventoryInStockRef(dataConnect, listInventoryInStockVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## GetProduct
You can execute the `GetProduct` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getProduct(vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface GetProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
}
export const getProductRef: GetProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProduct(dc: DataConnect, vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface GetProductRef {
  ...
  (dc: DataConnect, vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
}
export const getProductRef: GetProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductRef:
```typescript
const name = getProductRef.operationName;
console.log(name);
```

### Variables
The `GetProduct` query requires an argument of type `GetProductVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProductVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetProduct` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductData {
  product?: {
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    quantity: number;
    price?: string | null;
    color?: string | null;
    colorCategory?: string | null;
    keyIngredients?: string | null;
    details?: unknown | null;
    expirationDate?: DateString | null;
    barcode?: string | null;
    status: ProductStatus;
    createdAt: TimestampString;
    donation: {
      id: UUIDString;
      date: DateString;
      method: string;
      donor: {
        id: UUIDString;
        fullName: string;
        email: string;
      } & Donor_Key;
    } & Donation_Key;
      batch?: {
        id: UUIDString;
        status: BatchStatus;
        shelter: {
          id: UUIDString;
          name: string;
        } & Shelter_Key;
      } & Batch_Key;
  } & Product_Key;
}
```
### Using `GetProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProduct, GetProductVariables } from '@bf-ims/dataconnect';

// The `GetProduct` query requires an argument of type `GetProductVariables`:
const getProductVars: GetProductVariables = {
  id: ..., 
};

// Call the `getProduct()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProduct(getProductVars);
// Variables can be defined inline as well.
const { data } = await getProduct({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProduct(dataConnect, getProductVars);

console.log(data.product);

// Or, you can use the `Promise` API.
getProduct(getProductVars).then((response) => {
  const data = response.data;
  console.log(data.product);
});
```

### Using `GetProduct`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductRef, GetProductVariables } from '@bf-ims/dataconnect';

// The `GetProduct` query requires an argument of type `GetProductVariables`:
const getProductVars: GetProductVariables = {
  id: ..., 
};

// Call the `getProductRef()` function to get a reference to the query.
const ref = getProductRef(getProductVars);
// Variables can be defined inline as well.
const ref = getProductRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductRef(dataConnect, getProductVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.product);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.product);
});
```

## ListAvailableProductsForShelter
You can execute the `ListAvailableProductsForShelter` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listAvailableProductsForShelter(vars?: ListAvailableProductsForShelterVariables, options?: ExecuteQueryOptions): QueryPromise<ListAvailableProductsForShelterData, ListAvailableProductsForShelterVariables>;

interface ListAvailableProductsForShelterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListAvailableProductsForShelterVariables): QueryRef<ListAvailableProductsForShelterData, ListAvailableProductsForShelterVariables>;
}
export const listAvailableProductsForShelterRef: ListAvailableProductsForShelterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAvailableProductsForShelter(dc: DataConnect, vars?: ListAvailableProductsForShelterVariables, options?: ExecuteQueryOptions): QueryPromise<ListAvailableProductsForShelterData, ListAvailableProductsForShelterVariables>;

interface ListAvailableProductsForShelterRef {
  ...
  (dc: DataConnect, vars?: ListAvailableProductsForShelterVariables): QueryRef<ListAvailableProductsForShelterData, ListAvailableProductsForShelterVariables>;
}
export const listAvailableProductsForShelterRef: ListAvailableProductsForShelterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAvailableProductsForShelterRef:
```typescript
const name = listAvailableProductsForShelterRef.operationName;
console.log(name);
```

### Variables
The `ListAvailableProductsForShelter` query has an optional argument of type `ListAvailableProductsForShelterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListAvailableProductsForShelterVariables {
  types?: string[] | null;
  limit?: number | null;
}
```
### Return Type
Recall that executing the `ListAvailableProductsForShelter` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAvailableProductsForShelterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAvailableProductsForShelterData {
  products: ({
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    quantity: number;
    color?: string | null;
    expirationDate?: DateString | null;
  } & Product_Key)[];
}
```
### Using `ListAvailableProductsForShelter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAvailableProductsForShelter, ListAvailableProductsForShelterVariables } from '@bf-ims/dataconnect';

// The `ListAvailableProductsForShelter` query has an optional argument of type `ListAvailableProductsForShelterVariables`:
const listAvailableProductsForShelterVars: ListAvailableProductsForShelterVariables = {
  types: ..., // optional
  limit: ..., // optional
};

// Call the `listAvailableProductsForShelter()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAvailableProductsForShelter(listAvailableProductsForShelterVars);
// Variables can be defined inline as well.
const { data } = await listAvailableProductsForShelter({ types: ..., limit: ..., });
// Since all variables are optional for this query, you can omit the `ListAvailableProductsForShelterVariables` argument.
const { data } = await listAvailableProductsForShelter();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAvailableProductsForShelter(dataConnect, listAvailableProductsForShelterVars);

console.log(data.products);

// Or, you can use the `Promise` API.
listAvailableProductsForShelter(listAvailableProductsForShelterVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListAvailableProductsForShelter`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAvailableProductsForShelterRef, ListAvailableProductsForShelterVariables } from '@bf-ims/dataconnect';

// The `ListAvailableProductsForShelter` query has an optional argument of type `ListAvailableProductsForShelterVariables`:
const listAvailableProductsForShelterVars: ListAvailableProductsForShelterVariables = {
  types: ..., // optional
  limit: ..., // optional
};

// Call the `listAvailableProductsForShelterRef()` function to get a reference to the query.
const ref = listAvailableProductsForShelterRef(listAvailableProductsForShelterVars);
// Variables can be defined inline as well.
const ref = listAvailableProductsForShelterRef({ types: ..., limit: ..., });
// Since all variables are optional for this query, you can omit the `ListAvailableProductsForShelterVariables` argument.
const ref = listAvailableProductsForShelterRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAvailableProductsForShelterRef(dataConnect, listAvailableProductsForShelterVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## ListProductsInBatch
You can execute the `ListProductsInBatch` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listProductsInBatch(vars: ListProductsInBatchVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductsInBatchData, ListProductsInBatchVariables>;

interface ListProductsInBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsInBatchVariables): QueryRef<ListProductsInBatchData, ListProductsInBatchVariables>;
}
export const listProductsInBatchRef: ListProductsInBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProductsInBatch(dc: DataConnect, vars: ListProductsInBatchVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductsInBatchData, ListProductsInBatchVariables>;

interface ListProductsInBatchRef {
  ...
  (dc: DataConnect, vars: ListProductsInBatchVariables): QueryRef<ListProductsInBatchData, ListProductsInBatchVariables>;
}
export const listProductsInBatchRef: ListProductsInBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductsInBatchRef:
```typescript
const name = listProductsInBatchRef.operationName;
console.log(name);
```

### Variables
The `ListProductsInBatch` query requires an argument of type `ListProductsInBatchVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListProductsInBatchVariables {
  batchId: UUIDString;
}
```
### Return Type
Recall that executing the `ListProductsInBatch` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductsInBatchData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductsInBatchData {
  products: ({
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    quantity: number;
    status: ProductStatus;
  } & Product_Key)[];
}
```
### Using `ListProductsInBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProductsInBatch, ListProductsInBatchVariables } from '@bf-ims/dataconnect';

// The `ListProductsInBatch` query requires an argument of type `ListProductsInBatchVariables`:
const listProductsInBatchVars: ListProductsInBatchVariables = {
  batchId: ..., 
};

// Call the `listProductsInBatch()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProductsInBatch(listProductsInBatchVars);
// Variables can be defined inline as well.
const { data } = await listProductsInBatch({ batchId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProductsInBatch(dataConnect, listProductsInBatchVars);

console.log(data.products);

// Or, you can use the `Promise` API.
listProductsInBatch(listProductsInBatchVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListProductsInBatch`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductsInBatchRef, ListProductsInBatchVariables } from '@bf-ims/dataconnect';

// The `ListProductsInBatch` query requires an argument of type `ListProductsInBatchVariables`:
const listProductsInBatchVars: ListProductsInBatchVariables = {
  batchId: ..., 
};

// Call the `listProductsInBatchRef()` function to get a reference to the query.
const ref = listProductsInBatchRef(listProductsInBatchVars);
// Variables can be defined inline as well.
const ref = listProductsInBatchRef({ batchId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductsInBatchRef(dataConnect, listProductsInBatchVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## ListExpiringSoon
You can execute the `ListExpiringSoon` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listExpiringSoon(vars: ListExpiringSoonVariables, options?: ExecuteQueryOptions): QueryPromise<ListExpiringSoonData, ListExpiringSoonVariables>;

interface ListExpiringSoonRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListExpiringSoonVariables): QueryRef<ListExpiringSoonData, ListExpiringSoonVariables>;
}
export const listExpiringSoonRef: ListExpiringSoonRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listExpiringSoon(dc: DataConnect, vars: ListExpiringSoonVariables, options?: ExecuteQueryOptions): QueryPromise<ListExpiringSoonData, ListExpiringSoonVariables>;

interface ListExpiringSoonRef {
  ...
  (dc: DataConnect, vars: ListExpiringSoonVariables): QueryRef<ListExpiringSoonData, ListExpiringSoonVariables>;
}
export const listExpiringSoonRef: ListExpiringSoonRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listExpiringSoonRef:
```typescript
const name = listExpiringSoonRef.operationName;
console.log(name);
```

### Variables
The `ListExpiringSoon` query requires an argument of type `ListExpiringSoonVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListExpiringSoonVariables {
  beforeDate: DateString;
}
```
### Return Type
Recall that executing the `ListExpiringSoon` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListExpiringSoonData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListExpiringSoonData {
  products: ({
    id: UUIDString;
    name: string;
    brand: string;
    type: string;
    expirationDate?: DateString | null;
    quantity: number;
  } & Product_Key)[];
}
```
### Using `ListExpiringSoon`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listExpiringSoon, ListExpiringSoonVariables } from '@bf-ims/dataconnect';

// The `ListExpiringSoon` query requires an argument of type `ListExpiringSoonVariables`:
const listExpiringSoonVars: ListExpiringSoonVariables = {
  beforeDate: ..., 
};

// Call the `listExpiringSoon()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listExpiringSoon(listExpiringSoonVars);
// Variables can be defined inline as well.
const { data } = await listExpiringSoon({ beforeDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listExpiringSoon(dataConnect, listExpiringSoonVars);

console.log(data.products);

// Or, you can use the `Promise` API.
listExpiringSoon(listExpiringSoonVars).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListExpiringSoon`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listExpiringSoonRef, ListExpiringSoonVariables } from '@bf-ims/dataconnect';

// The `ListExpiringSoon` query requires an argument of type `ListExpiringSoonVariables`:
const listExpiringSoonVars: ListExpiringSoonVariables = {
  beforeDate: ..., 
};

// Call the `listExpiringSoonRef()` function to get a reference to the query.
const ref = listExpiringSoonRef(listExpiringSoonVars);
// Variables can be defined inline as well.
const ref = listExpiringSoonRef({ beforeDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listExpiringSoonRef(dataConnect, listExpiringSoonVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## ListBatches
You can execute the `ListBatches` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listBatches(vars?: ListBatchesVariables, options?: ExecuteQueryOptions): QueryPromise<ListBatchesData, ListBatchesVariables>;

interface ListBatchesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListBatchesVariables): QueryRef<ListBatchesData, ListBatchesVariables>;
}
export const listBatchesRef: ListBatchesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBatches(dc: DataConnect, vars?: ListBatchesVariables, options?: ExecuteQueryOptions): QueryPromise<ListBatchesData, ListBatchesVariables>;

interface ListBatchesRef {
  ...
  (dc: DataConnect, vars?: ListBatchesVariables): QueryRef<ListBatchesData, ListBatchesVariables>;
}
export const listBatchesRef: ListBatchesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBatchesRef:
```typescript
const name = listBatchesRef.operationName;
console.log(name);
```

### Variables
The `ListBatches` query has an optional argument of type `ListBatchesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListBatchesVariables {
  status?: BatchStatus | null;
}
```
### Return Type
Recall that executing the `ListBatches` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBatchesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListBatchesData {
  batches: ({
    id: UUIDString;
    status: BatchStatus;
    createdAt: TimestampString;
    finalizedAt?: TimestampString | null;
    shippedAt?: TimestampString | null;
    deliveredAt?: TimestampString | null;
    shelter: {
      id: UUIDString;
      name: string;
      city: string;
      state: string;
    } & Shelter_Key;
  } & Batch_Key)[];
}
```
### Using `ListBatches`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBatches, ListBatchesVariables } from '@bf-ims/dataconnect';

// The `ListBatches` query has an optional argument of type `ListBatchesVariables`:
const listBatchesVars: ListBatchesVariables = {
  status: ..., // optional
};

// Call the `listBatches()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBatches(listBatchesVars);
// Variables can be defined inline as well.
const { data } = await listBatches({ status: ..., });
// Since all variables are optional for this query, you can omit the `ListBatchesVariables` argument.
const { data } = await listBatches();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBatches(dataConnect, listBatchesVars);

console.log(data.batches);

// Or, you can use the `Promise` API.
listBatches(listBatchesVars).then((response) => {
  const data = response.data;
  console.log(data.batches);
});
```

### Using `ListBatches`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBatchesRef, ListBatchesVariables } from '@bf-ims/dataconnect';

// The `ListBatches` query has an optional argument of type `ListBatchesVariables`:
const listBatchesVars: ListBatchesVariables = {
  status: ..., // optional
};

// Call the `listBatchesRef()` function to get a reference to the query.
const ref = listBatchesRef(listBatchesVars);
// Variables can be defined inline as well.
const ref = listBatchesRef({ status: ..., });
// Since all variables are optional for this query, you can omit the `ListBatchesVariables` argument.
const ref = listBatchesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBatchesRef(dataConnect, listBatchesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.batches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.batches);
});
```

## ListAllBatches
You can execute the `ListAllBatches` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listAllBatches(options?: ExecuteQueryOptions): QueryPromise<ListAllBatchesData, undefined>;

interface ListAllBatchesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllBatchesData, undefined>;
}
export const listAllBatchesRef: ListAllBatchesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllBatches(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllBatchesData, undefined>;

interface ListAllBatchesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllBatchesData, undefined>;
}
export const listAllBatchesRef: ListAllBatchesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllBatchesRef:
```typescript
const name = listAllBatchesRef.operationName;
console.log(name);
```

### Variables
The `ListAllBatches` query has no variables.
### Return Type
Recall that executing the `ListAllBatches` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllBatchesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllBatchesData {
  batches: ({
    id: UUIDString;
    status: BatchStatus;
    createdAt: TimestampString;
    finalizedAt?: TimestampString | null;
    shippedAt?: TimestampString | null;
    deliveredAt?: TimestampString | null;
    shelter: {
      id: UUIDString;
      name: string;
      city: string;
      state: string;
    } & Shelter_Key;
  } & Batch_Key)[];
}
```
### Using `ListAllBatches`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllBatches } from '@bf-ims/dataconnect';


// Call the `listAllBatches()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllBatches();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllBatches(dataConnect);

console.log(data.batches);

// Or, you can use the `Promise` API.
listAllBatches().then((response) => {
  const data = response.data;
  console.log(data.batches);
});
```

### Using `ListAllBatches`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllBatchesRef } from '@bf-ims/dataconnect';


// Call the `listAllBatchesRef()` function to get a reference to the query.
const ref = listAllBatchesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllBatchesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.batches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.batches);
});
```

## GetBatch
You can execute the `GetBatch` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBatch(vars: GetBatchVariables, options?: ExecuteQueryOptions): QueryPromise<GetBatchData, GetBatchVariables>;

interface GetBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBatchVariables): QueryRef<GetBatchData, GetBatchVariables>;
}
export const getBatchRef: GetBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBatch(dc: DataConnect, vars: GetBatchVariables, options?: ExecuteQueryOptions): QueryPromise<GetBatchData, GetBatchVariables>;

interface GetBatchRef {
  ...
  (dc: DataConnect, vars: GetBatchVariables): QueryRef<GetBatchData, GetBatchVariables>;
}
export const getBatchRef: GetBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBatchRef:
```typescript
const name = getBatchRef.operationName;
console.log(name);
```

### Variables
The `GetBatch` query requires an argument of type `GetBatchVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBatchVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetBatch` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBatchData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBatchData {
  batch?: {
    id: UUIDString;
    status: BatchStatus;
    notes?: string | null;
    createdBy: string;
    finalizedAt?: TimestampString | null;
    shippedAt?: TimestampString | null;
    deliveredAt?: TimestampString | null;
    createdAt: TimestampString;
    shelter: {
      id: UUIDString;
      name: string;
      addressLine1: string;
      addressLine2?: string | null;
      city: string;
      state: string;
      postalCode: string;
      contactName: string;
      contactEmail?: string | null;
      acceptedTypes?: string[] | null;
    } & Shelter_Key;
      products: ({
        id: UUIDString;
        name: string;
        brand: string;
        type: string;
        quantity: number;
        status: ProductStatus;
        expirationDate?: DateString | null;
      } & Product_Key)[];
  } & Batch_Key;
}
```
### Using `GetBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBatch, GetBatchVariables } from '@bf-ims/dataconnect';

// The `GetBatch` query requires an argument of type `GetBatchVariables`:
const getBatchVars: GetBatchVariables = {
  id: ..., 
};

// Call the `getBatch()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBatch(getBatchVars);
// Variables can be defined inline as well.
const { data } = await getBatch({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBatch(dataConnect, getBatchVars);

console.log(data.batch);

// Or, you can use the `Promise` API.
getBatch(getBatchVars).then((response) => {
  const data = response.data;
  console.log(data.batch);
});
```

### Using `GetBatch`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBatchRef, GetBatchVariables } from '@bf-ims/dataconnect';

// The `GetBatch` query requires an argument of type `GetBatchVariables`:
const getBatchVars: GetBatchVariables = {
  id: ..., 
};

// Call the `getBatchRef()` function to get a reference to the query.
const ref = getBatchRef(getBatchVars);
// Variables can be defined inline as well.
const ref = getBatchRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBatchRef(dataConnect, getBatchVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.batch);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.batch);
});
```

## DashboardInStockCount
You can execute the `DashboardInStockCount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
dashboardInStockCount(options?: ExecuteQueryOptions): QueryPromise<DashboardInStockCountData, undefined>;

interface DashboardInStockCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<DashboardInStockCountData, undefined>;
}
export const dashboardInStockCountRef: DashboardInStockCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
dashboardInStockCount(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<DashboardInStockCountData, undefined>;

interface DashboardInStockCountRef {
  ...
  (dc: DataConnect): QueryRef<DashboardInStockCountData, undefined>;
}
export const dashboardInStockCountRef: DashboardInStockCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the dashboardInStockCountRef:
```typescript
const name = dashboardInStockCountRef.operationName;
console.log(name);
```

### Variables
The `DashboardInStockCount` query has no variables.
### Return Type
Recall that executing the `DashboardInStockCount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DashboardInStockCountData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DashboardInStockCountData {
  products: ({
    id: UUIDString;
  } & Product_Key)[];
}
```
### Using `DashboardInStockCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, dashboardInStockCount } from '@bf-ims/dataconnect';


// Call the `dashboardInStockCount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await dashboardInStockCount();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await dashboardInStockCount(dataConnect);

console.log(data.products);

// Or, you can use the `Promise` API.
dashboardInStockCount().then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `DashboardInStockCount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, dashboardInStockCountRef } from '@bf-ims/dataconnect';


// Call the `dashboardInStockCountRef()` function to get a reference to the query.
const ref = dashboardInStockCountRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = dashboardInStockCountRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## DashboardStats
You can execute the `DashboardStats` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
dashboardStats(options?: ExecuteQueryOptions): QueryPromise<DashboardStatsData, undefined>;

interface DashboardStatsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<DashboardStatsData, undefined>;
}
export const dashboardStatsRef: DashboardStatsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
dashboardStats(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<DashboardStatsData, undefined>;

interface DashboardStatsRef {
  ...
  (dc: DataConnect): QueryRef<DashboardStatsData, undefined>;
}
export const dashboardStatsRef: DashboardStatsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the dashboardStatsRef:
```typescript
const name = dashboardStatsRef.operationName;
console.log(name);
```

### Variables
The `DashboardStats` query has no variables.
### Return Type
Recall that executing the `DashboardStats` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DashboardStatsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DashboardStatsData {
  inStock: ({
    id: UUIDString;
  } & Product_Key)[];
    allocated: ({
      id: UUIDString;
    } & Product_Key)[];
      shipped: ({
        id: UUIDString;
      } & Product_Key)[];
}
```
### Using `DashboardStats`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, dashboardStats } from '@bf-ims/dataconnect';


// Call the `dashboardStats()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await dashboardStats();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await dashboardStats(dataConnect);

console.log(data.inStock);
console.log(data.allocated);
console.log(data.shipped);

// Or, you can use the `Promise` API.
dashboardStats().then((response) => {
  const data = response.data;
  console.log(data.inStock);
  console.log(data.allocated);
  console.log(data.shipped);
});
```

### Using `DashboardStats`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, dashboardStatsRef } from '@bf-ims/dataconnect';


// Call the `dashboardStatsRef()` function to get a reference to the query.
const ref = dashboardStatsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = dashboardStatsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.inStock);
console.log(data.allocated);
console.log(data.shipped);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.inStock);
  console.log(data.allocated);
  console.log(data.shipped);
});
```

## GetCatalogByBarcode
You can execute the `GetCatalogByBarcode` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getCatalogByBarcode(vars: GetCatalogByBarcodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetCatalogByBarcodeData, GetCatalogByBarcodeVariables>;

interface GetCatalogByBarcodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCatalogByBarcodeVariables): QueryRef<GetCatalogByBarcodeData, GetCatalogByBarcodeVariables>;
}
export const getCatalogByBarcodeRef: GetCatalogByBarcodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCatalogByBarcode(dc: DataConnect, vars: GetCatalogByBarcodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetCatalogByBarcodeData, GetCatalogByBarcodeVariables>;

interface GetCatalogByBarcodeRef {
  ...
  (dc: DataConnect, vars: GetCatalogByBarcodeVariables): QueryRef<GetCatalogByBarcodeData, GetCatalogByBarcodeVariables>;
}
export const getCatalogByBarcodeRef: GetCatalogByBarcodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCatalogByBarcodeRef:
```typescript
const name = getCatalogByBarcodeRef.operationName;
console.log(name);
```

### Variables
The `GetCatalogByBarcode` query requires an argument of type `GetCatalogByBarcodeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCatalogByBarcodeVariables {
  barcode: string;
}
```
### Return Type
Recall that executing the `GetCatalogByBarcode` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCatalogByBarcodeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCatalogByBarcodeData {
  productCatalog?: {
    barcode: string;
    name: string;
    brand: string;
    type: string;
    price?: string | null;
    color?: string | null;
    keyIngredients?: string | null;
    source: string;
    timesUsed: number;
  } & ProductCatalog_Key;
}
```
### Using `GetCatalogByBarcode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCatalogByBarcode, GetCatalogByBarcodeVariables } from '@bf-ims/dataconnect';

// The `GetCatalogByBarcode` query requires an argument of type `GetCatalogByBarcodeVariables`:
const getCatalogByBarcodeVars: GetCatalogByBarcodeVariables = {
  barcode: ..., 
};

// Call the `getCatalogByBarcode()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCatalogByBarcode(getCatalogByBarcodeVars);
// Variables can be defined inline as well.
const { data } = await getCatalogByBarcode({ barcode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCatalogByBarcode(dataConnect, getCatalogByBarcodeVars);

console.log(data.productCatalog);

// Or, you can use the `Promise` API.
getCatalogByBarcode(getCatalogByBarcodeVars).then((response) => {
  const data = response.data;
  console.log(data.productCatalog);
});
```

### Using `GetCatalogByBarcode`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCatalogByBarcodeRef, GetCatalogByBarcodeVariables } from '@bf-ims/dataconnect';

// The `GetCatalogByBarcode` query requires an argument of type `GetCatalogByBarcodeVariables`:
const getCatalogByBarcodeVars: GetCatalogByBarcodeVariables = {
  barcode: ..., 
};

// Call the `getCatalogByBarcodeRef()` function to get a reference to the query.
const ref = getCatalogByBarcodeRef(getCatalogByBarcodeVars);
// Variables can be defined inline as well.
const ref = getCatalogByBarcodeRef({ barcode: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCatalogByBarcodeRef(dataConnect, getCatalogByBarcodeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.productCatalog);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.productCatalog);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `bf-ims` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateDonor
You can execute the `CreateDonor` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createDonor(vars: CreateDonorVariables): MutationPromise<CreateDonorData, CreateDonorVariables>;

interface CreateDonorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDonorVariables): MutationRef<CreateDonorData, CreateDonorVariables>;
}
export const createDonorRef: CreateDonorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDonor(dc: DataConnect, vars: CreateDonorVariables): MutationPromise<CreateDonorData, CreateDonorVariables>;

interface CreateDonorRef {
  ...
  (dc: DataConnect, vars: CreateDonorVariables): MutationRef<CreateDonorData, CreateDonorVariables>;
}
export const createDonorRef: CreateDonorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDonorRef:
```typescript
const name = createDonorRef.operationName;
console.log(name);
```

### Variables
The `CreateDonor` mutation requires an argument of type `CreateDonorVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDonorVariables {
  email: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  smsOptIn?: boolean | null;
  instagramHandle?: string | null;
  linkedRequestId?: string | null;
}
```
### Return Type
Recall that executing the `CreateDonor` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDonorData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDonorData {
  donor_insert: Donor_Key;
}
```
### Using `CreateDonor`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDonor, CreateDonorVariables } from '@bf-ims/dataconnect';

// The `CreateDonor` mutation requires an argument of type `CreateDonorVariables`:
const createDonorVars: CreateDonorVariables = {
  email: ..., 
  fullName: ..., 
  phone: ..., 
  city: ..., 
  state: ..., 
  smsOptIn: ..., // optional
  instagramHandle: ..., // optional
  linkedRequestId: ..., // optional
};

// Call the `createDonor()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDonor(createDonorVars);
// Variables can be defined inline as well.
const { data } = await createDonor({ email: ..., fullName: ..., phone: ..., city: ..., state: ..., smsOptIn: ..., instagramHandle: ..., linkedRequestId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDonor(dataConnect, createDonorVars);

console.log(data.donor_insert);

// Or, you can use the `Promise` API.
createDonor(createDonorVars).then((response) => {
  const data = response.data;
  console.log(data.donor_insert);
});
```

### Using `CreateDonor`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDonorRef, CreateDonorVariables } from '@bf-ims/dataconnect';

// The `CreateDonor` mutation requires an argument of type `CreateDonorVariables`:
const createDonorVars: CreateDonorVariables = {
  email: ..., 
  fullName: ..., 
  phone: ..., 
  city: ..., 
  state: ..., 
  smsOptIn: ..., // optional
  instagramHandle: ..., // optional
  linkedRequestId: ..., // optional
};

// Call the `createDonorRef()` function to get a reference to the mutation.
const ref = createDonorRef(createDonorVars);
// Variables can be defined inline as well.
const ref = createDonorRef({ email: ..., fullName: ..., phone: ..., city: ..., state: ..., smsOptIn: ..., instagramHandle: ..., linkedRequestId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDonorRef(dataConnect, createDonorVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.donor_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.donor_insert);
});
```

## UpdateDonor
You can execute the `UpdateDonor` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateDonor(vars: UpdateDonorVariables): MutationPromise<UpdateDonorData, UpdateDonorVariables>;

interface UpdateDonorRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDonorVariables): MutationRef<UpdateDonorData, UpdateDonorVariables>;
}
export const updateDonorRef: UpdateDonorRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDonor(dc: DataConnect, vars: UpdateDonorVariables): MutationPromise<UpdateDonorData, UpdateDonorVariables>;

interface UpdateDonorRef {
  ...
  (dc: DataConnect, vars: UpdateDonorVariables): MutationRef<UpdateDonorData, UpdateDonorVariables>;
}
export const updateDonorRef: UpdateDonorRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDonorRef:
```typescript
const name = updateDonorRef.operationName;
console.log(name);
```

### Variables
The `UpdateDonor` mutation requires an argument of type `UpdateDonorVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDonorVariables {
  id: UUIDString;
  fullName?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  smsOptIn?: boolean | null;
  instagramHandle?: string | null;
  linkedRequestId?: string | null;
}
```
### Return Type
Recall that executing the `UpdateDonor` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDonorData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDonorData {
  donor_update?: Donor_Key | null;
}
```
### Using `UpdateDonor`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDonor, UpdateDonorVariables } from '@bf-ims/dataconnect';

// The `UpdateDonor` mutation requires an argument of type `UpdateDonorVariables`:
const updateDonorVars: UpdateDonorVariables = {
  id: ..., 
  fullName: ..., // optional
  phone: ..., // optional
  city: ..., // optional
  state: ..., // optional
  smsOptIn: ..., // optional
  instagramHandle: ..., // optional
  linkedRequestId: ..., // optional
};

// Call the `updateDonor()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDonor(updateDonorVars);
// Variables can be defined inline as well.
const { data } = await updateDonor({ id: ..., fullName: ..., phone: ..., city: ..., state: ..., smsOptIn: ..., instagramHandle: ..., linkedRequestId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDonor(dataConnect, updateDonorVars);

console.log(data.donor_update);

// Or, you can use the `Promise` API.
updateDonor(updateDonorVars).then((response) => {
  const data = response.data;
  console.log(data.donor_update);
});
```

### Using `UpdateDonor`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDonorRef, UpdateDonorVariables } from '@bf-ims/dataconnect';

// The `UpdateDonor` mutation requires an argument of type `UpdateDonorVariables`:
const updateDonorVars: UpdateDonorVariables = {
  id: ..., 
  fullName: ..., // optional
  phone: ..., // optional
  city: ..., // optional
  state: ..., // optional
  smsOptIn: ..., // optional
  instagramHandle: ..., // optional
  linkedRequestId: ..., // optional
};

// Call the `updateDonorRef()` function to get a reference to the mutation.
const ref = updateDonorRef(updateDonorVars);
// Variables can be defined inline as well.
const ref = updateDonorRef({ id: ..., fullName: ..., phone: ..., city: ..., state: ..., smsOptIn: ..., instagramHandle: ..., linkedRequestId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDonorRef(dataConnect, updateDonorVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.donor_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.donor_update);
});
```

## IncrementDonorDonationCount
You can execute the `IncrementDonorDonationCount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
incrementDonorDonationCount(vars: IncrementDonorDonationCountVariables): MutationPromise<IncrementDonorDonationCountData, IncrementDonorDonationCountVariables>;

interface IncrementDonorDonationCountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: IncrementDonorDonationCountVariables): MutationRef<IncrementDonorDonationCountData, IncrementDonorDonationCountVariables>;
}
export const incrementDonorDonationCountRef: IncrementDonorDonationCountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
incrementDonorDonationCount(dc: DataConnect, vars: IncrementDonorDonationCountVariables): MutationPromise<IncrementDonorDonationCountData, IncrementDonorDonationCountVariables>;

interface IncrementDonorDonationCountRef {
  ...
  (dc: DataConnect, vars: IncrementDonorDonationCountVariables): MutationRef<IncrementDonorDonationCountData, IncrementDonorDonationCountVariables>;
}
export const incrementDonorDonationCountRef: IncrementDonorDonationCountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the incrementDonorDonationCountRef:
```typescript
const name = incrementDonorDonationCountRef.operationName;
console.log(name);
```

### Variables
The `IncrementDonorDonationCount` mutation requires an argument of type `IncrementDonorDonationCountVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface IncrementDonorDonationCountVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `IncrementDonorDonationCount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `IncrementDonorDonationCountData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface IncrementDonorDonationCountData {
  donor_update?: Donor_Key | null;
}
```
### Using `IncrementDonorDonationCount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, incrementDonorDonationCount, IncrementDonorDonationCountVariables } from '@bf-ims/dataconnect';

// The `IncrementDonorDonationCount` mutation requires an argument of type `IncrementDonorDonationCountVariables`:
const incrementDonorDonationCountVars: IncrementDonorDonationCountVariables = {
  id: ..., 
};

// Call the `incrementDonorDonationCount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await incrementDonorDonationCount(incrementDonorDonationCountVars);
// Variables can be defined inline as well.
const { data } = await incrementDonorDonationCount({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await incrementDonorDonationCount(dataConnect, incrementDonorDonationCountVars);

console.log(data.donor_update);

// Or, you can use the `Promise` API.
incrementDonorDonationCount(incrementDonorDonationCountVars).then((response) => {
  const data = response.data;
  console.log(data.donor_update);
});
```

### Using `IncrementDonorDonationCount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, incrementDonorDonationCountRef, IncrementDonorDonationCountVariables } from '@bf-ims/dataconnect';

// The `IncrementDonorDonationCount` mutation requires an argument of type `IncrementDonorDonationCountVariables`:
const incrementDonorDonationCountVars: IncrementDonorDonationCountVariables = {
  id: ..., 
};

// Call the `incrementDonorDonationCountRef()` function to get a reference to the mutation.
const ref = incrementDonorDonationCountRef(incrementDonorDonationCountVars);
// Variables can be defined inline as well.
const ref = incrementDonorDonationCountRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = incrementDonorDonationCountRef(dataConnect, incrementDonorDonationCountVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.donor_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.donor_update);
});
```

## CreateDonation
You can execute the `CreateDonation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createDonation(vars: CreateDonationVariables): MutationPromise<CreateDonationData, CreateDonationVariables>;

interface CreateDonationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDonationVariables): MutationRef<CreateDonationData, CreateDonationVariables>;
}
export const createDonationRef: CreateDonationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDonation(dc: DataConnect, vars: CreateDonationVariables): MutationPromise<CreateDonationData, CreateDonationVariables>;

interface CreateDonationRef {
  ...
  (dc: DataConnect, vars: CreateDonationVariables): MutationRef<CreateDonationData, CreateDonationVariables>;
}
export const createDonationRef: CreateDonationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDonationRef:
```typescript
const name = createDonationRef.operationName;
console.log(name);
```

### Variables
The `CreateDonation` mutation requires an argument of type `CreateDonationVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDonationVariables {
  donorId: UUIDString;
  donationRequestId?: string | null;
  warehouseReference: string;
  date: DateString;
  method: string;
  notes?: string | null;
  processedBy: string;
}
```
### Return Type
Recall that executing the `CreateDonation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDonationData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDonationData {
  donation_insert: Donation_Key;
}
```
### Using `CreateDonation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDonation, CreateDonationVariables } from '@bf-ims/dataconnect';

// The `CreateDonation` mutation requires an argument of type `CreateDonationVariables`:
const createDonationVars: CreateDonationVariables = {
  donorId: ..., 
  donationRequestId: ..., // optional
  warehouseReference: ..., 
  date: ..., 
  method: ..., 
  notes: ..., // optional
  processedBy: ..., 
};

// Call the `createDonation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDonation(createDonationVars);
// Variables can be defined inline as well.
const { data } = await createDonation({ donorId: ..., donationRequestId: ..., warehouseReference: ..., date: ..., method: ..., notes: ..., processedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDonation(dataConnect, createDonationVars);

console.log(data.donation_insert);

// Or, you can use the `Promise` API.
createDonation(createDonationVars).then((response) => {
  const data = response.data;
  console.log(data.donation_insert);
});
```

### Using `CreateDonation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDonationRef, CreateDonationVariables } from '@bf-ims/dataconnect';

// The `CreateDonation` mutation requires an argument of type `CreateDonationVariables`:
const createDonationVars: CreateDonationVariables = {
  donorId: ..., 
  donationRequestId: ..., // optional
  warehouseReference: ..., 
  date: ..., 
  method: ..., 
  notes: ..., // optional
  processedBy: ..., 
};

// Call the `createDonationRef()` function to get a reference to the mutation.
const ref = createDonationRef(createDonationVars);
// Variables can be defined inline as well.
const ref = createDonationRef({ donorId: ..., donationRequestId: ..., warehouseReference: ..., date: ..., method: ..., notes: ..., processedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDonationRef(dataConnect, createDonationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.donation_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.donation_insert);
});
```

## CreateProduct
You can execute the `CreateProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface CreateProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
}
export const createProductRef: CreateProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface CreateProductRef {
  ...
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
}
export const createProductRef: CreateProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProductRef:
```typescript
const name = createProductRef.operationName;
console.log(name);
```

### Variables
The `CreateProduct` mutation requires an argument of type `CreateProductVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProductVariables {
  donationId: UUIDString;
  name: string;
  brand: string;
  type: string;
  quantity: number;
  price?: string | null;
  color?: string | null;
  colorCategory?: string | null;
  keyIngredients?: string | null;
  details?: unknown | null;
  expirationDate?: DateString | null;
  barcode?: string | null;
}
```
### Return Type
Recall that executing the `CreateProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductData {
  product_insert: Product_Key;
}
```
### Using `CreateProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProduct, CreateProductVariables } from '@bf-ims/dataconnect';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  donationId: ..., 
  name: ..., 
  brand: ..., 
  type: ..., 
  quantity: ..., 
  price: ..., // optional
  color: ..., // optional
  colorCategory: ..., // optional
  keyIngredients: ..., // optional
  details: ..., // optional
  expirationDate: ..., // optional
  barcode: ..., // optional
};

// Call the `createProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProduct(createProductVars);
// Variables can be defined inline as well.
const { data } = await createProduct({ donationId: ..., name: ..., brand: ..., type: ..., quantity: ..., price: ..., color: ..., colorCategory: ..., keyIngredients: ..., details: ..., expirationDate: ..., barcode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProduct(dataConnect, createProductVars);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
createProduct(createProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

### Using `CreateProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductRef, CreateProductVariables } from '@bf-ims/dataconnect';

// The `CreateProduct` mutation requires an argument of type `CreateProductVariables`:
const createProductVars: CreateProductVariables = {
  donationId: ..., 
  name: ..., 
  brand: ..., 
  type: ..., 
  quantity: ..., 
  price: ..., // optional
  color: ..., // optional
  colorCategory: ..., // optional
  keyIngredients: ..., // optional
  details: ..., // optional
  expirationDate: ..., // optional
  barcode: ..., // optional
};

// Call the `createProductRef()` function to get a reference to the mutation.
const ref = createProductRef(createProductVars);
// Variables can be defined inline as well.
const ref = createProductRef({ donationId: ..., name: ..., brand: ..., type: ..., quantity: ..., price: ..., color: ..., colorCategory: ..., keyIngredients: ..., details: ..., expirationDate: ..., barcode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductRef(dataConnect, createProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

## AllocateProductToBatch
You can execute the `AllocateProductToBatch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
allocateProductToBatch(vars: AllocateProductToBatchVariables): MutationPromise<AllocateProductToBatchData, AllocateProductToBatchVariables>;

interface AllocateProductToBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AllocateProductToBatchVariables): MutationRef<AllocateProductToBatchData, AllocateProductToBatchVariables>;
}
export const allocateProductToBatchRef: AllocateProductToBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
allocateProductToBatch(dc: DataConnect, vars: AllocateProductToBatchVariables): MutationPromise<AllocateProductToBatchData, AllocateProductToBatchVariables>;

interface AllocateProductToBatchRef {
  ...
  (dc: DataConnect, vars: AllocateProductToBatchVariables): MutationRef<AllocateProductToBatchData, AllocateProductToBatchVariables>;
}
export const allocateProductToBatchRef: AllocateProductToBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the allocateProductToBatchRef:
```typescript
const name = allocateProductToBatchRef.operationName;
console.log(name);
```

### Variables
The `AllocateProductToBatch` mutation requires an argument of type `AllocateProductToBatchVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AllocateProductToBatchVariables {
  productId: UUIDString;
  batchId: UUIDString;
}
```
### Return Type
Recall that executing the `AllocateProductToBatch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AllocateProductToBatchData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AllocateProductToBatchData {
  product_update?: Product_Key | null;
}
```
### Using `AllocateProductToBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, allocateProductToBatch, AllocateProductToBatchVariables } from '@bf-ims/dataconnect';

// The `AllocateProductToBatch` mutation requires an argument of type `AllocateProductToBatchVariables`:
const allocateProductToBatchVars: AllocateProductToBatchVariables = {
  productId: ..., 
  batchId: ..., 
};

// Call the `allocateProductToBatch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await allocateProductToBatch(allocateProductToBatchVars);
// Variables can be defined inline as well.
const { data } = await allocateProductToBatch({ productId: ..., batchId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await allocateProductToBatch(dataConnect, allocateProductToBatchVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
allocateProductToBatch(allocateProductToBatchVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `AllocateProductToBatch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, allocateProductToBatchRef, AllocateProductToBatchVariables } from '@bf-ims/dataconnect';

// The `AllocateProductToBatch` mutation requires an argument of type `AllocateProductToBatchVariables`:
const allocateProductToBatchVars: AllocateProductToBatchVariables = {
  productId: ..., 
  batchId: ..., 
};

// Call the `allocateProductToBatchRef()` function to get a reference to the mutation.
const ref = allocateProductToBatchRef(allocateProductToBatchVars);
// Variables can be defined inline as well.
const ref = allocateProductToBatchRef({ productId: ..., batchId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = allocateProductToBatchRef(dataConnect, allocateProductToBatchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

## UnallocateProduct
You can execute the `UnallocateProduct` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
unallocateProduct(vars: UnallocateProductVariables): MutationPromise<UnallocateProductData, UnallocateProductVariables>;

interface UnallocateProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UnallocateProductVariables): MutationRef<UnallocateProductData, UnallocateProductVariables>;
}
export const unallocateProductRef: UnallocateProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
unallocateProduct(dc: DataConnect, vars: UnallocateProductVariables): MutationPromise<UnallocateProductData, UnallocateProductVariables>;

interface UnallocateProductRef {
  ...
  (dc: DataConnect, vars: UnallocateProductVariables): MutationRef<UnallocateProductData, UnallocateProductVariables>;
}
export const unallocateProductRef: UnallocateProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the unallocateProductRef:
```typescript
const name = unallocateProductRef.operationName;
console.log(name);
```

### Variables
The `UnallocateProduct` mutation requires an argument of type `UnallocateProductVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UnallocateProductVariables {
  productId: UUIDString;
}
```
### Return Type
Recall that executing the `UnallocateProduct` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UnallocateProductData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UnallocateProductData {
  product_update?: Product_Key | null;
}
```
### Using `UnallocateProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, unallocateProduct, UnallocateProductVariables } from '@bf-ims/dataconnect';

// The `UnallocateProduct` mutation requires an argument of type `UnallocateProductVariables`:
const unallocateProductVars: UnallocateProductVariables = {
  productId: ..., 
};

// Call the `unallocateProduct()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await unallocateProduct(unallocateProductVars);
// Variables can be defined inline as well.
const { data } = await unallocateProduct({ productId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await unallocateProduct(dataConnect, unallocateProductVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
unallocateProduct(unallocateProductVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `UnallocateProduct`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, unallocateProductRef, UnallocateProductVariables } from '@bf-ims/dataconnect';

// The `UnallocateProduct` mutation requires an argument of type `UnallocateProductVariables`:
const unallocateProductVars: UnallocateProductVariables = {
  productId: ..., 
};

// Call the `unallocateProductRef()` function to get a reference to the mutation.
const ref = unallocateProductRef(unallocateProductVars);
// Variables can be defined inline as well.
const ref = unallocateProductRef({ productId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = unallocateProductRef(dataConnect, unallocateProductVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

## MarkBatchProductsShipped
You can execute the `MarkBatchProductsShipped` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
markBatchProductsShipped(vars: MarkBatchProductsShippedVariables): MutationPromise<MarkBatchProductsShippedData, MarkBatchProductsShippedVariables>;

interface MarkBatchProductsShippedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkBatchProductsShippedVariables): MutationRef<MarkBatchProductsShippedData, MarkBatchProductsShippedVariables>;
}
export const markBatchProductsShippedRef: MarkBatchProductsShippedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markBatchProductsShipped(dc: DataConnect, vars: MarkBatchProductsShippedVariables): MutationPromise<MarkBatchProductsShippedData, MarkBatchProductsShippedVariables>;

interface MarkBatchProductsShippedRef {
  ...
  (dc: DataConnect, vars: MarkBatchProductsShippedVariables): MutationRef<MarkBatchProductsShippedData, MarkBatchProductsShippedVariables>;
}
export const markBatchProductsShippedRef: MarkBatchProductsShippedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markBatchProductsShippedRef:
```typescript
const name = markBatchProductsShippedRef.operationName;
console.log(name);
```

### Variables
The `MarkBatchProductsShipped` mutation requires an argument of type `MarkBatchProductsShippedVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkBatchProductsShippedVariables {
  batchId: UUIDString;
}
```
### Return Type
Recall that executing the `MarkBatchProductsShipped` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkBatchProductsShippedData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkBatchProductsShippedData {
  product_updateMany: number;
}
```
### Using `MarkBatchProductsShipped`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markBatchProductsShipped, MarkBatchProductsShippedVariables } from '@bf-ims/dataconnect';

// The `MarkBatchProductsShipped` mutation requires an argument of type `MarkBatchProductsShippedVariables`:
const markBatchProductsShippedVars: MarkBatchProductsShippedVariables = {
  batchId: ..., 
};

// Call the `markBatchProductsShipped()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markBatchProductsShipped(markBatchProductsShippedVars);
// Variables can be defined inline as well.
const { data } = await markBatchProductsShipped({ batchId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markBatchProductsShipped(dataConnect, markBatchProductsShippedVars);

console.log(data.product_updateMany);

// Or, you can use the `Promise` API.
markBatchProductsShipped(markBatchProductsShippedVars).then((response) => {
  const data = response.data;
  console.log(data.product_updateMany);
});
```

### Using `MarkBatchProductsShipped`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markBatchProductsShippedRef, MarkBatchProductsShippedVariables } from '@bf-ims/dataconnect';

// The `MarkBatchProductsShipped` mutation requires an argument of type `MarkBatchProductsShippedVariables`:
const markBatchProductsShippedVars: MarkBatchProductsShippedVariables = {
  batchId: ..., 
};

// Call the `markBatchProductsShippedRef()` function to get a reference to the mutation.
const ref = markBatchProductsShippedRef(markBatchProductsShippedVars);
// Variables can be defined inline as well.
const ref = markBatchProductsShippedRef({ batchId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markBatchProductsShippedRef(dataConnect, markBatchProductsShippedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_updateMany);
});
```

## MarkProductExpired
You can execute the `MarkProductExpired` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
markProductExpired(vars: MarkProductExpiredVariables): MutationPromise<MarkProductExpiredData, MarkProductExpiredVariables>;

interface MarkProductExpiredRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkProductExpiredVariables): MutationRef<MarkProductExpiredData, MarkProductExpiredVariables>;
}
export const markProductExpiredRef: MarkProductExpiredRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markProductExpired(dc: DataConnect, vars: MarkProductExpiredVariables): MutationPromise<MarkProductExpiredData, MarkProductExpiredVariables>;

interface MarkProductExpiredRef {
  ...
  (dc: DataConnect, vars: MarkProductExpiredVariables): MutationRef<MarkProductExpiredData, MarkProductExpiredVariables>;
}
export const markProductExpiredRef: MarkProductExpiredRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markProductExpiredRef:
```typescript
const name = markProductExpiredRef.operationName;
console.log(name);
```

### Variables
The `MarkProductExpired` mutation requires an argument of type `MarkProductExpiredVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkProductExpiredVariables {
  productId: UUIDString;
}
```
### Return Type
Recall that executing the `MarkProductExpired` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkProductExpiredData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkProductExpiredData {
  product_update?: Product_Key | null;
}
```
### Using `MarkProductExpired`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markProductExpired, MarkProductExpiredVariables } from '@bf-ims/dataconnect';

// The `MarkProductExpired` mutation requires an argument of type `MarkProductExpiredVariables`:
const markProductExpiredVars: MarkProductExpiredVariables = {
  productId: ..., 
};

// Call the `markProductExpired()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markProductExpired(markProductExpiredVars);
// Variables can be defined inline as well.
const { data } = await markProductExpired({ productId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markProductExpired(dataConnect, markProductExpiredVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
markProductExpired(markProductExpiredVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `MarkProductExpired`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markProductExpiredRef, MarkProductExpiredVariables } from '@bf-ims/dataconnect';

// The `MarkProductExpired` mutation requires an argument of type `MarkProductExpiredVariables`:
const markProductExpiredVars: MarkProductExpiredVariables = {
  productId: ..., 
};

// Call the `markProductExpiredRef()` function to get a reference to the mutation.
const ref = markProductExpiredRef(markProductExpiredVars);
// Variables can be defined inline as well.
const ref = markProductExpiredRef({ productId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markProductExpiredRef(dataConnect, markProductExpiredVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

## MarkProductDiscarded
You can execute the `MarkProductDiscarded` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
markProductDiscarded(vars: MarkProductDiscardedVariables): MutationPromise<MarkProductDiscardedData, MarkProductDiscardedVariables>;

interface MarkProductDiscardedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkProductDiscardedVariables): MutationRef<MarkProductDiscardedData, MarkProductDiscardedVariables>;
}
export const markProductDiscardedRef: MarkProductDiscardedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markProductDiscarded(dc: DataConnect, vars: MarkProductDiscardedVariables): MutationPromise<MarkProductDiscardedData, MarkProductDiscardedVariables>;

interface MarkProductDiscardedRef {
  ...
  (dc: DataConnect, vars: MarkProductDiscardedVariables): MutationRef<MarkProductDiscardedData, MarkProductDiscardedVariables>;
}
export const markProductDiscardedRef: MarkProductDiscardedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markProductDiscardedRef:
```typescript
const name = markProductDiscardedRef.operationName;
console.log(name);
```

### Variables
The `MarkProductDiscarded` mutation requires an argument of type `MarkProductDiscardedVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkProductDiscardedVariables {
  productId: UUIDString;
}
```
### Return Type
Recall that executing the `MarkProductDiscarded` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkProductDiscardedData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkProductDiscardedData {
  product_update?: Product_Key | null;
}
```
### Using `MarkProductDiscarded`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markProductDiscarded, MarkProductDiscardedVariables } from '@bf-ims/dataconnect';

// The `MarkProductDiscarded` mutation requires an argument of type `MarkProductDiscardedVariables`:
const markProductDiscardedVars: MarkProductDiscardedVariables = {
  productId: ..., 
};

// Call the `markProductDiscarded()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markProductDiscarded(markProductDiscardedVars);
// Variables can be defined inline as well.
const { data } = await markProductDiscarded({ productId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markProductDiscarded(dataConnect, markProductDiscardedVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
markProductDiscarded(markProductDiscardedVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `MarkProductDiscarded`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markProductDiscardedRef, MarkProductDiscardedVariables } from '@bf-ims/dataconnect';

// The `MarkProductDiscarded` mutation requires an argument of type `MarkProductDiscardedVariables`:
const markProductDiscardedVars: MarkProductDiscardedVariables = {
  productId: ..., 
};

// Call the `markProductDiscardedRef()` function to get a reference to the mutation.
const ref = markProductDiscardedRef(markProductDiscardedVars);
// Variables can be defined inline as well.
const ref = markProductDiscardedRef({ productId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markProductDiscardedRef(dataConnect, markProductDiscardedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

## CreateShelter
You can execute the `CreateShelter` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createShelter(vars: CreateShelterVariables): MutationPromise<CreateShelterData, CreateShelterVariables>;

interface CreateShelterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateShelterVariables): MutationRef<CreateShelterData, CreateShelterVariables>;
}
export const createShelterRef: CreateShelterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createShelter(dc: DataConnect, vars: CreateShelterVariables): MutationPromise<CreateShelterData, CreateShelterVariables>;

interface CreateShelterRef {
  ...
  (dc: DataConnect, vars: CreateShelterVariables): MutationRef<CreateShelterData, CreateShelterVariables>;
}
export const createShelterRef: CreateShelterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createShelterRef:
```typescript
const name = createShelterRef.operationName;
console.log(name);
```

### Variables
The `CreateShelter` mutation requires an argument of type `CreateShelterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateShelterVariables {
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  acceptedTypes?: string[] | null;
  rejectedTypes?: string[] | null;
  preferredBrands?: string[] | null;
  notes?: string | null;
  capacityPerBatch?: number | null;
}
```
### Return Type
Recall that executing the `CreateShelter` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateShelterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateShelterData {
  shelter_insert: Shelter_Key;
}
```
### Using `CreateShelter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createShelter, CreateShelterVariables } from '@bf-ims/dataconnect';

// The `CreateShelter` mutation requires an argument of type `CreateShelterVariables`:
const createShelterVars: CreateShelterVariables = {
  name: ..., 
  addressLine1: ..., 
  addressLine2: ..., // optional
  city: ..., 
  state: ..., 
  postalCode: ..., 
  contactName: ..., 
  contactEmail: ..., // optional
  contactPhone: ..., // optional
  acceptedTypes: ..., // optional
  rejectedTypes: ..., // optional
  preferredBrands: ..., // optional
  notes: ..., // optional
  capacityPerBatch: ..., // optional
};

// Call the `createShelter()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createShelter(createShelterVars);
// Variables can be defined inline as well.
const { data } = await createShelter({ name: ..., addressLine1: ..., addressLine2: ..., city: ..., state: ..., postalCode: ..., contactName: ..., contactEmail: ..., contactPhone: ..., acceptedTypes: ..., rejectedTypes: ..., preferredBrands: ..., notes: ..., capacityPerBatch: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createShelter(dataConnect, createShelterVars);

console.log(data.shelter_insert);

// Or, you can use the `Promise` API.
createShelter(createShelterVars).then((response) => {
  const data = response.data;
  console.log(data.shelter_insert);
});
```

### Using `CreateShelter`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createShelterRef, CreateShelterVariables } from '@bf-ims/dataconnect';

// The `CreateShelter` mutation requires an argument of type `CreateShelterVariables`:
const createShelterVars: CreateShelterVariables = {
  name: ..., 
  addressLine1: ..., 
  addressLine2: ..., // optional
  city: ..., 
  state: ..., 
  postalCode: ..., 
  contactName: ..., 
  contactEmail: ..., // optional
  contactPhone: ..., // optional
  acceptedTypes: ..., // optional
  rejectedTypes: ..., // optional
  preferredBrands: ..., // optional
  notes: ..., // optional
  capacityPerBatch: ..., // optional
};

// Call the `createShelterRef()` function to get a reference to the mutation.
const ref = createShelterRef(createShelterVars);
// Variables can be defined inline as well.
const ref = createShelterRef({ name: ..., addressLine1: ..., addressLine2: ..., city: ..., state: ..., postalCode: ..., contactName: ..., contactEmail: ..., contactPhone: ..., acceptedTypes: ..., rejectedTypes: ..., preferredBrands: ..., notes: ..., capacityPerBatch: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createShelterRef(dataConnect, createShelterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shelter_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shelter_insert);
});
```

## UpdateShelter
You can execute the `UpdateShelter` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateShelter(vars: UpdateShelterVariables): MutationPromise<UpdateShelterData, UpdateShelterVariables>;

interface UpdateShelterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateShelterVariables): MutationRef<UpdateShelterData, UpdateShelterVariables>;
}
export const updateShelterRef: UpdateShelterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateShelter(dc: DataConnect, vars: UpdateShelterVariables): MutationPromise<UpdateShelterData, UpdateShelterVariables>;

interface UpdateShelterRef {
  ...
  (dc: DataConnect, vars: UpdateShelterVariables): MutationRef<UpdateShelterData, UpdateShelterVariables>;
}
export const updateShelterRef: UpdateShelterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateShelterRef:
```typescript
const name = updateShelterRef.operationName;
console.log(name);
```

### Variables
The `UpdateShelter` mutation requires an argument of type `UpdateShelterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateShelterVariables {
  id: UUIDString;
  name?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  acceptedTypes?: string[] | null;
  rejectedTypes?: string[] | null;
  preferredBrands?: string[] | null;
  notes?: string | null;
  capacityPerBatch?: number | null;
}
```
### Return Type
Recall that executing the `UpdateShelter` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateShelterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateShelterData {
  shelter_update?: Shelter_Key | null;
}
```
### Using `UpdateShelter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateShelter, UpdateShelterVariables } from '@bf-ims/dataconnect';

// The `UpdateShelter` mutation requires an argument of type `UpdateShelterVariables`:
const updateShelterVars: UpdateShelterVariables = {
  id: ..., 
  name: ..., // optional
  addressLine1: ..., // optional
  addressLine2: ..., // optional
  city: ..., // optional
  state: ..., // optional
  postalCode: ..., // optional
  contactName: ..., // optional
  contactEmail: ..., // optional
  contactPhone: ..., // optional
  acceptedTypes: ..., // optional
  rejectedTypes: ..., // optional
  preferredBrands: ..., // optional
  notes: ..., // optional
  capacityPerBatch: ..., // optional
};

// Call the `updateShelter()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateShelter(updateShelterVars);
// Variables can be defined inline as well.
const { data } = await updateShelter({ id: ..., name: ..., addressLine1: ..., addressLine2: ..., city: ..., state: ..., postalCode: ..., contactName: ..., contactEmail: ..., contactPhone: ..., acceptedTypes: ..., rejectedTypes: ..., preferredBrands: ..., notes: ..., capacityPerBatch: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateShelter(dataConnect, updateShelterVars);

console.log(data.shelter_update);

// Or, you can use the `Promise` API.
updateShelter(updateShelterVars).then((response) => {
  const data = response.data;
  console.log(data.shelter_update);
});
```

### Using `UpdateShelter`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateShelterRef, UpdateShelterVariables } from '@bf-ims/dataconnect';

// The `UpdateShelter` mutation requires an argument of type `UpdateShelterVariables`:
const updateShelterVars: UpdateShelterVariables = {
  id: ..., 
  name: ..., // optional
  addressLine1: ..., // optional
  addressLine2: ..., // optional
  city: ..., // optional
  state: ..., // optional
  postalCode: ..., // optional
  contactName: ..., // optional
  contactEmail: ..., // optional
  contactPhone: ..., // optional
  acceptedTypes: ..., // optional
  rejectedTypes: ..., // optional
  preferredBrands: ..., // optional
  notes: ..., // optional
  capacityPerBatch: ..., // optional
};

// Call the `updateShelterRef()` function to get a reference to the mutation.
const ref = updateShelterRef(updateShelterVars);
// Variables can be defined inline as well.
const ref = updateShelterRef({ id: ..., name: ..., addressLine1: ..., addressLine2: ..., city: ..., state: ..., postalCode: ..., contactName: ..., contactEmail: ..., contactPhone: ..., acceptedTypes: ..., rejectedTypes: ..., preferredBrands: ..., notes: ..., capacityPerBatch: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateShelterRef(dataConnect, updateShelterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shelter_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shelter_update);
});
```

## DeactivateShelter
You can execute the `DeactivateShelter` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deactivateShelter(vars: DeactivateShelterVariables): MutationPromise<DeactivateShelterData, DeactivateShelterVariables>;

interface DeactivateShelterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeactivateShelterVariables): MutationRef<DeactivateShelterData, DeactivateShelterVariables>;
}
export const deactivateShelterRef: DeactivateShelterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deactivateShelter(dc: DataConnect, vars: DeactivateShelterVariables): MutationPromise<DeactivateShelterData, DeactivateShelterVariables>;

interface DeactivateShelterRef {
  ...
  (dc: DataConnect, vars: DeactivateShelterVariables): MutationRef<DeactivateShelterData, DeactivateShelterVariables>;
}
export const deactivateShelterRef: DeactivateShelterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deactivateShelterRef:
```typescript
const name = deactivateShelterRef.operationName;
console.log(name);
```

### Variables
The `DeactivateShelter` mutation requires an argument of type `DeactivateShelterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeactivateShelterVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeactivateShelter` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeactivateShelterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeactivateShelterData {
  shelter_update?: Shelter_Key | null;
}
```
### Using `DeactivateShelter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deactivateShelter, DeactivateShelterVariables } from '@bf-ims/dataconnect';

// The `DeactivateShelter` mutation requires an argument of type `DeactivateShelterVariables`:
const deactivateShelterVars: DeactivateShelterVariables = {
  id: ..., 
};

// Call the `deactivateShelter()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deactivateShelter(deactivateShelterVars);
// Variables can be defined inline as well.
const { data } = await deactivateShelter({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deactivateShelter(dataConnect, deactivateShelterVars);

console.log(data.shelter_update);

// Or, you can use the `Promise` API.
deactivateShelter(deactivateShelterVars).then((response) => {
  const data = response.data;
  console.log(data.shelter_update);
});
```

### Using `DeactivateShelter`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deactivateShelterRef, DeactivateShelterVariables } from '@bf-ims/dataconnect';

// The `DeactivateShelter` mutation requires an argument of type `DeactivateShelterVariables`:
const deactivateShelterVars: DeactivateShelterVariables = {
  id: ..., 
};

// Call the `deactivateShelterRef()` function to get a reference to the mutation.
const ref = deactivateShelterRef(deactivateShelterVars);
// Variables can be defined inline as well.
const ref = deactivateShelterRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deactivateShelterRef(dataConnect, deactivateShelterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shelter_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shelter_update);
});
```

## ReactivateShelter
You can execute the `ReactivateShelter` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
reactivateShelter(vars: ReactivateShelterVariables): MutationPromise<ReactivateShelterData, ReactivateShelterVariables>;

interface ReactivateShelterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ReactivateShelterVariables): MutationRef<ReactivateShelterData, ReactivateShelterVariables>;
}
export const reactivateShelterRef: ReactivateShelterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
reactivateShelter(dc: DataConnect, vars: ReactivateShelterVariables): MutationPromise<ReactivateShelterData, ReactivateShelterVariables>;

interface ReactivateShelterRef {
  ...
  (dc: DataConnect, vars: ReactivateShelterVariables): MutationRef<ReactivateShelterData, ReactivateShelterVariables>;
}
export const reactivateShelterRef: ReactivateShelterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the reactivateShelterRef:
```typescript
const name = reactivateShelterRef.operationName;
console.log(name);
```

### Variables
The `ReactivateShelter` mutation requires an argument of type `ReactivateShelterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ReactivateShelterVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ReactivateShelter` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ReactivateShelterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ReactivateShelterData {
  shelter_update?: Shelter_Key | null;
}
```
### Using `ReactivateShelter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, reactivateShelter, ReactivateShelterVariables } from '@bf-ims/dataconnect';

// The `ReactivateShelter` mutation requires an argument of type `ReactivateShelterVariables`:
const reactivateShelterVars: ReactivateShelterVariables = {
  id: ..., 
};

// Call the `reactivateShelter()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await reactivateShelter(reactivateShelterVars);
// Variables can be defined inline as well.
const { data } = await reactivateShelter({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await reactivateShelter(dataConnect, reactivateShelterVars);

console.log(data.shelter_update);

// Or, you can use the `Promise` API.
reactivateShelter(reactivateShelterVars).then((response) => {
  const data = response.data;
  console.log(data.shelter_update);
});
```

### Using `ReactivateShelter`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, reactivateShelterRef, ReactivateShelterVariables } from '@bf-ims/dataconnect';

// The `ReactivateShelter` mutation requires an argument of type `ReactivateShelterVariables`:
const reactivateShelterVars: ReactivateShelterVariables = {
  id: ..., 
};

// Call the `reactivateShelterRef()` function to get a reference to the mutation.
const ref = reactivateShelterRef(reactivateShelterVars);
// Variables can be defined inline as well.
const ref = reactivateShelterRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = reactivateShelterRef(dataConnect, reactivateShelterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shelter_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shelter_update);
});
```

## CreateBatch
You can execute the `CreateBatch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createBatch(vars: CreateBatchVariables): MutationPromise<CreateBatchData, CreateBatchVariables>;

interface CreateBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBatchVariables): MutationRef<CreateBatchData, CreateBatchVariables>;
}
export const createBatchRef: CreateBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBatch(dc: DataConnect, vars: CreateBatchVariables): MutationPromise<CreateBatchData, CreateBatchVariables>;

interface CreateBatchRef {
  ...
  (dc: DataConnect, vars: CreateBatchVariables): MutationRef<CreateBatchData, CreateBatchVariables>;
}
export const createBatchRef: CreateBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBatchRef:
```typescript
const name = createBatchRef.operationName;
console.log(name);
```

### Variables
The `CreateBatch` mutation requires an argument of type `CreateBatchVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBatchVariables {
  shelterId: UUIDString;
  createdBy: string;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateBatch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBatchData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBatchData {
  batch_insert: Batch_Key;
}
```
### Using `CreateBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBatch, CreateBatchVariables } from '@bf-ims/dataconnect';

// The `CreateBatch` mutation requires an argument of type `CreateBatchVariables`:
const createBatchVars: CreateBatchVariables = {
  shelterId: ..., 
  createdBy: ..., 
  notes: ..., // optional
};

// Call the `createBatch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBatch(createBatchVars);
// Variables can be defined inline as well.
const { data } = await createBatch({ shelterId: ..., createdBy: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBatch(dataConnect, createBatchVars);

console.log(data.batch_insert);

// Or, you can use the `Promise` API.
createBatch(createBatchVars).then((response) => {
  const data = response.data;
  console.log(data.batch_insert);
});
```

### Using `CreateBatch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBatchRef, CreateBatchVariables } from '@bf-ims/dataconnect';

// The `CreateBatch` mutation requires an argument of type `CreateBatchVariables`:
const createBatchVars: CreateBatchVariables = {
  shelterId: ..., 
  createdBy: ..., 
  notes: ..., // optional
};

// Call the `createBatchRef()` function to get a reference to the mutation.
const ref = createBatchRef(createBatchVars);
// Variables can be defined inline as well.
const ref = createBatchRef({ shelterId: ..., createdBy: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBatchRef(dataConnect, createBatchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.batch_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.batch_insert);
});
```

## FinalizeBatch
You can execute the `FinalizeBatch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
finalizeBatch(vars: FinalizeBatchVariables): MutationPromise<FinalizeBatchData, FinalizeBatchVariables>;

interface FinalizeBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: FinalizeBatchVariables): MutationRef<FinalizeBatchData, FinalizeBatchVariables>;
}
export const finalizeBatchRef: FinalizeBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
finalizeBatch(dc: DataConnect, vars: FinalizeBatchVariables): MutationPromise<FinalizeBatchData, FinalizeBatchVariables>;

interface FinalizeBatchRef {
  ...
  (dc: DataConnect, vars: FinalizeBatchVariables): MutationRef<FinalizeBatchData, FinalizeBatchVariables>;
}
export const finalizeBatchRef: FinalizeBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the finalizeBatchRef:
```typescript
const name = finalizeBatchRef.operationName;
console.log(name);
```

### Variables
The `FinalizeBatch` mutation requires an argument of type `FinalizeBatchVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface FinalizeBatchVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `FinalizeBatch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `FinalizeBatchData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface FinalizeBatchData {
  batch_update?: Batch_Key | null;
}
```
### Using `FinalizeBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, finalizeBatch, FinalizeBatchVariables } from '@bf-ims/dataconnect';

// The `FinalizeBatch` mutation requires an argument of type `FinalizeBatchVariables`:
const finalizeBatchVars: FinalizeBatchVariables = {
  id: ..., 
};

// Call the `finalizeBatch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await finalizeBatch(finalizeBatchVars);
// Variables can be defined inline as well.
const { data } = await finalizeBatch({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await finalizeBatch(dataConnect, finalizeBatchVars);

console.log(data.batch_update);

// Or, you can use the `Promise` API.
finalizeBatch(finalizeBatchVars).then((response) => {
  const data = response.data;
  console.log(data.batch_update);
});
```

### Using `FinalizeBatch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, finalizeBatchRef, FinalizeBatchVariables } from '@bf-ims/dataconnect';

// The `FinalizeBatch` mutation requires an argument of type `FinalizeBatchVariables`:
const finalizeBatchVars: FinalizeBatchVariables = {
  id: ..., 
};

// Call the `finalizeBatchRef()` function to get a reference to the mutation.
const ref = finalizeBatchRef(finalizeBatchVars);
// Variables can be defined inline as well.
const ref = finalizeBatchRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = finalizeBatchRef(dataConnect, finalizeBatchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.batch_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.batch_update);
});
```

## ShipBatch
You can execute the `ShipBatch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
shipBatch(vars: ShipBatchVariables): MutationPromise<ShipBatchData, ShipBatchVariables>;

interface ShipBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ShipBatchVariables): MutationRef<ShipBatchData, ShipBatchVariables>;
}
export const shipBatchRef: ShipBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
shipBatch(dc: DataConnect, vars: ShipBatchVariables): MutationPromise<ShipBatchData, ShipBatchVariables>;

interface ShipBatchRef {
  ...
  (dc: DataConnect, vars: ShipBatchVariables): MutationRef<ShipBatchData, ShipBatchVariables>;
}
export const shipBatchRef: ShipBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the shipBatchRef:
```typescript
const name = shipBatchRef.operationName;
console.log(name);
```

### Variables
The `ShipBatch` mutation requires an argument of type `ShipBatchVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ShipBatchVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ShipBatch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ShipBatchData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ShipBatchData {
  batch_update?: Batch_Key | null;
}
```
### Using `ShipBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, shipBatch, ShipBatchVariables } from '@bf-ims/dataconnect';

// The `ShipBatch` mutation requires an argument of type `ShipBatchVariables`:
const shipBatchVars: ShipBatchVariables = {
  id: ..., 
};

// Call the `shipBatch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await shipBatch(shipBatchVars);
// Variables can be defined inline as well.
const { data } = await shipBatch({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await shipBatch(dataConnect, shipBatchVars);

console.log(data.batch_update);

// Or, you can use the `Promise` API.
shipBatch(shipBatchVars).then((response) => {
  const data = response.data;
  console.log(data.batch_update);
});
```

### Using `ShipBatch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, shipBatchRef, ShipBatchVariables } from '@bf-ims/dataconnect';

// The `ShipBatch` mutation requires an argument of type `ShipBatchVariables`:
const shipBatchVars: ShipBatchVariables = {
  id: ..., 
};

// Call the `shipBatchRef()` function to get a reference to the mutation.
const ref = shipBatchRef(shipBatchVars);
// Variables can be defined inline as well.
const ref = shipBatchRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = shipBatchRef(dataConnect, shipBatchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.batch_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.batch_update);
});
```

## DeliverBatch
You can execute the `DeliverBatch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deliverBatch(vars: DeliverBatchVariables): MutationPromise<DeliverBatchData, DeliverBatchVariables>;

interface DeliverBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeliverBatchVariables): MutationRef<DeliverBatchData, DeliverBatchVariables>;
}
export const deliverBatchRef: DeliverBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deliverBatch(dc: DataConnect, vars: DeliverBatchVariables): MutationPromise<DeliverBatchData, DeliverBatchVariables>;

interface DeliverBatchRef {
  ...
  (dc: DataConnect, vars: DeliverBatchVariables): MutationRef<DeliverBatchData, DeliverBatchVariables>;
}
export const deliverBatchRef: DeliverBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deliverBatchRef:
```typescript
const name = deliverBatchRef.operationName;
console.log(name);
```

### Variables
The `DeliverBatch` mutation requires an argument of type `DeliverBatchVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeliverBatchVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeliverBatch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeliverBatchData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeliverBatchData {
  batch_update?: Batch_Key | null;
}
```
### Using `DeliverBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deliverBatch, DeliverBatchVariables } from '@bf-ims/dataconnect';

// The `DeliverBatch` mutation requires an argument of type `DeliverBatchVariables`:
const deliverBatchVars: DeliverBatchVariables = {
  id: ..., 
};

// Call the `deliverBatch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deliverBatch(deliverBatchVars);
// Variables can be defined inline as well.
const { data } = await deliverBatch({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deliverBatch(dataConnect, deliverBatchVars);

console.log(data.batch_update);

// Or, you can use the `Promise` API.
deliverBatch(deliverBatchVars).then((response) => {
  const data = response.data;
  console.log(data.batch_update);
});
```

### Using `DeliverBatch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deliverBatchRef, DeliverBatchVariables } from '@bf-ims/dataconnect';

// The `DeliverBatch` mutation requires an argument of type `DeliverBatchVariables`:
const deliverBatchVars: DeliverBatchVariables = {
  id: ..., 
};

// Call the `deliverBatchRef()` function to get a reference to the mutation.
const ref = deliverBatchRef(deliverBatchVars);
// Variables can be defined inline as well.
const ref = deliverBatchRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deliverBatchRef(dataConnect, deliverBatchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.batch_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.batch_update);
});
```

## UpdateBatchNotes
You can execute the `UpdateBatchNotes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateBatchNotes(vars: UpdateBatchNotesVariables): MutationPromise<UpdateBatchNotesData, UpdateBatchNotesVariables>;

interface UpdateBatchNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBatchNotesVariables): MutationRef<UpdateBatchNotesData, UpdateBatchNotesVariables>;
}
export const updateBatchNotesRef: UpdateBatchNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBatchNotes(dc: DataConnect, vars: UpdateBatchNotesVariables): MutationPromise<UpdateBatchNotesData, UpdateBatchNotesVariables>;

interface UpdateBatchNotesRef {
  ...
  (dc: DataConnect, vars: UpdateBatchNotesVariables): MutationRef<UpdateBatchNotesData, UpdateBatchNotesVariables>;
}
export const updateBatchNotesRef: UpdateBatchNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBatchNotesRef:
```typescript
const name = updateBatchNotesRef.operationName;
console.log(name);
```

### Variables
The `UpdateBatchNotes` mutation requires an argument of type `UpdateBatchNotesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBatchNotesVariables {
  id: UUIDString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateBatchNotes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBatchNotesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBatchNotesData {
  batch_update?: Batch_Key | null;
}
```
### Using `UpdateBatchNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBatchNotes, UpdateBatchNotesVariables } from '@bf-ims/dataconnect';

// The `UpdateBatchNotes` mutation requires an argument of type `UpdateBatchNotesVariables`:
const updateBatchNotesVars: UpdateBatchNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateBatchNotes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBatchNotes(updateBatchNotesVars);
// Variables can be defined inline as well.
const { data } = await updateBatchNotes({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBatchNotes(dataConnect, updateBatchNotesVars);

console.log(data.batch_update);

// Or, you can use the `Promise` API.
updateBatchNotes(updateBatchNotesVars).then((response) => {
  const data = response.data;
  console.log(data.batch_update);
});
```

### Using `UpdateBatchNotes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBatchNotesRef, UpdateBatchNotesVariables } from '@bf-ims/dataconnect';

// The `UpdateBatchNotes` mutation requires an argument of type `UpdateBatchNotesVariables`:
const updateBatchNotesVars: UpdateBatchNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateBatchNotesRef()` function to get a reference to the mutation.
const ref = updateBatchNotesRef(updateBatchNotesVars);
// Variables can be defined inline as well.
const ref = updateBatchNotesRef({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBatchNotesRef(dataConnect, updateBatchNotesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.batch_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.batch_update);
});
```

## UpsertCatalogEntry
You can execute the `UpsertCatalogEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertCatalogEntry(vars: UpsertCatalogEntryVariables): MutationPromise<UpsertCatalogEntryData, UpsertCatalogEntryVariables>;

interface UpsertCatalogEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCatalogEntryVariables): MutationRef<UpsertCatalogEntryData, UpsertCatalogEntryVariables>;
}
export const upsertCatalogEntryRef: UpsertCatalogEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCatalogEntry(dc: DataConnect, vars: UpsertCatalogEntryVariables): MutationPromise<UpsertCatalogEntryData, UpsertCatalogEntryVariables>;

interface UpsertCatalogEntryRef {
  ...
  (dc: DataConnect, vars: UpsertCatalogEntryVariables): MutationRef<UpsertCatalogEntryData, UpsertCatalogEntryVariables>;
}
export const upsertCatalogEntryRef: UpsertCatalogEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCatalogEntryRef:
```typescript
const name = upsertCatalogEntryRef.operationName;
console.log(name);
```

### Variables
The `UpsertCatalogEntry` mutation requires an argument of type `UpsertCatalogEntryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertCatalogEntryVariables {
  barcode: string;
  name: string;
  brand: string;
  type: string;
  price?: string | null;
  color?: string | null;
  keyIngredients?: string | null;
  source: string;
}
```
### Return Type
Recall that executing the `UpsertCatalogEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCatalogEntryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCatalogEntryData {
  productCatalog_upsert: ProductCatalog_Key;
}
```
### Using `UpsertCatalogEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCatalogEntry, UpsertCatalogEntryVariables } from '@bf-ims/dataconnect';

// The `UpsertCatalogEntry` mutation requires an argument of type `UpsertCatalogEntryVariables`:
const upsertCatalogEntryVars: UpsertCatalogEntryVariables = {
  barcode: ..., 
  name: ..., 
  brand: ..., 
  type: ..., 
  price: ..., // optional
  color: ..., // optional
  keyIngredients: ..., // optional
  source: ..., 
};

// Call the `upsertCatalogEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCatalogEntry(upsertCatalogEntryVars);
// Variables can be defined inline as well.
const { data } = await upsertCatalogEntry({ barcode: ..., name: ..., brand: ..., type: ..., price: ..., color: ..., keyIngredients: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCatalogEntry(dataConnect, upsertCatalogEntryVars);

console.log(data.productCatalog_upsert);

// Or, you can use the `Promise` API.
upsertCatalogEntry(upsertCatalogEntryVars).then((response) => {
  const data = response.data;
  console.log(data.productCatalog_upsert);
});
```

### Using `UpsertCatalogEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCatalogEntryRef, UpsertCatalogEntryVariables } from '@bf-ims/dataconnect';

// The `UpsertCatalogEntry` mutation requires an argument of type `UpsertCatalogEntryVariables`:
const upsertCatalogEntryVars: UpsertCatalogEntryVariables = {
  barcode: ..., 
  name: ..., 
  brand: ..., 
  type: ..., 
  price: ..., // optional
  color: ..., // optional
  keyIngredients: ..., // optional
  source: ..., 
};

// Call the `upsertCatalogEntryRef()` function to get a reference to the mutation.
const ref = upsertCatalogEntryRef(upsertCatalogEntryVars);
// Variables can be defined inline as well.
const ref = upsertCatalogEntryRef({ barcode: ..., name: ..., brand: ..., type: ..., price: ..., color: ..., keyIngredients: ..., source: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCatalogEntryRef(dataConnect, upsertCatalogEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.productCatalog_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.productCatalog_upsert);
});
```

## IncrementCatalogUsage
You can execute the `IncrementCatalogUsage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
incrementCatalogUsage(vars: IncrementCatalogUsageVariables): MutationPromise<IncrementCatalogUsageData, IncrementCatalogUsageVariables>;

interface IncrementCatalogUsageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: IncrementCatalogUsageVariables): MutationRef<IncrementCatalogUsageData, IncrementCatalogUsageVariables>;
}
export const incrementCatalogUsageRef: IncrementCatalogUsageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
incrementCatalogUsage(dc: DataConnect, vars: IncrementCatalogUsageVariables): MutationPromise<IncrementCatalogUsageData, IncrementCatalogUsageVariables>;

interface IncrementCatalogUsageRef {
  ...
  (dc: DataConnect, vars: IncrementCatalogUsageVariables): MutationRef<IncrementCatalogUsageData, IncrementCatalogUsageVariables>;
}
export const incrementCatalogUsageRef: IncrementCatalogUsageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the incrementCatalogUsageRef:
```typescript
const name = incrementCatalogUsageRef.operationName;
console.log(name);
```

### Variables
The `IncrementCatalogUsage` mutation requires an argument of type `IncrementCatalogUsageVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface IncrementCatalogUsageVariables {
  barcode: string;
}
```
### Return Type
Recall that executing the `IncrementCatalogUsage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `IncrementCatalogUsageData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface IncrementCatalogUsageData {
  productCatalog_update?: ProductCatalog_Key | null;
}
```
### Using `IncrementCatalogUsage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, incrementCatalogUsage, IncrementCatalogUsageVariables } from '@bf-ims/dataconnect';

// The `IncrementCatalogUsage` mutation requires an argument of type `IncrementCatalogUsageVariables`:
const incrementCatalogUsageVars: IncrementCatalogUsageVariables = {
  barcode: ..., 
};

// Call the `incrementCatalogUsage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await incrementCatalogUsage(incrementCatalogUsageVars);
// Variables can be defined inline as well.
const { data } = await incrementCatalogUsage({ barcode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await incrementCatalogUsage(dataConnect, incrementCatalogUsageVars);

console.log(data.productCatalog_update);

// Or, you can use the `Promise` API.
incrementCatalogUsage(incrementCatalogUsageVars).then((response) => {
  const data = response.data;
  console.log(data.productCatalog_update);
});
```

### Using `IncrementCatalogUsage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, incrementCatalogUsageRef, IncrementCatalogUsageVariables } from '@bf-ims/dataconnect';

// The `IncrementCatalogUsage` mutation requires an argument of type `IncrementCatalogUsageVariables`:
const incrementCatalogUsageVars: IncrementCatalogUsageVariables = {
  barcode: ..., 
};

// Call the `incrementCatalogUsageRef()` function to get a reference to the mutation.
const ref = incrementCatalogUsageRef(incrementCatalogUsageVars);
// Variables can be defined inline as well.
const ref = incrementCatalogUsageRef({ barcode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = incrementCatalogUsageRef(dataConnect, incrementCatalogUsageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.productCatalog_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.productCatalog_update);
});
```

