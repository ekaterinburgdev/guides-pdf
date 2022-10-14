import puppeteer from "puppeteer";

export const createPdf = async (urls, filename) => {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();
    let buffer;

    const pdfGenerate = async () => await page.evaluate(async () => {
        async function addJS(pathName) {
            return new Promise((res, _) => {
                const script = document.createElement('script');
                script.src = pathName;
                document.body.appendChild(script)
                script.onload = () => { res() }
            })
        }

        await addJS('https://cdn.jsdelivr.net/npm/jspdf@2.4.0/dist/jspdf.umd.min.js');

        const pdf = new window.jspdf.jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4'
        });

        pdf.html(document.querySelector('#__next'), {
            margin: [28, 0, 28, 0],
            autoPaging: 'text',
        });

        return pdf.output('arraybuffer');
    });

    function concatenate(...arrays) {
        // Calculate byteSize from all arrays
        let size = arrays.reduce((a, b) => a + b.byteLength, 0);
        // Allcolate a new buffer
        let result = new Uint8Array(size);

        // Build the new array
        let offset = 0;
        for (let arr of arrays) {
            result.set(arr, offset)
            offset += arr.byteLength
        }

        return result;
    }

    const mergePdfs = async (pdfsToMerges) => {
        const mergedPdf = await window.PDFDocument.create();
        const actions = pdfsToMerges.map(async pdfBuffer => {
            const pdf = await window.PDFDocument.load(pdfBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        });
        await Promise.all(actions);
        return await mergedPdf.save(`${filename}.pdf`);
    }

    for (const url of urls) {
        await Promise.all([
            page.waitForNavigation(),
            page.goto(url, {
                timeout: 0,
                waitUntil: 'networkidle2'
            }),
            page.waitForSelector('#__next'),
        ]);
        buffer = concatenate(await pdfGenerate(url));
        await page.waitForNavigation({
            waitUntil: 'domcontentloaded'
        })
    }

    await mergePdfs(buffer, filename);
    await browser.close();
};