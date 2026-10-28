import { useSearchParams } from "@solidjs/router";
import type { SortDir } from "~/lib/list-query";

type ParamValue = string | string[] | undefined;

const FILTER_NAMES = [
  "q",
  "status",
  "family",
  "service",
  "category",
  "from",
  "to",
  "queue",
  "severity",
] as const;

export type ListQuery = ReturnType<typeof useListQuery>;

function first(value: ParamValue): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function useListQuery(options?: { prefix?: string; sort?: string; dir?: SortDir; view?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefix = options?.prefix ?? "";
  const defaultSort = options?.sort ?? "";
  const defaultDir: SortDir = options?.dir ?? "asc";
  const defaultView = options?.view ?? "";

  const key = (name: string) => (prefix ? `${prefix}_${name}` : name);

  const read = (name: string) => first((searchParams as Record<string, ParamValue>)[name]);

  const write = (patch: Record<string, string | undefined>) => {
    setSearchParams(patch as Record<string, string>, { replace: true, scroll: false });
  };

  const patch = (values: Record<string, string | undefined>) => {
    const out: Record<string, string | undefined> = {};
    for (const [name, value] of Object.entries(values)) {
      const storageKey = name === "familyId" ? "familyId" : key(name);
      out[storageKey] = value || undefined;
    }
    write(out);
  };

  const sort = () => read(key("sort")) || defaultSort;
  const dir = (): SortDir => {
    const raw = read(key("dir"));
    return raw === "asc" || raw === "desc" ? raw : defaultDir;
  };

  return {
    q: () => read(key("q")),
    setQ: (value: string) => patch({ q: value }),
    status: () => read(key("status")),
    family: () => read(key("family")) || (prefix ? "" : read("familyId")),
    setFamily: (value: string) => patch({ family: value, familyId: undefined }),
    service: () => read(key("service")),
    setService: (value: string) => patch({ service: value }),
    category: () => read(key("category")),
    from: () => read(key("from")),
    setFrom: (value: string) => patch({ from: value }),
    to: () => read(key("to")),
    setTo: (value: string) => patch({ to: value }),
    view: () => read(key("view")) || defaultView,
    setView: (value: string) => patch({ view: value === defaultView ? undefined : value }),
    sort,
    dir,
    setSortField: (field: string) => patch({ sort: field === defaultSort ? undefined : field }),
    toggleDir: () => {
      const next: SortDir = dir() === "asc" ? "desc" : "asc";
      patch({ dir: next === defaultDir ? undefined : next });
    },
    toggleSort: (field: string) => {
      if (sort() === field) {
        const next: SortDir = dir() === "asc" ? "desc" : "asc";
        patch({
          sort: field === defaultSort ? undefined : field,
          dir: next === defaultDir ? undefined : next,
        });
        return;
      }
      patch({
        sort: field === defaultSort ? undefined : field,
        dir: defaultDir === "asc" ? undefined : "asc",
      });
    },
    queue: () => read(key("queue")),
    year: () => read(key("year")),
    setYear: (value: string) => patch({ year: value }),
    date: () => read(key("date")),
    setDate: (value: string) => patch({ date: value }),
    param: (name: string) => read(key(name)),
    toggle: (name: string, value: string) => {
      patch({ [name]: read(key(name)) === value ? undefined : value });
    },
    setParam: (name: string, value: string) => patch({ [name]: value }),
    hasFilters: () => {
      if (FILTER_NAMES.some((name) => !!read(key(name)))) return true;
      return !prefix && !!read("familyId");
    },
    clearFilters: () => {
      const out: Record<string, string | undefined> = {};
      for (const name of FILTER_NAMES) out[key(name)] = undefined;
      if (!prefix) out.familyId = undefined;
      write(out);
    },
    patch,
  };
}
