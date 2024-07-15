const express = require("express");
const connection = require("../config/database"); // Adjust the path as necessary
const router = express.Router();
const sqltable_Name = "import_excel";

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

    const query = `SELECT * FROM ${sqltable_Name} LIMIT ? OFFSET ?;`;
    connection.query(query, [limit, offset], (queryError, results) => {
      if (queryError) {
        console.error("Error retrieving data:", queryError);
        return res.status(500).json({
          error: "Internal Server Error",
          details: queryError.message
        });
      }

      const totalPages = Math.ceil(totalCount / limit);
      const currentPageDataCount = results.length;

      res.status(200).json({
        currentPage: page, // Current page
        totalPages: totalPages, // Total number of pages
        totalData: totalCount, // Total number of data entries
        currentPageDataCount: currentPageDataCount, // Number of data entries on the current page
        data: results
      });
    });
  });
});

// Query by ID
router.get("/:ID", (req, res) => {
  const _ID = req.params.ID;
  const query = `SELECT * FROM ${sqltable_Name} ;`;
  
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

    res.status(200).json(results[0]);
  });
});

module.exports = router;
