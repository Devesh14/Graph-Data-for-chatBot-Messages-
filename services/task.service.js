import Promise from 'bluebird'
import csv from 'csvtojson'
import moment from 'moment'
import _ from 'lodash'
var mongoose = require('mongoose');

import chatLog from '../models/chatLog'


import Response from '../response'

class TaskService {
    readCsv() {
        csv()
            .fromFile(__dirname + '/chatData.csv')
            .then((jsonArrayObj) => {
                console.log('reading csv....');
                return chatLog.insertMany([
                    ...jsonArrayObj
                ]).then((data) => {
                    console.log('Data successfully inserted')
                    return true
                })
            })
    }

    getGraphData(timezone, granularity) {
        return chatLog.find({}, {
                __v: 0
            }).limit(100).sort({
                createdAt: 1
            }).then(records => {
                return Promise.map(records, (rec) => {
                    rec.createdAt = new Date(rec.createdAt).toLocaleString("en-US", {timeZone: timezone})
                    if( granularity === "hour" ) {
                        rec.createdAt = moment(rec.createdAt).format("ddd, hA")
                    } else {
                        rec.createdAt = moment(rec.createdAt).format()
                    } 
                    return rec
                })
                .then((data) => {
                    let graphData = {}
                    graphData.customer = _.filter(data, { sender : 'customer' });
                    graphData.admin = _.filter(data, { sender : 'admin' });
                    graphData.chatbot = _.filter(data, { sender : 'chatbot' });
                    graphData.system = _.filter(data, { sender : 'system' }); 
                    return Response.successResponse(graphData)
                })
            })
            .catch(err => {
                return Response.errorResponse(1, 'No Logs')
            })
    }

}

module.exports = new TaskService();