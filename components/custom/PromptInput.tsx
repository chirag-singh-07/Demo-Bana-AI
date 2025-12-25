"use client";

import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { Spinner } from "../ui/spinner";
import { CornerDownLeftIcon } from "lucide-react";

interface PromptInputProps {
  className?: string;
  promptText: string;
  setPromptText: (text: string) => void;
  isLoading?: boolean;
  onSubmit?: () => void;
  hideSubmitButton?: boolean;
}

const PromptInput = ({
  className,
  promptText,
  setPromptText,
  isLoading,
  onSubmit,
  hideSubmitButton = false,
}: PromptInputProps) => {
  return (
    <div className={`bg-background`}>
      <InputGroup
        className={cn(
          "min-h-[172px] rounded-3xl bg-background",
          className && className
        )}
      >
        <InputGroupTextarea
          className="text-base! py-2.5!"
          placeholder="I want to desgin a mobile app for booking doctor appointments"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit && onSubmit();
            }
          }}
        />

        <InputGroupAddon
          align={"block-end"}
          className="flex items-center justify-end"
        >
          {!hideSubmitButton && (
            <InputGroupButton
              variant={"default"}
              size={"sm"}
              onClick={() => onSubmit && onSubmit()}
              disabled={isLoading || promptText.trim().length === 0}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Design
                  <CornerDownLeftIcon className="size-4" />
                </>
              )}
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default PromptInput;
