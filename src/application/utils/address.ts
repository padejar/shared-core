import { Address, addressDefaultValue } from "../../address-autocomplete";
import { extractProperties } from "../../common/utils/object";

export const getAddressFromEntity = <T extends Address>(entity: T): Address => {
  return extractProperties<T>(
    entity,
    Object.keys(addressDefaultValue)
  ) as Address;
};
