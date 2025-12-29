"use client";

import Canvas from "@/components/canvas";
import ProjectHeader from "@/components/custom/ProjectHeader";
import CanvasProvider from "@/context/canvas-provider";
import { useGetProjectById } from "@/features/use-project";

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const { data: project, isPending } = useGetProjectById(params.id);
  const frames = project?.frames || [];
  const themeId = project?.theme || "light";
  const hasInitialData = frames.length > 0;

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="relative h-screen w-full flex flex-col">
      <ProjectHeader projectName={project.name} />

      <CanvasProvider
        initialFrames={frames}
        initialThemeId={themeId}
        hasInitialData={hasInitialData}
        projectId={project.id}
      >
        <div className="flex flex-1 w-full overflow-hidden">
          <div className="relative flex-1">
            <Canvas
              projectId={project?.id}
              projectName={project.name}
              isPending={isPending}
            />
          </div>
        </div>
      </CanvasProvider>
    </div>
  );
};



export default ProjectPage;
