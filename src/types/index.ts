/**
 * Global type definitions
 */

export type PageType = 
  | "dashboard" 
  | "health-index" 
  | "sales-management" 
  | "marketing" 
  | "reservations" 
  | "ai-coach" 
  | "news" 
  | "settings"
  | "schedule";

export interface User {
  id: string;
  name: string;
  email: string;
}

