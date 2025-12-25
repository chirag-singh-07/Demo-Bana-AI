"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOutIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "./Logo";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="sticky top-0 right-0 left-0 z-30">
      <header className="h-16 border-b bg-background py-4">
        <div
          className="w-full max-w-6xl mx-auto
         flex items-center justify-between"
        >
          <Logo />

          <div
            className="hidden flex-1 items-center
          justify-center gap-8 md:flex"
          >
            <Link href="/" className="text-foreground-muted text-sm">
              Home
            </Link>
            <Link href="/" className="text-foreground-muted text-sm">
              Pricing
            </Link>
          </div>

          <div
            className="flex flex-1 items-center
           justify-end gap-3
          "
          >
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full h-8 w-8"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              <SunIcon
                className={cn(
                  "absolute h-5 w-5 transition",
                  isDark ? "scale-100" : "scale-0"
                )}
              />
              <MoonIcon
                className={cn(
                  "absolute h-5 w-5 transition",
                  isDark ? "scale-0" : "scale-100"
                )}
              />
            </Button>
            {!isPending &&
              (session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar
                      className="h-8 w-8
                    shrink-0 rounded-full"
                    >
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        <UserIcon className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-0">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-2 py-1.5 text-sm cursor-pointer"
                      >
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button size="sm">Sign in</Button>
                </Link>
              ))}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
