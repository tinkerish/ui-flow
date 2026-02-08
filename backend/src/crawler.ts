import { chromium, Browser } from "playwright";
import { Route } from "./types";

type CrawlOptions = {
  startUrl: string;
  maxDepth?: number;
  maxPages?: number;
};

export async function crawl({
  startUrl,
  maxDepth = 2,
  maxPages = 50,
}: CrawlOptions): Promise<Route[]> {
  const browser = await chromium.launch({ headless: true });

  const visited = new Set<string>();
  const routes: Route[] = [];

  const start = new URL(startUrl);
  const origin = start.origin;

  const queue: { url: string; depth: number }[] = [
    { url: start.toString(), depth: 0 },
  ];

  try {
    while (queue.length && routes.length < maxPages) {
      const { url, depth } = queue.shift()!;

      const pathname = new URL(url).pathname;
      if (visited.has(pathname)) continue;
      if (depth > maxDepth) continue;

      visited.add(pathname);

      const page = await browser.newPage();

      try {
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        await page.waitForTimeout(500);

        const links: string[] = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("a"))
            .map((a) => a.getAttribute("href"))
            .filter(Boolean) as string[];
        });

        const resolvedLinks: string[] = [];

        for (const href of links) {
          try {
            if (
              href.startsWith("#") ||
              href.startsWith("mailto:") ||
              href.startsWith("javascript:")
            ) {
              continue;
            }

            const absolute = new URL(href, url).toString();

            const parsed = new URL(absolute);

            // only same-origin links
            if (parsed.origin !== origin) continue;

            resolvedLinks.push(parsed.pathname);

            if (!visited.has(parsed.pathname)) {
              queue.push({
                url: absolute,
                depth: depth + 1,
              });
            }
          } catch {

          }
        }

        routes.push({
          path: pathname,
          links: Array.from(new Set(resolvedLinks)),
          fullPath: "",
        });
      } catch (err) {
        console.log("Failed:", url);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  return routes;
}
