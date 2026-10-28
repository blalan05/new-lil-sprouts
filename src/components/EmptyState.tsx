import { Show } from "solid-js";

type EmptyStateProps = {
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div class="wa-stack wa-gap-s" style={{ "text-align": "center", padding: "2rem" }}>
      <p class="wa-body-m wa-color-text-quiet" style={{ margin: 0 }}>
        {props.message}
      </p>
      <Show when={props.actionLabel && props.onAction}>
        <div>
          <wa-button appearance="outlined" onClick={props.onAction}>
            {props.actionLabel}
          </wa-button>
        </div>
      </Show>
      <Show when={props.actionLabel && props.actionHref && !props.onAction}>
        <div>
          <a href={props.actionHref}>
            <wa-button appearance="outlined">{props.actionLabel}</wa-button>
          </a>
        </div>
      </Show>
    </div>
  );
}
