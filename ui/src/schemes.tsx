export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Lesson {
  id: string;
  title: string;
  level: string;
  topic: string;
  pairs: Array<any>;
}
