import { ensureOwner } from "~/lib/route-guards";
import { useSubmission, A, useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { createFamilyMember } from "~/lib/family-members";

export const route = {
  preload() {
    ensureOwner();
  },
} satisfies import("@solidjs/router").RouteDefinition;

export default function NewFamilyMember() {
  const params = useParams();
  const submission = useSubmission(createFamilyMember);

  return (
    <main class="page-form">
      <header style={{ "margin-bottom": "2rem" }}>
        <A
          href={`/families/${params.id}`}
          style={{
            color: "#4299e1",
            "text-decoration": "none",
            "margin-bottom": "0.5rem",
            display: "inline-block",
          }}
        >
          ← Back to Family
        </A>
        <h1 style={{ color: "var(--color-text)", "font-size": "2rem" }}>Add Family Member</h1>
      </header>

      <form
        action={createFamilyMember}
        method="post"
        style={{
          "background-color": "var(--color-surface)",
          padding: "2rem",
          "border-radius": "8px",
          border: "1px solid var(--color-border)",
        }}
      >
        <input type="hidden" name="familyId" value={params.id} />

        <div
          style={{
            display: "grid",
            "grid-template-columns": "1fr 1fr",
            gap: "1rem",
            "margin-bottom": "1.5rem",
          }}
        >
          <div>
            <label
              for="firstName"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "600",
                color: "var(--color-text)",
              }}
            >
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder="Jane"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            />
          </div>
          <div>
            <label
              for="lastName"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "600",
                color: "var(--color-text)",
              }}
            >
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="Doe"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            />
          </div>
        </div>

        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            for="relationship"
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              "font-weight": "600",
              color: "var(--color-text)",
            }}
          >
            Relationship *
          </label>
          <select
            id="relationship"
            name="relationship"
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "1rem",
            }}
          >
            <option value="">Select relationship...</option>
            <option value="PARENT">Parent</option>
            <option value="GRANDPARENT">Grandparent</option>
            <option value="AUNT_UNCLE">Aunt/Uncle</option>
            <option value="SIBLING">Sibling</option>
            <option value="BABYSITTER">Babysitter</option>
            <option value="NANNY">Nanny</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            "grid-template-columns": "1fr 1fr",
            gap: "1rem",
            "margin-bottom": "1.5rem",
          }}
        >
          <div>
            <label
              for="email"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "600",
                color: "var(--color-text)",
              }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jane.doe@example.com"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            />
            <p style={{ "margin-top": "0.5rem", "font-size": "0.75rem", color: "var(--color-text-muted)" }}>
              Required if you want to invite them to the app
            </p>
          </div>
          <div>
            <label
              for="phone"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "600",
                color: "var(--color-text)",
              }}
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            />
          </div>
        </div>

        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            for="allergies"
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              "font-weight": "600",
              color: "var(--color-text)",
            }}
          >
            Allergies
          </label>
          <textarea
            id="allergies"
            name="allergies"
            rows={2}
            placeholder="Any known allergies..."
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "1rem",
              "font-family": "inherit",
            }}
          />
          <p style={{ "margin-top": "0.5rem", "font-size": "0.75rem", color: "var(--color-text-muted)" }}>
            Important for caregivers to know about any allergies
          </p>
        </div>

        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            style={{
              display: "flex",
              "align-items": "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="canPickup"
              value="true"
              style={{
                width: "1.25rem",
                height: "1.25rem",
                cursor: "pointer",
              }}
            />
            <span style={{ "font-weight": "600", color: "var(--color-text)" }}>
              Authorized to pick up children
            </span>
          </label>
          <p style={{ "margin-top": "0.5rem", "font-size": "0.875rem", color: "var(--color-text-muted)" }}>
            Check this box if this person is allowed to pick up children from care sessions
          </p>
        </div>

        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            for="notes"
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              "font-weight": "600",
              color: "var(--color-text)",
            }}
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Any additional information about this family member..."
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "font-size": "1rem",
              "font-family": "inherit",
            }}
          />
        </div>

        <Show when={submission.result}>
          <div
            style={{
              padding: "1rem",
              "background-color": "#fff5f5",
              border: "1px solid #feb2b2",
              "border-radius": "4px",
              color: "#c53030",
              "margin-bottom": "1rem",
            }}
          >
            {submission.result!.message}
          </div>
        </Show>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            "justify-content": "flex-end",
          }}
        >
          <A
            href={`/families/${params.id}`}
            style={{
              padding: "0.75rem 1.5rem",
              "background-color": "#edf2f7",
              color: "var(--color-text)",
              border: "1px solid #cbd5e0",
              "border-radius": "4px",
              "text-decoration": "none",
              "font-weight": "600",
            }}
          >
            Cancel
          </A>
          <button
            type="submit"
            disabled={submission.pending}
            style={{
              padding: "0.75rem 1.5rem",
              "background-color": "#4299e1",
              color: "white",
              border: "none",
              "border-radius": "4px",
              cursor: submission.pending ? "not-allowed" : "pointer",
              opacity: submission.pending ? "0.6" : "1",
              "font-weight": "600",
            }}
          >
            {submission.pending ? "Adding..." : "Add Family Member"}
          </button>
        </div>
      </form>
    </main>
  );
}
