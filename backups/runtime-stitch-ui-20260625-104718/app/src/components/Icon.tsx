import * as Icons from "lucide-react";

export function Icon({ name }: { name?: string }) {
  const Component = ((Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[name || "Circle"] || Icons.Circle);
  return <Component size={21} strokeWidth={2.1} />;
}
