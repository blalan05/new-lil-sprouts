import { createAsync, type RouteDefinition, A, useNavigate } from "@solidjs/router";
import { For, Show, createSignal, createEffect, onCleanup } from "solid-js";
import { getFamilies, deleteFamily, formatParentNames } from "~/lib/families";
import { getAllChildren, deleteChild } from "~/lib/children";

export const route = {
  preload() {
    getFamilies();
    getAllChildren();
  },
} satisfies RouteDefinition;

type ViewType = "families" | "children";

export default function FamiliesPage() {
  const navigate = useNavigate();
  const [view, setView] = createSignal<ViewType>("families");
  const families = createAsync(() => getFamilies());
  const children = createAsync(() => getAllChildren());
  const [searchTerm, setSearchTerm] = createSignal("");
  const [filterFamily, setFilterFamily] = createSignal<string>("");
  const [openDropdown, setOpenDropdown] = createSignal<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = createSignal<{ top: number; right: number } | null>(null);

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

  // Close dropdown when clicking outside
  createEffect(() => {
    const dropdownId = openDropdown();
    if (dropdownId !== null) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Check if click is inside any dropdown container or button
        const container = target.closest('[data-dropdown-container]');
        const isButton = target.closest('button[data-dropdown-button]');
        const isDropdown = target.closest('[data-dropdown-menu]');
        if (!container && !isButton && !isDropdown) {
          setOpenDropdown(null);
          setDropdownPosition(null);
        }
      };
      
      // Add listener after current event loop to avoid immediate trigger
      const timeoutId = setTimeout(() => {
        window.addEventListener('click', handleClickOutside, true);
      }, 10);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('click', handleClickOutside, true);
      };
    } else {
      setDropdownPosition(null);
    }
  });

  return (
    <main
      style={{
        "max-width": "1400px",
        margin: "0 auto",
        padding: "1.5rem",
      }}
    >
      <header style={{ "margin-bottom": "1rem" }}>
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "flex-wrap": "wrap",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", "align-items": "center", gap: "1rem", "flex-wrap": "wrap" }}>
            <A
              href="/"
              style={{
                color: "#4299e1",
                "text-decoration": "none",
                display: "inline-block",
              }}
            >
              ← Back to Dashboard
            </A>
            <h1 style={{ color: "#2d3748", "font-size": "1.5rem", margin: 0, "font-weight": "700" }}>
              {view() === "families" ? "Manage Families" : "All Children"}
            </h1>
          </div>
        <div style={{ display: "flex", gap: "0.75rem", "align-items": "center" }}>
          {view() === "families" ? (
            <A
              href="/families/new"
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#48bb78",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-weight": "600",
                "font-size": "0.875rem",
                display: "inline-block",
              }}
            >
              + Add New Family
            </A>
          ) : (
            <A
              href="/families"
              style={{
                padding: "0.5rem 1rem",
                "background-color": "#48bb78",
                color: "white",
                border: "none",
                "border-radius": "4px",
                "text-decoration": "none",
                "font-weight": "600",
                "font-size": "0.875rem",
                display: "inline-block",
              }}
            >
              + Add Child (via Families)
            </A>
          )}
        </div>
        </div>
      </header>

      {/* View Toggle */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          "margin-bottom": "1rem",
          "background-color": "#fff",
          padding: "0.375rem",
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
          padding: "1rem",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
          "margin-bottom": "1rem",
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
              padding: "0.5rem 0.75rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "0.875rem",
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
            <div style={{ "text-align": "center", padding: "2rem" }}>Loading families...</div>
          }
        >
        <Show
          when={filteredFamilies()?.length}
          fallback={
              <div
                style={{
                  "text-align": "center",
                  padding: "2rem",
                  "background-color": "#f7fafc",
                  "border-radius": "8px",
                }}
              >
                <p style={{ color: "#718096", "font-size": "0.875rem" }}>
                  No families found. Click "Add New Family" to get started.
                </p>
              </div>
          }
        >
          <div style={{ "background-color": "#fff", "border-radius": "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", "border-collapse": "collapse" }}>
                <thead>
                  <tr style={{ "background-color": "#f7fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Last</th>
                    <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Parents</th>
                    <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Children Names</th>
                    <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Amount Owed</th>
                    <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Watched Since</th>
                    <th style={{ padding: "0.75rem", "text-align": "center", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={filteredFamilies()}>
                    {(family, index) => (
                      <tr 
                        style={{ 
                          borderBottom: "1px solid #e2e8f0",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                          "background-color": index() % 2 === 0 ? "#fff" : "#f7fafc",
                        }}
                        onClick={() => navigate(`/families/${family.id}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#edf2f7";
                        }}
                        onMouseLeave={(e) => {
                          const bgColor = index() % 2 === 0 ? "#fff" : "#f7fafc";
                          e.currentTarget.style.backgroundColor = bgColor;
                        }}
                      >
                        <td style={{ padding: "0.75rem", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>
                          {family.familyName}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#4a5568", "font-size": "0.875rem" }}>
                          {formatParentNames(
                            family.parentFirstName,
                            family.parentLastName,
                            family.familyMembers
                          )}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#4a5568", "font-size": "0.875rem" }}>
                          <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.25rem" }}>
                            <For each={family.children}>
                              {(child) => (
                                <A
                                  href={`/families/${family.id}/children/${child.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    color: "#4299e1",
                                    "text-decoration": "none",
                                    "font-size": "0.8125rem",
                                  }}
                                >
                                  {child.firstName} {child.lastName}
                                  {child.allergies && " ⚠️"}
                                </A>
                              )}
                            </For>
                            {(!family.children || family.children.length === 0) && (
                              <span style={{ color: "#a0aec0", "font-size": "0.8125rem" }}>None</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem", "text-align": "right", "font-size": "0.875rem" }}>
                          <Show
                            when={(family as any).amountOwed !== undefined}
                            fallback={<span style={{ color: "#a0aec0" }}>$0.00</span>}
                          >
                            <span
                              style={{
                                "font-weight": "700",
                                color: (family as any).amountOwed > 0 ? "#c53030" : "#276749",
                              }}
                            >
                              ${((family as any).amountOwed || 0).toFixed(2)}
                            </span>
                            {(family as any).unpaidSessionCount > 0 && (
                              <div style={{ color: "#718096", "font-size": "0.75rem", "margin-top": "0.125rem" }}>
                                ({(family as any).unpaidSessionCount} unpaid)
                              </div>
                            )}
                          </Show>
                        </td>
                        <td style={{ padding: "0.75rem", color: "#718096", "font-size": "0.875rem" }}>
                          {formatDate(family.createdAt)}
                        </td>
                        <td style={{ padding: "0.75rem", "text-align": "center" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ position: "relative", display: "inline-block" }} data-dropdown-container>
                            <button
                              data-dropdown-button
                              onClick={(e) => {
                                e.stopPropagation();
                                const isOpen = openDropdown() === family.id;
                                if (!isOpen) {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setDropdownPosition({
                                    top: rect.bottom + window.scrollY + 4,
                                    right: window.innerWidth - rect.right + window.scrollX,
                                  });
                                  setOpenDropdown(family.id);
                                } else {
                                  setOpenDropdown(null);
                                  setDropdownPosition(null);
                                }
                              }}
                              style={{
                                padding: "0.25rem 0.5rem",
                                "background-color": "#edf2f7",
                                color: "#2d3748",
                                border: "1px solid #cbd5e0",
                                "border-radius": "4px",
                                cursor: "pointer",
                                "font-size": "0.75rem",
                                display: "flex",
                                "align-items": "center",
                                gap: "0.25rem",
                              }}
                            >
                              Actions
                              <span style={{ "font-size": "0.625rem" }}>▼</span>
                            </button>
                            <Show when={openDropdown() === family.id && dropdownPosition()}>
                              {(pos) => (
                                <div
                                  data-dropdown-menu
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    position: "fixed",
                                    top: `${pos().top}px`,
                                    right: `${pos().right}px`,
                                    "background-color": "#fff",
                                    border: "1px solid #e2e8f0",
                                    "border-radius": "4px",
                                    "box-shadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    "z-index": 1000,
                                    "min-width": "120px",
                                  }}
                                >
                                <A
                                  href={`/families/${family.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(null);
                                  }}
                                  style={{
                                    display: "flex",
                                    "align-items": "center",
                                    gap: "0.5rem",
                                    padding: "0.5rem 0.75rem",
                                    color: "#2d3748",
                                    "text-decoration": "none",
                                    "font-size": "0.875rem",
                                    transition: "background-color 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f7fafc";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  <span>👁️</span>
                                  <span>View</span>
                                </A>
                                <A
                                  href={`/families/${family.id}/edit`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(null);
                                  }}
                                  style={{
                                    display: "flex",
                                    "align-items": "center",
                                    gap: "0.5rem",
                                    padding: "0.5rem 0.75rem",
                                    color: "#2d3748",
                                    "text-decoration": "none",
                                    "font-size": "0.875rem",
                                    transition: "background-color 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f7fafc";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  <span>✏️</span>
                                  <span>Edit</span>
                                </A>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(null);
                                    handleDeleteFamily(family.id, family.familyName);
                                  }}
                                  style={{
                                    display: "flex",
                                    "align-items": "center",
                                    gap: "0.5rem",
                                    width: "100%",
                                    padding: "0.5rem 0.75rem",
                                    "background-color": "transparent",
                                    color: "#c53030",
                                    border: "none",
                                    "text-align": "left",
                                    cursor: "pointer",
                                    "font-size": "0.875rem",
                                    transition: "background-color 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#fff5f5";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  <span>🗑️</span>
                                  <span>Delete</span>
                                </button>
                                </div>
                              )}
                            </Show>
                          </div>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </Show>
        </Show>
      </Show>

      <Show when={view() === "children"}>
        <Show
          when={!children.loading && children()}
          fallback={
            <div style={{ "text-align": "center", padding: "2rem" }}>Loading children...</div>
          }
        >
          <Show
            when={filteredChildren()?.length}
            fallback={
              <div
                style={{
                  "text-align": "center",
                  padding: "2rem",
                  "background-color": "#f7fafc",
                  "border-radius": "8px",
                }}
              >
                <p style={{ color: "#718096", "font-size": "0.875rem" }}>
                  No children found. Add children through the Families page.
                </p>
              </div>
            }
          >
            <div style={{ "background-color": "#fff", "border-radius": "8px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ overflow: "auto" }}>
                <table style={{ width: "100%", "border-collapse": "collapse" }}>
                  <thead>
                    <tr style={{ "background-color": "#f7fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Last</th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>First</th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Age/Birthday</th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Gender</th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Watched Since</th>
                      <th style={{ padding: "0.75rem", "text-align": "center", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={filteredChildren()}>
                      {(child, index) => (
                        <tr 
                          style={{ 
                            borderBottom: "1px solid #e2e8f0",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                            "background-color": index() % 2 === 0 ? "#fff" : "#f7fafc",
                          }}
                          onClick={() => navigate(`/families/${child.familyId}/children/${child.id}`)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#edf2f7";
                          }}
                          onMouseLeave={(e) => {
                            const bgColor = index() % 2 === 0 ? "#fff" : "#f7fafc";
                            e.currentTarget.style.backgroundColor = bgColor;
                          }}
                        >
                          <td style={{ padding: "0.75rem", "font-weight": "600", color: "#2d3748", "font-size": "0.875rem" }}>
                            {child.lastName}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#4a5568", "font-size": "0.875rem" }}>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.25rem" }}>
                              <span>{child.firstName}</span>
                              <Show when={child.allergies}>
                                <span style={{ color: "#c53030" }} title="Has allergies">⚠️</span>
                              </Show>
                              <Show when={child.medications}>
                                <span style={{ color: "#7c2d12" }} title="Has medications">💊</span>
                              </Show>
                              <Show when={child.specialNeeds}>
                                <span style={{ color: "#2c5282" }} title="Has special needs">♿</span>
                              </Show>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem", color: "#4a5568", "font-size": "0.875rem" }}>
                            {calculateAge(child.dateOfBirth)} ({formatDate(child.dateOfBirth)})
                          </td>
                          <td style={{ padding: "0.75rem", color: "#4a5568", "font-size": "0.875rem" }}>
                            {child.gender
                              ?.replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "-"}
                          </td>
                          <td style={{ padding: "0.75rem", color: "#718096", "font-size": "0.875rem" }}>
                            {formatDate(child.createdAt)}
                          </td>
                          <td style={{ padding: "0.75rem", "text-align": "center" }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ position: "relative", display: "inline-block" }} data-dropdown-container>
                              <button
                                data-dropdown-button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const isOpen = openDropdown() === child.id;
                                  if (!isOpen) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setDropdownPosition({
                                      top: rect.bottom + window.scrollY + 4,
                                      right: window.innerWidth - rect.right + window.scrollX,
                                    });
                                    setOpenDropdown(child.id);
                                  } else {
                                    setOpenDropdown(null);
                                    setDropdownPosition(null);
                                  }
                                }}
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  "background-color": "#edf2f7",
                                  color: "#2d3748",
                                  border: "1px solid #cbd5e0",
                                  "border-radius": "4px",
                                  cursor: "pointer",
                                  "font-size": "0.75rem",
                                  display: "flex",
                                  "align-items": "center",
                                  gap: "0.25rem",
                                }}
                              >
                                Actions
                                <span style={{ "font-size": "0.625rem" }}>▼</span>
                              </button>
                              <Show when={openDropdown() === child.id && dropdownPosition()}>
                                {(pos) => (
                                  <div
                                    data-dropdown-menu
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      position: "fixed",
                                      top: `${pos().top}px`,
                                      right: `${pos().right}px`,
                                      "background-color": "#fff",
                                      border: "1px solid #e2e8f0",
                                      "border-radius": "4px",
                                      "box-shadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
                                      "z-index": 1000,
                                      "min-width": "120px",
                                    }}
                                  >
                                  <A
                                    href={`/families/${child.familyId}/children/${child.id}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenDropdown(null);
                                    }}
                                    style={{
                                      display: "flex",
                                      "align-items": "center",
                                      gap: "0.5rem",
                                      padding: "0.5rem 0.75rem",
                                      color: "#2d3748",
                                      "text-decoration": "none",
                                      "font-size": "0.875rem",
                                      transition: "background-color 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "#f7fafc";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = "transparent";
                                    }}
                                  >
                                    <span>👁️</span>
                                    <span>View</span>
                                  </A>
                                  <A
                                    href={`/families/${child.familyId}/children/${child.id}/edit`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenDropdown(null);
                                    }}
                                    style={{
                                      display: "flex",
                                      "align-items": "center",
                                      gap: "0.5rem",
                                      padding: "0.5rem 0.75rem",
                                      color: "#2d3748",
                                      "text-decoration": "none",
                                      "font-size": "0.875rem",
                                      transition: "background-color 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "#f7fafc";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = "transparent";
                                    }}
                                  >
                                    <span>✏️</span>
                                    <span>Edit</span>
                                  </A>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenDropdown(null);
                                      handleDeleteChild(child.id, `${child.firstName} ${child.lastName}`);
                                    }}
                                    style={{
                                      display: "flex",
                                      "align-items": "center",
                                      gap: "0.5rem",
                                      width: "100%",
                                      padding: "0.5rem 0.75rem",
                                      "background-color": "transparent",
                                      color: "#c53030",
                                      border: "none",
                                      "text-align": "left",
                                      cursor: "pointer",
                                      "font-size": "0.875rem",
                                      transition: "background-color 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "#fff5f5";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = "transparent";
                                    }}
                                  >
                                    <span>🗑️</span>
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </Show>
                          </div>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </Show>
        </Show>
      </Show>
    </main>
  );
}
