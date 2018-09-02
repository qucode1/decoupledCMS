export const serverURL =
  process.env.NODE_ENV === "production"
    ? "https://decoupledcms.now.sh/user"
    : "http://localhost:8000/user"
