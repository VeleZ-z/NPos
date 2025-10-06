const createHttpError = require("http-errors");
const Invoice = require("../models/invoiceModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

// Generar número consecutivo de factura
const generateInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
  
  if (!lastInvoice) {
    return "F-0001";
  }
  
  const lastNumber = parseInt(lastInvoice.invoiceNumber.split("-")[1]);
  const newNumber = (lastNumber + 1).toString().padStart(4, "0");
  return `F-${newNumber}`;
};

// Crear factura desde una orden
const createInvoice = async (req, res, next) => {
  try {
    const {
      orderId,
      customerData, // Opcional: { name, nit, address, phone, email }
      paymentType,
      paymentMethod,
      isElectronic,
      notes
    } = req.body;

    // Validaciones básicas
    if (!orderId || !paymentMethod) {
      return next(createHttpError(400, "Faltan campos requeridos"));
    }

    // Verificar orden
    const order = await Order.findById(orderId).populate("customer.user");
    if (!order) {
      return next(createHttpError(404, "Orden no encontrada"));
    }

    if (order.invoice) {
      return next(createHttpError(400, "Esta orden ya tiene factura"));
    }

    // Verificar permisos (solo cajeros y admin)
    if (req.user.role !== "Cashier" && req.user.role !== "Administrator") {
      return next(createHttpError(403, "Solo cajeros pueden generar facturas"));
    }

    // Generar número de factura
    const invoiceNumber = await generateInvoiceNumber();

    // Preparar datos del cliente
    let customerInfo = {
      name: "CONSUMIDOR FINAL",
      nit: "222222222222"
    };

    // Si la orden tiene cliente registrado
    if (order.customer.user) {
      const customerUser = order.customer.user;
      customerInfo = {
        user: customerUser._id,
        name: customerUser.customerData?.billingName || customerUser.name,
        nit: customerUser.customerData?.nit || "222222222222",
        address: customerUser.customerData?.address,
        phone: customerUser.phone,
        email: customerUser.email
      };
    } 
    // Si el cajero proporciona datos del cliente manualmente
    else if (customerData && customerData.name) {
      customerInfo = customerData;
    }
    // Si no, usar datos básicos de la orden
    else {
      customerInfo = {
        name: order.customer.name,
        phone: order.customer.phone,
        nit: "222222222222"
      };
    }

    // Preparar items de la factura
    const invoiceItems = order.items.map(item => {
      const subtotal = item.price * item.quantity;
      const taxAmount = (subtotal * (item.taxRate || 0)) / 100;
      
      return {
        description: item.name,
        quantity: item.quantity,
        code: item.code || "",
        unitPrice: item.price,
        subtotal: subtotal,
        taxRate: item.taxRate || 0,
        taxAmount: taxAmount
      };
    });

    // Crear factura
    const invoice = new Invoice({
      invoiceNumber,
      issuer: {
        businessName: process.env.BUSINESS_NAME || "Mi Restaurante",
        nit: process.env.BUSINESS_NIT || "900000000-0",
        address: process.env.BUSINESS_ADDRESS || "Dirección no configurada",
        phone: process.env.BUSINESS_PHONE,
        email: process.env.BUSINESS_EMAIL
      },
      customer: customerInfo,
      paymentType: paymentType || "CONTADO",
      paymentMethod,
      items: invoiceItems,
      totals: {
        subtotal: order.bills.subtotal,
        totalTax: order.bills.tax,
        total: order.bills.total
      },
      electronic: {
        isElectronic: isElectronic || false
      },
      order: orderId,
      processedBy: req.user._id,
      notes
    });

    await invoice.save();

    // Actualizar orden
    order.paymentStatus = "PAGADO";
    order.orderStatus = "PAGADO";
    order.invoice = invoice._id;
    await order.save();

    res.status(201).json({
      success: true,
      message: "Factura generada exitosamente",
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Obtener factura por ID
const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("order")
      .populate("processedBy", "name email role")
      .populate("customer.user", "name email phone customerData");

    if (!invoice) {
      return next(createHttpError(404, "Factura no encontrada"));
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

// Listar facturas con filtros
const getInvoices = async (req, res, next) => {
  try {
    const { startDate, endDate, customerNit, status, limit = 50 } = req.query;
    
    const filter = {};
    
    if (startDate && endDate) {
      filter.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (customerNit) {
      filter["customer.nit"] = customerNit;
    }
    
    if (status) {
      filter.status = status;
    }

    const invoices = await Invoice.find(filter)
      .populate("order", "customer orderDate")
      .populate("processedBy", "name")
      .sort({ invoiceDate: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

// Obtener facturas de un cliente (si está registrado)
const getCustomerInvoices = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    const invoices = await Invoice.find({ "customer.user": customerId })
      .populate("order")
      .sort({ invoiceDate: -1 });

    res.json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};

// Anular factura
const cancelInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return next(createHttpError(404, "Factura no encontrada"));
    }

    if (invoice.status === "ANULADA") {
      return next(createHttpError(400, "Factura ya está anulada"));
    }

    // Solo admin puede anular facturas
    if (req.user.role !== "Administrator") {
      return next(createHttpError(403, "Solo administradores pueden anular facturas"));
    }

    invoice.status = "ANULADA";
    await invoice.save();

    // Actualizar orden
    await Order.findByIdAndUpdate(invoice.order, {
      paymentStatus: "PENDIENTE",
      orderStatus: "ENTREGADO"
    });

    res.json({
      success: true,
      message: "Factura anulada exitosamente",
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoice,
  getInvoices,
  getCustomerInvoices,
  cancelInvoice
};