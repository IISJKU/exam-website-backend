"use strict";

/**
 * student controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const Excel = require("exceljs");

// Helper function to embed 'id' in 'attributes' of related items
const embedIdInAttributes = (entry) => ({
  // id: entry.id,
  // attributes: {
  id: entry.id, // Embed the 'id' into 'attributes'
  ...entry.attributes,
  // },
});

module.exports = createCoreController("api::student.student", ({ strapi }) => ({
  // Override the default find method
  async find(ctx) {
    ctx.query.populate = "*"; // This will populate all relations
    // Fetch the entities with populated relations
    const { data } = await super.find(ctx);

    // Process the main entity and its populated relations
    const newData = data.map((entry) => ({
      id: entry.id,
      ...entry.attributes,
      major: entry.attributes.major?.data
        ? embedIdInAttributes(entry.attributes.major.data)
        : null,
      major_id: entry.attributes.major?.data?.id ?? null,
      student_email: entry.attributes.user?.data?.attributes?.email ?? null,
      location: entry.attributes.location?.data
        ? embedIdInAttributes(entry.attributes.location.data)
        : null,
      faculty: entry.attributes.faculty?.data
        ? embedIdInAttributes(entry.attributes.faculty.data)
        : null,
      disability_types:
        entry.attributes.disability_types?.data?.map(embedIdInAttributes) ?? [],
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
      major: data.attributes.major?.data
        ? embedIdInAttributes(data.attributes.major.data)
        : null,
      major_id: data.attributes.major?.data?.id ?? null,
      location: data.attributes.location?.data
        ? embedIdInAttributes(data.attributes.location.data)
        : null,
      faculty: data.attributes.faculty?.data
        ? embedIdInAttributes(data.attributes.faculty.data)
        : null,
      disability_types:
        data.attributes.disability_types &&
        data.attributes.disability_types.data
          ? data.attributes.disability_types.data.map(embedIdInAttributes)
          : [],
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
      major: data.attributes.major
        ? embedIdInAttributes(data.attributes.major.data)
        : null,
      major_id: data.attributes.major.data
        ? data.attributes.major.data.id
        : null,
      location: data.attributes.location.data
        ? embedIdInAttributes(data.attributes.location.data)
        : null,
      faculty: data.attributes.faculty.data
        ? embedIdInAttributes(data.attributes.faculty.data)
        : null,
      disability_types:
        data.attributes.disability_types &&
        data.attributes.disability_types.data
          ? data.attributes.disability_types.data.map(embedIdInAttributes)
          : [],
      //},
    };

    return newData;
  },

  async findStudentsMe(ctx) {
    const userId = ctx.state.user.id;

    if (ctx.state.user.role.type == "student") {
      const students = await strapi.entityService.findMany(
        "api::student.student",
        {
          filters: {
            user: { id: userId },
          },
          fields: ["id"], // Retrieve only the exam IDs
        }
      );

      return students;
    } else {
      const exams = await strapi.entityService.findMany("api::exam.exam", {
        filters: {
          tutor: { id: userId },
        },
        fields: "*", // Retrieve only the exam IDs
      });

      const students = await strapi.entityService.findMany("api::exam.exam", {
        fields: "*",
      });

      const filteredStudents = [];
      exams.forEach((exam) => {
        students.forEach((student) => {
          //@ts-ignore
          if (exam.student_id == student.id) {
            filteredStudents.push(student);
          }
        });
      });

      return filteredStudents;
    }
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

      const allDisabilityTypes = await strapi.entityService.findMany(
        "api::disability-type.disability-type",
        {
          fields: ["id", "abbreviation"],
          limit: 1000,
        }
      );

      const allFaculties = await strapi.entityService.findMany(
        "api::faculty.faculty",
        {
          fields: ["id", "abbreviation"],
          limit: 1000,
        }
      );

      const allMajors = await strapi.entityService.findMany(
        "api::major.major",
        {
          fields: ["id", "name", "abbreviation"],
          limit: 1000,
        }
      );

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

      const disabilityMap = {};
      for (const dt of allDisabilityTypes) {
        if (dt.abbreviation) {
          disabilityMap[dt.abbreviation.toUpperCase()] = dt.id;
        }
      }

      const majorByAbbrev = {};
      const majorByName = {};
      for (const m of allMajors) {
        if (m.abbreviation) {
          majorByAbbrev[m.abbreviation.toLowerCase().replaceAll("-", "")] =
            m.id;
        }
        if (m.name) {
          majorByName[m.name.toLowerCase().replaceAll("-", "")] = m.id;
        }
      }

      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(filePath);

      const sheet = workbook.worksheets[3];
      if (!sheet) {
        return ctx.badRequest("Excel has no sheets");
      }

      const headerRow = sheet.getRow(1);
      const headers = headerRow.values;

      const createdStudents = [];
      const updatedStudents = [];
      const skippedRows = [];
      const tempStudents = [];

      const allowedDistribution = ["Yes", "No", "Not anymore"];
      const allowedPresenceMultimedia = [
        "Presence",
        "Multimedia",
        "Fernuni Hagen",
      ];

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

        //console.log(headers);

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
        if (
          (!rowObj["Studierende"] || rowObj["Studierende"] == "") &&
          (!rowObj["Matrikel Nr."] || rowObj["Matrikel Nr."] == "")
        )
          break;
        if (!rowObj["Studierende"] || rowObj["Studierende"] == "") continue;

        // Row color from first cell
        let color = null;
        const firstCell = row.getCell(1);
        if (firstCell.fill?.fgColor) {
          const fg = firstCell.fill.fgColor;
          color = fg.argb || fg.theme || null;
        }

        if (color == "1" || color == 1) {
          continue;
        }

        // ---- matrikel handling (real or temp) ----
        let matrikel = rowObj["Matrikel Nr."];
        let isTempMatrikel = false;

        if (!matrikel) {
          // Generate a temporary matrikel_number so Strapi's "required" constraint is satisfied
          isTempMatrikel = true;
          matrikel = `TEMP-${rowNumber}-${Date.now()}`;
          tempStudents.push({ rowNumber, tempMatrikel: matrikel });
        }

        let name = rowObj["Studierende"];

        //console.log(name);
        let nArr = name.trim().split(" ");
        let notes = "";
        let fName = "";
        let lName = "";
        let cleaned = [];

        if (nArr.length != 0) {
          for (var i = 0; i < nArr.length; i++) {
            if (nArr[i].includes("(") || nArr[i].includes(")")) {
              notes = notes + nArr[i] + "\n";
            } else {
              cleaned.push(nArr[i]);
            }
          }

          if (cleaned && cleaned.length != 0)
            cleaned.forEach((ent, num) => {
              if (num + 1 == cleaned.length) lName = ent;
              else fName = fName + ent + " ";
            });

          if (notes) notes = notes.replaceAll("(", "").replaceAll(")", "");
        }

        let miscNotes = rowObj["Bedingungen"] + "\n" + notes;

        let t = "ehrzeit";
        if (miscNotes.includes(t))
          miscNotes = miscNotes.substring(
            miscNotes.indexOf(t) + t.length + 2,
            miscNotes.length
          );

        miscNotes = miscNotes.trim();
        lName = lName.trim();
        fName = fName.trim();

        /*
        console.log(
          "f: " + fName + " l: " + lName + " " + miscNotes + " color: " + color
        ); */

        let emergency = rowObj["Tel. Notfälle"];
        let telephone = rowObj["Telefonnummer"];
        if (
          typeof telephone != "string" &&
          telephone != null &&
          telephone["result"]
        )
          telephone = telephone["result"];

        if (telephone == null) telephone = "";
        telephone = telephone + "";
        let bTime = rowObj["Mehrzeit"];

        let disability = rowObj["Beeinträchtigung"];

        if (!bTime || isNaN(Number(bTime))) bTime = 0;
        else bTime = Number(bTime);

        // Build student payload
        const studentData = {
          first_name: lName || "",
          last_name: fName || "",
          phone: telephone || null,
          emergency_contact: emergency || null,
          matrikel_number: String(matrikel),
          bonus_time: bTime ?? null,
          misc: miscNotes || null,
          disability: disability || null,
          updates: rowObj["Updates"] || null,
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
        if (email) studentData.email = email;

        const rawMajor = rowObj["Studium"];
        if (rawMajor) {
          let majorName = String(rawMajor).trim().replaceAll("-", "");

          // try to find major by abbreviation first, then by name

          //for now: remove bakk and master and such

          let replaceTags = ["bakk", "master", "bachelor", " bs"];

          for (var i = 0; i < replaceTags.length; i++) {
            majorName = majorName.toLowerCase().replaceAll(replaceTags[i], "");
          }

          if (majorName.includes("("))
            majorName = majorName.substring(0, majorName.indexOf("("));

          majorName = majorName.trim();

          let abbrev = majorName; // same name & abbreviation as you requested

          const abbrKey = abbrev.toLowerCase();
          const nameKey = majorName.toLowerCase();

          let majorId = majorByAbbrev[abbrKey] || majorByName[nameKey];

          if (!majorId) {
            // create new major with same name + abbreviation, no faculty

            let t = "";
            let open = true;
            for (var i = 0; i < majorName.length; i++) {
              if (open) t = t + majorName[i].toUpperCase();
              else t = t + majorName[i];
              open = false;
              if (majorName[i] == " ") {
                open = true;
              }
            }
            majorName = t;
            abbrev = abbrev.toUpperCase();

            const newMajor = await strapi.entityService.create(
              "api::major.major",
              {
                data: {
                  name: majorName,
                  abbreviation: abbrev,
                  // faculty: not set (null)
                },
              }
            );

            majorId = newMajor.id;
            // update maps so subsequent rows reuse it
            majorByAbbrev[abbrKey] = majorId;
            majorByName[nameKey] = majorId;
          }

          studentData.major = majorId;
        }

        // Mark temp ones in misc so you can filter them later in Strapi UI
        if (isTempMatrikel) {
          const marker = `[TEMP MATRIKEL GENERATED FROM IMPORT]`;
          studentData.misc = studentData.misc
            ? `${studentData.misc}\n${marker}`
            : marker;
        }

        // Boolean: conditions_approved
        if (
          rowObj.conditions_approved !== undefined &&
          rowObj.conditions_approved !== null
        ) {
          const val = String(rowObj.conditions_approved).toLowerCase().trim();
          studentData.conditions_approved = ["true", "1", "yes", "y"].includes(
            val
          );
        }

        // Enums
        if (rowObj["in Verteiler2"]) {
          const val = String(rowObj["in Verteiler2"]).trim().toLowerCase();

          if (val == "ja") {
            studentData.in_distribution_list = "Yes";
          } else if (val == "nicht mehr") {
            studentData.in_distribution_list = "Not anymore";
          } else {
            studentData.in_distribution_list = "No";
          }
        }

        if (rowObj["Präsenz/Multimedia"]) {
          let val = String(rowObj["Präsenz/Multimedia"]);
          val = val.toLowerCase().trim();

          if (val == "präsenz") studentData.presence_multimedia = "Presence";
          if (val == "multimedia")
            studentData.presence_multimedia = "Multimedia";
          if (val == "fernuni hagen")
            studentData.presence_multimedia = "Fernuni Hagen";
        }

        const rawLocation = rowObj["Standort"];
        if (rawLocation) {
          // Take only the first segment before a slash
          const firstLoc = String(rawLocation)
            .split("/")[0]
            .trim()
            .toLowerCase();

          const locationId = locationMap[firstLoc];

          if (locationId) {
            studentData.location = locationId; // one-to-one relation
          } else {
            console.log(
              `WARNING: No Location found matching "${firstLoc}" from row ${rowNumber}`
            );
          }
        }

        if (color && (color == "FFFFC000" || color == 7))
          studentData.misc =
            studentData.misc + "\nOrange, Braucht weniger Assistenz";

        let fac;
        if (rowObj["facu"]) {
          for (let i = 0; i < allFaculties.length; i++) {
            if (
              allFaculties[i]["abbreviation"] == rowObj["facu"].toUpperCase()
            ) {
              fac = allFaculties[i];
            } else if (
              allFaculties[i]["abbreviation"] == "TNF" &&
              rowObj["facu"].toUpperCase() == "T"
            ) {
              fac = allFaculties[i];
            } else if (
              allFaculties[i]["abbreviation"] == "S" &&
              rowObj["facu"].toUpperCase() == "W"
            ) {
              fac = allFaculties[i];
            } else if (
              allFaculties[i]["abbreviation"] == "R" &&
              rowObj["facu"].toUpperCase() == "RE"
            ) {
              fac = allFaculties[i];
            }
          }
        }

        if (fac) studentData.faculty = fac;

        // 2) Map disability codes -> DisabilityType IDs
        // Expecting a column "disability_codes" in the Excel (e.g. "c", "d;mo", "B, C")
        const codesRaw = rowObj["disab1"] + "," + rowObj["disab2"];
        if (codesRaw) {
          const codes = String(codesRaw)
            .split(/[;,]/) // split on comma or semicolon
            .map((c) => c.trim())
            .filter(Boolean);

          const disabilityIds = [];

          for (const code of codes) {
            const upper = code.toUpperCase();
            const dtId = disabilityMap[upper];

            if (dtId) {
              disabilityIds.push(dtId);
            } else {
              if (code != "null" && code != null)
                console.log(
                  `No DisabilityType found with abbreviation "${code}"`
                );
            }
          }

          if (disabilityIds.length > 0) {
            // manyToMany: list of IDs is enough
            studentData.disability_types = disabilityIds;
          }
        }

        // ---- UPSERT by matrikel_number ----
        let existing = [];

        existing = await strapi.entityService.findMany("api::student.student", {
          filters: { matrikel_number: String(matrikel) },
          limit: 1,
        });
        if (existing.length === 0) {
          existing = await strapi.entityService.findMany(
            "api::student.student",
            {
              filters: {
                first_name: studentData.first_name,
                last_name: studentData.last_name,
                misc: studentData.misc,
              },
              limit: 1,
            }
          );
        }

        if (existing.length > 0) {
          const updated = await strapi.entityService.update(
            "api::student.student",
            existing[0].id,
            { data: studentData }
          );
          updatedStudents.push(updated.id);
        } else {
          const created = await strapi.entityService.create(
            "api::student.student",
            { data: studentData }
          );
          createdStudents.push(created.id);
        }
      }

      console.log(
        "==================================================================="
      );

      return ctx.send({
        message: "Student import finished (UPSERT + temp matrikel)",
        file: file.name,
        created: createdStudents.length,
        updated: updatedStudents.length,
        tempStudents, // which rows got fake matrikels
        skippedRows,
      });
    } catch (err) {
      console.error("Error importing students:", err);
      return ctx.internalServerError("Failed to import students from Excel");
    }
  },
}));
