export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="bg-surface rounded-lg p-8 flex flex-col gap-4 w-full max-w-sm border border-border">
        <h1 className="text-2xl font-semibold text-foreground">Setora</h1>
        <p className="text-muted-foreground">AI-powered music practice assistant.</p>
        <div className="flex gap-2">
          <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm">Primary</span>
          <span className="bg-accent text-primary-foreground rounded-full px-3 py-1 text-sm">Accent</span>
          <span className="bg-destructive text-primary-foreground rounded-full px-3 py-1 text-sm">Error</span>
        </div>
      </div>
    </div>
  );
}
