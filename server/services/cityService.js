const XLSX = require('xlsx');
const path = require('path');

// Load the Excel file
const workbook = XLSX.readFile(path.join(__dirname, '../worldCities.xlsx'));
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Convert the worksheet to JSON
const citiesData = XLSX.utils.sheet_to_json(worksheet);

// Function to fetch cities by state
const getCitiesByState = (state) => {
    try {
        const cities = citiesData
            .filter(city => city.country === state)
            .map(city => city.city_ascii);

        return cities;
    } catch (error) {
        console.error('Error fetching cities from the Excel file:', error);
        throw new Error('Error fetching cities from the Excel file');
    }
};

module.exports = {
    getCitiesByState,
};