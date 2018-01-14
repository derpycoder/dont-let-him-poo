import { renderModuleFactory } from "@angular/platform-server";
import { enableProdMode } from "@angular/core";
import { ngExpressEngine } from "@nguniversal/express-engine";
import { provideModuleMap } from "@nguniversal/module-map-ngfactory-loader";
import "zone.js/dist/zone-node";
import "reflect-metadata";

import * as express from "express";
import { join } from "path";
import { readFileSync } from "fs";
var compression = require("compression");

enableProdMode();

const app = express();
const PORT = process.env.PORT || 8080;
const DIST_FOLDER = join(process.cwd(), "dist");
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require("./dist/server/main.bundle");

app.use(compression());
app.engine(
  "html",
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);

app.set("view engine", "html");
app.set("views", join(DIST_FOLDER, "browser"));

app.use(
  express.static(join(DIST_FOLDER, "browser"), {
    index: false,
    maxAge: "1y"
  })
);

app.get("*", (req, res) => {
  res.render(join(DIST_FOLDER, "browser", "index.html"), { req });
});

app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
