import PDFDocument from "pdfkit";
import WaterRecord from "../models/WaterRecord.js";

export const generatePDF = async (req, res) => {
  try {
    const records = await WaterRecord.find({
      userId: req.user._id,
    });

    const totalUsage = records.reduce(
      (sum, record) => sum + Number(record.liters),
      0
    );

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=AquaSense-Report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(22).text("AquaSense Water Usage Report");
    doc.moveDown();

    doc.fontSize(14).text(`Total Records: ${records.length}`);
    doc.text(`Total Water Usage: ${totalUsage} Liters`);

    doc.moveDown();
    doc.text("Water Records");
    doc.moveDown();

    records.forEach((record) => {
      doc.text(
        `${new Date(record.date).toLocaleDateString()} | ${record.location} | ${record.liters} L`
      );
    });

    doc.end();
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};