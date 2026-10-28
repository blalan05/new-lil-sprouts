import type { JSX } from "@solidjs/web";
import { For, Show } from "solid-js";
import type { ChipOption } from "~/lib/list-query";
import type { ListQuery } from "~/lib/use-list-query";

export type ChipGroup = {
  param: string;
  label: string;
  options: ChipOption[];
};

export default function ListToolbar(props: {
  query: ListQuery;
  searchPlaceholder?: string;
  families?: { id: string; familyName: string }[];
  services?: { id: string; name: string }[];
  chipGroups?: ChipGroup[];
  sortOptions?: ChipOption[];
  sortValue?: string;
  dateRange?: boolean;
  total: number;
  visible: number;
  children?: JSX.Element;
}) {
  const selectValue = (event: Event) =>
    (event.currentTarget as HTMLSelectElement & { value: string }).value;

  const inputValue = (event: Event) =>
    (event.currentTarget as HTMLInputElement & { value: string }).value;

  return (
    <wa-card>
      <div class="wa-stack wa-gap-m">
        <div class="wa-grid wa-gap-m" style={{ "--min-column-size": "14rem" }}>
          <wa-input
            label="Search"
            type="search"
            placeholder={props.searchPlaceholder ?? "Search"}
            value={props.query.q()}
            onInput={(event) => props.query.setQ(inputValue(event))}
          />
          <Show when={props.families}>
            <wa-select
              label="Family"
              value={props.query.family()}
              onChange={(event) => props.query.setFamily(selectValue(event))}
            >
              <wa-option value="">All families</wa-option>
              <For each={props.families}>
                {(family) => <wa-option value={family.id}>{family.familyName}</wa-option>}
              </For>
            </wa-select>
          </Show>
          <Show when={props.services}>
            <wa-select
              label="Service"
              value={props.query.service()}
              onChange={(event) => props.query.setService(selectValue(event))}
            >
              <wa-option value="">All services</wa-option>
              <For each={props.services}>
                {(service) => <wa-option value={service.id}>{service.name}</wa-option>}
              </For>
            </wa-select>
          </Show>
          <Show when={props.dateRange}>
            <wa-input
              label="From"
              type="date"
              value={props.query.from()}
              onInput={(event) => props.query.setFrom(inputValue(event))}
            />
            <wa-input
              label="To"
              type="date"
              value={props.query.to()}
              onInput={(event) => props.query.setTo(inputValue(event))}
            />
          </Show>
          <Show when={props.sortOptions?.length}>
            <wa-select
              label="Sort"
              value={props.sortValue ?? props.query.sort()}
              onChange={(event) => props.query.setSortField(selectValue(event))}
            >
              <For each={props.sortOptions}>
                {(option) => <wa-option value={option.value}>{option.label}</wa-option>}
              </For>
            </wa-select>
          </Show>
          <Show when={props.sortOptions?.length}>
            <div class="wa-stack wa-gap-xs" style={{ "justify-content": "flex-end" }}>
              <span class="wa-body-s wa-color-text-quiet">Direction</span>
              <wa-button appearance="outlined" size="small" onClick={() => props.query.toggleDir()}>
                {props.query.dir() === "asc" ? "Ascending" : "Descending"}
              </wa-button>
            </div>
          </Show>
          {props.children}
        </div>

        <For each={props.chipGroups ?? []}>
          {(group) => (
            <div class="wa-cluster wa-gap-xs wa-align-items-center">
              <span class="wa-body-s wa-color-text-quiet">{group.label}</span>
              <For each={group.options}>
                {(option) => (
                  <wa-button
                    size="small"
                    appearance={props.query.param(group.param) === option.value ? "filled" : "outlined"}
                    variant={props.query.param(group.param) === option.value ? "brand" : "neutral"}
                    onClick={() => props.query.toggle(group.param, option.value)}
                  >
                    {option.label}
                  </wa-button>
                )}
              </For>
            </div>
          )}
        </For>

        <div class="wa-cluster wa-gap-s wa-align-items-center">
          <p class="wa-body-s wa-color-text-quiet" style={{ margin: 0 }}>
            Showing {props.visible} of {props.total}
          </p>
          <Show when={props.query.hasFilters()}>
            <wa-button appearance="plain" size="small" onClick={() => props.query.clearFilters()}>
              Clear filters
            </wa-button>
          </Show>
        </div>
      </div>
    </wa-card>
  );
}
