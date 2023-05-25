import AddressAutoComplete from "./components/AddressAutoComplete";
import { ADDRESS_INPUT_TYPES } from "./constants";
import { Address, addressDefaultValue } from "./types";
import { addressSchema } from "./validations/address";

/*
`Address` is an interface that can be used by other interfaces or types that needs address implementation by extending it. (e.g. `interface Entity extends Address` )
*/
export type { Address };

/*
`addressDefaultValue` a default value to prefill the interface that extends `Address` interface
*/
export { addressDefaultValue };

/* 
`AddressAutoComplete`is a component to manipulate the `address` state. Whether by manual input or by selecting one of the suggestions from Google Places Autocomplete API. It must be wrapped inside `react-hook-form`'s <FormProvider></FormProvider> component in order to work. It uses `react-hook-form` validation.
*/
export { AddressAutoComplete };

/*
`addressSchema` is a validation schema. If a component wants to use `react-hook-form` validation, it is required to merge this schema into the schema of the main form.
*/
export { addressSchema };

/*
`ADDRESS_INPUT_TYPES` is an enum that returns string used to indicate whether a form is using a manual input or autocomplete from Google Places.
*/
export { ADDRESS_INPUT_TYPES };
