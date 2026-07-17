import PageContent, { PageHeader } from "~/components/wa/PageContent";

export default function NotFound() {
  return (
    <PageContent narrow>
      <div class="wa-stack wa-gap-l" style={{ "text-align": "center", "margin-top": "var(--wa-space-2xl)" }}>
        <PageHeader
          title="Page Not Found"
          description="That page doesn't exist or may have moved."
        />
        <div class="wa-cluster wa-gap-s" style={{ "justify-content": "center", "flex-wrap": "wrap" }}>
          <wa-button href="/" variant="brand" appearance="filled">
            Back to Dashboard
          </wa-button>
          <wa-button type="button" appearance="outlined" onClick={() => window.history.back()}>
            Go Back
          </wa-button>
        </div>
      </div>
    </PageContent>
  );
}
