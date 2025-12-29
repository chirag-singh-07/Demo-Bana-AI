import { useCanvas } from "@/context/canvas-provider";
import CanvasFloatingToolbar from "./CanvasFloatingToolbar";
import CanvasLoader from "./CanvasLoader";
import { cn } from "@/lib/utils";

const Canvas = ({
  projectId,
  isPending,
  projectName,
}: {
  projectId: string;
  isPending: boolean;
  projectName: string;
}) => {
  const {
    theme,
    frames,
    selectedFrame,
    setSelectedFrameId,
    loadingStatus,
    setLoadingStatus,
  } = useCanvas();

  const currentStatus = isPending
    ? "fetching"
    : loadingStatus !== "idle" && loadingStatus !== "completed"
    ? loadingStatus
    : null;

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <CanvasFloatingToolbar />
        {currentStatus && <CanvasLoader status={currentStatus} />}
        <div
          className={cn(
            "absolute inset-0 w-full h-full bg-[#eee] dark:bg-[#242423] p-3"
          )}
          style={{
            backgroundImage:
              "radial-gradient(circlem var(--primary)) 1px, transparent 1px",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>
    </>
  );
};

export default Canvas;
