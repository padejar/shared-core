import { Guarantor } from "./Guarantor";

export interface GuarantorsRequest {
  guarantors: Guarantor[];
  isDraft?: boolean;
}
