export interface User {
  user:
    | {
        email: string;
        role: string;
        name: string;
        id: string;
        image?: string;
      }
    | any;
}
