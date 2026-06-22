export const metadata = {
  title: "Cookie Policy - LearnLM",
};

export default function CookiesPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Cookie Policy</h1>
      <p className="text-muted-foreground leading-7 mb-4">
        LearnLM uses cookies and similar storage to keep you signed in, secure sessions, and
        preserve essential preferences.
      </p>
      <p className="text-muted-foreground leading-7 mb-4">
        We do not require non-essential tracking cookies for core learning features.
      </p>
      <p className="text-muted-foreground leading-7">
        You can clear browser storage at any time, but this may sign you out and reset local
        preferences.
      </p>
    </main>
  );
}
