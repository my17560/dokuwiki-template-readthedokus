# Read the Dokus - DokuWiki Template

This is a DokuWiki theme that imitates "Read the Docs". 

![c7467c9c43ba585265cf829dd5d1c230 media](https://user-images.githubusercontent.com/49435291/164868953-d272c665-57e4-4c17-87c1-8b238b5ea5d3.png)

## Featuring
- “Read the Docs” appearance
- Embedded foldable TOC in the sidebar
- Auto generated “Previous”, “Next” buttons to follow the pages on the sidebar

## Installation

Use DokuWiki's Extention Manager to install the template. If you want to install manually, you can download from [here.](https://github.com/my17560/dokuwiki-template-readthedokus/archive/refs/heads/main.zip)

## Settings

### Template Settings ###

These are template settings for this theme.

|Option|Description|
-------|------------
|Sidebar position|Choose “left” for the left sidebar, “right” for the right sidebar.|
|Use a full path breadcrums|Show a full path breadcrumbs instead of only a page title.|
|Use DokuWiki breadcrums|Check to use DokuWiki style breadcrumbs.|
|Show toolbox even when logged out|Check to show the Toolbox always. By default, it is not shown unless you log in.|
|Start Page|Set start page URL. This page is shown when the “previous” button is pressed on the first page.|
|Enable Font Awesome|Check if you want to use Font Awesome. Don't forget to put the necessary tags in the option below. Technically, this option only puts the tags specified in the head tag.|
|Specify a tag to include Font Awesome|Specify tags to include FontAwesome.The tags specified here are put in the head tag.|
|Enable Google Fonts|Check if you want to use Google Fonts. Don't forget to put the necessary tags in the option below. Technically, this option only puts the tags specified in the head tag.|
|Specify tags to include Google Fonts|Specify tags to include Google Fonts. The tags specified here are put in the head tag.|

### Template Variables ###

These are some of the options on "Template Style Settings". Other options are available to change various colors used in this template.

|Option|Description|
-------|------------
|Site width|Width of the whole content including the sidebar. By setting this value, the contents will be centered.|
|Content width|Content width. This is a maximum width so the actual size could be less than this value.|
|Side bar width|Sidebar width.|
|Header height|Header height. The theme puts padding on the top of the page according to this value.|
|Footer height|Footer height. The theme puts padding on the bottom of the page according to this value.|
|CSS breakpoint for smart phones|Screen size less than this value will be treated as a smartphone.|
|CSS breakpoint for tablets|Screen size less than this value will be treated as a tablet. |

## Notes

### Sidebar Format ###

Use strong for captions, and lists for items. Anything other than that won't be styled, so use your own styles for them.

E.g.
```
** Caption1 **
  * [[page1]]
  * [[page2]]
** Caption2 **
  * page3
  * page4
```

Some index plugins are supported by this template and can be used in the sidebar.

- AcMenu Plugin
- IndexMenu Plugin
- nspages Plugin
- simplenavi Plugin

### Previous/Next Buttons ###

Previous/Next buttons follow links to DokuWiki on the sidebar, picked up by using querySelector(".aside > #sidebar a[data-wiki-id]"). The previous button on the first page will jump to root(/) by default. You can change this in "Start Page" option in the settings.

### Link to Login Page ###

This theme doesn't have any links to the login page by default. Go directly to the login page by appending “&do=login” to the current URL. Or, check the “Show toolbox even when logged out” option in the settings to show the Toolbox always which has the link to the login page.

### Admonitions ###

This theme has "Read The Docs" style admonitions. To use them, wrap a content with a div that has a class "admonition" and a type.

E.g.
```
<html><div class="admonition note">
<p>Note!</p>
</div></html>
```

Types are:
- danger
- caution
- note
- tip

You can use "Wrap Plugin" to make it a bit simpler.

```
<WRAP admonition note>
Note!
</WRAP>
```

If you use the plugin, do not forget to add classes (admonition,danger,caution,note,tip) to the "noPrefix" in the Wrap plugin option otherwise admonitions will not be styled correctly.

## Customization

### Using Font Awesome ###

Even though this theme works without Font Awesome, you can use Font Awesome for better looking. If you decide to use it, check the option in the configuration manager to enable it. Do not forget to set the correct tag in the following option.

A home icon will appear beside the title, and +/- buttons on TOC, a mobile menu button will be replaced by Font Awesome.

### Using Google Fonts ###

Also, you can use google fonts for better looking. Lato and Robot fonts are set in font-family in this theme CSS. If you decide to use it, check the option in the configuration manager to enable it. Change the tags in the following option.

### Adding a Fixed Header/Footer ###

This theme supports a fixed header and footer. On the "Template Style Setting" page, enter a header height in the "Header height" option, a footer height in the "Footer height" option. The theme will add paddings according to those options on top for header, bottom for footer. You can put your own header/footer in "header.html"/"footer.html" in the "lib/tbl/readthedokus/" directory. 

#### 1. Set header/footer height in "Template Style Settings" ####

These values must be valid CSS values.

e.g. "50px"

#### 2. Create header.html/footer.html ####

Create a file "header.html"/"footer.html" under (DokuWiki folder)/lib/tpl/readthedokus/.

Here is a sample header.html. This example also shows how to toggle a sidebar. Clicking the string "Header" toggles the sidebar.

```
<div onclick="toggleMenu();">Header</div>
<style>
header > div {
	background-color: khaki;
	position: fixed;
	height: 50px;
	left: 0;
	top: 0;
	right: 0;
}
</style>
<script>
function toggleMenu()
{
	dokus.toggleSidebar();
}
</script>
```

You might want to hide a mobile menu since both the sticky header and the mobile menu are displayed at the same time on mobile devices. To hide the mobile menu add below to the CSS file (DokuWiki folder)/conf/userall.css

```
#mobileheader {
display: none;
}
```

### Centering the Content ###

To center the content, enter the content width in the "Site width" option on the "Template Style Settings".

### Include Hooks ###

The theme has some include-hooks.

```
+--------------------------------------------------+
|                       [1]                        |
+-------------+------------------------------------+
|    Title    | Docs > Page Title                  |
|(           )|                [6]                 |
|     [2]     | ---------------------------------- |
+-------------+                                    |
|     [3]     |                                    |
|             |                                    |
|             |                                    |
|             |                                    |
|             |                                    |
|             |                                    |
|             |                                    |
|             |                                    |
|             |                                    |
|     [4]     | <Previous                    Next> |
+-------------+                                    |
|     [5]     |                [7]                 |
+-------------+------------------------------------+
|                       [8]                        |
+--------------------------------------------------+


[1] ... header.html
[2] ... sidebarheader.html
[3] ... sidebartop.html
[4] ... sidebarbottom.html
[5] ... sidebarfooter.html
[6] ... pageheader.html
[7] ... pagefooter.html
[8] ... footer.html
```
