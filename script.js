/* DOKUWIKI:include js/readthedokus.js */

var dokus;
document.addEventListener("DOMContentLoaded", function() {
	dokus = new ReadtheDokus();
	dokus.run();
});
