export default class Database {
	private ref: any;

	constructor(db: any) {
		this.ref = db.ref();
	}

	createPortfolioItem(
		name: string,
		shortDescription: string,
		longDescription: string,
		logoImage: string,
		thumbnailImage: string,
		stackImages: string[],
		images: string[],
		lang = "ge"
	): boolean {
		try {
			const stack = this.arrayToDictionary(stackImages);
			const mainImages = this.arrayToDictionary(images);
			const langRef = lang !== "ge" ? "en" : "ge";

			this.ref
				.child("portfolio_items")
				.child(langRef)
				.child(name)
				.set({
					name: name,
					shortDescription: shortDescription,
					longDescription: longDescription,
					logoImage: logoImage,
					thumbnailImage: thumbnailImage,
					stackImages: stack,
					images: mainImages
				});
		} catch (e) {
			return false;
		}
		return true;
	}

	arrayToDictionary(array: any) {
		const result = {};
		for (let i = 0; i < array.length; i++) {
			result[i.toString()] = array[i];
		}
		return result;
	}
}
