import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateProject = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (prompt: string) =>
      await axios.post("/api/projects", { prompt }).then((res) => res.data),
    onSuccess: (data) => {
      router.push(`/project/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    },
  });
};

export const useGetProjects = (userId: string) => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get("/api/projects");
      return response.data.projects;
    },
    enabled: !!userId,
  })
}

export const useGetProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await axios.get(`/api/projects/${projectId}`);
      return response.data.project;
    },
    enabled: !!projectId,
  });
}
