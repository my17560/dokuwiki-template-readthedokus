// -----------------------------------------------------------------------------
//  Constructor
// -----------------------------------------------------------------------------

/**
 * Constructor.
 */
function ReadtheDokus()
{

	this._pages;
	this._options;
	this._toc = document.getElementById("dw__toc");
	this._header = document.querySelector("header");
	this._sidebar = document.querySelector("#dokuwiki__aside");
	this._delimiter = ( window.location.search.indexOf(":") > -1 ? ":" : "/");

}

// -----------------------------------------------------------------------------
//  Methods
// -----------------------------------------------------------------------------

/**
 * Run the application.
 *
 * @param	{Object}		options				Options. Has following keys:
 * 												"selector": selector to the sidebar links.
 */
ReadtheDokus.prototype.run = function(options)
{

	this._options = options || {};

	// Init
	this._initToc(this._toc);
	this._initMobileHeader();
	var placeHolder = LANG.template.readthedokus.searchform_placeholder;
	if (placeHolder) {
		this._sidebar.querySelector("#sidebarheader #qsearch__in").setAttribute("placeholder", placeHolder);
	}
	document.body.setAttribute("data-contentlang", document.body.getAttribute("data-id").split(":")[0]);

	// Embed TOC
	var selector = options && options["linkSelector"] || "";
	this.embedTOC(selector);

	// Collect page links
	this.refreshPageLinks(selector);

	// Anchor jump
	if (document.location.hash)
	{
		var style;
		var hash = decodeURI(document.location.hash);
		var elem = document.querySelector(hash);
		if (elem)
		{
			// Hide the jump target element first to prevent the default scroll.
			style = elem.style.display;
			elem.style.display = "none";

			setTimeout(function(){
				elem.style.display = style;
				this._jumpToAnchor(hash);
			}.bind(this), 0);

			// Select the item in TOC
			var sidebarItem = document.querySelector("#sidebar #dw__toc a[href='" + hash + "']");
			if (sidebarItem)
			{
				this.expandParentTocMenu(sidebarItem);
				sidebarItem.click();
			}
		}
	}

};

// -----------------------------------------------------------------------------

/**
 * Embed the TOC in the sidebar. Replace an elmenent with the TOC.
 *
 * @param	{String}		selector			A selector to the sidebar links.
 */
ReadtheDokus.prototype.embedTOC = function(selector)
{

	var isFound = false;
	var sidebarItem;

	if (JSINFO["ACT"] == "show")
	{
		this._enumSidebarLinks(selector, function(elem) {
			// Embed TOC if the current page id matches to the sidebar link
			if (!isFound && (elem.getAttribute("data-wiki-id") === JSINFO["id"] || elem.getAttribute("data-wiki-id") === (JSINFO["id"] + ":")))
			{
				if (elem && this._toc)
				{
					// Embed
					elem.parentNode.appendChild(this._toc);
					elem.style.display = "none";
				}

				isFound = true;
				sidebarItem = elem;
			}
		}.bind(this));
	}

	// Show TOC on top of sidebar if matching item was not found in the sidebar
	if (!isFound && this._toc )
	{
		this._toc.parentNode.style.display = "block";
	}

	// Scroll the TOC to the top
	if (this._toc)
	{
		this._toc.scrollIntoView(true);
	}
	else if (sidebarItem)
	{
		sidebarItem.scrollIntoView(true);
	}

};

// -----------------------------------------------------------------------------

/**
 * Re-collect page links from the side bar and refresh next/prev buttons.
 *
 * @param	{String}		selector			A selector to the sidebar links.
 */
ReadtheDokus.prototype.refreshPageLinks = function(selector)
{

	this._pages = [];

	// Collect page links
	this._enumSidebarLinks(selector, function(elem) {
		this._pages.push(elem.href);
	}.bind(this));

	// Get start page
	if (this._pages.length > 0)
	{
		var startPage = this._getStartPage(this._pages[0], this._delimiter);
		this._pages.unshift(startPage);
		/*
		var list = document.querySelectorAll("#sidebarheader > div.home > a, #pageheader .breadcrumbs > .home > a");
		var nodes = Array.prototype.slice.call(list, 0);
		nodes.forEach(function(elem) {
			elem.href = this._startPage;
		}.bind(this));
		*/
	}

	// Init next/prev buttons
	this._initPageButtons();

};

// -----------------------------------------------------------------------------

/**
 * Return the media query value depending on the current screen size.
 *
 * @return  {String}		"pc" for PC, "tb" for Tablets, or "sp" for Smartphones.
 */
ReadtheDokus.prototype.getMediaQuery = function()
{

	return getComputedStyle(document.querySelector("#__media_query")).getPropertyValue("--media-query").trim() || getComputedStyle(document.querySelector("#__media_query"))["-media-query"].trim();

};

// -----------------------------------------------------------------------------

/**
 * Toggle a TOC menu item.
 *
 * @param	{HTMLElement}	elem				A TOC item element.
 */
ReadtheDokus.prototype.toggleTocMenu = function(elem)
{

	var invisible = elem.parentNode.querySelector(".toc").classList.contains("invisible");
	if (invisible)
	{
		this.expandTocMenu(elem);
	}
	else
	{
		this.collapseTocMenu(elem);
	}

};

// -----------------------------------------------------------------------------

/**
 * Expand a TOC menu item.
 *
 * @param	{HTMLElement}	elem				A toc item element.
 */
ReadtheDokus.prototype.expandTocMenu = function(elem)
{

	if (elem && elem.classList.contains("expandable"))
	{
		elem.parentNode.querySelector(".toc").classList.remove("invisible");

		var i = elem.children[0].children[0].children[0];
		i.classList.remove("fa-plus-square");
		i.classList.add("fa-minus-square");

		var img = elem.children[0].children[0].children[1];
		img.classList.remove("plus");
		img.classList.add("minus");
		img.src= DOKU_BASE + "lib/images/minus.gif";
	}

};

// -----------------------------------------------------------------------------

/**
 * Expand all the parent TOC menu of the specified element.
 *
 * @param	{HTMLElement}	elem				A toc item element.
 */
ReadtheDokus.prototype.expandParentTocMenu = function(elem)
{

	var p = elem.parentNode;
	while (p)
	{
		if (p.classList.contains("toc"))
		{
			if (p.previousElementSibling && p.previousElementSibling.classList.contains("expandable"))
			{
				this.expandTocMenu(p.previousElementSibling);
			}
		}

		if (p.id === "dw__toc")
		{
			break;
		}

		p = p.parentNode;
	}

};

// -----------------------------------------------------------------------------

/**
 * Collapse a TOC menu item.
 *
 * @param	{HTMLElement}	elem				A toc item element.
 */
ReadtheDokus.prototype.collapseTocMenu = function(elem)
{

	if (elem && elem.classList.contains("expandable"))
	{
		elem.parentNode.querySelector(".toc").classList.add("invisible");

		var i = elem.children[0].children[0].children[0];
		i.classList.remove("fa-minus-square");
		i.classList.add("fa-plus-square");

		var img = elem.children[0].children[0].children[1];
		img.classList.remove("minus");
		img.classList.add("plus");
		img.src=DOKU_BASE + "lib/images/plus.gif";
	}

};
// -----------------------------------------------------------------------------

/**
 * Toggle the sidebar.
 */
ReadtheDokus.prototype.toggleSidebar = function()
{

	var mq = this.getMediaQuery();
	if (mq == "pc" || mq == "tb")
	{
		document.querySelector("#dokuwiki__site").classList.toggle("showSidebar");
	}
	else
	{
		document.querySelector("#dokuwiki__site").classList.toggle("showSidebarSP");
	}

};

// -----------------------------------------------------------------------------

/**
 * Show the sidebar.
 */
ReadtheDokus.prototype.showSidebar = function()
{

	var mq = this.getMediaQuery();
	if (mq == "pc" || mq == "tb")
	{
		document.querySelector("#dokuwiki__site").classList.add("showSidebar");
	}
	else
	{
		document.querySelector("#dokuwiki__site").classList.add("showSidebarSP");
	}

};

// -----------------------------------------------------------------------------

/**
 * Hide the sidebar.
 */
ReadtheDokus.prototype.hideSidebar = function()
{

	if (dokus.getMediaQuery() == "pc" || dokus.getMediaQuery() == "tb")
	{
		document.querySelector("#dokuwiki__site").classList.remove("showSidebar");
	}
	else
	{
		document.querySelector("#dokuwiki__site").classList.remove("showSidebarSP");
	}

};

// -----------------------------------------------------------------------------
//  Privates
// -----------------------------------------------------------------------------

/**
 * Enumerates the sidebar links and call the callback function on each item.
 *
 * @param	{String}		selector			A selector to select link nodes.
 * @param	{Function}		callback			A callback function.
 */
ReadtheDokus.prototype._enumSidebarLinks = function(selector, callback)
{

	callback = ( typeof callback === "function" ? callback : function(){} );
	selector = selector || ".aside > #sidebar a[data-wiki-id]";
	var links = this._sidebar.querySelectorAll(selector);
	var nodes = Array.prototype.slice.call(links, 0);

	nodes.forEach(function(elem) {
		callback(elem);
	});

};
// -----------------------------------------------------------------------------

/**
 * Build and return the start page id.
 *
 * @param	{String}		basePage			A base page for the start page.
 * @param	{String}		delimiter			An id delimiter char.
 */
ReadtheDokus.prototype._getStartPage = function(basePage, delimiter)
{

	var result = document.querySelector("#sidebarheader > div.home > a").href;

	/*
	if (basePage && delimiter)
	{
		var re = new RegExp("\\" + delimiter + "[^\\" + delimiter + "]*[^\\" + delimiter + "]*$");
		result = basePage.replace(re, "").replace(re, "") + delimiter + "start";

	}
	*/

	return result;

};

// -----------------------------------------------------------------------------

/**
 * Initialize the TOC menu.
 *
 * @param	{HTMLElement}	toc					A TOC HTML element.
 */
ReadtheDokus.prototype._initToc = function(toc)
{

	if (toc)
	{
		this._installTocSelectHandler();
		this._installTocMenuHandler();
		this._installTocJumpHandler();
	}

};

// -----------------------------------------------------------------------------

/**
 * Install a click handler to highlight and expand a TOC menu item.
 */
ReadtheDokus.prototype._installTocSelectHandler = function()
{

	var list = this._toc.querySelectorAll(".level1 div.li");
	var nodes = Array.prototype.slice.call(list, 0);
	nodes.forEach(function(elem) {
		elem.addEventListener("click", function(e) {
			// Get the level2 parent element
			let p = this._getParent(elem, "level2");

			// Remove all "current" class
			var list2 = this._toc.querySelectorAll(".current");
			var nodes2 = Array.prototype.slice.call(list2, 0);
			nodes2.forEach(function(elem) {
				elem.classList.remove("current");
			});

			// Add "current" class to the clicked item and its level2 parent
			if (p)
			{
				p.parentNode.classList.add("current");
				p.classList.add("current");
				elem.classList.add("current");
				elem.scrollIntoView(true);
			}

			// Expand the item
			this.expandTocMenu(elem);

			// Fold all the other level2 items
			var list3 = this._toc.querySelectorAll(".level2 > div.li.expandable");
			var nodes3 = Array.prototype.slice.call(list3, 0);
			nodes3.forEach(function(item) {
				if (item != p)
				{
					this.collapseTocMenu(item);
				}
			}.bind(this));

			e.preventDefault();
		}.bind(this));
	}.bind(this));

};

// -----------------------------------------------------------------------------

/**
 * Install a click handler to expand/collapse a TOC menu item.
 */
ReadtheDokus.prototype._installTocMenuHandler = function()
{

	// Search for TOC menu items which have children
	var list = this._toc.querySelectorAll("div.li");
	var nodes = Array.prototype.slice.call(list, 0);
	nodes.forEach(function(elem) {
		if (elem.parentNode.querySelector(".toc"))
		{
			elem.classList.add("expandable");

			// Insert +/- fontawesome icon and image
			elem.children[0].insertAdjacentHTML("afterbegin", '<div class="btn-expand"><i class="far fa-minus-square"></i><img class="minus" src="' + DOKU_BASE + 'lib/images/minus.gif" alt="−"></div>');

			// Install click handler
			elem.children[0].children[0].addEventListener("click", function(e) {
				this.toggleTocMenu(elem);

				e.stopPropagation();
				e.preventDefault();
			}.bind(this));

			// Only level1 menu items are open at start
			if (!elem.parentNode.classList.contains("level1"))
			{
				this.collapseTocMenu(elem);
			}
		}

		// Install a click handler to move an clicked item to top
		elem.addEventListener("click", function() {
			elem.scrollIntoView(true);
		});
	}.bind(this));

};

// -----------------------------------------------------------------------------

/**
 * Install a click handler to jump to the anchor taking the fixed header height into account.
 */
ReadtheDokus.prototype._installTocJumpHandler = function()
{

	var list = document.querySelectorAll('a[href*="#"]');
	var nodes = Array.prototype.slice.call(list, 0);
	nodes.forEach(function(elem){
		elem.addEventListener("click", function(e) {
			var href = elem.getAttribute("href");
			var hash;

			// Do anchor jump if the link destination is in the same page
			if (href.substring(0,1) == "#" || elem.getAttribute("title") == document.body.getAttribute("data-id"))
			{
				var index = href.indexOf("#");
				hash = href.substring(index);
				this._jumpToAnchor(hash);
				e.preventDefault();
				return false;
			}
		}.bind(this));
	}.bind(this));

};

// -----------------------------------------------------------------------------

/**
 * Jump to an anchor taking the header height in account.
 *
 * @param	{HTMLElement}	elem				An HTML element.
 * @param	{String}		level				A depth level.
 */
ReadtheDokus.prototype._jumpToAnchor = function(hash)
{

	var target = document.querySelector(hash);
	if (target)
	{
		// Jump to Anchor
		location.href = hash;

		// Get Header Height
		var headerHeight = this._header.offsetHeight;
		if (dokus.getMediaQuery() == "sp")
		{
			this.hideSidebar();
		}

		// Scroll to the position of Target Element + Header Height
		var top = target.getBoundingClientRect().top;
		window.scrollTo(0, window.pageYOffset + top - headerHeight);
	}

};

// -----------------------------------------------------------------------------

/**
 * Return a specified level parent TOC item of the specified element.
 *
 * @param	{HTMLElement}	elem				An HTML element.
 * @param	{String}		level				A depth level.
 */
ReadtheDokus.prototype._getParent = function(elem, level)
{

	let current = elem.parentNode;

	while (current && !current.classList.contains("level1"))
	{
		if (current.classList.contains(level))
		{
			return current.children[0];
		}

		current = current.parentNode.parentNode;
	}

	return null;

};

// -----------------------------------------------------------------------------

/**
 * Initialize the mobile header. Add a click event listener to toggle the sidebar.
 */
ReadtheDokus.prototype._initMobileHeader = function()
{

	// Add click event handler for mobile menu
	document.getElementById("btn-mobilemenu").addEventListener("click", function(){
		this.toggleSidebar();
	}.bind(this));

};

// -----------------------------------------------------------------------------

/**
 * Initialize previous/next page buttons. Show/hide buttons depending on the current page index.
 */
ReadtheDokus.prototype._initPageButtons = function()
{

	// Get current page (remove hash) and index
	var currentPage = window.location.href.replace(/#.*$/, "");
	var currentPageIndex = this._pages.indexOf(currentPage);

	// Show prev button
	if (currentPageIndex > 0)
	{
		document.getElementById("btn-prevpage").classList.remove("invisible");
		document.getElementById("btn-prevpage").href = this._pages[currentPageIndex - 1];
	}

	// Show next button
	if (currentPageIndex > -1 && currentPageIndex < this._pages.length - 1)
	{
		document.getElementById("btn-nextpage").classList.remove("invisible");
		document.getElementById("btn-nextpage").href = this._pages[currentPageIndex + 1];
	}

};
