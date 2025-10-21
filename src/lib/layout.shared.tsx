
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Code2 } from 'lucide-react';



export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="mr-4 flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="font-bold text-xl">drhooks</span>
          </div>
      ),
      
    },
  };
}