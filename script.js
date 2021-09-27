/* DOKUWIKI:include js/readthedokus.js */

var dokus;
document.addEventListener("DOMContentLoaded", () => {
	dokus = new ReadtheDokus();
	dokus.run();
});
