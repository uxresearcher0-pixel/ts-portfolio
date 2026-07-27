export type ContactRequest = {
  _id?: string;
  name: string;
  email: string;
  project: string;
  message: string;
  createdAt: string;
  status: "new" | "read";
};
