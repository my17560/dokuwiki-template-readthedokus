/* DOKUWIKI:include js/readthedokus.js */

var dokus;
document.addEventListener("DOMContentLoaded", function() {
	if (document.body.id === "dokuwiki__top") {
		dokus = new ReadtheDokus();
		dokus.run();
	}
});
