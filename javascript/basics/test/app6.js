export default {
	vendorPlot: [],
	formatDisplayDate(inputDate) {
		if (!inputDate) return 'ไม่ระบุ';

		const date = new Date(inputDate);
		if (isNaN(date)) return 'วันที่ไม่ถูกต้อง';

		const today = new Date();

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	},

	async getGraph() {
		try {
			await vendorone.run()
			await getHistoryEvaluate_New.run()
			// const response = await evaluate_rate.run()
			// const response = await Vendorone_new.run()
			const response = await evaluate_rate_Old.run()

			const mappedData = response
			.filter(item => item.avg_score !== null && item.avg_score !== undefined)
			.map((item) => ({
				x: this.formatDisplayDate(item.ranking_updated_at) + ' (' + item.ranking_updated_by + ')',
				y: parseInt(item.avg_score.split("%")[0])
				// y: item.project_avg_score
			}))

			this.vendorPlot = mappedData;
			return mappedData
		}	catch (error) {
			// console.log(error)
			return [];
		}
	}
}