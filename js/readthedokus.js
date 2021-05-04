function ReadtheDokus()
{

	this._currentPage;
	this._currentPageIndex;
	this._pages;
	this._toc = document.getElementById("dw__toc");
	this._sidebar =document.querySelector("#dokuwiki__aside");
	this._delimiter = ( window.location.search.indexOf(":") > -1 ? ":" : "/");
	this._id = ( this._delimiter == ":" ? JSINFO["id"] : JSINFO["id"].replaceAll(":", "/"));
	this._startPage;

}

ReadtheDokus.prototype.run = function()
{

	var isFound = false;
	this._pages = [];

	// Enum sidebar items to
	//   - embed toc in the corresponding sidebar item
	//   - collect all page links
	if (JSINFO["ACT"] == "show")
	{
		this._enumSidebarLinks(function(elem) {
			// Embed toc
			if (elem.href.indexOf(this._id) > -1)
			{
				this._embedToc(elem);
				if (this._toc)
				{
					this._toc.scrollIntoView(true);
				}
				isFound = true;
			}

			// Collect page links
			this._pages.push(elem.href);
		}.bind(this));
	}

	var re = new RegExp("\\" + this._delimiter + "[^\\" + this._delimiter + "]*[^\\" + this._delimiter + "]*$");
	this._startPage = this._pages[0].replace(re, "").replace(re, "") + this._delimiter + "start";
	this._pages.unshift(this._startPage);

	// Show toc on top of sidebar if item was not found in sidebar
	if (!isFound)
	{
		if (this._toc)
		{
			this._showToc();
			this._toc.scrollIntoView(true);
		}
	}

	if (this._toc)
	{
		this._initToc();
	}
	this._initMobileHeader();
	this._initPageButtons();
	this._sidebar.querySelector("#sidebarheader #qsearch__in").setAttribute("placeholder", "Search docs");

};

ReadtheDokus.prototype._enumSidebarLinks = function(callback)
{

	callback = ( typeof callback === "function" ? callback : function(){} );
	var links = this._sidebar.querySelectorAll(".aside > ul .level1 a");

	links.forEach(function(elem) {
		callback(elem);
	});

};

ReadtheDokus.prototype._embedToc = function(target)
{

	if (target && this._toc)
	{
		target.parentNode.parentNode.appendChild(this._toc);
		target.parentNode.style.display = "none";
	}

};

ReadtheDokus.prototype._showToc = function()
{

	if (this._toc)
	{
		this._toc.parentNode.style.display = "block";
	}

};

ReadtheDokus.prototype._initToc = function()
{

	this._installTocSelectHandler();
	this._installTocMenuHandler();

};

ReadtheDokus.prototype._installTocSelectHandler = function()
{

	this._toc.querySelectorAll(".level2 a").forEach(function(elem) {
		elem.addEventListener("click", function() {
			this._toc.querySelectorAll(".current").forEach(function(elem) {
				elem.classList.remove("current");
			});
			elem.parentNode.parentNode.classList.add("current");
			elem.classList.add("current");
			elem.scrollIntoView(true);
		}.bind(this));
	}.bind(this));

};

ReadtheDokus.prototype._installTocMenuHandler = function()
{

	this._toc.querySelectorAll(".level1 a").forEach(function(elem) {
		if (elem.parentNode.parentNode.querySelector(".toc"))
		{
			elem.insertAdjacentHTML("afterbegin", '<div class="btn-expand"><i class="far fa-minus-square"></i><img class="minus" src="/docs/lib/images/minus.gif" alt="−"></div>');

			var i = elem.childNodes[0].querySelector("i");
			i.addEventListener("click", function(e) {
				this._toggleTocMenu(i);

				e.stopPropagation();
				e.preventDefault();
			}.bind(this));

			/*
			var img = elem.childNodes[0].querySelector("img");
			img.addEventListener("click", function(e) {
				this._toggleTocMenu(i);

				e.stopPropagation();
				e.preventDefault();
			}.bind(this));
			*/
		}

		elem.addEventListener("click", function() {
			elem.scrollIntoView(true);
		});
	}.bind(this));

};

ReadtheDokus.prototype._toggleTocMenu = function(elem)
{

	elem.parentNode.parentNode.parentNode.parentNode.querySelector(".toc").classList.toggle("invisible");

	if (elem.classList.contains("fa-minus-square"))
	{
		elem.classList.remove("fa-minus-square");
		elem.classList.add("fa-plus-square");
	}
	else
	{
		elem.classList.remove("fa-plus-square");
		elem.classList.add("fa-minus-square");
	}

}

ReadtheDokus.prototype._foldMenu = function(elem, foldAllChildren)
{
}

ReadtheDokus.prototype._initMobileHeader = function()
{

	// Add click event handler for mobile menu
	document.getElementById("btn-mobilemenu").addEventListener("click", function(){
		this._sidebar.classList.toggle("visible");
		document.querySelector("#dokuwiki__content").classList.toggle("shift");
	}.bind(this));

};

ReadtheDokus.prototype._initPageButtons = function()
{

	// Get current page (remove hash)
	this._currentPage = window.location.href.replace(/#.*$/, "");

	// Get current page index
	this._currentPageIndex = this._pages.indexOf(this._currentPage);

	// Show prev button
	if (this._currentPageIndex > 0)
	{
		document.getElementById("btn-prevpage").classList.add("visible");
		document.getElementById("btn-prevpage").href = this._pages[this._currentPageIndex - 1];
	}

	// Show next button
	if (this._currentPageIndex < this._pages.length - 1)
	{
		document.getElementById("btn-nextpage").classList.add("visible");
		document.getElementById("btn-nextpage").href = this._pages[this._currentPageIndex + 1];
	}

};
