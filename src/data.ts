import { SiteContent } from './types';

export const INITIAL_SITE_CONTENT: SiteContent = {
  brandName: 'Kirjastus Saagu Valgus',
  brandTagline: 'Vaimuliku kirjanduse, elumuutvate tunnistuste ja evangeelsete trükiste kirjastamine Eestis.',
  contactEmail: 'info@saaguvalgus.eu',
  heroBadge: 'Saagu Valgus – Tõde, mis teeb vabaks',
  heroTitle: 'Valgus või',
  heroHighlight: 'pimedus?',
  heroDescription: 'Elame maailmas, kus pakutakse sadu vaimseid teid ja «isiklikke tõdesid». Mis on tegelik tõde? Kuidas leida elav rahu, vabaneda hirmudest ning saada kindlus igavesest elust?',
  
  // PRIMARY BIBLE SCRIPTURE REQUESTED BY USER
  primaryVerse: {
    ref: 'Joeli 3:5',
    text: 'Ja sünnib, et igaüks, kes hüüab appi Issanda nime, pääseb.',
    theme: 'Peamine päästetõotus',
    isPrimary: true
  },

  // The 3 background Bible verses requested by user
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

  // THE 3 BIG CENTRAL HOOK QUESTIONS REQUESTED BY USER (SUUREMALT JA KESKSEL KOHAL)
  centralQuestions: [
    {
      id: 'noidade-selgeltnagijate-vagi',
      number: 1,
      question: 'Kas oled mõelnud, kust nõidade, selgeltnägijate ja tervendajate vägi tuleb?',
      summary: 'Tänapäeval pöörduvad paljud hädas, haiguses või tulevikuhirmus selgeltnägijate, lausujate ja tervendajate poole, lootes leida abi «valgest maagiast» või «looduslikust energiast». Mis on selle väe tegelik allikas?',
      tractQuote: '«Kas oled mõelnud, kust nõidade, selgeltnägijate ja tervendajate vägi tuleb? Vaimumaailmas pole erapooletut ega neutraalset vaheala – vägi, mis ei tule elavalt Jumalalt, pärineb pimeduse riigist, isegi kui see on maskeeritud tervendamiseks ja valguseks.»',
      biblicalAnswer: 'Piibel räägib kompromissitult kahest vaimsest kuningriigist: Jumala valguse riigist ja saatana pimeduse riigist. Kolmandat, «erapooletut» või «süütut» vaimset jõudu ei eksisteeri. Piibel hoiatab, et saatan suudab moondada ennast valguse ingliks (2Kr 11:14). Deemonlikud jõud võivad pakkuda ajutist petlikku sümptomite leevenemist või infot tuleviku kohta, kuid selle hind on alati inimese hinge orjastamine, seletamatud hirmuhood, depressioon, unehäired ja eraldatus Loojast. Tõeline ja puhas tervenemine ning hingerahu pärineb ainult Jeesuselt Kristuselt, kes maksis ristil meie eest.',
      bibleVerses: [
        {
          ref: '2. Kuningate 17:17',
          text: 'Ja nad lasksid oma poegi ja tütreid tulest läbi käia; nad küsitlesid ennustajaid ja toimetasid nõidust; nad müüsid endid kurja tegema Issanda silmis, vihastuseks temale.'
        },
        {
          ref: '5. Moosese 18:10-12',
          text: 'Ärgu leidugu sinu keskel kedagi... kes toimetab nõidust, märkide seletamist, lausumist ega tegele vaimudega... sest igaüks, kes seda teeb, on Issandale jäle.'
        },
        {
          ref: '1. Korintlastele 10:20-21',
          text: '...see, mida ohverdatakse, ohverdatakse kurjadele vaimudele, mitte Jumalale. Ma ei taha aga, et teie saaksite osalisteks kurjade vaimudega. Te ei või juua Issanda karikat ja kurjade vaimude karikat.'
        },
        {
          ref: 'Joeli 3:5',
          text: 'Ja sünnib, et igaüks, kes hüüab appi Issanda nime, pääseb.'
        }
      ],
      practicalSteps: [
        'Katkesta koheselt igasugune kontakt nõidade, selgeltnägijate, posijate ja bioenergeetikutega.',
        'Tunnista Jumalale oma teadmatus või eksimus ning palu Jeesuse nimel patud andeks.',
        'Palu Jeesuse vere kaitset oma ihule, mõtetele ja kodule ning hüüa appi Tema vabastavat nime.'
      ],
      category: 'hook'
    },
    {
      id: 'new-age-uusvaimsus',
      number: 2,
      question: 'Millist vaimsust new age ehk uusvaimsus eneses tegelikult kannab?',
      summary: 'Uusvaimsus meelitab positiivse energia, kõrgema sageduse, inglikaartide ja enesearengu sildi all. Kuid mis vaimne reaalsus peitub selle fassaadi taga?',
      tractQuote: '«Millist vaimsust new age ehk uusvaimsus eneses tegelikult kannab? See on iidne maduvale: "Te saate nagu jumalad". Panteism ja enesejumaldamine röövivad inimeselt tõelise Päästja ja viivad hinge hukatusse.»',
      biblicalAnswer: 'New age (uusvaimsus) esitleb ennast salliva, universaalse ja armastava maailmavaatena. Räägitakse «universumi energiast», «oma tõe loomisest» ja «inimese sisemisest jumalikkusest». Kuid Piibel paljastab, et see on seesama vale, mida madu rääkis Eedeni aias: «Te saate nagu jumalad» (1Ms 3:5). Kui inimene usub, et ta on ise jumal või et igaüks valib oma tõe, kaob arusaam patust ja vajadus Lunastaja järele. Ka reinkarnatsiooni ja karma õpetused on petlikud: Piibel kinnitab selgelt, et inimesele on antud üks kord elada ja surra ning pärast seda seisab ta Jumala kohtu ees (Hb 9:27). Ainult Jeesus Kristus on elav tee, tõde ja elu.',
      bibleVerses: [
        {
          ref: 'Johannese 14:6',
          text: 'Jeesus ütles talle: Mina olen tee ja tõde ja elu; ükski ei saa Isa juurde muidu kui minu kaudu.'
        },
        {
          ref: '1. Timoteosele 2:5',
          text: 'Sest üks on Jumal, üks on ka vahemees Jumala ja inimeste vahel: inimene Kristus Jeesus.'
        },
        {
          ref: 'Koloslastele 2:8',
          text: 'Vaadake, et keegi teid ei riisuks filosoofia ja tühja pettuse abil, mis vastavad inimeste pärimusele, maailma algainetele, ja mitte Kristusele.'
        },
        {
          ref: 'Heebrealastele 9:27',
          text: 'Ja otsekui inimestele on seatud üks kord surra, pärast seda on aga kohus.'
        }
      ],
      practicalSteps: [
        'Loobu enesejumaldamisest ja arusaamast, et universum või kosmiline energia asendab elavat Isikulist Loojat.',
        'Hülga inglikaardid, pendeldamine, kristallid, horoskoobid ja reinkarnatsiooni teooriad.',
        'Võta usus vastu Jeesus Kristus kui ainus tõeline Lunastaja ja Sinu elu Issand.'
      ],
      category: 'hook'
    },
    {
      id: 'jooga-tegelik-tahendus',
      number: 3,
      question: 'Mida jooga tegelikult tähendab?',
      summary: 'Kas jooga on pelgalt süütu võimlemine ja lihasvenitus või hoopis idamaise religiooni vaimulik praktika? Mis toimub vaimumaailmas jooga asanate ja meditatsiooni ajal?',
      tractQuote: '«Mida jooga tegelikult tähendab? Sõna jooga tuleneb sanskriti keelest ja tähendab "ikkestamist" või "ühinemist" – ühinemist hindu ebajumalate ja vaimumaailmaga. Jooga poose ja vaimsust ei saa teineteisest lahutada.»',
      biblicalAnswer: 'Läänemaailmas turustatakse joogat kui tervislikku võimlemist ja stressimaandajat. Kuid sanskriti tüvi «yuj» tähendab «ikkestama», «siduma» või «ühinema» – nimelt ühinema hinduistliku jumaluse või kosmilise vaimuga (Brahman). Iga traditsiooniline asana (poos) on välja töötatud kummardusena kindlale hindu ebajumalale. Kundalini energia äratamine (nn «maduenergia») ja tšakrate avamine ei ole füsioloogilised harjutused, vaid okultne uks vaimumaailma, mis toob kaasa psüühilist rahutust, hirmusid ja vaimset rõhumist. Kristlase ihu on Püha Vaimu tempel ja seda ei tohi rakendada ebajumalate kummardamisse. Füüsiliseks liikumiseks sobivad suurepäraselt neutraalsed venitused ja sport ilma idamaiste vaimsete rituaalideta.',
      bibleVerses: [
        {
          ref: '1. Korintlastele 6:19-20',
          text: 'Või kas te ei tea, et teie ihu on teis oleva Püha Vaimu tempel, kelle te olete saanud Jumalalt, ja et te ei ole iseenese päralt? Sest te olete kallilt ostetud. Austage siis Jumalat oma ihus!'
        },
        {
          ref: '2. Korintlastele 6:14-16',
          text: 'Mis on ühist õigusel ülekohutuga või mis on ühist valgusel pimedusega? Kuidas sobib Kristus Beliariga? Või kuidas sobib Jumala tempel kokku ebajumalatega?'
        },
        {
          ref: 'Matteuse 11:28',
          text: 'Tulge minu juurde kõik, kes olete vaevatud ja koormatud, ja mina annan teile hingamise!'
        }
      ],
      practicalSteps: [
        'Eralda füüsiline tervis okultsetest idamaistest praktikatest – tee neutraalseid venitusharjutusi ja sporti ilma jooga filosoofiata.',
        'Loobu mantrate kordamisest, tšakrate avamisest ja meele tühjendamise meditatsioonist.',
        'Täida oma meel ja süda Jumala Sõnaga ning otsi tõelist hingamist Kristuse juures.'
      ],
      category: 'hook'
    }
  ],

  // ADDITIONAL FOUNDATIONAL TRACT TOPICS (Igaühele oma jumal, Hea inimene, Hoia kodu puhas)
  tractQuestions: [
    {
      id: 'igauele-oma-jumal',
      number: 1,
      question: 'Igaühele «oma jumal» – tõde või vale?',
      summary: 'Tänapäeval väidetakse sageli, et iga tee viib samale mäetipule ja igaüks võib ise oma jumala valida. Kuid kas tõde saab olla korraga vasturääkiv?',
      tractQuote: '«Paljud usuvad, et igal inimesel on oma tõde. Kuid Jeesus ei öelnud, et Ta on üks paljudest alternatiividest. Ta ütles: Mina olen tee ja tõde ja elu; ükski ei saa Isa juurde muidu kui minu kaudu.»',
      biblicalAnswer: 'Jumal on loonud universumi ja inimese. Tõde ei ole subjektiivne tunne ega suvaline fantaasia, vaid elav Isik – Jeesus Kristus. Kui otsime Jumalat ausa ja alandliku südamega, ilmutab Ta end meile selgelt ja vabastab pettusest.',
      bibleVerses: [
        {
          ref: '1. Timoteosele 2:5',
          text: 'Sest üks on Jumal, üks on ka vahemees Jumala ja inimeste vahel: inimene Kristus Jeesus.'
        },
        {
          ref: 'Apostlite teod 4:12',
          text: 'Ja ei ole päästet üheski teises, sest taeva all ei ole antud inimestele ühtegi teist nime, kelle läbi meid päästetaks.'
        }
      ]
    },
    {
      id: 'hea-inimene-paasemine',
      number: 2,
      question: 'Aga ma olen ju hea inimene, kas siis sellest ei piisa, et pääseda (põrgust)?',
      summary: 'Enamik inimesi püüab elada moraalselt ega soovi teistele kurja. Kuid Jumala püha standardi ees oleme me kõik eksinud ja vajame lunastust.',
      tractQuote: '«Me võrdleme end sageli teistega ja mõtleme: ma pole kedagi tapnud, ma olen hea inimene. Kuid Jumala ees ei piisa heategudest patu katmiseks – vaja on andestust, meeleparandust ja uut sündi Kristuses.»',
      biblicalAnswer: 'Isegi parimad inimlikud teod ei suuda kustutada meie mineviku eksimusi ega patu vaimulikku võlga. Pääste ei ole tasu ega teene, vaid tasuta armuand Jumalalt, mille võtame vastu usus Jeesusesse, kes kandis meie karistuse ristil.',
      bibleVerses: [
        {
          ref: 'Roomlastele 3:23-24',
          text: 'Sest kõik on pattu teinud ja ilma jäänud Jumala kirkusest ning mõistetakse õigeks täiesti muidu, tema armust, lunastuse läbi, mis on Kristuses Jeesuses.'
        },
        {
          ref: 'Efeslastele 2:8-9',
          text: 'Sest teie olete armust päästetud usu kaudu - ja see pole teist enestest, see on Jumala and -, mitte tegudest, et ükski ei saaks kiidelda.'
        }
      ]
    },
    {
      id: 'hoia-kodu-puhas',
      number: 3,
      question: 'Hoia oma kodu puhas!',
      summary: 'Miks ei tohi kodus hoida esoteerilisi esemeid, tarokaarte, unenäopüüdjaid, talismane või ebajumalate kujukesi? Kuidas saavutada tõeline rahu oma kodus?',
      tractQuote: '«Hoia oma kodu puhas! Viska välja kõik nõiduse, ennustamise, horoskoopide, idamaade ebajumalate ja esoteerikaga seotud asjad. Need avavad uksi vaimulikule pimedusele, hirmudele ja rahutusele.»',
      biblicalAnswer: 'Piibel hoiatab vankumatult okultismi, kaardipanemise, vaimudega suhtlemise ja teadmameeste eest. Need ei ole süütud asjad, vaid tegelikud vaimsed sidemed pimeduse jõududega. Tõelise rahu toob Jeesuse veri, Tema kaitse ja Jumala Sõna kuulutamine oma elus.',
      bibleVerses: [
        {
          ref: '5. Moosese 18:10-12',
          text: 'Ärgu leidugu sinu keskel kedagi... kes toimetab nõidust, märkide seletamist, lausumist ega tegele vaimudega... sest igaüks, kes seda teeb, on Issandale jäle.'
        },
        {
          ref: 'Apostlite teod 19:19',
          text: 'Paljud neist, kes olid tegelnud nõiakunstiga, tõid kokku oma raamatud ja põletasid need kõigi nähes ära.'
        }
      ],
      practicalSteps: [
        'Vaata kriitiliselt üle oma kodu: esoteerilised raamatud, kaardid, talismanid, kristallid, kujukesed.',
        'Viska need asjad julgelt minema ja ütle lahti igasugusest okultistlikust praktikast.',
        'Palu Jeesuselt andestust ja kutsu Tema Püha Vaim ning inglite kaitse oma eluasemele.'
      ]
    }
  ],

  cleanlinessTitle: 'Hoia oma kodu puhas!',
  cleanlinessSubtitle: 'Vaimulik kaitse & vabanemine',
  cleanlinessDescription: 'Esoteerilised sümbolid, tarokaardid, unenäopüüdjad, horoskoopide trükised või idamaade ebajumalate kujukesed ei ole süütud sisekujunduselemendid. Need toovad kodudesse seletamatut rahutust, hirmuunenägusid ja vaimulikku rõhumist. Jeesus Kristus pakub täielikku vabadust ja kaitset kõigile, kes Tema poole pöörduvad.',
  cleanlinessSteps: [
    { title: '1. Tuvasta ja viska välja', desc: 'Otsi üles kõik esoteerilised esemed, kaardid, kristallid, amuletid ja kujukesed ning viska need prügikasti.' },
    { title: '2. Tunnista ja loobu', desc: 'Ütle kuuldavalt Jeesusele, et palud andestust okultismiga tegelemise eest ja loobud igasugusest sidemest pimedusega.' },
    { title: '3. Õnnista oma kodu', desc: 'Palu, et Jeesuse veri puhastaks sinu elamise ja et Jumala rahu ning Püha Vaim täidaksid iga ruumi.' }
  ],

  // Real life testimonials / stories with YouTube video embeds
  testimonials: [
    {
      id: 'vabanemine-esoteerikast',
      title: 'Vabanemine esoteerika ja okultismi köidikutest',
      person: 'Tõestisündinud vabanemislugu',
      type: 'vabanemine',
      summary: 'Aastaid kestnud otsingud new age\'is, joogas ja selgeltnägemises tõid lõpuks hirmu ja unetuse. Kuidas Jeesus tõi ühe palvega täieliku vabanemise ja hingerahu.',
      fullStory: 'Olin aastaid veendunud, et kividel, kaartidel ja idamaade tehnikatel on positiivne energia. Aja jooksul asendus esialgne huvi seletamatute hirmude, öiste paanikahoogude ja vaimse väsimusega. Kui mulle ulatati Uus Testament ja soovitati paluda Jeesuse nime, tundsin esimest korda tõelist, sooja ja vabastavat rahu. Viskasin kõik esoteerilised asjad välja ja sellest päevast peale on minu kodus ja südames rahu.',
      youtubeId: '',
      youtubeUrl: ''
    },
    {
      id: 'ime-ja-tervenemine',
      title: 'Tervenemine ja meeleheite lõpp',
      person: 'Isiklik tunnistus',
      type: 'tervenemine',
      summary: 'Arstide lootusetu diagnoos ja sügav depressioon asendusid uue elujõuga pärast eestpalvet ja Jeesuse vastuvõtmist.',
      fullStory: 'Kui tervis ja tulevik näisid täielikult kokku varisevat, leidsin tee kristliku kirjanduse ja palveni. Jeesus tervendas mitte ainult minu füüsilise keha, vaid taastas minu usalduse ja elumõtte.',
      youtubeId: '',
      youtubeUrl: ''
    }
  ],

  // Publisher story & books with purchasing & contact
  publisherStoryTitle: 'Kirjastuse Saagu Valgus sünnilugu',
  publisherStoryText: 'Kirjastus Saagu Valgus sai alguse sügavast igatsusest tuua Eesti inimesteni selget, moonutamata ja elumuutvat vaimulikku kirjandust. Meie missiooniks on kirjastada raamatuid ja tasuta evangeelseid trükiseid, mis avavad silmi, aitavad vabaneda pimeduse pettustest ning juhivad inimesi elavasse suhtesse Jeesuse Kristusega.',

  books: [
    {
      id: 'laps-ja-jumal',
      title: 'Laps ja Jumal',
      author: 'Kirjastus Saagu Valgus',
      category: 'Perekond ja vaimulik kasvamine',
      price: 15,
      description: 'Südamlik ja praktiline raamat, mis aitab mõista laste vaimulikku tundlikkust ja seda, kuidas juhatada järgmist põlvkonda armastuse ja tõe vaimus elava Jumala tundmisele.',
      highlights: [
        'Kuidas rääkida lastele Jumalast ja usust loomulikult ning siiralt',
        'Praktilised näited ja tõestisündinud lood perede usuteelt',
        'Lapse hinge ja vaimse puhtuse hoidmine tänapäeva meediamaailmas'
      ],
      isFeatured: true
    },
    {
      id: 'ma-olin-saatana-vang',
      title: 'Ma olin saatana vang',
      author: 'Kirjastus Saagu Valgus',
      category: 'Tõestisündinud vabanemislugu',
      price: 16,
      description: 'Vapustav ja tõestisündinud tunnistus inimesest, kes oli sügaval okultismi, nõiduse ja pimeduse köidikutes, kuid kelle Jeesus Kristus imeliselt ja täielikult vabastas.',
      highlights: [
        'Aus pilguheit esoteerika ja okultismi tegelikule vaimsele hinnale',
        'Jeesuse Kristuse risti ja nime ülim meelevald kurjuse üle',
        'Teejuht täieliku vabanemise, andestuse ja uue alguseni'
      ],
      isFeatured: true
    }
  ],

  // Support / Tule toetajaks
  support: {
    title: 'Tule toetajaks!',
    subtitle: 'Aita levitada Valgust üle kogu Eestimaa',
    description: 'Kirjastus Saagu Valgus annab välja tasuta evangeelseid trükiseid ja elumuutvaid raamatuid. Sinu toetus aitab trükkida uusi infomaterjale, postitada raamatuid ning viia tõe sõnumit nendeni, kes seda kõige enam vajavad.',
    recipientName: 'Kirjastus Saagu Valgus',
    iban: 'EE123456789012345678', // Editable in admin
    bankName: 'Swedbank / LHV Pank',
    swift: 'HABALV22',
    reference: 'Annetus kirjastustööks',
    explanation: 'Kirjastuse toetus / Trükiste väljaandmine',
    supportGoals: [
      'Tasuta evangeelsete trükiste trükkimine ja postitamine üle Eesti',
      'Uute vaimulike raamatute ja tunnistuste tõlkimine ning kirjastamine',
      'Vaimuliku toe ja infomaterjalide kättesaadavaks tegemine otsijatele'
    ]
  },

  salvationPrayerTitle: 'Päästepalve',
  salvationPrayerSubtitle: 'Kuidas alustada uut elu koos Jumalaga?',
  salvationPrayerIntro: 'Kui sa soovid saada andeks oma patud, leida sügavat rahu ja kindlust igavesest elust, võid palvetada selle lihtsa ja siira palve valjusti oma südamega:',
  salvationPrayerText: `«Kallis Issand Jeesus!

Mina tulen täna Sinu juurde. Ma tunnistan, et olen patune inimene ja olen teinud oma elus vigu. Ma palun südamest andeks kõik oma patud.

Ma usun, et Sina surid ristil minu eest ja tõusid surnuist üles. Ma võtan Sind täna vastu oma isiklikuks Päästjaks ja Issandaks.

Puhasta mind, täida mind oma Püha Vaimuga ja kingi mulle igavene elu. 

Aamen!»`,
  salvationPrayerNextSteps: [
    {
      title: '1. Loe Piiblit iga päev',
      desc: 'Alusta näiteks Johannese evangeeliumist, et tundma õppida Jeesuse elu, õpetust ja Tema armastust.'
    },
    {
      title: '2. Räägi Jumalaga (palveta)',
      desc: 'Palve on siiras vestlus oma Loojaga – usalda Talle oma mured, soovid ja tänu.'
    },
    {
      title: '3. Leia elav kogudus',
      desc: 'Otsi kristlik kogudus, kus õpetatakse Piibli tõde ja kus saad usus kasvada koos teiste vendade-õdedega.'
    }
  ],

  // Lord's Prayer (Meie Isa palve)
  lordPrayer: {
    title: 'Meie Isa palve',
    subtitle: 'Palve, mida õpetas Jeesus Kristus',
    intro: 'Meie Isa palve (Matteuse 6:9–13) on universaalne ja võimas palve, mis seab esikohale Jumala tahte ja Tema kuningriigi ning palub igapäevast leiba, andestust ja kaitset kurja eest.',
    text: `Meie Isa, kes Sa oled taevas!
Pühitsetud olgu Sinu nimi.
Sinu riik tulgu,
Sinu tahtmine sündigu
nagu taevas, nõnda ka maa peal.
Meie igapäevane leib anna meile tänapäev.
Ja anna meile andeks meie võlad,
nagu meiegi andeks anname oma võlglastele.
Ja ära saada meid kiusatusse,
vaid päästa meid ära kurjast.
Sest Sinu päralt on riik ja vägi ja au igavesti.
Aamen.`,
    ref: 'Matteuse 6:9-13'
  }
};
