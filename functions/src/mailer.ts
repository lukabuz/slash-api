import * as nodemailer from "nodemailer";

// mailer class definition
// _______________________________
export default class Mailer {
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
