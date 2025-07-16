'use client';
import React from 'react';
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';

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
		label: 'Product',
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
			{ title: 'About', href: '#about' },
			{ title: 'Contact', href: '#contact' },
			{ title: 'Case Studies', href: '#case-studies' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Blog', href: '/blog' },
			{ title: 'Help Center', href: '/help' },
		],
	},
	{
		label: 'Legal',
		links: [
			{ title: 'Privacy Policy', href: '/privacy' },
			{ title: 'Terms of Service', href: '/terms' },
		],
	},
];

const socialLinks = [
	{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
	{ title: 'Facebook', href: '#', icon: FacebookIcon },
	{ title: 'Instagram', href: '#', icon: InstagramIcon },
	{ title: 'Youtube', href: '#', icon: YoutubeIcon },
];

export function Footer() {
	return (
		<footer className="py-16 md:py-24 relative">

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
					{/* Brand section - Mobile optimized */}
					<div className="sm:col-span-2 lg:col-span-2 space-y-4">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">AI</span>
							</div>
							<span className="font-bold text-xl text-white">SharpFlow</span>
						</div>
						<p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
							Transforming businesses through intelligent AI automation solutions.
						</p>

						{/* Social Links - Enhanced touch targets for mobile */}
						<div className="flex space-x-2 pt-2">
							{socialLinks.map((social) => (
								<a
									key={social.title}
									href={social.href}
									className="text-neutral-400 hover:text-white transition-colors duration-200 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 footer-link-optimized"
									aria-label={social.title}
								>
									<social.icon className="w-5 h-5" />
								</a>
							))}
						</div>
					</div>

					{/* Links sections - Mobile optimized */}
					{footerLinks.map((section) => (
						<div key={section.label} className="space-y-3 sm:space-y-4">
							<h3 className="text-white font-medium text-sm">
								{section.label}
							</h3>
							<ul className="space-y-2">
								{section.links.map((link) => (
									<li key={link.title}>
										<a
											href={link.href}
											className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm py-1 block min-h-[32px] flex items-center footer-link-optimized"
										>
											{link.title}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom section - Mobile optimized */}
				<div className="mt-6 sm:mt-8 pt-6 sm:pt-8">
					<div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
						<p className="text-neutral-500 text-sm text-center sm:text-left">
							© {new Date().getFullYear()} SharpFlow. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};


