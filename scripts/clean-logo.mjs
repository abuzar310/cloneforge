import { readFileSync, writeFileSync } from "node:fs";
let s = readFileSync("public/images/wembi/logo.svg", "utf8");
s = s.replace(/transform="[^"]*"/g, "");
s = s.replace(/style="[^"]*"/g, "");
s = s.replace(/data-svg-origin="[^"]*"/g, "");
s = s.replace(/data-v-[a-z0-9]+=""/g, "");
writeFileSync("public/images/wembi/logo.svg", s);
console.log("cleaned", s.length);
