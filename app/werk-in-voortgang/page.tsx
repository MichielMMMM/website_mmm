export default function WorkInProgressPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #08131d 0%, #0f172a 48%, #0d1b2a 100%)",
        color: "#e2e8f0",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top left, rgba(45, 212, 191, 0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.14), transparent 30%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "2rem",
          maxWidth: "940px",
        }}
      >
        <div
          style={{
            width: "170px",
            height: "170px",
            margin: "0 auto 2rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(8, 19, 29, 0.8)",
            border: "4px solid rgba(96, 165, 250, 0.35)",
            boxShadow: "0 0 30px rgba(45, 212, 191, 0.15)",
          }}
        >
          <div
            style={{
              fontSize: "3.2rem",
              fontWeight: 700,
              color: "#5eead4",
            }}
          >
            🏗️
          </div>
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "0.45rem 0.9rem",
            borderRadius: "999px",
            background: "rgba(45, 212, 191, 0.12)",
            border: "1px solid rgba(45, 212, 191, 0.45)",
            color: "#79f0d6",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "1.4rem",
          }}
        >
          Website in ontwikkeling
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2.5rem, 6vw, 6rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.06em",
            fontWeight: 800,
            color: "#f8fafc",
          }}
        >
          We bouwen nu
          <br />
          aan de nieuwe site
        </h1>

        <p
          style={{
            margin: "1.2rem auto 0",
            maxWidth: "760px",
            fontSize: "1.15rem",
            lineHeight: 1.7,
            color: "#cbd5e1",
          }}
        >
          De nieuwe homepage van MakeMoreMoney komt binnenkort online. We werken nu aan de definitieve versie van de site en houden deze pagina tijdelijk open als placeholder.
        </p>
      </div>
    </main>
  );
}
