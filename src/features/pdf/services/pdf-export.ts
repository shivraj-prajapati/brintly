import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads a client-side A4 PDF file using jsPDF & html2canvas.
 * Features:
 * - Awaits web fonts (document.fonts.ready) to guarantee Hindi Devanagari & Rupee symbol visibility.
 * - Yields to browser event loop with requestAnimationFrame + setTimeout so the UI loader never freezes.
 * - Optimized 2x canvas scaling with clean JPEG compression (0.88) for fast PDF opening and small file sizes.
 */
export async function downloadSalarySlipsPdf(
  containerElement: HTMLElement,
  fileName: string = 'Brintly-Salary-Slips.pdf',
  onProgress?: (progress: number, statusText?: string) => void
): Promise<void> {
  const pageElements = Array.from(
    containerElement.querySelectorAll<HTMLElement>('.a4-print-sheet')
  );

  if (!pageElements || pageElements.length === 0) {
    throw new Error('No printable sheets found to export.');
  }

  // 1. Ensure all custom fonts (Devanagari, Inter, Mono) are loaded in the browser
  if (typeof document !== 'undefined' && 'fonts' in document && document.fonts.ready) {
    if (onProgress) onProgress(3, 'Loading fonts & styles...');
    await document.fonts.ready;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const total = pageElements.length;

  for (let i = 0; i < total; i++) {
    const pageEl = pageElements[i];

    // Calculate current progress percentage
    const stepProgress = Math.round(((i) / total) * 90) + 5;
    if (onProgress) {
      onProgress(stepProgress, `Rendering A4 Page ${i + 1} of ${total}...`);
    }

    // Yield control to the browser so the loader spinner and progress bar animate smoothly
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 60);
      });
    });

    // Capture the A4 sheet at 2x resolution for crisp text without giant file size
    const canvas = await html2canvas(pageEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      onclone: (_clonedDoc, clonedEl) => {
        clonedEl.style.transform = 'none';
        clonedEl.style.margin = '0';
      },
    });

    // 0.88 quality JPEG delivers sharp text while keeping each page ~200KB for fast PDF opening
    const imgData = canvas.toDataURL('image/jpeg', 0.88);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // Standard A4 dimensions in mm: 210 x 297
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 92), `Processed Page ${i + 1} of ${total}`);
    }

    // Yield again between pages
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 40);
      });
    });
  }

  if (onProgress) {
    onProgress(98, 'Packaging PDF document...');
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  if (onProgress) {
    onProgress(100, 'Download starting...');
  }

  await new Promise((resolve) => setTimeout(resolve, 80));
  pdf.save(fileName);
}
