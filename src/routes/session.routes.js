import { Router } from "express";
import usersModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import initPassport from "../config/passport.config.js";

initPassport();
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

router.get("/hash/:pass", async (req, res) => {
  res.status(200).send({ status: "OK", data: createHash(req.params.pass) });
});

router.get(
  "/github",
  passport.authenticate("githubAuth", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("githubAuth", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = { username: req.user.email, admin: true };
    // req.session.user = req.user
    res.redirect("/profile");
  }
);

//davidh_42@hotmail.com
//abc123

router.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;

    const userInDb = await usersModel.findOne({ email: email });

    if (userInDb !== null) {
      if (isValidPassword(userInDb, pass)) {
        req.session.user = { username: email, admin: true };
        res.redirect("/profile");
      }
    } else {
      res.status(401).send({ status: "ERR", data: "Datos no válidos" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.post(
  "/register",
  passport.authenticate("registerAuth", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    try {
      res.status(200).send({ status: "OK", data: "Usuario registrado" });
    } catch (err) {
      res.status(500).send({ status: "ERR", data: err.message });
    }
  }
);

export default router;
