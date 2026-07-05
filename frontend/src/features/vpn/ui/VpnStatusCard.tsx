import { Card } from "@/shared/ui";

import { VpnInfo } from "./VpnInfo";
import { VpnShield } from "./VpnShield";
import { VpnTraffic } from "./VpnTraffic";

type Props = {
  country: string;
  protocol: string;
  status: string;
  trafficUsed?: number;
  trafficLimit?: number;
};

export function VpnStatusCard({
  country,
  protocol,
  trafficUsed = 0,
  trafficLimit = 1024 * 1024 * 1024,
}: Props) {
  return (
    <Card padding="spacious">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 180px",
          gap: 24,
          alignItems: "center",
        }}
      >
        <VpnInfo
          country={country}
          protocol={protocol}
        />

        <VpnShield />
      </div>

      <VpnTraffic
        used={trafficUsed}
        limit={trafficLimit}
      />
    </Card>
  );
}
