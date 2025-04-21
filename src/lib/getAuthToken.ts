import { authClient } from "@/lib/auth-client";

export default async function getAuthToken() {
  const { data: session } = await authClient.getSession();

  const BearerToken = session?.session.token;

  return BearerToken;
}
