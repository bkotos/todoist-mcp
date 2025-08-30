import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getTodoistClient } from './client';

interface TodoistLabel {
  id: string;
  name: string;
  color: string;
  order: number;
  is_favorite: boolean;
}

interface LabelsResponse {
  labels: Array<{
    id: number;
    name: string;
    color: string;
    order: number;
    is_favorite: boolean;
  }>;
  total_count: number;
}

// Get error message
function getErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

// Get all labels function with caching - returns structured data
export async function getAllLabels(): Promise<
  LabelsResponse & { cached_at?: string }
> {
  try {
    // Cache configuration
    const CACHE_DIR = '.cache';
    const CACHE_FILE = path.join(CACHE_DIR, 'labels.json');
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 1 day

    // Ensure cache directory exists
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    // Check if cache is fresh
    let isCacheFresh = false;
    if (fs.existsSync(CACHE_FILE)) {
      const fileStats = fs.statSync(CACHE_FILE);
      isCacheFresh = Date.now() - fileStats.mtime.getTime() < CACHE_DURATION_MS;
    }

    // Try to read from cache if fresh
    if (isCacheFresh) {
      try {
        const cachedData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        return cachedData;
      } catch (cacheError) {
        console.warn(
          'Failed to read cache file, falling back to API:',
          cacheError
        );
      }
    }

    // Fetch from API
    const todoistClient = getTodoistClient();
    const response = await todoistClient.get<TodoistLabel[]>('/labels');
    const labels = response.data.map((label) => ({
      id: parseInt(label.id),
      name: label.name,
      color: label.color,
      order: label.order,
      is_favorite: label.is_favorite,
    }));

    const labelsData = {
      labels,
      total_count: labels.length,
    };

    // Create result with cache timestamp
    const result = {
      ...labelsData,
      cached_at: new Date().toISOString(),
    };

    // Write to cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    throw new Error(`Failed to get all labels: ${getErrorMessage(error)}`);
  }
}

// Get project labels function - returns structured data for labels that start with "PROJECT:"
export async function getProjectLabels(): Promise<LabelsResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistLabel[]>('/labels');
    const projectLabels = response.data
      .filter((label) => label.name.startsWith('PROJECT:'))
      .map((label) => ({
        id: parseInt(label.id),
        name: label.name,
        color: label.color,
        order: label.order,
        is_favorite: label.is_favorite,
      }));

    return {
      labels: projectLabels,
      total_count: projectLabels.length,
    };
  } catch (error) {
    throw new Error(`Failed to get project labels: ${getErrorMessage(error)}`);
  }
}

// Get context labels function - returns structured data for labels that start with "context:"
export async function getContextLabels(): Promise<LabelsResponse> {
  const todoistClient = getTodoistClient();

  try {
    const response = await todoistClient.get<TodoistLabel[]>('/labels');
    const contextLabels = response.data
      .filter((label) => label.name.startsWith('context:'))
      .map((label) => ({
        id: parseInt(label.id),
        name: label.name,
        color: label.color,
        order: label.order,
        is_favorite: label.is_favorite,
      }));

    return {
      labels: contextLabels,
      total_count: contextLabels.length,
    };
  } catch (error) {
    throw new Error(`Failed to get context labels: ${getErrorMessage(error)}`);
  }
}

// Export types for testing
export type { TodoistLabel, LabelsResponse };
