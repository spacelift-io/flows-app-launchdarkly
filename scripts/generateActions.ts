import refParser from "@apidevtools/json-schema-ref-parser";
import { join } from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import { toKebabCase, fieldNameToDisplayName } from "./utils.ts";
import type { JsonSchema } from "@slflows/sdk/v1";

// Load the spec.json file
const specPath = join(process.cwd(), "spec.json");
let schema: any;

try {
  schema = await refParser.dereference(specPath);
} catch (error) {
  console.error("Failed to load spec.json:", error);
  process.exit(1);
}

const ACTIONS_DIR = "./blocks";
// Properties to remove: unsupported by SDK JsonSchema type or unnecessary
const UNUSED_PROPS = [
  "example",
  "examples",
  "title",
  "contentEncoding",
  "format",
  "pattern",
  "minimum",
  "maximum",
  "minLength",
  "maxLength",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minProperties",
  "maxProperties",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  "default",
  "readOnly",
  "writeOnly",
  "deprecated",
  "nullable",
  "$schema",
  "$id",
  "$ref",
  "$comment",
];

/**
 * Cleans OpenAPI schema by removing unused properties
 */
function cleanSchema(obj: unknown, seen = new WeakSet()): unknown {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  // Prevent circular references
  if (seen.has(obj as object)) {
    return {};
  }
  seen.add(obj as object);

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanSchema(item, seen));
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip undefined values - they cause TypeScript errors in oneOf schemas
    if (value === undefined) {
      continue;
    }

    if (!UNUSED_PROPS.includes(key)) {
      // Fix invalid additionalProperties: {} -> true
      if (
        key === "additionalProperties" &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      ) {
        result[key] = true;
      }
      // Fix invalid required: {} -> []
      else if (
        key === "required" &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        // Convert object to array or default to empty array
        result[key] = [];
      }
      // Fix invalid properties: {} -> omit it
      else if (
        key === "properties" &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        const cleaned = cleanSchema(value, seen);
        // Skip if properties is empty after cleaning
        if (
          typeof cleaned === "object" &&
          cleaned !== null &&
          !Array.isArray(cleaned) &&
          Object.keys(cleaned).length === 0
        ) {
          continue;
        }
        result[key] = cleaned;
      } else {
        const cleaned = cleanSchema(value, seen);
        // Skip if cleaning resulted in undefined
        if (cleaned !== undefined) {
          result[key] = cleaned;
        }
      }
    }
  }

  return result;
}

/**
 * Converts field names to simplified types for the block config
 */
function convertToAppropriateType(jsonSchemaType: any): any {
  if (typeof jsonSchemaType === "string") {
    return jsonSchemaType === "integer" ? "number" : jsonSchemaType;
  }

  if (jsonSchemaType && typeof jsonSchemaType === "object") {
    // Handle simple types
    if (
      jsonSchemaType.type &&
      typeof jsonSchemaType.type === "string" &&
      !jsonSchemaType.properties &&
      !jsonSchemaType.items
    ) {
      const simpleType =
        jsonSchemaType.type === "integer" ? "number" : jsonSchemaType.type;
      // For "object" type, return as schema object instead of string literal
      if (simpleType === "object") {
        return { type: "object" };
      }
      return simpleType;
    }

    // Handle simple arrays with primitive items (not objects)
    if (
      jsonSchemaType.type === "array" &&
      jsonSchemaType.items &&
      jsonSchemaType.items.type &&
      typeof jsonSchemaType.items.type === "string" &&
      jsonSchemaType.items.type !== "object" &&
      !jsonSchemaType.items.properties
    ) {
      const itemType =
        jsonSchemaType.items.type === "integer"
          ? "number"
          : jsonSchemaType.items.type;
      return [itemType];
    }

    // Handle arrays of objects or complex items - return full schema
    if (jsonSchemaType.type === "array" && jsonSchemaType.items) {
      // If items has properties or is explicitly object type, use full schema
      if (
        jsonSchemaType.items.type === "object" ||
        jsonSchemaType.items.properties
      ) {
        return simplifySchema({
          type: "array",
          items: jsonSchemaType.items,
        });
      }
      // If items is an empty object {}, assume it's an object array
      if (
        typeof jsonSchemaType.items === "object" &&
        !jsonSchemaType.items.type &&
        !jsonSchemaType.items.properties &&
        Object.keys(jsonSchemaType.items).length === 0
      ) {
        return {
          type: "array",
          items: { type: "object" },
        };
      }
    }

    // Handle array without items - default to object array
    if (jsonSchemaType.type === "array" && !jsonSchemaType.items) {
      return {
        type: "array",
        items: { type: "object" },
      };
    }

    // For other complex objects, simplify them to match SDK JsonSchema type
    const simplified = simplifySchema(jsonSchemaType);

    // If we have an array type but items is missing or empty after simplification, default to object array
    if (
      typeof simplified === "object" &&
      simplified !== null &&
      !Array.isArray(simplified) &&
      simplified.type === "array" &&
      (!simplified.items ||
        (typeof simplified.items === "object" &&
          !Array.isArray(simplified.items) &&
          Object.keys(simplified.items).length === 0))
    ) {
      return {
        type: "array",
        items: { type: "object" },
      };
    }

    return simplified;
  }

  return jsonSchemaType as JsonSchema;
}

/**
 * Converts JSON schema to AppBlock config format
 */
function convertJsonSchemaToAppBlockConfig(
  jsonSchema: any,
): Record<string, any> {
  const config: Record<string, any> = {};
  if (!jsonSchema.properties) {
    return config;
  }

  const requiredSet = new Set(jsonSchema.required || []);
  const allFieldNames = Object.keys(jsonSchema.properties).sort((a, b) => {
    const aIsRequired = requiredSet.has(a);
    const bIsRequired = requiredSet.has(b);
    if (aIsRequired !== bIsRequired) {
      return aIsRequired ? -1 : 1;
    }
    return a.localeCompare(b);
  });

  for (const fieldName of allFieldNames) {
    const fieldSchema = jsonSchema.properties[fieldName];
    const isRequired = requiredSet.has(fieldName);

    let fieldType = convertToAppropriateType(fieldSchema);

    // Safety check: if type is empty array, default to array of objects
    if (Array.isArray(fieldType) && fieldType.length === 0) {
      fieldType = {
        type: "array",
        items: { type: "object" },
      };
    }

    config[fieldName] = {
      name: fieldNameToDisplayName(fieldName),
      description: fieldSchema.description || "",
      type: fieldType,
      required: isRequired,
    };
  }

  return config;
}

/**
 * Converts object to TypeScript string representation
 */
function objectToTsString(obj: any, indent = 0): string {
  if (obj === null) return "null";
  if (typeof obj === "string") {
    return `"${JSON.stringify(obj).slice(1, -1)}"`;
  }
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    const items = obj.map((item) => objectToTsString(item, indent + 2));
    return `[\n${" ".repeat(indent + 2)}${items.join(`,\n${" ".repeat(indent + 2)}`)}\n${" ".repeat(indent)}]`;
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    const props = entries.map(([key, value]) => {
      const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : `"${key}"`;
      return `${" ".repeat(indent + 2)}${quotedKey}: ${objectToTsString(value, indent + 2)}`;
    });
    return `{\n${props.join(",\n")}\n${" ".repeat(indent)}}`;
  }
  return "undefined";
}

/**
 * Extracts path parameters from OpenAPI path
 */
function extractPathParams(path: string): string[] {
  const matches = path.match(/{([^}]+)}/g);
  return matches ? matches.map((match) => match.slice(1, -1)) : [];
}

/**
 * Gets input schema from OpenAPI spec
 */
function getInputSchema(path: string, method: string) {
  const endpoint = (schema.paths as any)[path];
  if (!endpoint || !endpoint[method]) {
    return {};
  }

  const operation = endpoint[method];
  const properties: Record<string, any> = {};
  const required: string[] = [];

  // Process path parameters
  if (operation.parameters) {
    operation.parameters.forEach((param: any) => {
      if (param.in === "path" || param.in === "query") {
        const paramSchema = param.schema || { type: "string" };
        if (param.description) {
          paramSchema.description = param.description;
        }
        properties[param.name] = paramSchema;
        if (param.required) {
          required.push(param.name);
        }
      }
    });
  }

  // Process request body
  if (
    operation.requestBody?.content?.["application/json"]?.schema?.properties
  ) {
    const bodySchema = operation.requestBody.content["application/json"].schema;
    Object.entries(bodySchema.properties).forEach(([key, value]) => {
      properties[key] = value;
    });

    if (bodySchema.required) {
      bodySchema.required.forEach((field: string) => {
        required.push(field);
      });
    }
  }

  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

/**
 * Simplifies schema to only include SDK-supported JsonSchema properties
 */
function simplifySchema(obj: any): any {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => simplifySchema(item));
  }

  const result: any = {};

  // Only keep properties that SDK's JsonSchema supports
  const supportedProps = [
    "type",
    "properties",
    "items",
    "required",
    "enum",
    "anyOf",
    "oneOf",
    "description",
    "additionalProperties",
  ];

  for (const key of supportedProps) {
    if (key in obj) {
      if (key === "additionalProperties") {
        // additionalProperties must be boolean or simple object with ONLY type property
        const val = obj[key];
        if (typeof val === "boolean") {
          result[key] = val;
        } else if (
          typeof val === "object" &&
          val !== null &&
          val.type &&
          typeof val.type === "string"
        ) {
          // Only include if it's a simple type object without complex properties
          const simpleTypes = [
            "string",
            "number",
            "boolean",
            "object",
            "array",
          ];
          // Check for any properties other than 'type' and 'description'
          const otherProps = Object.keys(val).filter(
            (k) => k !== "type" && k !== "description",
          );
          if (simpleTypes.includes(val.type) && otherProps.length === 0) {
            result[key] = { type: val.type };
          } else {
            // If complex (has properties, required, items, etc), just allow any additional properties
            result[key] = true;
          }
        } else {
          // Default to true for unsupported structures
          result[key] = true;
        }
      } else if (key === "properties" && typeof obj[key] === "object") {
        // Recursively simplify properties, filtering out undefined and empty object values
        result[key] = {};
        for (const [propKey, propVal] of Object.entries(obj[key])) {
          if (propVal !== undefined) {
            let simplified = simplifySchema(propVal);
            // Filter out empty objects
            if (
              !(
                typeof simplified === "object" &&
                simplified !== null &&
                !Array.isArray(simplified) &&
                Object.keys(simplified).length === 0
              )
            ) {
              // If property has oneOf/anyOf, simplify to just {type: "object"} to avoid TS inference issues
              if (
                typeof simplified === "object" &&
                simplified !== null &&
                !Array.isArray(simplified) &&
                (simplified.oneOf || simplified.anyOf)
              ) {
                simplified = { type: "object" };
              }
              result[key][propKey] = simplified;
            }
          }
        }
      } else if (
        (key === "anyOf" || key === "oneOf") &&
        Array.isArray(obj[key])
      ) {
        // Recursively simplify schema arrays, filtering out properties with undefined values
        result[key] = obj[key].map((item: any) => {
          const simplified = simplifySchema(item);
          // If the item has properties, filter out undefined values
          if (
            simplified &&
            typeof simplified === "object" &&
            simplified.properties
          ) {
            const filteredProps: any = {};
            for (const [propKey, propVal] of Object.entries(
              simplified.properties,
            )) {
              if (propVal !== undefined) {
                filteredProps[propKey] = propVal;
              }
            }
            simplified.properties = filteredProps;
          }
          return simplified;
        });
      } else if (key === "items") {
        const simplified = simplifySchema(obj[key]);
        // If items simplified to empty object, default to object type
        if (
          typeof simplified === "object" &&
          simplified !== null &&
          !Array.isArray(simplified) &&
          Object.keys(simplified).length === 0
        ) {
          result[key] = { type: "object" };
        } else {
          result[key] = simplified;
        }
      } else {
        result[key] = obj[key];
      }
    }
  }

  // Post-process: remove `required` if it references properties that don't exist
  if (result.required && Array.isArray(result.required) && result.properties) {
    const existingProps = new Set(Object.keys(result.properties));
    result.required = result.required.filter((prop: string) =>
      existingProps.has(prop),
    );
    // Remove required array if it's now empty
    if (result.required.length === 0) {
      delete result.required;
    }
  }

  // Post-process: if schema has both properties/required AND oneOf/anyOf, remove properties/required
  // This is an invalid schema structure - oneOf/anyOf should be the only structure
  if (
    (result.oneOf || result.anyOf) &&
    (result.properties || result.required)
  ) {
    delete result.properties;
    delete result.required;
  }

  // Post-process: if schema has oneOf/anyOf but no type, add type: "object"
  // This helps TypeScript better infer the schema type
  if ((result.oneOf || result.anyOf) && !result.type) {
    result.type = "object";
  }

  return result;
}

/**
 * Gets output schema from OpenAPI spec
 */
function getOutputSchema(path: string, method: string) {
  const endpoint = (schema.paths as any)[path];
  if (!endpoint || !endpoint[method]) {
    return {};
  }

  const operation = endpoint[method];
  const successResponse =
    operation.responses?.["200"] ||
    operation.responses?.["201"] ||
    operation.responses?.["204"];

  if (!successResponse?.content?.["application/json"]?.schema) {
    return {};
  }

  const cleaned = cleanSchema(
    successResponse.content["application/json"].schema,
  );
  return simplifySchema(cleaned);
}

/**
 * Generates TypeScript action file
 */
function generateActionFile(
  actionName: string,
  path: string,
  method: string,
  category: string,
  inputSchema: any,
  outputSchema: any,
): string {
  const httpMethod = method.toUpperCase();
  const pathParams = extractPathParams(path);
  const hasBody = ["post", "put", "patch"].includes(method.toLowerCase());

  // Convert path to template literal format
  let pathTemplate = path.replace(/{([^}]+)}/g, "${$1}");

  // Determine what parameters to destructure
  const destructureParams = [...pathParams];

  // Build destructure string
  let destructureString = "";
  if (destructureParams.length > 0 && hasBody) {
    destructureString = `const { ${destructureParams.join(", ")}, ...inputData } = input.event.inputConfig;`;
  } else if (destructureParams.length > 0) {
    destructureString = `const { ${destructureParams.join(", ")} } = input.event.inputConfig;`;
  } else if (hasBody) {
    destructureString = `const inputData = input.event.inputConfig;`;
  }

  // Build URL construction
  const urlConstruction = `
        const endpoint = \`${pathTemplate}\`;`;

  // Build method options and imports
  const methodOptions = hasBody
    ? `{\n              method: "${httpMethod}",\n              body: filterDefinedParams(inputData),\n            }`
    : `{ method: "${httpMethod}" }`;

  const imports = hasBody
    ? `import { makeLaunchDarklyApiRequest, filterDefinedParams } from "../../utils/apiHelpers.ts";`
    : `import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";`;

  // Generate operation description
  const operationMap: Record<string, string> = {
    get: "Retrieves",
    post: "Creates",
    put: "Updates",
    patch: "Updates",
    delete: "Deletes",
  };
  const operation = operationMap[method] || "Manages";
  const description = `${operation} ${fieldNameToDisplayName(actionName).toLowerCase()} in LaunchDarkly`;

  return `import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
${imports}

// Input schema for ${fieldNameToDisplayName(actionName)}
const inputSchema: Record<string, AppBlockConfigField> = ${objectToTsString(inputSchema)};

// Output schema for ${fieldNameToDisplayName(actionName)}
const outputSchema = ${objectToTsString(outputSchema)};

export default {
  name: "${fieldNameToDisplayName(actionName)}",
  description: "${description}",
  category: "${category}",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        ${destructureString}${urlConstruction}

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(
            apiKey,
            baseUrl,
            endpoint,
            ${methodOptions}
          )
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
`;
}

/**
 * Write action file to disk
 */
async function writeActionFile(
  category: string,
  actionName: string,
  content: string,
): Promise<void> {
  const fileName = `${actionName}.ts`;
  const cleanCategory = toKebabCase(category);
  const filePath = `${ACTIONS_DIR}/${cleanCategory}/${fileName}`;
  const fullDirPath = join(process.cwd(), `${ACTIONS_DIR}/${cleanCategory}`);

  await mkdir(fullDirPath, { recursive: true });
  await writeFile(join(process.cwd(), filePath), content);
  console.log(`Generated action: ${filePath}`);
}

/**
 * Generate action with schemas
 */
async function generateActionWithSchemas(
  actionName: string,
  path: string,
  method: string,
  category: string,
) {
  const endpoint = (schema.paths as any)[path];
  if (!endpoint || !endpoint[method]) {
    console.warn(`Could not find operation for ${path} ${method}`);
    return;
  }

  const outputSchemaRaw = getOutputSchema(path, method);
  const outputSchema = outputSchemaRaw
    ? cleanSchema(outputSchemaRaw)
    : { type: "object" };

  const inputSchemaNode = getInputSchema(path, method);
  const inputSchema =
    !inputSchemaNode || Object.keys(inputSchemaNode).length === 0
      ? {}
      : convertJsonSchemaToAppBlockConfig(cleanSchema(inputSchemaNode));

  const actionContent = generateActionFile(
    actionName,
    path,
    method,
    category,
    inputSchema,
    outputSchema,
  );
  await writeActionFile(toKebabCase(category), actionName, actionContent);
}

/**
 * Generate blocks index file
 */
async function generateBlocksIndex(blocksByCategory: Record<string, string[]>) {
  const imports: string[] = [];
  const allBlocks: string[] = [];

  const sortedCategories = Object.keys(blocksByCategory).sort();

  for (const category of sortedCategories) {
    const blocks = blocksByCategory[category].sort();

    for (const blockName of blocks) {
      imports.push(
        `import ${blockName} from "./${toKebabCase(category)}/${blockName}.ts";`,
      );
      allBlocks.push(`  ${blockName}`);
    }
  }

  const exportObject = `export const blocks = {\n${allBlocks.join(",\n")},\n};`;
  const indexContent = `${imports.join("\n")}\n\n${exportObject}\n`;

  const indexPath = `${ACTIONS_DIR}/index.ts`;
  await writeFile(join(process.cwd(), indexPath), indexContent);
  console.log(`Generated blocks index: ${indexPath}`);
}

/**
 * Generates a camelCase action name from path and method
 */
function generateActionName(path: string, method: string): string {
  // Remove /api/v2 prefix and split into parts
  const pathParts = path
    .replace(/^\/api\/v2\/?/, "")
    .split("/")
    .filter((part) => part && !part.startsWith("{"));

  // Convert method to action verb
  const methodMap: Record<string, string> = {
    get: pathParts.length > 1 ? "get" : "list",
    post: "create",
    put: "update",
    patch: "update",
    delete: "delete",
  };

  const verb = methodMap[method.toLowerCase()] || method.toLowerCase();

  // Create action name from path parts, converting to camelCase
  const resourceName = pathParts
    .map((part) =>
      part
        .replace(/\./g, "_") // Replace dots with underscores
        .split(/[-_]/)
        .map((segment, i) =>
          i === 0
            ? segment
            : segment.charAt(0).toUpperCase() + segment.slice(1),
        )
        .join(""),
    )
    .map((part, i) =>
      i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join("");

  return verb + resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
}

// Main generation logic
const blocksByCategory: Record<string, string[]> = {};
const usedActionNames = new Map<string, number>(); // Track duplicates

// Iterate through all paths and methods in the OpenAPI spec
for (const [path, pathItem] of Object.entries(schema.paths as any)) {
  for (const method of ["get", "post", "put", "patch", "delete"]) {
    const operation = (pathItem as any)[method];
    if (!operation) continue;

    // Skip deprecated operations
    if (operation.deprecated) continue;

    const rawCategory = operation.tags?.[0] || "Other";
    // Remove (beta) suffix from category names
    const category = rawCategory.replace(/\s*\(beta\)\s*/gi, "").trim();
    let actionName = generateActionName(path, method);

    // Handle duplicates by appending a number
    const baseActionName = actionName;
    const count = usedActionNames.get(baseActionName) || 0;
    if (count > 0) {
      actionName = `${baseActionName}${count + 1}`;
    }
    usedActionNames.set(baseActionName, count + 1);

    if (!blocksByCategory[category]) {
      blocksByCategory[category] = [];
    }
    blocksByCategory[category].push(actionName);

    await generateActionWithSchemas(actionName, path, method, category);
  }
}

await generateBlocksIndex(blocksByCategory);
