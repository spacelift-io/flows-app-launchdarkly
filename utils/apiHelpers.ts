/**
 * Makes an authenticated request to the LaunchDarkly API
 */
export async function makeLaunchDarklyApiRequest(
  apiKey: string,
  baseUrl: string,
  endpoint: string,
  options: { method?: string; body?: Record<string, any> } = {},
): Promise<any> {
  const url = `${baseUrl}${endpoint}`;
  const { method = "GET", body } = options;

  const headers: Record<string, string> = {
    Authorization: apiKey,
    "Content-Type": "application/json",
  };

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LaunchDarkly API error (${response.status}): ${errorText}`,
    );
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return { success: true };
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
}

/**
 * Filters out undefined values from an object
 */
export function filterDefinedParams(
  obj: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}
