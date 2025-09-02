
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Climate_Crisis } from 'next/font/google';

const climate_Crisis = Climate_Crisis({
  weight: '400',
  subsets: ['latin'],
});

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className={`${climate_Crisis.className}  `}>
          dRhooks
        </span>
      ),
      
    },
  };
}