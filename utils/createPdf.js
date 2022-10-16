import puppeteer from "puppeteer";

export const createPdf = async (urls, filename) => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const [page] = await browser.pages();
    await page.setDefaultNavigationTimeout(0);
    let buffer = new Uint8Array(0);
    let arrayBufferToPdf;

    const appendBuffer = (buffer1, buffer2) => {
        const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
    };

    const pdfGenerate = async () => await page.evaluate(async () => {
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
        await addJS('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

        const pdf = new window.jspdf.jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4'
        });

        pdf.html(document.querySelector('#__next'), {
            margin: [28, 0, 28, 0],
            autoPaging: 'text',
        });
        console.log('pdf', pdf);
        setTimeout(() => {}, 10000);
        return pdf.output('arraybuffer');
    });

//    const mergePdfs = async () => await page.evaluate(async (pdfsToMerges) => {
//        console.log('Кисик на PDFDocument', window.PDFDocument);
//        const mergedPdf = await window.PDFDocument.create();
//        const actions = pdfsToMerges.map(async pdfBuffer => {
//            const pdf = await window.PDFDocument.load(pdfBuffer);
//            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
//            copiedPages.forEach((page) => {
//                mergedPdf.addPage(page);
//            });
//        });
//
//        await Promise.all(actions);
//        return await mergedPdf.save(`${filename}.pdf`);
//    })

    for (const url of urls) {
        await Promise.all([
            page.waitForNavigation(),
            page.goto(url, {
                waitUntil: 'networkidle2'
            }),
            page.waitForSelector('#__next'),
        ]);
//        arrayBufferToPdf = appendBuffer(buffer, await pdfGenerate(url));
        await pdfGenerate(url);
    }
    console.log(arrayBufferToPdf);
//    await mergePdfs(filename);
    await browser.close();
};