
import { CustomClass } from "@/types";
import { cn } from "@/lib/utils";

interface ClassBadgeProps {
  customClass: CustomClass;
  onClick?: () => void;
  selected?: boolean;
}

const ClassBadge: React.FC<ClassBadgeProps> = ({ 
  customClass, 
  onClick, 
  selected 
}) => {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium cursor-pointer transition-all",
        selected && "ring-2 ring-offset-1",
        onClick && "hover:opacity-80"
      )}
      style={{
        backgroundColor: `${customClass.color}20`,
        color: customClass.color,
        borderColor: customClass.color,
      }}
    >
      {customClass.name}
    </span>
  );
};

export default ClassBadge;
