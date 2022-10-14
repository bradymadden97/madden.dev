export function links() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cousine&display=swap",
    },
  ];
}

export default function Index() {
  return (
    <div style={{ fontFamily: "Cousine, monospace", fontSize: "16px" }}>
      brady@madden.dev
    </div>
  );
}
