const express = require("express");
const connection = require("../config/database"); // Adjust the path as necessary
const moment = require("moment-timezone"); // Import the moment-timezone library
const router = express.Router();
const sqltable_Name = "plc_data";

// Function to convert UTC to local time
const convertToLocalTime = (utcTime) => {
  return moment(utcTime).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
};

// Query all data | use ?page=
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 100;
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) AS totalCount FROM ${sqltable_Name};`;

  connection.query(countQuery, (countError, countResults) => {
    if (countError) {
      console.error("Error retrieving data count:", countError);
      return res.status(500).json({
        error: "Internal Server Error",
        details: countError.message
      });
    }
    const totalCount = countResults[0].totalCount;

    const query = `SELECT * FROM ${sqltable_Name} ORDER BY date_time DESC LIMIT ? OFFSET ?;`;
    connection.query(query, [limit, offset], (queryError, results) => {
      if (queryError) {
        console.error("Error retrieving data:", queryError);
        return res.status(500).json({
          error: "Internal Server Error",
          details: queryError.message
        });
      }

      // Convert date_time to local time
      const convertedResults = results.map(result => ({
        ...result,
        date_time: convertToLocalTime(result.date_time)
      }));

      const totalPages = Math.ceil(totalCount / limit);
      const currentPageDataCount = results.length;

      res.status(200).json({
        currentPage: page, // Current page
        totalPages: totalPages, // Total number of pages
        totalData: totalCount, // Total number of data entries
        currentPageDataCount: currentPageDataCount, // Number of data entries on the current page
        data: convertedResults
      });
    });
  });
});

// Query by ID
router.get("/:ID", (req, res) => {
  const _ID = req.params.ID;
  const query = `SELECT * FROM ${sqltable_Name} WHERE ID = ? ORDER BY date_time DESC;`;
  
  connection.query(query, [_ID], (queryError, results) => {
    if (queryError) {
      console.error("Error retrieving data by ID:", queryError);
      return res.status(500).json({
        error: "Internal Server Error",
        details: queryError.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Convert date_time to local time
    const convertedResult = {
      ...results[0],
      date_time: convertToLocalTime(results[0].date_time)
    };

    res.status(200).json(convertedResult);
  });
});

module.exports = router;
