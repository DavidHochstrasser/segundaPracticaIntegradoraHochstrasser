import { Router } from "express";
import uploader from "../uploader.js";
import ProductManager from "../controllers/product.manager.mdb.js";

const router = Router();
const manager = new ProductManager();

// router.get("/", async (req, res) => {
//   const products = await manager.getProducts();
//   res.status(200).send({ status: "OK", data: products });
// });

// router.get("/model", async (req, res) => {
//   const products = await manager.getProductsAggregate(req.query.code);
//   res.status(200).send({ status: "OK", data: products });
// });

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const code = req.query.code;
    if (code) {
      const data = await manager.getProductsPaginated(page, limit, code);
      res.status(200).send({ status: "OK", data: data });
    } else {
      const products = await manager.getProducts();
      res.status(200).send({ status: "OK", data: products });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const data = await manager.getProductsPaginated(
//       req.query.page || 1,
//       req.query.limit || 10,
//       req.query.code
//     );
//     res.status(200).send({ status: "OK", data: data });
//   } catch (err) {
//     res.status(500).send({ status: "ERR", data: err.message });
//   }
// });

// router.post("/", async (req, res) => {
//   let newProduct = req.body;
//   res.send(await manager.addProduct(newProduct));
// });

router.post("/", uploader.single("thumbnail"), async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .send({ status: "FIL", data: "No se pudo subir el archivo" });

  const { title, description, price, code, stock } = req.body;
  if (!title || !description || !price || !code || !stock) {
    return res
      .status(400)
      .send({ status: "ERR", data: "Faltan campos obligatorios" });
  }
  const newContent = {
    title,
    description,
    price,
    thumbnail: req.file.filename,
    code,
    stock,
  };
  const result = await manager.addProduct(newContent);
  res.status(200).send({ status: "OK", data: result });
});

export default router;
