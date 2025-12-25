import { createAsync, type RouteDefinition, A, useParams } from "@solidjs/router";
import { Show, For } from "solid-js";
import { getChild } from "~/lib/children";

export const route = {
  preload({ params }) {
    if (params.id) {
      getChild(params.id);
    }
  },
} satisfies RouteDefinition;

export default function ChildDetailPage() {
  const params = useParams();
  const child = createAsync(() => getChild(params.id!));

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return { bg: "#bee3f8", color: "#2c5282" };
      case "IN_PROGRESS":
        return { bg: "#feebc8", color: "#7c2d12" };
      case "COMPLETED":
        return { bg: "#c6f6d5", color: "#276749" };
      case "CANCELLED":
        return { bg: "#fed7d7", color: "#c53030" };
      default:
        return { bg: "#e2e8f0", color: "#2d3748" };
    }
  };

  return (
    <main
      style={{
        "max-width": "1200px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <Show
        when={child()}
        fallback={
          <div style={{ "text-align": "center", padding: "3rem" }}>Loading child details...</div>
        }
      >
        <header style={{ "margin-bottom": "2rem" }}>
          <A
            href={`/families/${child()?.familyId}`}
            style={{
              color: "#4299e1",
              "text-decoration": "none",
              "margin-bottom": "0.5rem",
              display: "inline-block",
            }}
          >
            ← Back to Family
          </A>
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
            }}
          >
            <div>
              <h1 style={{ color: "#2d3748", "font-size": "2rem", margin: "0 0 0.5rem 0" }}>
                {child()?.firstName} {child()?.lastName}
              </h1>
              <A
                href={`/families/${child()?.familyId}`}
                style={{
                  color: "#4299e1",
                  "text-decoration": "none",
                  "font-size": "0.875rem",
                }}
              >
                Family: {child()?.family?.familyName}
              </A>
            </div>
            <A
              href={`/families/${child()?.familyId}/children/${params.id}/edit`}
              style={{
                padding: "0.5rem 1.5rem",
                "background-color": "#4299e1",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-weight": "600",
              }}
            >
              Edit Child
            </A>
          </div>
        </header>

        {/* Basic Information */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
            "margin-bottom": "2rem",
          }}
        >
          <h2
            style={{
              "font-size": "1.25rem",
              "margin-bottom": "1rem",
              color: "#2d3748",
            }}
          >
            Basic Information
          </h2>
          <div
            style={{
              display: "grid",
              "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <strong style={{ color: "#4a5568" }}>Date of Birth:</strong>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                {child()?.dateOfBirth && formatDate(child()!.dateOfBirth)}
              </p>
            </div>
            <div>
              <strong style={{ color: "#4a5568" }}>Age:</strong>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                {child()?.dateOfBirth && calculateAge(child()!.dateOfBirth)} years old
              </p>
            </div>
            <Show when={child()?.gender}>
              <div>
                <strong style={{ color: "#4a5568" }}>Gender:</strong>
                <p style={{ margin: "0.25rem 0 0 0" }}>
                  {child()
                    ?.gender?.replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </p>
              </div>
            </Show>
          </div>
        </div>

        {/* School Information */}
        <Show when={child()?.schoolName || child()?.schoolGrade || child()?.schoolTeacher}>
          <div
            style={{
              "background-color": "#fff",
              padding: "1.5rem",
              "border-radius": "8px",
              border: "1px solid #e2e8f0",
              "margin-bottom": "2rem",
            }}
          >
            <h2
              style={{
                "font-size": "1.25rem",
                "margin-bottom": "1rem",
                color: "#2d3748",
              }}
            >
              School Information
            </h2>
            <div
              style={{
                display: "grid",
                "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              <Show when={child()?.schoolName}>
                <div>
                  <strong style={{ color: "#4a5568" }}>School:</strong>
                  <p style={{ margin: "0.25rem 0 0 0" }}>{child()?.schoolName}</p>
                </div>
              </Show>
              <Show when={child()?.schoolGrade}>
                <div>
                  <strong style={{ color: "#4a5568" }}>Grade:</strong>
                  <p style={{ margin: "0.25rem 0 0 0" }}>{child()?.schoolGrade}</p>
                </div>
              </Show>
              <Show when={child()?.schoolTeacher}>
                <div>
                  <strong style={{ color: "#4a5568" }}>Teacher:</strong>
                  <p style={{ margin: "0.25rem 0 0 0" }}>{child()?.schoolTeacher}</p>
                </div>
              </Show>
            </div>
          </div>
        </Show>

        {/* Medical Information */}
        <Show when={child()?.allergies || child()?.medications || child()?.specialNeeds}>
          <div
            style={{
              "background-color": "#fff5f5",
              padding: "1.5rem",
              "border-radius": "8px",
              border: "1px solid #feb2b2",
              "margin-bottom": "2rem",
            }}
          >
            <h2
              style={{
                "font-size": "1.25rem",
                "margin-bottom": "1rem",
                color: "#c53030",
              }}
            >
              ⚠️ Medical Information
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              <Show when={child()?.allergies}>
                <div>
                  <strong style={{ color: "#742a2a" }}>Allergies:</strong>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#742a2a" }}>{child()?.allergies}</p>
                </div>
              </Show>
              <Show when={child()?.medications}>
                <div>
                  <strong style={{ color: "#742a2a" }}>Medications:</strong>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#742a2a" }}>
                    {child()?.medications}
                  </p>
                </div>
              </Show>
              <Show when={child()?.specialNeeds}>
                <div>
                  <strong style={{ color: "#742a2a" }}>Special Needs:</strong>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#742a2a" }}>
                    {child()?.specialNeeds}
                  </p>
                </div>
              </Show>
            </div>
          </div>
        </Show>

        {/* Additional Notes */}
        <Show when={child()?.notes}>
          <div
            style={{
              "background-color": "#fff",
              padding: "1.5rem",
              "border-radius": "8px",
              border: "1px solid #e2e8f0",
              "margin-bottom": "2rem",
            }}
          >
            <h2
              style={{
                "font-size": "1.25rem",
                "margin-bottom": "1rem",
                color: "#2d3748",
              }}
            >
              Additional Notes
            </h2>
            <p style={{ color: "#4a5568", margin: 0 }}>{child()?.notes}</p>
          </div>
        </Show>

        {/* Care Session History */}
        <div
          style={{
            "background-color": "#fff",
            padding: "1.5rem",
            "border-radius": "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
              "margin-bottom": "1rem",
            }}
          >
            <h2 style={{ "font-size": "1.25rem", color: "#2d3748" }}>
              Recent Care Sessions ({child()?.careSessions?.length || 0})
            </h2>
          </div>

          <Show
            when={child()?.careSessions?.length}
            fallback={
              <p style={{ color: "#718096", "text-align": "center", padding: "2rem" }}>
                No care sessions recorded yet.
              </p>
            }
          >
            <div style={{ "overflow-x": "auto" }}>
              <table style={{ width: "100%", "border-collapse": "collapse" }}>
                <thead style={{ "background-color": "#f7fafc" }}>
                  <tr>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "1px solid #e2e8f0",
                      }}
                    >
                      Date/Time
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "1px solid #e2e8f0",
                      }}
                    >
                      Duration
                    </th>
                    <th
                      style={{
                        padding: "0.75rem",
                        "text-align": "left",
                        "border-bottom": "1px solid #e2e8f0",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={child()?.careSessions}>
                    {(session) => {
                      const statusColors = getStatusColor(session.status);
                      return (
                        <tr style={{ "border-bottom": "1px solid #e2e8f0" }}>
                          <td style={{ padding: "0.75rem" }}>
                            {formatDateTime(session.scheduledStart)}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            {session.scheduledEnd
                              ? `${Math.round(
                                  (new Date(session.scheduledEnd).getTime() -
                                    new Date(session.scheduledStart).getTime()) /
                                    (1000 * 60 * 60),
                                )} hours`
                              : "N/A"}
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span
                              style={{
                                padding: "0.25rem 0.75rem",
                                "border-radius": "9999px",
                                "background-color": statusColors.bg,
                                color: statusColors.color,
                                "font-size": "0.875rem",
                                "font-weight": "600",
                              }}
                            >
                              {session.status}
                            </span>
                          </td>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        </div>
      </Show>
    </main>
  );
}

