"use client";

import { useEffect } from "react";

export default function ViewToggler({ projectId }: { projectId: string }) {

  return (
    <span>
      {/* board an table view butttons */}
      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l">
        Board
      </button>
      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r">
        Table
      </button>
    </span>
  );
}
