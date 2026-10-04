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
    { title: 'Mõista jooga tegelikku olemust', desc: 'Mõista, et jooga asanad ja filosoofia on lahutamatult seotud idamaise religiooniga.' },
    { title: 'Tuvasta ja eemalda', desc: 'Puhasta oma kodune territoorium “saatanale kuuluvast kraamist” – esoteerilised suveniirid, nõidusesemed, ebajumalakujud.' },
    { title: 'Tunnista ja palu andestust', desc: 'Pöördu sellest patust ja palu Jeesuse Kristuse nimel andeks.' },
    { title: 'Palu Jumala kaitset', desc: 'Kutsu Jumala rahu ja Püha Vaim oma kotta, et sinagi ei saaks neetuks.' }
  ],

  // Real life testimonials
  testimonials: [
    {
      id: 'kairi-oja-tunnistus',
      title: 'Kairi tunnistus – Vabanemine 5 aastat kestnud karmist vaimsest sidumisest',
      person: 'Kairi Oja',
      type: 'vabanemine',
      date: '08.03.2025',
      image: '/src/assets/images/kairi_oja_portrait_1791059785550.jpg',
      facebookUrl: 'https://www.facebook.com/share/1DUothVLCF/',
      facebookPageTitle: 'Saagu Valgus - kas Jumal on reaalne?',
      summary: 'Elame vaimses maailmas, mis domineerib selle reaalsuse üle, mida meie siin maailmas reaalsuseks oleme harjunud pidama. Jeesus Kristus tegi mind 08.03.2025 vabaks viis pikka aastat kestnud karmist vaimsest sidumisest, piinast, vangistusest ja pimedusest.',
      fullStory: `Elame vaimses maailmas, mis domineerib selle reaalsuse üle, mida meie siin maailmas reaalsuseks oleme harjunud pidama.
Jeesus Kristus tegi mind 08.03.25, veidi üle aasta tagasi vabaks viis väga pikka aastat (2020-2025) kestnud karmist vaimsest sidumisest - piinast, vangistusest ja rõhumisest.
Kiitus ja tänu Issandale selle eest!

Mis on üldse vaimne sidumine?
See on olukord, mil saatan saab inimese üle MEELEVALLA oma kurjade vaimude läbi, keda ta kasutab.
Ma ei saanud need viis aastat tegeleda oma pojaga, kes oli sidumise alguses 13-aastane. Ma ei saanud teha tööd ega üldse mitte midagi peale voodi äärel istumise või lamamise. Piin oli tohutu.
Toonitan, et see olukord polnud vähmalgi määral seotud ei depressiooni ega muu taolisega.
Kõik see algas minuga sisuliselt üleöö, olin kogu varasema elu olnud aktiivne ja energiline. Kõik, mis minuga aset leidis, oli selgelt deemonlik.

Piibel ütleb meile, et kui me ei käi selles elus koos Jumalaga ega ela Tema Seaduste ehk Jumala Sõna järgi, saavad meile õnnistuste asemel osaks NEEDUSED.
Ja just nii juhtus ka minuga.
Oigasin sageli piinast, ei maganud peaaegu üldse ja nägin unes košmaare. Ma ei saanud kõik need viis aastat EI NUTTA EGA NAERDA.
Käisin haruharva kodu uksest väljas. Mu ema (täna 83a) tegi kõike, st kandis hoolt nii minu kui mu poja (täna 19a) eest kogu selle aja.

Miks see kõik mind tabas?
Olin neliteist pikka aastat n-ö nimekristlane. See tähendab, et olin küll uskunud Jumalat ja saanud ka ristitud aastal 2008 Tallinna Metodisti koguduses, kuulunud sellesse kogudusse ja käinud pühapäeviti ka kirikus, kuid ma EI TUNDNUD Jumalat.
Mul puudus Temaga igasugune isiklik suhe, sest ma ei lugenud nende 14 aasta vältel KORDAGI ise Jumala Sõna ja minus polnud seega Tõde ehk Jeesust.
Mu meeled ei uuenenud ning ma ei osanud aimatagi, mis on uuestisünd. Või kes on tegelikult Jumal, kes on Jeesus, mida tähendab Teda tunda, kes on Püha Vaim, mis tunne on kogeda Jumala üleloomulikku rahu...
Nüüd ma tean, mis tunne see on, ja see tunne on kirjeldamatult hea, ma ei vahetaks seda iial enam millegi vastu!

Aga tagasi minu loo juurde..
Peale ristimist aastal 2008 käisin koguduses esimesed paar aastat küll hoolega, kuid kuna Tõde polnud minus, astus mu jalg üle koguduse lävepaku edasiste aastate vältel üsna kaootiliselt, kuni "vajusin" ajapikku täiesti "maailma tagasi".
Olin oma maja ehitanud kalju asemel liivale!
“Ja igaüks, kes neid mu sõnu kuuleb, ent nende järgi ei tee, sarnaneb rumala mehega, kes ehitas oma maja liivale. Ja sadas paduvihma ja tulid veevood ja puhusid tuuled ning sööstsid vastu seda maja ja see varises ja selle kokkuvarisemine oli ränk.” (Mt 7:26-27, Piibel)

Nüüd, mil ma kõnnin siin elus päriselt koos Jeesusega tean ma, mida see kirjakoht tegelikkuses tähendab.
Olin enne sidumise algust kümmekond aastat olnud vabakutseline ajakirjanik ja kirjutanud ka mõned raamatud.
Kuna ma Jumalat ei tundnud ja Tõde polnud minus, siis valitses PATT (sh uhkus, ülbus, auahnus, jumalakartmatus, hoorus, omaõigus, nõidus) mu elus.
Piibel räägib, et patt saab valitseda koguni kuningana inimese elus.
“Ärgu siis valitsegu patt kuningana teie surelikus ihus, nii et te tema himudele oleksite kuulekad.” (Rm 6:12, Piibel)

Kuid patt lahutab inimese Jumalast ja annab saatanale meelevalla meie üle, ja kui siis meil on lisaks veel avatud mõningad vaimse maailma UKSED, saabki saatan oma kurjade vaimude läbi meid rünnata ja ka vangistada.
Eriti ohtlik on see siis, kui oleme juba vaimse maailma kontekstis lepingus Jeesusega, ent ikka teeme edasi lubamatuid asju.
Kogesin viis aastat TÄIELIKKU ERALDATUST Jumalast, sh ka maailmast, inimestest.
Tänaval käies tundus, nagu ma oleksin puuris ja sõna otseses, füüsilises mõttes kannaksin seda puuri ise veel kaasas ka. Piin oli tõesti kirjeldamatu!

Mulle tehti loendamatuid vabastuspalveid, minu eest palvetasid väga paljud kristlased nii Eestis kui väljaspool Eestit. Otsisin abi kõikjalt sisuliselt 24h.
Otsisin lakkamatult abi, kuid seda ei tulnud, sest kõik see, mis andis saatanale n-ö legaalse õiguse minu üle oli nii minu enese kui ka kõigi teiste eest varjatud.
Palju kordi plaanisid mitmed õed-vennad mu kodu üle vaatama tulla, ent iga kord leidis saatan võimaluse need plaanid nurjata.
Hüüdsin sageli tundide kaupa lihtsalt Jeesust appi, palju päevi ja kuid veetsin oma voodi ees põlvili Jumalat paludes.

Sain viimaks vabaks läbi Kanada jumalameeste 08.03.2025, kellele Jumala Vaim ilmutas viimaks mu sidumise põhjuseid.
Neid oli mitu.

Esiteks olin kirjutanud aastal 2017 lasteraamatu "Onu Internet ja nutikaigas".
Pealtnäha oli tegu õpetliku looga, kus heatahtlik mehike Onu Internet lapsi õpetamiseks oma pessa võlus ehk nõidus. Kuid nõidus on midagi, mida Jumal VIHKAB.
Kuna tahtsin toona maailmas, tegelikult täielikus pimeduses elades mõjuda oma noortele lugejatele "ägeda ja lahedana", siis olin kirjutanud raamatu teksti sisse eriti jumalakartmatud fraasid nagu "Mis siin nii põrgulikult naljakat on?", "Oh my God!" (otseselt kümne käsu vastu eksimine) ning "Onu Internet, kas sa tõepoolest nõiud meid siia oma pessa?".
Kuid justnimelt põrgulikuks mu elu kujuneski järgmiseks viieks aastaks, sest olin selle raamatu läbi iseend oma suu sõnadega neednud, lisaks sidunud end täiesti legaalselt ja otseselt nõidusega.
See raamat oli mu sidumise vundament, sisuliselt leping saatanaga.

“Väljaspool on koerad ja nõiad ja hoorajad ja mõrtsukad ja ebajumalateenijad ning kõik, kes valet armastavad ja teevad.” (Ilmutuse raamat 22:15, Piibel)
“Sa ei tohi nõnda teha Issandale, oma Jumalale, sest kõike, mis Issandale on jäledus, mida ta vihkab, on nemad teinud oma jumalatele; nad on isegi oma poegi ja tütreid põletanud tules oma jumalatele!” (5Ms 12:31, Piibel)

Too lasteraamat oli mingil kombel aastaks 2018 saavutanud teatava populaarsuse algklassiõpetajate seas ning see oli valitud koguni mitmes koolis kohustusliku kirjanduse hulka.
Maailma-inimesena olin toona oma "töö" tulemuste üle väga uhke.
Vabanedes otseselt saatana mõju alt tegin läbi korraliku meeleparanduse protsessi, öeldes avalikult lahti tolle raamatu autori staatusest. 
Paari-kolme nädala vältel saatsin sel teemal e-posti teel kirjad nii raamatukauplustesse kui raamatukogudesse, teavitamaks neid, et minust on saanud nüüd kristlane, et see raamat pajatab sisuliselt nõidusest ning et see on midagi, mida Jumal vihkab ning millega mina enam samastuda ei soovi.
Andsin sellest teada ka sotsiaalmeedias.

Pea samavõrd suure kaaluga oli asjaolu, et lugesin aastaid new age ehk uue vaimsuse teemalisi artikleid ja võtsin selle kui elufilosoofia oma südamesse vastu, st reaalselt elasin selle järgi.
Kuid new age on täielik saatana pettus, "lõks".
Psühholoogiaalane haridus ja minu mõtetes loodud seos positiivse mõtlemisega oli minu puhul samuti väga hea eeldus new age "konksu" alla neelamiseks.
Ajapikku olin hakanud enda üle ütlema igasugu asju - "olen edukas, saan kõigega hakkama" jne. See oli sisuliselt loits.
Ka suhtlesin mitu aastat taro kaartidega ennustajaga kirjalikul teel. Kuna new age oli mu südant juba paadutanud, mõtlesin nõiaga suhtluse enesele legaalseks - otsustasin mõelda, et tegu on n-ö "kõrge tundlikkusega" inimesega. Et "osad inimesed lihtsalt ongi tundlikumad kui teised".
Tasub märkida, et rahalised tehingud nõiduse esindajatega seovad meid vägagi konkreetselt saatanaga, me astume temaga sel kombel otseselt lepingusse.

Kõigele lisaks olid mul kodus mitmed neetud esemed, sh surnumärkidega ja saatana pildiga suveniirmõõk, mis oli ostetud aastal 2017 Stockholmi Vikingite teema suveniirpoest. 
Need märgid sellel mõõgal olid tibatillukesed ja vaevumärgatavad, seetõttu polnud neid seda suveniiri ostes sugugi näha.
Veel oli mu kodus ülikooliajast pärit filosoofiaõpik nimega "Eetika", mis muuhulgas deklareeris, et "olendit nimega Jumal ei saa olla olemas" ja veel mitmeid asju, ning muidugi ka juba mainitud "Onu Internet ja nutikaigas" lasteraamat.

Aga Jumala Sõna ütleb meile selgelt:
“Nende jumalakujud põletage tules; ära himusta hõbedat ja kulda nende pealt ja ära võta seda enesele, et sind sellega ei võrgutataks, sest see on jäledus Issandale, su Jumalale! Ära vii niisugust jäledust oma kotta, et sinagi ei saaks neetuks nagu see; sa pead seda ülimalt põlgama ja jälestama, sest see on neetud asi!” (5 Mos 7:25-26, Piibel)

Olles märtsis 2020 väga keerulises olukorras, ütlesin ma nimelt häälega välja: "Enam hullemaks minna ei saa".
Paari päeva pärast algaski sidumine.
Mäletan selgelt, et see oli koroona ja "lockdown"-i aeg, väljas oli kaunis varakevad. 
Lootsin kangesti, et suveks saan vabaks, pöördudes koheselt oma toonase koguduse pastorite poole. Kuid ei olnud tookord palvetest abi.
Meie sõnad saavad olla kas õnnistuseks või needuseks. Julgustan kõiki lugema Derek Prince raamatut "Õnnistus või needus - vali ise".
“Surm ja elu on keele võimuses, ja kes seda armastab, saab süüa selle vilja.” (Õp 18:21, Piibel)

Tahan aga panna teile kõigile südamele, et nii Taevas kui Põrgu on ülimalt reaalsed. 
Saatan ehk kurat on Jumala Sõna alusel koguni selle maailma vürst, kelle ainus missioon siin maailmas on varastada, tappa ja hävitada.
Mina sain need viis aastat kogeda põrgut kõigest maa peal, kuid reaalne põrgu on ilma kahtlusteta kirjeldamatult ja kordades kohutavam!
Muide, palju on neid, kellele on Jeesus põrgut näidanud, näiteks kliinilise surma ajal. 
Neist kogemustest on kirjutatud palju raamatuid, nagu näiteks David Pawsoni "Teekond põrgusse" ja Mary Kathryn Baxteri "Jumalik ilmutus põrgust. Aeg on lõppemas."
Jumal andis Mary K. Baxterile neljakümne päeva jooksul nägemusi põrgust ning tegi talle ülesandeks öelda inimestele, et nad valiksid ELU.
Raamat räägib põrgu olemusest ning olendeist kõrvutatult taeva auhiilgusega ning meenutab igaühele vajadust elada läbi vaimulik uussünd.

HOIATUSED:
• Inimesed, ärge mängige patuga! Ärge astuge saatanaga "ühte paati"!
• Ärge istuge pilkajate killas! (Psalm 1:1, Piibel).
• Kartke Jumalat - Ta ei lase ennast pilgata!
“Ärge eksige: Jumal ei lase ennast pilgata, sest mida inimene iganes külvab, seda ta ka lõikab.” (Gl 6:7, Piibel)
• Ärge lubage oma koju/oma territooriumile neetud/nõiduslikke esemeid!
“Ära vii niisugust jäledust oma kotta, et sinagi ei saaks neetuks nagu see; sa pead seda ülimalt põlgama ja jälestama, sest see on neetud asi!” (5 Mos 7:26, Piibel)
• New age ehk uusvaimsuse põhimotiiv on eksitada inimest ning takistada teda jõudmast tõelise, elava Jumalani! Hoiduge sellest!
• Ka tuleks jälgida, millist muusikat me kuulame, sest ka sellel on mõju meie meele üle ning ka sedakaudu saame end avada pimeduse jõududele.
• Samuti soovitan hoiduda joogast - seda tehes avate samuti vabatahtlikult "uksed" vaimsesse maailma ja lubate pimedusel tungida teie ellu. Jooga pole kaugeltki mitte "pelgalt venitusharjutused"!
Tasub teadvustamist, et isegi kui vahetult peale joogatundi ei kogeta midagi erilist, siis ei tähenda see, et see meid vaimselt ei mõjutaks.
“Jah, Jumala viha ilmub taevast inimeste igasuguse jumalakartmatuse ja ülekohtu vastu, nende vastu, kes tõde hoiavad ülekohtu kammitsais.” (Rm 1:18, Piibel)

Aga HEA UUDIS ON, et Jumal armastab meid ja ootab meid tagasi enda juurde, olles andnud meie patu eest lunaks oma ainusündinud Poja.
“Kui me oma patud tunnistame, on tema ustav ja õige, nõnda et ta annab andeks meie patud ja puhastab meid kogu ülekohtust.” (1 Joh 1:9, Piibel)
“Ma ütlen teile, nõnda on taevas ühe meeltparandanud patuse pärast rohkem rõõmu kui üheksakümne üheksa õige pärast, kellele ei ole vaja meeleparandust.” (Lk 15:7, Piibel)
“Tulge minu juurde kõik, kes olete vaevatud ja koormatud, ja mina annan teile hingamise!” (Mt 11:28, Piibel)
“Kiida, mu hing, Issandat, ja ära unusta ainsatki tema heategu!” (Ps 103:2, Piibel)

Issanda abiga olen langetanud ka kaalu 50 kg 12 kuuga, muutes radikaalselt toitumist ja liikudes taas regulaarselt väljas, sest viie aasta vältel oli pea olematust liikumisest tekkinud meeletu ülekaal (134,5 kg) ning lümfodeem (tursed jalgadel), kogesin sagedasti valu jalgades ning liikuda oli raske.
Jeesus on ühe aastaga tervendanud mind kõigest sellest, andes ka suure tahtejõu teha taas trenni ja jälgida oma toitumist. 
Enne seda sidumist olin olnud üsna liikuv ning jalgratas oli mu pea igapäevane liikumisvahend, armastasin ka rattamatkamist. 
Tänu Jumalale saan tänavu kevadest taas sõita ka rattaga.

Hommikul ärgates tänan nüüd esimese asjana Jeesust, et Ta on mind välja tõmmanud maapealsest põrgust ja "õuduste august ja paksust porist", nagu ütleb Piibel.
Tänan Teda uue päeva eest, Elu eest, kodu ja pere eest, toidu eest, kõige eest. Räägin Temaga kõigest ja jagan Temaga kõike.

Jään igavesti tänulikuks kõigile, kes mu eest ustavalt palvetasid ja olid need aastad mu kõrval.
Kuid kõige rohkem pean ma tänama oma ema, kes oli mulle toeks kõigi nende viie aasta vältel!

Issand valitseb!
Jumala rahu soovides
Kairi`
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
      isPreOrder: true,
      preOrderNote: 'Valmimisel',
      releaseDate: 'Valmimisel'
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
      isPreOrder: true,
      preOrderNote: 'Valmimisel',
      releaseDate: 'Valmimisel'
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
      preOrderNote: 'Valmimisel',
      releaseDate: 'Valmimisel'
    }
  ],

  // Support / Tule toetajaks
  support: {
    title: 'Tule toetajaks!',
    subtitle: 'Aita levitada Valgust üle kogu Eestimaa',
    description: 'Kirjastus Saagu Valgus annab välja evangeelseid materjale ja elumuutvaid tunnistusi. Sinu toetus aitab trükkida uusi infomaterjale, postitada kirjandust ning viia tõe sõnumit nendeni, kes seda kõige enam vajavad.',
    recipientName: 'Kairi Oja',
    iban: 'EE537700771000431636',
    bankName: 'LHV Pank',
    swift: 'LHVBEE22',
    reference: 'Annetus / Vaimuliku töö toetus',
    explanation: 'Lehe ja vaimuliku töö toetus',
    paypalEmail: 'Kairioja777@proton.me',
    paypalNote: 'If this website has been a blessing to You, You can donate here:',
    bookSalesNote: 'Raamatute müük ja trükiste tellimine toimub Saagu Valgus OÜ kaudu.',
    supportGoals: [
      'Evangeelsete materjalide ja voldikute trükkimine ning levitamine üle Eesti',
      'Uute vaimulike raamatute ja tunnistuste väljaandmine',
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

export const INITIAL_PUBLICATIONS: PublicationItem[] = [];

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

