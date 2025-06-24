"use client";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, MoveRight, X, Phone, Mail } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function Header1() {
    const navigationItems = [
        {
            title: "Home",
            href: "/",
            description: "",
        },
        {
            title: "Services",
            description: "Comprehensive AI automation solutions for your business.",
            items: [
                {
                    title: "AI Chatbots",
                    href: "#services",
                },
                {
                    title: "Workflow Automation",
                    href: "#services",
                },
                {
                    title: "Email Marketing",
                    href: "#services",
                },
                {
                    title: "Data Processing",
                    href: "#services",
                },
            ],
        },
        {
            title: "About",
            description: "Learn about our AI automation agency and expertise.",
            items: [
                {
                    title: "Our Process",
                    href: "#about",
                },
                {
                    title: "Case Studies",
                    href: "#case-studies",
                },
                {
                    title: "Team",
                    href: "#team",
                },
                {
                    title: "Contact",
                    href: "#contact",
                },
            ],
        },
    ];

    const [isOpen, setOpen] = useState(false);
    return (
        <header className="w-full z-40 fixed top-0 left-0 nav-ambient-blur shadow-lg">
            {/* Enhanced ambient background for navigation */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/2 via-orange-500/3 to-red-500/2 opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/95 to-black/90" />

            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    <NavigationMenu className="flex justify-start items-start">
                        <NavigationMenuList className="flex justify-start gap-4 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    {item.href ? (
                                        <>
                                            <NavigationMenuLink>
                                                <Button
                                                    variant="ghost"
                                                    className="text-white hover:text-white font-medium transition-all duration-300 border border-white/20 hover:border-primary/60 backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-primary/20 hover:to-primary/30 shadow-sm hover:shadow-md brand-glow-hover border-glow-hover"
                                                >
                                                    {item.title}
                                                </Button>
                                            </NavigationMenuLink>
                                        </>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger className="font-medium text-sm text-white hover:text-white data-[state=open]:text-white transition-all duration-300 border border-white/20 hover:border-primary/60 data-[state=open]:border-primary/60 backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-primary/20 hover:to-primary/30 data-[state=open]:from-primary/20 data-[state=open]:to-primary/30 shadow-sm hover:shadow-md data-[state=open]:shadow-md">
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="!w-[450px] p-4 bg-black/90 backdrop-blur-md border border-white/20 shadow-2xl">
                                                <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <div className="flex flex-col">
                                                            <p className="text-base text-white font-medium">{item.title}</p>
                                                            <p className="text-gray-300 text-sm">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            className="mt-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                                                            asChild
                                                        >
                                                            <Link href="#contact">
                                                                Get Free Quote
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-col text-sm h-full justify-end">
                                                        {item.items?.map((subItem) => (
                                                            <NavigationMenuLink
                                                                href={subItem.href}
                                                                key={subItem.title}
                                                                className="flex flex-row justify-between items-center hover:bg-gradient-to-r hover:from-primary/15 hover:to-primary/25 hover:text-white py-2 px-4 rounded transition-all duration-300 text-white border border-transparent hover:border-primary/30"
                                                            >
                                                                <span className="text-white">{subItem.title}</span>
                                                                <MoveRight className="w-4 h-4 text-gray-300" />
                                                            </NavigationMenuLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            </NavigationMenuContent>
                                        </>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex lg:justify-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <span className="font-bold text-xl text-white drop-shadow-lg">SharpFlow</span>
                    </Link>
                </div>
                <div className="flex justify-end w-full gap-4">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            className="text-white hover:text-white font-medium transition-all duration-300 border border-white/30 hover:border-primary/60 backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-primary/20 hover:to-primary/30 shadow-sm hover:shadow-md brand-glow-hover"
                            asChild
                        >
                            <Link href="mailto:contact@sharpflow.ai">
                                <Mail className="w-4 h-4 mr-2" />
                                Contact Us
                            </Link>
                        </Button>
                        <Button
                            className="text-white hover:text-white font-medium transition-all duration-300 border border-primary/50 hover:border-primary/70 backdrop-blur-sm bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 shadow-lg hover:shadow-xl brand-glow-hover"
                            asChild
                        >
                            <Link href="#contact">Get Free Quote</Link>
                        </Button>
                    </div>
                </div>
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button
                        variant="ghost"
                        className="text-white hover:text-white transition-all duration-300 p-2 border border-white/20 hover:border-primary/60 backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-primary/20 hover:to-primary/30 shadow-sm hover:shadow-md"
                        onClick={() => setOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    {isOpen && (
                        <div className="absolute top-20 border-t border-white/20 flex flex-col w-full right-0 bg-black/95 backdrop-blur-md shadow-2xl py-4 container gap-8">

                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="flex justify-between items-center py-2 px-3 rounded-md transition-all duration-300 border border-transparent hover:border-primary/30 bg-gradient-to-r from-transparent to-transparent hover:from-primary/15 hover:to-primary/25"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="text-lg font-medium text-white">{item.title}</span>
                                                <MoveRight className="w-4 h-4 stroke-1 text-white" />
                                            </Link>
                                        ) : (
                                            <p className="text-lg font-medium text-white">{item.title}</p>
                                        )}
                                        {item.items &&
                                            item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="flex justify-between items-center py-2 px-3 rounded-md transition-all duration-300 ml-4 border border-transparent hover:border-primary/30 bg-gradient-to-r from-transparent to-transparent hover:from-primary/10 hover:to-primary/20"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <span className="text-gray-300 hover:text-white">
                                                        {subItem.title}
                                                    </span>
                                                    <MoveRight className="w-4 h-4 stroke-1 text-gray-300 hover:text-white" />
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            ))}

                            {/* Mobile Contact Actions */}
                            <div className="border-t border-white/20 pt-4">
                                <div className="flex flex-col gap-2">
                                    <Link href="mailto:contact@sharpflow.ai" onClick={() => setOpen(false)}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-white hover:text-white font-medium transition-all duration-300 border border-white/30 hover:border-primary/60 backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-primary/20 hover:to-primary/30 shadow-sm hover:shadow-md"
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            Contact Us
                                        </Button>
                                    </Link>
                                    <Link href="#contact" onClick={() => setOpen(false)}>
                                        <Button className="w-full text-white hover:text-white font-medium transition-all duration-300 border border-primary/50 hover:border-primary/70 backdrop-blur-sm bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 shadow-lg hover:shadow-xl">
                                            Get Free Quote
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export { Header1 };