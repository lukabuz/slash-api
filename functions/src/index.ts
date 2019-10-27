import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import * as parser from "body-parser";
import * as nodemailer from "nodemailer";
import { Validator } from "./validator";
import Data from "./data";

const localizer = (str: string, lang = "ge"): string => {
	const language = lang === "ge" ? "ge" : "en";
	const translations = {
		en: {
			email: "email",
			text: "main text",
			siteType: "website type",
			companyName: "company name",
			subject: "subject",
			name: "name",
			longDescription: "long description",
			shortDescription: "short description",
			logoImage: "logo image",
			thumbnailImage: "thumbnail image",
			images: "images",
			adminPass: "administrator password"
		},
		ge: {
			email: "მეილი",
			text: "მთავარი ტექსტი",
			siteType: "საიტის ტიპი",
			companyName: "კომპანიის სახელი",
			subject: "სათაური",
			name: "სახელი",
			longDescription: "ვრცელი აღწერა",
			shortDescription: "მოკლე აღწერა",
			logoImage: "ლოგოს სურათი",
			thumbnailImage: "პატარა სურათი",
			images: "სურათები",
			adminPass: "ადმინისტრატორის პაროლი"
		}
	};

	return translations[language][str];
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

// mailer class definition
// _______________________________
class Mailer {
	private transporter: any; // nodemailer transporter object
	private user: string; // username(example@example.org) of sending account

	// constructor, requires mail account info from config
	constructor(
		host: string,
		port: number,
		secure: boolean,
		user: string,
		pass: string
	) {
		this.user = user;

		this.transporter = nodemailer.createTransport({
			// create transporter and save it
			host: host,
			port: port,
			secure: secure,
			auth: {
				user: user,
				pass: pass
			}
		});
	}

	// sending function. resolves or rejects with a string return value
	async send(to: string, body: string, subject: string) {
		return new Promise((resolve: any, reject: any) => {
			this.transporter
				.sendMail({
					from: '"Slash" <' + this.user + ">", // from
					to: to, // to
					subject: subject, // subject
					text: body, // plaintext email
					html: body // html email
				})
				.then((res: any) => {
					console.log(res);
					resolve("მეილი გაგზავნილია! ჩვენი გუნდი მალე დაგეკონტაქტებათ.");
				})
				.catch((e: any) => {
					console.log(e);
					reject("ვერ მოხდა მეილის გაგზავნა, გთხოვთ ცადოთ ხელახლა");
				});
		});
	}
}

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

const mailConfig = {
	host: functions.config().email.host,
	port: +functions.config().email.port, //typecast to number
	secure: +functions.config().email.port === 465, // only true if port is 465
	auth: {
		user: functions.config().email.auth,
		pass: functions.config().email.pass
	}
};

const mailer = new Mailer(
	mailConfig.host,
	+mailConfig.port,
	+mailConfig.port === 465,
	mailConfig.auth.user,
	mailConfig.auth.pass
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
api.post("/contact", async (req: any, res: any) => {
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
				variableName: "subject",
				displayName: localizer("subject", lang),
				minLength: 1,
				maxLength: 100
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

	// prepare payload and send email
	const text = "From: " + req.body.email + "\n" + req.body.text;

	mailer
		.send(
			functions.config().email.auth,
			text,
			`${req.body.email} - ${req.body.subject}`
		)
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
		res.json({ status: "error", errors: ["wrong administrator password"] });
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
