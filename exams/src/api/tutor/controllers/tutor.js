"use strict";

/**
 * tutor controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const Excel = require("exceljs");

const embedIdInAttributes = (entry) => ({
  // id: entry.id,
  // attributes: {
  id: entry.id, // Embed the 'id' into 'attributes'
  ...entry.attributes,
  // },
});

module.exports = createCoreController("api::tutor.tutor", ({ strapi }) => ({
  // Override the default find method
  async find(ctx) {
    ctx.query.populate = "*"; // This will populate all relations
    // Fetch the entities with populated relations
    const { data } = await super.find(ctx);

    // Process the main entity and its populated relations
    const newData = data.map((entry) => ({
      //id: entry.id,
      //attributes: {
      id: entry.id, // Embed the main entity's id into its attributes
      ...entry.attributes,
      tutor_email: entry.attributes.user.data
        ? entry.attributes.user.data.attributes.email
        : null,
      location: entry.attributes.location?.data
        ? embedIdInAttributes(entry.attributes.location.data)
        : null,
      // },
    }));

    return newData;
  },

  // Override the default findOne method
  async findOne(ctx) {
    const { id } = ctx.params; // Assuming the ID of the entity to fetch is provided in the URL

    ctx.query.populate = "*"; // This will populate all relations

    // Call the default findOne to get the entity by ID
    const { data } = await super.findOne(ctx);

    const newData = {
      //attributes: {
      id: data.id, // Embed the main entity's id into its attributes
      ...data.attributes,
      location: data.attributes.location.data
        ? embedIdInAttributes(data.attributes.location.data)
        : null,

      //},
    };
    return newData;
  },

  // Override the default update method
  async update(ctx) {
    const { id } = ctx.params; // Assuming the ID of the entity to fetch is provided in the URL

    ctx.query.populate = "*"; // This will populate all relations

    // Call the default update to get the entity by ID
    const { data } = await super.update(ctx);

    const newData = {
      //attributes: {
      id: data.id, // Embed the main entity's id into its attributes
      ...data.attributes,
      location: data.attributes.location.data
        ? embedIdInAttributes(data.attributes.location.data)
        : null,
      //},
    };
    return newData;
  },

  async findTutorsForStudent(ctx) {
    const userId = ctx.state.user.id;

    const students = await strapi.entityService.findMany(
      "api::student.student",
      {
        filters: {
          user: { id: userId },
        },
        fields: ["id"], // Retrieve only the exam IDs
      }
    );

    // @ts-ignore
    let studentId = students[0].id;
    // First, find all exams where the student is linked
    const exams = await strapi.entityService.findMany("api::exam.exam", {
      filters: {
        student: { id: studentId },
      },
      populate: { tutor: true }, // Populate the tutor relation to access the ID
    });

    // Extract tutor IDs from the result
    const tutorIds = exams
      .map((exam) => exam.tutor?.id) // Map to tutor IDs, handling possible nulls
      .filter((id) => id !== undefined); // Filter out undefined values

    // Then, fetch tutors that match these IDs
    const tutors = await strapi.entityService.findMany("api::tutor.tutor", {
      filters: {
        id: { $in: tutorIds }, // Filter by tutor IDs
      },
      populate: "*", // Populate all related fields if needed
    });

    return tutors;
  },

  async importExcel(ctx) {
    try {
      const req = ctx.request;
      const files = req.files;
      const uploaded = files?.file;

      if (!uploaded) {
        return ctx.badRequest('No file uploaded. Expecting form field "file".');
      }

      const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      const filePath = file.filepath || file.path;

      if (!filePath) {
        return ctx.badRequest("Couldn't resolve uploaded file path.");
      }

      // ----- Location map -----
      const allLocations = await strapi.entityService.findMany(
        "api::location.location",
        {
          fields: ["id", "name"],
          limit: 1000,
        }
      );
      const locationMap = {};
      allLocations.forEach(
        (loc) => (locationMap[loc.name?.toLowerCase()] = loc.id)
      );

      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(filePath);

      // you were using sheet index 2 before, keep that:
      const sheet = workbook.worksheets[2];
      if (!sheet) {
        return ctx.badRequest("Excel has no sheet at index 2");
      }

      const headerRow = sheet.getRow(1);
      const headers = headerRow.values;

      const createdTutors = [];
      const updatedTutors = [];
      const skippedRows = [];

      for (let rowNumber = 2; rowNumber <= sheet.actualRowCount; rowNumber++) {
        const row = sheet.getRow(rowNumber);

        // skip fully empty rows
        if (
          !row ||
          row.values.filter((v) => v !== null && v !== undefined && v !== "")
            .length === 0
        ) {
          continue;
        }

        // Build a plain row object from headers
        const rowObj = {};
        headers.forEach((header, colIndex) => {
          if (typeof header === "string" && header.trim() !== "") {
            const cell = row.getCell(colIndex);
            let value = cell.value;

            if (value && typeof value === "object" && "text" in value) {
              value = value.text;
            }

            rowObj[header] = value;
          }
        });

        // break condition (as you had)

        /*
        if (
          !(
            (rowObj["Vorname"] == "Außenstandorte" ||
              rowObj["Vorname"] ==
                "Freie Dienstnehmer bzw. besondere Regelungen") &&
            (!rowObj["Familienname"] || rowObj["Familienname"] == "")
          )
        )
          continue; */

        // Row color from first cell
        let color = null;
        const firstCell = row.getCell(1);
        if (firstCell.fill?.fgColor) {
          const fg = firstCell.fill.fgColor;
          color = fg.argb || fg.theme || null;
        }

        // skip "crossed-out" rows (your previous logic)
        if (color == "1" || color == 1) {
          continue;
        }

        let fName = "";
        let lName = "";
        let notes = "";
        const cleaned = [];

        // fall back to explicit columns if needed
        if (!fName && rowObj["Vorname"]) fName = String(rowObj["Vorname"]);
        if (!lName && rowObj["Familienname"])
          lName = String(rowObj["Familienname"]);

        fName = fName.trim();
        lName = lName.trim();

        // ----- phone -----
        let telephone = rowObj["Telefon"];
        if (
          typeof telephone !== "string" &&
          telephone != null &&
          telephone["result"]
        ) {
          telephone = telephone["result"];
        }
        if (telephone == null) telephone = "";
        telephone = String(telephone).trim();

        // ----- matrikel (optional, no more TEMP generation) -----
        let matrikel = rowObj["Matrikel Nr."];
        if (matrikel) {
          matrikel = String(matrikel).trim();
        }

        // ----- misc notes (not in schema anymore – remove) -----
        // you had miscNotes, bonus_time, disability etc.; those are gone in tutor schema

        // ----- build tutorData according to schema -----
        const tutorData = {
          first_name: fName || "", // required
          last_name: lName || "", // required
          phone: telephone || null, // unique but optional
          matrikel_number: matrikel || null, // optional unique
        };

        let email;
        if (
          rowObj["E-Mail"] &&
          rowObj["E-Mail"] != "" &&
          rowObj["E-Mail"].includes("@") &&
          rowObj["E-Mail"].includes(".")
        ) {
          email = rowObj["E-Mail"].trim();
          var spChars = [";", "("];

          spChars.forEach((c) => {
            if (email.includes(c)) {
              email = email.substring(0, email.indexOf(c));
              email = email.trim();
            }
          });
        }

        if (email) tutorData.email = email;

        // distribution_list (enum Yes/No) from "in Verteiler2"
        if (rowObj["in Verteiler2"]) {
          const val = String(rowObj["in Verteiler2"]).trim().toLowerCase();
          if (val === "ja") tutorData.distribution_list = "Yes";
          else tutorData.distribution_list = "No";
        }

        // location (relation) from "Standort"
        const rawLocation = rowObj["Standort"];
        if (rawLocation) {
          const firstLoc = String(rawLocation)
            .split("/")[0]
            .trim()
            .toLowerCase();
          const locationId = locationMap[firstLoc];

          if (locationId) {
            tutorData.location = locationId;
          } else {
            console.log(
              `WARNING: No Location found matching "${firstLoc}" from row ${rowNumber}`
            );
          }
        }

        // you can optionally map contract_type / contract_completed / salto_access
        // if you add matching columns in Excel:
        //
        // if (rowObj["Vertragsart"]) { ... set tutorData.contract_type ... }
        // if (rowObj["Vertrag fertig"]) { ... set tutorData.contract_completed ... }
        // if (rowObj["SALTO ab"]) { tutorData.salto_access = new Date(...).toISOString().slice(0,10); }

        if (tutorData.first_name != "" && tutorData.last_name != "") {
          let existing = [];
          if (matrikel) {
            existing = await strapi.entityService.findMany("api::tutor.tutor", {
              filters: { matrikel_number: matrikel },
              limit: 1,
            });
          }

          if (existing.length === 0 && telephone) {
            existing = await strapi.entityService.findMany("api::tutor.tutor", {
              filters: { phone: telephone },
              limit: 1,
            });
          }

          if (existing.length === 0 && email) {
            existing = await strapi.entityService.findMany("api::tutor.tutor", {
              filters: { email: email },
              limit: 1,
            });
          }

          if (existing.length > 0) {
            const updated = await strapi.entityService.update(
              "api::tutor.tutor",
              existing[0].id,
              { data: tutorData }
            );
            updatedTutors.push(updated.id);
          } else {
            const created = await strapi.entityService.create(
              "api::tutor.tutor",
              {
                data: tutorData,
              }
            );
            createdTutors.push(created.id);
          }
        }
      }

      console.log(
        "==================================================================="
      );

      return ctx.send({
        message: "Tutor import finished (UPSERT)",
        file: file.name,
        created: createdTutors.length,
        updated: updatedTutors.length,
        skippedRows,
      });
    } catch (err) {
      console.error("Error importing tutors:", err);
      return ctx.internalServerError("Failed to import tutors from Excel");
    }
  },
}));
