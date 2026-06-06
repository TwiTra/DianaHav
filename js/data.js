'use strict';

const LEVELS = [
  { id:'A1', title:'Anfänger',       color:'#10b981', icon:'🌱', description:'Einfache Ausdrücke und Sätze verstehen und verwenden.' },
  { id:'A2', title:'Grundlagen',     color:'#06b6d4', icon:'🌊', description:'Häufig verwendete Ausdrücke in vertrauten Situationen.' },
  { id:'B1', title:'Mittelstufe',    color:'#8b5cf6', icon:'⭐', description:'Klare Sprache in bekannten Themen – Prüfungsniveau!' },
  { id:'B2', title:'Oberstufe',      color:'#f59e0b', icon:'🚀', description:'Komplexe Texte und abstrakte Themen verstehen.' },
  { id:'C1', title:'Fortgeschritten',color:'#ef4444', icon:'🏆', description:'Anspruchsvolle, lange Texte flexibel verstehen.' },
];

const LESSONS_DATA = {

/* ============================================================ A1 ============================================================ */
A1: {
  units: [
    {
      id:'a1-u1', icon:'👋', title:'Begrüßungen und Vorstellung',
      desc:'Hallo sagen, sich vorstellen, Herkunft angeben.',
      skills:{
        schreiben:{
          title:'Schreiben üben',
          exercises:[
            { type:'fill-blank', question:'Ergänze die Lücken.',
              parts:['Guten ', {blank:'Morgen', hint:'утро'}, '! Ich ', {blank:'heiße', hint:'зовут'}, ' Diana. Ich ', {blank:'komme', hint:'еду из'}, ' aus der Ukraine.'],
              explanation:'Guten Morgen = Доброе утро | heiße = меня зовут | komme aus = я из' },
            { type:'fill-blank', question:'Wie heißt du? Antworte.',
              parts:['Mein ', {blank:'Name', hint:'имя'}, ' ist Diana. Ich bin ', {blank:'22', hint:'Alter'}, ' Jahre alt.'],
              explanation:'Name = имя | Jahre alt = лет' },
            { type:'free-write', question:'Schreibe eine kurze Vorstellung (3–5 Sätze). Wer bist du? Woher kommst du? Was machst du?',
              minWords:15, placeholder:'Hallo! Ich heiße … Ich komme aus … Ich bin … Jahre alt. Ich lerne Deutsch, weil …',
              tip:'Verwende: Hallo, Ich heiße, Ich komme aus, Ich bin … Jahre alt, Ich lerne …' },
          ]
        },
        hoeren:{
          title:'Hören',
          exercises:[
            { type:'listening', title:'Erstes Gespräch',
              transcript:`<p><span class="speaker-name">Anna:</span> Hallo! Ich bin Anna. Wie heißt du?</p>
<p><span class="speaker-name">Max:</span> Hallo Anna! Ich heiße Max. Woher kommst du?</p>
<p><span class="speaker-name">Anna:</span> Ich komme aus Österreich, aus Wien. Und du?</p>
<p><span class="speaker-name">Max:</span> Ich komme aus Deutschland, aus Berlin. Schön, dich kennenzulernen!</p>
<p><span class="speaker-name">Anna:</span> Schön, dich auch kennenzulernen!</p>`,
              questions:[
                { q:'Woher kommt Anna?', choices:['Aus Berlin','Aus Wien','Aus Zürich','Aus München'], correct:1 },
                { q:'Woher kommt Max?', choices:['Aus Hamburg','Aus Wien','Aus Berlin','Aus Frankfurt'], correct:2 },
              ]
            }
          ]
        },
        lesen:{
          title:'Lesen und Verstehen',
          exercises:[
            { type:'reading',
              text:`<p>Mein Name ist <span class="r-word" data-w="Sofia" data-t="Софія">Sofia</span>. Ich bin <span class="r-word" data-w="23" data-t="23 роки">23 Jahre alt</span> und komme aus der <span class="r-word" data-w="Ukraine" data-t="Україна">Ukraine</span>. Ich <span class="r-word" data-w="wohne" data-t="живу">wohne</span> jetzt in <span class="r-word" data-w="München" data-t="Мюнхен">München</span>. Ich <span class="r-word" data-w="lerne" data-t="вчу">lerne</span> Deutsch, weil ich in Deutschland <span class="r-word" data-w="studieren" data-t="навчатися">studieren</span> möchte. Deutsch ist <span class="r-word" data-w="schwer" data-t="важко">schwer</span>, aber <span class="r-word" data-w="interessant" data-t="цікаво">interessant</span>!</p>`,
              questions:[
                { q:'Wie alt ist Sofia?', choices:['21','22','23','25'], correct:2 },
                { q:'Wo wohnt Sofia jetzt?', choices:['Berlin','Wien','Zürich','München'], correct:3 },
                { q:'Warum lernt Sofia Deutsch?', choices:['Weil sie arbeiten möchte','Weil sie studieren möchte','Weil sie reisen möchte','Weil ihre Familie dort wohnt'], correct:1 },
              ]
            }
          ]
        },
        sprechen:{
          title:'Sprechen üben',
          exercises:[
            { type:'speaking', prompt:'Stelle dich vor! Sag deinen Namen, dein Alter, woher du kommst und was du machst.',
              tips:['Beginne mit: „Hallo, ich heiße …"','Sag dein Alter: „Ich bin … Jahre alt."','Herkunft: „Ich komme aus …"','Aktivität: „Ich lerne / studiere / arbeite …"'],
              example:'Hallo! Ich heiße Diana. Ich bin 22 Jahre alt. Ich komme aus der Ukraine. Ich lerne Deutsch.',
            },
            { type:'dialogue', prompt:'Übe diesen Dialog mit dir selbst.',
              lines:[
                {speaker:'A', text:'Hallo! Wie heißt du?', side:'left'},
                {speaker:'B', text:'Hallo! Ich heiße Diana. Und du?', side:'right'},
                {speaker:'A', text:'Ich heiße Tom. Woher kommst du?', side:'left'},
                {speaker:'B', text:'Ich komme aus der Ukraine. Und du?', side:'right'},
                {speaker:'A', text:'Ich komme aus Deutschland. Schön, dich kennenzulernen!', side:'left'},
                {speaker:'B', text:'Schön, dich auch kennenzulernen!', side:'right'},
              ]
            }
          ]
        }
      }
    },
    {
      id:'a1-u2', icon:'🔢', title:'Zahlen, Datum und Uhrzeit',
      desc:'Zahlen 1–1000, Tage, Monate, Uhrzeiten.',
      skills:{
        schreiben:{
          title:'Schreiben üben',
          exercises:[
            { type:'multiple-choice', question:'Wie schreibt man die Zahl „47" auf Deutsch?',
              choices:['siebenundvierzig','vierundsiebzig','vierundsiebzig','siebenundvierzig'], correct:0,
              explanation:'47 = siebenundvierzig (сорок сім). Im Deutschen steht die Einheit vor der Zehn: vier-und-vierzig.' },
            { type:'fill-blank', question:'Schreibe den Satz auf Deutsch.',
              parts:['Heute ist der ', {blank:'dritte', hint:'3.'}, ' März. Es ist ', {blank:'halb', hint:'половина'}, ' drei Uhr ', {blank:'nachmittags', hint:'после полудня'}, '.'],
              explanation:'halb drei = 14:30 Uhr | dritte = третье число' },
            { type:'reorder', question:'Bringe die Wörter in die richtige Reihenfolge.',
              words:['Ich','am','geboren','bin','Mai','zwölften'],
              answer:'Ich bin am zwölften Mai geboren.',
              tip:'Datumsformat: am + Ordinalzahl + Monat' },
          ]
        },
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Was kostet das?',
            transcript:`<p><span class="speaker-name">Verkäuferin:</span> Guten Tag! Was darf es sein?</p>
<p><span class="speaker-name">Kunde:</span> Guten Tag! Was kostet der Apfelsaft?</p>
<p><span class="speaker-name">Verkäuferin:</span> Der Apfelsaft kostet zwei Euro fünfzig.</p>
<p><span class="speaker-name">Kunde:</span> Und das Brot?</p>
<p><span class="speaker-name">Verkäuferin:</span> Das Brot kostet ein Euro neunzig.</p>
<p><span class="speaker-name">Kunde:</span> Ich nehme beides. Zusammen also vier Euro vierzig.</p>`,
            questions:[
              { q:'Was kostet der Apfelsaft?', choices:['1,90 €','2,50 €','3,00 €','4,40 €'], correct:1 },
              { q:'Was kostet das Brot?', choices:['0,90 €','1,50 €','1,90 €','2,00 €'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p>In Deutschland sagt man die Uhrzeit oft anders als in der Ukraine. Wenn es <strong>halb drei</strong> ist, bedeutet das 2:30 Uhr – also eine halbe Stunde VOR drei. <strong>Viertel vor vier</strong> bedeutet 3:45 Uhr. <strong>Viertel nach zwei</strong> bedeutet 2:15 Uhr. Auf einem Bahnhof oder Flughafen benutzt man die offizielle Zeit: <em>„Der Zug fährt um vierzehn Uhr dreißig."</em></p>`,
            questions:[
              { q:'Was bedeutet „halb drei"?', choices:['3:00 Uhr','2:30 Uhr','3:30 Uhr','2:15 Uhr'], correct:1 },
              { q:'Was bedeutet „viertel vor vier"?', choices:['4:15','4:45','3:45','3:15'], correct:2 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Frage und antworte: Wie spät ist es? Wann hast du Geburtstag? Welches Datum haben wir heute?',
            tips:['Es ist … Uhr.','Ich habe am … (Datum) Geburtstag.','Heute ist der … (Datum).'],
            example:'Es ist halb zehn. Ich habe am fünfzehnten Juli Geburtstag. Heute ist der dritte Juni.' }
        ]}
      }
    },
    {
      id:'a1-u3', icon:'👨‍👩‍👧‍👦', title:'Familie und Personen',
      desc:'Familienmitglieder beschreiben, Adjektive.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'fill-blank', question:'Ergänze die Familienwörter.',
            parts:['Meine ', {blank:'Mutter', hint:'мама'}, ' heißt Olena. Mein ', {blank:'Vater', hint:'папа'}, ' heißt Viktor. Meine ', {blank:'Schwester', hint:'сестра'}, ' ist jünger als ich.'],
            explanation:'Mutter = мати | Vater = батько | Schwester = сестра' },
          { type:'multiple-choice', question:'Welches Adjektiv passt? „Mein Opa ist sehr _____."',
            choices:['alt','jung','klein','schnell'], correct:0,
            explanation:'alt = старий (für Großeltern typisch). Jung = молодий, klein = маленький' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Meine Familie',
            transcript:`<p><span class="speaker-name">Lena:</span> Hast du Geschwister?</p>
<p><span class="speaker-name">Tom:</span> Ja, ich habe einen Bruder und eine Schwester. Mein Bruder ist 18 Jahre alt und meine Schwester ist 14.</p>
<p><span class="speaker-name">Lena:</span> Sind deine Eltern verheiratet?</p>
<p><span class="speaker-name">Tom:</span> Ja, sie sind seit 25 Jahren verheiratet. Wir sind eine glückliche Familie!</p>`,
            questions:[
              { q:'Wie alt ist Toms Bruder?', choices:['14','16','18','20'], correct:2 },
              { q:'Wie lange sind Toms Eltern verheiratet?', choices:['15 Jahre','20 Jahre','25 Jahre','30 Jahre'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p>Das ist meine Familie. Wir sind vier Personen: meine <strong>Mutter</strong>, mein <strong>Vater</strong>, meine <strong>Schwester</strong> und ich. Meine Mutter ist <em>Lehrerin</em> und mein Vater ist <em>Ingenieur</em>. Meine Schwester studiert Medizin. Sie ist sehr <em>fleißig</em>. Wir wohnen in einem großen Haus in der Nähe von Kyiv. Am Wochenende essen wir immer zusammen und sprechen über die Woche.</p>`,
            questions:[
              { q:'Was ist die Mutter von Beruf?', choices:['Ärztin','Ingenieurin','Lehrerin','Studentin'], correct:2 },
              { q:'Was studiert die Schwester?', choices:['Jura','Medizin','Wirtschaft','Deutsch'], correct:1 },
              { q:'Wo wohnt die Familie?', choices:['In der Stadt','In Kyiv','In der Nähe von Kyiv','In Deutschland'], correct:2 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Beschreibe deine Familie! Wie viele Personen? Was machen sie? Wie sind sie?',
            tips:['Ich habe … Geschwister / keine Geschwister.','Meine Mutter/mein Vater ist … (Beruf).','Er/Sie ist … (Adjektiv: nett, lustig, streng, freundlich).'],
            example:'Ich habe eine Schwester. Meine Mutter ist Lehrerin. Mein Vater arbeitet als Ingenieur. Meine Familie ist sehr wichtig für mich.' }
        ]}
      }
    },
    {
      id:'a1-u4', icon:'🍕', title:'Essen und Trinken',
      desc:'Lebensmittel, Bestellungen, Rezepte.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'fill-blank', question:'Im Restaurant – ergänze.',
            parts:['Ich ', {blank:'möchte', hint:'хотів/ла б'}, ' bitte einen ', {blank:'Kaffee', hint:'кава'}, ' und ein ', {blank:'Stück', hint:'шматок'}, ' Kuchen.'],
            explanation:'möchte = я хотів би | Kaffee = кава | Stück = шматок' },
          { type:'multiple-choice', question:'Was isst man zum Frühstück in Deutschland typischerweise?',
            choices:['Borscht mit Brot','Brot mit Butter und Marmelade, Müsli','Pizza','Sushi'], correct:1,
            explanation:'Deutsches Frühstück: Brot, Brötchen, Butter, Marmelade, Müsli, Joghurt, Eier.' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Im Café',
            transcript:`<p><span class="speaker-name">Kellner:</span> Guten Tag! Was möchten Sie bestellen?</p>
<p><span class="speaker-name">Gast:</span> Ich hätte gerne einen Cappuccino und ein Stück Käsekuchen, bitte.</p>
<p><span class="speaker-name">Kellner:</span> Sehr gerne. Möchten Sie den Käsekuchen mit oder ohne Sahne?</p>
<p><span class="speaker-name">Gast:</span> Mit Sahne, bitte. Was kostet das zusammen?</p>
<p><span class="speaker-name">Kellner:</span> Das macht zusammen sechs Euro zwanzig.</p>`,
            questions:[
              { q:'Was bestellt der Gast zu trinken?', choices:['Latte','Espresso','Cappuccino','Tee'], correct:2 },
              { q:'Wie viel kostet alles?', choices:['5,20 €','6,00 €','6,20 €','7,20 €'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p>In Deutschland gibt es viele typische Gerichte. Ein bekanntes Gericht ist <strong>Schnitzel</strong> – das ist Fleisch, das man in Semmelbröseln paniert und brät. Sehr beliebt ist auch <strong>Sauerkraut</strong>, das ist fermentierter Kohl. Zum Nachtisch essen viele Deutsche gerne <strong>Schwarzwälder Kirschtorte</strong> – eine Torte mit Kirschen und Sahne. Und natürlich ist Deutschland berühmt für seine vielen Biersorten und seine Bäckereien mit frischem <strong>Brot</strong>.</p>`,
            questions:[
              { q:'Was ist Schnitzel?', choices:['Fermentierter Kohl','Paniertes gebratenes Fleisch','Eine Torte','Ein Bier'], correct:1 },
              { q:'Was ist Sauerkraut?', choices:['Süßes Gebäck','Fermentierter Kohl','Fruchtdessert','Wurst'], correct:1 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Du bist im Restaurant. Bestelle dein Lieblingsessen und erkläre warum du es magst.',
            tips:['Ich möchte / Ich hätte gerne …','Ich esse gerne …, weil es … schmeckt.','Das Lieblingsgericht heißt … Es besteht aus …'],
            example:'Ich möchte bitte eine Pizza Margherita. Ich esse gerne Pizza, weil sie sehr lecker schmeckt.' }
        ]}
      }
    },
  ]
},

/* ============================================================ A2 ============================================================ */
A2: {
  units: [
    {
      id:'a2-u1', icon:'🏠', title:'Wohnen und Wohnung',
      desc:'Wohnungssuche, Räume, Möbel beschreiben.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'fill-blank', question:'Ergänze die Wohnanzeige.',
            parts:['Schöne ', {blank:'Wohnung', hint:'квартира'}, ' zu ', {blank:'vermieten', hint:'здається'}, '. Drei ', {blank:'Zimmer', hint:'кімнати'}, ', Küche, Bad. Im 2. ', {blank:'Stockwerk', hint:'поверх'}, '. Warm- ', {blank:'miete', hint:'оренда'}, ' 850 Euro.'],
            explanation:'Wohnung = квартира | vermieten = здавати | Zimmer = кімната | Stockwerk = поверх | Warmmiete = включаючи комунальні' },
          { type:'multiple-choice', question:'Was bedeutet "Kaltmiete"?',
            choices:['Miete im Winter','Miete ohne Nebenkosten','Miete mit Heizung','Günstige Miete'], correct:1,
            explanation:'Kaltmiete = оренда без комунальних послуг. Warmmiete = Kaltmiete + Nebenkosten.' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Wohnungsbesichtigung',
            transcript:`<p><span class="speaker-name">Makler:</span> Herzlich willkommen! Das hier ist das Wohnzimmer. Es ist 20 Quadratmeter groß.</p>
<p><span class="speaker-name">Marta:</span> Sehr schön! Gibt es einen Balkon?</p>
<p><span class="speaker-name">Makler:</span> Ja, der Balkon ist direkt hier. Die Küche ist modern, mit Einbauküche. Das Badezimmer hat eine Dusche und eine Badewanne.</p>
<p><span class="speaker-name">Marta:</span> Und wie hoch ist die Miete?</p>
<p><span class="speaker-name">Makler:</span> Die Kaltmiete beträgt 750 Euro. Mit Nebenkosten sind es 950 Euro.</p>`,
            questions:[
              { q:'Wie groß ist das Wohnzimmer?', choices:['15 m²','18 m²','20 m²','25 m²'], correct:2 },
              { q:'Wie hoch ist die Warmmiete?', choices:['750 €','850 €','950 €','1050 €'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p><strong>Wohnen in Deutschland</strong></p>
<p>In deutschen Städten ist Wohnen sehr teuer. Besonders in München, Berlin und Frankfurt sind die Mieten hoch. Viele Menschen suchen auf Internetportalen wie <em>ImmoScout</em> oder <em>WG-Gesucht</em> nach Wohnungen. Eine <strong>WG</strong> (Wohngemeinschaft) ist sehr beliebt bei Studenten – das bedeutet, man teilt eine Wohnung mit anderen Personen. Das spart Geld und man ist nicht allein.</p>
<p>Beim Einzug muss man oft eine <strong>Kaution</strong> bezahlen – das sind meistens 2–3 Monatsmieten. Man bekommt die Kaution zurück, wenn man die Wohnung sauber hinterlässt.</p>`,
            questions:[
              { q:'Was ist eine WG?', choices:['Eine Wohnung allein','Eine gemeinsame Wohnung','Ein Haus mit Garten','Eine teure Wohnung'], correct:1 },
              { q:'Wie viele Monatsmieten beträgt die Kaution normalerweise?', choices:['1','2–3','4–5','6'], correct:1 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Beschreibe deine aktuelle Wohnung oder Traumwohnung. Wie viele Zimmer? Was ist drin? Wo ist sie?',
            tips:['Meine Wohnung hat … Zimmer.','Es gibt eine Küche, ein Badezimmer …','Ich wohne im … Stockwerk.','Die Wohnung ist … (groß/klein/hell/gemütlich).'],
            example:'Ich wohne in einer 2-Zimmer-Wohnung. Es gibt ein Schlafzimmer, ein Wohnzimmer, eine Küche und ein Bad. Meine Wohnung ist hell und gemütlich.' }
        ]}
      }
    },
    {
      id:'a2-u2', icon:'🛒', title:'Einkaufen und Geld',
      desc:'Preise, Größen, Reklamationen.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'fill-blank', question:'Beim Einkauf – ergänze.',
            parts:['Kann ich ', {blank:'bitte', hint:'будь ласка'}, ' die ', {blank:'Quittung', hint:'чек'}, ' haben? Ich möchte dieses ', {blank:'Hemd', hint:'сорочка'}, ' ', {blank:'umtauschen', hint:'обміняти'}, '. Es ist leider zu ', {blank:'klein', hint:'мале'}, '.'],
            explanation:'Quittung = чек | Hemd = сорочка | umtauschen = обміняти | klein = мале' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Im Kleidungsgeschäft',
            transcript:`<p><span class="speaker-name">Verkäuferin:</span> Kann ich Ihnen helfen?</p>
<p><span class="speaker-name">Kundin:</span> Ja, bitte. Ich suche eine Jacke für den Winter. Haben Sie etwas in Größe 38?</p>
<p><span class="speaker-name">Verkäuferin:</span> Ja, wir haben diese blaue Jacke hier. Sie kostet 89 Euro. Möchten Sie sie anprobieren?</p>
<p><span class="speaker-name">Kundin:</span> Gerne! … Sie passt sehr gut. Aber gibt es sie auch in Schwarz?</p>
<p><span class="speaker-name">Verkäuferin:</span> Die schwarze Jacke kostet leider 15 Euro mehr.</p>`,
            questions:[
              { q:'Welche Größe sucht die Kundin?', choices:['36','38','40','42'], correct:1 },
              { q:'Wie viel kostet die schwarze Jacke?', choices:['89 €','99 €','104 €','109 €'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p>In Deutschland gibt es viele verschiedene <strong>Einkaufsmöglichkeiten</strong>. Im <em>Supermarkt</em> kauft man täglich Lebensmittel. Auf dem <em>Wochenmarkt</em> findet man frisches Gemüse und Obst direkt von Bauern. In <em>Kaufhäusern</em> wie Karstadt oder Galeria kauft man Kleidung, Elektrogeräte und mehr.</p>
<p>Beim Bezahlen kann man in Deutschland oft noch mit <strong>Bargeld</strong> zahlen – Deutschland ist bekannt dafür, dass viele Menschen lieber bar bezahlen. Mit <strong>EC-Karte</strong> oder <strong>Kreditkarte</strong> geht es aber auch fast überall.</p>`,
            questions:[
              { q:'Wo kauft man frisches Gemüse direkt von Bauern?', choices:['Im Supermarkt','Im Kaufhaus','Auf dem Wochenmarkt','Im Internet'], correct:2 },
              { q:'Womit bezahlen viele Deutsche gerne?', choices:['Kreditkarte','Bitcoin','Bargeld','Per Rechnung'], correct:2 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Du möchtest ein Kleidungsstück umtauschen. Übe das Gespräch mit dem Verkäufer.',
            tips:['Ich habe dieses/diese … gekauft.','Es ist leider zu groß/zu klein/kaputt.','Kann ich es umtauschen / zurückgeben?','Haben Sie eine Quittung?'],
            example:'Guten Tag! Ich habe diese Jacke letzte Woche gekauft. Sie ist leider zu klein. Kann ich sie umtauschen? Hier ist die Quittung.' }
        ]}
      }
    },
  ]
},

/* ============================================================ B1 ============================================================ */
B1: {
  units: [
    {
      id:'b1-u1', icon:'✈️', title:'Reisen und Tourismus',
      desc:'Reisepläne, Unterkunft, Beschwerden, Sehenswürdigkeiten.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'fill-blank', question:'Eine Hotelbeschwerde – ergänze.',
            parts:['Sehr ', {blank:'geehrte', hint:'шановна'}, ' Damen und Herren,\nih möchte mich über mein Zimmer ', {blank:'beschweren', hint:'поскаржитися'}, '. Die Klimaanlage ', {blank:'funktioniert', hint:'працює'}, ' nicht und das Zimmer war nicht ', {blank:'sauber', hint:'чисто'}, '. Ich bitte um eine ', {blank:'Lösung', hint:'рішення'}, '.'],
            explanation:'geehrte = шановна | beschweren = скаржитися | funktioniert = працює | sauber = чисто' },
          { type:'free-write', question:'Schreibe eine E-Mail an ein Hotel: Du möchtest ein Zimmer für 3 Nächte buchen. Frage nach dem Preis, Frühstück und Parkmöglichkeiten. (Min. 60 Wörter)',
            minWords:50, placeholder:'Betreff: Zimmerreservierung\n\nSehr geehrte Damen und Herren,\n\nIch möchte ein Zimmer für … buchen …',
            tip:'Struktur: Anrede → Buchungswunsch → Fragen → Freundlicher Abschluss' },
          { type:'reorder', question:'Bringe die Sätze in logische Reihenfolge.',
            words:['Zunächst','Danach','Am Ende','Zuerst'],
            sentence:'___ checken wir im Hotel ein. ___ besuchen wir die Altstadt. ___ essen wir in einem Restaurant. ___ fahren wir zurück.',
            answer:'Zuerst checken wir im Hotel ein. Danach besuchen wir die Altstadt. Anschließend essen wir in einem Restaurant. Am Ende fahren wir zurück.',
            tip:'Reihenfolge: Zuerst → Danach → Anschließend → Am Ende / Schließlich' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Am Bahnhof',
            transcript:`<p><span class="speaker-name">Reisende:</span> Guten Tag! Ich möchte eine Fahrkarte nach Hamburg kaufen. Wann fährt der nächste Zug?</p>
<p><span class="speaker-name">Mitarbeiter:</span> Der nächste Zug nach Hamburg fährt um 14:32 Uhr von Gleis 7. Das ist ein ICE, die Fahrtzeit beträgt etwa 1 Stunde 45 Minuten.</p>
<p><span class="speaker-name">Reisende:</span> Gibt es noch Plätze in der zweiten Klasse?</p>
<p><span class="speaker-name">Mitarbeiter:</span> Ja, Sie können noch einen Fensterplatz reservieren. Möchten Sie ein Hin- und Rückfahrticket oder nur einfach?</p>
<p><span class="speaker-name">Reisende:</span> Hin und zurück, bitte. Was kostet das mit Bahncard 25?</p>
<p><span class="speaker-name">Mitarbeiter:</span> Mit Bahncard 25 kostet das Ticket 67 Euro 50.</p>`,
            questions:[
              { q:'Um wie viel Uhr fährt der Zug?', choices:['13:32','14:23','14:32','15:32'], correct:2 },
              { q:'Wie lange dauert die Fahrt?', choices:['1h 15min','1h 45min','2h','2h 15min'], correct:1 },
              { q:'Was kostet das Ticket mit Bahncard 25?', choices:['57,50 €','65 €','67,50 €','75 €'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p><strong>München – die bayerische Hauptstadt</strong></p>
<p>München ist die drittgrößte Stadt Deutschlands und die Hauptstadt des Freistaats Bayern. Die Stadt ist bekannt für ihr <em>Oktoberfest</em>, das größte Volksfest der Welt. Jedes Jahr im September und Oktober kommen über sechs Millionen Besucher aus aller Welt in die Stadt.</p>
<p>Zu den wichtigsten <strong>Sehenswürdigkeiten</strong> gehören der Marienplatz mit dem Neuen Rathaus, der Englische Garten – einer der größten Stadtparks der Welt – und das Deutsche Museum. Wer Kunst liebt, besucht die Pinakothek.</p>
<p>München ist auch ein wichtiges Wirtschaftszentrum. Große Unternehmen wie BMW und Siemens haben hier ihren Sitz. Die Lebenshaltungskosten in München sind jedoch sehr hoch – besonders die <strong>Mieten</strong> sind bekannt dafür, zu den teuersten in Deutschland zu gehören.</p>`,
            questions:[
              { q:'Wie viele Besucher kommen jährlich zum Oktoberfest?', choices:['3 Mio.','4,5 Mio.','6 Mio.','8 Mio.'], correct:2 },
              { q:'Was ist der Englische Garten?', choices:['Ein botanischer Garten','Einer der größten Stadtparks der Welt','Ein Park in England','Ein Museum'], correct:1 },
              { q:'Welches Unternehmen hat seinen Sitz in München?', choices:['Volkswagen','Bosch','BMW','Mercedes'], correct:2 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Erzähle von deiner Lieblingsreise oder beschreibe eine Reise, die du gerne machen würdest. Wohin? Wie lange? Was würdest du machen?',
            tips:['Ich würde gerne nach … reisen.','Die Reise würde … Tage dauern.','Ich möchte … besichtigen / besuchen / erleben.','Das Wetter dort ist … und das Essen ist …'],
            example:'Ich würde gerne nach Wien reisen. Die Stadt ist sehr schön und historisch. Ich würde das Schloss Schönbrunn besichtigen und Kaffee im Café Central trinken. Die Reise würde 5 Tage dauern.' },
          { type:'dialogue', prompt:'Gespräch an der Hotelrezeption',
            lines:[
              {speaker:'Rezeption', text:'Guten Abend! Willkommen. Haben Sie eine Reservierung?', side:'left'},
              {speaker:'Gast', text:'Ja, ich habe ein Zimmer für zwei Nächte auf den Namen Petrenko reserviert.', side:'right'},
              {speaker:'Rezeption', text:'Einen Moment … Ja, Zimmer 215 im zweiten Stock. Mit Frühstück, richtig?', side:'left'},
              {speaker:'Gast', text:'Genau. Um wie viel Uhr gibt es Frühstück?', side:'right'},
              {speaker:'Rezeption', text:'Das Frühstück wird von 7 bis 10 Uhr serviert. Hier ist Ihr Schlüssel.', side:'left'},
              {speaker:'Gast', text:'Vielen Dank! Können Sie mir ein gutes Restaurant empfehlen?', side:'right'},
            ]
          }
        ]}
      }
    },
    {
      id:'b1-u2', icon:'💼', title:'Beruf und Bewerbung',
      desc:'Lebenslauf, Vorstellungsgespräch, Berufe beschreiben.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'free-write', question:'Schreibe ein kurzes Anschreiben für eine Stelle als Verkäuferin/Verkäufer. (Min. 80 Wörter)',
            minWords:70, placeholder:'Sehr geehrte Damen und Herren,\n\nmit großem Interesse habe ich Ihre Stellenanzeige gelesen …',
            tip:'Struktur: Warum interessierst du dich? → Was kannst du? → Wann kannst du anfangen? → Abschlussformel' },
          { type:'fill-blank', question:'Ergänze das Vorstellungsgespräch.',
            parts:['Ich habe drei Jahre ', {blank:'Erfahrung', hint:'досвід'}, ' als Kellnerin. Meine ', {blank:'Stärken', hint:'сильні сторони'}, ' sind Teamarbeit und Kundenorientierung. Ich ', {blank:'spreche', hint:'говорю'}, ' Ukrainisch, Russisch und Deutsch auf B1-Niveau.'],
            explanation:'Erfahrung = досвід | Stärken = сильні сторони | spreche = говорю' },
          { type:'multiple-choice', question:'Welche Frage ist im Vorstellungsgespräch NICHT passend?',
            choices:['Was sind meine Aufgaben?','Wie hoch ist das Gehalt?','Wie alt sind Ihre Kinder?','Welche Entwicklungsmöglichkeiten gibt es?'], correct:2,
            explanation:'Nach dem Alter der Kinder oder der Familie des Arbeitgebers zu fragen ist unhöflich und irrelevant im deutschen Kontext.' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Vorstellungsgespräch',
            transcript:`<p><span class="speaker-name">HR:</span> Guten Morgen, Frau Petrenko. Bitte nehmen Sie Platz.</p>
<p><span class="speaker-name">Diana:</span> Guten Morgen. Vielen Dank für die Einladung.</p>
<p><span class="speaker-name">HR:</span> Können Sie sich kurz vorstellen?</p>
<p><span class="speaker-name">Diana:</span> Natürlich. Ich heiße Diana Petrenko, bin 24 Jahre alt und komme ursprünglich aus der Ukraine. Ich habe einen Abschluss in Betriebswirtschaft und zwei Jahre Erfahrung im Kundenservice.</p>
<p><span class="speaker-name">HR:</span> Warum bewerben Sie sich bei uns?</p>
<p><span class="speaker-name">Diana:</span> Ihr Unternehmen ist sehr innovativ und ich möchte in einem internationalen Team arbeiten. Außerdem passt die Stelle perfekt zu meiner Ausbildung.</p>
<p><span class="speaker-name">HR:</span> Was sind Ihre größten Stärken?</p>
<p><span class="speaker-name">Diana:</span> Ich bin sehr organisiert, zuverlässig und lerne schnell. Außerdem spreche ich vier Sprachen.</p>`,
            questions:[
              { q:'Wie viele Jahre Erfahrung hat Diana im Kundenservice?', choices:['1 Jahr','2 Jahre','3 Jahre','4 Jahre'], correct:1 },
              { q:'Welchen Abschluss hat Diana?', choices:['Informatik','Medizin','Betriebswirtschaft','Jura'], correct:2 },
              { q:'Wie viele Sprachen spricht Diana?', choices:['2','3','4','5'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p><strong>Der deutsche Arbeitsmarkt</strong></p>
<p>Deutschland hat eine der stärksten Volkswirtschaften der Welt. Der Arbeitsmarkt bietet viele Möglichkeiten, besonders in den Bereichen <em>Ingenieurwesen</em>, <em>Gesundheit</em>, <em>IT</em> und <em>Pflege</em>. Der Fachkräftemangel bedeutet, dass Deutschland dringend qualifizierte Arbeitskräfte braucht – auch aus dem Ausland.</p>
<p>Für eine Bewerbung in Deutschland braucht man normalerweise einen <strong>Lebenslauf</strong> (CV) und ein <strong>Anschreiben</strong>. Deutsche Lebensläufe sind sehr strukturiert und enthalten oft ein Foto. Das Anschreiben soll zeigen, warum man für genau diese Stelle geeignet ist.</p>
<p>Die <strong>Arbeitszeit</strong> beträgt in Deutschland in der Regel 38–40 Stunden pro Woche. Jeder Arbeitnehmer hat Anspruch auf mindestens 24 Tage <strong>Urlaub</strong> pro Jahr.</p>`,
            questions:[
              { q:'In welchem Bereich gibt es laut Text viele Stellen?', choices:['Kunst','Pflege','Tourismus','Landwirtschaft'], correct:1 },
              { q:'Was enthält ein deutscher Lebenslauf oft?', choices:['Ein Foto','Einen Businessplan','Zeugnisse','Referenzen'], correct:0 },
              { q:'Wie viele Urlaubstage hat man mindestens?', choices:['14','20','24','30'], correct:2 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Stell dir vor, du bist im Vorstellungsgespräch. Beantworte diese typische Frage: „Wo sehen Sie sich in 5 Jahren?"',
            tips:['In 5 Jahren möchte ich …','Mein Ziel ist es, …','Ich würde gerne … werden/erreichen.','Ich hoffe, …'],
            example:'In fünf Jahren möchte ich eine Führungsposition übernehmen. Ich hoffe, mein Deutsch bis C1 zu verbessern und mich im Bereich Marketing weiterzuentwickeln. Außerdem würde ich gerne eine Ausbildung oder Weiterbildung abschließen.' }
        ]}
      }
    },
    {
      id:'b1-u3', icon:'🌍', title:'Umwelt und Natur',
      desc:'Klimawandel, Recycling, Umweltschutz diskutieren.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'multiple-choice', question:'Welches Wort passt? „Deutschland hat ein sehr entwickeltes System für _______."',
            choices:['Recycling und Mülltrennung','Fischen und Jagen','Autofahren','Einkaufen'], correct:0,
            explanation:'Deutschland trennt Müll in: Gelber Sack (Plastik/Metall), Blauer Behälter (Papier), Grüner Behälter (Glas), Braune Tonne (Biomüll), Graue Tonne (Restmüll).' },
          { type:'free-write', question:'Schreibe einen kurzen Text (60–80 Wörter): Was kannst du persönlich für die Umwelt tun?',
            minWords:50, placeholder:'Ich kann viel für die Umwelt tun. Zum Beispiel …',
            tip:'Ideen: weniger Plastik, öffentliche Verkehrsmittel, Strom sparen, regional einkaufen, Müll trennen' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Diskussion: Klimawandel',
            transcript:`<p><span class="speaker-name">Moderator:</span> Was halten Sie persönlich vom Klimawandel?</p>
<p><span class="speaker-name">Anna:</span> Ich glaube, der Klimawandel ist das größte Problem unserer Zeit. Wir müssen sofort handeln.</p>
<p><span class="speaker-name">Klaus:</span> Ich stimme zu, aber ich denke, die Regierungen müssen handeln, nicht nur die einzelnen Bürger.</p>
<p><span class="speaker-name">Anna:</span> Ja, aber jeder kann etwas tun. Ich fahre mit dem Fahrrad, kaufe regional ein und vermeide Plastik.</p>
<p><span class="speaker-name">Klaus:</span> Das ist gut, aber ohne große politische Entscheidungen wie CO2-Steuern wird es nicht reichen.</p>`,
            questions:[
              { q:'Was sagt Anna über den Klimawandel?', choices:['Er ist nicht wichtig','Er ist das größte Problem unserer Zeit','Er ist übertrieben','Er ist ein kleines Problem'], correct:1 },
              { q:'Was macht Anna persönlich für die Umwelt?', choices:['Sie fliegt weniger','Sie fährt Fahrrad und kauft regional','Sie isst kein Fleisch','Sie demonstriert'], correct:1 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p><strong>Mülltrennung in Deutschland</strong></p>
<p>Deutschland ist weltweit führend beim Recycling. Fast <strong>67%</strong> des Mülls werden wiederverwertet – das ist einer der höchsten Werte der Welt. Das System der <em>Mülltrennung</em> ist für Neuankömmlinge oft verwirrend, aber sehr wichtig.</p>
<p>Es gibt verschiedene <strong>Mülltonnen</strong>: Die <em>blaue</em> Tonne ist für Papier und Pappe. Die <em>gelbe</em> Tonne (oder der gelbe Sack) nimmt Plastik, Metall und Verbundmaterialien. Die <em>braune</em> Tonne ist für Bioabfall wie Gemüseschalen oder Essensreste. Die <em>graue</em> Tonne ist für Restmüll. Glas wird nach Farben getrennt – weiß, grün und braun – und in spezielle Container geworfen.</p>
<p>Viele Flaschen haben ein <strong>Pfand</strong> – man zahlt bei Kauf 15 bis 25 Cent extra und bekommt das Geld zurück, wenn man die Flasche zurückbringt.</p>`,
            questions:[
              { q:'Wie viel Prozent des Mülls werden in Deutschland recycelt?', choices:['45%','55%','67%','80%'], correct:2 },
              { q:'Welche Farbe hat die Tonne für Papier?', choices:['Gelb','Braun','Grau','Blau'], correct:3 },
              { q:'Was ist das „Pfand"?', choices:['Ein Bußgeld','Eine Steuer','Ein Pflichtzuschlag mit Rückgabe','Ein Bonus'], correct:2 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Diskutiere das Thema: „Sollte man für Plastiktüten zahlen müssen?" – Gib Argumente für und gegen.',
            tips:['Pro: Die Umwelt wird geschützt, weniger Plastik …','Contra: Es ist eine Zusatzbelastung für …','Meiner Meinung nach …','Einerseits … andererseits …','Ich bin der Ansicht, dass …'],
            example:'Meiner Meinung nach sollte man für Plastiktüten zahlen, weil das die Menschen motiviert, Taschen mitzubringen. Einerseits hilft das der Umwelt. Andererseits könnte es für arme Menschen eine Belastung sein.' }
        ]}
      }
    },
    {
      id:'b1-u4', icon:'📺', title:'Medien und Kommunikation',
      desc:'Social Media, Nachrichten lesen, Meinungen ausdrücken.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'fill-blank', question:'Ergänze den Text über Social Media.',
            parts:['Soziale ', {blank:'Medien', hint:'ЗМІ'}, ' haben unsere Kommunikation stark ', {blank:'verändert', hint:'змінили'}, '. Viele Menschen ', {blank:'teilen', hint:'діляться'}, ' täglich Fotos und ', {blank:'Meinungen', hint:'думки'}, ' online. Das hat Vor- und ', {blank:'Nachteile', hint:'недоліки'}, '.'],
            explanation:'Medien = ЗМІ | verändert = змінили | teilen = ділитися | Meinungen = думки | Nachteile = недоліки' },
          { type:'free-write', question:'Kommentar schreiben: Ein Freund sagt „Ich verbringe 5 Stunden täglich auf Instagram." Schreibe einen Rat (50–70 Wörter).',
            minWords:45, placeholder:'Ich verstehe, dass Social Media Spaß macht, aber …',
            tip:'Sei freundlich aber ehrlich. Verwende: „Ich würde empfehlen …", „Vielleicht könntest du …", „Es wäre gut, wenn …"' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Podcast: Fake News',
            transcript:`<p><span class="speaker-name">Moderatorin:</span> Willkommen zu unserem Podcast! Heute sprechen wir über Fake News. Was sind eigentlich Fake News?</p>
<p><span class="speaker-name">Experte:</span> Fake News sind falsche oder irreführende Informationen, die bewusst verbreitet werden, um Menschen zu täuschen oder zu manipulieren.</p>
<p><span class="speaker-name">Moderatorin:</span> Wie kann man Fake News erkennen?</p>
<p><span class="speaker-name">Experte:</span> Es gibt einige wichtige Tipps. Erstens: Überprüfen Sie immer die Quelle. Ist die Webseite seriös? Zweitens: Suchen Sie nach weiteren Berichten zu demselben Thema. Drittens: Seien Sie skeptisch bei sehr emotionalen Überschriften. Und viertens: Nutzen Sie Faktencheck-Webseiten wie Correctiv oder Snopes.</p>`,
            questions:[
              { q:'Was sind Fake News laut dem Experten?', choices:['Satire-Artikel','Fehler von Journalisten','Bewusst falsche oder irreführende Informationen','Alte Nachrichten'], correct:2 },
              { q:'Welche Empfehlung gibt der Experte NICHT?', choices:['Quellen überprüfen','Faktencheck-Seiten nutzen','Nur lokale Nachrichten lesen','Nach weiteren Berichten suchen'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p><strong>Digitale Medien und ihre Wirkung</strong></p>
<p>Die Deutschen nutzen digitale Medien intensiv. Laut aktuellen Studien verbringen Erwachsene durchschnittlich über <strong>drei Stunden täglich</strong> im Internet. Besonders beliebt sind <em>YouTube, Instagram und WhatsApp</em>.</p>
<p>Kritiker warnen vor den negativen Auswirkungen: Zu viel Bildschirmzeit kann zu <em>Schlafproblemen, Konzentrationsmangel und soziale Isolation</em> führen. Besonders bei Kindern und Jugendlichen ist das ein großes Thema.</p>
<p>Auf der anderen Seite bieten digitale Medien enorme Vorteile: <strong>schneller Informationszugang</strong>, globale Vernetzung, neue Lernmöglichkeiten und wirtschaftliche Chancen. Die Herausforderung liegt darin, einen gesunden <em>Ausgleich</em> zu finden.</p>`,
            questions:[
              { q:'Wie viel Zeit verbringen Deutsche durchschnittlich täglich im Internet?', choices:['1 Stunde','2 Stunden','Über 3 Stunden','5 Stunden'], correct:2 },
              { q:'Was kann zu viel Bildschirmzeit laut Text verursachen?', choices:['Bessere Konzentration','Schlafprobleme','Mehr soziale Kontakte','Höhere Produktivität'], correct:1 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Thema für 2 Minuten: Wie haben soziale Medien dein Leben verändert? Positiv und negativ.',
            tips:['Früher … jetzt …','Dank Social Media kann ich …','Ein Nachteil ist, dass …','Ich verbringe … Stunden täglich auf …','Ich finde, dass …'],
            example:'Soziale Medien haben mein Leben sehr verändert. Dank Instagram kann ich mit Freunden in der Ukraine in Kontakt bleiben. Das ist sehr positiv. Ein Nachteil ist, dass ich manchmal zu viel Zeit damit verbringe und ablenkbar werde.' }
        ]}
      }
    },
    {
      id:'b1-u5', icon:'📝', title:'B1-Prüfungsvorbereitung',
      desc:'Alle Prüfungsteile: Schreiben, Hören, Lesen, Sprechen.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'free-write', question:'Prüfungsaufgabe Schreiben Teil 1: Du hast in einer Zeitung gelesen, dass deine Stadt den öffentlichen Park schließen möchte, um dort ein Einkaufszentrum zu bauen. Schreibe einen Brief an die Stadtzeitung (80–100 Wörter). Erkläre, warum du dafür oder dagegen bist.',
            minWords:75, placeholder:'Sehr geehrte Redaktion,\n\nIch habe Ihren Artikel über den Park gelesen und möchte meine Meinung dazu äußern …',
            tip:'Tipps für B1-Brief: Anrede → Bezug auf das Thema → Deine Meinung mit 2 Argumenten → Wunsch/Forderung → Abschluss' },
          { type:'free-write', question:'Prüfungsaufgabe Schreiben Teil 2: Schreibe über das Thema „Gesunde Ernährung" (80+ Wörter). Was bedeutet gesunde Ernährung für dich? Was isst du gerne? Was sollte man vermeiden?',
            minWords:70, placeholder:'Gesunde Ernährung ist für mich sehr wichtig …',
            tip:'Verwende Konnektoren: weil, deshalb, obwohl, außerdem, jedoch, einerseits/andererseits' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'B1-Prüfung Hören – Ansagen',
            transcript:`<p><strong>Ansage 1:</strong></p>
<p>Achtung, Durchsage! Der ICE 507 von Frankfurt nach München hat heute leider 25 Minuten Verspätung. Die Abfahrt ist nun um 15:47 Uhr von Gleis 12. Wir bitten um Ihr Verständnis.</p>
<p><strong>Ansage 2:</strong></p>
<p>Das Kaufhaus Müller hat ab sofort neue Öffnungszeiten. Wir sind montags bis samstags von 9 bis 20 Uhr für Sie geöffnet. Sonntags bleibt unser Geschäft geschlossen. Wir freuen uns auf Ihren Besuch!</p>
<p><strong>Ansage 3:</strong></p>
<p>Liebe Kursteilnehmerinnen und Kursteilnehmer, der Deutschkurs am Dienstagabend muss leider auf Mittwoch, den 15. Mai um 18 Uhr verlegt werden. Der Unterrichtsraum bleibt derselbe: Raum 204.</p>`,
            questions:[
              { q:'Wie viel Verspätung hat der ICE 507?', choices:['10 Minuten','15 Minuten','20 Minuten','25 Minuten'], correct:3 },
              { q:'Wann ist das Kaufhaus Müller samstags geöffnet?', choices:['8–18 Uhr','9–19 Uhr','9–20 Uhr','10–20 Uhr'], correct:2 },
              { q:'Wann findet der verlegte Deutschkurs statt?', choices:['Dienstag 18 Uhr','Mittwoch 17 Uhr','Mittwoch 18 Uhr','Donnerstag 18 Uhr'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p><strong>TIPPS FÜR DIE B1-PRÜFUNG</strong></p>
<p><strong>Teil 1 – Lesen:</strong> Lies den Text zuerst schnell durch, um den Hauptinhalt zu verstehen. Dann lies die Fragen und suche die Antworten im Text. Lass dich nicht von unbekannten Wörtern entmutigen – oft kann man sie aus dem Kontext erschließen.</p>
<p><strong>Teil 2 – Hören:</strong> Konzentriere dich auf Schlüsselwörter: Zahlen, Namen, Daten. Mach dir kurze Notizen während des Hörens. Du hörst die Texte meist zweimal.</p>
<p><strong>Teil 3 – Schreiben:</strong> Plane deinen Text zuerst (2–3 Minuten). Achte auf Struktur: Einleitung, Hauptteil, Schluss. Verwende Konnektoren (weil, deshalb, obwohl). Überprüfe am Ende Grammatik und Rechtschreibung.</p>
<p><strong>Teil 4 – Sprechen:</strong> Sprich laut und deutlich. Ist eine Pause unvermeidlich, sage: „Moment bitte, ich überlege kurz." Reagiere auf deinen Partner. Benutze Redemittel für Meinungen: „Ich finde, dass …", „Meiner Meinung nach …"</p>`,
            questions:[
              { q:'Was soll man beim Lesen zuerst tun?', choices:['Die Fragen lesen','Den Text schnell durchlesen','Die Antworten ankreuzen','Unbekannte Wörter nachschlagen'], correct:1 },
              { q:'Welche Aussage über das Hören ist richtig?', choices:['Man hört den Text nur einmal','Man darf keine Notizen machen','Man hört die Texte meist zweimal','Man kann den Text lesen'], correct:2 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'B1 Sprechen Teil 2: Gemeinsam planen. Dein Freund und du möchtet ein Abschiedsfest für einen Kollegen organisieren. Sprecht über Ort, Essen, Aktivitäten und Budget.',
            tips:['Wie wäre es mit …?','Ich schlage vor, …','Was denkst du über …?','Das klingt gut! / Ich bin anderer Meinung, weil …','Einverstanden / Ich stimme zu.','Wir könnten … oder vielleicht …'],
            example:'Wie wäre es, wenn wir das Fest in einem Restaurant feiern? Ich schlage vor, dass jeder etwas mitbringt. Was denkst du über Spiele oder Musik? Ich bin der Meinung, dass wir ein Budget von 20 Euro pro Person festlegen sollten.' }
        ]}
      }
    },
  ]
},

/* ============================================================ B2 ============================================================ */
B2: {
  units: [
    {
      id:'b2-u1', icon:'🎓', title:'Bildung und Studium',
      desc:'Hochschule, Studienalltag, Bildungssystem.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'free-write', question:'Erörterung: „Sollte das Studium in Deutschland kostenlos sein?" Schreibe einen argumentativen Text (120–150 Wörter) mit Pro- und Kontra-Argumenten.',
            minWords:100, placeholder:'Das Thema „kostenloses Studium" wird in Deutschland oft diskutiert …',
            tip:'Struktur: These → Argumente Pro → Argumente Contra → Eigene Meinung/Fazit. Nutze: Zum einen …, Zum anderen …, Allerdings …, Zusammenfassend …' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Radiointerview: Bildung in Deutschland',
            transcript:`<p><span class="speaker-name">Moderator:</span> Guten Tag! Wir sprechen heute mit Professorin Bergmann über das deutsche Bildungssystem. Frau Bergmann, wie würden Sie das System beschreiben?</p>
<p><span class="speaker-name">Prof. Bergmann:</span> Das deutsche Bildungssystem ist komplex aber qualitativ hochwertig. Nach der Grundschule wechseln Schüler in verschiedene Schultypen: Hauptschule, Realschule oder Gymnasium. Nur das Gymnasium führt direkt zum Abitur, das für ein Hochschulstudium berechtigt.</p>
<p><span class="speaker-name">Moderator:</span> Was ist besonders an deutschen Universitäten?</p>
<p><span class="speaker-name">Prof. Bergmann:</span> Die Studiengebühren sind sehr niedrig im Vergleich zu anderen Ländern. In den meisten Bundesländern zahlt man nur einen Semesterbeitrag von etwa 200-350 Euro. Dafür erhält man meist auch ein Semesterticket für den öffentlichen Nahverkehr.</p>`,
            questions:[
              { q:'Welche Schulform führt direkt zum Abitur?', choices:['Hauptschule','Realschule','Gesamtschule','Gymnasium'], correct:3 },
              { q:'Wie hoch ist der typische Semesterbeitrag?', choices:['50-100 €','200-350 €','500-800 €','1000+ €'], correct:1 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p><strong>Das duale Ausbildungssystem Deutschlands</strong></p>
<p>Eine Besonderheit des deutschen Bildungssystems ist das <em>duale Ausbildungssystem</em>. Es kombiniert praktische Berufsausbildung im Betrieb mit theoretischem Unterricht in der Berufsschule. Dieses System gilt weltweit als Vorbild und wird in vielen Ländern kopiert.</p>
<p>Die Ausbildung dauert je nach Beruf <strong>zwei bis dreieinhalb Jahre</strong>. Während dieser Zeit erhalten Auszubildende ein Gehalt – das sogenannte <em>Ausbildungsvergütung</em>. Das Gehalt variiert stark je nach Branche: von etwa 500 Euro im Monat im Friseurhandwerk bis zu über 1.000 Euro in der Bankenbranche.</p>
<p>Nach der Ausbildung haben viele Absolventen sehr gute Chancen auf dem Arbeitsmarkt. In manchen Branchen übernehmen Betriebe bis zu <strong>70% ihrer Azubis</strong> fest.</p>`,
            questions:[
              { q:'Was kombiniert das duale Ausbildungssystem?', choices:['Studium und Praxis','Praxis im Betrieb und Theorie in der Berufsschule','Schule und Universität','Theorie und weitere Theorie'], correct:1 },
              { q:'Wie lange dauert eine duale Ausbildung maximal?', choices:['2 Jahre','3 Jahre','3,5 Jahre','4 Jahre'], correct:2 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Präsentiere das Thema: „Studium oder Berufsausbildung – was ist besser?" Gib eine strukturierte 2-Minuten-Präsentation.',
            tips:['Gliederung: Einleitung → Argumente für Studium → Argumente für Ausbildung → Fazit','Einleitung: „Heute möchte ich über … sprechen."','Übergänge: „Erstens … Zweitens … Abschließend …"','Fazit: „Zusammenfassend lässt sich sagen, dass …"'],
            example:'Heute möchte ich über die Frage sprechen, ob ein Studium oder eine Ausbildung sinnvoller ist. Erstens bietet ein Studium mehr theoretisches Wissen und bessere Karrierechancen in akademischen Bereichen. Andererseits ermöglicht eine Ausbildung schnelleren Berufseinstieg und praktische Erfahrung. Zusammenfassend denke ich, dass es auf die individuellen Ziele ankommt.' }
        ]}
      }
    },
  ]
},

/* ============================================================ C1 ============================================================ */
C1: {
  units: [
    {
      id:'c1-u1', icon:'📜', title:'Akademisches Schreiben',
      desc:'Wissenschaftliche Texte, Argumentationen, Quellenangaben.',
      skills:{
        schreiben:{ title:'Schreiben üben', exercises:[
          { type:'free-write', question:'Verfasse eine akademische Einleitung (150–200 Wörter) zum Thema: „Der Einfluss der Digitalisierung auf den Arbeitsmarkt". Verwende akademischen Stil, Passivkonstruktionen und Konnektoren.',
            minWords:130, placeholder:'Die fortschreitende Digitalisierung stellt den modernen Arbeitsmarkt vor grundlegende Herausforderungen …',
            tip:'Akademischer Stil: Passiv verwenden (wird untersucht, kann festgestellt werden), Nominalstil (die Untersuchung, die Analyse), objektiver Ton, keine Ich-Form' },
        ]},
        hoeren:{ title:'Hören', exercises:[
          { type:'listening', title:'Vorlesung: Globalisierung',
            transcript:`<p><span class="speaker-name">Professor:</span> Sehr geehrte Studierende, heute setzen wir unser Seminar zur Globalisierung fort. Wir betrachten insbesondere die wirtschaftlichen Folgen für Entwicklungsländer.</p>
<p>Die Globalisierung hat zweifelsohne zu einem beispiellosen Wirtschaftswachstum in einigen Schwellenländern geführt – man denke an China, Indien oder Brasilien. Gleichzeitig hat sie bestehende Ungleichheiten innerhalb von Gesellschaften verschärft. Der sogenannte „race to the bottom" beschreibt das Phänomen, bei dem Länder im Wettbewerb um ausländische Investitionen Sozial- und Umweltstandards senken.</p>
<p>Kritisch anzumerken ist, dass die Vorteile der Globalisierung ungleich verteilt sind. Multinationale Konzerne und qualifizierte Arbeitnehmer profitieren überproportional, während gering qualifizierte Arbeiter in Industrieländern unter dem Druck günstigerer Arbeitskräfte leiden.</p>`,
            questions:[
              { q:'Was beschreibt der Begriff „race to the bottom"?', choices:['Wirtschaftswachstum in Entwicklungsländern','Senkung von Standards im Wettbewerb um Investitionen','Ungleiche Verteilung von Gewinnen','Migration qualifizierter Arbeitnehmer'], correct:1 },
              { q:'Wer profitiert laut dem Professor überproportional von der Globalisierung?', choices:['Gering qualifizierte Arbeiter','Alle Gesellschaftsschichten gleichmäßig','Multinationale Konzerne und qualifizierte Arbeitnehmer','Nur Entwicklungsländer'], correct:2 },
            ]
          }
        ]},
        lesen:{ title:'Lesen und Verstehen', exercises:[
          { type:'reading',
            text:`<p><strong>Zur Problematik des Klimadiskurses</strong></p>
<p>Der öffentliche Diskurs über den Klimawandel ist von einer eigentümlichen Spannung geprägt: Während der wissenschaftliche Konsens über die anthropogene Ursache des Klimawandels nahezu vollständig ist, persistiert eine gesellschaftliche Debatte, die diesen Konsens in Frage stellt. Diese Diskrepanz lässt sich durch verschiedene Faktoren erklären.</p>
<p>Zunächst ist auf die komplexe Informationslandschaft hinzuweisen, in der meinungsbildende Akteure – von Interessengruppen der fossilen Energiewirtschaft bis hin zu politischen Bewegungen – gezielt Zweifel säen. Dies geschieht nicht selten durch die rhetorische Strategie des „False Balance", bei der marginale Gegenstimmen mit dem wissenschaftlichen Mainstream gleichgestellt werden.</p>
<p>Darüber hinaus erschwert die kognitive Komplexität des Klimasystems ein intuitives Verständnis der Zusammenhänge. Menschen neigen dazu, unmittelbar erlebbare Ereignisse stärker zu gewichten als abstrakte Langzeittrends – eine evolutionär bedingte Tendenz, die dem Verständnis des schleichenden Klimawandels entgegenwirkt.</p>`,
            questions:[
              { q:'Was versteht man unter „False Balance" im Text?', choices:['Ausgewogene Berichterstattung','Gleichstellung von marginalen Gegenstimmen mit dem wissenschaftlichen Mainstream','Klimawandel-Leugnung','Politische Neutralität'], correct:1 },
              { q:'Welche menschliche Tendenz erschwert laut Text das Klimaverständnis?', choices:['Desinteresse an Wissenschaft','Unmittelbar erlebbare Ereignisse stärker zu gewichten als Langzeittrends','Medienkonsum','Politische Überzeugungen'], correct:1 },
            ]
          }
        ]},
        sprechen:{ title:'Sprechen üben', exercises:[
          { type:'speaking', prompt:'Halten Sie ein strukturiertes 3-Minuten-Referat über ein komplexes gesellschaftliches Thema Ihrer Wahl (z.B. KI und Ethik, Migration, Demokratie). Verwenden Sie akademische Redemittel.',
            tips:['Einstieg: „Das Thema, das ich heute behandeln möchte, betrifft …"','Gliederung ankündigen: „Ich werde zunächst … und dann … erörtern."','Argumentation: „Dies lässt sich damit begründen, dass …"','Gegenargument: „Dieser Position lässt sich entgegenhalten, dass …"','Fazit: „Zusammenfassend lässt sich konstatieren, dass …"'],
            example:'Das Thema, das ich heute behandeln möchte, betrifft die ethischen Implikationen künstlicher Intelligenz. Ich werde zunächst die Chancen beleuchten und anschließend die Risiken erörtern. KI revolutioniert zweifellos medizinische Diagnostik und wissenschaftliche Forschung. Dem steht jedoch die problematische Frage der algorithmischen Diskriminierung gegenüber. Zusammenfassend lässt sich konstatieren, dass ein regulatorischer Rahmen unerlässlich ist.' }
        ]}
      }
    },
  ]
},

};
