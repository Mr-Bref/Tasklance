import { auth } from "@/lib/auth";
import { ChevronRight } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata = {
  title: "TaskLance - Home",
  description: "A task management app",
};

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="w-full h-screen bg-no-repeat bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1552196563-55cd4e45efb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHx5b2dhfGVufDB8MHx8fDE3MTY5NjgwNTN8MA&ixlib=rb-4.0.3&q=80&w=1080')] flex items-center justify-center">
      <div className="bg-white/80 rounded-xl shadow-lg p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Organize Your Work, <span className="text-blue-600">Achieve More</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          TaskLance helps you manage your tasks, collaborate with your team, and boost your productivity. Start getting things done today!
        </p>
        <Link
          href={session ? "/dashboard" : "/login"}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          {session ? "Go to Dashboard" : "Get Started"}
          <ChevronRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
