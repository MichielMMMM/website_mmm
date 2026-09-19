export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #111827 0%, #0f172a 100%)",
        color: "#e5e7eb",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          width: "100%",
          textAlign: "center",
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: "24px",
          padding: "3rem 2rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#a5f3fc",
            fontWeight: 700,
          }}
        >
          Alternatieve live pagina
        </p>

        <h1
          style={{
            margin: "1rem 0 0.75rem",
            fontSize: "clamp(2.4rem, 5vw, 5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.06em",
            color: "#f8fafc",
          }}
        >
          Andere pagina live
        </h1>

        <p
          style={{
            margin: "0 auto",
            maxWidth: "620px",
            fontSize: "1.08rem",
            lineHeight: 1.7,
            color: "#cbd5e1",
          }}
        >
          Deze versie is nu live op de homepage, zodat je eigen huidige pagina behouden blijft in het project en je hier later verder kunt mee werken.
        </p>
      </div>
    </main>
  );
}
