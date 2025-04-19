import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function NewProjectPage() {
  // Server-side session verification
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <p>Please log in</p>;
  }


  // Render project details and include AddTask component
  return (
    <div>
      Create your Project here
      {/* Render tasks */}
    </div>
  );
}
