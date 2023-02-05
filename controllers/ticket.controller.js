const Ticket = require("../models/ticket");
const Counter = require("../models/counter");

exports.getLastTicketNumber = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    if (tickets === 0) {
      res.status(200).json(0);
      return;
    }
    res.status(200).json(tickets.length);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const newTicket = new Ticket();

    await newTicket.save();
    const tickets = await Ticket.find({});
    res.status(200).json(tickets.length);
  } catch (err) {
    console.log(err.message);
  }
};

exports.createCounter = async (req, res) => {
  try {
    const newCounter = new Counter();
    await newCounter.save();
    res.status(200).json(newCounter);
  } catch (err) {
    console.log(err.message);
  }
};

exports.getNext = async (req, res) => {
  const { id } = req.body;

  const ticket = await Ticket.find({ status: 0 }).limit(1);
  if (ticket.length === 0) {
    Ticket.deleteMany({ status: 0 });
    return res.status(200).json(0);
  }

  const newTicket = await Ticket.findByIdAndUpdate(
    ticket[0]._id,
    {
      status: 1,
    },
    { new: true } //to return the new document
  );
  const tickets = await Ticket.find({}).distinct("_id");
  const stringsArray = tickets.map((x) => x.toString());
  const servin_num = stringsArray.indexOf(ticket[0]._id.toString());
  const newCounter = await Counter.findByIdAndUpdate(
    id,
    {
      ticket_id: ticket[0]._id,
      customer_status: 1,
      current_serving: servin_num + 1,
    },
    { new: true }
  );
  const counters = await Counter.find();
  res
    .status(200)
    .json({ serving: newCounter.current_serving, counters: counters });
};

exports.updateStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    var counters;

    var newCounter = await Counter.findById(id);
    if (status && newCounter.current_serving !== 0) {
      newCounter = await Counter.findByIdAndUpdate(
        id,
        { manager_status: status, customer_status: 2 },
        { new: true }
      );
      counters = await Counter.find();
      return res.status(200).json(counters);
    }
    newCounter = await Counter.findByIdAndUpdate(
      id,
      { manager_status: status, customer_status: status },
      { new: true }
    );
    counters = await Counter.find();
    res.status(200).json(counters);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.completeCurrent = async (req, res) => {
  const { id } = req.body;
  const counter = await Counter.findById(id);
  const newTicket = await Ticket.findByIdAndUpdate(
    counter.ticket_id,
    {
      status: 2,
    },
    { new: true } //to return the new document
  );

  const newCounter = await Counter.findByIdAndUpdate(
    id,
    {
      manager_status: 0,
      customer_status: 0,
      current_serving: 0,
      ticket_id: null,
    },
    { new: true }
  );
  const counters = await Counter.find();

  res.status(200).json(counters);
};

exports.getAllCounters = async (req, res) => {
  const tickets = await Ticket.find({}).distinct("_id");
  const counters = await Counter.find({}).populate({
    path: "ticket_id",
    match: "status",
  });
  const stringsArray = tickets.map((x) => x.toString());

  var data = counters.map(function (value) {
    return {
      _id: value._id,
      manager_status: value.manager_status,
      customer_status: value.customer_status,
      current_serving:
        value.ticket_id !== undefined && value?.ticket_id?.status !== 2
          ? stringsArray.indexOf(value?.ticket_id?._id.toString()) + 1
          : 0,
    };
  });
  res.status(200).json(data);
};

exports.currentserving = async (req, res) => {
  const ticket = await (await Ticket.find({ status: 1 })).splice(-1);
  if (ticket.length === 0) {
    res.status(200).json(0);
    return;
  }
  const tickets = await Ticket.find({}).distinct("_id");
  const stringsArray = tickets.map((x) => x.toString());
  const servin_num = stringsArray.indexOf(ticket[0]._id.toString());
  res.status(200).json(servin_num !== 0 ? servin_num + 1 : servin_num);
};
