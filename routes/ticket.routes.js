const express = require("express");
const ticketRoute = express.Router()
const ticketController = require('../controllers/ticket.controller')
// ticketRoute.get('/get_ticket' , ticketController.getTicket)
ticketRoute.get('/get_ticket' , ticketController.createTicket)
ticketRoute.get('/new_counter' , ticketController.createCounter)
ticketRoute.get('/last_ticket' , ticketController.getLastTicketNumber)
ticketRoute.put('/get_next' , ticketController.getNext)
ticketRoute.put('/update_status' , ticketController.updateStatus)
ticketRoute.put('/complete_current' , ticketController.completeCurrent)
ticketRoute.get('/all_counters' , ticketController.getAllCounters)
ticketRoute.get('/get_current' , ticketController.currentserving)
module.exports = ticketRoute