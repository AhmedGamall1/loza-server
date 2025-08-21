// import { Event } from "../models/event.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
// import {
//   sendEmailToAdminsAndOwners,
//   sendEmailToUser,
// } from "../services/email.service.js";
// import {
//   updateOrderDeliveredStatus,
//   updateOrderCancelledStatus,
//   updateOrderShippedStatus,
// } from "../services/order.service.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { userInfo: user } = req.body;
    const { products } = req;

    const order = await Order.create(req.body);

    await Promise.all(products.map((product) => product.save()));

    res.status(201).json({ message: "Order created successfully" });

    // // SEND EMAIL TO ADMINS & OWNERS
    // const Admindata = { user, orderNumber: order.orderNumber };

    // await sendEmailToAdminsAndOwners("Order Created", Admindata);

    // // SEND EMAIL TO USER
    // const userData = { user, orderNumber: order.orderNumber };

    // await sendEmailToUser("Order Confirmed", userData);

    // // ADD USER TO ENTER EVENT DRAW
    // const event = await Event.findOne({ eventStatus: "Live" });
    // if (event) {
    //   event.usersList.push(user);
    //   await event.save();
    // }
  } catch (error) {
    console.log("order controller error (createOrder) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
