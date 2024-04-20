/* DOKUWIKI:include js/readthedokus.js */

var dokus;
document.addEventListener("DOMContentLoaded", function() {
	dokus = new ReadtheDokus();

	if (jQuery(".indexmenu_js2").length > 0) {
		/* With Indexmenu(fancytree) */
		var selector =".aside > #sidebar .indexmenu_js2 a[data-wiki-id]";
		jQuery(".indexmenu_js2").on("fancytreeinit", (e) =>{
			dokus.run({"linkSelector":selector});
			// Workaround
			setTimeout(() => document.styleSheets.item(0).insertRule("#dokuwiki__aside #sidebar .indexmenu_js2 ul.fancytree-container li {white-space:nowrap}", 0));
		});
		jQuery(".indexmenu_js2").on("fancytreeexpand", (e) =>{
			dokus.refreshPageLinks(selector);
		});
	} else {
		/* Without Indexmenu */
		if (document.body.id === "dokuwiki__top") {
			dokus.run();
		}
	}
});
