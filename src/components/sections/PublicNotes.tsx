import type { PublicNote } from "@/lib/rsvp";

export function PublicNotes({ notes }: { notes: readonly PublicNote[] }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <section className="public-notes" aria-labelledby="public-notes-title">
      <h3 id="public-notes-title" className="public-notes-title">
        축하글
      </h3>
      <ul className="public-notes-list">
        {notes.map((note) => (
          <li key={`${note.name}-${note.message}`} className="public-note">
            <p className="public-note-text">{note.message}</p>
            <p className="public-note-name">{note.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
