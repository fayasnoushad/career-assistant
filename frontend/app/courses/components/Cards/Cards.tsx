import Link from "next/link";

export type CourseType = {
  title: string;
  channel: string;
  channel_link: string;
  duration: string | null;
  level: string | null;
  link: string;
};

function CourseCard({ course }: { course: CourseType }) {
  return (
    <div className="card-body">
      <h2 className="card-title mb-2">{course.title}</h2>
      <span>
        <b>Channel:</b>{" "}
        <Link href={course.channel_link} target="_blank">
          {course.channel}
        </Link>
      </span>
      <span>
        <b>Duration:</b> {course.duration ? course.duration : "Not specified"}
      </span>
      <span>
        <b>Level:</b> {course.level ? course.level : "Not specified"}
      </span>
      <div className="flex justify-center md:justify-end card-actions pt-4">
        <Link
          href={course.link}
          target="_blank"
          className="btn btn-soft rounded-lg"
        >
          Open in Course Website
        </Link>
      </div>
    </div>
  );
}

export default function Cards({ content }: { content: CourseType[] }) {
  return (
    <div className="m-5 md:mx-20 lg:mx-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center items-center">
      {content.map((course, index) => (
        <div className="card card-md bg-base-200 shadow-sm w-full" key={index}>
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  );
}
