# Coding Cxercise: Ext js Grid and jQuery Datatable 
A little coding exercise that fetches data through multiple ajax calls and displays a sort-able paginated grid. Grid is fundamental to most JavaScript libraries. For demo purposes, this coding exercise creates 2 grids which use jQuery DataTable and Ext js Grid respectively

# Lesson Learned

1. I have been working with Ext js for a long time. Creating a Ext grid is a no-brainer. However, normally I use Ext buffered grid, which fetch data remotely. Working with
local json data and serve the store  from memory cache, surprisingly took me a bit longer than I expected.

2. jQuery datatable is a delight. So easy, so light weighted. 

3. I was very happy to use jQuery's $.when() method, which takes a list of "Deferred" objects (All jQuery Ajax methods return Deferred objects) and then provides a single callback. 

4. In terms of loading time, jQuery truly "wins", it is just so light-weighted. On the contrary, loading the whole Ext js library with its resource files (ext-all, images) takes visibly longer. Though i could have configured some cache options with azure.

# Code in action

Check out 

For ext js grid:
http://codingfun.azurewebsites.net/extjs/index.html
 
For jquery datatable:
http://codingfun.azurewebsites.net/jquery/index.html


Happy Coding!