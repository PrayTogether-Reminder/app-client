export interface FetchProfileResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string | null;
  provider: "LOCAL" | "GOOGLE";
}
