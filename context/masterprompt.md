Masterprompt

# 1 De hoofdstructuur (Layout)

- **AppLayout:** Dit is de buitenste schil van je applicatie. Het ontwerp is mobile-first. Daarom dwingen we de applicatie in een mobiel formaat. Je plaatst de app in het midden van het scherm met een maximale breedte (bijvoorbeeld max-w-md in Tailwind).
- **MainContainer:** Een flexibele container (Flexbox of CSS Grid) die het scherm precies in twee helften verdeelt, zodat de interface in balans is.

# 2 Styling en Design Tokens (Tailwind CSS)

**Kleurenpalet (Dark Theme met hoog contrast)** De interface moet rust uitstralen in de basis, zodat de belangrijke data er direct uitspringt.

- **Achtergrondkleuren:** Gebruik diepe, donkere tinten voor de basis. Bijvoorbeeld bg-slate-950 voor de hoofdomgeving en bg-slate-900 voor losse kaarten of het radarveld.
- **Primaire tekst:** Wit of heel lichtgrijs (text-slate-100) voor de belangrijkste informatie zoals de score en de minuut.
- **Secundaire tekst:** Gedempt grijs (text-slate-400) voor labels of assen in de grafiek.
- **Accentkleuren (Interactie & Data):** Felle, contrasterende kleuren voor de oplichtende zones en de grafieklijn. Gebruik bijvoorbeeld text-cyan-400 en bg-cyan-500 voor neutrale acties, en bg-emerald-500 voor positieve momenten (zoals een doelpunt voor jouw team).

**Typografie en Leesbaarheid** Om informatie in een fractie van een seconde te kunnen verwerken, houden we de tekst simpel en groot.

- **Lettertype:** Het standaard schreefloze (sans-serif) lettertype van Tailwind is perfect.
- **Hiërarchie:** Gebruik text-3xl font-bold voor de live score. Gebruik text-sm font-medium uppercase tracking-wide voor kleine aanduidingen (zoals 'Momentum' of 'Live').

**Afmetingen en Touch Targets (Mobile-first)** Omdat gebruikers met één hand een voorspelling moeten kunnen doen op het radarveld, zijn de formaten van knoppen essentieel.

- **Klikbare zones:** Elk interactief element (zoals een zone op het veld of een knop) moet minimaal 48 pixels hoog en breed zijn. Vertaal dit naar Tailwind als min-h-48px min-w-48px.
- **Randen en Spatiëring:** Gebruik afgeronde hoeken (rounded-xl of rounded-2xl) om de interface een moderne, speelse app-uitstraling te geven. Houd ruime marges aan rondom de componenten (bijvoorbeeld gap-4 of p-4) om het overzichtelijk te houden.

**Animaties en Feedback** Bij het interactieve element wil je dat de gebruiker direct ziet dat een actie is gelukt.

- **Transities:** Voeg standaard overgangen toe aan interactieve elementen met transition-all duration-200 ease-in-out.
- **Klikfeedback:** Gebruik active:scale-95 zodat een zone of knop optisch even indrukt wanneer de kijker er met de duim op tikt. Dit versterkt het speelse gevoel.

# 4 De Datastructuur (TypeScript Interfaces)

Om het concept van 'Het Tactische Momentum' goed te simuleren, moet je de data opdelen in drie logische blokken. Je vraagt de AI om deze structuur in TypeScript uit te werken.

**A. Wedstrijdcontext (MatchData)** Dit is de algemene informatie die bovenin het scherm staat. Deze data verandert tijdens de test niet continu, maar vormt de basis.

- **homeTeam:** De naam of afkorting van het thuisland (bijvoorbeeld 'NED').
- **awayTeam:** De naam of afkorting van het uitland (bijvoorbeeld 'SPA').
- **homeScore & awayScore:** De huidige stand van de wedstrijd.
- **currentMinute:** De actuele speelminuut.

**B. De Grafiek en het Radarveld (MomentumPoint)** Dit is de belangrijkste dataset. Het is een lijst (array) met meetpunten. Elk punt in deze lijst vertegenwoordigt een moment in de wedstrijd en koppelt de grafiek direct aan het radarveld.

- **minute:** De specifieke minuut van dit datapunt (bijvoorbeeld 14).
- **pressureValue:** Een getal tussen de 0 en 100. Dit bepaalt hoe hoog de lijn in je grafiek tekent. 100 betekent maximale aanvalsdruk.
- **activeZone:** Een tekstlabel dat aangeeft welk deel van het radarveld moet oplichten op dat specifieke moment. Je kunt dit simpel houden met waardes zoals 'links_boven', 'centrum_aanval' of 'rechts_onder'.
- **event (Optioneel):** Een veld dat alleen is ingevuld als er iets bijzonders gebeurt. Bijvoorbeeld 'Doelpunt' of 'Vrije trap'. Als dit veld is ingevuld, weet de AI dat er een pop-up in de grafiek getoond moet worden.

**C. De Poule Stand (PouleScore)** Dit blokje bevat de data voor het gamification element en de ranglijst.

- **userName:** De naam van de deelnemer in de poule.
- **points:** Het huidige aantal punten van deze speler.
- **isCurrentUser:** Een 'true' of 'false' waarde (boolean) om aan te geven wie de huidige gebruiker is. Zo kan de AI jouw eigen naam een opvallende kleur geven in de lijst.

# 5 State en Interactie Logica (User Flow)

Je kunt de volgende interacties direct aan je AI doorgeven. Dit zorgt ervoor dat de applicatie echt voelt als een werkend prototype voor je gebruikerstest.

**Interactie 1: Een voorspelling doen op het radarveld**

- **Trigger:** De gebruiker tikt op een zone in het radarveld.
- **Conditie:** Dit kan alleen als er op dat moment nog geen voorspelling actief is.
- **Onder de motorkap (State):** De variabele selectedZone wordt gevuld met de gekozen zone.
- **Visuele feedback:** De gekozen zone krijgt direct een felle rand, bijvoorbeeld met de Tailwind class ring-2 ring-cyan-400. Er verschijnt heel kort een kleine animatie of tekst in beeld met 'Voorspelling opgeslagen'.

**Interactie 2: Door de tijdlijn scrollen**

- **Trigger:** De gebruiker veegt horizontaal over de tijdlijn.
- **Onder de motorkap (State):** De variabele currentMinute wordt aangepast naar de gekozen minuut.
- **Visuele feedback:** Zowel de grafiek als het radarveld veranderen direct mee. Ze tonen de data die bij deze nieuwe minuut hoort. Dit zorgt ervoor dat de informatie altijd synchroon loopt.

**Interactie 3: Een gebeurtenis bekijken in de grafiek**

- **Trigger:** De gebruiker tikt op een hoge piek in de momentum grafiek.
- **Conditie:** Het datapunt in de JSON data moet een specifieke gebeurtenis bevatten.
- **Onder de motorkap (State):** De variabele activeEvent wordt gevuld met de gegevens van dat moment.
- **Visuele feedback:** De pop-up wordt zichtbaar op het scherm. Dit toont heel kort wie er bijvoorbeeld scoorde. Zodra de gebruiker ergens anders tikt, verdwijnt deze pop-up weer om het scherm overzichtelijk te houden.

