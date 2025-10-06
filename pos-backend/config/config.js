require("dotenv").config();

const config = Object.freeze({
  port: process.env.PORT || 8000,
  databaseURI: process.env.MONGODB_URI || "mongodb+srv://camilovelez4_db_user:WlxMvDprNmcGihxH@clustervz.7qcgdxb.mongodb.net/pos-db?retryWrites=true&w=majority&appName=ClusterVz",
  nodeEnv: process.env.NODE_ENV || "development",
  accessTokenSecret: process.env.JWT_SECRET,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpaySecretKey: process.env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
});

module.exports = config;
