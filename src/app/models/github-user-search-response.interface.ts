import { IGithubUserProfile } from './';

export interface IGithubUserSearchResponse {
  total_count: number;
  items: IGithubUserProfile[];
}
  