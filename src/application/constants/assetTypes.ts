import { LabelValue } from "../../common/types/LabelValue";

export enum ASSET_TYPE_CATEGORIES {
  CARS_AND_LIGHT_TRUCKS = "CARS_AND_LIGHT_TRUCKS",
  PRIMARY_ASSETS = "PRIMARY_ASSETS",
  SECONDARY_ASSETS = "SECONDARY_ASSETS",
}

export enum CARS_AND_LIGHT_TRUCKS {
  PASSENGER_VEHICLES = "PASSENGER_VEHICLES",
  VANS_AND_UTES = "VANS_AND_UTES",
  LIGHT_TRUCKS = "LIGHT_TRUCKS",
}

export enum PRIMARY_ASSETS {
  HEAVY_TRUCKS = "HEAVY_TRUCKS",
  TRAILERS = "TRAILERS",
  BUS_AND_COACHES = "BUS_AND_COACHES",
  YELLOW_GOODS_AND_EXCAVATORS = "YELLOW_GOODS_AND_EXCAVATORS",
  CONSTRUCTION_AND_EARTHMOVING_EQUIPMENT = "CONSTRUCTION_AND_EARTHMOVING_EQUIPMENT",
  FARMING_AND_AGRICULTURE = "FARMING_AND_AGRICULTURE",
  FORKLIFTS_AND_WAREHOUSING_EQUIPMENT = "FORKLIFTS_AND_WAREHOUSING_EQUIPMENT",
  LANDSCAPING_AND_GREENKEEPING = "LANDSCAPING_AND_GREENKEEPING",
}

export enum SECONDARY_ASSETS {
  GENERATORS_AND_COMPRESSORS = "GENERATORS_AND_COMPRESSORS",
  ATTACHMENTS_FOR_EARTHMOVING = "ATTACHMENTS_FOR_EARTHMOVING",
  FOOD_PROCESSING_EQUIPMENT = "FOOD_PROCESSING_EQUIPMENT",
  ENGINEERING_AND_TOOLMAKING = "ENGINEERING_AND_TOOLMAKING",
  MECHANICAL_WORKSHOP_EQUIPMENT = "MECHANICAL_WORKSHOP_EQUIPMENT",
  WOODWORKING_AND_METALWORKING_EQUIPMENT = "WOODWORKING_AND_METALWORKING_EQUIPMENT",
  MINING_EQUIPMENT = "MINING_EQUIPMENT",
  MANUFACTURING_EQUIPMENT = "MANUFACTURING_EQUIPMENT",
  MEDICAL_DENTAL_LABORATORY_EQUIPMENT = "MEDICAL_DENTAL_LABORATORY_EQUIPMENT",
  PRINTING_AND_PACKAGING_EQUIPMENT = "PRINTING_AND_PACKAGING_EQUIPMENT",
  LAUNDRY_EQUIPMENT = "LAUNDRY_EQUIPMENT",
  LASERS = "LASERS",
  PLUMBING_EQUIPMENT = "PLUMBING_EQUIPMENT",
  CNC_AND_EDGE_BENDERS = "CNC_AND_EDGE_BENDERS",
  CLEANING_EQUIPMENT = "CLEANING_EQUIPMENT",
  OTHER = "OTHER",
}

type CustomType = LabelValue & {
  subTypes: LabelValue[];
};

export const ASSET_TYPE_LIST: CustomType[] = [
  {
    value: ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS,
    label: "Cars and light trucks",
    subTypes: [
      {
        value: CARS_AND_LIGHT_TRUCKS.PASSENGER_VEHICLES,
        label: "Passenger vehicles",
      },
      {
        value: CARS_AND_LIGHT_TRUCKS.VANS_AND_UTES,
        label: "Vans and utes",
      },
      {
        value: CARS_AND_LIGHT_TRUCKS.LIGHT_TRUCKS,
        label: "Light trucks up to 4.5 tonne",
      },
    ],
  },
  {
    value: ASSET_TYPE_CATEGORIES.PRIMARY_ASSETS,
    label: "Primary assets",
    subTypes: [
      {
        value: PRIMARY_ASSETS.HEAVY_TRUCKS,
        label: "Heavy trucks over 4.5 tonne",
      },
      { value: PRIMARY_ASSETS.TRAILERS, label: "Trailers" },
      { value: PRIMARY_ASSETS.BUS_AND_COACHES, label: "Bus and coaches" },
      {
        value: PRIMARY_ASSETS.YELLOW_GOODS_AND_EXCAVATORS,
        label: "Yellow goods and excavators",
      },
      {
        value: PRIMARY_ASSETS.CONSTRUCTION_AND_EARTHMOVING_EQUIPMENT,
        label: "Construction and earthmoving equipment",
      },
      {
        value: PRIMARY_ASSETS.FARMING_AND_AGRICULTURE,
        label: "Farming and agriculture",
      },
      {
        value: PRIMARY_ASSETS.FORKLIFTS_AND_WAREHOUSING_EQUIPMENT,
        label: "Forklifts and warehousing equipment",
      },
      {
        value: PRIMARY_ASSETS.LANDSCAPING_AND_GREENKEEPING,
        label: "Landscaping and greenkeeping",
      },
    ],
  },
  {
    value: ASSET_TYPE_CATEGORIES.SECONDARY_ASSETS,
    label: "Secondary assets",
    subTypes: [
      {
        value: SECONDARY_ASSETS.GENERATORS_AND_COMPRESSORS,
        label: "Generators and compressors",
      },
      {
        value: SECONDARY_ASSETS.ATTACHMENTS_FOR_EARTHMOVING,
        label: "Attachments for earthmoving",
      },
      {
        value: SECONDARY_ASSETS.ENGINEERING_AND_TOOLMAKING,
        label: "Engineering and toolmaking",
      },
      {
        value: SECONDARY_ASSETS.FOOD_PROCESSING_EQUIPMENT,
        label: "Food processing equipment",
      },
      {
        value: SECONDARY_ASSETS.MECHANICAL_WORKSHOP_EQUIPMENT,
        label: "Mechanical workshop equipment",
      },
      {
        value: SECONDARY_ASSETS.WOODWORKING_AND_METALWORKING_EQUIPMENT,
        label: "Woodworking and metalworking equipment",
      },
      { value: SECONDARY_ASSETS.MINING_EQUIPMENT, label: "Mining equipment" },
      {
        value: SECONDARY_ASSETS.MANUFACTURING_EQUIPMENT,
        label: "Manufacturing equipment",
      },
      {
        value: SECONDARY_ASSETS.MEDICAL_DENTAL_LABORATORY_EQUIPMENT,
        label: "Medical / dental / laboratory equipment",
      },
      {
        value: SECONDARY_ASSETS.PRINTING_AND_PACKAGING_EQUIPMENT,
        label: "Printing and packaging equipment",
      },
      {
        value: SECONDARY_ASSETS.LAUNDRY_EQUIPMENT,
        label: "Laundry equipment",
      },
      {
        value: SECONDARY_ASSETS.LASERS,
        label: "Lasers",
      },
      {
        value: SECONDARY_ASSETS.PLUMBING_EQUIPMENT,
        label: "Plumbing equipment",
      },
      {
        value: SECONDARY_ASSETS.CNC_AND_EDGE_BENDERS,
        label: "CNC and edge benders",
      },
      {
        value: SECONDARY_ASSETS.CLEANING_EQUIPMENT,
        label: "Cleaning Equipment",
      },
      {
        value: SECONDARY_ASSETS.OTHER,
        label: "Other",
      },
    ],
  },
];

export const DISABLED_ASSET_TYPE_LIST: string[] = [
  SECONDARY_ASSETS.FOOD_PROCESSING_EQUIPMENT,
  SECONDARY_ASSETS.ATTACHMENTS_FOR_EARTHMOVING,
  SECONDARY_ASSETS.MECHANICAL_WORKSHOP_EQUIPMENT,
  SECONDARY_ASSETS.MINING_EQUIPMENT,
  SECONDARY_ASSETS.MANUFACTURING_EQUIPMENT,
  SECONDARY_ASSETS.LAUNDRY_EQUIPMENT,
  SECONDARY_ASSETS.LASERS,
  SECONDARY_ASSETS.PLUMBING_EQUIPMENT,
  SECONDARY_ASSETS.CLEANING_EQUIPMENT,
];
