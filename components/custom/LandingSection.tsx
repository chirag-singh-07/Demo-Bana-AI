"use client";
import { memo, useState } from "react";
import PromptInput from "./PromptInput";
import { Suggestion, Suggestions } from "../ai-elements/suggestion";
import { suggestions } from "@/data";
import Header from "./Header";
import { useCreateProject, useGetProjects } from "@/features/use-project";
import { useSession } from "@/lib/auth-client";
import { ProjectType } from "@/types/project";
import { FolderOpenDotIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const LandingSection = () => {
  const user = useSession();
  const userId = user?.data?.user?.id || "";
  const [promptText, setPromptText] = useState<string>("");
  const {
    data: projects,
    isLoading: isProjectsLoading,
    error: projectsError,
  } = useGetProjects(userId);
  const { mutate: createProject, isPending } = useCreateProject();

  const handleSuggestionClick = (value: string) => {
    setPromptText(value);
  };

  const handleSubmit = () => {
    if (promptText.trim() === "") return;
    createProject(promptText);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        {/* Header Here */}
        <Header />

        <div className="relative overflow-hidden pt-28">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
            <div className="space-y-3">
              <h1 className="text-center font-semibold text-4xl tracking-tight sm:text-5xl">
                Desgin mobile apps <br className="md:hidden" />
                <span className="text-primary">in minutes </span>
              </h1>
              <p className="mx-auto max-w-2xl text-center font-medium text-foreground leading-relaxed sm:text-lg mb-5">
                Create stunning mobile app designs effortlessly with our
                AI-powered tool. Transform your ideas into beautiful,
                user-friendly interfaces in just minutes.
              </p>
            </div>

            <div className="flex w-full max-w-3xl flex-col items-center gap-8 relative z-50">
              <div className="w-full">
                <PromptInput
                  className="ring-2 ring-primary "
                  promptText={promptText}
                  setPromptText={setPromptText}
                  isLoading={isPending}
                  onSubmit={handleSubmit}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2 px-5">
                <Suggestions>
                  {suggestions.map((s) => (
                    <Suggestion
                      key={s.label}
                      suggestion={s.label}
                      className="text-xs! h-7! px-2.5 pt-1!"
                      onClick={() => handleSuggestionClick(s.value)}
                    >
                      {s.icon}
                      <span>{s.label}</span>
                    </Suggestion>
                  ))}
                </Suggestions>
              </div>
            </div>

            <div
              className="absolute -translate-x-1/2
             left-1/2 w-1250 h-750 top-[80%]
             -z-10"
            >
              <div
                className="-translate-x-1/2 absolute
               bottom-[calc(100%-300px)] left-1/2
               h-500 w-500
               opacity-20 bg-radial-primary"
              ></div>
              <div
                className="absolute -mt-2.5
              size-full rounded-[50%]
               bg-primary/20 opacity-70
               [box-shadow:0_-15px_24.8px_var(--primary)]"
              ></div>
              <div
                className="absolute z-0 size-full
               rounded-[50%] bg-background"
              ></div>
            </div>
          </div>
        </div>

        <div className="w-full py-14">
          <div className="mx-auto max-w-5xl px-4">
            {userId && (
              <div className="rounded-2xl border p-6 shadow-sm">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Recent Projects
                  </h1>
                  <p className="text-sm opacity-60 mt-1">
                    Your latest work in one place
                  </p>
                </div>

                {/* Loading Skeleton */}
                {isProjectsLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-40 rounded-xl border animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {/* Error */}
                {projectsError && (
                  <p className="text-sm opacity-70">
                    Something went wrong while loading projects.
                  </p>
                )}

                {/* Empty State */}
                {!isProjectsLoading &&
                  !projectsError &&
                  projects?.length === 0 && (
                    <div className="flex flex-col items-center text-center py-16">
                      <div className="text-4xl opacity-50 mb-3">📁</div>
                      <h2 className="text-lg font-medium">No projects yet</h2>
                      <p className="text-sm opacity-60 mt-1">
                        Create your first project to get started
                      </p>
                    </div>
                  )}

                {/* Projects Grid */}
                {!isProjectsLoading &&
                  !projectsError &&
                  projects?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {projects.map((project: ProjectType) => (
                        <div
                          key={project.id}
                          className="transition-transform duration-200 hover:-translate-y-1"
                        >
                          <ProjectCard project={project} />
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = memo(({ project }: { project: ProjectType }) => {
  const router = useRouter();
  const createdAtDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const thumbnail = project.thumbnail || null;

  const onRoute = () => {
    router.push(`/project/${project.id}`);
  };

  return (
    <div
      role="button"
      className="w-full flex flex-col border rounded-xl cursor-pointer
    hover:shadow-md overflow-hidden
    "
      onClick={onRoute}
    >
      <div
        className="h-40 bg-[#eee] relative overflow-hidden
        flex items-center justify-center
        "
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            className="w-full h-full object-cover object-left
           scale-110"
            alt={project.name}
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full bg-primary/20
              flex items-center justify-center text-primary
            "
          >
            <FolderOpenDotIcon />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col">
        <h3
          className="font-semibold
         text-sm truncate w-full mb-1 line-clamp-1"
        >
          {project.name}
        </h3>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

export default LandingSection;
