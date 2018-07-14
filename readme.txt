by: Konstantin Dobler

 ----------------------- Hashiwokakero ----------------------

 => Über TypeScript und dieses Projekt
 Dieses Projekt wurde in TypeScript geschrieben. 
 TypeScript ist ein JavaScript-Dialekt, der JavaScript extrem ähnlich ist und auch nach JavaScript kompiliert.
 Jedoch bietet er, im Gegensatz zu JavaScript starke Typisierung und andere Features, die Fehlerquellen eliminieren.
 Der TypeScript-Code ist von jedem lesbar, der auch JavaScript lesen kann. 

 Das "Endprodukt" befindet sich im /dist/ (=> Distribution) Ordner. 
 Dieser enthält die HTML-Datei, das zugehörige CSS-Stylesheet, sowie der zu JS kompilierte und in ein einziges Skript 
 gebundlete Quellcode. Im /src/ Verzeichnis befinden sich die TypeScript-Quelldateien und im /js/ Verzeichnis befinden 
 sich die einzelnen zu JS kompilierten Dateien, die gebundlet bundle.js in /dist/ ergeben.

 Der zum lesen gedachte Code befindet sich in /src/. Auch die Dateien in /js/ als auch bundle.js in /dist/ sind "lesbar",
 allerdings von einem Compiler erstellt und somit von Namensgebung der Variablen, Formatierung usw suboptimal.
 Die .map Dateien sind Sourcemaps, die das Debuggen der JS-Dateien im ursprünglichen TypeScript-Code erlauben.
 
 Der Quellcode des Projektes wurde in verschiedene Dateien aufgeteilt, um nach semnatisch zugehörigen Features zu strukturieren, 
 und um Modularität zu gewinnen. So kann zB ohne allzu großen Aufwand die GUI ausgetauscht werden,
 Farbschemata hinzugefügt- und entfernt usw.

 Als alternatives Szenario wurden statt "Chips und Leitungen" ganz minimalistisch Knoten (Nodes) und Kanten (Edges) verwendet.
 
 Ich empfehle zum lesen des Codes einen Editor mit TypeScript/JavaScript Unterstützung, die ist bei fast allen gängigen Editoren jedoch der Fall.

 => Installation & Einrichtung
 Da die ausführbahren Dateien in JavaScript vorliegen, wird lediglich ein (aktueller) Browser benötigt, um das Projekt zu nutzen. 
 Zum Starten einfach index.html im /dist/ Verzeichnis öffnen. Getestet wurde in aktuellen Versionen von Chrome, Firefox und Edge.

 => Zufällige Spielfelderstellung
 Es wird nach dem folgenden Prinzip verfahren:
 1. Wähle zufällige Kreuzung als Startpunkt aus und erstelle eine Node (Knotenpunkt/Insel/etc)
 2. Von einem zufälligen vorhandenem Knotenpunkt, wähle eine Richtung aus, die noch frei* ist. Gehe dann solange in diese Richtung,
    bis entweder:
        a) ein anderer Knotenpunkt erreicht wird, dann erstelle eine Kante vom Startpunkt zum erreichten Knotenpunkt
        b) eine kreuzende Kante erreicht wird, erstelle einen Knotenpunkt K auf der Kante und verbinde diesen mit dem Startpunkt.
           Dabei wird die ursprüngliche Kante gelöscht und durch zwei neue ersetzt, die ihre Endpunkte jeweils mit K verbinden. 
        c) der Spielfeldrand erreicht wird, erstelle einen Knoten und verbinde ihn mit dem Startpunkt
        d) zufällig entschieden wird, einen Knoten zu setzen und ihn mit dem Startpunkt zu verbinden.

    *eine Richtung ist "frei", wenn sie innerhalb des Spielfeldes liegt und das erste Feld in ihrer Richtung weder Knoten noch Kanten enthält.
 3. wiederhole 2.) solange, bis eine bestimmt Anzahl Knotenpunkte (im Code cutoff) erreicht ist.
 4. Gebe jedem Knoten einen Wert entsprechend seines Grades (Anzahl seiner Kanten).
 5. Gebe die Knoten ohne die Kanten als Spielfeld, sowie die Kanten als Lösung desselben zurück.

 Dieses Prinzip garantiert lösbare Instanzen des Hashiwokakero-Problems. Zur Schwierigkeit wird die Spielfeldgröße, 
 sowie die Füllrate (wieviele der Kreuzungen Knoten haben) angepasst, wobei gilt: größer => schwerer. Da hier auf mehrern Leveln Zufall
 im Spiel ist kann es durchaus sein, dass ein "Medium"-Level schwerer als ein "Hard"-Level ist, dies sei hier jedoch erlaubt.

