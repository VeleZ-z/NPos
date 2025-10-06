const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // Emisor (tu restaurante)
  issuer: {
    businessName: { type: String, required: true },
    nit: { type: String, required: true },
    address: { type: String, required: true },
    phone: String,
    email: String
  },

  // Cliente (puede ser registrado o walk-in)
  customer: {
    // Si es cliente registrado, guarda la referencia
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    },
    // Si no está registrado, guarda los datos directamente
    name: { 
      type: String, 
      default: "CONSUMIDOR FINAL" 
    },
    nit: { 
      type: String, 
      default: "222222222222"
    },
    address: String,
    phone: String,
    email: String
  },

  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now
  },

  paymentType: {
    type: String,
    enum: ["CONTADO", "CREDITO"],
    required: true,
    default: "CONTADO"
  },

  paymentMethod: {
    type: String,
    enum: ["EFECTIVO", "TARJETA_DEBITO", "TARJETA_CREDITO", "TRANSFERENCIA", "OTRO"],
    required: true
  },

  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    code: String,
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 }
  }],

  totals: {
    subtotal: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    total: { type: Number, required: true }
  },

  electronic: {
    isElectronic: { type: Boolean, default: false },
    cufe: String,
    qrCode: String,
    digitalSignature: String,
    dianResolution: String,
    technicalKey: String
  },

  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order",
    required: true 
  },

  processedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },

  status: {
    type: String,
    enum: ["EMITIDA", "ANULADA", "NOTA_CREDITO"],
    default: "EMITIDA"
  },

  notes: String

}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);