import { Router } from "express";
import UserManager from "../controllers/user.manager.mdb.js";

const router = Router();
const controller = new UserManager();

router.get("/", async (req, res) => {
  try {
    const users = await controller.getUsers();
    res.status(200).send({ status: "OK", data: users });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/paginated", async (req, res) => {
  try {
    const users = await controller.getUsersPaginated();
    res.status(200).send({ status: "OK", data: users });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

export default router;
