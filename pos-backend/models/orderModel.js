const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // Cliente puede ser registrado o walk-in
  customer: {
    // Si es cliente registrado
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    },
    // Datos básicos (siempre se llenan)
    name: { type: String, required: true },
    phone: { type: String, required: true },
    guests: { type: Number, required: true }
  },
  
  orderStatus: {
    type: String,
    enum: ["PENDIENTE", "EN_PREPARACION", "LISTO", "ENTREGADO", "PAGADO", "CANCELADO"],
    required: true,
    default: "PENDIENTE"
  },
  
  orderDate: {
    type: Date,
    default: Date.now
  },
  
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    code: String,
    taxRate: { type: Number, default: 19 },
    notes: String
  }],
  
  bills: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  
  table: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Table" 
  },
  
  paymentStatus: {
    type: String,
    enum: ["PENDIENTE", "PAGADO", "PARCIAL"],
    default: "PENDIENTE"
  },
  
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice"
  },
  
  waiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
  notes: String
  
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);