import { cn } from "@/lib/utils";
type ButtonProps= React.HTMLAttributes<HTMLButtonElement>

export default function Bouncebutton({className,children,...props}:ButtonProps){
    return <button {...props} className={cn(`rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-semibold text-gray-700 transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-200 active:scale-90`,className)}>{children}</button>
}

