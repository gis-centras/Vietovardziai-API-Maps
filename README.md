# GV_DRLT paieškos servisas

Nacionalinės žemės tarnybos erdvinių duomenų rinkinio GV_DRLT paieškos servisas realizuotas naudojant Elastissearch technologiją. Servisas suteikia galimybę vykdyti paiešką GV_DRLT duomenų rinkinyje panaudojant Elasticsearch paieškų žymenis ([daugiau informacijos](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)). 

Šiame projekte rasite GV_DRLT paieškos serviso integracijos į tris populiariausias žemėlapių naršyklių API pavyzdžius. 

## GV_DRLT turinys

Su GV_DRLT duomenų rinkinio specifikacija galite susipažinti [čia](https://www.geoportal.lt/download/Specifikacijos/GV_DRLT-duomenu-specifikacija.pdf). Taip pat [vietovardžių el. paslaugos internetiniame puslapyje](https://www.geoportal.lt/vietovardziai/) susipažinti su GV_DRLT pagrindu veikiančiomis ir teikiamomis paslaugomis.

GV_DRLT duomenų rinkinio Elasticsearch paieškos serviso grąžinami rezultatai:
* sourceid
* namestatus
* sourcedata
* beginlifespanversion
* esri_json - json formatu pateikiama objekto geometrija
* municipality
* inspireid
* subtype
* name
* sourceofname
* localtype
* objectid
* geometryType - geometrijos tipas patogesniam objektų vaizdavimo apdorojimui

## Kaip pradėti

Klonuokite šį projektą pas save lokalioje darbo vietoje. Projekto failus galite patalpinti tiesiai į interneto serverį (pvz. Apache) ir peržiūrėti veikiančias 3 tipų žemėlapių naršykles su GV_DRLT duomenų rinkinio Elasticsearch paieškos serviso integracija.

### Žemėlapių naršyklių API

GV_DRLT paieškos serviso integracijos pavyzdžiai parengti šioms žemėlapių naršyklių API:
* [OpenLayers](https://openlayers.org/)
* [Leaflet](https://leafletjs.com/)
* [ESRI JS](https://developers.arcgis.com/javascript/)

Projekto api.js ir sidebar.js failai yra bendri visoms žemėlapių naršyklėms. Juos pateikiama bendra kreipimosi į Elastisearch servisą logika, rezultatų apdorojimas bei pateikimas sąrašu žemėlapių naršyklės grafinėje naudotojo sąsajoje. Šie failai nėra pritaikyti konkrečiam žemėlapių naršyklės API, todėl jų pagalba GV_DRLT paiešką galite integruoti į daugelį JS pagrindu veikiančių žemėlapių aplikacijų.

### Elastiseach servisas

GV_DRLT paieškos servisas pasiekiamas adresu https://www.geoportal.lt/mapproxy/elasticsearch_gvdr. Tai adresas į Elastisearch API _search metodą. Naudodami šį metodą GET užklausų pagalba galite vykdyti įvairaus sudėtingumo paiešką GV_DRLT rinkinyje. Daugiau informacijos apie Elastisearch paieškos galimybes rasite [čia](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html).

Užklausos, kuri vykdytų paiešką GV_DRLT atribute 'name' pagal paieškos frazę 'Kaunas' pvz.:
```
https://www.geoportal.lt/mapproxy/elasticsearch_gvdr?q=name:kaunas
```

## Autoriai

* [VĮ GIS-Centras](http://www.gis-centras.lt) - projekto autoriai
* [Nacionalinė žemės tarnyba prie Žemės ūkio ministracijos](http://www.nzt.lt) - GV_DRLT duomenų rinkinio valdytojai
