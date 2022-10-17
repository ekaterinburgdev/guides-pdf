import puppeteer from "puppeteer";
import * as fs from "fs";

export const createPdf = async (urls, filename) => {
    fs.writeFile(`${filename}.pdf`, '', function (err) {
        if (err) throw err;
        console.log(`File ${filename}.pdf is created successfully.`);
    });
    const browser = await puppeteer.launch({
        headless: false
    });
    const [page] = await browser.pages();
    await page.setDefaultNavigationTimeout(0);

    const pdfGenerate = async () => {
        return await page.evaluate(async () => {
                async function addJS(pathName) {
                    return new Promise((res, _) => {
                        const script = document.createElement('script');
                        script.src = pathName;
                        document.body.appendChild(script)
                        script.onload = () => {
                            res()
                        }
                    })
                }

                await addJS('https://cdn.jsdelivr.net/npm/jspdf@2.4.0/dist/jspdf.umd.min.js');
                await addJS('https://cdn.jsdelivr.net/npm/html2canvas@1.3.3/dist/html2canvas.min.js');
                await addJS('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

                const pdf = new window.jspdf.jsPDF({
                    orientation: 'p',
                    unit: 'pt',
                    format: 'a4'
                });

                pdf.html(document.querySelector('[class*="Template_templateColumn"]'), {
                    margin: [28, 0, 28, 0],
                    autoPaging: 'text',
                });

                return pdf.output('arraybuffer');
            }
        )
    };

    for (const url of urls) {
        await Promise.all([
            page.waitForNavigation(),
            page.goto(url, {
                waitUntil: 'networkidle2'
            }),
            page.waitForSelector('[class*="Template_templateColumn"]'),
        ]);

        const filehander = await fs.promises.open(`${filename}.pdf`);
        
        try {
            await filehander.write(await pdfGenerate());
        } finally {
            await filehander.close();
        }
    }

    await browser.close();
};