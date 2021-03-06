const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoSessionStore = require("connect-mongo");
const next = require("next");
const mongoose = require("mongoose");
const auth = require("./google");

const privateRouter = require("./Router/privateRouter.js");

require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const MONGO_URL = process.env.MONGO_URL;

try {
  mongoose.connect(
    `${MONGO_URL}${dev ? "test" : "prod"}`,
    {
      useNewUrlParser: true
    }
  );
  mongoose.connection.on("error", err => {
    console.log("[ERROR] mongoose.connection", err);
  });

  const port = process.env.PORT || 8000;
  const ROOT_URL = dev
    ? `http://localhost:${port}`
    : "https://decoupledcms.now.sh";

  const sessionSecret = process.env.SESSION_SECRET;

  const app = next({ dev });
  const handle = app.getRequestHandler();

  // Nextjs's server prepared
  app.prepare().then(() => {
    const server = express();

    // confuring MongoDB session store
    const MongoStore = mongoSessionStore(session);
    const sess = {
      name: "decoupledCMS",
      secret: sessionSecret,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60 // save session 14 days
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000
      }
    };

    server.use(session(sess));
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    auth({ server, ROOT_URL });

    server.use("/user", privateRouter);

    // next.js page routes/ redirects
    server.get("/projects/:projectId", (req, res) => {
      const params = { projectId: req.params.projectId };
      return app.render(req, res, "/projects", params);
    });

    server.get("/projects/:projectId/edit", (req, res) => {
      const params = { projectId: req.params.projectId };
      return app.render(req, res, "/projects/edit", params);
    });

    server.get("/projects/:projectId/models/:modelId", (req, res) => {
      const params = {
        projectId: req.params.projectId,
        modelId: req.params.modelId
      };
      return app.render(req, res, "/models", params);
    });

    server.get("/projects/:projectId/models/:modelId/edit", (req, res) => {
      const params = {
        projectId: req.params.projectId,
        modelId: req.params.modelId
      };
      return app.render(req, res, "/models/edit", params);
    });

    server.get(
      "/projects/:projectId/models/:modelId/documents/:documentId",
      (req, res) => {
        const params = {
          projectId: req.params.projectId,
          modelId: req.params.modelId,
          documentId: req.params.documentId
        };
        return app.render(req, res, "/documents", params);
      }
    );

    server.get(
      "/projects/:projectId/models/:modelId/documents/:documentId/edit",
      (req, res) => {
        const params = {
          projectId: req.params.projectId,
          modelId: req.params.modelId,
          documentId: req.params.documentId
        };
        return app.render(req, res, "/documents/edit", params);
      }
    );

    server.get("*", (req, res) => handle(req, res));

    // starting express server
    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
    });
  });
} catch (err) {
  console.log("[ERROR] app.js", err);
}
