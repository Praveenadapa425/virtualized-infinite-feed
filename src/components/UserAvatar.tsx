import { memo } from 'react'
import SimpleImage from './SimpleImage'

interface UserAvatarProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const UserAvatar = ({ src, alt, size = 'md', className = '' }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  return (
    <SimpleImage
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full ${className}`}
      fallback="👤"
    />
  )
}

export default memo(UserAvatar)