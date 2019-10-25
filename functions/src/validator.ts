// interface for validator configuration
interface validationConfig {
	variableName: string; // name of variable in http request
	displayName: string; // what the variable should be reffered to as in errors
	minLength: number; // minimum length of the value
	maxLength: number; // maximum length of the value
}

interface Language {
	variableMissing: string;
	mustBeMaximum: string;
	mustBeMinimum: string;
	symbols: string;
}

// Validator class, handles http request body validation
export class Validator {
	private configs: validationConfig[]; // array for configs of each expected variable
	private body: any; // req.body
	public errors: string[]; // array of errors found in req.body
	private lang: Language;

	// constructor, takes an array of configs and a req.body
	constructor(configs: validationConfig[], req: any, lang: string = "ge") {
		if (lang === "en") {
			this.lang = {
				variableMissing: "Please enter",
				mustBeMaximum: "must be a maximum of",
				mustBeMinimum: "must be a minimum of",
				symbols: "letters"
			};
		} else {
			this.lang = {
				variableMissing: "გთხოვთ შეიყვანოთ",
				mustBeMaximum: "უნდა იყოს მაქსიმუმ",
				mustBeMinimum: "უნდა იყოს მინიმუმ",
				symbols: "სიმბოლო"
			};
		}
		this.configs = configs;
		this.errors = [];
		this.body = req.body;
	}

	// the validate method. First checks if all variables ar present, then checks their size
	// if this returns false, this.errors.length > 0
	public validate(): boolean {
		return (
			typeof this.body === "object" &&
			this.checkExistence() &&
			this.checkLength()
		);
	}

	// check if all variables in the config exist
	private checkExistence(): boolean {
		for (const config of this.configs) {
			if (typeof this.body[config.variableName] === "undefined") {
				this.errors.push(this.lang.variableMissing + " " + config.displayName); // push to errors array
			}
		}
		return this.errors.length === 0;
	}

	// check lengths of all variables
	private checkLength(): boolean {
		for (const config of this.configs) {
			if (Array.isArray(this.body[config.variableName])) {
				this.body[config.variableName].map(value => {
					this.checkStringLength(config, value);
				});
			} else {
				this.checkStringLength(config, this.body[config.variableName]);
			}
		}
		return this.errors.length === 0;
	}

	private checkStringLength(config, value) {
		if (value.length > config.maxLength) {
			// check for max
			this.errors.push(
				config.displayName +
					" " +
					this.lang.mustBeMaximum +
					" " +
					config.maxLength +
					" " +
					this.lang.symbols +
					"."
			);
		}
		if (value.length < config.minLength) {
			// check for min
			this.errors.push(
				config.displayName +
					" " +
					this.lang.mustBeMaximum +
					" " +
					config.minLength +
					" " +
					this.lang.symbols +
					"."
			);
		}
	}
}
