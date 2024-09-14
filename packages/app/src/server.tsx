import { serve } from "bun";
import { join } from "path";

const port = 3000;

serve({
  port: port,
  fetch(req) {
    const url = new URL(req.url);
    let filePath;

    if (url.pathname === '/') {
      filePath = join(import.meta.dir, "../index.html");
    } else if (url.pathname === '/index.css') {
      filePath = join(import.meta.dir, "../dist/index.css");
    } else {
      filePath = join(import.meta.dir, "../dist", url.pathname);
    }

    const file = Bun.file(filePath);
    return new Response(file);
  },
});

console.log(`Server running at http://localhost:${port}`);