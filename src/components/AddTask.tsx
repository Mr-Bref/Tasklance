// "use client";

// import { useState } from "react";

// export default function AddTask({ projectId }: { projectId: string }) {
//   const [taskContent, setTaskContent] = useState("");

//   const handleAddTask = async () => {
//     await fetch(`/api/project/${projectId}/task`, {
//       method: "POST",
//       body: JSON.stringify({ content: taskContent }),
//     });
//     setTaskContent(""); // Reset input
//   };

//   return (
   
//   );
// }
