/**
 * Checks if Ollama is installed and running on the local machine
 * @returns Promise<boolean> - true if Ollama is running, false otherwise
 */
export async function checkOllamaInstalled(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:11434', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    return text.includes('Ollama is running');
  } catch {
    // Network error or Ollama not running
    return false;
  }
}
