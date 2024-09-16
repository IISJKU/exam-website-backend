
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
        const app = await strapi().load();
    
        // Load the JSON file
        const jsonData = fs.readFileSync(path.join(__dirname, 'Students.json'), 'utf-8');
        const data = JSON.parse(jsonData);
        console.log('JSON Data Loaded:', data);
    
        // Loop through the data and create entries in the Strapi database
        for (const entry of data) {
          console.log('Creating entry for:', entry);
            await app.entityService.create('api::student.student', {
            data: {
            first_name: entry.first_name,
            last_name: entry.last_name,
            email: entry.email,
            phone: entry.phone,
            emergency_contact: entry.emergency_contact,
            matrikel_number: entry.matrikel_number,
            bouns_time: entry.bouns_time,
            misc:entry.misc,
            exams: null
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