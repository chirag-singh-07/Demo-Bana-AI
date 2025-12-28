"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LogOutIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  Loader2Icon,
} from "lucide-react";
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
  // console.log("Session data in Header:", session);
  const router = useRouter();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
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

            {isPending ? (
              <Loader2Icon className="h-5 w-5 animate-spin" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar
                    className="h-8 w-8
                  shrink-0 rounded-full cursor-pointer"
                  >
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      {session.user.name ? (
                        session.user.name.charAt(0).toUpperCase()
                      ) : (
                        <UserIcon className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/project">Projects</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 cursor-pointer"
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div>
                <Link href="/register" className="mr-2">
                  <Button size="sm">Start For Free</Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Sign in</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
