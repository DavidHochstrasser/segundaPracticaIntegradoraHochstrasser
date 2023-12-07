import { Router } from "express";
import { CartManager } from "../controllers/cart.manager.mdb.js";

const router = Router();
const manager = new CartManager();

router.get("/", async (req, res) => {
  try {
    res.status(200).send({ status: "OK", data: await manager.getCarts() });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cid = req.query;
  const pid = req.query;
  const deleteProductInCart = await manager.getCartAndDeleteProduct(cid, pid);

  res.status(200).send({ status: "OK", data: deleteProductInCart });
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cid = req.params;
  const pid = req.params;
  const productUpdateInCart = await manager.updateCart(cid, pid);
  res.status(200).send({ status: "OK", data: productUpdateInCart });
});

router.delete("/cid", async (req, res) => {
  const cid = req.query.cid;

  try {
    const deleteCart = await manager.deleteCart(cid);
    res.status(200).send({ status: "OK", data: deleteCart });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.put("/:cid", async (req, res) => {
  const cid = req.params;
  const newContent = req.params;

  const data = await manager.updateCart(cid, newContent);
  res.status(200).send({ status: "OK", data: data });
});

export default router;
