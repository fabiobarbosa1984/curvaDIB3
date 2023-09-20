# curvaDIB3
A simple node API to get di curve in a JSON format from b3 website

# Usage
This simple API will create an endpoint runing on 3000 port with a GET method on /getcurve path. Just add a querystring param with the desired data (use brazilian format: dd/mm/yyyy) and the api will return DI data from B3 website
The provided dockerfile make the use plug-and-play: just clone, build and start and you are good to go. 

# Returned information
The following data will be returned as a json object:
codigoVencimento - Maturity code
vencimentoAjustado - Maturity in brazilian date format
diasUteis - Workdays to maturity
volume - Ammount traded
ultimaTaxa - Closing Yield
precoAjuste - Reference price
taxaAjuste - Reference Yield (calculated by the script)

# Contact
If you need any help to use this module in your project, feel free to contact me by my e-mail fabio.barbosa@gmail.com or using my linkedin https://www.linkedin.com/in/fabio-dos-santos-barbosa-affc/