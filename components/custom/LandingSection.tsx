"use client";
import { useState } from "react";
import PromptInput from "./PromptInput";
import { Suggestion, Suggestions } from "../ai-elements/suggestion";
import { suggestions } from "@/data";
import Header from "./Header";

const LandingSection = () => {
  const [promptText, setPromptText] = useState<string>("");

  const handleSuggestionClick = (value: string) => {
    setPromptText(value);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        {/* Header Here */}
        <Header/>

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
                  isLoading={false}
                  onSubmit={() => {}}
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

        <div className="w-full py-10">
          <div className="mx-auto max-w-3xl">
            <div>
              <h1 className="font-medium text-xl tracking-tight">
                Recent Projects
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSection;
