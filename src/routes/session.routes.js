import { Router } from "express";

const router = Router();

const auth = (req, res, next) => {
  try {
    if (req.session.user) {
      if (req.session.user.admin === true) {
        next();
      } else {
        res.status(403).send({ status: "ERR", data: "Usuario no admin" });
      }
    } else {
      res.status(401).send({ status: "ERR", data: "Usuario no autorizado" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
};

router.get("/", async (req, res) => {
  try {
    if (req.session.visits) {
      req.session.visits++;
      res.status(200).send({
        status: "OK",
        data: "Cantidad de visitas:${req.session.visits}",
      });
    } else {
      req.session.visits = 1;
      res.status(200).send({ status: "OK", data: "Bienvenido al site" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ status: "ERR", data: err.message });
      } else {
        res.status(200).send({ status: "OK", data: "Sesión finalizada" });
      }
    });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/admin", auth, async (req, res) => {
  try {
    res
      .status(200)
      .send({ status: "OK", data: "Estos son los datos privados" });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user, pass } = req.body;

    if (user === "davidh" && pass === "abc123") {
      req.session.user = { username: user, admin: true };
      res.status(200).send({ status: "OK", data: "Sesión iniciada" });
    } else {
      res.status(401).send({ status: "ERR", data: "Datos no válidos" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.post("/register", async (req, res) => {});

export default router;
