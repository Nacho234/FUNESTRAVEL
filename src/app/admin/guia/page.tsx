import Link from "next/link";
import { ArrowSquareOutIcon, BookOpenIcon, PathIcon } from "@phosphor-icons/react/dist/ssr";
import { guideRecipes, guideSections } from "@/data/admin-guide";

export const metadata = { title: "Guía de uso" };

/** In-panel user manual: what each module is for and how to use it. */
export default function GuidePage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <p className="text-xs text-graphite-500">Resumen / Guía de uso</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-petrol-900">
          Guía de uso del panel
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-graphite-600">
          Qué es y cómo se usa cada sección, más los flujos de trabajo típicos. Pensada para que
          cualquier persona del equipo pueda operar sin ayuda técnica.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Index */}
        <nav aria-label="Índice de la guía" className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-2 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-graphite-500">Contenido</p>
          <ol className="space-y-1 text-sm">
            {guideSections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-lg px-2.5 py-1.5 font-medium text-graphite-600 hover:bg-white hover:text-petrol-900">
                  {s.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#flujos" className="block rounded-lg px-2.5 py-1.5 font-semibold text-teal-600 hover:bg-white">
                Flujos típicos
              </a>
            </li>
          </ol>
        </nav>

        {/* Content */}
        <div className="min-w-0 space-y-10">
          {guideSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <div className="flex items-center gap-2.5">
                <BookOpenIcon className="size-5 text-teal-600" aria-hidden />
                <h2 className="font-display text-xl font-bold text-petrol-900">{section.title}</h2>
              </div>
              {section.intro && <p className="mt-1.5 max-w-2xl text-sm text-graphite-600">{section.intro}</p>}

              <div className="mt-4 space-y-4">
                {section.modules.map((m) => (
                  <article key={m.id} className="rounded-xl border border-graphite-200/70 bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-base font-bold text-petrol-900">{m.name}</h3>
                      {m.href && (
                        <Link
                          href={m.href}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-500"
                        >
                          Abrir módulo
                          <ArrowSquareOutIcon className="size-3.5" aria-hidden />
                        </Link>
                      )}
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-graphite-700">{m.what}</p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-graphite-500">Cómo se usa</p>
                    <ol className="mt-1.5 max-w-3xl space-y-1.5">
                      {m.how.map((step, i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-graphite-600">
                          <span className="font-display text-xs font-bold text-teal-600 tabular pt-0.5">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    {m.tips?.map((tip) => (
                      <p key={tip} className="mt-3 max-w-3xl rounded-lg bg-sand-50 px-3.5 py-2.5 text-sm leading-relaxed text-graphite-700">
                        <span className="font-bold text-petrol-900">Tip:</span> {tip}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </section>
          ))}

          {/* Recipes */}
          <section id="flujos" className="scroll-mt-20">
            <div className="flex items-center gap-2.5">
              <PathIcon className="size-5 text-coral-600" aria-hidden />
              <h2 className="font-display text-xl font-bold text-petrol-900">Flujos típicos</h2>
            </div>
            <p className="mt-1.5 max-w-2xl text-sm text-graphite-600">
              Recetas paso a paso de las tareas más comunes, cruzando módulos.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {guideRecipes.map((r) => (
                <article key={r.id} className="rounded-xl border border-graphite-200/70 bg-white p-5">
                  <h3 className="font-display text-base font-bold text-petrol-900">{r.title}</h3>
                  <ol className="mt-2.5 space-y-1.5">
                    {r.steps.map((step, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-graphite-600">
                        <span className="font-display text-xs font-bold text-coral-600 tabular pt-0.5">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </section>

          <p className="border-t border-graphite-200/70 pt-4 text-xs text-graphite-500">
            Este manual también está en el repositorio como <code className="rounded bg-graphite-100 px-1">docs/MANUAL-ADMIN.md</code> para
            compartir fuera del panel. Ante dudas que la guía no cubra, escribí al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
