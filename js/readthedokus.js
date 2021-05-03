function ReadtheDokus()
{

	this._currentPage;
	this._currentPageIndex;
	this._pages;
	this._toc = document.getElementById("dw__toc");
	this._sidebar =document.querySelector("#dokuwiki__aside");

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
			if (elem.href.indexOf(JSINFO["id"]) > -1)
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

	// Show toc on top of sidebar if item was not found in sidebar
	if (!isFound)
	{
		if (this._toc)
		{
			this._showToc();
			this._toc.scrollIntoView(true);
		}
	}

	this._initToc();
	this._initMobileHeader();
	this._initPageButtons();
	this._sidebar.querySelector("#sidebarheader #qsearch__in").setAttribute("placeholder", "Search docs");

};

ReadtheDokus.prototype._enumSidebarLinks = function(callback)
{

	callback = ( typeof callback === "function" ? callback : function(){} );
	//var links = document.querySelectorAll("#dokuwiki__aside .aside > ul .level1 a");
	var links = this._sidebar.querySelectorAll("#dokuwiki__aside .aside > ul .level1 a");

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

	if (this._toc)
	{
		// Add click event handler to highlight an menu item
		this._toc.querySelectorAll(".level2 a").forEach(function(elem) {
			elem.addEventListener("click", function() {
				this._toc.querySelectorAll(".current").forEach(function(elem) {
					elem.classList.remove("current");
				});
				elem.classList.add("current");
				elem.scrollIntoView(true);
			}.bind(this));
		}.bind(this));

		// Add click event handler to expand/collapse menu
		this._toc.querySelectorAll(".level1 a").forEach(function(elem) {
			if (elem.parentNode.parentNode.querySelector(".toc"))
			{
				// elem.insertAdjacentHTML("afterbegin", '<i class="far fa-plus-square"></i>');
				// elem.insertAdjacentHTML("afterbegin", '<img class="btn-expand minus" src="/docs/lib/images/minus.gif" alt="−">');
				elem.insertAdjacentHTML("afterbegin", '<div class="btn-expand"><i class="far fa-plus-square"></i><img class="minus" src="/docs/lib/images/minus.gif" alt="−"></div>');

				var child = elem.childNodes[0];
				child.addEventListener("click", function(e) {
					child.parentNode.parentNode.parentNode.querySelector(".toc").classList.toggle("invisible");
					if (child.classList.contains("minus"))
					{
						child.classList.remove("minus");
						child.classList.add("plus");
						child.src="/docs/lib/images/plus.gif";
					}
					else
					{
						child.classList.remove("plus");
						child.classList.add("minus");
						child.src="/docs/lib/images/minus.gif";
					}
					e.stopPropagation();
					e.preventDefault();
				});
			}
			elem.addEventListener("click", function() {
				elem.scrollIntoView(true);
			});
		});
	}

};

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

	// Get current page
	var pos = window.location.href.indexOf("#");
	if (pos > -1)
	{
		this._currentPage = window.location.href.substring(0, pos);
	}
	else
	{
		this._currentPage = window.location.href;
	}

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
