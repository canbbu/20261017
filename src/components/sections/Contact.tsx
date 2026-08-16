import { wedding } from "@/content/wedding";
import { Accordion } from "@/components/interactive/Accordion";
import { ContactActions } from "@/components/interactive/ContactActions";
import { Reveal } from "@/components/interactive/Reveal";

export function Contact() {
  const { groom, bride } = wedding.couple;
  const parentContacts = [
    ...groom.parents.map((parent) => ({ ...parent, side: "신랑측" })),
    ...bride.parents.map((parent) => ({ ...parent, side: "신부측" })),
  ];

  return (
    <section className="section bg-canvas" aria-labelledby="contact-title">
      <Reveal className="page-shell mx-auto">
        <h2 id="contact-title" className="sr-only">
          연락하기
        </h2>
        <div className="contact-card grid grid-cols-2">
          <div className="min-w-0 pr-3">
            <ContactActions name={groom.name} phone={groom.phone} />
          </div>
          <div className="min-w-0 border-l border-line pl-3">
            <ContactActions name={bride.name} phone={bride.phone} />
          </div>
        </div>
        {parentContacts.length > 0 ? (
          <div className="mt-6">
            <Accordion title="혼주에게 연락하기">
              <div className="grid gap-6">
                {parentContacts.map((parent) => (
                  <ContactActions
                    key={`${parent.side}-${parent.relation}-${parent.name}`}
                    name={`${parent.side} ${parent.relation} ${parent.name}`}
                    phone={parent.phone}
                  />
                ))}
              </div>
            </Accordion>
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
