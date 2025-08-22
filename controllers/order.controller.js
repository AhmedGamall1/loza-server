import { Invoice } from "../models/invoice.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import PDFDocument from "pdfkit";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { userInfo: user } = req.body;
    const { products, totalPrice } = req;

    // create order
    const order = await Order.create({
      ...req.body,
      totalPrice,
    });

    await Promise.all(products.map((product) => product.save()));

    // Generate Invoice PDF in memory
    // const pdfBuffer = await new Promise((resolve, reject) => {
    //   const doc = new PDFDocument();
    //   const buffers = [];
    //   doc.on("data", buffers.push.bind(buffers));
    //   doc.on("end", () => resolve(Buffer.concat(buffers)));
    //   doc.on("error", reject);

    //   // PDF content
    //   doc.fontSize(20).text("Invoice", { align: "center" }).moveDown();
    //   doc.fontSize(12).text(`Invoice Number: ${order.orderNumber}`);
    //   doc.text(`Order ID: ${order._id}`);
    //   doc.text(`Order Status: ${order.orderStatus}`);
    //   doc
    //     .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
    //     .moveDown();

    //   doc.text("Customer Information:", { underline: true });
    //   doc.text(`${user.firstName} ${user.lastName}`);
    //   doc.text(user.email);
    //   doc.text(user.phone).moveDown();

    //   doc.text("Shipping Address:", { underline: true });
    //   doc.text(`${shippingAddress.address}`);
    //   doc
    //     .text(`${shippingAddress.city}, ${shippingAddress.postalCode}`)
    //     .moveDown();

    //   doc.text("Order Items:", { underline: true });
    //   orderItems.forEach((item, idx) => {
    //     doc.text(
    //       `${idx + 1}. Product ID: ${item.id} | Size: ${item.size} | Qty: ${
    //         item.quantity
    //       }`
    //     );
    //   });
    //   doc.moveDown();

    //   doc.text(`Total Price: $${order.totalPrice}`);
    //   doc.moveDown();

    //   doc.text(`Payment: ${paymentMethod.type} (${paymentMethod.status})`);

    //   doc.end();
    // });

    // // Save Invoice to DB
    // const invoice = await Invoice.create({
    //   orderId: order._id,
    //   userId: user.userId,
    //   pdf: pdfBuffer,
    // });

    // // Link invoiceId to order
    // order.invoiceId = invoice._id;
    // await order.save();

    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.log("order controller error (createOrder) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
