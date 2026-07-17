import { JSX } from "solid-js";

type PageContentProps = {
  children: JSX.Element;
  narrow?: boolean;
};

export default function PageContent(props: PageContentProps) {
  return (
    <main
      class="page-content wa-stack wa-gap-l"
      classList={{ "page-content--narrow": !!props.narrow }}
    >
      {props.children}
    </main>
  );
}

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: JSX.Element;
};

export function PageHeader(props: PageHeaderProps) {
  return (
    <header class="wa-flank wa-gap-m">
      <div class="wa-stack wa-gap-xs">
        <h1 class="wa-heading-xl">{props.title}</h1>
        {props.description && <p class="wa-body-m wa-color-text-quiet">{props.description}</p>}
      </div>
      {props.actions && <div class="wa-cluster wa-gap-s">{props.actions}</div>}
    </header>
  );
}
