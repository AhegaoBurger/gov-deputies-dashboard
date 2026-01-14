import { Badge } from "@/components/ui/badge";
import { getPartyColor, getPartyFullName } from "@/lib/utils";

interface PartyBadgeProps {
  party: string;
  showFullName?: boolean;
}

export function PartyBadge({ party, showFullName = false }: PartyBadgeProps) {
  const color = getPartyColor(party);
  const fullName = getPartyFullName(party);

  return (
    <Badge
      className="font-semibold"
      style={{
        backgroundColor: color,
        color: ["#FF69B4", "#FF8C00", "#00CED1", "#90EE90"].includes(color)
          ? "#000"
          : "#fff",
      }}
      title={fullName}
    >
      {showFullName ? fullName : party}
    </Badge>
  );
}
