"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitRsvp } from "@/app/actions/submit-rsvp";
import { PublicNotes } from "@/components/sections/PublicNotes";
import { useToast } from "@/components/interactive/ToastRegion";
import {
  initialRsvpState,
  mergeOwnNote,
  readRsvpActionState,
  type PublicNote,
} from "@/lib/rsvp";

export function RsvpForm({ notes }: { notes: readonly PublicNote[] }) {
  const { announce } = useToast();
  const thanked = useRef(false);
  const [rawState, formAction, pending] = useActionState(submitRsvp, initialRsvpState);
  const state = readRsvpActionState(rawState);
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const shownNotes = mergeOwnNote(
    notes,
    state.status === "success" ? state.publishedNote : null,
  );

  useEffect(() => {
    if (state.status !== "success" || thanked.current) {
      return;
    }
    thanked.current = true;
    announce("감사합니다.");
  }, [state.status, announce]);

  return (
    <>
      {state.status === "success" ? (
        <p className="mx-auto max-w-[30rem] text-center text-ink-muted" role="status" aria-live="polite">
          {state.message}
        </p>
      ) : (
        <form action={formAction} className="rsvp-form" noValidate>
          <div className="field">
            <label htmlFor="rsvp-name" className="ui-label">
              이름
            </label>
            <input
              id="rsvp-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={40}
              required
              aria-invalid={Boolean(state.fieldErrors.name)}
              aria-describedby={state.fieldErrors.name ? "rsvp-name-error" : undefined}
              className="field-input"
            />
            {state.fieldErrors.name ? (
              <p id="rsvp-name-error" className="field-error">
                {state.fieldErrors.name}
              </p>
            ) : null}
          </div>

          <fieldset className="field">
            <legend className="ui-label">참석 여부</legend>
            <div className="choice-row">
              <label className="choice">
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  required
                  checked={attending === "yes"}
                  onChange={() => setAttending("yes")}
                />
                참석
              </label>
              <label className="choice">
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  required
                  checked={attending === "no"}
                  onChange={() => setAttending("no")}
                />
                불참
              </label>
            </div>
            {state.fieldErrors.attending ? (
              <p className="field-error">{state.fieldErrors.attending}</p>
            ) : null}
          </fieldset>

          {attending === "yes" ? (
            <>
              <div className="field">
                <label htmlFor="rsvp-guest-count" className="ui-label">
                  인원
                </label>
                <input
                  id="rsvp-guest-count"
                  name="guestCount"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={20}
                  defaultValue={1}
                  required
                  aria-invalid={Boolean(state.fieldErrors.guestCount)}
                  aria-describedby={state.fieldErrors.guestCount ? "rsvp-guest-error" : undefined}
                  className="field-input"
                />
                {state.fieldErrors.guestCount ? (
                  <p id="rsvp-guest-error" className="field-error">
                    {state.fieldErrors.guestCount}
                  </p>
                ) : null}
              </div>

              <fieldset className="field">
                <legend className="ui-label">식사 여부</legend>
                <div className="choice-row">
                  <label className="choice">
                    <input type="radio" name="meal" value="yes" required />
                    식사함
                  </label>
                  <label className="choice">
                    <input type="radio" name="meal" value="no" required />
                    식사 안 함
                  </label>
                </div>
                {state.fieldErrors.meal ? (
                  <p className="field-error">{state.fieldErrors.meal}</p>
                ) : null}
              </fieldset>
            </>
          ) : null}

          <div className="field">
            <label htmlFor="rsvp-message" className="ui-label">
              축하글
            </label>
            <textarea
              id="rsvp-message"
              name="message"
              rows={4}
              maxLength={300}
              aria-invalid={Boolean(state.fieldErrors.message)}
              aria-describedby={state.fieldErrors.message ? "rsvp-message-error" : undefined}
              className="field-input field-textarea"
            />
            {state.fieldErrors.message ? (
              <p id="rsvp-message-error" className="field-error">
                {state.fieldErrors.message}
              </p>
            ) : null}
          </div>

          <div className="field">
            <label className="consent">
              <input type="checkbox" name="publish" value="true" />
              <span>이 글을 청첩장에 공개합니다.</span>
            </label>
          </div>

          <div className="field">
            <label className="consent">
              <input type="checkbox" name="consent" value="true" required />
              <span>이름과 참석 인원 정보를 예식 준비에 사용하는 데 동의합니다.</span>
            </label>
            {state.fieldErrors.consent ? (
              <p className="field-error">{state.fieldErrors.consent}</p>
            ) : null}
          </div>

          {state.status === "error" && state.message ? (
            <p className="field-error" role="alert" aria-live="polite">
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            className="control inline-flex w-full items-center justify-center bg-accent px-5 text-[0.9375rem] text-canvas disabled:opacity-60"
            disabled={pending}
          >
            {pending ? "전달하는 중" : "전달하기"}
          </button>
        </form>
      )}
      <PublicNotes notes={shownNotes} />
    </>
  );
}
