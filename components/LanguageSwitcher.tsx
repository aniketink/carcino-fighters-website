"use client"

import * as React from "react"
import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "./LanguageProvider"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 hover:bg-white/10 transition-colors data-[state=open]:bg-white/10"
                >
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl text-white shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] p-1.5"
            >
                <DropdownMenuItem
                    onClick={() => setLanguage("en")}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 focus:bg-white/10 focus:text-white outline-none"
                >
                    <span className={cn(language === 'en' ? "text-primary font-bold" : "text-white/80")}>English</span>
                    {language === 'en' && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage("hi")}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 focus:bg-white/10 focus:text-white outline-none"
                >
                    <span className={cn(language === 'hi' ? "text-primary font-bold" : "text-white/80")}>हिंदी (Hindi)</span>
                    {language === 'hi' && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setLanguage("bn")}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 focus:bg-white/10 focus:text-white outline-none"
                >
                    <span className={cn(language === 'bn' ? "text-primary font-bold" : "text-white/80")}>বাংলা (Bengali)</span>
                    {language === 'bn' && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
