import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateProject = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (prompt: string) =>
      await axios.post("/api/projects", { prompt }).then((res) => res.data),
    onSuccess: (data) => {
      router.push(`/project/${data.data.id}`);
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    },
  });
};
