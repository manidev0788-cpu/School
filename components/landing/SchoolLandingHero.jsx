import Image from "next/image";
import LandingNavbar from "@/components/landing/LandingNavbar";

const heroImg =
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=85";

const cards = [
  {
    title: "Web Design Start The Basic Process",
    img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=400&q=85",
    blob: "bg-[#2563eb]",
  },
  {
    title: "Logo & Branding Design Professional",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=85",
    blob: "bg-amber-400",
  },
  {
    title: "Prototype Design Wireframes",
    img: "https://images.unsplash.com/photo-1497634763915-560112943a73?auto=format&fit=crop&w=400&q=85",
    blob: "bg-emerald-600",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-hidden>
      {[1, 2, 3].map((i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function SchoolLandingHero() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-linear-to-b from-sky-100/90 via-cyan-50/40 to-white pb-28 pt-6 sm:pb-36 sm:pt-10">
      {/* subtle texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-visible rounded-4xl bg-white shadow-[0_25px_80px_-20px_rgb(15,23,42,0.18)] ring-1 ring-slate-200/60">
          <LandingNavbar />

          <div className="grid items-center gap-10 px-5 pb-14 pt-4 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:pb-20 lg:pt-6">
            {/* Left: blob + image */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <div
                className="absolute -left-4 top-8 h-[78%] w-[85%] rounded-[3rem] bg-emerald-800/90 shadow-inner sm:-left-6 sm:top-10 lg:h-[82%] lg:w-[88%]"
                style={{ transform: "rotate(-8deg)" }}
                aria-hidden
              />
              <div className="relative z-1 translate-x-2 translate-y-2 sm:translate-x-4 sm:translate-y-4 lg:translate-x-6 lg:translate-y-6">
                <div className="relative aspect-4/5 w-full overflow-visible rounded-4xl sm:aspect-5/6">
                  <Image
                    src={heroImg}
                    alt="Student with books ready to learn"
                    fill
                    className="object-cover object-top drop-shadow-2xl"
                    sizes="(max-width: 1024px) 90vw, 480px"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Right: copy */}
            <div className="text-center lg:text-left">
              <p className="text-sm font-semibold tracking-wide text-slate-500 sm:text-base">Lets</p>
              <h1 className="mt-2 font-extrabold tracking-tight">
                <span className="block bg-linear-to-r from-indigo-600 via-[#2563eb] to-blue-600 bg-clip-text text-4xl text-transparent sm:text-5xl lg:text-6xl">
                  School Education
                </span>
                <span className="mt-1 block text-4xl text-slate-900 sm:text-5xl lg:text-6xl">At Your Home</span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-500 lg:mx-0">
                Give your child structured lessons, caring mentors, and engaging materials — all from the comfort of home
                with programmes designed for real progress.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <a
                  href="#apply"
                  className="inline-flex min-w-[140px] items-center justify-center rounded-xl bg-[#2563eb] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/35"
                >
                  Apply Now
                </a>
                <a
                  href="#read"
                  className="inline-flex min-w-[140px] items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards overlap hero bottom + purple strip */}
        <div className="relative z-5 mx-auto max-w-5xl -translate-y-10 px-4 sm:-translate-y-14 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {cards.map((c, i) => (
              <article
                key={i}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_24px_60px_-18px_rgb(15,23,42,0.35)] ring-1 ring-slate-100/80 transition hover:-translate-y-1 hover:shadow-[0_32px_70px_-15px_rgb(15,23,42,0.45)]"
              >
                <div className={`relative mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full ${c.blob} shadow-lg`}>
                  <div className="relative h-25 w-25 overflow-hidden rounded-full ring-4 ring-white/40">
                    <Image src={c.img} alt={`Preview — ${c.title}`} fill className="object-cover" sizes="120px" />
                  </div>
                </div>
                <h3 className="text-center text-[15px] font-bold leading-snug text-slate-900 sm:text-base">{c.title}</h3>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <Stars />
                  <span className="text-xs font-semibold text-slate-500">(76 Reviews)</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          className="relative z-1 -mt-28 rounded-t-4xl bg-linear-to-br from-indigo-600 via-[#2563eb] to-indigo-950 px-4 pb-16 pt-36 shadow-inner sm:-mt-36 sm:pb-24 sm:pt-44"
          aria-hidden
        />
      </div>
    </div>
  );
}
