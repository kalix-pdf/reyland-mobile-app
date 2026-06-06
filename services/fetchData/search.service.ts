import { fetchOne, type paginatedResponse } from '@/services/fetchData/api-client';
import type { Project, Property } from '@/types';

interface SearchProjectsParams {
  query: string;
  signal: AbortSignal;
}

interface SearchPropertiesParams {
  projectId: number;
  query: string;
  signal: AbortSignal;
}

interface SearchProjectAndPropertiesParams {
  query: string;
  signal: AbortSignal;
}

export interface SearchProjectAndPropertiesResult {
  projects: paginatedResponse<Project>;
  properties: paginatedResponse<Property>;
}

const SEARCH_BASE = '/admin/search';
const PROPERTIES_SEARCH_BASE = '/admin/properties'

async function searchResource<T>(endpoint: string, query: string, signal: AbortSignal ): Promise<T[] | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  return fetchOne<T[]>(endpoint, {
    params: { q: trimmed, mode: 'mobile' },
    signal,
  });
}

/**
 * Searches projects on the server. Returns null when the query is empty so the
 * caller can fall back to local data.
 */
export function searchProjects({query, signal}: SearchProjectsParams): Promise<Project[] | null> {
  return searchResource<Project>(`${SEARCH_BASE}/projects`, query, signal);
}

/**
 * Searches properties for a project on the server. Returns null when the query
 * is empty so the caller can fall back to local data.
 */
export function searchProperties({projectId, query, signal}: SearchPropertiesParams): Promise<Property[] | null> {
  return searchResource<Property>(
    `${PROPERTIES_SEARCH_BASE}/search/${projectId}/properties`,
    query,
    signal,
  );
}
 
export function searchProject_and_Properties({
  query,
  signal,
}: SearchProjectAndPropertiesParams): Promise<SearchProjectAndPropertiesResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return Promise.resolve(null);

  return fetchOne<SearchProjectAndPropertiesResult>(
    `${SEARCH_BASE}/project-property`,
    {
      params: { q: trimmed, mode: 'mobile' },
      signal,
    },
  );
}
