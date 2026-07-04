import { Card } from "@/shared/ui";

type Props = {
  country: string;
  protocol: string;
  status: string;
};

export function VpnStatusCard({
  country,
  protocol,
  status,
}: Props) {
  return (
    <Card>
      <h2>🟢 VPN активен</h2>

      <p>
        <strong>🌍 Страна</strong>
      </p>

      <p>{country}</p>

      <br />

      <p>
        <strong>🔒 Протокол</strong>
      </p>

      <p>{protocol}</p>

      <br />

      <p>
        <strong>Статус</strong>
      </p>

      <p>{status}</p>
    </Card>
  );
}
