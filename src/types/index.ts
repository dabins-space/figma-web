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
  | "settings";

export interface User {
  id: string;
  name: string;
  email: string;
}

