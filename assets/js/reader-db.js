let basedbUrl = "https://altscans-api.netlify.app";
let series =  axios.get(`${basedbUrl}/api/admin/getSeries`, {
	mangaId: "31868",
	seriesName: "hclw",
	chapterNo: "69"
  }
).then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(`error: `, error);
  });

console.log(series);
