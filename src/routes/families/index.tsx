import { useNavigate } from "@solidjs/router";
import { For, Show, createSignal, createEffect, createMemo } from "solid-js";
import PageContent, { PageHeader } from "~/components/wa/PageContent";
import EmptyState from "~/components/EmptyState";
import ListToolbar from "~/components/ListToolbar";
import { useConfirm } from "~/components/wa/ConfirmProvider";
import { getFamilies, deleteFamily, formatParentNames } from "~/lib/families";
import { getAllChildren, deleteChild } from "~/lib/children";
import { allergyLabel } from "~/lib/display";
import { formatMoneyDisplay, moneyDisplay } from "~/lib/money-display";
import { compareSort, matchesQuery, moneyNumber } from "~/lib/list-query";
import { useListQuery } from "~/lib/use-list-query";

export const route = {
  preload() {
    getFamilies();
    getAllChildren();
  },
};

type ViewType = "families" | "children";

const FAMILY_SORTS = [
  { value: "name", label: "Name" },
  { value: "children", label: "Children" },
  { value: "owed", label: "Amount owed" },
  { value: "since", label: "Watched since" },
];

const CHILD_SORTS = [
  { value: "name", label: "Name" },
  { value: "birthday", label: "Birthday" },
  { value: "family", label: "Family" },
];

export default function FamiliesPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const list = useListQuery({ sort: "name", dir: "asc", view: "families" });
  const view = (): ViewType => (list.view() === "children" ? "children" : "families");
  const families = createMemo(() => getFamilies());
  const children = createMemo(() => getAllChildren());
  const [openDropdown, setOpenDropdown] = createSignal<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = createSignal<{ top: number; right: number } | null>(null);

  const setPageView = (next: ViewType) => {
    const allowed = next === "families" ? FAMILY_SORTS : CHILD_SORTS;
    if (!allowed.some((option) => option.value === list.sort())) {
      list.patch({ view: next === "families" ? undefined : next, sort: undefined, dir: undefined });
      return;
    }
    list.setView(next);
  };

  const filteredFamilies = () => {
    const rows = (families() ?? []).filter((family) =>
      matchesQuery(list.q(), [
        family.familyName,
        family.email,
        family.parentFirstName,
        family.parentLastName,
        family.phone,
        family.city,
        family.state,
        family.zipCode,
        ...(family.children ?? []).flatMap((child) => [
          child.firstName,
          child.lastName,
          `${child.firstName} ${child.lastName}`,
        ]),
      ]),
    );
    const field = FAMILY_SORTS.some((option) => option.value === list.sort()) ? list.sort() : "name";
    const dir = list.dir();
    return [...rows].sort((a, b) => {
      if (field === "children") return compareSort(a.children?.length ?? 0, b.children?.length ?? 0, dir);
      if (field === "owed") {
        return compareSort(moneyNumber((a as { amountOwed?: unknown }).amountOwed as never), moneyNumber((b as { amountOwed?: unknown }).amountOwed as never), dir);
      }
      if (field === "since") return compareSort(new Date(a.createdAt).getTime(), new Date(b.createdAt).getTime(), dir);
      return compareSort(a.familyName.toLowerCase(), b.familyName.toLowerCase(), dir);
    });
  };

  const filteredChildren = () => {
    let rows = children() ?? [];
    if (list.family()) rows = rows.filter((child) => child.familyId === list.family());
    rows = rows.filter((child) =>
      matchesQuery(list.q(), [
        child.firstName,
        child.lastName,
        `${child.firstName} ${child.lastName}`,
        child.family?.familyName,
        child.allergies,
        child.schoolName,
        child.schoolGrade,
      ]),
    );
    const field = CHILD_SORTS.some((option) => option.value === list.sort()) ? list.sort() : "name";
    const dir = list.dir();
    return [...rows].sort((a, b) => {
      if (field === "birthday") {
        return compareSort(new Date(a.dateOfBirth).getTime(), new Date(b.dateOfBirth).getTime(), dir);
      }
      if (field === "family") {
        return compareSort(
          (a.family?.familyName ?? "").toLowerCase(),
          (b.family?.familyName ?? "").toLowerCase(),
          dir,
        );
      }
      return compareSort(
        `${a.lastName} ${a.firstName}`.toLowerCase(),
        `${b.lastName} ${b.firstName}`.toLowerCase(),
        dir,
      );
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

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteFamily = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete family",
      message: `Are you sure you want to delete the ${name} family? This will also delete all associated children and records.`,
      variant: "danger",
    });
    if (ok) {
      await deleteFamily(id);
      window.location.reload();
    }
  };

  const handleDeleteChild = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete child",
      message: `Are you sure you want to delete ${name}? This will also delete all associated records.`,
      variant: "danger",
    });
    if (ok) {
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
    <PageContent>
      <div class="wa-stack wa-gap-m">
        <a href="/" class="wa-body-s wa-color-text-quiet">
          ← Back to Dashboard
        </a>
        <PageHeader
          title={view() === "families" ? "Manage Families" : "All Children"}
          actions={
            <Show
              when={view() === "families"}
              fallback={
                <a href="/families">
                  <wa-button variant="brand" appearance="filled">
                    + Add Child (via Families)
                  </wa-button>
                </a>
              }
            >
              <a href="/families/new">
                <wa-button variant="brand" appearance="filled">
                  + Add New Family
                </wa-button>
              </a>
            </Show>
          }
        />
      </div>

      {/* View Toggle */}
      <div class="wa-cluster wa-gap-xs">
        <wa-button
          appearance={view() === "families" ? "filled" : "outlined"}
          variant={view() === "families" ? "brand" : "neutral"}
          onClick={() => setPageView("families")}
        >
          Families
        </wa-button>
        <wa-button
          appearance={view() === "children" ? "filled" : "outlined"}
          variant={view() === "children" ? "brand" : "neutral"}
          onClick={() => setPageView("children")}
        >
          All Children
        </wa-button>
      </div>

      <ListToolbar
        query={list}
        searchPlaceholder={
          view() === "families"
            ? "Search name, email, phone, city, or child"
            : "Search name, family, allergies, or school"
        }
        families={view() === "children" ? (families() ?? []) : undefined}
        sortOptions={view() === "families" ? FAMILY_SORTS : CHILD_SORTS}
        sortValue={
          (view() === "families" ? FAMILY_SORTS : CHILD_SORTS).some((option) => option.value === list.sort())
            ? list.sort()
            : "name"
        }
        total={view() === "families" ? (families()?.length ?? 0) : (children()?.length ?? 0)}
        visible={view() === "families" ? filteredFamilies().length : filteredChildren().length}
      />

      <Show when={view() === "families"}>
        <Show
          when={families()}
          fallback={
            <div style={{ "text-align": "center", padding: "2rem" }}>Loading families...</div>
          }
        >
        <Show
          when={filteredFamilies()?.length}
          fallback={
            <EmptyState
              message={
                (families()?.length ?? 0) === 0
                  ? "No families yet. Add a family to get started."
                  : "No families match these filters."
              }
              actionLabel={(families()?.length ?? 0) > 0 && list.hasFilters() ? "Clear filters" : undefined}
              onAction={() => list.clearFilters()}
            />
          }
        >
          <div style={{ "background-color": "var(--color-surface)", "border-radius": "8px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", "border-collapse": "collapse" }}>
                <thead>
                  <tr style={{ "background-color": "var(--color-surface-muted)", borderBottom: "2px solid var(--color-border)" }}>
                    <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Last</th>
                    <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Parents</th>
                    <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Children Names</th>
                    <th style={{ padding: "0.75rem", "text-align": "right", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Amount Owed</th>
                    <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Watched Since</th>
                    <th style={{ padding: "0.75rem", "text-align": "center", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={filteredFamilies()}>
                    {(family, index) => (
                      <tr 
                        style={{ 
                          borderBottom: "1px solid var(--color-border)",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                          "background-color": index() % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-muted)",
                        }}
                        tabindex={0}
                        role="link"
                        onClick={() => navigate(`/families/${family.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/families/${family.id}`);
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--color-hover)";
                        }}
                        onMouseLeave={(e) => {
                          const bgColor = index() % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-muted)";
                          e.currentTarget.style.backgroundColor = bgColor;
                        }}
                      >
                        <td style={{ padding: "0.75rem", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>
                          {family.familyName}
                        </td>
                        <td style={{ padding: "0.75rem", color: "var(--color-text)", "font-size": "0.875rem" }}>
                          {formatParentNames(
                            family.parentFirstName,
                            family.parentLastName,
                            family.familyMembers
                          )}
                        </td>
                        <td style={{ padding: "0.75rem", color: "var(--color-text)", "font-size": "0.875rem" }}>
                          <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.25rem" }}>
                            <For each={family.children}>
                              {(child) => (
                                <a
                                  href={`/families/${family.id}/children/${child.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    color: "var(--color-primary)",
                                    "text-decoration": "none",
                                    "font-size": "0.8125rem",
                                  }}
                                >
                                  {child.firstName} {child.lastName}
                                  {child.allergies && (
                                    <span aria-label={allergyLabel(child.allergies)} title={allergyLabel(child.allergies)}>
                                      {" "}(allergy)
                                    </span>
                                  )}
                                </a>
                              )}
                            </For>
                            {(!family.children || family.children.length === 0) && (
                              <span style={{ color: "var(--color-text-subtle)", "font-size": "0.8125rem" }}>None</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem", "text-align": "right", "font-size": "0.875rem" }}>
                          <Show
                            when={(family as any).amountOwed !== undefined}
                            fallback={<span style={{ color: "var(--color-text-subtle)" }}>$0.00</span>}
                          >
                            <span
                              style={{
                                "font-weight": "700",
                                color:
                                  Number(moneyDisplay((family as any).amountOwed)) > 0
                                    ? "#c53030"
                                    : "#276749",
                              }}
                            >
                              {formatMoneyDisplay((family as any).amountOwed)}
                            </span>
                            {(family as any).unpaidSessionCount > 0 && (
                              <div style={{ color: "var(--color-text-muted)", "font-size": "0.75rem", "margin-top": "0.125rem" }}>
                                ({(family as any).unpaidSessionCount} unpaid)
                              </div>
                            )}
                          </Show>
                        </td>
                        <td style={{ padding: "0.75rem", color: "var(--color-text-muted)", "font-size": "0.875rem" }}>
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
                                "background-color": "var(--color-hover)",
                                color: "var(--color-text)",
                                border: "1px solid var(--color-border-strong)",
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
                                    "background-color": "var(--color-surface)",
                                    border: "1px solid var(--color-border)",
                                    "border-radius": "4px",
                                    "box-shadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    "z-index": 1000,
                                    "min-width": "120px",
                                  }}
                                >
                                <a
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
                                    color: "var(--color-text)",
                                    "text-decoration": "none",
                                    "font-size": "0.875rem",
                                    transition: "background-color 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--color-surface-muted)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  <span>👁️</span>
                                  <span>View</span>
                                </a>
                                <a
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
                                    color: "var(--color-text)",
                                    "text-decoration": "none",
                                    "font-size": "0.875rem",
                                    transition: "background-color 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--color-surface-muted)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  }}
                                >
                                  <span>✏️</span>
                                  <span>Edit</span>
                                </a>
                                <wa-button
                                  variant="danger"
                                  appearance="plain"
                                  onClick={(e: Event) => {
                                    e.stopPropagation();
                                    setOpenDropdown(null);
                                    handleDeleteFamily(family.id, family.familyName);
                                  }}
                                  style={{ width: "100%", "justify-content": "flex-start" }}
                                >
                                  🗑️ Delete
                                </wa-button>
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
          when={children()}
          fallback={
            <div style={{ "text-align": "center", padding: "2rem" }}>Loading children...</div>
          }
        >
          <Show
            when={filteredChildren()?.length}
            fallback={
              <EmptyState
                message={
                  (children()?.length ?? 0) === 0
                    ? "No children yet. Add children from a family."
                    : "No children match these filters."
                }
                actionLabel={(children()?.length ?? 0) > 0 && list.hasFilters() ? "Clear filters" : undefined}
                onAction={() => list.clearFilters()}
              />
            }
          >
            <div style={{ "background-color": "var(--color-surface)", "border-radius": "8px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
              <div style={{ overflow: "auto" }}>
                <table style={{ width: "100%", "border-collapse": "collapse" }}>
                  <thead>
                    <tr style={{ "background-color": "var(--color-surface-muted)", borderBottom: "2px solid var(--color-border)" }}>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Last</th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>First</th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Age/Birthday</th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Gender</th>
                      <th style={{ padding: "0.75rem", "text-align": "left", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Watched Since</th>
                      <th style={{ padding: "0.75rem", "text-align": "center", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={filteredChildren()}>
                      {(child, index) => (
                        <tr 
                          style={{ 
                            borderBottom: "1px solid var(--color-border)",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                            "background-color": index() % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-muted)",
                          }}
                          onClick={() => navigate(`/families/${child.familyId}/children/${child.id}`)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--color-hover)";
                          }}
                          onMouseLeave={(e) => {
                            const bgColor = index() % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-muted)";
                            e.currentTarget.style.backgroundColor = bgColor;
                          }}
                        >
                          <td style={{ padding: "0.75rem", "font-weight": "600", color: "var(--color-text)", "font-size": "0.875rem" }}>
                            {child.lastName}
                          </td>
                          <td style={{ padding: "0.75rem", color: "var(--color-text)", "font-size": "0.875rem" }}>
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
                          <td style={{ padding: "0.75rem", color: "var(--color-text)", "font-size": "0.875rem" }}>
                            {calculateAge(child.dateOfBirth)} ({formatDate(child.dateOfBirth)})
                          </td>
                          <td style={{ padding: "0.75rem", color: "var(--color-text)", "font-size": "0.875rem" }}>
                            {child.gender
                              ?.replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "-"}
                          </td>
                          <td style={{ padding: "0.75rem", color: "var(--color-text-muted)", "font-size": "0.875rem" }}>
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
                                  "background-color": "var(--color-hover)",
                                  color: "var(--color-text)",
                                  border: "1px solid var(--color-border-strong)",
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
                                      "background-color": "var(--color-surface)",
                                      border: "1px solid var(--color-border)",
                                      "border-radius": "4px",
                                      "box-shadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
                                      "z-index": 1000,
                                      "min-width": "120px",
                                    }}
                                  >
                                  <a
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
                                      color: "var(--color-text)",
                                      "text-decoration": "none",
                                      "font-size": "0.875rem",
                                      transition: "background-color 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "var(--color-surface-muted)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = "transparent";
                                    }}
                                  >
                                    <span>👁️</span>
                                    <span>View</span>
                                  </a>
                                  <a
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
                                      color: "var(--color-text)",
                                      "text-decoration": "none",
                                      "font-size": "0.875rem",
                                      transition: "background-color 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "var(--color-surface-muted)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = "transparent";
                                    }}
                                  >
                                    <span>✏️</span>
                                    <span>Edit</span>
                                  </a>
                                  <wa-button
                                    variant="danger"
                                    appearance="plain"
                                    onClick={(e: Event) => {
                                      e.stopPropagation();
                                      setOpenDropdown(null);
                                      handleDeleteChild(child.id, `${child.firstName} ${child.lastName}`);
                                    }}
                                    style={{ width: "100%", "justify-content": "flex-start" }}
                                  >
                                    🗑️ Delete
                                  </wa-button>
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
    </PageContent>
  );
}
