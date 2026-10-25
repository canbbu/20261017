"use client";

import { useActionState } from "react";
import { unlockEdit, type LotteryActionState } from "@/app/actions/lottery";
import { wedding } from "@/content/wedding";
import { emptyLotteryFields } from "@/lib/lottery";

const initialState: LotteryActionState = {
  status: "idle",
  message: "",
  fields: emptyLotteryFields(),
};

export function EditGate() {
  const [state, action, pending] = useActionState(unlockEdit, initialState);

  return (
    <form action={action} className="lottery-form">
      <label className="ui-label" htmlFor="lottery-password">
        {wedding.thanks.passwordLabel}
      </label>
      <input
        id="lottery-password"
        className="field field-single"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {state.message ? (
        <p className="lottery-error" role="alert">
          {state.message}
        </p>
      ) : null}
      <button className="solid-button control" type="submit" disabled={pending}>
        {wedding.thanks.passwordSubmit}
      </button>
    </form>
  );
}
