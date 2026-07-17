import { Show } from "solid-js";
import { A } from "@solidjs/router";

type EmptyStateProps = {
  icon?: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div class="empty-state">
      <Show when={props.icon}>
        <div class="empty-state-icon" aria-hidden="true">
          {props.icon}
        </div>
      </Show>
      <p class="empty-state-message">{props.message}</p>
      <Show when={props.actionLabel && (props.actionHref || props.onAction)}>
        {props.actionHref ? (
          <A href={props.actionHref} class="btn btn-success">
            {props.actionLabel}
          </A>
        ) : (
          <button type="button" class="btn btn-success" onClick={props.onAction}>
            {props.actionLabel}
          </button>
        )}
      </Show>
    </div>
  );
}
