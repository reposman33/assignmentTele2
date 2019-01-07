tele2 phonefinder
Marc Bakker
2015-09-06
Javascript applicatie om telefoon data te vertonen via Ajax met Javascript/css/html. Geen libraries.


Opmerking m.b.t. de Ajax aanroepen:

Het bleek niet mogelijk om json data op te halen van de opgegeven url - de tele2 server respons:

"XMLHttpRequest cannot load https://www.tele2.nl/shop/jsonApi/index.php?dc=_0.3901725795585662. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost' is therefore not allowed access.

Geprobeerd om via JSONP (dynamisch toevoegen script element in de head) data van ander domein (tele2) op te halen met function getDataXDomain(url). De json data kan niet benaderd worden - is niet duidelijk hoe dat kan.

In plaats daarvan is de json data lokaal opgeslagen in /includes/phoneData.txt en wordt via een XMLHttpRequest ingelezen.
