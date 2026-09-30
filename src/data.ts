import { SiteContent, PublicationItem, OrderItem, ContactMessage } from './types';

export const INITIAL_SITE_CONTENT: SiteContent = {
  brandName: 'Kirjastus Saagu Valgus',
  brandTagline: 'Vaimuliku kirjanduse, elumuutvate tunnistuste ja evangeelsete materjalide kirjastamine Eestis.',
  contactEmail: 'info@saaguvalgus.eu',
  heroBadge: 'Valgus või pimedus?',
  heroTitle: 'Valgus või',
  heroHighlight: 'pimedus?',
  heroDescription: 'Meie väike Eestimaa on haaratud nõidusest. Pigemini minnakse oma muredega abi otsima nõia käest kui elava Jumala käest. Kõikjal on esoteerika poed, new age ehk uus vaimsus kogub üha populaarsust ja jooga on jõudnud isegi lasteaedadesse.',
  
  // PRIMARY BIBLE SCRIPTURE REQUESTED BY AUTHOR
  primaryVerse: {
    ref: 'Joeli 3:5',
    text: 'Ja sünnib, et igaüks, kes hüüab appi Issanda nime, pääseb.',
    theme: 'Peamine päästetõotus',
    isPrimary: true
  },

  // The 3 background Bible verses requested by author
  coreVerses: [
    {
      ref: 'Joeli 3:5',
      text: 'Ja sünnib, et igaüks, kes hüüab appi Issanda nime, pääseb.',
      theme: 'Pääste tõotus ja vabanemine'
    },
    {
      ref: 'Johannese 3:16',
      text: 'Sest nõnda on Jumal maailma armastanud, et ta oma ainusündinud Poja on andnud, et ükski, kes temasse usub, ei hukkuks, vaid et tal oleks igavene elu.',
      theme: 'Jumala armastus ja igavene elu'
    },
    {
      ref: '2. Kuningate 17:17',
      text: 'Ja nad lasksid oma poegi ja tütreid tulest läbi käia; nad küsitlesid ennustajaid ja toimetasid nõidust; nad müüsid endid kurja tegema Issanda silmis, vihastuseks temale.',
      theme: 'Hoiatus okultismi ja nõiduse eest'
    }
  ],

  // THE 3 BIG QUESTIONS (VISUAALSELT SUUREMAD, KESKSEL KOHAL LEHE ÜLAOSAS) - 1:1 AUTORI ALGNE TEKST
  centralQuestions: [
    {
      id: 'noidade-selgeltnagijate-vagi',
      number: 1,
      question: 'Kas oled kunagi mõelnud, KELLELE KUULUB NÕIDADE, SELGELTNÄGIJATE JA TERVENDAJATE VÄGI?',
      fullText: `Meie raamatupoodides on aukohal raamatud nõidusest kõiksugu astroloogilised abimehed on müüduim kaup. Nõiad on teretulnud ka meie telekanalites. Kõikjal on esoteerika poed.

Kuid tegemist ei ole sugugi “süütu lapsemänguga” – usaldades end nõia hoolde ulatad tegelikult sõbrakäe hingevaenlasele ehk saatanale, kes on reaalsem kui lõviosa inimkonnast eales ette kujutada suudab.

On keegi, kes vihkab nõidust kogu südamest – ja see on Jumal, kes on Sinu ja minu ning meie kõigi Looja.

Valides nõiad ja ennustajad, asetad end paratamatult Jumala vaenlaseks. Nendelt saadud abi on aga ajutine ning tagajärjeks on needus – haigus, surm või vaesus. Lisaks Sulle enesele, kes nõidusega tegeled, paned suurde ohtu ka oma lapsed – neilegi laieneb needus Jumala Sõna kohaselt, koguni mitmele põlvkonnale.

Põrgu on reaalne koht. Kuid Sinu Looja soovib Sind sellest päästa! Pöördu abi saamiseks Jeesuse Kristuse poole! Võta ühendust mõne kogudusega ja palu, et Sinu eest palvetatakse.

“Väljaspool on koerad ja nõiad ja hoorajad ja mõrtsukad ja ebajumalateenijad ning kõik, kes valet armastavad ja teevad.” Ilm. 22:15, Piibel

Veel kõneleb Piibel, et meie elus on vaid kaks võimalikku valitsevat olukorda – kas õnnistus või needus.
Nii õnnistused kui needused tulenevad Jumala enese käest ja Tema loal ja on otseselt seotud meie valikutega.

Ma kutsun täna tunnistajaiks teie vastu taeva ja maa: ma olen pannud su ette elu ja surma, õnnistuse ja needuse. Vali nüüd elu, et sina ja su sugu võiksite elada. 5. Ms 30:19, Piibel`,
      bibleVerses: [
        {
          ref: 'Ilmutuse 22:15',
          text: 'Väljaspool on koerad ja nõiad ja hoorajad ja mõrtsukad ja ebajumalateenijad ning kõik, kes valet armastavad ja teevad.'
        },
        {
          ref: '5. Moosese 30:19',
          text: 'Ma kutsun täna tunnistajaiks teie vastu taeva ja maa: ma olen pannud su ette elu ja surma, õnnistuse ja needuse. Vali nüüd elu, et sina ja su sugu võiksite elada.'
        },
        {
          ref: '2. Kuningate 17:17',
          text: 'Ja nad lasksid oma poegi ja tütreid tulest läbi käia; nad küsitlesid ennustajaid ja toimetasid nõidust; nad müüsid endid kurja tegema Issanda silmis, vihastuseks temale.'
        }
      ],
      practicalSteps: [
        'Katkesta koheselt igasugune kontakt nõidade, selgeltnägijate ja tervendajatega.',
        'Pöördu abi saamiseks elava Jumala ja Jeesuse Kristuse poole.',
        'Võta ühendust elava kristliku kogudusega ja palu, et Sinu eest palvetatakse.'
      ],
      category: 'hook'
    },
    {
      id: 'jooga-tegelik-olemus',
      number: 2,
      question: 'Kas oled kunagi mõelnud, MILLEGA TEGELEB TEGELIKULT JOOGA ?',
      fullText: `Kõikjal maailmas, ka Eestis, on kogumas üha enam populaarsust jooga. Enamik inimesi aga ei aimagi, et tegu pole üksnes venitusharjutustega, vaid hoopis vaimse praktikaga, mille käigus avame enesele teadmata vabatahtlikult "uksed" vaimse maailma pimeduse jõududele.

Ei ole olemas neutraalset joogat. Sanskriti sõna yoga tähendab ühendust või ühinemist. Jooga algne eesmärk ei olnud keha venitus ega tervisevõimlemine, vaid inimese sisemine ühinemine n-ö jumaliku tegelikkusega, mida hinduismis nimetatakse brahmaniks.

Kuigi lääne inimene arvab sageli, et jooga koosneb neutraalsetest venitustest, on suurem osa joogapoose pärit mütoloogilistest ja religioossetest kujunditest. Teisisõnu – ebajumalatest. Ja ebajumalate kummardamine on taas midagi, mida Jumal, Sinu Looja, oma Sõna kohaselt vihkab.

Näiteks: Padmāsana, lootoseasend, on seotud jumaliku teadvuse avamisega. Lootos on jumalanna Lakshmi ja loomisjumal Brahma sümbol. Natarājāsana, tantsija asend, kujutab Šivat kosmilise tantsijana, kes loob ja hävitab kogu universumi. Vīrabhadrāsana, sõdalaseasend, meenutab Šiva vihast sündinud sõjajumalat Vīrabhadarat.

Tasub teada, et isegi kui vahetult peale joogatundi ei kogeta midagi erilist, siis see ei tähenda, et ta meid vaimselt ei mõjuta. Tihti ilmnevad siiski negatiivsed tagajärjed ehk needused, olgu siis ärevuse, mõne haiguse vmt. näol.

Kui oled joogaga tegelenud või praegu tegelemas – pöördu sellest ja palu Jeesuselt andeks.

Põrgu on reaalne koht. Kuid Sinu Looja soovib Sind sellest päästa! Pöördu abi saamiseks Jeesuse Kristuse poole! Võta ühendust mõne kogudusega ja palu, et Sinu eest palvetatakse.`,
      bibleVerses: [
        {
          ref: '1. Korintlastele 10:21',
          text: 'Te ei või juua Issanda karikast ja kurjade vaimude karikast, te ei või osa saada Issanda lauast ja kurjade vaimude lauast.'
        },
        {
          ref: 'Joeli 3:5',
          text: 'Ja sünnib, et igaüks, kes hüüab appi Issanda nime, pääseb.'
        }
      ],
      practicalSteps: [
        'Mõista, et jooga asanad ja filosoofia on lahutamatult seotud idamaise religiooniga.',
        'Kui oled joogaga tegelenud või tegelemas – pöördu sellest ja palu Jeesuselt andeks.',
        'Otsi tõelist rahu Jeesuse Kristuse juurest ja palu koguduses eestpalvet.'
      ],
      category: 'hook'
    },
    {
      id: 'new-age-uusvaimsus',
      number: 3,
      question: 'Kas oled kunagi mõelnud, MILLIST VAIMSUST KANNAB ENESES TEGELIKULT NEW AGE EHK UUS VAIMSUS?',
      fullText: `Kui märkad kas sotsiaalmeedias või mujal postitusi, milles kõneldakse pealtnäha ilusat juttu ja kus sind õpetatakse iseenda kohta ütlema, et "olen valgus", "olen armastus", "loon ise oma reaalsuse" või et "olen iseenese jumal", siis tea, et kõik see ongi new age ehk uus vaimsus.

Veel on kasutusel mõisted “kanaldamine”, “meditatsioon”, “mindfullness”,  “kõrgem mina”, “külgetõmbeseadus, inglise keeles tuntud mõistena law of attraction”, “väekristallid”, “holistika”, “kohalolu”, “tantra”,  “mantra”, “mandala” jne.

New age ehk uus vaimsus koondab endas väga laias spektris vaimseid praktikaid, mis paraku ei vii kedagi soovitud rahuni, vaid hoopis saatana “käevangu” ja edasi tema meelevalla alla, kust on sageli hiljem väga keeruline välja saada.

Põrgu on reaalne koht. Kuid Sinu Looja soovib Sind sellest päästa! Pöördu abi saamiseks Jeesuse Kristuse poole! Võta ühendust mõne kogudusega ja palu, et Sinu eest palvetatakse.

Ja see ei ole ime, sest saatan ise moondab ennast valguse ingliks. 2. Kr. 11:14 Piibel`,
      bibleVerses: [
        {
          ref: '2. Korintlastele 11:14',
          text: 'Ja see ei ole ime, sest saatan ise moondab ennast valguse ingliks.'
        },
        {
          ref: 'Johannese 14:6',
          text: 'Jeesus ütles talle: Mina olen tee ja tõde ja elu. Ükski ei saa minna Isa juurde muidu kui minu kaudu.'
        }
      ],
      practicalSteps: [
        'Tunnista ära new age pettus ("loon ise reaalsuse", "olen iseenese jumal", väekristallid, kanaldamine).',
        'Pöördu saatana meelevalla alt ainsa elava Looja poole Jeesuse Kristuse nimel.',
        'Palu kogudusel enda eest palvetada ja leia vabanemine.'
      ],
      category: 'hook'
    }
  ],

  // ADDITIONAL FOUNDATIONAL TOPICS - 1:1 AUTORI ALGNE TEKST
  tractQuestions: [
    {
      id: 'hoia-kodu-puhas',
      number: 1,
      question: 'Hoia oma kodu puhas! (Neetud esemed meie kodus)',
      fullText: `Veel on oluline teada, et meie kodu peab olema puhas esemetest, mis võivad samuti avada ukse needustele meie elus. Selleks võib olla juhuslik suveniir mõnest esoteerika poest või mistahes ese, mida on kasutanud keegi, kes on tegelenud nõidusega. See on samuti ebajumalate kummardamine.

Nõidusele viitavate või muul moel vale vaimsust kandvate esemete oma kodus omamine on Jumala silmis patt - see on koostöö pimedusega, saatanaga.

Kui koged seletamatut rõhumist või mingeid muid anomaaliaid, siis eksisteerib võimalus, et Sinu kodus on ebapuhtaid esemeid. Tark on puhastada oma kodune territoorium “saatanale kuuluvast kraamist”, st kõigest, mis seotud nõiduse. Ebajumalakummarduse või muul kombel neetud esemetest.

Nende jumalakujud põletage tules; ära himusta hõbedat ja kulda nende pealt ja ära võta seda endale, et sind sellega ei võrgutataks, sest see on jäledus Issandale, su Jumalale! 26 Ära vii niisugust jäledust oma kotta, et sinagi ei saaks neetuks nagu see; sa pead seda ülimalt põlgama ja jälestama, sest see on neetud asi! 5.Ms. 7:25-26, Piibel`,
      bibleVerses: [
        {
          ref: '5. Moosese 7:25-26',
          text: 'Nende jumalakujud põletage tules; ära himusta hõbedat ja kulda nende pealt ja ära võta seda endale, et sind sellega ei võrgutataks, sest see on jäledus Issandale, su Jumalale! Ära vii niisugust jäledust oma kotta, et sinagi ei saaks neetuks nagu see; sa pead seda ülimalt põlgama ja jälestama, sest see on neetud asi!'
        }
      ],
      practicalSteps: [
        'Vaata kriitiliselt üle oma kodu: esoteerikapoest ostetud suveniirid, nõidusesemed, ebajumalakujud.',
        'Puhasta oma kodune territoorium saatanale kuuluvast kraamist ja viska need välja.',
        'Palu, et Jumal puhastaks ja õnnistaks sinu kodu ning tooks oma rahu.'
      ]
    },
    {
      id: 'igauele-oma-jumal',
      number: 2,
      question: 'Palju jumalaid – kas see on tõde? (Igaühele «oma jumal»)',
      fullText: `Meie ajastule on omane mõtteviis, et eksisteerib palju erinevaid jumalaid (budism, hinduism, islam jmt) ning kõik on justkiu lubatud. Et igaüks võib valida endale “jumala vastavalt oma maitsele” või siis üldse mitte midagi muud peale nähtava reaalsuse uskuda.

Kuid see ei ole tõsi. Kõigi nende n-ö alternatiivsete, eksitavate religioonide-usundite eesmärk on vaid üks – juhtida inimene võimalikult kaugele tõelisest, elavast Jumalast. See kõik on saatana pettus, et hoida inimesi oma meelevalla all, et nad mitte mingil juhul ei pöörduks ainsa, elava Jumala juurde ega pääseks. Ja Sa juba taipad, millest.

Jah, Jumala viha ilmub taevast inimeste igasuguse jumalakartmatuse ja ülekohtu vastu, nende vastu, kes tõde hoiavad ülekohtu kammitsais, Rm. 1:18, Piibel`,
      bibleVerses: [
        {
          ref: 'Roomlastele 1:18',
          text: 'Jah, Jumala viha ilmub taevast inimeste igasuguse jumalakartmatuse ja ülekohtu vastu, nende vastu, kes tõde hoiavad ülekohtu kammitsais.'
        },
        {
          ref: 'Johannese 14:6',
          text: 'Jeesus ütles talle: “Mina olen tee ja tõde ja elu. Ükski ei saa minna Isa juurde muidu kui minu kaudu.”'
        }
      ]
    },
    {
      id: 'hea-inimene-paasemine',
      number: 3,
      question: 'Kas ma pääsen põrgust, kui olen hea inimene?',
      fullText: `Veel on levinud (eksi)arusaam, et kui oleme head inimesed, siis meiega on kõik hästi ja kohe kindlasti ei satu hea inimene põrgusse. Kuid tõde on, et ilma Jeesuse Kristuseta, Jumala ainusündinud Pojata pole see mitte kuidagi võimalik!

Saatanal pole midagi selle vastu, et sa oled hea inimene. Teda ei häiri, et sa oled vabatahtlik toidupangas, sorteerid prügi ning käid vanaprouadele abiks. Teda ei häiri, et oled lahke, helde ja meeldid kõigile oma kogukonnas. Tema jaoks on oluline see, et sa Jeesuse ees ei kummardaks.

Saatana vale, mida usuvad miljonid inimesed üle kogu maailma, on veendumus, et kõrge moraal võrdub vaimsusega. Et olla hea inimene on sama, mis olla kristlane. Et kui sa lihtsalt elad õigesti, inimeste maailma reeglitele kohaselt, kohtled inimesi hästi ja väldid suurimaid patte, oled sa Jumala ees piisavalt tubli.

Ning – tasub üle vaadata, millist muusikat me kuulame, millist meelelahutust tarbime. Kas vaatate filme, mis näitavad teile abielurikkumist ja patuelu, või vargust? Või ka otsest nõidust ja satanismi, nagu on ka paljudes n-ö õudusfilmides. Meie meeled on “uks” – ka seda kaudu saame end avada pimeduse jõududele.

sest kõik on pattu teinud ja ilma jäänud Jumala kirkusest. Rm. 3:23

Jeesus ütles talle: “Mina olen tee ja tõde ja elu. Ükski ei saa minna Isa juurde muidu kui minu kaudu.” Joh 14:5, Piibel

Hea uudis on aga see, et veel on armuaeg. Meil on veel võimalik Tema juurde naasta, võttes oma südames vastu Tema Poja Jeesuse.

…ja kui siis minu rahvas, kellele on pandud minu nimi, alandab ennast ja nad palvetavad ja otsivad minu palet ning pöörduvad oma kurjadelt teedelt, siis ma kuulen taevast ja annan andeks nende patu ning säästan nende maa. 2 Aj. 7:14, Piibel

Te ei või juua Issanda karikast ja kurjade vaimude karikast, te ei või osa saada Issanda lauast ja kurjade vaimude lauast. 1. Kr. 10:21, Piibel`,
      bibleVerses: [
        {
          ref: 'Roomlastele 3:23',
          text: 'sest kõik on pattu teinud ja ilma jäänud Jumala kirkusest.'
        },
        {
          ref: 'Johannese 14:6',
          text: 'Jeesus ütles talle: “Mina olen tee ja tõde ja elu. Ükski ei saa minna Isa juurde muidu kui minu kaudu.”'
        },
        {
          ref: '2. Ajaraamat 7:14',
          text: '…ja kui siis minu rahvas, kellele on pandud minu nimi, alandab ennast ja nad palvetavad ja otsivad minu palet ning pöörduvad oma kurjadelt teedelt, siis ma kuulen taevast ja annan andeks nende patu ning säästan nende maa.'
        },
        {
          ref: '1. Korintlastele 10:21',
          text: 'Te ei või juua Issanda karikast ja kurjade vaimude karikast, te ei või osa saada Issanda lauast ja kurjade vaimude lauast.'
        }
      ]
    }
  ],

  cleanlinessTitle: 'Hoia oma kodu puhas!',
  cleanlinessSubtitle: 'Vaimulik kaitse & vabanemine',
  cleanlinessDescription: 'Veel on oluline teada, et meie kodu peab olema puhas esemetest, mis võivad samuti avada ukse needustele meie elus. Selleks võib olla juhuslik suveniir mõnest esoteerika poest või mistahes ese, mida on kasutanud keegi, kes on tegelenud nõidusega. See on samuti ebajumalate kummardamine. Nõidusele viitavate või muul moel vale vaimsust kandvate esemete oma kodus omamine on Jumala silmis patt - see on koostöö pimedusega, saatanaga.',
  cleanlinessSteps: [
    { title: '1. Tuvasta ja eemalda', desc: 'Puhasta oma kodune territoorium “saatanale kuuluvast kraamist” – esoteerilised suveniirid, nõidusesemed, ebajumalakujud.' },
    { title: '2. Tunnista ja palu andestust', desc: 'Pöördu sellest patust ja palu Jeesuse Kristuse nimel andeks.' },
    { title: '3. Palu Jumala kaitset', desc: 'Kutsu Jumala rahu ja Püha Vaim oma kotta, et sinagi ei saaks neetuks.' }
  ],

  // Real life testimonials
  testimonials: [
    {
      id: 'vabanemine-esoteerikast',
      title: 'Vabanemine esoteerika ja okultismi köidikutest',
      person: 'Tõestisündinud vabanemislugu',
      type: 'vabanemine',
      summary: 'Aastatepikkune ekslemine esoteerikas ja okultismis tõi lõpuks meeleheite. Kuidas Jeesuse poole hüüdmine tõi täieliku vabaduse ja hingerahu.',
      fullStory: 'Kui mulle ulatati Uus Testament ja sain teada, et Jeesus Kristus on surnud minu pattude eest, hüüdsin Tema nime. Sellest hetkest langesid aastatepikkused hirmud ja minu südamesse tuli tõeline rahu.',
      youtubeId: '',
      youtubeUrl: ''
    },
    {
      id: 'ime-ja-tervenemine',
      title: 'Tervenemine ja meeleheite lõpp',
      person: 'Isiklik tunnistus',
      type: 'tervenemine',
      summary: 'Arstide lootusetu diagnoos asendus tervenemisega pärast eestpalvet ja elava Jumala poole pöördumist.',
      fullStory: 'Jumal vastab palvetele ka täna. Pöördudes elava Jumala poole kogesin Tema tervendavat armastust ja täielikku muutust oma elus.',
      youtubeId: '',
      youtubeUrl: ''
    }
  ],

  // Publisher story & books without price tags
  publisherStoryTitle: 'Kirjastuse Saagu Valgus sünnilugu',
  publisherStoryText: 'Kirjastus Saagu Valgus sai alguse sügavast igatsusest tuua Eesti inimesteni selget, moonutamata ja elumuutvat vaimulikku kirjandust. Meie missiooniks on kirjastada raamatuid ja evangeelseid materjale, mis avavad silmi, aitavad vabaneda pimeduse pettustest ning juhivad inimesi elavasse suhtesse Jeesuse Kristusega.',

  books: [
    {
      id: 'laps-ja-jumal',
      title: 'Laps ja Jumal',
      author: 'Kirjastus Saagu Valgus',
      category: 'Lasteraamat',
      description: 'Lasteraamatus "Laps ja Jumal" jagavad kristlike perede lapsed oma kogemusi Jumalaga - millisena nad oma Loojat näevad, mida Ta on nende elus teinud, kuidas nende palvetele vastanud, milliseid imesid teinud.',
      highlights: [
        'Kristlike perede laste ehedad kogemused Jumalaga',
        'Millisena lapsed oma Loojat näevad ja mida Ta on nende elus teinud',
        'Kuidas Jumal on laste palvetele vastanud ja milliseid imesid teinud'
      ],
      isFeatured: true,
      isPreOrder: false
    },
    {
      id: 'ma-olin-saatana-vang',
      title: 'Ma olin saatana vang',
      author: 'Kirjastus Saagu Valgus',
      category: 'Tõestisündinud vabanemislugu',
      description: 'Vapustav ja tõestisündinud tunnistus inimesest, kes oli sügaval okultismi, nõiduse ja pimeduse köidikutes, kuid kelle Jeesus Kristus imeliselt ja täielikult vabastas.',
      highlights: [
        'Aus pilguheit esoteerika ja okultismi tegelikule vaimsele hinnale',
        'Jeesuse Kristuse risti ja nime ülim meelevald kurjuse üle',
        'Teejuht täieliku vabanemise, andestuse ja uue alguseni'
      ],
      isFeatured: true,
      isPreOrder: false
    },
    {
      id: 'saagu-valgus-raamat',
      title: 'Saagu Valgus: Tõde ja vabanemine',
      author: 'Kirjastus Saagu Valgus',
      category: 'Uus trükis / Vaimulik teejuht',
      description: 'Kirjastuse Saagu Valgus uus põhjalik trükis ja käsiraamat, mis käsitleb süvitsi vaimseid küsimusi, vabastust kurjuse sidumistest ja elu Jumala armu valguses.',
      highlights: [
        'Süvendatud vastused 3 põhiküsimusele ja esoteerika ohtudele',
        'Kodu ja vaimse territooriumi puhastamise täielik juhend',
        'Ehedad tervenemis- ja vabanemistunnistused Eestist'
      ],
      isFeatured: true,
      isPreOrder: true,
      preOrderNote: 'Uus trükk ilmumas! Ettetellijatele broneeritud esitrükk ja kingituseks evangeelne järjehoidja.',
      releaseDate: 'Ilmumas peagi'
    }
  ],

  // Support / Tule toetajaks
  support: {
    title: 'Tule toetajaks!',
    subtitle: 'Aita levitada Valgust üle kogu Eestimaa',
    description: 'Kirjastus Saagu Valgus annab välja evangeelseid materjale ja elumuutvaid raamatuid. Sinu toetus aitab trükkida uusi infomaterjale, postitada raamatuid ning viia tõe sõnumit nendeni, kes seda kõige enam vajavad.',
    recipientName: 'Kirjastus Saagu Valgus',
    iban: 'EE123456789012345678',
    bankName: 'Swedbank / LHV Pank',
    swift: 'HABALV22',
    reference: 'Annetus kirjastustööks',
    explanation: 'Kirjastuse toetus / Kirjastustöö ja trükised',
    supportGoals: [
      'Evangeelsete materjalide trükkimine ja levitamine üle Eesti',
      'Uute vaimulike raamatute ja tunnistuste kirjastamine',
      'Vaimuliku toe ja infomaterjalide kättesaadavaks tegemine otsijatele'
    ]
  },

  salvationPrayerTitle: 'Päästepalve',
  salvationPrayerSubtitle: 'Päästepalve elava Jumala poole',
  salvationPrayerIntro: 'Kui soovid pöörduda ja saada päästetud, võid palvetada selle palve siiralt oma südamega:',
  salvationPrayerText: `Kallis Taevane Isa!

Ma tulen Su Juurde Jeesuse Kristuse nimel. Ma olen patune. Palun anna andeks mu patud. Tule mu südamesse. Juhi mind, loo mind uueks. Ma Tänan, Jeesus, Kolgata risti eest, et Sa valasid oma vere minu pattude eest, et mina võiksin patud andeks saada ja omada igavest elu.
Palun täida mind Püha Vaimuga. Ma vōtan vastu Püha Vaimu just nüüd. Sinu Sõna ütleb: “Sõna on su lähedal, sinu suus ja su südames. See on usu sõna, mida me kuulutame. Kui sa oma suuga tunnistad, et Jeesus on Issand, ja oma südames usud, et Jumal on ta üles äratanud surnuist, siis sind päästetakse, sest südamega usutakse õiguseks, suuga aga tunnistatakse päästeks.” Rm.10:8,9 Jumala Sõna ehk Piibel.
Nüüd ma tunnistan oma suuga, et Jeesus Kristus on Issand ja ma usun, et Jumal äratas Ta surnuist ülesse, Ta kandis mu patud ja needused ristile ja äratati surnuist, et mina vōiksin saada Jumala lapseks. Tänan, et Sinu Sõna kohaselt olen ma selle tunnistusega päästetud lootuses. Aamen.

Kallis Issand Jeesus, palun anna oma Sõna kohaselt kinnituseks rahu. Nagu on kirjutatud Jh. 14:27 “Rahu ma jätan teile, oma rahu ma annan teile. Mina ei anna teile nõnda nagu maailm annab. Teie süda ärgu ehmugu ega mingu araks!”
Tänan selle rahu eest.
Aamen.`,
  salvationPrayerNextSteps: [
    {
      title: '1. Pöördu Jeesuse poole',
      desc: 'Tunnista oma suuga ja usu oma südames, et Jeesus on Issand ja Jumal äratas Ta surnuist.'
    },
    {
      title: '2. Võta ühendust kogudusega',
      desc: 'Võta ühendust elava kristliku kogudusega ja palu, et Sinu eest palvetatakse.'
    },
    {
      title: '3. Hoia oma elu ja kodu puhas',
      desc: 'Loobu igasugusest nõidusest, okultismist ja ebajumalatest ning toetu Jumala Sõnale.'
    }
  ],

  // Lord's Prayer (Meie Isa palve) - 1:1 AUTORI SÕNASTUS
  lordPrayer: {
    title: 'Meie Isa palve',
    subtitle: 'Meie Isa palve',
    intro: 'Palve, mida õpetas Jeesus Kristus:',
    text: `Meie Isa, kes Sa oled Taevas! Pühitsetud olgu Sinu nimi, Sinu riik tulgu, Sinu tahtmine sündigu, nagu Taevas, nõnda ka maapeal.
Meie igapäevast leiba anna meile tänapäev, ja anna meile andeks meie võlad, nagu (kui) meiegi andeks anname oma võlglastele. Ja ära saada meid kiusatusse, vaid päästa meid ära kurjast! Sest Sinu päralt on Riik ja Vägi ja Au. Igavesti. Aamen.`,
    ref: 'Piibel'
  }
};

export const INITIAL_PUBLICATIONS: PublicationItem[] = [
  {
    id: 'tode-ja-vabanemine-voldik',
    title: 'Saagu Valgus: Tõde ja vabanemine',
    author: 'Kirjastus Saagu Valgus',
    category: 'Infovoldik',
    description: 'Ametlik infotrükis, mis selgitab Valguse ja pimeduse vahelist võitlust, okultismi ohte ning teed vabanemisele Jeesuses Kristuses.',
    fileSize: '1.4 MB',
    pages: 4,
    fileName: 'Saagu_Valgus_Tode_ja_vabanemine.pdf',
    uploadedAt: '2026-09-20',
    downloadCount: 142,
    contentPages: [
      {
        pageNumber: 1,
        heading: 'Valgus või pimedus? Tõe tundmine vabastab',
        text: `Meie väike Eestimaa on haaratud nõidusest. Pigemini minnakse oma muredega abi otsima nõia käest kui elava Jumala käest. Kõikjal on esoteerika poed, new age ehk uus vaimsus kogub üha populaarsust ja jooga on jõudnud isegi lasteaedadesse.\n\nKuid Piibel ütleb selgelt: «Ja sünnib, et igaüks, kes hüüab appi Issanda nime, pääseb!» (Joeli 3:5). Pääste ja vabanemine ei tule okultismist ega kristallidest, vaid Kolgata ristilt, kus Jeesus Kristus võitis ära pimeduse väed.`
      },
      {
        pageNumber: 2,
        heading: 'Kas nõidadel ja selgeltnägijatel on vägi?',
        text: `Jah, neil on reaalne vägi, aga see vägi ei ole Jumalast. See on deemonlik vägi, mis lõpuks seob ja hävitab inimese hinge.\n\nPiibel hoiatab 2. Kuningate 17:17: «Ja nad toimetasid oma poegi ja tütreid tulest läbi, nõidusid ja laususid, ja müüsid endid tegema kurja Issanda silmis, vihastades Teda.» Ära lase end petta näilisest "valgest maagiast" – iga nõidus on Jumala silmis jäledus.`
      },
      {
        pageNumber: 3,
        heading: 'Puhasta oma elu ja kodu',
        text: `1. Tuvasta ja eemalda esoteerilised suveniirid, nõidusesemed ja ebajumalakujud oma kodust.\n2. Tunnista oma patud ja kahetse seotust maagia või ennustajatega.\n3. Anna andeks kõigile, kes on sulle haiget teinud.\n4. Palu Jeesus oma südame ja elu Issandaks.\n5. Liitu elava kristliku kogudusega ja toetu Jumala Sõnale igapäevaselt.`
      },
      {
        pageNumber: 4,
        heading: 'Kirjastuse kontakt ja vaimulik tugi',
        text: `Kirjastus Saagu Valgus annab välja trükiseid ja raamatuid, mis toovad pimedusse selgust.\n\nE-post: info@saaguvalgus.eu\nKoduleht: https://saaguvalgus.eu\n\n«Sest nõnda on Jumal maailma armastanud, et Ta oma ainusündinud Poja on andnud, et ükski, kes Temasse usub, ei hukkuks, vaid et tal oleks igavene elu.» (Jh 3:16)`
      }
    ]
  },
  {
    id: 'laps-ja-jumal-tutvustus',
    title: 'Laps ja Jumal – Tutvustustrükis peredele',
    author: 'Kirjastus Saagu Valgus',
    category: 'Lastekirjandus',
    description: 'Värviline väljatrükitav infoleht lasteraamatust «Laps ja Jumal», kus lapsed jagavad oma elulisi kogemusi Jumalaga.',
    fileSize: '2.1 MB',
    pages: 2,
    fileName: 'Laps_ja_Jumal_infotrükis.pdf',
    uploadedAt: '2026-09-22',
    downloadCount: 98,
    contentPages: [
      {
        pageNumber: 1,
        heading: 'Lapsed jagavad: Kes on Jumal minu elus?',
        text: `Lasteraamatus «Laps ja Jumal» jagavad kristlike perede lapsed oma siiraid kogemusi Jumalaga – kuidas Jumal vastab palvetele, kaitseb kooliteel ja tervendab haigusi.\n\nRaamat aitab lastel ja vanematel avada sügavaid usuteemasid läbi soojade, eluliste lugude ja värvikate illustratsioonide.`
      },
      {
        pageNumber: 2,
        heading: 'Õpeta lapsele palvetamist ja vaimulikku kaitset',
        text: `Tänapäeva maailmas on lapsed avatud suurele hulgale vaimulikule segadusele. See trükis on abivahend vanematele, vanavanematele ja pühapäevakoolidele.\n\nTellimine ja ettetellimine on avatud Kirjastuse Saagu Valgus kodulehel.`
      }
    ]
  },
  {
    id: 'igauele-oma-jumal-voldik',
    title: '«Igaühele oma jumal»? – Tõe teejuht',
    author: 'Kirjastus Saagu Valgus',
    category: 'Evangeelne trükis',
    description: 'Infoleht, mis vastab tänapäeval levinud küsimusele: kas kõik teed viivad sama Jumalani või on olemas auline Tõde?',
    fileSize: '890 KB',
    pages: 2,
    fileName: 'Igauele_oma_jumal_selgitus.pdf',
    uploadedAt: '2026-09-25',
    downloadCount: 76,
    contentPages: [
      {
        pageNumber: 1,
        heading: 'Kas tõesti on igal inimesel oma tõde?',
        text: `Paljud ütlevad täna: "Igaühel on oma tõde ja oma tee." Kuid loogika ja reaalsus räägivad teist keelt – kui kaks väidet on vastandlikud, ei saa mõlemad olla üheaegselt tõde.\n\nJeesus ütles: «Mina olen tee ja tõde ja elu. Ükski ei saa Isa juurde muidu kui Minu kaudu.» (Jh 14:6). Jumal ei ole kauge ega ebamäärane kosmiline energia, vaid armastav Looja.`
      },
      {
        pageNumber: 2,
        heading: 'Leppimine elava Jumalaga',
        text: `Kõik inimesed on pattu teinud ja Jumala aust ilma jäänud. Kuid Kristuses pakutakse meile täielikku andestust ja uut elu.\n\nPrindi see trükis välja, loe ja jaga sõbrale!`
      }
    ]
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-101',
    type: 'preorder',
    bookId: 'saagu-valgus-raamat',
    bookTitle: 'Saagu Valgus: Tõde ja vabanemine',
    quantity: 2,
    name: 'Marek Tamm',
    email: 'marek.tamm@gmail.com',
    phone: '+372 5551 2345',
    address: 'Omniva Tallinna Kristiine Keskus',
    notes: 'Soovin kindlasti esimese trüki eksemplari.',
    status: 'uus',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'ord-102',
    type: 'order',
    bookId: 'laps-ja-jumal',
    bookTitle: 'Laps ja Jumal',
    quantity: 1,
    name: 'Kristiina Kallas',
    email: 'kristiina.kallas@neti.ee',
    phone: '+372 5123 9876',
    address: 'Smartpost Tartu Kaubamaja',
    notes: 'Palun pakkida kingitusena.',
    status: 'kinnitatud',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-201',
    name: 'Andres Kuusk',
    email: 'andres.kuusk@mail.ee',
    message: 'Tere! Kas teie trükiseid ja raamatuid saab tellida ka suuremas koguses kohalikule kogudusele levitamiseks?',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    read: false
  }
];

