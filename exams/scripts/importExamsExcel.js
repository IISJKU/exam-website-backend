const fs = require("fs");
const path = require("path");
// @ts-ignore
const xlsx = require("xlsx");
const strapi = require("@strapi/strapi");

process.chdir(path.resolve(__dirname, "..")); // Move up one directory to the root

const importStudentsFromExcel = async () => {
  try {
    console.log("Starting the import script...");

    // Start Strapi instance
    // @ts-ignore
    const app = await strapi().load();

    // Load the Excel file
    const excelFilePath = path.join(__dirname, "Exams.xlsx");
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0]; // data is in the first sheet
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log("Excel Data Loaded:", sheetData);

    // Loop through the data and create entries in the Strapi database
    for (const entry of sheetData) {
      console.log("Creating entry for:", entry);
      await app.entityService.create("api::exam.exam", {
        data: {
          title: entry.title,
          date: entry.date,
          duration: entry.duration,
          phone: entry.phone,
          major: entry.major,
          institute: entry.institute,
          mode: entry.mode,
          student: entry.student,
          tutor: entry.tutor,
          examiner: entry.examiner,
        },
      });
    }

    console.log("Data imported successfully");
    await app.destroy();
  } catch (err) {
    console.error("Error importing data:", err);
  }
};

importStudentsFromExcel();
