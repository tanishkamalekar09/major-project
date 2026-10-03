// API Client for ReguCheck AI Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function checkBackendHealth(): Promise<{ status: string; service: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
}

export async function testMockOCR(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/ocr/test-mock`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`OCR test failed: ${response.statusText}`);
  }
  return response.json();
}
