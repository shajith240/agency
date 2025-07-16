"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function Header1() {
    const navigationItems = [
        {
            title: "Services",
            href: "#services",
        },
        {
            title: "About",
            href: "#about",
        },
        {
            title: "Contact",
            href: "#contact",
        },
    ];

    const [isOpen, setOpen] = useState(false);

    return (
        <header className="w-full z-40 fixed top-0 left-0 bg-black/95 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <span className="font-bold text-xl text-white">SharpFlow</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                            asChild
                        >
                            <Link href="mailto:contact@sharpflow.ai">
                                Contact Us
                            </Link>
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 text-white font-medium transition-all duration-200"
                            asChild
                        >
                            <Link href="#contact">Get Started</Link>
                        </Button>
                    </div>
                    {/* Mobile Menu Button - Enhanced touch target */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            className="text-gray-300 hover:text-white hover:bg-white/10 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                            onClick={() => setOpen(!isOpen)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation - Enhanced touch targets and spacing */}
                {isOpen && (
                    <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-sm">
                        <div className="px-4 py-6 space-y-2">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium py-3 px-2 rounded-lg hover:bg-white/10 min-h-[44px] flex items-center text-base"
                                    onClick={() => setOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            ))}

                            <div className="border-t border-white/10 pt-6 space-y-3">
                                <Link href="mailto:contact@sharpflow.ai" onClick={() => setOpen(false)}>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 min-h-[44px] text-base font-medium"
                                    >
                                        Contact Us
                                    </Button>
                                </Link>
                                <Link href="#contact" onClick={() => setOpen(false)}>
                                    <Button className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 text-white font-medium min-h-[44px] text-base">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export { Header1 };