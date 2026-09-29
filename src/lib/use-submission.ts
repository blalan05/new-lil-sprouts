import { useSubmissions, type Action } from "@solidjs/router";
import { createMemo } from "solid-js";

/** Router 2 compatibility shim for the removed useSubmission hook. */
export function useSubmission<T extends Array<any>, U, V>(fn: Action<T, U, V>) {
  const submissions = useSubmissions(fn);
  const state = createMemo(() => {
    const latest = submissions.at(-1);
    const pending = !!latest && latest.result === undefined && latest.error === undefined;
    return {
      pending,
      error: latest?.error,
      result: latest?.result,
    };
  });

  return {
    get pending() {
      return state().pending;
    },
    get error() {
      return state().error;
    },
    get result() {
      return state().result;
    },
  };
}
