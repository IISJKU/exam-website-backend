

const fs = require('fs');
const path = require('path');

// Set the current working directory to the project root
process.chdir(path.resolve(__dirname, '..'));  // Move up one directory to the root

// Import Strapi
const strapi = require('@strapi/strapi');

const importStudents = async () => {
    try {
        console.log('Starting the import script...');

        // Start Strapi instance
        // @ts-ignore
        const app = await strapi().load();
    
        // Load the JSON file
        const jsonData = fs.readFileSync(path.join(__dirname, 'Exams.json'), 'utf-8');
        const data = JSON.parse(jsonData);
        console.log('JSON Data Loaded:', data);
    
        // Loop through the data and create entries in the Strapi database
        for (const entry of data) {
          console.log('Creating entry for:', entry);
            await app.entityService.create('api::exam.exam', {
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
            }
      });
    }

        console.log('Data imported successfully');
        await app.destroy();
  } catch (err) {
    console.error('Error importing data:', err);
  }
};

importStudents();