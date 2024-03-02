/* DOKUWIKI:include js/readthedokus.js */

var dokus;
document.addEventListener("DOMContentLoaded", function() {
	dokus = new ReadtheDokus();

	if (jQuery(".indexmenu_js2").length > 0) {
		/* With Indexmenu(fancytree) */
		var selector =".aside > #sidebar .indexmenu_js2 a[data-wiki-id]";
		jQuery(".indexmenu_js2").on("fancytreeinit", (e) =>{
			dokus.run({"linkSelector":selector});
		});
		jQuery(".indexmenu_js2").on("fancytreeexpand", (e) =>{
			dokus.run({"linkSelector":selector});
		});
	} else {
		/* Without Indexmenu */
		if (document.body.id === "dokuwiki__top") {
			dokus.run();
		}
	}
});
