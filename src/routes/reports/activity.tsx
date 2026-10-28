import { createMemo, For, Show } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import EmptyState from "~/components/EmptyState";
import ListToolbar from "~/components/ListToolbar";
import { ReportSeverityBadge, ReportTypeBadge } from "~/components/wa/StatusBadge";
import { getReportLog } from "~/lib/session-reports";
import { REPORT_SEVERITY_OPTIONS, REPORT_TYPE_OPTIONS, compareSort, matchesQuery, reportSearchParts } from "~/lib/list-query";
import { useListQuery } from "~/lib/use-list-query";

export const route = {
  preload() {
    getReportLog();
  },
};

export default function ReportActivity() {
  const list = useListQuery({ sort: "date", dir: "desc" });
  const reports = createMemo(() => getReportLog());

  const filtered = () => {
    const rows = (reports() ?? []).filter((report) => {
      if (list.status() && report.type !== list.status()) return false;
      if (list.param("severity") && report.severity !== list.param("severity")) return false;
      return matchesQuery(list.q(), reportSearchParts(report));
    });
    const dir = list.dir();
    const field = list.sort() === "severity" || list.sort() === "type" || list.sort() === "child" ? list.sort() : "date";
    return [...rows].sort((a, b) => {
      if (field === "severity") return compareSort(a.severity, b.severity, dir);
      if (field === "type") return compareSort(a.type, b.type, dir);
      if (field === "child") {
        return compareSort(
          `${a.child.lastName} ${a.child.firstName}`.toLowerCase(),
          `${b.child.lastName} ${b.child.firstName}`.toLowerCase(),
          dir,
        );
      }
      return compareSort(new Date(a.timestamp).getTime(), new Date(b.timestamp).getTime(), dir);
    });
  };

  const formatWhen = (value: string | Date) =>
    new Date(value).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <PageContent>
      <PageHeader
        title="Session reports"
        description="Incidents, meals, naps, and other notes logged during care."
        actions={
          <a href="/reports">
            <wa-button appearance="outlined">Back to reports</wa-button>
          </a>
        }
      />

      <ListToolbar
        query={list}
        searchPlaceholder="Search child, family, title, type, or severity"
        chipGroups={[
          { param: "status", label: "Type", options: REPORT_TYPE_OPTIONS },
          { param: "severity", label: "Severity", options: REPORT_SEVERITY_OPTIONS },
        ]}
        sortOptions={[
          { value: "date", label: "Date" },
          { value: "child", label: "Child" },
          { value: "type", label: "Type" },
          { value: "severity", label: "Severity" },
        ]}
        total={reports()?.length ?? 0}
        visible={filtered().length}
      />

      <Show
        when={reports()}
        fallback={<p class="wa-body-m wa-color-text-quiet" style={{ "text-align": "center" }}>Loading reports...</p>}
      >
        <Show
          when={filtered().length > 0}
          fallback={
            <EmptyState
              message={
                (reports()?.length ?? 0) === 0
                  ? "No session reports yet."
                  : "No reports match these filters."
              }
              actionLabel={(reports()?.length ?? 0) > 0 ? "Clear filters" : undefined}
              onAction={() => list.clearFilters()}
            />
          }
        >
          <wa-card style={{ overflow: "hidden", padding: 0 }}>
            <div style={{ overflow: "auto" }} class="table-responsive">
              <table style={{ width: "100%", "border-collapse": "collapse" }}>
                <thead style={{ "background-color": "var(--color-surface-muted)" }}>
                  <tr>
                    <th style={{ padding: "0.75rem", "text-align": "left" }}>When</th>
                    <th style={{ padding: "0.75rem", "text-align": "left" }}>Child</th>
                    <th style={{ padding: "0.75rem", "text-align": "left" }}>Family</th>
                    <th style={{ padding: "0.75rem", "text-align": "left" }}>Type</th>
                    <th style={{ padding: "0.75rem", "text-align": "left" }}>Severity</th>
                    <th style={{ padding: "0.75rem", "text-align": "left" }}>Title</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={filtered()}>
                    {(report) => (
                      <tr style={{ "border-bottom": "1px solid var(--color-border)" }}>
                        <td style={{ padding: "0.75rem" }}>{formatWhen(report.timestamp)}</td>
                        <td style={{ padding: "0.75rem" }}>
                          {report.child.firstName} {report.child.lastName}
                        </td>
                        <td style={{ padding: "0.75rem" }}>{report.careSession.family?.familyName ?? "—"}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <ReportTypeBadge type={report.type} />
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <ReportSeverityBadge severity={report.severity} />
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <Show
                            when={report.careSession.family}
                            fallback={<span>{report.title}</span>}
                          >
                            <a href={`/families/${report.careSession.family?.id}/sessions/${report.careSessionId}`}>
                              {report.title}
                            </a>
                          </Show>
                          <Show when={report.followUpNeeded}>
                            <div class="wa-body-s wa-color-text-quiet">Follow-up needed</div>
                          </Show>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </wa-card>
        </Show>
      </Show>
    </PageContent>
  );
}
