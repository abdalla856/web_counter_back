const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TicketScehma = new Schema({
status : {
  type :Number , 
  default :0
  //0 in queue
  //1 serving
  // 2 completed
}
 
});

module.exports = mongoose.model("Ticket", TicketScehma);
