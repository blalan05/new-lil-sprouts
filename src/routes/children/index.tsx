import { ensureOwner } from "~/lib/route-guards";
import { createAsync, type RouteDefinition, A, useAction } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { getAllChildren, deleteChild } from "~/lib/children";
import { getFamilies } from "~/lib/families";

export const route = {
  preload() {
    ensureOwner();
    getAllChildren();
    getFamilies();
  },
} satisfies RouteDefinition;

export default function ChildrenPage() {
  const deleteChildAction = useAction(deleteChild);
  const children = createAsync(() => getAllChildren());
  const families = createAsync(() => getFamilies());
  const [searchTerm, setSearchTerm] = createSignal("");
  const [filterFamily, setFilterFamily] = createSignal<string>("");

  const filteredChildren = () => {
    const term = searchTerm().toLowerCase();
    const familyId = filterFamily();
    let filtered = children();

    if (familyId) {
      filtered = filtered?.filter((c) => c.familyId === familyId);
    }

    if (!term) return filtered;

    return filtered?.filter(
      (c) =>
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.family?.familyName.toLowerCase().includes(term) ||
        (c.allergies && c.allergies.toLowerCase().includes(term)) ||
        (c.schoolName && c.schoolName.toLowerCase().includes(term)),
    );
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

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This will also delete all associated records.`)) {
      await deleteChildAction(id);
    }
  };

  return (
    <main class="page">
      <header
        style={{
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
          "margin-bottom": "2rem",
          "flex-wrap": "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ color: "var(--color-text)", "font-size": "2rem", margin: 0 }}>Manage Children</h1>
        </div>
        <A
          href="/families"
          style={{
            padding: "0.75rem 1.5rem",
            "background-color": "#48bb78",
            color: "white",
            border: "none",
            "border-radius": "4px",
            "text-decoration": "none",
            "font-weight": "600",
            display: "inline-block",
          }}
        >
          + Add New Child (via Families)
        </A>
      </header>

      <div
        style={{
          "background-color": "var(--color-surface)",
          padding: "1.5rem",
          "border-radius": "8px",
          border: "1px solid var(--color-border)",
          "margin-bottom": "2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            "grid-template-columns": "2fr 1fr",
            gap: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="Search children by name, family, allergies, or school..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "1rem",
            }}
          />
          <select
            value={filterFamily()}
            onChange={(e) => setFilterFamily(e.currentTarget.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "1rem",
            }}
          >
            <option value="">All Families</option>
            <For each={families()}>
              {(family) => <option value={family.id}>{family.familyName}</option>}
            </For>
          </select>
        </div>
      </div>

      <Show
        when={!children.loading && children()}
        fallback={
          <div style={{ "text-align": "center", padding: "3rem" }}>Loading children...</div>
        }
      >
        <Show
          when={filteredChildren()?.length}
          fallback={
            <div
              style={{
                "text-align": "center",
                padding: "3rem",
                "background-color": "#f7fafc",
                "border-radius": "8px",
              }}
            >
              <p style={{ color: "var(--color-text-muted)", "font-size": "1.1rem" }}>
                No children found. Add children through the Families page.
              </p>
            </div>
          }
        >
          <div
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            <For each={filteredChildren()}>
              {(child) => (
                <div
                  style={{
                    "background-color": "var(--color-surface)",
                    padding: "1.5rem",
                    "border-radius": "8px",
                    border: "1px solid var(--color-border)",
                    "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      "grid-template-columns": "1fr auto",
                      gap: "1rem",
                      "align-items": "start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          "align-items": "center",
                          gap: "0.5rem",
                          "margin-bottom": "0.5rem",
                        }}
                      >
                        <h3
                          style={{
                            "font-size": "1.25rem",
                            margin: "0",
                            color: "var(--color-text)",
                          }}
                        >
                          {child.firstName} {child.lastName}
                        </h3>
                        <Show when={child.allergies}>
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              "border-radius": "4px",
                              "background-color": "#fed7d7",
                              color: "#c53030",
                              "font-size": "0.75rem",
                              "font-weight": "600",
                            }}
                          >
                            ⚠️ Allergies
                          </span>
                        </Show>
                        <Show when={child.medications}>
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              "border-radius": "4px",
                              "background-color": "#feebc8",
                              color: "#7c2d12",
                              "font-size": "0.75rem",
                              "font-weight": "600",
                            }}
                          >
                            💊 Medications
                          </span>
                        </Show>
                        <Show when={child.specialNeeds}>
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              "border-radius": "4px",
                              "background-color": "#bee3f8",
                              color: "#2c5282",
                              "font-size": "0.75rem",
                              "font-weight": "600",
                            }}
                          >
                            ♿ Special Needs
                          </span>
                        </Show>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "1rem",
                          "margin-bottom": "1rem",
                        }}
                      >
                        <div>
                          <strong style={{ color: "#4a5568" }}>Family:</strong>
                          <p style={{ margin: "0.25rem 0 0 0" }}>
                            <A
                              href={`/families/${child.familyId}`}
                              style={{
                                color: "#4299e1",
                                "text-decoration": "none",
                              }}
                            >
                              {child.family?.familyName}
                            </A>
                          </p>
                        </div>
                        <div>
                          <strong style={{ color: "#4a5568" }}>Age:</strong>
                          <p style={{ margin: "0.25rem 0 0 0" }}>
                            {calculateAge(child.dateOfBirth)} years old
                          </p>
                        </div>
                        <div>
                          <strong style={{ color: "#4a5568" }}>Date of Birth:</strong>
                          <p style={{ margin: "0.25rem 0 0 0" }}>
                            {formatDate(child.dateOfBirth)}
                          </p>
                        </div>
                        <Show when={child.gender}>
                          <div>
                            <strong style={{ color: "#4a5568" }}>Gender:</strong>
                            <p style={{ margin: "0.25rem 0 0 0" }}>
                              {child.gender
                                ?.replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </p>
                          </div>
                        </Show>
                        <Show when={child.schoolName}>
                          <div>
                            <strong style={{ color: "#4a5568" }}>School:</strong>
                            <p style={{ margin: "0.25rem 0 0 0" }}>{child.schoolName}</p>
                          </div>
                        </Show>
                        <Show when={child.schoolGrade}>
                          <div>
                            <strong style={{ color: "#4a5568" }}>Grade:</strong>
                            <p style={{ margin: "0.25rem 0 0 0" }}>{child.schoolGrade}</p>
                          </div>
                        </Show>
                      </div>
                      <Show when={child.allergies || child.medications || child.specialNeeds}>
                        <div
                          style={{
                            padding: "0.75rem",
                            "background-color": "#fff5f5",
                            border: "1px solid #feb2b2",
                            "border-radius": "4px",
                            "margin-top": "0.5rem",
                          }}
                        >
                          <Show when={child.allergies}>
                            <div style={{ "font-size": "0.875rem", "margin-bottom": "0.25rem" }}>
                              <strong style={{ color: "#c53030" }}>Allergies:</strong>{" "}
                              <span style={{ color: "#742a2a" }}>{child.allergies}</span>
                            </div>
                          </Show>
                          <Show when={child.medications}>
                            <div style={{ "font-size": "0.875rem", "margin-bottom": "0.25rem" }}>
                              <strong style={{ color: "#c53030" }}>Medications:</strong>{" "}
                              <span style={{ color: "#742a2a" }}>{child.medications}</span>
                            </div>
                          </Show>
                          <Show when={child.specialNeeds}>
                            <div style={{ "font-size": "0.875rem" }}>
                              <strong style={{ color: "#c53030" }}>Special Needs:</strong>{" "}
                              <span style={{ color: "#742a2a" }}>{child.specialNeeds}</span>
                            </div>
                          </Show>
                        </div>
                      </Show>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        "flex-direction": "column",
                      }}
                    >
                      <A
                        href={`/children/${child.id}`}
                        style={{
                          padding: "0.5rem 1rem",
                          "background-color": "#4299e1",
                          color: "white",
                          border: "none",
                          "border-radius": "4px",
                          "text-decoration": "none",
                          "text-align": "center",
                          "font-size": "0.875rem",
                        }}
                      >
                        View Details
                      </A>
                      <A
                        href={`/children/${child.id}/edit`}
                        style={{
                          padding: "0.5rem 1rem",
                          "background-color": "#edf2f7",
                          color: "var(--color-text)",
                          border: "1px solid #cbd5e0",
                          "border-radius": "4px",
                          "text-decoration": "none",
                          "text-align": "center",
                          "font-size": "0.875rem",
                        }}
                      >
                        Edit
                      </A>
                      <button
                        onClick={() =>
                          handleDelete(child.id, `${child.firstName} ${child.lastName}`)
                        }
                        style={{
                          padding: "0.5rem 1rem",
                          "background-color": "#fff5f5",
                          color: "#c53030",
                          border: "1px solid #feb2b2",
                          "border-radius": "4px",
                          cursor: "pointer",
                          "font-size": "0.875rem",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </main>
  );
}

