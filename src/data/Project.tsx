export async function getTasksById(projectId: string) {
  try {
    const response = await fetch(`/api/project/${projectId}`);
    
    // Ensure successful response
    if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    
    // Parse and return JSON data
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { error: error || 'An unknown error occurred' };
  }
}
