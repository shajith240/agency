import { Cpu, Sparkles, Zap, Shield } from 'lucide-react'
import Image from 'next/image'

export function Features() {
    return (
        <section className="pt-8 md:pt-16 pb-16 md:pb-32 bg-black/[0.96] relative w-full">
            <div className="container mx-auto space-y-12">
                <div className="relative z-10 grid items-center gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                        Powerful AI Automation Features
                    </h2>
                    <p className="max-w-lg sm:ml-auto text-neutral-300 leading-relaxed text-lg md:text-xl">
                        Discover the advanced capabilities that make our AI automation marketplace the perfect choice for streamlining your workflows and boosting productivity.
                    </p>
                </div>
                <div className="relative rounded-3xl p-1 md:p-2 bg-gradient-to-br from-neutral-900/60 to-neutral-800/40 backdrop-blur-md border border-neutral-700/30 shadow-2xl shadow-black/50">
                    <div className="aspect-[88/36] relative overflow-hidden rounded-xl shadow-lg">
                        {/* Professional transparent bottom fade effect */}
                        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/95 via-black/40 via-black/15 to-transparent z-30"></div>

                        {/* Existing top fade effect - enhanced */}
                        <div className="bg-gradient-to-t z-20 from-black/60 via-transparent to-black/20 absolute inset-0"></div>

                        {/* Main image */}
                        <Image
                            src="/n8n1.png"
                            alt="AI Automation Workflow Dashboard"
                            fill
                            className="object-cover object-center transform scale-90 transition-transform duration-700 hover:scale-95"
                            priority
                        />

                        {/* Enhanced color overlay with subtle animation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-purple-600/10 to-cyan-600/15 z-10 animate-pulse"></div>

                        {/* Professional glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/[0.02] to-transparent z-25"></div>

                        {/* Subtle inner border for premium feel */}
                        <div className="absolute inset-0 rounded-xl border border-white/5 z-40"></div>
                    </div>
                </div>
                <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    <div className="space-y-4 p-6 md:p-8 rounded-xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                                <Zap className="size-5 text-yellow-400" />
                            </div>
                            <h3 className="text-base md:text-lg font-medium text-white">Lightning Fast</h3>
                        </div>
                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">Deploy automation workflows in minutes, not hours. Our optimized templates ensure rapid implementation.</p>
                    </div>
                    <div className="space-y-4 p-6 md:p-8 rounded-xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                                <Cpu className="size-5 text-blue-400" />
                            </div>
                            <h3 className="text-base md:text-lg font-medium text-white">Enterprise Ready</h3>
                        </div>
                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">Scalable solutions built for businesses of all sizes, from startups to enterprise organizations.</p>
                    </div>
                    <div className="space-y-4 p-6 md:p-8 rounded-xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                                <Shield className="size-5 text-green-400" />
                            </div>
                            <h3 className="text-base md:text-lg font-medium text-white">Secure & Reliable</h3>
                        </div>
                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">Bank-grade security with 99.9% uptime guarantee. Your data and workflows are always protected.</p>
                    </div>
                    <div className="space-y-4 p-6 md:p-8 rounded-xl bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                <Sparkles className="size-5 text-purple-400" />
                            </div>
                            <h3 className="text-base md:text-lg font-medium text-white">AI Powered</h3>
                        </div>
                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">Cutting-edge AI technology that learns and adapts to optimize your automation workflows continuously.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
