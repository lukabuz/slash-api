import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";
import * as express from "express";
import * as cors from "cors";
import * as parser from "body-parser";
// import { app } from "firebase-admin";

const isJsonString = (str: any): boolean => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

const parsingMiddleware = (req: any, res: any, next: any) => {
	if (isJsonString(req.body)) {
		req.body = JSON.parse(req.body);
	}
	next();
};

interface validationConfig {
	variableName: string;
	displayName: string;
	minLength: number;
	maxLength: number;
}

class Validator {
	private configs: validationConfig[];
	private body: any;
	public errors: string[];

	constructor(configs: validationConfig[], body: any) {
		this.configs = configs;
		this.errors = [];
		this.body = body;
	}

	public validate(): boolean {
		if (this.checkExistence()) {
			return this.checkLength();
		} else {
			return false;
		}
	}

	private checkExistence(): boolean {
		for (const config of this.configs) {
			if (typeof this.body[config.variableName] === "undefined") {
				this.errors.push("გთხოვთ შეიყვანოთ " + config.displayName);
			}
		}
		return this.errors.length === 0;
	}

	private checkLength(): boolean {
		for (const config of this.configs) {
			if (this.body[config.variableName].length > config.maxLength) {
				this.errors.push(
					config.displayName +
						" უნდა იყოს მაქსიმუმ " +
						config.maxLength +
						" სიმბოლო"
				);
			}
			if (this.body[config.variableName].length < config.minLength) {
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

class Mailer {
	private transporter: any;
	private user: string;

	constructor(
		host: string,
		port: number,
		secure: boolean,
		user: string,
		pass: string
	) {
		this.user = user;

		this.transporter = nodemailer.createTransport({
			host: host,
			port: port,
			secure: secure,
			auth: {
				user: user,
				pass: pass
			}
		});
	}

	async send(to: string, body: string, subject: string) {
		return new Promise((resolve: any, reject: any) => {
			this.transporter
				.sendMail({
					from: '"Slash" <' + this.user + ">", // sender address
					to: to, // list of receivers
					subject: subject, // Subject line
					text: body, // plain text body
					html: body // html body
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

const api = express();
api.use(cors({ origin: true }));
api.use(parser.urlencoded({ extended: false }));
api.use(parser.json());
api.use(parsingMiddleware);

const mailConfig = {
	host: functions.config().email.host,
	port: +functions.config().email.port,
	secure: +functions.config().email.port === 465,
	auth: {
		user: functions.config().email.auth,
		pass: functions.config().email.pass
	}
};

const mailer = new Mailer(
	mailConfig.host,
	mailConfig.port,
	mailConfig.secure,
	mailConfig.auth.user,
	mailConfig.auth.pass
);

api.post("/requestQuote", async (req: any, res: any) => {
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

	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

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

api.post("/contact", async (req: any, res: any) => {
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

	if (!validator.validate()) {
		res.json({ status: "error", errors: validator.errors });
		return;
	}

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

exports.api = functions.https.onRequest(api);
