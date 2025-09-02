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
  const client = getTodoistV1Client();
  const mappingResponse = await client.get<IdMappingResponse[]>(
    `/api/v1/id_mappings/${idType}/${v2Id}`
  );
  return mappingResponse.data[0].new_id;
}
