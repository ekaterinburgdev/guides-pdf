import PDFMerger from "pdf-merger-js";
import { launch } from "puppeteer";

export const createPdf = async (urls, filename) => {
  const browser = await launch();
  const [page] = await browser.pages();
  const merger = new PDFMerger();

  for (const url of urls) {
    await page.goto(url);
    merger.add(await page.pdf());
  }

  await merger.save(filename);
}