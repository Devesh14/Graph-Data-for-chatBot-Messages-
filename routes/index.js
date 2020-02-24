import express from 'express'
import TaskService from '../services/task.service'
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/readCsv", (req, res) => {
  res.send(TaskService.readCsv())
});

// get user By userId
router.post("/timeZone", (req, res) => {
  TaskService.getGraphData(req.body.timezone, req.body.granularity)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => res.status(400).json(Response.somethingWentWrong()));
});

module.exports = router;
