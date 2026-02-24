import type { PropsWithChildren } from 'react'
import { cn } from '@/utils/cn'

interface ContainerProps extends PropsWithChildren {
  className?: string
}

function Container({ children, className }: ContainerProps) {
  return <div className={cn('app-container', className)}>{children}</div>
}

export default Container