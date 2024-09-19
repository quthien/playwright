import { APIManager, APIHost } from "../support/apiManager";

export async function getRandomUser(apiManager: APIManager) {
  const response = await apiManager
    .getContext(APIHost.Host1)
    .get("/api/?nat=us&randomapi");

  if (!response.ok()) {
    throw new Error("API call failed");
  }

  const data = await response.json();
  return data;
}
