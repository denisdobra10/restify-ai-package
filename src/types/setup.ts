/**
 * Setup Mode Types
 */

export type SetupStep = 'welcome' | 'api-key' | 'testing' | 'backend-config' | 'complete'

export interface SetupState {
  isActive: boolean
  currentStep: SetupStep
  testApiKey: string | null
  connectionStatus: 'idle' | 'testing' | 'connected' | 'failed'
  backendConfigured: boolean
  lastError: string | null
}
