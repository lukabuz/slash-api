import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import * as parser from "body-parser";
import { Validator } from "./validator";
import Data from "./data";
import Mailer from "./mailer";
import translations from "./translations";

const localizer = (str: string, lang = "ge"): string => {
	return translations[lang === "en" ? "en" : "ge"][str];
};

// middleware initialization
// _______________________________

// function for determining if a body is a json string
const isJsonString = (str: any): boolean => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

// middleware for parsing req.body
const parsingMiddleware = (req: any, res: any, next: any) => {
	if (isJsonString(req.body)) {
		req.body = JSON.parse(req.body);
	}
	next();
};

// express initialization
// _______________________________

// initialize express, set cors, and handle body parsing
const api = express();
api.use(cors({ origin: true }));
api.use(parser.urlencoded({ extended: false }));
api.use(parser.json());
api.use(parsingMiddleware);

// mailer initialization
// _______________________________

const mailer = new Mailer(
	functions.config().email.host,
	+functions.config().email.port,
	+functions.config().email.portt === 465,
	functions.config().email.auth,
	functions.config().email.pass
);

// database initialization
// _______________________________

admin.initializeApp();
const realtimeDatabase = admin.database();
const database = new Data(realtimeDatabase);

// routes
// _______________________________

// route for requesting a price quote from the website
api.post("/requestQuote", async (req: any, res: any) => {
	const lang = req.body.lang === "en" ? "en" : "ge";
	// initialize validator with the proper configs
	const validator = new Validator(
		[
			{
				variableName: "email",
				displayName: localizer("email", lang),
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "text",
				displayName: localizer("text", lang),
				minLength: 10,
				maxLength: 1000
			},
			{
				variableName: "siteType",
				displayName: localizer("siteType", lang),
				minLength: 1,
				maxLength: 100
			},
			{
				variableName: "companyName",
				displayName: localizer("companyName", lang),
				minLength: 1,
				maxLength: 100
			}
		],
		req,
		lang
	);

	// handle validator errors
	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	// prepare payload and send email
	const text = `From: ${req.body.email} --- Site Type: ${req.body.siteType} --- Company: ${req.body.companyName} --- Site Description ${req.body.text}`;

	mailer
		.send(functions.config().email.auth, text, req.body.email + " - Quote")
		.then((message: any) => {
			res.send({ status: "success", message: message });
		})
		.catch((e: any) => {
			res.send({ status: "error", errors: [e] });
		});
});

// route for handling the contact form
api.post("/createPortfolioItem", async (req: any, res: any) => {
	const lang = req.body.lang === "en" ? "en" : "ge";
	// initialize validator with the proper configs
	const validator = new Validator(
		[
			{
				variableName: "name",
				displayName: localizer("name", lang),
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "longDescription",
				displayName: localizer("longDescription", lang),
				minLength: 10,
				maxLength: 200000
			},
			{
				variableName: "shortDescription",
				displayName: localizer("shortDescription", lang),
				minLength: 10,
				maxLength: 200
			},
			{
				variableName: "logoImage",
				displayName: localizer("logoImage", lang),
				minLength: 10,
				maxLength: 200
			},
			{
				variableName: "thumbnailImage",
				displayName: localizer("thumbnailImage", lang),
				minLength: 10,
				maxLength: 200
			},
			{
				variableName: "images",
				displayName: localizer("images", lang),
				minLength: 10,
				maxLength: 200
			},
			{
				variableName: "adminPass",
				displayName: localizer("adminPass", lang),
				minLength: 1,
				maxLength: 200
			}
		],
		req,
		lang
	);

	// handle validation errors
	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	if (req.body.adminPass !== functions.config().email.auth) {
		res.json({ status: "error", errors: [localizer("", lang)] });
		return;
	}

	const uploaded = database.createPortfolioItem(
		req.body.name,
		req.body.shortDescription,
		req.body.longDescription,
		req.body.logoImage,
		req.body.thumbnailImage,
		req.body.stackImages || [],
		req.body.images,
		lang
	);
	if (uploaded) {
		res.json({ status: "success", message: "Files uploaded." });
	} else {
		res.json({ status: "error", errors: "Couldn't upload files." });
	}
});

// export express app as /api/ function
exports.api = functions.https.onRequest(api);
