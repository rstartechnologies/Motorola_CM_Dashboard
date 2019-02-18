const express = require('express');
const router = express.Router();
const conn = require('../app_configuration/db_operations');
const response = require('../app_configuration/response');

//Smart Client Data implemented by Vishal Sehgal as on 11/2/2019
router.get('/sc_case_status', (req, res, next) => {
  // var sql, binds = [], territory = req.query.territory, status = req.query.status;
  // if (territory == 'all' && status=='all') {
  //   sql = "SELECT status, CASE WHEN status = 'Open' THEN '1' WHEN status = 'Insufficient Data' THEN '2' WHEN status = 'InProg' THEN '3' WHEN status = 'InProg Acknowledged' THEN '4' WHEN status = 'InProg Awt 3PS' THEN '5' WHEN status = 'InProg Awt Bus Unit' THEN '6' WHEN status = 'InProg Awt SSC' THEN '7' WHEN status = 'InProg Awt Credit' THEN '8' WHEN status = 'InProg Awt Resource' THEN '9' ELSE 'OTHER' END                         AS status_order, SUM (mediandays :: INTEGER) AS mediandays, SUM(contractperstatus)      AS contractscount FROM   (SELECT to_status            AS Status, Median(daysinstatus) AS MedianDays, Count(case_number)   AS contractPerStatus, territory FROM   (SELECT case_number, to_status, Min(sts_changed_on), datemoved, To_number(Trim(To_char(datemoved - Min(sts_changed_on), 'DD')), '99G999D9S') AS DaysInStatus, territory FROM   (SELECT A2.case_number, A2.to_status, A2.sts_changed_on, territory, Coalesce((SELECT Max(A1.sts_changed_on) FROM   sc_case_state_master A1 WHERE  A1.case_number = A2.case_number AND A1.from_status = A2.to_status), current_date) AS DateMoved FROM   sc_case_state_master A2 ORDER  BY case_number, sts_changed_on) resultset GROUP  BY case_number, to_status, datemoved, territory)R2 GROUP  BY to_status, territory ORDER  BY to_status) R3 GROUP  BY status ORDER  BY status_order";
  // } else {
  //   binds.push(territory);
  //   sql = "SELECT status, CASE WHEN status = 'Open' THEN '1' WHEN status = 'Insufficient Data' THEN '2' WHEN status = 'InProg' THEN '3' WHEN status = 'InProg Acknowledged' THEN '4' WHEN status = 'InProg Awt 3PS' THEN '5' WHEN status = 'InProg Awt Bus Unit' THEN '6' WHEN status = 'InProg Awt SSC' THEN '7' WHEN status = 'InProg Awt Credit' THEN '8' WHEN status = 'InProg Awt Resource' THEN '9' ELSE 'OTHER' END                         AS status_order, SUM (mediandays :: INTEGER) AS mediandays, SUM(contractperstatus)      AS contractscount FROM   (SELECT to_status            AS Status, Median(daysinstatus) AS MedianDays, Count(case_number)   AS contractPerStatus, territory FROM   (SELECT case_number, to_status, Min(sts_changed_on), datemoved, To_number(Trim(To_char(datemoved - Min(sts_changed_on), 'DD')), '99G999D9S') AS DaysInStatus, territory FROM   (SELECT A2.case_number, A2.to_status, A2.sts_changed_on, territory, Coalesce((SELECT Max(A1.sts_changed_on) FROM   sc_case_state_master A1 WHERE  A1.case_number = A2.case_number AND A1.from_status = A2.to_status), current_date) AS DateMoved FROM   sc_case_state_master A2 ORDER  BY case_number, sts_changed_on) resultset GROUP  BY case_number, to_status, datemoved, territory)R2 GROUP  BY to_status, territory ORDER  BY to_status) R3 WHERE  territory IN ( " + territory + " ) AND status IN (" + status + " ) GROUP  BY status ORDER  BY status_order";
  // }
  var postgreSql = "SELECT status, CASE WHEN status = 'Open' THEN '1' WHEN status = 'Insufficient Data' THEN '2' WHEN status = 'InProg' THEN '3' WHEN status = 'InProg Acknowledged' THEN '4' WHEN status = 'InProg Awt 3PS' THEN '5' WHEN status = 'InProg Awt Bus Unit' THEN '6' WHEN status = 'InProg Awt SSC' THEN '7' WHEN status = 'InProg Awt Credit' THEN '8' WHEN status = 'InProg Awt Resource' THEN '9' ELSE 'OTHER' END                         AS status_order, SUM (mediandays :: INTEGER) AS mediandays, SUM(contractperstatus)      AS contractscount, territory FROM   (SELECT to_status            AS Status, Median(daysinstatus) AS MedianDays, Count(case_number)   AS contractPerStatus, territory FROM   (SELECT case_number, to_status, Min(sts_changed_on), datemoved, To_number(Trim(To_char(datemoved - Min(sts_changed_on), 'DD')), '99G999D9S') AS DaysInStatus, territory FROM   (SELECT A2.case_number, A2.to_status, A2.sts_changed_on, territory, Coalesce((SELECT Max(A1.sts_changed_on) FROM   sc_case_state_master A1 WHERE  A1.case_number = A2.case_number AND A1.from_status = A2.to_status), current_date) AS DateMoved FROM   sc_case_state_master A2 ORDER  BY case_number, sts_changed_on) resultset GROUP  BY case_number, to_status, datemoved, territory)R2 GROUP  BY to_status, territory ORDER  BY to_status) R3 GROUP  BY status,territory ORDER  BY status_order";
  //call doConnect method in db_operations
  conn.doConnect((err, dbConn) => {
    if (err) { return; }
    //execute query using using connection instance returned by doConnect method
    conn.doExecute(dbConn,
      postgreSql, [],
      function (err, result) {
        if (err) {
          conn.doRelease(dbConn);
          //call error handler
          return next(err);
        }
        response.data = result.rows;
        res.json(response);
        //release connection back to pool
        conn.doRelease(dbConn);
      });
  });
});

// API for sc_case_territories
router.get('/sc_territories', (req, res, next) => {
  //call doConnect method in db_operations
  conn.doConnect((err, dbConn) => {
    if (err) { return; }
    //execute query using using connection instance returned by doConnect method
    conn.doExecute(dbConn,
      `SELECT DISTINCT( territory ) 
      FROM   sc_case_state_master 
      ORDER  BY territory ASC`, [],
      function (err, result) {
        if (err) {
          conn.doRelease(dbConn);
          //call error handler
          return next(err);
        }
        response.data = result.rows;
        res.json(response);
        //release connection back to pool
        conn.doRelease(dbConn);
      });
  });
});

// // API for sc_case_territories
// router.get('/sc_arrival_type', (req, res, next) => {
//   //call doConnect method in db_operations
//   conn.doConnect((err, dbConn) => {
//     if (err) { return; }
//     //execute query using using connection instance returned by doConnect method
//     conn.doExecute(dbConn,
//       `SELECT DISTINCT( arrival_type ) 
//       FROM   sc_case_state_master 
//       ORDER  BY arrival_type ASC`, [],
//       function (err, result) {
//         if (err) {
//           conn.doRelease(dbConn);
//           //call error handler
//           return next(err);
//         }
//         response.data = result.rows;
//         res.json(response);
//         //release connection back to pool
//         conn.doRelease(dbConn);
//       });
//   });
// });


// API for sc_workflow_status
router.get('/sc_workflow_status', (req, res, next) => {
  //call doConnect method in db_operations
  conn.doConnect((err, dbConn) => {
    if (err) { return; }
    //execute query using using connection instance returned by doConnect method
    conn.doExecute(dbConn,
      `SELECT to_status, 
      CASE 
        WHEN to_status = 'Open' THEN '1' 
        WHEN to_status = 'Insufficient Data' THEN '2' 
        WHEN to_status = 'InProg' THEN '3' 
        WHEN to_status = 'InProg Acknowledged' THEN '4' 
        WHEN to_status = 'InProg Awt 3PS' THEN '5' 
        WHEN to_status = 'InProg Awt Bus Unit' THEN '6' 
        WHEN to_status = 'InProg Awt SSC' THEN '7' 
        WHEN to_status = 'InProg Awt Credit' THEN '8' 
        WHEN to_status = 'InProg Awt Resource' THEN '9' 
        ELSE 'OTHER' 
      END AS status_order 
FROM   sc_case_state_master 
GROUP  BY to_status 
ORDER  BY status_order 
`, [],
      function (err, result) {
        if (err) {
          conn.doRelease(dbConn);
          //call error handler
          return next(err);
        }
        response.data = result.rows;
        res.json(response);
        //release connection back to pool
        conn.doRelease(dbConn);
      });
  });
});
module.exports = router;
