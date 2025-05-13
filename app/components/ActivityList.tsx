// components/ActivityList.tsx
import { ReactNode } from "react";
import { List, ListItem } from "@/app/components/ui/list";

interface ActivityItem {
  icon: ReactNode;
  text: string;
  timestamp: string;
}

interface ActivityListProps {
  items: ActivityItem[];
}

export default function ActivityList({ items }: ActivityListProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
      <List>
        {items.map((item, idx) => (
          <ListItem key={idx} className="flex items-start space-x-3">
            <span>{item.icon}</span>
            <div>
              <p className="text-sm text-gray-800">{item.text}</p>
              <p className="text-xs text-gray-500">{item.timestamp}</p>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}