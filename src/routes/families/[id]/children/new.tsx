import { useSubmission, A, useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { createChild } from "~/lib/children";

export default function NewChild() {
  const params = useParams();
  const submission = useSubmission(createChild);

  return (
    <main
      style={{
        "max-width": "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
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
        <h1 style={{ color: "#2d3748", "font-size": "2rem" }}>Add Child</h1>
      </header>

      <form
        action={createChild}
        method="post"
        style={{
          "background-color": "#fff",
          padding: "2rem",
          "border-radius": "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <input type="hidden" name="familyId" value={params.id} />

        <fieldset
          style={{
            border: "1px solid #e2e8f0",
            "border-radius": "4px",
            padding: "1.5rem",
            "margin-bottom": "1.5rem",
          }}
        >
          <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
            Basic Information
          </legend>

          <div
            style={{
              display: "grid",
              "grid-template-columns": "1fr 1fr",
              gap: "1rem",
              "margin-bottom": "1rem",
            }}
          >
            <div>
              <label
                for="firstName"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "600",
                  color: "#2d3748",
                }}
              >
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="Emma"
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
                  color: "#2d3748",
                }}
              >
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Smith"
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

          <div>
            <label
              for="dateOfBirth"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "600",
                color: "#2d3748",
              }}
            >
              Date of Birth *
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
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
              for="gender"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "600",
                color: "#2d3748",
              }}
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            >
              <option value="">Select gender...</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>
        </fieldset>

        <fieldset
          style={{
            border: "1px solid #e2e8f0",
            "border-radius": "4px",
            padding: "1.5rem",
            "margin-bottom": "1.5rem",
          }}
        >
          <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
            School Information
          </legend>

          <div style={{ "margin-bottom": "1rem" }}>
            <label
              for="schoolName"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "500",
                color: "#4a5568",
              }}
            >
              School Name
            </label>
            <input
              id="schoolName"
              name="schoolName"
              type="text"
              placeholder="Lincoln Elementary School"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              "grid-template-columns": "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                for="schoolGrade"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "500",
                  color: "#4a5568",
                }}
              >
                Grade
              </label>
              <input
                id="schoolGrade"
                name="schoolGrade"
                type="text"
                placeholder="3rd Grade"
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
                for="schoolTeacher"
                style={{
                  display: "block",
                  "margin-bottom": "0.5rem",
                  "font-weight": "500",
                  color: "#4a5568",
                }}
              >
                Teacher Name
              </label>
              <input
                id="schoolTeacher"
                name="schoolTeacher"
                type="text"
                placeholder="Ms. Johnson"
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
        </fieldset>

        <fieldset
          style={{
            border: "1px solid #e2e8f0",
            "border-radius": "4px",
            padding: "1.5rem",
            "margin-bottom": "1.5rem",
          }}
        >
          <legend style={{ padding: "0 0.5rem", "font-weight": "600", color: "#2d3748" }}>
            Medical Information
          </legend>

          <div style={{ "margin-bottom": "1rem" }}>
            <label
              for="allergies"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "500",
                color: "#4a5568",
              }}
            >
              Allergies
            </label>
            <textarea
              id="allergies"
              name="allergies"
              rows={2}
              placeholder="Peanuts, tree nuts, dairy, etc."
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e0",
                "border-radius": "4px",
                "font-size": "1rem",
                "font-family": "inherit",
              }}
            />
            <p style={{ "margin-top": "0.5rem", "font-size": "0.75rem", color: "#718096" }}>
              List any known allergies
            </p>
          </div>

          <div style={{ "margin-bottom": "1rem" }}>
            <label
              for="medications"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "500",
                color: "#4a5568",
              }}
            >
              Medications
            </label>
            <textarea
              id="medications"
              name="medications"
              rows={2}
              placeholder="List any regular medications..."
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

          <div>
            <label
              for="specialNeeds"
              style={{
                display: "block",
                "margin-bottom": "0.5rem",
                "font-weight": "500",
                color: "#4a5568",
              }}
            >
              Special Needs
            </label>
            <textarea
              id="specialNeeds"
              name="specialNeeds"
              rows={2}
              placeholder="Any special needs or accommodations..."
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
        </fieldset>

        <div style={{ "margin-bottom": "1.5rem" }}>
          <label
            for="notes"
            style={{
              display: "block",
              "margin-bottom": "0.5rem",
              "font-weight": "600",
              color: "#2d3748",
            }}
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Any additional information about the child..."
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
              color: "#2d3748",
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
              "background-color": "#48bb78",
              color: "white",
              border: "none",
              "border-radius": "4px",
              cursor: submission.pending ? "not-allowed" : "pointer",
              opacity: submission.pending ? "0.6" : "1",
              "font-weight": "600",
            }}
          >
            {submission.pending ? "Adding..." : "Add Child"}
          </button>
        </div>
      </form>
    </main>
  );
}
