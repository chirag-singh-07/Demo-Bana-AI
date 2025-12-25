"use client";

import { useTheme } from "next-themes";

const Header = () => {

  const {theme, setTheme} = useTheme();
  const isDark = theme === "dark";


  return (
    <div></div>
  )
}

export default Header