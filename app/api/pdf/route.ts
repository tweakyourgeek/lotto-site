import { NextRequest, NextResponse } from 'next/server'
import { generatePDFHTML } from '@/lib/pdf-generator'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Generate HTML
    const html = generatePDFHTML(data)

    // For production, you'd use a service like Puppeteer or a PDF API
    // For now, we'll return the HTML and let the client handle it
    // In production, consider using @react-pdf/renderer or puppeteer

    /*
    Example with Puppeteer:

    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(html)
    const pdf = await page.pdf({ format: 'A4', printBackground: true })
    await browser.close()

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=lottery-reality-check.pdf',
      },
    })
    */

    // For now, return HTML that can be printed to PDF
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
