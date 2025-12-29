/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useInngestSubscription } from "@inngest/realtime/hooks";
// import { fetchRealtimeSubscriptionToken } from "@/app/action/realtime";
import { THEME_LIST, ThemeType } from "@/lib/themes";
import { FrameType } from "@/types/project";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type LoadingStatusType =
  | "idle"
  | "running"
  | "analyzing"
  | "generating"
  | "completed";

interface CanvasContextType {
  theme?: ThemeType;
  setTheme: (id: string) => void;
  themes: ThemeType[];

  frames: FrameType[];
  setFrames: (frames: FrameType[]) => void;
  updateFrame: (id: string, data: Partial<FrameType>) => void;
  addFrame: (frame: FrameType) => void;

  selectedFrameId: string | null;
  selectedFrame: FrameType | null;
  setSelectedFrameId: (id: string | null) => void;

  loadingStatus: LoadingStatusType | null;
  setLoadingStatus: (status: LoadingStatusType | null) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

const CanvasProvider = ({
  children,
  initialFrames,
  initialThemeId,
  hasInitialData,
  projectId,
}: {
  children: ReactNode;
  initialFrames: FrameType[];
  initialThemeId?: string;
  hasInitialData: boolean;
  projectId: string | null;
}) => {
  const [themeId, setThemeId] = useState<string>(
    initialThemeId || THEME_LIST[0].id
  );
  const [frames, setFrames] = useState<FrameType[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType | null>(
    hasInitialData ? "idle" : "running"
  );
  const [prevProjectId, setPrevProjectId] = useState(projectId);
  const theme =
    THEME_LIST.find((theme) => theme.id === themeId) || THEME_LIST[0];
  const selectedFrame =
    selectedFrameId && frames
      ? frames.find((frame) => frame.id === selectedFrameId) || null
      : null;



  if (projectId !== prevProjectId) {
    setPrevProjectId(projectId);
    setLoadingStatus(hasInitialData ? "idle" : "running");
    setFrames(initialFrames);
    setThemeId(initialThemeId || THEME_LIST[0].id);
    setSelectedFrameId(null);
  }

  const addFrame = useCallback((frame: FrameType) => {
    setFrames((prev) => [...prev, frame]);
  }, []);

  const updateFrame = useCallback((id: string, data: Partial<FrameType>) => {
    setFrames((prev) =>
      prev.map((frame) => (frame.id === id ? { ...frame, ...data } : frame))
    );
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        theme,
        setTheme: setThemeId,
        themes: THEME_LIST,
        frames,
        setFrames,
        selectedFrameId,
        selectedFrame,
        setSelectedFrameId,
        updateFrame,
        addFrame,
        loadingStatus,
        setLoadingStatus,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used inside CanvasProvider");
  return ctx;
};

export default CanvasProvider;
