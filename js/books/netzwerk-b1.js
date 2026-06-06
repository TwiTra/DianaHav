'use strict';

const BOOK_NETZWERK_B1 = {
  id: 'netzwerk-b1',
  title: 'Netzwerk B1 Neu',
  author: 'Stefanie Dengler, Paul Rusch, Helen Schmitz, Tanja Sieber',
  publisher: 'Klett-Langenscheidt',
  level: 'B1',
  color: '#8b5cf6',
  icon: '📗',
  desc: 'Das bewährte Lehrwerk für B1-Lernende – mit authentischen Texten, Hörtexten und gezielter Prüfungsvorbereitung für das Goethe-Zertifikat B1.',
  chapters: [
    {
      id: 'nb1-k01',
      number: 1,
      title: 'Neue Leute, neue Chancen',
      subtitle: 'Kennenlernen & Biografie',
      icon: '👋',
      grammarFocus: 'Konjunktiv II (Wünsche und Träume)',
      vocab: [
        { word: 'die Gelegenheit', translation: 'можливість / возможность', example: 'Das ist eine gute Gelegenheit, neue Leute kennenzulernen.' },
        { word: 'der Lebenslauf', translation: 'резюме / биография', example: 'Ihr Lebenslauf ist sehr interessant.' },
        { word: 'sich vorstellen', translation: 'представлятися / представляться', example: 'Darf ich mich kurz vorstellen?' },
        { word: 'beruflich', translation: 'професійно / профессионально', example: 'Was machen Sie beruflich?' },
        { word: 'die Erfahrung', translation: 'досвід / опыт', example: 'Ich habe viel Erfahrung in diesem Bereich.' },
        { word: 'die Herausforderung', translation: 'виклик / вызов', example: 'Der neue Job ist eine große Herausforderung.' },
        { word: 'sich bewerben', translation: 'подаватися / подаваться (на работу)', example: 'Sie bewirbt sich um eine neue Stelle.' },
        { word: 'das Vorstellungsgespräch', translation: 'співбесіда / собеседование', example: 'Morgen habe ich ein Vorstellungsgespräch.' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben',
          exercises: [
            {
              type: 'free-write',
              question: 'Schreibe eine kurze Vorstellung von dir (60–80 Wörter). Wer bist du? Woher kommst du? Was machst du beruflich oder in der Freizeit?',
              tip: 'Nutze: Ich heiße... / Ich komme aus... / Ich arbeite als... / In meiner Freizeit...',
              placeholder: 'Hallo, ich heiße...',
              minWords: 30
            },
            {
              type: 'fill-blank',
              question: 'Ergänze mit der richtigen Form von "sich vorstellen" oder "kennenlernen".',
              parts: [
                'Darf ich ', { blank: 'mich', hint: 'mich/dich' }, ' kurz ',
                { blank: 'vorstellen', hint: 'Verb' }, '? Ich bin Anna.'
              ],
              explanation: '"Sich vorstellen" bedeutet, den eigenen Namen und Informationen über sich zu sagen.'
            },
            {
              type: 'reorder',
              question: 'Bringe die Wörter in die richtige Reihenfolge.',
              words: ['ich', 'mich', 'Darf', 'vorstellen', 'kurz'],
              answer: 'Darf ich mich kurz vorstellen',
              tip: 'Das Verb steht an zweiter Stelle.'
            }
          ]
        },
        hoeren: {
          title: 'Hören',
          exercises: [
            {
              type: 'listening',
              title: 'Dialog: Erstes Treffen im Deutschkurs',
              transcript: '<b>Lehrerin:</b> Guten Morgen! Willkommen im Kurs. Ich bin Frau Müller. Wer möchte sich zuerst vorstellen?<br><b>Diana:</b> Gerne! Ich heiße Diana. Ich komme aus der Ukraine und wohne seit zwei Jahren in Deutschland.<br><b>Lehrerin:</b> Sehr schön! Was machen Sie beruflich, Diana?<br><b>Diana:</b> Ich bin Krankenschwester und arbeite in einem Krankenhaus hier in Berlin.<br><b>Lehrerin:</b> Und warum lernen Sie Deutsch?<br><b>Diana:</b> Ich möchte die B1-Prüfung machen und besser mit meinen Kollegen kommunizieren.',
              questions: [
                { q: 'Woher kommt Diana?', choices: ['Aus Russland', 'Aus der Ukraine', 'Aus Polen', 'Aus Deutschland'], correct: 1 },
                { q: 'Was ist Dianas Beruf?', choices: ['Lehrerin', 'Ärztin', 'Krankenschwester', 'Verkäuferin'], correct: 2 },
                { q: 'Warum lernt Diana Deutsch?', choices: ['Für die Arbeit und die B1-Prüfung', 'Für die Reise', 'Weil sie Deutsch liebt', 'Für die Schule'], correct: 0 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen & Verstehen',
          exercises: [
            {
              type: 'reading',
              text: '<h3>Lebenslauf – Maria Kovač</h3><p><b>Persönliche Daten:</b><br>Name: Maria Kovač | Geburtsdatum: 12. März 1990 | Geburtsort: Zagreb, Kroatien</p><p><b>Berufserfahrung:</b><br>2018–heute: Pflegefachkraft, Städtisches Krankenhaus München<br>2014–2018: Krankenschwester, Allgemeines Krankenhaus Zagreb</p><p><b>Ausbildung:</b><br>2010–2014: Studium der Pflegewissenschaften, Universität Zagreb<br>2006–2010: Gymnasium Zagreb, Abitur</p><p><b>Sprachen:</b> Kroatisch (Muttersprache), Deutsch (B2), Englisch (B1)</p>',
              questions: [
                { q: 'Wo arbeitet Maria heute?', choices: ['In Zagreb', 'In Berlin', 'In München', 'In Wien'], correct: 2 },
                { q: 'Welche Ausbildung hat Maria?', choices: ['Lehramt', 'Medizin', 'Pflegewissenschaften', 'Informatik'], correct: 2 },
                { q: 'Wie lange arbeitet Maria schon in Deutschland?', choices: ['Seit 2014', 'Seit 2018', 'Seit 2010', 'Seit 2020'], correct: 1 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen üben',
          exercises: [
            {
              type: 'speaking',
              prompt: 'Stell dich vor! Sprich 1–2 Minuten über dich: Name, Herkunft, Beruf, Hobbys und Ziele.',
              tips: ['Beginne mit: "Ich heiße... und komme aus..."', 'Erzähle, was du beruflich machst', 'Erkläre, warum du Deutsch lernst', 'Nenne 1–2 Hobbys'],
              example: 'Ich heiße Diana. Ich komme aus der Ukraine und wohne seit zwei Jahren in Berlin. Ich arbeite als Krankenschwester in einem Krankenhaus. In meiner Freizeit lerne ich gerne Deutsch und koche ukrainische Spezialitäten. Mein Ziel ist die B1-Prüfung.'
            },
            {
              type: 'dialogue',
              prompt: 'Übe diesen Dialog: Erstes Kennenlernen',
              lines: [
                { speaker: 'Person A', side: 'left', text: 'Hallo! Ich bin neu hier. Ich heiße Thomas.' },
                { speaker: 'Person B', side: 'right', text: 'Schön, dich kennenzulernen! Ich bin Diana. Woher kommst du?' },
                { speaker: 'Person A', side: 'left', text: 'Ich komme aus München. Und du?' },
                { speaker: 'Person B', side: 'right', text: 'Ich komme aus der Ukraine, aber ich wohne jetzt in Berlin.' },
                { speaker: 'Person A', side: 'left', text: 'Interessant! Was machst du beruflich?' },
                { speaker: 'Person B', side: 'right', text: 'Ich bin Krankenschwester. Und du?' }
              ]
            }
          ]
        }
      }
    },
    {
      id: 'nb1-k02',
      number: 2,
      title: 'Voll vernetzt',
      subtitle: 'Medien & Kommunikation',
      icon: '📱',
      grammarFocus: 'Relativsätze (Nominativ, Akkusativ, Dativ)',
      vocab: [
        { word: 'die sozialen Medien', translation: 'соціальні мережі / социальные сети', example: 'Ich nutze soziale Medien täglich.' },
        { word: 'das Netzwerk', translation: 'мережа / сеть', example: 'Das Internet ist ein weltweites Netzwerk.' },
        { word: 'herunterladen', translation: 'завантажувати / скачивать', example: 'Ich lade die App herunter.' },
        { word: 'die Nachricht', translation: 'повідомлення / сообщение', example: 'Hast du meine Nachricht bekommen?' },
        { word: 'teilen', translation: 'ділитися / делиться', example: 'Sie teilt viele Fotos online.' },
        { word: 'der Datenschutz', translation: 'захист даних / защита данных', example: 'Datenschutz ist sehr wichtig.' },
        { word: 'sich einloggen', translation: 'входити / входить (в систему)', example: 'Ich logge mich jeden Tag ein.' },
        { word: 'der Beitrag', translation: 'пост / публикация', example: 'Sie schreibt interessante Beiträge.' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben',
          exercises: [
            {
              type: 'free-write',
              question: 'Schreibe einen kurzen Text (60–80 Wörter): Welche sozialen Medien nutzt du? Wie oft? Wozu? Was findest du gut oder schlecht daran?',
              tip: 'Nutze Konnektoren: weil, aber, deshalb, obwohl',
              placeholder: 'Ich nutze täglich...',
              minWords: 30
            },
            {
              type: 'fill-blank',
              question: 'Ergänze den Relativsatz.',
              parts: [
                'Das ist die App, ', { blank: 'die', hint: 'Artikel (Nominativ, f.)' }, ' ich täglich benutze.'
              ],
              explanation: 'Der Relativsatz bezieht sich auf "die App" (feminin). Im Akkusativ: die.'
            }
          ]
        },
        hoeren: {
          title: 'Hören',
          exercises: [
            {
              type: 'listening',
              title: 'Gespräch: Zu viel Handy?',
              transcript: '<b>Moderator:</b> Frau Schmidt, wie viele Stunden verbringen Sie täglich am Smartphone?<br><b>Frau Schmidt:</b> Ehrlich gesagt... ungefähr vier Stunden. Ich checke morgens als erstes meine E-Mails und abends die sozialen Medien.<br><b>Moderator:</b> Glauben Sie, das ist zu viel?<br><b>Frau Schmidt:</b> Vielleicht. Aber ich arbeite auch viel online. Ohne Smartphone wäre mein Job kaum möglich.<br><b>Moderator:</b> Haben Sie schon versucht, die Nutzung zu reduzieren?<br><b>Frau Schmidt:</b> Ja, ich habe eine App installiert, die mir zeigt, wie lange ich am Handy bin. Das hat mir geholfen.',
              questions: [
                { q: 'Wie viele Stunden ist Frau Schmidt täglich am Smartphone?', choices: ['2 Stunden', '4 Stunden', '6 Stunden', '1 Stunde'], correct: 1 },
                { q: 'Was hat Frau Schmidt installiert?', choices: ['Ein neues Betriebssystem', 'Eine App zur Zeitkontrolle', 'Ein Antivirusprogramm', 'Einen Browser'], correct: 1 },
                { q: 'Warum braucht sie das Smartphone?', choices: ['Zum Spielen', 'Für die Arbeit', 'Für die Familie', 'Zum Kochen'], correct: 1 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen & Verstehen',
          exercises: [
            {
              type: 'reading',
              text: '<h3>Digitale Kommunikation – Fluch oder Segen?</h3><p>Smartphones und soziale Medien haben unsere Kommunikation revolutioniert. Wir können heute in Sekundenbruchteilen Nachrichten in die ganze Welt schicken. Fotos, Videos und Texte werden geteilt, kommentiert und geliked.</p><p>Doch es gibt auch kritische Stimmen. Viele Menschen fühlen sich durch die ständige Erreichbarkeit gestresst. Studien zeigen, dass Jugendliche, die viele Stunden täglich in sozialen Medien verbringen, häufiger unter Einsamkeit und Depressionen leiden.</p><p>Experten empfehlen, bewusst mit der Technologie umzugehen: Handy-freie Zeiten einplanen, Benachrichtigungen deaktivieren und das persönliche Gespräch nicht vergessen.</p>',
              questions: [
                { q: 'Was haben Smartphones verändert?', choices: ['Die Arbeitswelt', 'Die Kommunikation', 'Das Essen', 'Den Sport'], correct: 1 },
                { q: 'Was zeigen Studien über Jugendliche?', choices: ['Sie sind glücklicher', 'Sie schlafen besser', 'Sie leiden häufiger unter Einsamkeit', 'Sie lernen mehr'], correct: 2 },
                { q: 'Was empfehlen Experten?', choices: ['Mehr Zeit online', 'Handy-freie Zeiten', 'Neue Apps kaufen', 'Kein Smartphone nutzen'], correct: 1 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen üben',
          exercises: [
            {
              type: 'speaking',
              prompt: 'Diskutiere: "Soziale Medien – mehr Vorteile oder Nachteile?" Nenne 2–3 Argumente für jede Seite.',
              tips: ['Beginne mit: "Ich finde, dass..."', 'Nutze: einerseits... andererseits...', 'Schließe mit deiner Meinung ab'],
              example: 'Ich finde, soziale Medien haben sowohl Vor- als auch Nachteile. Einerseits kann man leicht Kontakt halten. Andererseits verliert man viel Zeit. Ich denke, man sollte die Nutzung kontrollieren.'
            }
          ]
        }
      }
    },
    {
      id: 'nb1-k03',
      number: 3,
      title: 'Gesund und fit',
      subtitle: 'Gesundheit & Wohlbefinden',
      icon: '🏃',
      grammarFocus: 'Passiv Präsens (werden + Partizip II)',
      vocab: [
        { word: 'das Wohlbefinden', translation: 'самопочуття / самочувствие', example: 'Sport verbessert das Wohlbefinden.' },
        { word: 'die Ernährung', translation: 'харчування / питание', example: 'Gesunde Ernährung ist wichtig.' },
        { word: 'das Rezept', translation: 'рецепт / рецепт', example: 'Der Arzt hat mir ein Rezept gegeben.' },
        { word: 'sich erholen', translation: 'відпочивати / отдыхать', example: 'Am Wochenende erhole ich mich vom Stress.' },
        { word: 'die Bewegung', translation: 'рух / движение', example: 'Regelmäßige Bewegung hält gesund.' },
        { word: 'der Stress', translation: 'стрес / стресс', example: 'Zu viel Stress ist ungesund.' },
        { word: 'behandeln', translation: 'лікувати / лечить', example: 'Der Arzt behandelt den Patienten.' },
        { word: 'die Beschwerde', translation: 'скарга / жалоба', example: 'Welche Beschwerden haben Sie?' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben',
          exercises: [
            {
              type: 'free-write',
              question: 'Schreibe eine E-Mail an deinen Arzt (60 Wörter): Du kannst deinen Termin nicht wahrnehmen und bittest um einen neuen Termin.',
              tip: 'Beginne mit: Sehr geehrte/r Frau/Herr... / Ich schreibe Ihnen, weil...',
              placeholder: 'Sehr geehrte Frau Dr. Meier,',
              minWords: 30
            },
            {
              type: 'fill-blank',
              question: 'Bilde Passivsätze. Ergänze die richtige Form.',
              parts: [
                'Das Medikament ', { blank: 'wird', hint: 'Hilfsverb' }, ' täglich eingenommen.'
              ],
              explanation: 'Passiv Präsens: werden (konjugiert) + Partizip II'
            }
          ]
        },
        hoeren: {
          title: 'Hören',
          exercises: [
            {
              type: 'listening',
              title: 'Beim Arzt – Ein Patientengespräch',
              transcript: '<b>Arzt:</b> Guten Tag! Was kann ich für Sie tun?<br><b>Patient:</b> Ich habe seit drei Tagen starke Kopfschmerzen und fühle mich sehr müde.<br><b>Arzt:</b> Haben Sie Fieber?<br><b>Patient:</b> Ja, gestern hatte ich 38,5 Grad.<br><b>Arzt:</b> Ich schaue mal nach. Bitte öffnen Sie den Mund. Hmm, Ihre Mandeln sind etwas gerötet. Das könnte eine leichte Erkältung sein.<br><b>Patient:</b> Muss ich ins Bett bleiben?<br><b>Arzt:</b> Ich empfehle Ihnen, zwei Tage zu Hause zu bleiben, viel zu trinken und dieses Medikament zu nehmen.',
              questions: [
                { q: 'Was hat der Patient?', choices: ['Bauchschmerzen', 'Kopfschmerzen und Müdigkeit', 'Rückenschmerzen', 'Husten'], correct: 1 },
                { q: 'Wie hoch war das Fieber?', choices: ['37,5 Grad', '39 Grad', '38,5 Grad', '40 Grad'], correct: 2 },
                { q: 'Was empfiehlt der Arzt?', choices: ['Sofort ins Krankenhaus', 'Zwei Tage zu Hause bleiben', 'Sport machen', 'Nichts trinken'], correct: 1 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen & Verstehen',
          exercises: [
            {
              type: 'reading',
              text: '<h3>10 Tipps für ein gesundes Leben</h3><ol><li><b>Ausreichend schlafen:</b> 7–8 Stunden Schlaf pro Nacht sind ideal.</li><li><b>Viel Wasser trinken:</b> Mindestens 1,5 Liter täglich.</li><li><b>Gesund essen:</b> Viel Obst, Gemüse, wenig Zucker und Fett.</li><li><b>Regelmäßig Sport treiben:</b> 30 Minuten Bewegung täglich reichen.</li><li><b>Stress reduzieren:</b> Meditation, Yoga oder Spaziergänge helfen.</li><li><b>Nicht rauchen:</b> Rauchen schadet der Gesundheit enorm.</li><li><b>Alkohol meiden:</b> Wenig oder kein Alkohol trinken.</li><li><b>Soziale Kontakte pflegen:</b> Freunde und Familie sind wichtig für die Psyche.</li><li><b>Regelmäßig zum Arzt gehen:</b> Vorsorgeuntersuchungen nicht vergessen.</li><li><b>Positiv denken:</b> Eine positive Einstellung macht gesünder.</li></ol>',
              questions: [
                { q: 'Wie viele Stunden Schlaf werden empfohlen?', choices: ['5–6 Stunden', '7–8 Stunden', '9–10 Stunden', '4–5 Stunden'], correct: 1 },
                { q: 'Wie viel Wasser sollte man täglich trinken?', choices: ['0,5 Liter', '1 Liter', '1,5 Liter', '3 Liter'], correct: 2 },
                { q: 'Was hilft gegen Stress laut Text?', choices: ['Mehr arbeiten', 'Meditation und Yoga', 'Weniger schlafen', 'Rauchen'], correct: 1 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen üben',
          exercises: [
            {
              type: 'speaking',
              prompt: 'Beschreibe deine Gesundheitsgewohnheiten. Was machst du für deine Gesundheit? Was möchtest du verbessern?',
              tips: ['Nutze: Ich versuche... / Ich achte darauf, dass...', 'Sprich über Sport, Ernährung, Schlaf', 'Was fällt dir schwer?'],
              example: 'Für meine Gesundheit versuche ich, täglich spazieren zu gehen. Ich achte darauf, viel Obst zu essen. Leider schlafe ich manchmal zu wenig, weil ich viel arbeite. Das möchte ich verbessern.'
            }
          ]
        }
      }
    },
    {
      id: 'nb1-k04',
      number: 4,
      title: 'Lebensläufe',
      subtitle: 'Arbeit & Karriere',
      icon: '💼',
      grammarFocus: 'Plusquamperfekt (hatte/war + Partizip II)',
      vocab: [
        { word: 'die Karriere', translation: 'кар\'єра / карьера', example: 'Sie hat eine beeindruckende Karriere gemacht.' },
        { word: 'die Qualifikation', translation: 'кваліфікація / квалификация', example: 'Welche Qualifikationen braucht man für diesen Job?' },
        { word: 'die Ausbildung', translation: 'навчання / образование', example: 'Er hat eine Ausbildung als Koch gemacht.' },
        { word: 'kündigen', translation: 'звільнятися / увольняться', example: 'Sie hat gekündigt und eine neue Stelle gefunden.' },
        { word: 'befördern', translation: 'підвищувати / продвигать', example: 'Er wurde zum Manager befördert.' },
        { word: 'das Gehalt', translation: 'зарплата / зарплата', example: 'Das Gehalt ist gut für diese Position.' },
        { word: 'die Stelle', translation: 'місце роботи / место работы', example: 'Ich suche eine neue Stelle.' },
        { word: 'in Rente gehen', translation: 'іти на пенсію / уйти на пенсию', example: 'Mit 67 Jahren geht er in Rente.' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben',
          exercises: [
            {
              type: 'free-write',
              question: 'Schreibe ein Motivationsschreiben für eine Stelle (80 Wörter). Erkläre, warum du dich bewirbst und was deine Stärken sind.',
              tip: 'Struktur: Einleitung (warum bewirbst du dich?) → Qualifikationen → Abschluss',
              placeholder: 'Sehr geehrte Damen und Herren,',
              minWords: 40
            },
            {
              type: 'fill-blank',
              question: 'Ergänze die Plusquamperfektform.',
              parts: [
                'Nachdem sie ihr Studium ', { blank: 'abgeschlossen hatte', hint: 'abschließen (Plusqpf.)' }, ', fand sie sofort einen Job.'
              ],
              explanation: 'Plusquamperfekt = hatte/war + Partizip II. Es beschreibt, was VOR einer Vergangenheitshandlung passierte.'
            }
          ]
        },
        hoeren: {
          title: 'Hören',
          exercises: [
            {
              type: 'listening',
              title: 'Interview: Berufswechsel mit 40',
              transcript: '<b>Reporter:</b> Frau Bauer, Sie haben mit 40 Jahren Ihren Job gewechselt. Warum?<br><b>Frau Bauer:</b> Ich hatte 15 Jahre als Bankangestellte gearbeitet und fühlte mich nicht mehr erfüllt. Ich wollte etwas mit Menschen machen.<br><b>Reporter:</b> Was haben Sie dann gemacht?<br><b>Frau Bauer:</b> Ich habe eine Umschulung zur Ergotherapeutin gemacht. Das hat zwei Jahre gedauert.<br><b>Reporter:</b> Bereuen Sie die Entscheidung?<br><b>Frau Bauer:</b> Nein, überhaupt nicht! Ich verdiene weniger, aber ich bin viel glücklicher. Das ist wichtiger.',
              questions: [
                { q: 'Wie lange hatte Frau Bauer als Bankangestellte gearbeitet?', choices: ['10 Jahre', '15 Jahre', '20 Jahre', '5 Jahre'], correct: 1 },
                { q: 'Welche Ausbildung hat sie gemacht?', choices: ['Krankenschwester', 'Lehrerin', 'Ergotherapeutin', 'Ärztin'], correct: 2 },
                { q: 'Wie lange dauerte die Umschulung?', choices: ['1 Jahr', '2 Jahre', '3 Jahre', '6 Monate'], correct: 1 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen & Verstehen',
          exercises: [
            {
              type: 'reading',
              text: '<h3>Stellenanzeige: Pflegefachkraft (m/w/d)</h3><p><b>Wir suchen:</b> Klinikum Berlin-Mitte sucht ab sofort eine engagierte Pflegefachkraft in Vollzeit.</p><p><b>Ihre Aufgaben:</b></p><ul><li>Pflege und Betreuung von Patienten</li><li>Durchführung ärztlich angeordneter Maßnahmen</li><li>Dokumentation der Pflegemaßnahmen</li><li>Zusammenarbeit im interdisziplinären Team</li></ul><p><b>Ihr Profil:</b></p><ul><li>Abgeschlossene Ausbildung als Pflegefachkraft</li><li>Teamfähigkeit und Einfühlungsvermögen</li><li>Gute Deutschkenntnisse (mind. B2)</li></ul><p><b>Wir bieten:</b> Attraktives Gehalt, 30 Tage Urlaub, Fort- und Weiterbildungsmöglichkeiten.</p>',
              questions: [
                { q: 'Welcher Deutschkenntnisstand wird verlangt?', choices: ['A2', 'B1', 'B2', 'C1'], correct: 2 },
                { q: 'Wie viele Urlaubstage werden angeboten?', choices: ['20 Tage', '25 Tage', '28 Tage', '30 Tage'], correct: 3 },
                { q: 'Was ist KEINE Aufgabe laut Anzeige?', choices: ['Patientenpflege', 'Dokumentation', 'Buchhaltung', 'Teamarbeit'], correct: 2 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen üben',
          exercises: [
            {
              type: 'dialogue',
              prompt: 'Übe ein Vorstellungsgespräch – Person A ist der Interviewer, Person B der Bewerber.',
              lines: [
                { speaker: 'Interviewer', side: 'left', text: 'Guten Tag! Bitte nehmen Sie Platz. Erzählen Sie uns etwas über sich.' },
                { speaker: 'Bewerber', side: 'right', text: 'Guten Tag! Ich heiße Diana Koval und bin seit 5 Jahren in der Pflege tätig.' },
                { speaker: 'Interviewer', side: 'left', text: 'Warum möchten Sie zu unserem Krankenhaus wechseln?' },
                { speaker: 'Bewerber', side: 'right', text: 'Ich schätze den guten Ruf Ihres Hauses und möchte mich weiterentwickeln.' },
                { speaker: 'Interviewer', side: 'left', text: 'Was sind Ihre größten Stärken?' },
                { speaker: 'Bewerber', side: 'right', text: 'Ich bin sehr teamfähig, zuverlässig und habe viel Einfühlungsvermögen.' }
              ]
            }
          ]
        }
      }
    },
    {
      id: 'nb1-k05',
      number: 5,
      title: 'Auf Reisen',
      subtitle: 'Reisen & Tourismus',
      icon: '✈️',
      grammarFocus: 'Temporalsätze (als, wenn, während, nachdem, bevor)',
      vocab: [
        { word: 'die Unterkunft', translation: 'житло / жильё', example: 'Hast du schon eine Unterkunft gebucht?' },
        { word: 'der Aufenthalt', translation: 'перебування / пребывание', example: 'Der Aufenthalt im Hotel war angenehm.' },
        { word: 'die Sehenswürdigkeit', translation: 'визначна пам\'ятка / достопримечательность', example: 'Berlin hat viele Sehenswürdigkeiten.' },
        { word: 'der Reiseführer', translation: 'путівник / путеводитель', example: 'Ich habe einen Reiseführer über Wien gekauft.' },
        { word: 'die Verspätung', translation: 'запізнення / опоздание', example: 'Der Zug hat 30 Minuten Verspätung.' },
        { word: 'buchen', translation: 'бронювати / бронировать', example: 'Ich habe das Flugticket online gebucht.' },
        { word: 'der Zoll', translation: 'митниця / таможня', example: 'Am Flughafen gibt es eine Zollkontrolle.' },
        { word: 'das Gepäck', translation: 'багаж / багаж', example: 'Mein Gepäck ist verloren gegangen.' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben',
          exercises: [
            {
              type: 'free-write',
              question: 'Schreibe eine Postkarte von deiner letzten Reise oder einer Traumreise (50–70 Wörter).',
              tip: 'Beschreibe: Wo bist du? Was hast du gesehen? Wie ist das Wetter? Was isst du?',
              placeholder: 'Liebe/r..., ich bin jetzt in...',
              minWords: 25
            },
            {
              type: 'fill-blank',
              question: 'Ergänze den Temporalsatz mit der richtigen Konjunktion.',
              parts: [
                { blank: 'Als', hint: 'Als/Wenn (einmalig, Vergangenheit)' }, ' ich in Paris war, besuchte ich den Eiffelturm.'
              ],
              explanation: '"Als" = einmalige Handlung in der Vergangenheit. "Wenn" = wiederholte Handlungen oder Zukunft.'
            }
          ]
        },
        hoeren: {
          title: 'Hören',
          exercises: [
            {
              type: 'listening',
              title: 'Am Flughafen – Ein Problem mit dem Gepäck',
              transcript: '<b>Mitarbeiterin:</b> Guten Tag, womit kann ich Ihnen helfen?<br><b>Reisender:</b> Guten Tag. Mein Koffer ist nicht angekommen. Ich habe den Flug LH427 aus Wien genommen.<br><b>Mitarbeiterin:</b> Oh, das tut mir leid. Können Sie mir Ihre Bordkarte zeigen?<br><b>Reisender:</b> Ja, hier bitte.<br><b>Mitarbeiterin:</b> Danke. Können Sie mir Ihren Koffer beschreiben?<br><b>Reisender:</b> Er ist groß, schwarz und hat einen roten Aufkleber.<br><b>Mitarbeiterin:</b> Wir suchen ihn sofort. Wir kontaktieren Sie innerhalb von 24 Stunden.',
              questions: [
                { q: 'Was ist das Problem?', choices: ['Das Ticket fehlt', 'Der Koffer ist nicht angekommen', 'Der Flug hat Verspätung', 'Der Pass fehlt'], correct: 1 },
                { q: 'Wie sieht der Koffer aus?', choices: ['Klein und blau', 'Groß und schwarz mit rotem Aufkleber', 'Mittelgroß und grün', 'Klein und rot'], correct: 1 },
                { q: 'Wann wird die Mitarbeiterin Kontakt aufnehmen?', choices: ['Sofort', 'In 2 Stunden', 'Innerhalb von 24 Stunden', 'Morgen früh'], correct: 2 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen & Verstehen',
          exercises: [
            {
              type: 'reading',
              text: '<h3>Berlin – Die Hauptstadt Deutschlands</h3><p>Berlin ist mit etwa 3,7 Millionen Einwohnern die größte Stadt Deutschlands. Die Stadt ist bekannt für ihre lebendige Kulturszene, ihre Geschichte und ihre vielfältige Gastronomie.</p><p><b>Sehenswürdigkeiten:</b> Das Brandenburger Tor ist das bekannteste Symbol Berlins. Der Reichstag, das Deutsche Historische Museum und die East Side Gallery – ein erhaltenes Stück der Berliner Mauer – sind ebenfalls sehr beliebt.</p><p><b>Tipps:</b> Berlin ist mit Bus, U-Bahn und S-Bahn sehr gut zu erkunden. Ein Tagesticket kostet ca. 9 Euro und gilt für alle öffentlichen Verkehrsmittel. Viele Museen sind am ersten Sonntag im Monat kostenlos.</p>',
              questions: [
                { q: 'Wie viele Einwohner hat Berlin?', choices: ['1,5 Millionen', '2 Millionen', '3,7 Millionen', '5 Millionen'], correct: 2 },
                { q: 'Was ist die East Side Gallery?', choices: ['Ein Museum', 'Ein Teil der Berliner Mauer', 'Eine Kunstgalerie', 'Ein Park'], correct: 1 },
                { q: 'Was kostet ein Tagesticket?', choices: ['5 Euro', '7 Euro', '9 Euro', '12 Euro'], correct: 2 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen üben',
          exercises: [
            {
              type: 'speaking',
              prompt: 'Beschreibe deine Traumreise. Wohin möchtest du reisen? Was würdest du dort machen? Warum?',
              tips: ['Nutze Konjunktiv II: Ich würde gerne... / Ich hätte... / Es wäre...', 'Beschreibe Ort, Aktivitäten, Essen, Sehenswürdigkeiten'],
              example: 'Meine Traumreise wäre nach Japan. Ich würde gerne Tokio und Kyoto besuchen. Ich würde traditionelle japanische Küche probieren und alte Tempel besichtigen. Das Beste wäre, im Frühling dort zu sein, wenn die Kirschbäume blühen.'
            }
          ]
        }
      }
    },
    {
      id: 'nb1-k06',
      number: 6,
      title: 'Konsum und Werbung',
      subtitle: 'Einkaufen & Medien',
      icon: '🛍️',
      grammarFocus: 'Kausalsätze (weil, da, denn) & Konzessivsätze (obwohl, trotzdem)',
      vocab: [
        { word: 'die Werbung', translation: 'реклама / реклама', example: 'Die Werbung im Fernsehen ist oft sehr laut.' },
        { word: 'das Angebot', translation: 'пропозиція / предложение', example: 'Im Supermarkt gibt es heute viele Angebote.' },
        { word: 'der Verbraucher', translation: 'споживач / потребитель', example: 'Verbraucher haben das Recht auf Rückgabe.' },
        { word: 'bestellen', translation: 'замовляти / заказывать', example: 'Ich bestelle meine Bücher online.' },
        { word: 'zurückgeben', translation: 'повертати / возвращать', example: 'Kann ich das Produkt zurückgeben?' },
        { word: 'vergleichen', translation: 'порівнювати / сравнивать', example: 'Ich vergleiche die Preise vor dem Kauf.' },
        { word: 'der Rabatt', translation: 'знижка / скидка', example: 'Heute gibt es 20% Rabatt.' },
        { word: 'die Qualität', translation: 'якість / качество', example: 'Die Qualität des Produkts ist sehr gut.' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben',
          exercises: [
            {
              type: 'free-write',
              question: 'Schreibe eine Beschwerde-E-Mail (70 Wörter): Du hast ein Produkt online gekauft, aber es ist defekt angekommen.',
              tip: 'Nutze: Ich möchte mich beschweren über... / Das Produkt ist... / Ich bitte Sie um...',
              placeholder: 'Sehr geehrte Damen und Herren,',
              minWords: 35
            },
            {
              type: 'fill-blank',
              question: 'Verbinde die Sätze mit "obwohl".',
              parts: [
                { blank: 'Obwohl', hint: 'Konjunktion (konzessiv)' }, ' das Produkt teuer war, hat es schon nach einer Woche nicht mehr funktioniert.'
              ],
              explanation: '"Obwohl" leitet einen Konzessivsatz ein. Der Nebensatz steht mit Verb am Ende.'
            }
          ]
        },
        hoeren: {
          title: 'Hören',
          exercises: [
            {
              type: 'listening',
              title: 'Im Kaufhaus – Eine Reklamation',
              transcript: '<b>Kundin:</b> Entschuldigung, ich habe diese Jacke letzte Woche hier gekauft, und jetzt ist der Reißverschluss kaputt.<br><b>Verkäuferin:</b> Oh, das tut mir leid. Haben Sie den Kassenbon dabei?<br><b>Kundin:</b> Ja, hier ist er.<br><b>Verkäuferin:</b> Möchten Sie die Jacke umtauschen oder das Geld zurück?<br><b>Kundin:</b> Ich würde sie gerne umtauschen, wenn noch eine in meiner Größe da ist.<br><b>Verkäuferin:</b> Ich schaue kurz nach... Ja, wir haben noch eine in Größe 38. Bitte folgen Sie mir.',
              questions: [
                { q: 'Was ist das Problem mit der Jacke?', choices: ['Sie passt nicht', 'Die Farbe gefällt nicht', 'Der Reißverschluss ist kaputt', 'Sie ist zu teuer'], correct: 2 },
                { q: 'Was möchte die Kundin?', choices: ['Geld zurück', 'Die Jacke umtauschen', 'Einen Rabatt', 'Eine andere Marke'], correct: 1 },
                { q: 'Was braucht die Verkäuferin?', choices: ['Den Ausweis', 'Den Kassenbon', 'Die Kreditkarte', 'Den Katalog'], correct: 1 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen & Verstehen',
          exercises: [
            {
              type: 'reading',
              text: '<h3>Online-Shopping: Tipps für kluge Verbraucher</h3><p>Online-Shopping ist bequem und oft günstiger als im Laden. Dennoch sollte man einige Dinge beachten:</p><p><b>Preise vergleichen:</b> Nutzen Sie Preisvergleichs-Websites, da das gleiche Produkt bei verschiedenen Händlern sehr unterschiedliche Preise haben kann.</p><p><b>Bewertungen lesen:</b> Kundenbewertungen geben Hinweise auf die Qualität. Achten Sie auf Bewertungen mit echten Fotos und detaillierten Beschreibungen.</p><p><b>Rückgaberecht prüfen:</b> In der EU haben Verbraucher ein 14-tägiges Widerrufsrecht. Viele Händler bieten sogar 30 Tage an.</p><p><b>Datensicherheit:</b> Kaufen Sie nur auf sicheren Seiten (https://) und geben Sie keine unnötigen Daten an.</p>',
              questions: [
                { q: 'Wie lange ist das gesetzliche Widerrufsrecht in der EU?', choices: ['7 Tage', '14 Tage', '30 Tage', '60 Tage'], correct: 1 },
                { q: 'Woran erkennt man eine sichere Website?', choices: ['Am Logo', 'An der Farbe', 'An https://', 'An der Adresse'], correct: 2 },
                { q: 'Was wird bei Kundenbewertungen empfohlen?', choices: ['Nur die neuesten lesen', 'Bewertungen mit Fotos und Beschreibungen beachten', 'Nur 5-Sterne-Bewertungen vertrauen', 'Bewertungen ignorieren'], correct: 1 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen üben',
          exercises: [
            {
              type: 'speaking',
              prompt: 'Diskutiere: Kaufst du lieber online oder im Geschäft? Gib 3 Gründe für deine Meinung.',
              tips: ['Nutze: Ich bevorzuge... weil... / Ein weiterer Vorteil ist... / Allerdings...', 'Vergleiche beide Optionen'],
              example: 'Ich kaufe lieber online, weil es bequemer ist. Ich muss nicht in die Stadt fahren und kann Preise leicht vergleichen. Allerdings kaufe ich Kleidung lieber im Geschäft, weil ich sie anprobieren möchte.'
            }
          ]
        }
      }
    },
    {
      id: 'nb1-k07',
      number: 7,
      title: 'Natur und Umwelt',
      subtitle: 'Umweltschutz & Nachhaltigkeit',
      icon: '🌿',
      grammarFocus: 'Finalsätze (um...zu, damit)',
      vocab: [
        { word: 'der Klimawandel', translation: 'зміна клімату / изменение климата', example: 'Der Klimawandel ist eine globale Herausforderung.' },
        { word: 'recyceln', translation: 'переробляти / перерабатывать', example: 'Wir recyceln Papier, Glas und Plastik.' },
        { word: 'nachhaltig', translation: 'сталий / устойчивый', example: 'Nachhaltige Energie ist die Zukunft.' },
        { word: 'der Müll', translation: 'сміття / мусор', example: 'Bitte wirf den Müll in den richtigen Behälter.' },
        { word: 'sparen', translation: 'економити / экономить', example: 'Wir sollten mehr Energie sparen.' },
        { word: 'die Umweltverschmutzung', translation: 'забруднення навколишнього середовища / загрязнение окружающей среды', example: 'Umweltverschmutzung schadet der Natur.' },
        { word: 'erneuerbar', translation: 'відновлюваний / возобновляемый', example: 'Erneuerbare Energien sind sauberer.' },
        { word: 'schützen', translation: 'захищати / защищать', example: 'Wir müssen die Natur schützen.' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben',
          exercises: [
            {
              type: 'free-write',
              question: 'Schreibe einen kurzen Text (70 Wörter): Was tust du persönlich für die Umwelt? Was könntest du noch tun?',
              tip: 'Nutze Finalsätze: Ich kaufe Bioprodukte, um... / Ich fahre Fahrrad, damit...',
              placeholder: 'Für die Umwelt versuche ich...',
              minWords: 35
            },
            {
              type: 'fill-blank',
              question: 'Ergänze mit "um...zu" oder "damit".',
              parts: [
                'Ich trenne meinen Müll, ', { blank: 'um', hint: 'um/damit' }, ' die Umwelt zu schützen.'
              ],
              explanation: '"Um...zu" benutzt man, wenn Subjekt in Haupt- und Nebensatz gleich ist. "Damit" benutzt man, wenn die Subjekte verschieden sind.'
            }
          ]
        },
        hoeren: {
          title: 'Hören',
          exercises: [
            {
              type: 'listening',
              title: 'Radiobeitrag: Plastik in den Meeren',
              transcript: '<b>Moderator:</b> Jedes Jahr landen etwa 8 Millionen Tonnen Plastik im Meer. Das entspricht einem Lastwagen Müll pro Minute.<br><b>Expertin:</b> Das Problem ist enorm. Plastik zersetzt sich nicht – es wird nur kleiner. Diese Mikroplastik-Teilchen fressen Fische und gelangen so in unsere Nahrungskette.<br><b>Moderator:</b> Was kann man dagegen tun?<br><b>Expertin:</b> Jeder kann helfen: weniger Einwegplastik kaufen, Leitungswasser statt Flaschenwasser trinken, und beim Einkaufen eine eigene Tasche mitbringen.',
              questions: [
                { q: 'Wie viel Plastik landet jährlich im Meer?', choices: ['1 Million Tonnen', '4 Millionen Tonnen', '8 Millionen Tonnen', '12 Millionen Tonnen'], correct: 2 },
                { q: 'Wie gelangt Mikroplastik zum Menschen?', choices: ['Durch die Luft', 'Durch die Nahrungskette', 'Durch das Trinkwasser', 'Durch Kosmetik'], correct: 1 },
                { q: 'Was empfiehlt die Expertin NICHT?', choices: ['Leitungswasser trinken', 'Eigene Tasche mitbringen', 'Weniger Einwegplastik', 'Mehr Fisch essen'], correct: 3 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen & Verstehen',
          exercises: [
            {
              type: 'reading',
              text: '<h3>10 einfache Tipps für mehr Nachhaltigkeit im Alltag</h3><p>Nachhaltiger zu leben muss nicht schwer sein. Hier sind einfache Tipps:</p><ul><li>Kaufe saisonales und regionales Obst und Gemüse.</li><li>Benutze Stofftaschen statt Plastiktüten.</li><li>Fahre mit dem Fahrrad oder nutze öffentliche Verkehrsmittel.</li><li>Dusche kürzer und drehe die Heizung nachts herunter.</li><li>Kaufe Second-Hand-Kleidung.</li><li>Esse weniger Fleisch – besonders weniger Rindfleisch.</li><li>Repariere Dinge, anstatt sie wegzuwerfen.</li><li>Nutze energiesparende Glühbirnen (LED).</li><li>Kaufe weniger, aber dafür bessere Qualität.</li><li>Sprich mit anderen über Nachhaltigkeit!</li></ul>',
              questions: [
                { q: 'Was soll man statt Plastiktüten benutzen?', choices: ['Papiertüten', 'Stofftaschen', 'Plastikboxen', 'Nichts'], correct: 1 },
                { q: 'Was wird über Fleischkonsum gesagt?', choices: ['Man soll keines essen', 'Man soll mehr Fisch essen', 'Man soll weniger Fleisch essen', 'Fleisch ist gesund'], correct: 2 },
                { q: 'Was bedeutet "Second-Hand-Kleidung"?', choices: ['Neue Kleidung', 'Teure Kleidung', 'Gebrauchte Kleidung', 'Sportkleidung'], correct: 2 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen üben',
          exercises: [
            {
              type: 'speaking',
              prompt: 'Sprich 2 Minuten über das Thema Umweltschutz. Was ist das größte Problem? Was sollte man tun?',
              tips: ['Beginne mit dem Problem', 'Nenne 2–3 Lösungen', 'Erkläre, was du persönlich tust'],
              example: 'Ich denke, der Klimawandel ist das größte Problem unserer Zeit. Wir müssen weniger CO2 produzieren. Dafür sollten wir mehr erneuerbare Energie nutzen und weniger Fleisch essen. Persönlich fahre ich Fahrrad und kaufe regionale Lebensmittel.'
            }
          ]
        }
      }
    },
    {
      id: 'nb1-k08',
      number: 8,
      title: 'Heimat und Fremde',
      subtitle: 'Migration & Identität',
      icon: '🌍',
      grammarFocus: 'Modalpartikeln (doch, mal, eigentlich, ja, halt)',
      vocab: [
        { word: 'die Heimat', translation: 'батьківщина / родина', example: 'Die Ukraine ist meine Heimat.' },
        { word: 'auswandern', translation: 'емігрувати / эмигрировать', example: 'Sie ist aus der Ukraine ausgewandert.' },
        { word: 'sich integrieren', translation: 'інтегруватися / интегрироваться', example: 'Es ist wichtig, sich gut zu integrieren.' },
        { word: 'die Kultur', translation: 'культура / культура', example: 'Ich lerne die deutsche Kultur kennen.' },
        { word: 'der Alltag', translation: 'повсякденне життя / повседневная жизнь', example: 'Im deutschen Alltag gibt es viele Regeln.' },
        { word: 'vermissen', translation: 'сумувати / скучать', example: 'Ich vermisse meine Familie sehr.' },
        { word: 'die Sehnsucht', translation: 'туга / тоска', example: 'Manchmal habe ich Sehnsucht nach der Heimat.' },
        { word: 'ankommen', translation: 'прибувати / прибывать', example: 'In der neuen Stadt anzukommen dauert Zeit.' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben',
          exercises: [
            {
              type: 'free-write',
              question: 'Schreibe einen Brief an eine Freundin in deiner Heimat (80 Wörter): Wie ist dein Leben in Deutschland? Was vermisst du? Was gefällt dir?',
              tip: 'Nutze: Ich vermisse... / Hier ist es... / Was mir gut gefällt...',
              placeholder: 'Liebe...,',
              minWords: 40
            }
          ]
        },
        hoeren: {
          title: 'Hören',
          exercises: [
            {
              type: 'listening',
              title: 'Podcast: "Zwischen zwei Welten" – Olena erzählt',
              transcript: '<b>Moderator:</b> Olena, du lebst seit 3 Jahren in Deutschland. Wie war der Anfang?<br><b>Olena:</b> Ehrlich gesagt – sehr schwer. Alles war anders. Die Sprache, die Kultur, sogar das Essen. Ich habe oft gezweifelt, ob die Entscheidung richtig war.<br><b>Moderator:</b> Was hat geholfen?<br><b>Olena:</b> Ein Deutschkurs natürlich. Aber vor allem Menschen, die mir geholfen haben – Nachbarn, Kollegen. Ohne sie wäre es unmöglich gewesen.<br><b>Moderator:</b> Vermisst du die Ukraine?<br><b>Olena:</b> Jeden Tag. Meine Familie, die Sprache, die Küche. Aber jetzt fühle ich mich in beiden Welten zuhause.',
              questions: [
                { q: 'Wie lange lebt Olena in Deutschland?', choices: ['1 Jahr', '2 Jahre', '3 Jahre', '5 Jahre'], correct: 2 },
                { q: 'Was hat Olena am meisten geholfen?', choices: ['Das Geld', 'Nur der Deutschkurs', 'Menschen – Nachbarn und Kollegen', 'Das Internet'], correct: 2 },
                { q: 'Wie fühlt sich Olena jetzt?', choices: ['Sie will zurück', 'Sie fühlt sich in beiden Welten zuhause', 'Sie ist unglücklich', 'Sie vermisst nichts'], correct: 1 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen & Verstehen',
          exercises: [
            {
              type: 'reading',
              text: '<h3>Zwischen zwei Kulturen – Eine Chance?</h3><p>Millionen von Menschen leben heute in einem anderen Land als dem, in dem sie geboren wurden. Die Gründe sind vielfältig: Arbeit, Familie, Krieg oder einfach der Wunsch nach Veränderung.</p><p>Das Leben zwischen zwei Kulturen ist oft eine Bereicherung, aber auch eine Herausforderung. Man lernt neue Perspektiven kennen, neue Sprachen, neue Wege zu denken. Gleichzeitig vermisst man die Heimat, die Familie und die vertrauten Gerüche und Klänge.</p><p>Experten sprechen vom "dritten Ort" – einem inneren Raum, den Menschen schaffen, die zwischen Kulturen leben. Dieser Ort ist weder die alte Heimat noch die neue, sondern etwas ganz Eigenes.</p>',
              questions: [
                { q: 'Was ist KEIN genannter Grund für Migration?', choices: ['Arbeit', 'Familie', 'Klima', 'Krieg'], correct: 2 },
                { q: 'Was ist der "dritte Ort"?', choices: ['Ein neues Land', 'Die Heimat', 'Ein innerer Raum zwischen Kulturen', 'Ein Hotel'], correct: 2 },
                { q: 'Was sagt der Text über das Leben zwischen zwei Kulturen?', choices: ['Es ist nur schwer', 'Es ist nur bereichernd', 'Es ist Bereicherung und Herausforderung', 'Es ist unmöglich'], correct: 2 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen üben',
          exercises: [
            {
              type: 'speaking',
              prompt: 'Sprich über deine Erfahrungen in Deutschland (oder einem anderen fremden Land). Was war schwer? Was war überraschend? Was hast du gelernt?',
              tips: ['Nutze Modalpartikeln: Das ist doch interessant! / Das ist halt so.', 'Erzähle eine konkrete Geschichte', 'Zeige Gefühle – was hat dich bewegt?'],
              example: 'Als ich nach Deutschland kam, war ich überrascht, wie pünktlich hier alles ist. Am Anfang war die Sprache halt wirklich schwer. Aber ich habe tolle Nachbarn, die mir doch sehr geholfen haben. Jetzt fühle ich mich eigentlich sehr wohl hier.'
            }
          ]
        }
      }
    },
    {
      id: 'nb1-k09',
      number: 9,
      title: 'Kultur und Kunst',
      subtitle: 'Musik, Film & Theater',
      icon: '🎭',
      grammarFocus: 'Konjunktiv I (indirekte Rede)',
      vocab: [
        { word: 'die Aufführung', translation: 'вистава / представление', example: 'Die Aufführung beginnt um 20 Uhr.' },
        { word: 'der Künstler', translation: 'митець / художник', example: 'Der Künstler hat viele berühmte Werke gemalt.' },
        { word: 'die Ausstellung', translation: 'виставка / выставка', example: 'Ich besuche gerne Kunstausstellungen.' },
        { word: 'begeistern', translation: 'захоплювати / восхищать', example: 'Das Konzert hat mich sehr begeistert.' },
        { word: 'kritisieren', translation: 'критикувати / критиковать', example: 'Der Kritiker hat den Film stark kritisiert.' },
        { word: 'der Eintritt', translation: 'вхід / вход', example: 'Der Eintritt kostet 15 Euro.' },
        { word: 'empfehlen', translation: 'рекомендувати / рекомендовать', example: 'Ich empfehle dir diesen Film sehr.' },
        { word: 'der Eindruck', translation: 'враження / впечатление', example: 'Der Film hat einen starken Eindruck hinterlassen.' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben',
          exercises: [
            {
              type: 'free-write',
              question: 'Schreibe eine kurze Rezension (70 Wörter) über einen Film, ein Buch oder ein Konzert, das du geliebt oder gehasst hast.',
              tip: 'Struktur: Was ist es? Worum geht es? Was hat dir gefallen/nicht gefallen? Empfehlung',
              placeholder: 'Ich habe neulich den Film/das Buch... gesehen/gelesen...',
              minWords: 35
            }
          ]
        },
        hoeren: {
          title: 'Hören',
          exercises: [
            {
              type: 'listening',
              title: 'Restaurantkritik im Radio',
              transcript: '<b>Kritikerin:</b> Letzten Freitag war ich im neuen Restaurant "Zum goldenen Hahn" in der Innenstadt. Das Lokal sei gemütlich eingerichtet, sagte mir meine Begleitung. Ich fand die Atmosphäre tatsächlich sehr angenehm – warmes Licht, leise Hintergrundmusik.<br><b>Moderator:</b> Und das Essen?<br><b>Kritikerin:</b> Das Essen war teilweise sehr gut, teilweise enttäuschend. Der Fisch sei frisch und perfekt zubereitet gewesen, aber das Dessert war zu süß und zu klein für den Preis. Der Service war freundlich, aber langsam.',
              questions: [
                { q: 'Wie ist die Atmosphäre im Restaurant?', choices: ['Laut und unangenehm', 'Kalt und steril', 'Gemütlich mit warmem Licht', 'Modern und stylisch'], correct: 2 },
                { q: 'Was war gut am Essen?', choices: ['Das Dessert', 'Die Suppe', 'Der Fisch', 'Das Fleisch'], correct: 2 },
                { q: 'Was war das Problem mit dem Service?', choices: ['Unfreundlich', 'Zu langsam', 'Zu teuer', 'Nicht vorhanden'], correct: 1 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen & Verstehen',
          exercises: [
            {
              type: 'reading',
              text: '<h3>Beethoven – Ein Leben für die Musik</h3><p>Ludwig van Beethoven wurde 1770 in Bonn geboren und gilt als einer der bedeutendsten Komponisten der Musikgeschichte. Schon als Kind zeigte er außergewöhnliches Talent: Mit 12 Jahren veröffentlichte er seine erste Komposition.</p><p>Das Tragischste in seinem Leben war, dass er ab seinem 26. Lebensjahr begann, sein Gehör zu verlieren. Mit 44 Jahren war er völlig taub. Trotzdem komponierte er einige seiner bekanntesten Werke, darunter die 9. Sinfonie, nach dem vollständigen Verlust des Gehörs.</p><p>Beethoven starb 1827 in Wien. Über 20.000 Menschen kamen zu seiner Beerdigung – ein Zeichen seiner immensen Popularität.</p>',
              questions: [
                { q: 'Wo wurde Beethoven geboren?', choices: ['Wien', 'Berlin', 'Bonn', 'Hamburg'], correct: 2 },
                { q: 'Wann begann er, sein Gehör zu verlieren?', choices: ['Mit 12', 'Mit 26', 'Mit 44', 'Mit 57'], correct: 1 },
                { q: 'Wann starb Beethoven?', choices: ['1800', '1815', '1827', '1840'], correct: 2 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen üben',
          exercises: [
            {
              type: 'speaking',
              prompt: 'Empfiehl einem Freund einen Film oder ein Buch auf Deutsch. Was ist die Geschichte? Warum sollte er/sie es sehen/lesen?',
              tips: ['Beginne: "Ich empfehle dir..."', 'Beschreibe die Hauptfiguren', 'Erkläre, warum es dir gefallen hat'],
              example: 'Ich empfehle dir den Film "Lola rennt" von Tom Tykwer. Es geht um eine junge Frau, die 20 Minuten Zeit hat, 100.000 Mark aufzutreiben, um ihren Freund zu retten. Der Film ist sehr schnell und spannend. Ich finde ihn toll, weil er zeigt, wie kleine Entscheidungen alles verändern können.'
            }
          ]
        }
      }
    },
    {
      id: 'nb1-k10',
      number: 10,
      title: 'Gesellschaft und Zukunft',
      subtitle: 'B1-Prüfungsvorbereitung',
      icon: '🎯',
      grammarFocus: 'Prüfungsvorbereitung: Alle Strukturen wiederholen',
      vocab: [
        { word: 'die Gesellschaft', translation: 'суспільство / общество', example: 'Wir leben in einer multikulturellen Gesellschaft.' },
        { word: 'die Zukunft', translation: 'майбутнє / будущее', example: 'Wie sieht die Zukunft der Arbeit aus?' },
        { word: 'die Demokratie', translation: 'демократія / демократия', example: 'Deutschland ist eine Demokratie.' },
        { word: 'die Gleichberechtigung', translation: 'рівноправність / равноправие', example: 'Gleichberechtigung ist ein wichtiges Thema.' },
        { word: 'freiwillig', translation: 'добровільно / добровольно', example: 'Ich arbeite freiwillig in einem Verein.' },
        { word: 'das Ehrenamt', translation: 'волонтерство / волонтёрство', example: 'Ehrenamt ist in Deutschland sehr verbreitet.' },
        { word: 'der Fortschritt', translation: 'прогрес / прогресс', example: 'Der technologische Fortschritt ist enorm.' },
        { word: 'die Verantwortung', translation: 'відповідальність / ответственность', example: 'Jeder trägt Verantwortung für die Umwelt.' }
      ],
      skills: {
        schreiben: {
          title: 'Schreiben üben (Prüfungsformat)',
          exercises: [
            {
              type: 'free-write',
              question: '📝 PRÜFUNGSAUFGABE Schreiben Teil 1: Du hast eine E-Mail von deiner Freundin Mia bekommen. Sie fragt, ob du bei einem Umweltprojekt mitmachen möchtest. Schreibe eine Antwort (ca. 80 Wörter): Sage, ob du mitmachst. Erkläre, warum. Frage nach Details.',
              tip: 'Prüfungstipp: Lies die Aufgabe genau. Antworte auf alle Punkte. Achte auf Anrede und Gruß.',
              placeholder: 'Liebe Mia,',
              minWords: 50
            },
            {
              type: 'free-write',
              question: '📝 PRÜFUNGSAUFGABE Schreiben Teil 2: Schreibe einen Forumsbeitrag (ca. 80 Wörter) zum Thema: "Sollte das Ehrenamt in Deutschland Pflicht sein?" Gib deine Meinung mit Begründung.',
              tip: 'Struktur: Meinung → Begründung 1 → Begründung 2 → Schluss',
              placeholder: 'Ich finde, dass...',
              minWords: 50
            }
          ]
        },
        hoeren: {
          title: 'Hören (Prüfungsformat)',
          exercises: [
            {
              type: 'listening',
              title: '🎧 Prüfungsformat: Ansage im Radio',
              transcript: '<b>Radiomoderator:</b> Guten Morgen, liebe Hörerinnen und Hörer! Heute, am 15. Juni, findet auf dem Marktplatz in Freiburg das jährliche Stadtfest statt. Der Eintritt ist kostenlos. Ab 10 Uhr gibt es Auftritte von lokalen Musikgruppen. Um 14 Uhr startet die große Parade durch die Innenstadt. Für Kinder gibt es eine Bastelecke und ein Kindertheater. Das Fest endet um 22 Uhr mit einem Feuerwerk. Bei Regen findet das Fest in der Stadthalle statt. Weitere Informationen finden Sie auf der Stadtwebsite.',
              questions: [
                { q: 'Wann beginnen die Musikauftritte?', choices: ['Um 9 Uhr', 'Um 10 Uhr', 'Um 12 Uhr', 'Um 14 Uhr'], correct: 1 },
                { q: 'Was passiert um 22 Uhr?', choices: ['Die Parade', 'Das Kindertheater', 'Das Feuerwerk', 'Ein Konzert'], correct: 2 },
                { q: 'Was passiert bei Regen?', choices: ['Das Fest wird abgesagt', 'Es findet in der Stadthalle statt', 'Es findet trotzdem draußen statt', 'Es wird verschoben'], correct: 1 }
              ]
            }
          ]
        },
        lesen: {
          title: 'Lesen (Prüfungsformat)',
          exercises: [
            {
              type: 'reading',
              text: '<h3>📖 Prüfungsformat: Kleinanzeigen</h3><p><b>Anzeige 1 – Sprachkurs:</b> Russischkurs für Anfänger. Dienstags und Donnerstags, 18–20 Uhr. Volkshochschule Mitte. Kosten: 120 € pro Semester. Anmeldung bis 30. September.</p><p><b>Anzeige 2 – Wohngemeinschaft:</b> Suche ruhige/n Mitbewohner/in für 2-Zimmer-Wohnung in Schwabing. 450 € Kaltmiete + NK. Haustiere nur nach Absprache. Nichtraucher bevorzugt.</p><p><b>Anzeige 3 – Verkauf:</b> Verkaufe Fahrrad, 7-Gang, blau, guter Zustand. 80 €. Abholung in Neuhausen. Tel: 089-123456.</p><p><b>Anzeige 4 – Nachhilfe:</b> Biete Nachhilfe in Mathematik und Physik für Schüler ab Klasse 8. Erfahrener Lehrer. 25 € pro Stunde. Online oder vor Ort möglich.',
              questions: [
                { q: 'Was kostet der Russischkurs pro Semester?', choices: ['80 €', '100 €', '120 €', '150 €'], correct: 2 },
                { q: 'Wie viel kostet das Fahrrad?', choices: ['60 €', '80 €', '100 €', '120 €'], correct: 1 },
                { q: 'Ab welcher Klasse bietet der Nachhilfelehrer Unterricht an?', choices: ['Ab Klasse 5', 'Ab Klasse 6', 'Ab Klasse 8', 'Ab Klasse 10'], correct: 2 }
              ]
            }
          ]
        },
        sprechen: {
          title: 'Sprechen (Prüfungsformat)',
          exercises: [
            {
              type: 'speaking',
              prompt: '🎤 PRÜFUNGSAUFGABE Sprechen Teil 1: Präsentation. Thema: "Ehrenamtliche Arbeit". Sprich 2–3 Minuten über: Was ist Ehrenamt? Kennst du Beispiele? Machst du selbst Ehrenamt? Warum ist es wichtig?',
              tips: ['Strukturiere deine Präsentation: Einleitung → Hauptteil → Schluss', 'Nutze Übergänge: Zunächst... / Außerdem... / Zum Schluss...', 'Erkläre Begriffe, wenn nötig', 'Sprich klar und deutlich – Aussprache zählt!'],
              example: 'Ich möchte über Ehrenamt sprechen. Ehrenamt bedeutet, freiwillig und ohne Bezahlung für die Gesellschaft zu arbeiten. Zum Beispiel helfen viele Menschen in Krankenhäusern, Vereinen oder bei der Feuerwehr. Ich selbst helfe manchmal älteren Nachbarn beim Einkaufen. Ich finde Ehrenamt wichtig, weil es die Gesellschaft stärkt und Menschen zusammenbringt. Zum Schluss möchte ich sagen: Jeder kann etwas beitragen, auch mit wenig Zeit.'
            },
            {
              type: 'dialogue',
              prompt: '🎤 PRÜFUNGSAUFGABE Sprechen Teil 2: Gemeinsam planen. Ihr sollt ein Abschiedsfest für einen Kollegen organisieren. Besprecht: Wo? Wann? Was essen? Wer bringt was mit?',
              lines: [
                { speaker: 'Person A', side: 'left', text: 'Also, wir müssen das Fest für Klaus planen. Hast du schon eine Idee, wo wir es machen könnten?' },
                { speaker: 'Person B', side: 'right', text: 'Ich dachte an das Restaurant "Zur Linde". Es hat einen privaten Raum für Gruppen.' },
                { speaker: 'Person A', side: 'left', text: 'Gute Idee! Und wann? Nächsten Freitag nach der Arbeit?' },
                { speaker: 'Person B', side: 'right', text: 'Freitag passt mir gut. Um 19 Uhr?' },
                { speaker: 'Person A', side: 'left', text: 'Prima. Ich kann eine Torte mitbringen. Was machst du?' },
                { speaker: 'Person B', side: 'right', text: 'Ich kümmere mich um die Einladungen und das Geschenk.' }
              ]
            }
          ]
        }
      }
    }
  ]
};
