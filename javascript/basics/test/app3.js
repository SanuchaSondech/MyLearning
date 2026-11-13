export default {
	questions: {},

	async transformApiToQuizFormat(apiData) {
		if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
			return {
				questions: [],
				currentAnswer: null,
				allAnswers: {},
				userRemark: "",
				score: null,
				isCompleted: false,
				progress: null
			};
		}

		const questions = apiData
		.filter(item => item.active_flag === 1)
		.map(item => ({
			id: item.id,
			question: item.name || 'No question text',
			options: [
				{ value: "best", label: item.best || 'Best option' },
				{ value: "medium", label: item.medium || 'Medium option' },
				{ value: "bad", label: item.bad || 'Bad option' }
			]
		}));

		return {
			questions,
			currentAnswer: null,
			allAnswers: {},
			userRemark: "",
			score: null,
			isCompleted: false,
			progress: apiData[0]?.project_progress || null
		};
	},

	async getTopic() {
		try {

			const response = await Evaluate_Question.run();
			const lastres = await LastEval.run();

			let mappedData;

			if (Array.isArray(lastres) && lastres.length > 0) {
				const isCompleted = lastres.every(item => item.value !== null && item.value !== undefined);

				if (isCompleted) {
					// ถ้าครบ ให้ใช้ response ของคำถามปัจจุบัน
					mappedData = await this.transformApiToQuizFormat(response);
					mappedData.isCompleted = true;
					mappedData.userRemark = lastres?.[0]?.remark || "";
					// console.log('All answers complete, using current questions:', mappedData);
				} else {
					// ถ้ายังไม่ครบ ให้ใช้ lastres
					mappedData = await this.transformApiToQuizFormat(response);
					mappedData.questions = mappedData.questions.map(q => {
						const found = lastres.find(item => item.id === q.id);
						let defaultValue = null;

						if (found && found.value !== undefined && found.value !== null) {
							switch (found.value) {
								case 10: defaultValue = "best"; break;
								case 5:  defaultValue = "medium"; break;
								case 0:  defaultValue = "bad"; break;
							}
						}

						return {
							...q,
							defaultValue
						};
					});

					mappedData.userRemark = lastres?.[0]?.remark || "";
					mappedData.isCompleted = false;
					// console.log('Incomplete last answers, merged with current questions:', mappedData);
				}
			} else {
				// กรณีไม่มี lastres
				mappedData = await this.transformApiToQuizFormat(response);
				// console.log('No last answers, using fresh questions:', mappedData);
			}

			this.questions = mappedData;
			return mappedData;

		} catch (err) {
			console.error("Error", err);
		}
	}
};
