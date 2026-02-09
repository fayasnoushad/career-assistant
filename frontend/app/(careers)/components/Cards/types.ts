export type JobType = {
  id: string;
  name: string;
  company?: string;
  location?: string;
  salary?: number;
  link: string;
  description: string;
  time: string;
};

export type CourseType = {
  id: string;
  title: string;
  channel: string;
  channel_link: string;
  duration: string | null;
  level: string | null;
  link: string;
};
