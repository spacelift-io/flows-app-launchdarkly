/**
 * Converts snake_case or kebab-case to camelCase
 */
export function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/[-_](.)/g, (_, char) => char.toUpperCase());
}

/**
 * Converts strings to kebab-case for directory names
 */
export function toKebabCase(str: string): string {
  return str.toLowerCase().replace(/[_\s]+/g, "-");
}

/**
 * Converts field names to display-friendly names
 * Examples: "feature_flag" -> "Feature Flag", "projectKey" -> "Project Key"
 */
export function fieldNameToDisplayName(fieldName: string): string {
  // Insert space before capital letters and after underscores/hyphens
  const withSpaces = fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .trim();

  // Capitalize first letter of each word
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
