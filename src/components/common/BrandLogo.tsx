import React from 'react';

interface BrandLogoProps {
  size?: number;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 32, 
  showText = false 
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div 
        className="relative flex items-center justify-center rounded-lg"
        style={{ 
          width: size, 
          height: size,
          background: 'linear-gradient(135deg, hsla(var(--morandi-silver), 0.15) 0%, hsla(var(--morandi-sage), 0.12) 100%)',
        }}
      >
        {/* R 字母图标 */}
        <svg 
          width={size * 0.6} 
          height={size * 0.6} 
          viewBox="0 0 20 20" 
          fill="none"
        >
          {/* 简化的 R 字形 - 圆润风格 */}
          <path
            d="M6 16V4H10.5C12.5 4 14 5.2 14 7.2C14 8.7 13.2 9.7 11.8 10.2L14.5 16H12L9.5 10.5H8V16H6Z"
            fill="hsl(var(--morandi-silver))"
            style={{ opacity: 0.7 }}
          />
          {/* 装饰圆点 */}
          <circle 
            cx="10.5" 
            cy="6.5" 
            r="1.5" 
            fill="hsl(var(--morandi-rose))"
            style={{ opacity: 0.5 }}
          />
        </svg>
        
        {/* 微妙边框 */}
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ 
            border: '1px solid rgba(55, 71, 79, 0.04)',
          }}
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span 
            className="font-serif text-base tracking-tight leading-none"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            Rewrite Studio
          </span>
          <span 
            className="label-xs mt-0.5"
            style={{ color: 'rgba(55, 71, 79, 0.25)' }}
          >
            AI Style Transfer
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
