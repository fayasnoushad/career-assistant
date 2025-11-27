import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center text-center h-full mx-5">
      <span className="text-3xl">Welcome to the Career Assistant App!</span>
      <p className="text-lg mt-5">
        Explore jobs and courses to advance your career.
      </p>
      <div className="flex flex-row justify-center mt-5 gap-5 font-bold">
        <Link
          className="btn btn-outline rounded font-bold text-lg"
          href="/careers/"
        >
          Find Jobs or Courses &#8594;
        </Link>
      </div>
    </main>
  );
}
