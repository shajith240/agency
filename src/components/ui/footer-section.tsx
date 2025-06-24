'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FacebookIcon, FrameIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Services',
		links: [
			{ title: 'AI Chatbots', href: '#services' },
			{ title: 'Workflow Automation', href: '#services' },
			{ title: 'Email Marketing', href: '#services' },
			{ title: 'Data Processing', href: '#services' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'About Us', href: '#about' },
			{ title: 'Our Process', href: '#about' },
			{ title: 'Case Studies', href: '#case-studies' },
			{ title: 'Contact', href: '#contact' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Blog', href: '/blog' },
			{ title: 'Help Center', href: '/help' },
			{ title: 'Privacy Policy', href: '/privacy' },
			{ title: 'Terms of Service', href: '/terms' },
		],
	},
	{
		label: 'Connect',
		links: [
			{ title: 'Facebook', href: '#', icon: FacebookIcon },
			{ title: 'Instagram', href: '#', icon: InstagramIcon },
			{ title: 'Youtube', href: '#', icon: YoutubeIcon },
			{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
		],
	},
];

export function Footer() {
	return (
		<footer className="relative w-full bg-black/[0.96] overflow-hidden">
			{/* Smooth gradient transition from previous section */}
			<div className="absolute top-0 left-0 w-full h-16 md:h-24 bg-gradient-to-b from-transparent via-black/[0.5] to-black/[0.96]" />

			{/* Enhanced ambient background matching design system */}
			<div className="absolute inset-0 bg-gradient-to-b from-yellow-400/[0.01] via-orange-500/[0.015] to-red-500/[0.01] opacity-60" />
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-400/3 via-orange-500/2 to-transparent rounded-full blur-3xl" />
			<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-red-500/3 via-orange-500/2 to-transparent rounded-full blur-3xl" />

			{/* Footer content container with proper alignment */}
			<div className="relative z-10 pt-16 md:pt-24 pb-16 md:pb-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid w-full gap-12 md:gap-16 xl:grid-cols-3 xl:gap-20">
						{/* Brand section */}
						<AnimatedContainer className="space-y-8">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
									<span className="text-white font-bold text-lg">AI</span>
								</div>
								<span className="font-bold text-2xl text-white">SharpFlow</span>
							</div>
							<p className="text-neutral-400 text-base leading-relaxed max-w-sm">
								Transforming businesses through intelligent AI automation solutions.
								Streamline operations, reduce costs, and boost productivity.
							</p>
							<p className="text-neutral-500 text-sm">
								© {new Date().getFullYear()} SharpFlow. All rights reserved.
							</p>
						</AnimatedContainer>

						{/* Links sections */}
						<div className="grid grid-cols-2 gap-8 md:gap-12 xl:col-span-2 xl:grid-cols-4">
							{footerLinks.map((section, index) => (
								<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
									<div className="space-y-6">
										<h3 className="text-white font-semibold text-base tracking-wide">
											{section.label}
										</h3>
										<ul className="space-y-4">
											{section.links.map((link) => (
												<li key={link.title}>
													<a
														href={link.href}
														className="inline-flex items-center text-neutral-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-yellow-400 hover:via-orange-500 hover:to-red-500 transition-all duration-300 text-sm font-medium group"
													>
														{link.icon && (
															<link.icon className="mr-3 w-4 h-4 text-neutral-500 group-hover:text-orange-500 transition-colors duration-300" />
														)}
														<span className="relative">
															{link.title}
															<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 group-hover:w-full transition-all duration-300" />
														</span>
													</a>
												</li>
											))}
										</ul>
									</div>
								</AnimatedContainer>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', y: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
};
