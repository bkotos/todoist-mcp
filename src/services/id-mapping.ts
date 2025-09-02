import { getTodoistV1Client } from './client';

interface IdMappingResponse {
  new_id: string;
  old_id: string;
}

/**
 * Convert a v2 ID to v1 format using the Todoist API
 * @param idType - The type of ID to convert ('tasks' or 'projects')
 * @param v2Id - The v2 format ID to convert
 * @returns Promise resolving to the v1 format ID
 */
export async function convertV2IdToV1(
  idType: 'tasks' | 'projects',
  v2Id: string
): Promise<string> {
  try {
    const client = getTodoistV1Client();
    const mappingResponse = await client.get<IdMappingResponse[]>(
      `/api/v1/id_mappings/${idType}/${v2Id}`
    );

    // Check if response array is empty
    if (!mappingResponse.data || mappingResponse.data.length === 0) {
      throw new Error('No mapping found');
    }

    return mappingResponse.data[0].new_id;
  } catch (error) {
    // Re-throw with consistent error message format
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to convert ID: ${errorMessage}`);
  }
}
