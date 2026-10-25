"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { updateLottery, type LotteryActionState } from "@/app/actions/lottery";
import { wedding } from "@/content/wedding";
import { emptyLotteryFields, type LotteryField, type LotteryFields } from "@/lib/lottery";

const fieldOrder = ["first", "second", "third", "fourth", "fifth", "sixth"] as const;

function idleState(fields: LotteryFields): LotteryActionState {
  return { status: "idle", message: "", fields };
}

export function LotteryEditor({ initial }: { initial: LotteryFields }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [state, action, pending] = useActionState(updateLottery, idleState(initial));

  useEffect(() => {
    if (state.status !== "cleared") {
      return;
    }

    setDraft(emptyLotteryFields());
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "saved" && state.status !== "cleared") {
      return;
    }

    router.refresh();
  }, [router, state.status]);

  return (
    <form action={action} className="lottery-form">
      {fieldOrder.map((field) => (
        <Field
          key={field}
          field={field}
          value={draft[field]}
          onChange={(value) => setDraft((current) => ({ ...current, [field]: value }))}
        />
      ))}
      {state.message ? (
        <p className={state.status === "error" ? "lottery-error" : "caption"} role="status">
          {state.message}
        </p>
      ) : null}
      <button className="solid-button control" type="submit" name="intent" value="save" disabled={pending}>
        {wedding.thanks.save}
      </button>
      <button className="quiet-button control" type="submit" name="intent" value="clear" disabled={pending}>
        {wedding.thanks.clear}
      </button>
    </form>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: LotteryField;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `lottery-${field}`;

  return (
    <div className="lottery-field">
      <label className="ui-label" htmlFor={id}>
        {wedding.thanks.grades[field]}
      </label>
      <p className="caption" id={`${id}-hint`}>
        {wedding.thanks.hints[field]}
      </p>
      <textarea
        id={id}
        className="field"
        name={field}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={`${id}-hint`}
        rows={field === "fourth" ? 3 : 2}
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
}
