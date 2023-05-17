import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./middleware/errorMiddleware.js";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import path from "path";
import flash from 'connect-flash';
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import * as IPFS from 'ipfs-http-client';

dotenv.config();

const app = express();
const ipfs = IPFS.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

app.use(cors());
app.use(flash());
app.use(fileUpload({
  useTempFiles: true,
}));

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/nft', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(con => {
  console.log('Db Connected.....')
}).catch(err => {
  console.log(err, '=========err=========')
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static(path.join(import.meta.url, 'frontend/build')));
app.use('/*', express.static(path.join(import.meta.url, 'frontend/build')));
app.use(express.static(path.join(import.meta.url, 'public')));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
});
app.use(limiter);

// Define NFT routes
import nftRoutes from "./Routes/nftRoute.js";
app.use("/nfts", nftRoutes);

app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(import.meta.url, "public", "index.html"));
});

export default app;