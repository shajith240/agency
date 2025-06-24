import { AgencyHome } from '@/components/agency/AgencyHome'
import { PerformanceMonitor } from '@/components/ui/performance-monitor'
import { PerformanceTest } from '@/components/ui/performance-test'

export default function Home() {
  return (
    <>
      <AgencyHome />
      <PerformanceMonitor enabled={process.env.NODE_ENV === 'development'} />
      <PerformanceTest enabled={process.env.NODE_ENV === 'development'} />
    </>
  )
}
