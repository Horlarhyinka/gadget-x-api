<p>Welcome to gadget-x project, a backend api for an e-commerce application.</p>
<h1 id="Introduction" >Introduction</h1>
<p>
A REST api for an e-commerce website which enables secure in-app transactions and cross-platform shopping. This project is a node based project built with javascript programming language, mongodb (nosql database), and Redis (for caching). The technologies implemented include.
</p>
<h4>Technologies</h4>
<ul>
 <li>nodejs</li>
 <li>mongodb</li>
 <li>redis</li>
 <li>cheerio</li>
 <li>passport js</li>
 <li>paystack</li>
</ul>
<h4>Features</h4>
<ul>
 <li>Authentication: user login/register/forget-password implemented with jwt and google oauth2.0 with passport.js</li>
 <li>Authorization: Authorization for both admin product manager endpoints and customer user endpoints.</li>
 <li>product inventory management: CRUD (create, read, update, and delete) operations on products in inventory by an authorized product manager.</li>
 <li>In-app shopping: CRUD operations on items in cart and also a secure payment processing.</li>
 <li>crossplatform-shopping: this feature extends your search to products on jumia and makes it possible to navigate products from jumia on the application. </li>
</ul>
<h1 id="table-of-content" >table of content</h1>
<ul>
 <li><a href="#Introduction" >Introduction</a></li>
 <li><a href="#table-of-content" >Table of content</a></li>
 <li><a href="#contributing" >Contributing</a></li>
<li><a href="#getting-started" >Getting started</a></li>
 <li><a href="#developer-documentation" >Developer documentation.</a></li>
</ul>
<h1 id="contributing">contributing</h1>
<p>follow the following steps to contribute to this project.</p>
<ol>
 <li>fork the repository by clicking the icon on the top right corner of the screen.</li>
 <li>contribute to project.</li>
</ol>
<h1 id="geting-started" >Getting started.</h1>
<i>prerequisites</i>
<ul>
 <li>node version 16.0 or above.</li>
 <li>redis-server</li>
</ul>
<p>to get started with this project:</p>
<ol>
 <li> visit <a href="https://nodejs.org/en/download" >https://nodejs.org/en/download</a> to install latest version of nodejs on your computer
</li>
 <li>visit <a href="https://redis.io/docs/install/install-redis/">https://redis.io/docs/install/install-redis/</a> for instructions on how to install redis-server on your OS</li>
 <li>run `npm install`</li>
 <li>setup environment variables</li>
 <li>run `sudo service redis-server start` to start redis-server.</li>
 <li>run `npm run Dev` to get started in development mode</li>
</ol>
<h1 id="developer-documentation" >Developer documentation</h1>
<p>reference the <a href="https://documenter.getpostman.com/view/20519100/2s93RZLpYY" >developer documentation</a> for api usage.</p>

