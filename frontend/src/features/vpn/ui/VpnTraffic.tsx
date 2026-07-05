import { ProgressBar } from "@/shared/ui";

type Props = {
  used: number;
  limit: number;
};

export function VpnTraffic({
  used,
  limit,
}: Props) {
  return (
    <>
      <hr />

      <h3>
        Использовано трафика
      </h3>

      <ProgressBar
        value={used}
        max={limit}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
          fontWeight: 700,
        }}
      >
        <span>
          {Math.round(
            used / 1024 / 1024
          )} МБ
        </span>

        <span>
          из{" "}
          {Math.round(
            limit / 1024 / 1024 / 1024
          )} ГБ
        </span>
      </div>

      <div
        style={{
          marginTop: 16,
        }}
      >
        <span
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            background: "#eaf8ef",
            color: "#14803d",
            fontWeight: 700,
          }}
        >
          🎁 1 ГБ бесплатно
        </span>
      </div>
    </>
  );
}
