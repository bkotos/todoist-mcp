import fs from 'fs';
import path from 'path';
import type { ProjectsResponse } from '../services/projects/projects';

// Helper function to get cache configuration
function getCacheConfig() {
  const CACHE_DIR = '.cache';
  const CACHE_FILE = path.join(CACHE_DIR, 'projects.json');
  const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day

  return { CACHE_DIR, CACHE_FILE, CACHE_DURATION_MS };
}

// Helper function to ensure cache directory exists
export function ensureCacheDirectory(): void {
  const { CACHE_DIR } = getCacheConfig();
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// Helper function to check if cache file is fresh (less than 1 day old)
export function isCacheFresh(): boolean {
  const { CACHE_FILE, CACHE_DURATION_MS } = getCacheConfig();

  if (!fs.existsSync(CACHE_FILE)) {
    return false;
  }

  const fileStats = fs.statSync(CACHE_FILE);
  return Date.now() - fileStats.mtime.getTime() < CACHE_DURATION_MS;
}

// Helper function to read cached data
export function readCachedData():
  | (ProjectsResponse & { cached_at?: string })
  | null {
  const { CACHE_FILE } = getCacheConfig();

  try {
    const cachedData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    return cachedData;
  } catch (cacheError) {
    console.warn('Failed to read cache file, falling back to API:', cacheError);
    return null;
  }
}

// Helper function to write data to cache
export function writeToCache(
  data: ProjectsResponse & { cached_at?: string }
): void {
  const { CACHE_FILE } = getCacheConfig();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}

// Helper function to create result with cache timestamp
export function createCachedResult(
  projectsData: ProjectsResponse
): ProjectsResponse & { cached_at: string } {
  return {
    ...projectsData,
    cached_at: new Date().toISOString(),
  };
}

// Helper function to try reading from cache
export function tryReadFromCache():
  | (ProjectsResponse & { cached_at?: string })
  | null {
  if (isCacheFresh()) {
    return readCachedData();
  }
  return null;
}
