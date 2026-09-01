import { Chapter, Note, P } from "../ui";
import { SkillOrbit } from "../visuals";
import { chapters, contact, direction, meta, skills, systems } from "../content";

const ch = (id: string) => chapters.find((c) => c.id === id)!;

/* ------------------------------------------------------------------ ch. 12 */

export function Systems() {
  const c = ch("systems");
  return (
    <Chapter id={c.id} number={c.number} title={c.title}>
      {systems.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
        {systems.flow.map((node, i) => (
          <li key={node} className="flex items-center gap-3">
            <span className="border border-rule bg-paper px-3 py-2 font-mono text-[12px]">
              {node}
            </span>
            {i < systems.flow.length - 1 && (
              <span aria-hidden="true" className="block h-px w-4 bg-rule" />
            )}
          </li>
        ))}
      </ol>
      <p className="tag mt-3">{systems.flowNote}</p>

      <div className="mt-12 max-w-[720px] border border-rule bg-paper">
        <div className="border-b border-rule p-6">
          <h3 className="text-[21px] leading-tight">{systems.onboarding.title}</h3>
          <p className="tag mt-3 text-signal">Trigger</p>
          <p className="mt-1 font-mono text-[14px]">{systems.onboarding.trigger}</p>
        </div>
        <ul className="grid gap-px bg-rule sm:grid-cols-2">
          {systems.onboarding.steps.map((s) => (
            <li key={s} className="bg-paper p-5 font-mono text-[13px]">
              {s}
            </li>
          ))}
        </ul>
        <p className="tag border-t border-rule p-5">{systems.onboarding.note}</p>
      </div>

      <Note>{systems.lesson}</Note>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 13 */

export function Direction() {
  const c = ch("direction");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} band>
      {direction.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
        {direction.loop.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span className="border border-signal/40 bg-paper px-3 py-2 font-mono text-[12px] text-signal">
              {step}
            </span>
            <span aria-hidden="true" className="block h-px w-4 bg-rule" />
            {i === direction.loop.length - 1 && (
              <span className="tag">back to the start</span>
            )}
          </li>
        ))}
      </ol>

      <SkillOrbit />

      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        {skills.map((s) => (
          <div key={s.group}>
            <h3 className="font-mono text-[12px] uppercase tracking-wider text-graphite">
              {s.group}
            </h3>
            <ul className="mt-4 space-y-1 text-[17px]">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 14 */

export function Closing() {
  const c = ch("closing");
  const links = [
    contact.email ? { label: "Email", href: `mailto:${contact.email}` } : null,
    contact.linkedin ? { label: "LinkedIn", href: contact.linkedin } : null,
    contact.github ? { label: "GitHub", href: contact.github } : null,
    contact.resumeUrl ? { label: "Resume", href: contact.resumeUrl } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <Chapter id={c.id} number={c.number} title={c.title}>
      <P>{contact.closing}</P>

      <div className="mt-10 flex flex-wrap gap-3">
        {links.map((l) => (
          <a
            key={l.label}
            className="btn"
            href={l.href}
            target={l.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
          >
            {l.label}
          </a>
        ))}
      </div>


    </Chapter>
  );
}
