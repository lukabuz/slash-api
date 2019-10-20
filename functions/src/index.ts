import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";
import * as express from "express";
import * as cors from "cors";
import * as parser from "body-parser";
// import { app } from "firebase-admin";

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

// interface for validator configuration
interface validationConfig {
	variableName: string; // name of variable in http request
	displayName: string; // what the variable should be reffered to as in errors
	minLength: number; // minimum length of the value
	maxLength: number; // maximum length of the value
}

// Validator class, handles http request body validation
class Validator {
	private configs: validationConfig[]; // array for configs of each expected variable
	private body: any; // req.body
	public errors: string[]; // array of errors found in req.body

	// constructor, takes an array of configs and a req.body
	constructor(configs: validationConfig[], body: any) {
		this.configs = configs;
		this.errors = [];
		this.body = body;
	}

	// the validate method. First checks if all variables ar present, then checks their size
	// if this returns false, this.errors.length > 0
	public validate(): boolean {
		return this.checkExistence() && this.checkLength();
	}

	// check if all variables in the config exist
	private checkExistence(): boolean {
		for (const config of this.configs) {
			if (typeof this.body[config.variableName] === "undefined") {
				this.errors.push("გთხოვთ შეიყვანოთ " + config.displayName); // push to errors array
			}
		}
		return this.errors.length === 0;
	}

	// check lengths of all variables
	private checkLength(): boolean {
		for (const config of this.configs) {
			if (this.body[config.variableName].length > config.maxLength) {
				// check for max
				this.errors.push(
					config.displayName +
						" უნდა იყოს მაქსიმუმ " +
						config.maxLength +
						" სიმბოლო"
				);
			}
			if (this.body[config.variableName].length < config.minLength) {
				// check for min
				this.errors.push(
					config.displayName +
						" უნდა იყოს მინიმუმ " +
						config.minLength +
						" სიმბოლო"
				);
			}
		}
		return this.errors.length === 0;
	}
}

// Mailer class, handles email sending
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

// initialize express, set cors, and handle body parsing
const api = express();
api.use(cors({ origin: true }));
api.use(parser.urlencoded({ extended: false }));
api.use(parser.json());
api.use(parsingMiddleware);

// email account configuration from firebase
const mailConfig = {
	host: functions.config().email.host,
	port: +functions.config().email.port, //typecast to number
	secure: +functions.config().email.port === 465, // only true if port is 465
	auth: {
		user: functions.config().email.auth,
		pass: functions.config().email.pass
	}
};

//initialize mailer
const mailer = new Mailer(
	mailConfig.host,
	mailConfig.port,
	mailConfig.secure,
	mailConfig.auth.user,
	mailConfig.auth.pass
);

// route for requesting a price quote from the website
api.post("/requestQuote", async (req: any, res: any) => {
	// initialize validator with the proper configs
	const validator = new Validator(
		[
			{
				variableName: "email",
				displayName: "მეილი",
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "text",
				displayName: "ტექსტი",
				minLength: 10,
				maxLength: 1000
			}
		],
		req.body
	);

	// handle validator errors
	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	// prepare payload and send email
	const text = "From: " + req.body.email + "\n" + req.body.text;

	mailer
		.send(mailConfig.auth.user, text, req.body.email + " - Quote")
		.then((message: any) => {
			res.send(JSON.stringify({ status: "success", message: message }));
		})
		.catch((e: any) => {
			res.send(JSON.stringify({ status: "error", errors: [e] }));
		});
});

// route for handling the contact form
api.post("/contact", async (req: any, res: any) => {
	// initialize validator with the proper configs
	const validator = new Validator(
		[
			{
				variableName: "email",
				displayName: "მეილი",
				minLength: 1,
				maxLength: 50
			},
			{
				variableName: "text",
				displayName: "ტექსტი",
				minLength: 10,
				maxLength: 1000
			}
		],
		req.body
	);

	// handle validation errors
	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

	// prepare payload and send email
	const text = "From: " + req.body.email + "\n" + req.body.text;

	mailer
		.send(mailConfig.auth.user, text, req.body.email + " - Contact")
		.then((message: any) => {
			res.send(JSON.stringify({ status: "success", message: message }));
		})
		.catch((e: any) => {
			res.send(JSON.stringify({ status: "error", errors: [e] }));
		});
});

// export express app as /api/ function
exports.api = functions.https.onRequest(api);
