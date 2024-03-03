import { Link } from "@tanstack/react-router";
import { AcademicCapIcon, SunIcon } from "@heroicons/react/16/solid";
import { Button } from "../components/catalyst/button";
import useDarkMode from "../hooks/useDarkMode";
function Logo() {
    return (
        <div className="flex gap-2 ml-3">
            <span className="text-black dark:text-white">GraphChat</span>
            <div className="w-6 dark:invert">
                <AcademicCapIcon />
            </div>
        </div>
    );
}

// TODO github link
function Socials() {
    const { toggleDarkMode } = useDarkMode();

    return (
        <div className="flex items-center gap-6 mr-6">
            <a href="" className="w-fit h-fit">
                <img
                    className="h-5 dark:invert"
                    src="github-mark.svg"
                    alt="Your Company"
                />
            </a>
            <Button plain className="w-6 dark:invert" onClick={toggleDarkMode}>
                <SunIcon />
            </Button>
        </div>
    );
}

export default function Header() {
    return (
        <div className="p-2 dark:bg-black/75 dark:backdrop-blur-sm z-50 shadow flex items-center justify-between">
            <Link to="/" className="[&.active]:font-bold">
                <Logo />
            </Link>
            <div className="flex items-center">
                <Socials />
            </div>
        </div>
    );
}
