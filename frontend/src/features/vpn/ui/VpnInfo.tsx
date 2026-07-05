type Props = {
  country: string;
  protocol: string;
};

export function VpnInfo({
  country,
  protocol,
}: Props) {
  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 18 }}>
            🟢
          </span>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
              }}
            >
              VPN активен
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: "#777",
              }}
            >
              Соединение защищено
            </p>
          </div>
        </div>
      </div>

      <hr />

      <div>
        <p>
          🇩🇪 <strong>{country}</strong>
        </p>

        <small>Страна</small>
      </div>

      <div
        style={{
          marginTop: 18,
        }}
      >
        <p>
          🔒 <strong>{protocol}</strong>
        </p>

        <small>Протокол</small>
      </div>
    </>
  );
}
