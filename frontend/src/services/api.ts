import { OCRResult } from '../types';

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

export async function uploadAndProcessOCR(file: File, useMock: boolean = false): Promise<OCRResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/ocr/upload?use_mock=${useMock}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson.detail) errorDetail = errJson.detail;
    } catch (_) {}
    throw new Error(errorDetail || 'OCR processing failed');
  }

  return response.json();
}

export async function processPresetSample(sampleId: string, useMock: boolean = false): Promise<OCRResult> {
  const response = await fetch(`${API_BASE_URL}/ocr/sample-preset/${sampleId}?use_mock=${useMock}`, {
    method: 'POST',
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson.detail) errorDetail = errJson.detail;
    } catch (_) {}
    throw new Error(errorDetail || 'Preset processing failed');
  }

  return response.json();
}

export async function getSamplePresets(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/ocr/sample-presets`);
  if (!response.ok) {
    throw new Error(`Failed to load presets: ${response.statusText}`);
  }
  const data = await response.json();
  return data.presets || [];
}
