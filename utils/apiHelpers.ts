/**
 * LaunchDarkly REST API version sent with every request.
 *
 * LaunchDarkly pins tokens to the API version they were created with and
 * retires old versions (20220603 reached end of life on 2025-04-15). Sending
 * the header explicitly means the app behaves the same regardless of which
 * version the configured token defaults to. The block schemas in `blocks/`
 * are generated from the spec for this version, so keep them in sync when
 * bumping it.
 *
 * @see https://launchdarkly.com/docs/api#versioning
 */
export const LD_API_VERSION = "20240415";

/**
 * Makes an authenticated request to the LaunchDarkly API
 */
export async function makeLaunchDarklyApiRequest(
  apiKey: string,
  baseUrl: string,
  endpoint: string,
  options: {
    method?: string;
    body?: Record<string, any>;
    /**
     * Overrides the `LD-API-Version` header. Beta endpoints require the
     * literal value `"beta"` instead of a dated version.
     */
    apiVersion?: string;
  } = {},
): Promise<any> {
  const url = `${baseUrl}${endpoint}`;
  const { method = "GET", body, apiVersion = LD_API_VERSION } = options;

  const headers: Record<string, string> = {
    Authorization: apiKey,
    "Content-Type": "application/json",
    "LD-API-Version": apiVersion,
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
