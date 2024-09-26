import { APIManager, APIHost } from "../support/apiManager";
import { randomuserPath } from "../apiPaths/randomuserPath";

export async function getRandomUser(apiManager: APIManager) {
  const GET_RANDOME_USER = randomuserPath.getRandomUser;

  const response = await apiManager
    .getContext(APIHost.Host1)
    .get(GET_RANDOME_USER);

  if (!response.ok()) {
    throw new Error("API call failed");
  }

  const data = await response.json();
  return data;
}
