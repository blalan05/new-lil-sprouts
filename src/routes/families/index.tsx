import { createAsync, type RouteDefinition, A } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { getFamilies, deleteFamily } from "~/lib/families";
import { getAllChildren, deleteChild } from "~/lib/children";

export const route = {
  preload() {
    getFamilies();
    getAllChildren();
  },
} satisfies RouteDefinition;

type ViewType = "families" | "children";

export default function FamiliesPage() {
  const [view, setView] = createSignal<ViewType>("families");
  const families = createAsync(() => getFamilies());
  const children = createAsync(() => getAllChildren());
  const [searchTerm, setSearchTerm] = createSignal("");
  const [filterFamily, setFilterFamily] = createSignal<string>("");

  const filteredFamilies = () => {
    const term = searchTerm().toLowerCase();
    if (!term) return families();
    return families()?.filter(
      (f) =>
        f.familyName.toLowerCase().includes(term) ||
        f.email.toLowerCase().includes(term) ||
        f.parentFirstName.toLowerCase().includes(term) ||
        f.parentLastName.toLowerCase().includes(term),
    );
  };

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

  const handleDeleteFamily = async (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete the ${name} family? This will also delete all associated children and records.`,
      )
    ) {
      await deleteFamily(id);
      window.location.reload();
    }
  };

  const handleDeleteChild = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This will also delete all associated records.`)) {
      await deleteChild(id);
      window.location.reload();
    }
  };

  return (
    <main
      style={{
        "max-width": "1400px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <header
        style={{
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
          "margin-bottom": "2rem",
        }}
      >
        <div>
          <A
            href="/"
            style={{
              color: "#4299e1",
              "text-decoration": "none",
              "margin-bottom": "0.5rem",
              display: "inline-block",
            }}
          >
            ← Back to Dashboard
          </A>
          <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>
            {view() === "families" ? "Manage Families" : "All Children"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1rem", "align-items": "center" }}>
          {view() === "families" ? (
            <A
              href="/families/new"
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
              + Add New Family
            </A>
          ) : (
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
              + Add Child (via Families)
            </A>
          )}
        </div>
      </header>

      {/* View Toggle */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          "margin-bottom": "1.5rem",
          "background-color": "#fff",
          padding: "0.5rem",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        <button
          onClick={() => setView("families")}
          style={{
            padding: "0.5rem 1rem",
            "background-color": view() === "families" ? "#4299e1" : "transparent",
            color: view() === "families" ? "white" : "#2d3748",
            border: "none",
            "border-radius": "4px",
            cursor: "pointer",
            "font-weight": view() === "families" ? "600" : "400",
          }}
        >
          Families
        </button>
        <button
          onClick={() => setView("children")}
          style={{
            padding: "0.5rem 1rem",
            "background-color": view() === "children" ? "#4299e1" : "transparent",
            color: view() === "children" ? "white" : "#2d3748",
            border: "none",
            "border-radius": "4px",
            cursor: "pointer",
            "font-weight": view() === "children" ? "600" : "400",
          }}
        >
          All Children
        </button>
      </div>

      <div
        style={{
          "background-color": "#fff",
          padding: "1.5rem",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
          "margin-bottom": "2rem",
        }}
      >
        {view() === "families" ? (
          <input
            type="text"
            placeholder="Search families by name or email..."
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
        ) : (
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
        )}
      </div>

      <Show when={view() === "families"}>
        <Show
          when={!families.loading && families()}
          fallback={
            <div style={{ "text-align": "center", padding: "3rem" }}>Loading families...</div>
          }
        >
        <Show
          when={filteredFamilies()?.length}
          fallback={
            <div
              style={{
                "text-align": "center",
                padding: "3rem",
                "background-color": "#f7fafc",
                "border-radius": "8px",
              }}
            >
              <p style={{ color: "#718096", "font-size": "1.1rem" }}>
                No families found. Click "Add New Family" to get started.
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
            <For each={filteredFamilies()}>
              {(family) => (
                <div
                  style={{
                    "background-color": "#fff",
                    padding: "1.5rem",
                    "border-radius": "8px",
                    border: "1px solid #e2e8f0",
                    "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
                    display: "grid",
                    "grid-template-columns": "1fr auto",
                    gap: "1rem",
                    "align-items": "start",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        "font-size": "1.25rem",
                        "margin-bottom": "0.5rem",
                        color: "#2d3748",
                      }}
                    >
                      {family.familyName}
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                        "margin-bottom": "1rem",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#4a5568" }}>Parents:</strong>
                        <p style={{ margin: "0.25rem 0 0 0" }}>
                          {family.parentFirstName} {family.parentLastName}
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: "#4a5568" }}>Email:</strong>
                        <p style={{ margin: "0.25rem 0 0 0" }}>{family.email}</p>
                      </div>
                      <Show when={family.phone}>
                        <div>
                          <strong style={{ color: "#4a5568" }}>Phone:</strong>
                          <p style={{ margin: "0.25rem 0 0 0" }}>{family.phone}</p>
                        </div>
                      </Show>
                      <div>
                        <strong style={{ color: "#4a5568" }}>Children:</strong>
                        <p style={{ margin: "0.25rem 0 0 0" }}>{family.children?.length || 0}</p>
                      </div>
                      <Show when={(family as any).amountOwed !== undefined}>
                        <div>
                          <strong style={{ color: "#4a5568" }}>Amount Owed:</strong>
                          <p style={{ margin: "0.25rem 0 0 0" }}>
                            <span
                              style={{
                                "font-weight": "700",
                                color: (family as any).amountOwed > 0 ? "#c53030" : "#276749",
                                "font-size": "1.125rem",
                              }}
                            >
                              ${((family as any).amountOwed || 0).toFixed(2)}
                            </span>
                            {(family as any).unpaidSessionCount > 0 && (
                              <span style={{ color: "#718096", "font-size": "0.875rem", "margin-left": "0.5rem" }}>
                                ({(family as any).unpaidSessionCount} unpaid session{(family as any).unpaidSessionCount !== 1 ? "s" : ""})
                              </span>
                            )}
                          </p>
                        </div>
                      </Show>
                    </div>
                    <Show when={family.children && family.children.length > 0}>
                      <div style={{ "margin-top": "1rem", "padding-top": "1rem", "border-top": "1px solid #e2e8f0" }}>
                        <strong style={{ color: "#4a5568", "margin-bottom": "0.5rem", display: "block" }}>Children:</strong>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem" }}>
                          <For each={family.children}>
                            {(child) => (
                              <A
                                href={`/families/${family.id}/children/${child.id}`}
                                style={{
                                  padding: "0.375rem 0.75rem",
                                  "background-color": "#edf2f7",
                                  color: "#2d3748",
                                  border: "1px solid #cbd5e0",
                                  "border-radius": "4px",
                                  "text-decoration": "none",
                                  "font-size": "0.875rem",
                                  display: "inline-block",
                                }}
                              >
                                {child.firstName} {child.lastName}
                                {child.allergies && " ⚠️"}
                              </A>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>
                    <Show when={family.address}>
                      <div style={{ "margin-top": "0.5rem" }}>
                        <strong style={{ color: "#4a5568" }}>Address:</strong>
                        <p style={{ margin: "0.25rem 0 0 0", color: "#718096" }}>
                          {family.address}
                          {family.city && `, ${family.city}`}
                          {family.state && `, ${family.state}`}
                          {family.zipCode && ` ${family.zipCode}`}
                        </p>
                      </div>
                    </Show>
                    <Show when={family.emergencyContact || family.emergencyPhone}>
                      <div style={{ "margin-top": "0.5rem" }}>
                        <strong style={{ color: "#4a5568" }}>Emergency Contact:</strong>
                        <p style={{ margin: "0.25rem 0 0 0", color: "#718096" }}>
                          {family.emergencyContact}
                          {family.emergencyPhone && ` - ${family.emergencyPhone}`}
                        </p>
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
                      href={`/families/${family.id}`}
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
                      href={`/families/${family.id}/edit`}
                      style={{
                        padding: "0.5rem 1rem",
                        "background-color": "#edf2f7",
                        color: "#2d3748",
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
                      onClick={() => handleDeleteFamily(family.id, family.familyName)}
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
              )}
            </For>
          </div>
        </Show>
        </Show>
      </Show>

      <Show when={view() === "children"}>
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
                <p style={{ color: "#718096", "font-size": "1.1rem" }}>
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
                      "background-color": "#fff",
                      padding: "1.5rem",
                      "border-radius": "8px",
                      border: "1px solid #e2e8f0",
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
                              color: "#2d3748",
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
                          href={`/families/${child.familyId}/children/${child.id}`}
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
                          href={`/families/${child.familyId}/children/${child.id}/edit`}
                          style={{
                            padding: "0.5rem 1rem",
                            "background-color": "#edf2f7",
                            color: "#2d3748",
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
                            handleDeleteChild(child.id, `${child.firstName} ${child.lastName}`)
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
      </Show>
    </main>
  );
}
