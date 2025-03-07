import React from "react";
import { Badge, Text } from "@mantine/core";

interface StatusBadgeProps {
    statusColor: string;
    statusLabel: string;
    badgeColor?: string;
    textColor?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    statusColor,
    statusLabel,
    badgeColor = "#E0E0E0",
    textColor = "#333333",
}) => {
    return (
        <Badge
            variant="outline"
            color={badgeColor}
            mih={22}
            style={{ display: 'flex', alignItems: 'center', borderRadius: 6 }}
        >
            <span
                style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: statusColor,
                    marginRight: '8px',
                }}
            ></span>
            <Text size="12" display="inline-block" style={{ color: textColor }}>
                {statusLabel}
            </Text>
        </Badge>
    );
};
