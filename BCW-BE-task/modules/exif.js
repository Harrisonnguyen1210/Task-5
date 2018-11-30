'use strict';

const ExifImage = require('exif').ExifImage;
const getCoordinate = (img) => {
    return new Promise((resolve, reject) =>{
        try {
            new ExifImage({ image : img }, function (error, exifData) {
                if (error)
                    console.log('Error: '+error.message);
                else{
                    const lat = gpsToDecimal(exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef);
                    const log = gpsToDecimal(exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef);
                    const coor = {
                        lat: lat,
                        lng: log
                    };
                resolve(coor);
                }
            });
        } catch (error) {
            reject(error.message);
            console.log('Error: ' + error.message);
        }
    });
};

// convert GPS coordinates to GoogleMaps format
const gpsToDecimal = (gpsData, hem) => {
    let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) +
        parseFloat(gpsData[2] / 3600);
    return (hem === 'S' || hem === 'W') ? d *= -1 : d;
};

module.exports = {
    getCoordinate: getCoordinate,
};

