export interface MemberSearchResult {
  id: number;
  name: string;
  phoneNumberSuffix: string;
}

export interface SearchMembersResponse {
  members: MemberSearchResult[];
}
