export type DesignVariableTypeKey = "color" | "other";

/**
 * @summary Defines the variables that clients can customize.
 */
export interface DesignVariableModel {
  id: number;
  orderIndex: number;
  name: string;
  description?: string;
  defaultValue?: string;
  value?: string;
  type: DesignVariableTypeKey;
}

/**
 * @summary Custom CSS for a client.
 */
export interface CustomStyleModel {
  id: number;
  customCss?: string;
  version?: string;
}
