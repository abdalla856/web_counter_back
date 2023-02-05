const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  manager_status: {
    type: Number,
    default: 0,
    //0 offline
    //1 online
  },
  current_serving : {
    default :0, 
    type :Number
  }
  ,
  customer_status: {
    type: Number,
    default: 0,
    // 0 offline
    //1 online 
    // 2 gray 
  },
  ticket_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
});

module.exports = mongoose.model("Counter", CounterSchema);
