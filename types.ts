export interface AccountData {
  id: string;
  email: string;
  password: string;
  timestamp: string;
  status: 'pending' | 'success' | 'failed';
  message?: string;
}

export interface FieldMapping {
  email: string;
  password: string;
  confirmPassword: string;
  inviteCode: string;
}

export interface RegistrationConfig {
  targetUrl: string;
  count: number;
  inviteCode: string;
  delayMs: number; // Delay between requests to avoid browser freezing
  useMockMode: boolean; // For testing UI without actual API calls
  useProxy: boolean; // Use a CORS proxy to bypass browser restrictions
  contentType: 'json' | 'form-data'; // Support for different payload types
  fieldMapping: FieldMapping; // Custom field names
}

export interface Stats {
  total: number;
  success: number;
  failed: number;
  pending: number;
}