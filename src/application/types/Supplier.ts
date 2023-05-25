export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  address: string;
  addressSuburb: string;
  addressState: string;
  addressPostcode: string;
  addressCountry: string;
  abn: string;
  acn: string;
  phone: string;
  fax: string;
  mobile: string;
}

export const supplierDefaultValue = {
  id: "",
  name: "",
  contactName: "",
  address: "",
  addressSuburb: "",
  addressState: "",
  addressPostcode: "",
  addressCountry: "",
  abn: "",
  acn: "",
  phone: "",
  fax: "",
  mobile: "",
};
