const express = require("express");

const {
    body,
    validationResult
} = require("express-validator");

const {
    register,
    login,
    getProfile
} = require("../controllers/authController");

const authenticateToken =
    require("../middleware/authMiddleware");


const router =
    express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post(

    "/register",

    [

        body("name")
            .trim()
            .notEmpty()
            .withMessage(
                "Name is required"
            )
            .isLength({
                min: 2,
                max: 100
            })
            .withMessage(
                "Name must be between 2 and 100 characters"
            ),


        body("email")
            .trim()
            .isEmail()
            .withMessage(
                "Please provide a valid email"
            ),


        body("password")
            .isLength({
                min: 8
            })
            .withMessage(
                "Password must be at least 8 characters"
            )

    ],


    (req, res, next) => {

        const errors =
            validationResult(req);


        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                errors:
                    errors.array()

            });
        }


        next();

    },


    register

);


// ==========================================
// LOGIN
// ==========================================

router.post(

    "/login",

    [

        body("email")
            .trim()
            .isEmail()
            .withMessage(
                "Please provide a valid email"
            ),


        body("password")
            .notEmpty()
            .withMessage(
                "Password is required"
            )

    ],


    (req, res, next) => {

        const errors =
            validationResult(req);


        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                errors:
                    errors.array()

            });
        }


        next();

    },


    login

);


// ==========================================
// PROFILE
// ==========================================

router.get(

    "/profile",

    authenticateToken,

    getProfile

);


module.exports =
    router;