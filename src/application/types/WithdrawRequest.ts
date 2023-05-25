export interface WithdrawRequest {
  reasonId: number | null;
  statusReason: string;
}

export interface StatusReason {
  id: number;
  reason: string;
  statusGroup: string;
}
