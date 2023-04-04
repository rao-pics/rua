import express from "express";
import next from "next";

const port = parseInt(process.env.PORT || "9601", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const redirect = (req, res) => {
    res.redirect(307, process.env.API_HOST + req.url);
  };

  server.all("/api/*", redirect);
  server.get("/r", redirect);
  server.get("/random", redirect);
  server.all("/static/*", redirect);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`server on: http://localhost:${port}`);
  });
});
