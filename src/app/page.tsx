
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="text-center py-20 md:py-40 relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold uppercase mb-6 leading-tight">
              <span className="glitch-text-loop" data-text="THE NEXT SOUND.">THE NEXT SOUND.</span>
          </h2>
          <p className="text-xl italic text-muted-foreground">
              The universe is dedicated to amplifying raw, innovative talent across the globe.
          </p>
          <Link href="/demo">
            <button className="mt-12 btn-style text-lg">
                DEMO TIME
            </button>
          </Link>
      </div>
    </>
  );
}
