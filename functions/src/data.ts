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
		images: string[]
	): boolean {
		try {
			const stack = this.arrayToDictionary(stackImages);
			const mainImages = this.arrayToDictionary(images);
			this.ref
				.child("portfolio_items")
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
		let i = 0;
		let result = {};
		for (i; i < array.length; i++) {
			result[i.toString()] = array[i];
		}
		return result;
	}

	// getUserInfo(username: string) {
	// 	return new Promise((resolve: any, reject: any) => {
	// 		this.ref
	// 			.child("users")
	// 			.child(username)
	// 			.on("value", function(snapshot: any) {
	// 				const user = snapshot.val();
	// 				if (user === null) {
	// 					reject(new Error("User does not exist."));
	// 				}
	// 				resolve(user);
	// 			});
	// 	});
	// }
}
