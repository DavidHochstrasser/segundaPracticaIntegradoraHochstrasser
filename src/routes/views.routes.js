import { Router } from "express";
import ProductManager from "../controllers/product.manager.mdb.js";
import { CartManager } from "../controllers/cart.manager.mdb.js";

const router = Router();
const manager = new ProductManager();
const manager1 = new CartManager();

router.get("/products", async (req, res) => {
  const products = await manager.getProducts();
  // console.log(products);
  res.render("products", {
    title: "Listado de Productos",
    products: products,
  });
});

router.get("/carts", async (req, res) => {
  const carts = await manager1.getCarts();
  console.log(carts);
  res.render("carts", {
    title: "Carrito",
    products: carts,
  });
});

export default router;
