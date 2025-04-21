export async function getTasksById(projectId: string) {
  try {
    const response = await fetch(`/api/project/${projectId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        // tu peux return un tableau vide ou une valeur spéciale
        return []; // ou throw une erreur custom si tu préfères
      }
    
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { error: error || 'An unknown error occurred' };
  }
}
